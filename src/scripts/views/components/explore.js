import PostSource from '../../data/post-source';

class ExploreMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.posts = [];
    this.users = [
      { 
        username: 'john_doe', 
        fullname: 'John Doe', 
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
      },
      { 
        username: 'jane_smith', 
        fullname: 'Jane Smith', 
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg' 
      },
      { 
        username: 'alex_user', 
        fullname: 'Alex Johnson', 
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg' 
      }
    ];
  }

  async connectedCallback() {
    await this.fetchPosts();
    this.render();
    this.setupEventListeners();
  }

  async fetchPosts() {
    try {
      this.posts = await PostSource.getAllPosts();
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

  setupEventListeners() {
    const searchInput = this.shadowRoot.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredUsers = this.users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) || 
        user.fullname.toLowerCase().includes(searchTerm)
      );
      this.renderUsers(filteredUsers);
    });
  }

  renderUsers(users) {
    const userResults = this.shadowRoot.querySelector('.user-results');
    userResults.innerHTML = users.map(user => `
      <div class="user-item" data-username="${user.username}">
        <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
        <div class="user-info">
          <div class="username">@${user.username}</div>
          <div class="fullname">${user.fullname}</div>
        </div>
      </div>
    `).join('');

    this.shadowRoot.querySelectorAll('.user-item').forEach(item => {
      item.addEventListener('click', () => {
        const username = item.dataset.username;
        alert(`Anda memilih pengguna: @${username}`);
      });
    });
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
        align-items: center; /* Changed from justify-content: space-between */
        margin-top: 12px;
        font-size: 14px;
        color: #666;
        gap: 16px; /* Added to create space between likes and comments */
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
      .user-search-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 0 15px;
    }

    .search-input-wrapper {
        position: relative;
        width: 100%;
    }

    .search-input {
        width: 100%;
        padding: 10px 40px 10px 15px;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        background-color: #fafafa;
        font-size: 16px;
    }

    .search-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #8e8e8e;
    }

    .user-results {
        margin-top: 15px;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        max-height: 400px;
        overflow-y: auto;
    }

    .user-item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        border-bottom: 1px solid #dbdbdb;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .user-item:last-child {
        border-bottom: none;
    }

    .user-item:hover {
        background-color: #f5f5f5;
    }

    .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 15px;
        object-fit: cover;
    }

    .user-info {
        flex-grow: 1;
    }

    .username {
        font-weight: 600;
        color: #262626;
    }

    .fullname {
        color: #8e8e8e;
        font-size: 14px;
    }

    @media (max-width: 600px) {
        .user-search-container {
            padding: 0 10px;
        }

        .search-input {
            font-size: 14px;
            padding: 8px 35px 8px 12px;
        }

        .user-item {
            padding: 8px 12px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
        }
    }

      </style>

      <div class="user-search-container">
        <div class="search-input-wrapper">
          <input type="text" class="search-input" placeholder="Cari pengguna...">
          <span class="search-icon">🔍</span>
        </div>
        <div class="user-results"></div>
      </div>

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
      </div>
    `;
  }
}

customElements.define('explore-menu', ExploreMenu);
