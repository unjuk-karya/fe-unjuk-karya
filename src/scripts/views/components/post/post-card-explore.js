import { formatDate } from '../../../utils/formatter.js';
import './post-detail.js';

class PostCardExplore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set post(post) {
    this._post = post;
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const card = this.shadowRoot.querySelector('.card');
    card.addEventListener('click', () => {
      console.log('Card clicked:', this._post.id);
      this.dispatchEvent(new CustomEvent('post-click', {
        detail: { postId: this._post.id },
        bubbles: true,
        composed: true
      }));

      console.log('Event post-click dispatched');
    });
  }
  render() {
    if (!this._post) return;

    this.shadowRoot.innerHTML = `
        <style>

        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
          .card {
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.2s ease;
            cursor: pointer;
            width: 100%;
            max-width: 100%;
            height: 100%;
            margin: 0 auto;
            box-sizing: border-box;
            top: 100px;
          }
          
          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
          }
  
          .image-container {
            height: 200px;
            overflow: hidden;
            background-color: #f4f4f4;
          }
  
          .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
  
          .content {
            padding: 16px;
          }
  
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
  
          .header .profile {
            display: flex;
            align-items: center;
            gap: 8px;
          }
  
          .header .profile img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid #f0f0f0;
          }
  
          .header .profile span {
            font-weight: 500;
            color: #2A3547;
          }
  
          .content h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
            color: #1a1a1a;
          }
  
          .content p {
            margin: 0;
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
  
          .date {
            margin-top: 12px;
            font-size: 12px;
            color: #999;
          }
  
          .stats {
            display: flex;
            align-items: center;
            margin-top: 12px;
            font-size: 14px;
            color: #666;
            gap: 16px;
          }
  
          .stats .likes, .stats .comments {
            display: flex;
            align-items: center;
            gap: 4px;
          }
  
          .stats .likes i, .stats .comments i {
            font-size: 16px;
            color: #999;
          }

          .content h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
            color: #1a1a1a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        </style>
  
        <div class="card">
          <div class="image-container">
            <img src="${this._post.image}" alt="Post image">
          </div>
          <div class="content">
            <div class="header">
              <div class="profile">
                <img src="${this._post.user.avatar || 'https://via.placeholder.com/36'}" alt="Profile">
                <span>${this._post.user.username}</span>
              </div>
              <div class="date">${formatDate(this._post.createdAt)}</div>
            </div>
            <h3>${this._post.title}</h3>
            <p>${this._post.content}</p>
            <div class="stats">
              <div class="likes">
                <i class="fa fa-heart"></i>
                <span>${this._post.likesCount}</span>
              </div>
              <div class="comments">
                <i class="fa fa-comment"></i>
                <span>${this._post.commentsCount}</span>
              </div>
            </div>
          </div>
        </div>
      `;
  }
}

customElements.define('post-card-explore', PostCardExplore);