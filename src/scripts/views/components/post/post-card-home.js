import { formatDate } from '../../../utils/formatter.js';
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

  async handleLike() {
    try {
      this.post.isLiked = !this.post.isLiked;
      const likeButton = this.shadowRoot.querySelector('.like-button');
      const likesCount = this.shadowRoot.querySelector('.likes-count');
      this.post.likesCount += this.post.isLiked ? 1 : -1;

      likeButton.innerHTML = `<i class="${this.post.isLiked ? 'fas' : 'far'} fa-heart"></i>`;
      likeButton.classList.toggle('liked', this.post.isLiked);
      likesCount.textContent = `${this.post.likesCount} suka`;
      await PostSource.likePost(this.post.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async handleSave() {
    try {
      this.post.isSaved = !this.post.isSaved;
      const saveButton = this.shadowRoot.querySelector('.save-button');
      saveButton.innerHTML = `<i class="${this.post.isSaved ? 'fas' : 'far'} fa-bookmark"></i>`;
      saveButton.classList.toggle('saved', this.post.isSaved);
      await PostSource.savePost(this.post.id);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }

  async handleLikesCountClick() {
    try {
      const likesData = await PostSource.getPostLikes(this.post.id);
      const postDetailLike = document.createElement('post-detail-like');
      postDetailLike.data = likesData;
      document.body.appendChild(postDetailLike);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }

  handleComment() {
    const postDetail = document.createElement('post-detail');
    postDetail.postId = this.post.id;
    document.body.appendChild(postDetail);
  }

  handleImageClick() {
    const postDetail = document.createElement('post-detail');
    postDetail.postId = this.post.id;
    document.body.appendChild(postDetail);
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('.like-button').addEventListener('click', () => this.handleLike());
    this.shadowRoot.querySelector('.save-button').addEventListener('click', () => this.handleSave());
    this.shadowRoot.querySelector('.comment-button').addEventListener('click', () => this.handleComment());
    this.shadowRoot.querySelector('.likes-count').addEventListener('click', () => this.handleLikesCountClick());
    this.shadowRoot.querySelector('.post-image').addEventListener('click', () => this.handleImageClick());
  }

  render() {
    if (!this.post) return;

    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <style>
          :host {
            display: block;
            width: 100%;
            background: white;
            border-radius: 10px;
            font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
  
          @media (max-width: 600px) {
            :host {
              border-radius: 0;
              box-shadow: none;
              border-bottom: 1px solid #dbdbdb;
            }
          }
  
          .post-header {
            display: flex;
            align-items: center;
            padding: 8px 4px 8px 12px;
            gap: 8px;
          }
  
          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }
  
          .username {
            font-weight: 600;
            color: #262626;
            text-decoration: none;
            font-size: 13px;
          }
          
          .username:hover {
            text-decoration: underline;
          }
  
          .post-timestamp {
            color: #8e8e8e;
            font-size: 12px;
          }
  
          .post-image {
            width: 100%;
            height: auto;
            display: block;
            aspect-ratio: 4/3;
            object-fit: cover;
            cursor: pointer;
          }
  
          .post-actions {
            display: flex;
            align-items: center;
            padding: 6px 12px 6px;
          }
  
          .action-group {
            display: flex;
            gap: 16px;
          }
  
          .action-button {
            background: none;
            border: none;
            padding: 8px 0;
            cursor: pointer;
            color: #262626;
            font-size: 24px;
            transition: all 0.2s ease;
          }
  
          .action-button.save-button {
            margin-left: auto;
          }
  
          .action-button.liked i {
            color: #ed4956;
          }
  
          .action-button.saved i {
            color: #1D77E6;
          }
  
          .likes-count {
            padding: 0 12px 2px;
            font-size: 14px;
            font-weight: 600;
            color: #262626;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
          }
          
          .likes-count:hover {
            text-decoration: underline;
          }
  
          .content-section {
            padding: 0 12px 8px;
          }
  
          .post-title {
            font-size: 14px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 2px;
          }
  
          .post-content {
            font-size: 14px;
            line-height: 1.4;
            color: #262626;
            margin: 0;
          }
  
          @media (max-width: 600px) {
            .action-button {
              font-size: 22px;
              padding: 6px 0;
            }
  
            .post-title,
            .post-content {
              font-size: 13px;
            }
          }
        </style>

      <article>
        <div class="post-header">
          <img class="user-avatar" src="${this.post.user.avatar || 'https://via.placeholder.com/32'}" alt="">
          <div style="display: flex; gap: 4px; align-items: center;">
            <a href="#/profile/${this.post.user.id}" class="username">${this.post.user.username}</a>
            <span class="post-timestamp">• ${formatDate(this.post.createdAt)}</span>
          </div>
        </div>

        <img class="post-image" src="${this.post.image}" alt="${this.post.title}">

        <div class="post-actions">
          <div class="action-group">
            <button class="action-button like-button ${this.post.isLiked ? 'liked' : ''}" aria-label="Suka">
              <i class="${this.post.isLiked ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <button class="action-button comment-button" aria-label="Komentar">
              <i class="far fa-comment"></i>
            </button>
          </div>
          <button class="action-button save-button ${this.post.isSaved ? 'saved' : ''}" aria-label="Simpan">
            <i class="${this.post.isSaved ? 'fas' : 'far'} fa-bookmark"></i>
          </button>
        </div>

        <span class="likes-count">${this.post.likesCount} suka</span>

        <div class="content-section">
          <h2 class="post-title">${this.post.title}</h2>
          <p class="post-content">${this.post.content}</p>
        </div>
      </article>
    `;

    this.setupEventListeners();
  }
}

customElements.define('post-card-home', PostCardHome);