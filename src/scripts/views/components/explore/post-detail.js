import PostSource from '../../../data/post-source.js';
import './post-comment.js';
import { formatDate } from '../../../utils/formatter.js';

class PostDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._post = null;
    this._comments = [];
    this.isCommentVisible = false;
  }

  set postId(id) {
    this._postId = id;
    this.fetchAndRender();
  }

  async fetchAndRender() {
    try {
      const [postData, commentsData] = await Promise.all([
        PostSource.getPostById(this._postId),
        PostSource.getCommentsByPostId(this._postId)
      ]);
      this._post = postData;
      this._comments = commentsData;
      this.render();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  updateLikeStatus() {
    const likeButton = this.shadowRoot.querySelector('#like-button');
    const likesCountElement = this.shadowRoot.querySelector('.likes-count');

    likeButton.classList.toggle('liked', this._post.isLiked);
    likeButton.querySelector('i').className = `fa${this._post.isLiked ? 's' : 'r'} fa-heart`;
    likesCountElement.textContent = `${this._post.likesCount} likes`;
  }

  updateSaveStatus() {
    const saveButton = this.shadowRoot.querySelector('#save-button');
    saveButton.classList.toggle('saved', this._post.isSaved);
    saveButton.querySelector('i').className = `fa${this._post.isSaved ? 's' : 'r'} fa-bookmark`;
  }

  async handleLike() {
    try {
      this._post.isLiked = !this._post.isLiked;
      this._post.likesCount += this._post.isLiked ? 1 : -1;
      this.updateLikeStatus();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async handleSave() {
    try {
      this._post.isSaved = !this._post.isSaved;
      this.updateSaveStatus();
    } catch (error) {
      console.error('Error toggling save:', error);
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
        repliesCount: 0,
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
      const commentElement = document.createElement('post-comment');
      commentElement.data = commentData;
      commentsContainer.append(commentElement);
    });
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
        }

        .post-image {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .post-sidebar {
          width: 340px;
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

        .post-actions {
          padding: 8px 16px;
          display: flex;
          gap: 16px;
        }

        .action-button {
          background: none;
          border: none;
          padding: 8px 0;
          cursor: pointer;
          font-size: 24px;
          color: #262626;
        }

        .action-button.liked i {
          color: #ed4956;
          font-weight: 900;
        }

        .action-button.saved i {
          color: #0095f6;
          font-weight: 900;
        }

        .likes-count {
          padding: 0 16px 4px;
          font-weight: 600;
          font-size: 14px;
          color: #262626;
        }

        .post-date {
          padding: 0 16px 12px;
          font-size: 12px;
          color: #8e8e8e;
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
              ${!this._post.isMyself ? `<button class="follow-button ${this._post.isFollowing ? 'following' : ''}" id="follow-button">${this._post.isFollowing ? 'Mengikuti' : 'Ikuti'}</button>` : ''}
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

            <div class="post-actions">
              <button class="action-button ${this._post.isLiked ? 'liked' : ''}" id="like-button">
                <i class="fa${this._post.isLiked ? 's' : 'r'} fa-heart"></i>
              </button>
              <button class="action-button">
                <i class="far fa-comment"></i>
              </button>
              <button class="action-button ${this._post.isSaved ? 'saved' : ''}" id="save-button" style="margin-left: auto;">
                <i class="fa${this._post.isSaved ? 's' : 'r'} fa-bookmark"></i>
              </button>
            </div>
            
            <div class="likes-count">
              ${this._post.likesCount} suka
            </div>
            
            <div class="post-date">
              ${formatDate(this._post.createdAt)}
            </div>

            <div class="add-comment" style="display: ${this.isCommentVisible ? 'flex' : 'none'}">
              <textarea class="comment-input" placeholder="Add a comment..." rows="1"></textarea>
              <button class="post-button">Post</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Like button event listener
    const likeButton = this.shadowRoot.querySelector('#like-button');
    likeButton.addEventListener('click', () => {
      this.handleLike();
    });

    // Save button event listener
    const saveButton = this.shadowRoot.querySelector('#save-button');
    saveButton.addEventListener('click', () => {
      this.handleSave();
    });

    // Follow button event listener
    if (!this._post.isMyself) {
      const followButton = this.shadowRoot.querySelector('#follow-button');
      followButton.addEventListener('click', () => {
        this.handleFollow();
      });
    }

    // Render comments
    this.renderComments();

    // Setup textarea auto-height
    const textarea = this.shadowRoot.querySelector('.comment-input');
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('.close-button').addEventListener('click', () => {
      this.remove();
    });

    this.shadowRoot.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.remove();
      }
    });

    const commentButton = this.shadowRoot.querySelector('.action-button:nth-child(2)');
    const addCommentSection = this.shadowRoot.querySelector('.add-comment');

    commentButton.addEventListener('click', () => {
      this.isCommentVisible = !this.isCommentVisible;
      addCommentSection.style.display = this.isCommentVisible ? 'flex' : 'none';

      if (this.isCommentVisible) {
        const textarea = addCommentSection.querySelector('.comment-input');
        textarea.focus();
      }
    });

    const postButton = this.shadowRoot.querySelector('.post-button');
    const textarea = this.shadowRoot.querySelector('.comment-input');

    postButton.addEventListener('click', () => {
      const commentText = textarea.value.trim();
      if (commentText) {
        this.handleComment(commentText);
        textarea.value = '';
        this.isCommentVisible = false;
        addCommentSection.style.display = 'none';
      }
    });

    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        postButton.click();
      }
    });
  }
}

customElements.define('post-detail', PostDetail);