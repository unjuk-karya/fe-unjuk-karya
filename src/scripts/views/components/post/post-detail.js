import PostSource from '../../../data/post-source.js';
import ProfileSource from '../../../data/profile-source.js';
import Swal from 'sweetalert2';

class PostDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._post = null;
    this._comments = [];
    this.isCommentVisible = false;
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;
  }

  set postId(id) {
    this._postId = id;
    this.fetchAndRender();
  }

  async handleDelete() {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Postingan yang dihapus tidak dapat dikembalikan',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Menghapus postingan...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await PostSource.deletePost(this._postId);

        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Postingan berhasil dihapus',
          timer: 1500
        }).then(() => {
          window.location.reload();
        });

      } catch (error) {
        console.error('Error deleting post:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Gagal menghapus postingan'
        });
      }
    }
  }

  // TODO Edit Post
  async handleEdit() {
    try {
      window.location.href = `#/edit-post/${this._postId}`;
    } catch (error) {
      console.error('Error editing post:', error);
    }
  }

  async fetchAndRender() {
    try {
      const [postData, commentsData] = await Promise.all([
        PostSource.getPostById(this._postId),
        PostSource.getCommentsByPostId(this._postId, this.currentPage)
      ]);
      this._post = postData;
      this._comments = commentsData.comments;
      this.totalPages = commentsData.pagination.totalPages;
      this.render();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async showLikesModal() {
    const postDetailLike = document.createElement('user-list-modal');
    postDetailLike.setAttribute('post-id', this._postId);
    postDetailLike.setType('likes');
    document.body.appendChild(postDetailLike);
  }

  async handleLike() {
    try {
      this._post.isLiked = !this._post.isLiked;
      this._post.likesCount += this._post.isLiked ? 1 : -1;
      const postActions = this.shadowRoot.querySelector('post-detail-actions');
      postActions.updateLikeStatus(this._post.isLiked, this._post.likesCount);
      await PostSource.likePost(this._postId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async handleFollow() {
    try {
      this._post.isFollowing = !this._post.isFollowing;
      this.updateFollowStatus();
      await ProfileSource.followUser(this._post.user.id);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  }

  updateFollowStatus() {
    const followButton = this.shadowRoot.querySelector('#follow-button');
    if (this._post.isFollowing) {
      followButton.textContent = 'Mengikuti';
      followButton.classList.add('following');
    } else {
      followButton.textContent = 'Ikuti';
      followButton.classList.remove('following');
    }
  }

  renderComments() {
    const commentsContainer = this.shadowRoot.querySelector('#comments-container');
    commentsContainer.innerHTML = '';

    this._comments.forEach((commentData) => {
      const commentElement = document.createElement('post-detail-comment');
      commentElement.data = {
        ...commentData,
        postId: this._postId
      };

      commentElement.addEventListener('comment-deleted', (event) => {
        const { commentId } = event.detail;
        this._comments = this._comments.filter((comment) => comment.id !== commentId);
        this.renderComments();
      });

      commentsContainer.append(commentElement);
    });

    if (this.currentPage < this.totalPages) {
      const loadMoreButton = document.createElement('button');
      loadMoreButton.innerHTML = '<i class="fas fa-plus load-more-icon"></i>';
      loadMoreButton.classList.add('load-more-button');
      loadMoreButton.addEventListener('click', () => this.loadMoreComments());
      commentsContainer.append(loadMoreButton);
    }
  }

  async handleComment(commentText) {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      const addComment = this.shadowRoot.querySelector('.add-comment');

      const loadingIndicator = document.createElement('div');
      loadingIndicator.classList.add('comment-loading-indicator');
      loadingIndicator.innerHTML = `
        <style>
          .comment-loading-indicator {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
          }
          .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #e9ecef;
            border-top: 2px solid #1D77E6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="loading-spinner"></div>
      `;

      addComment.style.position = 'relative';
      addComment.appendChild(loadingIndicator);

      const newComment = await PostSource.postComment(this._postId, commentText);

      loadingIndicator.remove();
      addComment.style.position = '';

      const user = JSON.parse(localStorage.getItem('user')) ?? {};
      this._comments.unshift({
        ...newComment,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar
        },
        isMyself: true,
        isLiked: false,
        likesCount: 0
      });

      this.renderComments();

      const commentInput = this.shadowRoot.querySelector('.comment-input');
      commentInput.value = '';
      this.isCommentVisible = false;
      addComment.style.display = 'none';

      const commentsSection = this.shadowRoot.querySelector('.comments-section');
      commentsSection.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error posting comment:', error);
      const loadingIndicator = this.shadowRoot.querySelector('.comment-loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.remove();
        this.shadowRoot.querySelector('.add-comment').style.position = '';
      }
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreComments() {
    try {
      const loadMoreButton = this.shadowRoot.querySelector('.load-more-button');
      if (loadMoreButton) {
        loadMoreButton.innerHTML = '<div class="spinner"></div>';
        loadMoreButton.disabled = true;
      }

      this.currentPage += 1;
      const commentsData = await PostSource.getCommentsByPostId(this._postId, this.currentPage);
      this._comments = [...this._comments, ...commentsData.comments];
      this.renderComments();
    } catch (error) {
      console.error('Error loading more comments:', error);
    }
  }

  render() {
    if (!this._post) return;

    this.shadowRoot.innerHTML = `
<style>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: #fff;
    width: 100%;
    max-width: 1000px;
    height: 90vh;
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }

  .post-image-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: black;
    min-width: 0;
  }

  .post-image {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }

  .post-sidebar {
    width: 440px;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-left: 1px solid #efefef;
  }

  .post-header {
    padding: 14px 16px;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .username {
    font-weight: 600;
    color: #000;
    margin-right: 4px;
    text-decoration: none;
    font-size: 14px;
  }

  .username:hover {
    text-decoration: underline;
  }

  .follow-button {
    margin-left: auto;
    padding: 6px 16px;
    font-size: 14px;
    cursor: pointer;
    background: #5d87ff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #fff;
    border-radius: 4px;
    border: none;
    transition: all 0.2s ease;
  }

  .follow-button:hover {
    background-color: #4f73d9;
  }

  .follow-button.following {
    background-color: #fff;
    color: #1D77E6;
  }

  .follow-button.following:hover {
    background-color: #f8f9fa;
  }

.close-button {
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.1);
}
  
  .more-options-button {
    margin-left: auto;
    background: none;
    border: none;
    font-size: 16px;
    color: #262626;
    cursor: pointer;
    padding: 8px;
    transition: all 0.2s ease;
  }

  .more-options-button:hover {
    opacity: 0.7;
  }

  .options-menu {
    position: absolute;
    top: 100%;
    right: 12px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.12);
    z-index: 10;
    min-width: 150px;
    overflow: hidden;
  }

  .delete-button, .edit-button {
    width: 100%;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    font-family: inherit;
    transition: background-color 0.2s ease;
  }

  .delete-button {
    color: #ed4956;
  }

  .edit-button {
    color: #262626;
  }

  .delete-button:hover, .edit-button:hover {
    background: #f8f9fa;
  }

  .post-content-section {
    padding: 16px;
    border-bottom: 1px solid #efefef;
  }

  .post-header-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .post-title {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    word-break: break-word;
  }

  .post-content {
    font-size: 14px;
    line-height: 1.5;
    color: #262626;
    word-break: break-word;
  }

  .comments-section {
    flex: 1;
    overflow-y: auto;
    border-bottom: 1px solid #efefef;
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;
  }

  .comments-section::-webkit-scrollbar {
    width: 6px;
  }

  .comments-section::-webkit-scrollbar-track {
    background: transparent;
  }

  .comments-section::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;
  }

  .add-comment {
    padding: 12px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-top: 1px solid #efefef;
    position: relative;
  }

  .comment-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    resize: none;
    line-height: 1.4;
    max-height: 80px;
    overflow-y: auto;
    font-family: inherit;
    padding: 8px 0;
  }

  .comment-input:disabled {
    background: #fafafa;
    color: #8e8e8e;
  }

  .post-button {
    border: none;
    background: none;
    color: #1D77E6;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 0;
    opacity: 0.3;
    transition: opacity 0.2s ease;
  }

  .post-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .comment-input:not(:placeholder-shown) + .post-button {
    opacity: 1;
  }

  .load-more-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 12px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 20px;
    color: #1D77E6;
    transition: opacity 0.2s ease;
  }

  .load-more-button:hover {
    opacity: 0.7;
  }

  .load-more-icon {
    background-color: #fff;
    color: #1D77E6;
    border-radius: 50%;
    padding: 5px 6px;
    border: 2px solid #1D77E6;
    transition: transform 0.2s ease;
  }

  .load-more-button:hover .load-more-icon {
    transform: scale(1.1);
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #1D77E6;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .comment-loading-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e9ecef;
    border-top: 2px solid #1D77E6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Responsive Styles */
  @media (max-width: 1024px) {
    .modal-content {
      max-width: 90vw;
      max-height: 80vh;
    }
    
    .post-sidebar {
      width: 380px;
    }
  }

  @media (max-width: 768px) {
    .modal-overlay {
      padding: 16px;
    }

    .modal-content {
      max-width: 95vw;
      max-height: 85vh;
      height: auto;
      flex-direction: column;
    }

    .post-image-container {
      height: 45vh;
      max-height: 400px;
    }

    .post-sidebar {
      width: 100%;
      height: auto;
      max-height: 40vh;
      border-left: none;
      border-top: 1px solid #efefef;
    }

    .post-image {
      max-height: 100%;
      width: 100%;
    }

    .comments-section {
      max-height: 30vh;
    }

  .close-button {
    top: 8px;
    right: 8px;
    font-size: 28px;
  }

    .action-button {
      padding: 12px 8px;
    }

    .post-button {
      padding: 8px 12px;
    }

    .load-more-button {
      padding: 15px;
    }
  }

  @media (max-width: 480px) {
    .modal-overlay {
      padding: 12px;
    }

    .modal-content {
      max-width: 100%;
      max-height: 90vh;
    }

    .post-image-container {
      height: 40vh;
      max-height: 350px;
    }

    .post-sidebar {
      max-height: 45vh;
    }

    .comments-section {
      max-height: 35vh;
    }

    .post-header {
      padding: 10px 12px;
    }

    .post-content-section {
      padding: 12px;
    }

    .add-comment {
      padding: 8px 12px;
    }

 .close-button {
    top: -4px;
    right: 2px;
    font-size: 26px;
  }

    .username,
    .post-content,
    .comment-input,
    .post-button {
      font-size: 13px;
    }

    .post-title {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) and (orientation: landscape) {
    .modal-content {
      flex-direction: row;
      max-height: 85vh;
    }

    .post-image-container {
      width: 50%;
      height: auto;
      max-height: 85vh;
    }

    .post-sidebar {
      width: 50%;
      max-height: 85vh;
      border-left: 1px solid #efefef;
      border-top: none;
    }

    .comments-section {
      max-height: calc(85vh - 180px);
    }
  }
</style>
  
      <div class="modal-overlay">
        <button class="close-button">&times;</button>
        <div class="modal-content">
          <div class="post-image-container">
            <img class="post-image" src="${this._post.image}" alt="">
          </div>
          <div class="post-sidebar">
            <div class="post-header">
              <img class="user-avatar" src="${this._post.user.avatar || 'https://via.placeholder.com/32'}" alt="">
              <a href="#/profile/${this._post.user.id}" class="username">${this._post.user.username}</a>
              ${this._post.isMyself ? `
                <button class="more-options-button">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
                <div class="options-menu" style="display: none;">
                  <button class="delete-button">
                    <i class="far fa-trash-alt"></i>
                    <span>Hapus</span>
                  </button>
                  <button class="edit-button">
                    <i class="far fa-edit"></i>
                    <span>Edit</span>
                  </button>
                </div>
              ` : `
              <button class="follow-button ${this._post.isFollowing ? 'following' : ''}" id="follow-button">
                  ${this._post.isFollowing ? 'Mengikuti' : 'Ikuti'}
                </button>
              `}
            </div>
  
            <div class="comments-section">
              <div class="post-content-section">
                <div class="post-header-info">
                  <div class="post-title">${this._post.title}</div>
                  <div class="post-content">${this._post.content}</div>
                </div>
              </div>
  
              <div id="comments-container"></div>
            </div>
  
            <post-detail-actions></post-detail-actions>
  
            <div class="add-comment" style="display: ${this.isCommentVisible ? 'flex' : 'none'}">
              <textarea class="comment-input" placeholder="Tambahkan komentar..." rows="1" maxlength="500"></textarea>
              <button class="post-button">Kirim</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const postActions = this.shadowRoot.querySelector('post-detail-actions');
    postActions.data = {
      isLiked: this._post.isLiked,
      likesCount: this._post.likesCount,
      createdAt: this._post.createdAt
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('.close-button').addEventListener('click', () => {
      this.remove();
    });

    this.shadowRoot.querySelector('.username').addEventListener('click', () => {
      this.remove();
    });

    this.shadowRoot.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.remove();
      }
    });

    if (this._post.isMyself) {
      const moreButton = this.shadowRoot.querySelector('.more-options-button');
      const optionsMenu = this.shadowRoot.querySelector('.options-menu');

      moreButton.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
      });

      const deleteButton = this.shadowRoot.querySelector('.delete-button');
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDelete();
      });

      // TODO Edit Post
      const editButton = this.shadowRoot.querySelector('.edit-button');
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleEdit();
        this.remove();
      });

      document.addEventListener('click', () => {
        optionsMenu.style.display = 'none';
      });
    } else if (!this._post.isMyself) {
      const followButton = this.shadowRoot.querySelector('#follow-button');
      followButton.addEventListener('click', () => {
        this.handleFollow();
      });
    }

    const postActions = this.shadowRoot.querySelector('post-detail-actions');
    postActions.addEventListener('like-click', () => {
      this.handleLike();
    });

    postActions.addEventListener('likes-click', () => {
      this.showLikesModal();
    });

    postActions.addEventListener('comment-click', () => {
      this.isCommentVisible = !this.isCommentVisible;
      this.render();
      this.renderComments();

      if (this.isCommentVisible) {
        setTimeout(() => {
          const textarea = this.shadowRoot.querySelector('.comment-input');
          if (textarea) textarea.focus();
        }, 0);
      }
    });

    const textarea = this.shadowRoot.querySelector('.comment-input');
    const postButton = this.shadowRoot.querySelector('.add-comment .post-button');

    if (textarea && postButton) {
      postButton.addEventListener('click', () => {
        const commentText = textarea.value.trim();
        if (commentText) {
          this.handleComment(commentText);
        }
      });

      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      });

      textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          postButton.click();
        }
      });
    }

    this.renderComments();
  }
}

customElements.define('post-detail', PostDetail);
