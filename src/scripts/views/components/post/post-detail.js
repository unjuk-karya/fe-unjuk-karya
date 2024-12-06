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
    try {
      const likesData = await PostSource.getPostLikes(this._postId);
      const postDetailLike = document.createElement('user-list-modal');
      postDetailLike.data = likesData;
      postDetailLike.setType('likes');
      document.body.appendChild(postDetailLike);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
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

  async handleSave() {
    try {
      this._post.isSaved = !this._post.isSaved;
      const postActions = this.shadowRoot.querySelector('post-detail-actions');
      postActions.updateSaveStatus(this._post.isSaved);
      await PostSource.savePost(this._postId);
    } catch (error) {
      console.error('Error toggling save:', error);
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
        }
  
        .modal-content {
          background: #fff;
          width: 100%;
          max-width: 1000px;
          height: 90vh;
          display: flex;
          border-radius: 10px;
          overflow: hidden;
        }
  
        .post-image-container {
          flex: 1;
          display: flex;
          align-items: center;
          background: black;
        }
  
        .post-image {
          width: 100%;
          height: auto;
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
        }

        .username:hover {
          text-decoration: underline;
        }
  
        .follow-button {
          margin-left: auto;
          padding: 5px 10px;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid #1D77E6;
          background-color: #1D77E6;
          color: #fff;
          border-radius: 4px;
        }
  
        follow-button:hover {
            background-color: #0056b3;
        }
        .follow-button.following {
          background-color: #fff;
          color: #1D77E6;
        }

        .follow-button.following:hover {
            background-color: #f8f9fa;
        }
        
        .more-options-button {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 16px;
          color: #262626;
          cursor: pointer;
          padding: 8px;
        }

        .options-menu {
          position: absolute;
          top: 80%;
          right: 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.12);
          z-index: 10;
        }

        .delete-button {
          width: 100%;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: none;
          color: #ed4956;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
        }

        .delete-button:hover {
          background: #fafafa;
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
          font-weight: bold;
          color: #262626;
        }
  
        .post-content {
          font-size: 14px;
          line-height: 1.5;
          color: #262626;
        }
  
        .comments-section {
          flex: 1;
          overflow-y: auto;
          border-bottom: 1px solid #efefef;
        }
  
        .add-comment {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid #efefef;
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
          padding: 0;
          opacity: 0.3;
        }
  
        .post-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
  
        .comment-input:not(:placeholder-shown) + .post-button {
          opacity: 1;
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
        }
  
        .load-more-button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 10px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 20px;
          color: #1D77E6;
        }
  
        .load-more-icon {
          background-color: #fff;
          color: #1D77E6;
          border-radius: 50%;
          padding:5px 6px;
          border: 2px solid #1D77E6;
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
              <textarea class="comment-input" placeholder="Tambahkan komentar..." rows="1"></textarea>
              <button class="post-button">Kirim</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const postActions = this.shadowRoot.querySelector('post-detail-actions');
    postActions.data = {
      isLiked: this._post.isLiked,
      isSaved: this._post.isSaved,
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

    postActions.addEventListener('save-click', () => {
      this.handleSave();
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