import PostSource from '../../data/post-source';

class ExploreMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.posts = [];
  }

  async connectedCallback() {
    await this.fetchPosts();
    this.render();
  }

  async fetchPosts() {
    try {
      this.posts = await PostSource.getAllPosts(); // Langsung gunakan response array
    } catch (error) {
      console.error('Error fetching posts:', error);
      this.posts = [];
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

        .container-explore {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin: 0 auto;
        }

        .card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease;
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
          justify-content: space-between;
          margin-top: 12px;
          font-size: 14px;
          color: #666;
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

        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
            padding: 16px;
          }
          
          :host {
            margin-left: 0;
          }
        }
      </style>

      <div class="container-explore">
        ${this.posts.map((post) => `
          <div class="card">
            <div class="image-container">
              <img src="${post.image}" alt="Post image">
            </div>
            <div class="content">
              <div class="header">
                <div class="profile">
                  <img src="${post.user.avatar || 'https://via.placeholder.com/36'}" alt="Profile">
                  <span>${post.user.username}</span>
                </div>
                <div class="date">${this.formatDate(post.createdAt)}</div>
              </div>
              <h3>${post.title || 'Untitled'}</h3>
              <p>${post.content}</p>
              <div class="stats">
                <div class="likes">
                  <i class="fa fa-heart"></i>
                  <span>${post.likesCount}</span>
                </div>
                <div class="comments">
                  <i class="fa fa-comment"></i>
                  <span>${post.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }
}

customElements.define('explore-menu', ExploreMenu);