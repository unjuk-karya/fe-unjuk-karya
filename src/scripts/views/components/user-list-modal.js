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
          padding: 16px;
        }
  
        .modal-content {
          background: #fff;
          width: 100%;
          max-width: 400px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          position: relative;
          animation: modalSlide 0.3s ease;
        }
  
        .modal-header {
          padding: 16px;
          font-weight: 600;
          font-size: 18px;
          text-align: center;
          border-bottom: 1px solid #e6e6e6;
          position: relative;
        }
  
        .modal-body {
          height: 400px;
          overflow-y: auto;
          padding: 16px;
          scroll-behavior: smooth;
        }
  
        .user-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 4px;
          transition: background-color 0.2s ease;
        }

        .user-item:hover {
          background-color: #f8fafc;
        }
  
        .user-avatar-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e0e0;
          overflow: hidden;
          flex-shrink: 0;
        }

        .user-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-icon {
          font-size: 22px;
          color: #fff;
        }
  
        .user-info {
          flex: 1;
          min-width: 0;
        }
  
        .username {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }

        .username:hover {
          text-decoration: underline;
        }
  
        .fullname {
          font-size: 13px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
  
        .follow-button {
          padding: 6px 16px;
          font-size: 13px;
          cursor: pointer;
          background: #5d87ff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #fff;
          border: 1.5px solid #5d87ff;
          border-radius: 6px;
          transition: all 0.2s ease;
          flex-shrink: 0;
          min-width: 80px;
          font-weight: 500;
        }
  
        .follow-button.following {
          background-color: #fff;
          color: #1D77E6;
          border-color: #1D77E6;
        }

        .follow-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .follow-button:active {
          transform: translateY(0);
        }
  
        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          color: #333;
          background-color: #f3f4f6;
        }

        .modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Large screens */
        @media screen and (min-width: 1024px) {
          .modal-content {
            max-width: 450px;
          }

          .modal-body {
            height: 450px;
          }
        }

        /* Medium screens */
        @media screen and (max-width: 1023px) and (min-width: 768px) {
          .modal-content {
            max-width: 400px;
          }

          .modal-body {
            height: 400px;
          }
        }

        /* Small screens */
        @media screen and (max-width: 767px) {
          .modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .modal-content {
            max-width: 100%;
            border-radius: 16px 16px 0 0;
            max-height: 85vh;
          }

          .modal-body {
            height: auto;
            max-height: calc(85vh - 60px);
          }

          .modal-header {
            padding: 14px;
          }

          .user-item {
            padding: 10px;
          }

          .user-avatar-container {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }

          .avatar-icon {
            font-size: 20px;
          }

          .username {
            font-size: 13px;
          }

          .fullname {
            font-size: 12px;
          }

          .follow-button {
            padding: 5px 12px;
            font-size: 12px;
            min-width: 70px;
          }
        }

        /* Handle landscape */
        @media screen and (max-height: 600px) {
          .modal-overlay {
            align-items: center;
          }

          .modal-content {
            max-height: 90vh;
            border-radius: 16px;
          }

          .modal-body {
            max-height: calc(90vh - 60px);
          }
        }
      </style>
  
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            ${headerText}
            <button class="modal-close" aria-label="Tutup">&times;</button>
          </div>
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
                    <div class="user-avatar-container">
                      ${like.user.avatar ?
    `<img src="${like.user.avatar}" alt="${like.user.username}" class="user-avatar">` :
    '<i class="fas fa-user avatar-icon"></i>'
}
                    </div>
                    <div class="user-info">
<a href="#/profile/${like.user.id}" onclick="this.getRootNode().host.handleNavigation('${like.user.id}'); return false;" class="username">
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
  handleNavigation(userId) {
  // Hapus modal likes
    this.remove();

    // Hapus post-detail jika ada
    const postDetailModal = document.querySelector('post-detail');
    if (postDetailModal) {
      postDetailModal.remove();
    }

    // Navigasi ke profile
    window.location.href = `#/profile/${userId}`;
  }
  disconnectedCallback() {
    const stateHandler = this.shadowRoot.querySelector('content-state-handler');
    if (stateHandler) {
      stateHandler.removeEventListener('retry', this.handleRetry);
    }

    // Cleanup click events
    this.shadowRoot.querySelector('.modal-close')?.removeEventListener('click', () => this.remove());
    this.shadowRoot.querySelector('.modal-overlay')?.removeEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.remove();
      }
    });

    // Hapus bagian ini
    this.shadowRoot.querySelectorAll('.username').forEach((usernameLink) => {
      usernameLink.addEventListener('click', () => {
        this.remove();
      });
    });

    const followButtons = this.shadowRoot.querySelectorAll('.follow-button');
    followButtons.forEach((button) => {
      const index = button.getAttribute('data-index');
      button.removeEventListener('click', () => this.handleFollow(this.likes[index].user.id, index));
    });
  }
}

customElements.define('user-list-modal', UserListModal);