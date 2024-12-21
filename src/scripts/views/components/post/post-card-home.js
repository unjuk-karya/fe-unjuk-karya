import PostSource from '../../../data/post-source.js';

class PostCardHome extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.post = null;
  }

  set data(post) {
    this.post = post;
    this.render();
  }

  async handleLike(event) {
    try {
      event.stopPropagation(); // Prevent card click event
      const oldLikeState = this.post.isLiked;
      const oldLikeCount = this.post.likesCount;

      this.post.isLiked = !oldLikeState;
      this.post.likesCount = oldLikeState ? oldLikeCount - 1 : oldLikeCount + 1;

      const likeButton = this.shadowRoot.querySelector('.like-button');
      const likeIcon = this.shadowRoot.querySelector('.like-icon');
      const likesCount = this.shadowRoot.querySelector('.likes-count');

      likeIcon.classList.toggle('fas', this.post.isLiked);
      likeIcon.classList.toggle('far', !this.post.isLiked);
      likeButton.classList.toggle('liked', this.post.isLiked);
      likesCount.textContent = this.post.likesCount;

      await PostSource.likePost(this.post.id);
    } catch (error) {
      console.error('Error toggling like:', error);
      this.post.isLiked = !this.post.isLiked;
      this.post.likesCount += this.post.isLiked ? 1 : -1;
      this.render();
    }
  }

  handleCardClick() {
    const postDetail = document.createElement('post-detail');
    postDetail.postId = this.post.id;
    document.body.appendChild(postDetail);
  }

  setupEventListeners() {
    const likeButton = this.shadowRoot.querySelector('.like-button');
    const card = this.shadowRoot.querySelector('.card');

    if (likeButton) likeButton.addEventListener('click', (e) => this.handleLike(e));
    if (card) card.addEventListener('click', () => this.handleCardClick());
  }

  render() {
    if (!this.post) return;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
      <style>
        .card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          width: 100%;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .card-image-container {
          position: relative;
          width: 100%;
        }

        .card-image {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          background: #f0f0f0;
          border-radius: 8px 8px 0 0;
          display: block;
        }

        .card-content {
          padding: 12px 16px 16px;
        }

        .author-section {
          position: absolute;
          bottom: -20px;
          left: 16px;
          display: flex;
          align-items: center;
          z-index: 1;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 25px;
          padding: 4px;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 8px;
          object-fit: cover;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e0e0;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-avatar i {
          font-size: 20px;
          color: #fff;
        }

        .author-username {
          font-size: 14px;
          color: #fff;
          font-weight: 500;
          padding-right: 12px;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
          color: inherit;
          font-size: inherit;
        }

        .like-button {
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .like-button:hover {
          transform: scale(1.2);
        }

        .like-button:not(:hover) {
          transform: scale(1);
          transition: transform 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045);
        }

        .liked {
          color: #ed4956;
        }

        .title {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin: 24px 0 12px 0;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .content {
          font-size: 14px;
          color: #666;
          margin: 0 0 12px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .metrics {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #666;
          justify-content: flex-start;
          gap: 12px;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }

        .metric-item i {
          font-size: 18px;
        }

        .liked {
          color: #ed4956;
        }

        .date {
          margin-left: auto;
          color: #666;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
          border-radius: 0 0 8px 8px;
        }
      </style>

      <div class="card">
        <div class="card-image-container">
          <img class="card-image" src="${this.post.image}" alt="${this.post.title}">
          <div class="image-overlay"></div>
          <div class="author-section">
            <div class="author-avatar">
              ${this.post.user.avatar ?
    `<img src="${this.post.user.avatar}" alt="${this.post.user.username}">` :
    '<i class="fas fa-user"></i>'
}
            </div>
            <span class="author-username">${this.post.user.username}</span>
          </div>
        </div>
        <div class="card-content">
          <h2 class="title">${this.post.title}</h2>
          <p class="content">${this.post.content}</p>
          <div class="metrics">
            <button class="metric-item like-button ${this.post.isLiked ? 'liked' : ''}" aria-label="Like">
              <i class="like-icon ${this.post.isLiked ? 'fas' : 'far'} fa-heart"></i>
              <span class="likes-count">${this.post.likesCount}</span>
            </button>
            <div class="metric-item">
              <i class="far fa-comment"></i>
              <span>${this.post.commentsCount || 0}</span>
            </div>
            <span class="date">• ${new Date(this.post.createdAt).toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }
}

customElements.define('post-card-home', PostCardHome);