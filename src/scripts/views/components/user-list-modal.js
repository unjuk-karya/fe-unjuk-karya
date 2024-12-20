import ProfileSource from '../../data/profile-source.js';
import PostSource from '../../data/post-source.js';

class UserListModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.likes = [];
    this.type = 'likes';
    this.isLoading = true;
    this.error = null;
  }

  static get observedAttributes() {
    return ['post-id', 'user-id'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'post-id' && newValue) {
      this.fetchLikes(newValue);
    } else if (name === 'user-id' && newValue) {
      if (this.type === 'followers') {
        this.fetchFollowers(newValue);
      } else if (this.type === 'following') {
        this.fetchFollowing(newValue);
      }
    }
  }

  setType(type) {
    this.type = type;
    this.render();
  }

  async fetchLikes(postId) {
    if (!postId) {
      console.error('No post ID provided');
      this.error = new Error('Post ID is required');
      this.isLoading = false;
      this.render();
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await PostSource.getPostLikes(postId);
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }
      this.likes = response;
    } catch (error) {
      console.error('Error fetching likes:', error);
      this.error = error;
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  async fetchFollowing(userId) {
    if (!userId) {
      this.error = new Error('User ID is required');
      this.isLoading = false;
      this.render();
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await ProfileSource.getFollowings(userId);

      this.likes = Array.isArray(response) ? response : [];

    } catch (error) {
      this.error = error;
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  async fetchFollowers(userId) {
    if (!userId) {
      this.error = new Error('User ID is required');
      this.isLoading = false;
      this.render();
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await ProfileSource.getFollowers(userId);

      this.likes = Array.isArray(response) ? response : [];

    } catch (error) {
      this.error = error;
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  async handleFollow(userId, index) {
    try {
      const user = this.likes[index].user;
      const isNowFollowing = !user.isFollowing;

      const button = this.shadowRoot.querySelector(`button[data-index="${index}"]`);
      if (button) {
        button.textContent = isNowFollowing ? 'Mengikuti' : 'Ikuti';
        button.classList.toggle('following', isNowFollowing);
      }

      user.isFollowing = isNowFollowing;
      await ProfileSource.followUser(userId);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  }

  handleRetry = () => {
    const postId = this.getAttribute('post-id');
    const userId = this.getAttribute('user-id');

    if (postId) {
      this.fetchLikes(postId);
    } else if (userId) {
      if (this.type === 'followers') {
        this.fetchFollowers(userId);
      } else if (this.type === 'following') {
        this.fetchFollowing(userId);
      }
    }
  };

  render() {
    const headerText = this.type === 'likes' ? 'Suka' :
      this.type === 'followers' ? 'Pengikut' : 'Mengikuti';

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
  
        .modal-content {
          background: #fff;
          width: 100%;
          max-width: 400px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          position: relative;
        }
  
        .modal-header {
          padding: 14px;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          border-bottom: 1px solid #e6e6e6;
          position: relative;
        }
  
        .modal-body {
          max-height: 400px;
          overflow-y: auto;
          padding: 10px;
          scroll-behavior: smooth;
        }
  
        .user-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
        }
  
        .user-item:last-child {
          border-bottom: none;
        }
  
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 10px;
        }
  
        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
  
        .username {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .username:hover {
          text-decoration: underline;
        }
  
        .fullname {
          font-size: 12px;
          color: #666;
        }
  
        .follow-button {
          padding: 5px 10px;
          font-size: 12px;
          cursor: pointer;
          background: #5d87ff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #fff;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
  
        .follow-button.following {
          background-color: #fff;
          color: #1D77E6;
        }

        .follow-button:hover {
          transform: scale(1.05);
        }
  
        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          background: none;
          border: none;
          padding: 5px;
          line-height: 1;
          z-index: 10;
          transition: color 0.2s ease;
        }

        .modal-close:hover {
          color: #333;
        }

        @media (max-width: 480px) {
          .modal-content {
            height: 100%;
            max-width: none;
            border-radius: 0;
          }

          .modal-body {
            max-height: none;
            flex: 1;
          }
        }
      </style>
  
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" aria-label="Tutup">&times;</button>
          <div class="modal-header">${headerText}</div>
          <div class="modal-body">
<content-state-handler 
  state="${this.isLoading ? 'loading' : this.error ? 'error' : this.likes.length === 0 ? 'empty' : 'success'}"
  message="${this.error ? 'Gagal memuat data. Silakan coba lagi.' :
    this.likes.length === 0 ?
      this.type === 'likes' ? 'Belum ada yang menyukai' :
        this.type === 'followers' ? 'Belum ada pengikut' :
          'Anda belum mengikuti siapapun' : ''}"
>
              ${!this.isLoading && !this.error && this.likes.length > 0 ?
    this.likes.map((like, index) => `
                  <div class="user-item">
                    <img src="${like.user.avatar || 'https://via.placeholder.com/40'}" alt="Avatar ${like.user.username}" class="user-avatar">
                    <div class="user-info">
                      <a href="#/profile/${like.user.id}" class="username">${like.user.username}</a>
                      <span class="fullname">${like.user.name || ''}</span>
                    </div>
                    ${like.user.isMyself ? '' : `
                      <button 
                        class="follow-button ${like.user.isFollowing ? 'following' : ''}" 
                        data-index="${index}"
                        aria-label="${like.user.isFollowing ? 'Berhenti mengikuti' : 'Ikuti'} ${like.user.username}">
                        ${like.user.isFollowing ? 'Mengikuti' : 'Ikuti'}
                      </button>
                    `}
                  </div>
                `).join('')
    : ''}
            </content-state-handler>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.modal-close')?.addEventListener('click', () => this.remove());
    this.shadowRoot.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.remove();
      }
    });

    this.shadowRoot.querySelectorAll('.username').forEach((usernameLink) => {
      usernameLink.addEventListener('click', () => {
        this.remove();
      });
    });

    const stateHandler = this.shadowRoot.querySelector('content-state-handler');
    if (stateHandler) {
      stateHandler.addEventListener('retry', this.handleRetry);
    }

    const followButtons = this.shadowRoot.querySelectorAll('.follow-button');
    followButtons.forEach((button) => {
      const index = button.getAttribute('data-index');
      button.addEventListener('click', () => this.handleFollow(this.likes[index].user.id, index));
    });
  }

  disconnectedCallback() {
    const stateHandler = this.shadowRoot.querySelector('content-state-handler');
    if (stateHandler) {
      stateHandler.removeEventListener('retry', this.handleRetry);
    }
  }
}

customElements.define('user-list-modal', UserListModal);
