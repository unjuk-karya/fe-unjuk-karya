import PostSource from '../../../data/post-source.js';
import './post-detail-comment.js';
import './post-detail-actions.js';

class PostDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._post = null;
    this._comments = [];
    this.isCommentVisible = false;
    this.currentPage = 1;
    this.totalPages = 1;
  }

  set postId(id) {
    this._postId = id;
    this.fetchAndRender();
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

  async handleLike() {
    try {
      this._post.isLiked = !this._post.isLiked;
      this._post.likesCount += this._post.isLiked ? 1 : -1;
      const postActions = this.shadowRoot.querySelector('post-detail-actions');
      postActions.updateLikeStatus(this._post.isLiked, this._post.likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async handleSave() {
    try {
      this._post.isSaved = !this._post.isSaved;
      const postActions = this.shadowRoot.querySelector('post-detail-actions');
      postActions.updateSaveStatus(this._post.isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }

  async handleFollow() {
    try {
      this._post.isFollowing = !this._post.isFollowing;
      this.updateFollowStatus();
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
    try {
      const user = JSON.parse(localStorage.getItem('user')) ?? {};
      const newComment = {
        id: Date.now(),
        content: commentText,
        createdAt: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar
        },
        likesCount: 0,
        isLiked: false
      };
      this._comments.unshift(newComment);
      this.renderComments();

      const commentsSection = this.shadowRoot.querySelector('.comments-section');
      commentsSection.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error posting comment:', error);
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
          border-radius: 4px;
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
        }
  
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
  
        .username {
          font-weight: 600;
          font-size: 14px;
          color: #262626;
        }
  
        .follow-button {
          margin-left: auto;
          padding: 5px 10px;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid #0095f6;
          background-color: #0095f6;
          color: #fff;
          border-radius: 4px;
        }
  
        .follow-button.following {
          background-color: #fff;
          color: #0095f6;
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
  
        .post-button {
          border: none;
          background: none;
          color: #0095f6;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
          opacity: 0.3;
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
          color: #0095f6;
        }
  
        .load-more-icon {
          background-color: #fff;
          color: #0095f6;
          border-radius: 50%;
          padding:5px 6px;
          border: 2px solid #0095f6;
        }
  
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #0095f6;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
  
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
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
              <span class="username">${this._post.user.username}</span>
              ${!this._post.isMyself ? `
                <button class="follow-button ${this._post.isFollowing ? 'following' : ''}" id="follow-button">
                  ${this._post.isFollowing ? 'Mengikuti' : 'Ikuti'}
                </button>
              ` : ''}
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
    // Close button
    this.shadowRoot.querySelector('.close-button').addEventListener('click', () => {
      this.remove();
    });

    // Modal overlay click
    this.shadowRoot.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.remove();
      }
    });

    // Follow button
    if (!this._post.isMyself) {
      const followButton = this.shadowRoot.querySelector('#follow-button');
      followButton.addEventListener('click', () => {
        this.handleFollow();
      });
    }

    // Post actions events
    const postActions = this.shadowRoot.querySelector('post-detail-actions');
    postActions.addEventListener('like-click', () => {
      this.handleLike();
    });

    postActions.addEventListener('save-click', () => {
      this.handleSave();
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

    // Comment form events
    const textarea = this.shadowRoot.querySelector('.comment-input');
    const postButton = this.shadowRoot.querySelector('.add-comment .post-button');

    if (textarea && postButton) {
      postButton.addEventListener('click', () => {
        const commentText = textarea.value.trim();
        if (commentText) {
          this.handleComment(commentText);
          textarea.value = '';
          this.isCommentVisible = false;
          textarea.parentElement.style.display = 'none';
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