import ProfileSource from '../../data/profile-source.js';
import './profile/profile-header.js';
import './profile/profile-tabs.js';
import './post/post-card-profile.js';
import './post/post-detail.js';
import '../components/loading-indicator.js';

class ProfileIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.activeTab = 'posts';
    this.debounceTimeout = null;
    this.posts = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;
    this.observer = null;
  }

  set loading(value) {
    this.isLoading = value;
    this.render();
  }

  get loading() {
    return this.isLoading;
  }

  renderLoading() {
    this.shadowRoot.innerHTML = `
      <style>
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 40px);
        }
      </style>
      <div class="loading-container">
        <loading-indicator></loading-indicator>
      </div>
    `;
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.loading && this.currentPage < this.totalPages) {
          this.fetchPosts(this.currentPage + 1);
        }
      });
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    const sentinel = this.shadowRoot.querySelector('#sentinel');
    if (sentinel) {
      this.observer.observe(sentinel);
    }
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('post-click', (e) => {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(() => {
        const postDetail = document.createElement('post-detail');
        postDetail.postId = e.detail.postId;
        document.body.appendChild(postDetail);
      }, 300);
    });
  }

  async fetchPosts(page = 1) {
    if (this.loading) return;

    try {
      this.loading = true;
      console.log('Fetching posts, isLoading:', this.loading);
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await ProfileSource.getUserPosts(userId, page);

      if (page === 1) {
        this.posts = response.posts;
      } else {
        this.posts = [...this.posts, ...response.posts];
      }

      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      this.loading = false;
      console.log('Finished fetching posts, isLoading:', this.loading);
      this.render();
      this.setupIntersectionObserver();
    }
  }

  async connectedCallback() {
    this.renderLoading();

    const userId = JSON.parse(localStorage.getItem('user')).id;

    try {
      const [profileData, postsData] = await Promise.all([
        ProfileSource.getUserProfile(userId),
        ProfileSource.getUserPosts(userId, 1)
      ]);

      this.profileData = profileData;
      this.posts = postsData.posts;
      this.currentPage = postsData.pagination.currentPage;
      this.totalPages = postsData.pagination.totalPages;

      this.render();
      this.setupIntersectionObserver();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .tabs-content {
          margin: 0 auto;
          padding: 20px 0;
        }

        .tab-content {
          display: none;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin: 0 auto;
        }

        .tab-content.active {
          display: block;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .bottom-loader {
          grid-column: 1 / -1;
        }

        #sentinel {
          width: 100%;
          height: 0px;
          visibility: hidden;
          margin-top: 0px;
        }

        @media screen and (max-width: 992px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .tab-content {
            margin: 0 16px;
          }
        }

        @media screen and (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .tab-content {
            padding: 10px;
          }
        }

        @media screen and (max-width: 480px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .tabs-content {
            padding: 10px 0;
          }

          .tab-content {
            margin: 0 10px;
          }
        }
      </style>

      <profile-header></profile-header>
      <profile-tabs active-tab="${this.activeTab}"></profile-tabs>
      
      <div class="tabs-content">
        <div class="tab-content ${this.activeTab === 'posts' ? 'active' : ''}" id="posts">
          ${this.posts.length > 0 ? `
            <div class="grid">
              ${this.posts.map(() => `
                <post-card-profile></post-card-profile>
              `).join('')}
            </div>
            ${this.currentPage < this.totalPages ? `
              <div id="sentinel"></div>
            ` : ''}
          ` : `
            <div class="empty-state">
              <p>Belum ada postingan.</p>
            </div>
          `}
          ${this.loading ? `
            <div class="bottom-loader">
              <loading-indicator></loading-indicator>
            </div>
          ` : ''}
        </div>

        <div class="tab-content ${this.activeTab === 'etalase' ? 'active' : ''}" id="etalase">
          <div class="empty-state">
            <p>Etalase masih kosong.</p>
          </div>
        </div>

        <div class="tab-content ${this.activeTab === 'liked' ? 'active' : ''}" id="liked">
          <div class="empty-state">
            <p>Disukai masih kosong.</p>
          </div>
        </div>
      </div>
    `;

    const profileHeader = this.shadowRoot.querySelector('profile-header');
    if (profileHeader) {
      profileHeader.profileData = this.profileData;
    }

    const postCards = this.shadowRoot.querySelectorAll('post-card-profile');
    postCards.forEach((card, index) => {
      card.post = this.posts[index];
    });

    this.setupEventListeners();

    this.shadowRoot.addEventListener('tabChange', (event) => {
      this.activeTab = event.detail.target;
      this.render();
      this.setupIntersectionObserver(); // Tambahkan ini
    });
  }

  disconnectedCallback() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    this.shadowRoot.removeEventListener('tabChange', this.handleTabChange);
    this.shadowRoot.removeEventListener('post-click', this.setupEventListeners);
  }
}

customElements.define('profile-index', ProfileIndex);