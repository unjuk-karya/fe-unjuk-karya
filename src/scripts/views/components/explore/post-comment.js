import { formatDate } from '../../../utils/formatter.js';


class PostComment extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(commentData) {
    this._data = commentData;
    this.render();
  }


  render() {
    if (!this._data) return;

    this.shadowRoot.innerHTML = `
        <style>
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
          
          .comment {
            padding: 12px 16px;
            font-size: 14px;
          }

          .comment-container {
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }

          .avatar-column {
            flex-shrink: 0;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }

          .comment-content {
            flex-grow: 1;
            position: relative;
          }

          .content-text {
            margin-bottom: 8px;
            line-height: 1.4;
          }

          .username {
            font-weight: 600;
            color: #262626;
            margin-right: 4px;
          }

          .comment-text {
            color: #262626;
          }

          .comment-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
          }

          .timestamp {
            font-size: 12px;
            color: #8e8e8e;
          }

          .likes-count {
            font-size: 12px;
            color: #262626;
          }

          .like-button {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            color: #262626;
            font-size: 16px;
            display: flex;
            align-items: center;
          }

          .like-button.liked {
            color: #ed4956;
          }

          .like-button:hover {
            opacity: 0.7;
          }
        </style>

        <div class="comment">
          <div class="comment-container">
            <div class="avatar-column">
              <img class="user-avatar" 
                   src="${this._data.user.avatar || 'https://via.placeholder.com/32'}" 
                   alt="${this._data.user.username}">
            </div>
            <div class="comment-content">
              <div class="content-text">
                <span class="username">@${this._data.user.username}</span>
                <span class="comment-text">${this._data.content}</span>
              </div>
              <div class="comment-actions">
                <span class="timestamp">${formatDate(this._data.createdAt)}</span>
                <span class="likes-count">
                  ${this._data.likesCount > 0
                    ? `${this._data.likesCount} suka`
                    : ''
                  }
                </span>
              </div>
            </div>
            <button class="like-button ${this._data.isLiked ? 'liked' : ''}">
              <i class="fa${this._data.isLiked ? 's' : 'r'} fa-heart"></i>
            </button>
          </div>
        </div>
      `;

    // Add like button event listener
    const likeButton = this.shadowRoot.querySelector('.like-button');
    likeButton.addEventListener('click', () => {
      this._data.isLiked = !this._data.isLiked;

      // Update likesCount based on isLiked status
      this._data.likesCount += this._data.isLiked ? 1 : -1;

      // Re-render the component to update UI
      this.render();
    });
  }
}

customElements.define('post-comment', PostComment);
