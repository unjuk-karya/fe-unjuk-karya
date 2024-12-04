import ProfileSource from '../../data/profile-source.js';
import './profile/profile-header.js';
import './profile/profile-tabs.js';
import './post/post-card-profile-1.js';
import './post/post-card-profile-2.js';
import './post/post-detail.js';
import '../components/loading-indicator.js';

class ProfileIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.activeTab = 'posts';
    this.posts = [];
    this.likedPosts = [];
    this.postsPage = 1;
    this.postsTotalPages = 1;
    this.likedPostsPage = 1;
    this.likedPostsTotalPages = 1;
    this.isLoadingPosts = false;
    this.isLoadingLikedPosts = false;
    this.isLoadingInitialData = true;
    this.profileData = null;

    this.tabsContent = null;
    this.postsTab = null;
    this.likedTab = null;
    this.etalaseTab = null;

    this.postsObserver = null;
    this.likedPostsObserver = null;

    this.handlePostClick = this.handlePostClick.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  createTemplate() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #fff;
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
          display: flex;
          justify-content: center;
          padding: 20px;
        }

        .sentinel {
          width: 100%;
          height: 20px;
          visibility: hidden;
        }

        @media screen and (max-width: 992px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
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
        }
      </style>

      ${this.isLoadingInitialData ? `
        <div class="loading-container">
          <loading-indicator></loading-indicator>
        </div>
      ` : `
        <profile-header></profile-header>
        <profile-tabs active-tab="${this.activeTab}"></profile-tabs>
        
        <div class="tabs-content">
          <div id="posts" class="tab-content ${this.activeTab === 'posts' ? 'active' : ''}">
            <div class="grid"></div>
            <div class="sentinel" id="posts-sentinel"></div>
            <div class="bottom-loader" style="display: none">
              <loading-indicator></loading-indicator>
            </div>
          </div>

          <div id="etalase" class="tab-content ${this.activeTab === 'etalase' ? 'active' : ''}">
            <div class="empty-state">
              <p>Etalase masih kosong.</p>
            </div>
          </div>

          <div id="liked" class="tab-content ${this.activeTab === 'liked' ? 'active' : ''}">
            <div class="grid"></div>
            <div class="sentinel" id="liked-posts-sentinel"></div>
            <div class="bottom-loader" style="display: none">
              <loading-indicator></loading-indicator>
            </div>
          </div>
        </div>
      `}
    `;
  }

  handlePostClick(e) {
    const postDetail = document.createElement('post-detail');
    postDetail.postId = e.detail.postId;
    document.body.appendChild(postDetail);
  }

  async handleTabChange(e) {
    const newTab = e.detail.target;
    if (this.activeTab === newTab) return;

    this.activeTab = newTab;

    this.updateTabVisibility();

    if (newTab === 'liked' && this.likedPosts.length === 0) {
      await this.fetchLikedPosts(1);
    }

    this.setupIntersectionObserver();
  }

  updateTabVisibility() {
    const tabs = this.shadowRoot.querySelectorAll('.tab-content');
    tabs.forEach((tab) => {
      if (tab.id === this.activeTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  setupIntersectionObserver() {
    if (this.postsObserver) this.postsObserver.disconnect();
    if (this.likedPostsObserver) this.likedPostsObserver.disconnect();

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.postsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoadingPosts && this.postsPage < this.postsTotalPages) {
          this.fetchPosts(this.postsPage + 1);
        }
      });
    }, options);

    this.likedPostsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoadingLikedPosts && this.likedPostsPage < this.likedPostsTotalPages) {
          this.fetchLikedPosts(this.likedPostsPage + 1);
        }
      });
    }, options);

    const postsSentinel = this.shadowRoot.querySelector('#posts-sentinel');
    const likedPostsSentinel = this.shadowRoot.querySelector('#liked-posts-sentinel');

    if (postsSentinel) this.postsObserver.observe(postsSentinel);
    if (likedPostsSentinel) this.likedPostsObserver.observe(likedPostsSentinel);
  }

  async fetchPosts(page = 1) {
    if (this.isLoadingPosts) return;

    try {
      this.isLoadingPosts = true;
      this.updateLoadingState('posts', true);

      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await ProfileSource.getUserPosts(userId, page);

      if (page === 1) {
        this.posts = response.posts;
      } else {
        this.posts = [...this.posts, ...response.posts];
      }

      this.postsPage = response.pagination.currentPage;
      this.postsTotalPages = response.pagination.totalPages;

      this.updatePostsGrid();
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      this.isLoadingPosts = false;
      this.updateLoadingState('posts', false);
    }
  }

  async fetchLikedPosts(page = 1) {
    if (this.isLoadingLikedPosts) return;

    try {
      this.isLoadingLikedPosts = true;
      this.updateLoadingState('liked', true);

      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await ProfileSource.getUserLikedPosts(userId, page);

      if (page === 1) {
        this.likedPosts = response.posts;
      } else {
        this.likedPosts = [...this.likedPosts, ...response.posts];
      }

      this.likedPostsPage = response.pagination.currentPage;
      this.likedPostsTotalPages = response.pagination.totalPages;

      this.updateLikedPostsGrid();
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
    } finally {
      this.isLoadingLikedPosts = false;
      this.updateLoadingState('liked', false);
    }
  }

  updateLoadingState(tab, isLoading) {
    const loader = this.shadowRoot.querySelector(`#${tab} .bottom-loader`);
    if (loader) {
      loader.style.display = isLoading ? 'flex' : 'none';
    }
  }

  updatePostsGrid() {
    const grid = this.shadowRoot.querySelector('#posts .grid');
    if (!grid) return;

    grid.innerHTML = this.posts.map(() => '<post-card-profile-1></post-card-profile-1>').join('');

    const cards = grid.querySelectorAll('post-card-profile-1');
    cards.forEach((card, index) => {
      card.post = this.posts[index];
    });
  }

  updateLikedPostsGrid() {
    const grid = this.shadowRoot.querySelector('#liked .grid');
    if (!grid) return;

    grid.innerHTML = this.likedPosts.map(() => '<post-card-profile-2></post-card-profile-2>').join('');

    const cards = grid.querySelectorAll('post-card-profile-2');
    cards.forEach((card, index) => {
      card.post = this.likedPosts[index];
    });
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('post-click', this.handlePostClick);
    this.shadowRoot.addEventListener('tabChange', this.handleTabChange);
  }

  async connectedCallback() {
    this.render();

    const userId = JSON.parse(localStorage.getItem('user')).id;

    try {
      const [profileData, postsData] = await Promise.all([
        ProfileSource.getUserProfile(userId),
        ProfileSource.getUserPosts(userId, 1)
      ]);

      this.profileData = profileData;
      this.posts = postsData.posts;
      this.postsPage = postsData.pagination.currentPage;
      this.postsTotalPages = postsData.pagination.totalPages;
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    } finally {
      this.isLoadingInitialData = false;
      this.render();
      this.setupEventListeners();
      this.setupIntersectionObserver();
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.createTemplate();

    if (!this.isLoadingInitialData) {
      const profileHeader = this.shadowRoot.querySelector('profile-header');
      if (profileHeader) {
        profileHeader.profileData = this.profileData;
      }

      this.updatePostsGrid();
      this.updateLikedPostsGrid();
    }
  }

  disconnectedCallback() {
    if (this.postsObserver) this.postsObserver.disconnect();
    if (this.likedPostsObserver) this.likedPostsObserver.disconnect();
    this.shadowRoot.removeEventListener('post-click', this.handlePostClick);
    this.shadowRoot.removeEventListener('tabChange', this.handleTabChange);
  }
}

customElements.define('profile-index', ProfileIndex);