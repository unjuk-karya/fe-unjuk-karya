import { formatDate } from '../../../utils/formatter.js';

class PostDetailActions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isLikesProcessing = false; // Tambahkan properti ini
  }

  set data(postData) {
    this._data = postData;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        
        .container {
          border-top: 1px solid #efefef;
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

                  .action-button:hover {
            transform: scale(1.1);
          }

        .action-button.liked i {
          color: #ed4956;
          font-weight: 900;
        }

        .action-button.saved i {
          color: #1D77E6;
          font-weight: 900;
        }

.likes-count {
  padding: 0 16px 4px;
  font-weight: 600;
  font-size: 14px;
  color: #000;
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.likes-count:not(.disabled):hover {
  text-decoration: underline;
}

        .post-date {
          padding: 0 16px 12px;
          font-size: 12px;
          color: #8e8e8e;
        }
      </style>

      <div class="container">
        <div class="post-actions">
          <button class="action-button ${this._data.isLiked ? 'liked' : ''}" id="like-button">
            <i class="fa${this._data.isLiked ? 's' : 'r'} fa-heart"></i>
          </button>
          <button class="action-button" id="comment-button">
            <i class="far fa-comment"></i>
          </button>
         
        </div>
        
        <div class="likes-count ${this.isLikesProcessing ? 'disabled' : ''}" id="likes-count">
          ${this._data.likesCount} suka
        </div>
        
        <div class="post-date">
          ${formatDate(this._data.createdAt)}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Like button
    const likeButton = this.shadowRoot.querySelector('#like-button');
    likeButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('like-click'));
    });

    // Comment button
    const commentButton = this.shadowRoot.querySelector('#comment-button');
    commentButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('comment-click'));
    });


    // Likes count
    const likesCount = this.shadowRoot.querySelector('#likes-count');
    likesCount.addEventListener('click', async () => {
      if (this.isLikesProcessing) return;
      this.isLikesProcessing = true;

      this.dispatchEvent(new CustomEvent('likes-click'));

      setTimeout(() => {
        this.isLikesProcessing = false;
        this.render();
      }, 300);
    });
  }

  updateLikeStatus(isLiked, likesCount) {
    this._data.isLiked = isLiked;
    this._data.likesCount = likesCount;
    this.render();
  }

}

customElements.define('post-detail-actions', PostDetailActions);
