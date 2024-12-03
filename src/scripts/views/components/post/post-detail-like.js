class PostDetailLike extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.likes = [];
  }

  set data(likesData) {
    this.likes = likesData;
    this.render();
  }

  async handleFollow(userId, index) {
    try {
      const user = this.likes[index].user;

      const isNowFollowing = !user.isFollowing;

      user.isFollowing = isNowFollowing;
      this.render();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  }

  render() {
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
            }
      
            .username {
              font-size: 14px;
              font-weight: bold;
              color: #333;
            }
      
            .fullname {
              font-size: 12px;
              color: #666;
            }
      
            .follow-button {
              padding: 5px 10px;
              font-size: 12px;
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
  z-index: 10; /* Pastikan tombol berada di atas */
}


          </style>
      
          <div class="modal-overlay">
            <div class="modal-content">
              <button class="modal-close">&times;</button>
              <div class="modal-header">Suka</div>
              <div class="modal-body">
                ${this.likes
    .map(
      (like, index) => `
                  <div class="user-item">
                    <img src="${like.user.avatar || 'https://via.placeholder.com/40'}" alt="Avatar" class="user-avatar">
                    <div class="user-info">
                      <span class="username">${like.user.username}</span>
                      <span class="fullname">${like.user.name || ''}</span>
                    </div>
                    ${
  like.user.isMyself
    ? ''
    : `
                      <button 
                        class="follow-button ${like.user.isFollowing ? 'following' : ''}" 
                        data-index="${index}">
                        ${like.user.isFollowing ? 'Mengikuti' : 'Ikuti'}
                      </button>
                    `
}
                  </div>
                `
    )
    .join('')}
              </div>
            </div>
          </div>
        `;

    this.shadowRoot
      .querySelector('.modal-close')
      .addEventListener('click', () => this.remove());

    this.shadowRoot
      .querySelector('.modal-overlay')
      .addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
          this.remove();
        }
      });

    const followButtons = this.shadowRoot.querySelectorAll('.follow-button');
    followButtons.forEach((button) => {
      const index = button.getAttribute('data-index');
      button.addEventListener('click', () => this.handleFollow(this.likes[index].user.id, index));
    });
  }

}

customElements.define('post-detail-like', PostDetailLike);
