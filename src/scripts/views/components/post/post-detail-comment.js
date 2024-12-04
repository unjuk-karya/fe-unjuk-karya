import { formatDate } from '../../../utils/formatter.js';
import PostSource from '../../../data/post-source.js';
import Swal from 'sweetalert2';

class PostDetailComment extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(commentData) {
    this._data = commentData;
    this.render();
  }

  async handleDelete() {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Komentar yang dihapus tidak dapat dikembalikan',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Menghapus komentar...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await PostSource.deleteComment(this._data.postId, this._data.id);

        await Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Komentar berhasil dihapus',
          timer: 1500,
        });

        this.remove();
        this.dispatchEvent(new CustomEvent('comment-deleted', {
          detail: { commentId: this._data.id }
        }));

      } catch (error) {
        console.error('Error deleting comment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Gagal menghapus komentar'
        });
      }
    }
  }

  render() {
    if (!this._data) return;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        
        .comment {
          margin: 0;
          padding: 12px 16px;
          font-size: 14px;
        }

        .comment-container {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 12px;
          margin-bottom: 0;
        }

        .comment:last-child {
          border-bottom: none;
          padding-bottom: 0;
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
          color: #000;
          margin-right: 4px;
          text-decoration: none;
        }

        .username:hover {
          text-decoration: underline;
        }

        .comment-text {
          color: #000;
        }

        .comment-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }

        .timestamp {
          font-size: 12px;
          color: #8e8e8e;
        }

        .likes-count {
          font-size: 12px;
          color: #8e8e8e;
          font-weight: 600;
        }

        .like-button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 14px;
          margin-top: 4px;
        }

        .delete-button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 12px;
        }

        .like-button.liked {
          color: #ed4956;
        }

        .like-button:hover, .delete-button:hover {
          opacity: 0.7;
        }

        .actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
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
            <a href="#/profile/${this._data.user.id}" class="username">${this._data.user.username}</a>
              <span class="comment-text">${this._data.content}</span>
            </div>
            <div class="comment-actions">
              <span class="timestamp">${formatDate(this._data.createdAt)}</span>
              <span class="likes-count">
                ${this._data.likesCount > 0 ? `${this._data.likesCount} suka` : ''}
              </span>
              ${this._data.isMyself ? `
                <button class="delete-button">
                  <i class="far fa-trash-alt" style="color: #ed4956;"></i>
                </button>
              ` : ''}
            </div>
          </div>
          <div class="actions-group">
            <button class="like-button ${this._data.isLiked ? 'liked' : ''}">
              <i class="fa${this._data.isLiked ? 's' : 'r'} fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  async setupEventListeners() {
    const likeButton = this.shadowRoot.querySelector('.like-button');
    likeButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        this._data.isLiked = !this._data.isLiked;
        this._data.likesCount += this._data.isLiked ? 1 : -1;
        this.render();
        await PostSource.likeComment(this._data.postId, this._data.id);
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    });

    if (this._data.isMyself) {
      const deleteButton = this.shadowRoot.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => {
        this.handleDelete();
      });
    }
  }
}

customElements.define('post-detail-comment', PostDetailComment);