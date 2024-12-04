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

    this._userId = null;

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
    this.hasLoadedLikedPosts = false;
    this.hasLoadedPosts = false;

    this.tabsContent = null;
    this.postsTab = null;
    this.likedTab = null;
    this.etalaseTab = null;

    this.postsObserver = null;
    this.likedPostsObserver = null;

    this.handlePostClick = this.handlePostClick.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  get userId() {
    return this._userId;
  }

  set userId(value) {
    if (this._userId !== value) {
      this._userId = value;
      this.resetAndRefetch();
    }
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
          display: none;
        }

        .bottom-loader {
          grid-column: 1 / -1;
          display: flex;
          justify-content: center;
          padding: 20px;
        }

        .sentinel {
          width: 100%;
          height: 0px;
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
            ${this.hasLoadedPosts ? `
              <div class="empty-state">
                <p>Belum ada postingan yang dibuat.</p>
              </div>
            ` : ''}
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
            ${this.hasLoadedLikedPosts ? `
              <div class="empty-state">
                <p>Belum ada postingan yang disukai.</p>
              </div>
            ` : ''}
            <div class="sentinel" id="liked-posts-sentinel"></div>
            <div class="bottom-loader" style="display: none">
              <loading-indicator></loading-indicator>
            </div>
          </div>
        </div>
      `}
    `;
  }

  async resetAndRefetch() {
    this.posts = [];
    this.likedPosts = [];
    this.postsPage = 1;
    this.likedPostsPage = 1;
    this.isLoadingInitialData = true;
    this.profileData = null;
    this.hasLoadedLikedPosts = false;
    this.hasLoadedPosts = false;

    this.render();
    await this.fetchInitialData();
  }

  getCurrentUserId() {
    if (this._userId) {
      return this._userId;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id;
    } catch (error) {
      console.error('Failed to get user from localStorage:', error);
      return null;
    }
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

    if (newTab === 'liked' && !this.hasLoadedLikedPosts) {
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

    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    try {
      this.isLoadingPosts = true;
      this.updateLoadingState('posts', true);

      const response = await ProfileSource.getUserPosts(userId, page);

      if (page === 1) {
        this.posts = response.posts;
        this.hasLoadedPosts = true;
        this.render();
        this.updateEmptyState('posts', this.posts.length === 0);
      } else {
        this.posts = [...this.posts, ...response.posts];
      }

      this.postsPage = response.pagination.currentPage;
      this.postsTotalPages = response.pagination.totalPages;

      this.updatePostsGrid();
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      this.hasLoadedPosts = true;
      this.render();
      this.updateEmptyState('posts', true);
    } finally {
      this.isLoadingPosts = false;
      this.updateLoadingState('posts', false);
    }
  }

  async fetchLikedPosts(page = 1) {
    if (this.isLoadingLikedPosts) return;

    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    try {
      this.isLoadingLikedPosts = true;
      this.updateLoadingState('liked', true);

      const response = await ProfileSource.getUserLikedPosts(userId, page);

      if (page === 1) {
        this.likedPosts = response.posts;
        this.hasLoadedLikedPosts = true;
        this.render();
        this.updateEmptyState('liked', this.likedPosts.length === 0);
      } else {
        this.likedPosts = [...this.likedPosts, ...response.posts];
      }

      this.likedPostsPage = response.pagination.currentPage;
      this.likedPostsTotalPages = response.pagination.totalPages;

      this.updateLikedPostsGrid();
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
      this.hasLoadedLikedPosts = true;
      this.render();
      this.updateEmptyState('liked', true);
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

  updateEmptyState(tab, isEmpty) {
    const grid = this.shadowRoot.querySelector(`#${tab} .grid`);
    const emptyState = this.shadowRoot.querySelector(`#${tab} .empty-state`);

    if (grid && emptyState) {
      const shouldShowEmpty = isEmpty && (
        (tab === 'liked' && this.hasLoadedLikedPosts) ||
        (tab === 'posts' && this.hasLoadedPosts)
      );

      grid.style.display = shouldShowEmpty ? 'none' : 'grid';
      emptyState.style.display = shouldShowEmpty ? 'block' : 'none';
    }
  }

  updatePostsGrid() {
    const grid = this.shadowRoot.querySelector('#posts .grid');
    if (!grid) return;

    if (this.posts.length > 0) {
      grid.innerHTML = this.posts.map(() => '<post-card-profile-1></post-card-profile-1>').join('');
      const cards = grid.querySelectorAll('post-card-profile-1');
      cards.forEach((card, index) => {
        card.post = this.posts[index];
      });
    }
  }

  updateLikedPostsGrid() {
    const grid = this.shadowRoot.querySelector('#liked .grid');
    if (!grid) return;

    if (this.likedPosts.length > 0) {
      grid.innerHTML = this.likedPosts.map(() => '<post-card-profile-2></post-card-profile-2>').join('');
      const cards = grid.querySelectorAll('post-card-profile-2');
      cards.forEach((card, index) => {
        card.post = this.likedPosts[index];
      });
    }
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('post-click', this.handlePostClick);
    this.shadowRoot.addEventListener('tabChange', this.handleTabChange);
  }

  async fetchInitialData() {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('No user ID available');
      this.isLoadingInitialData = false;
      this.render();
      return;
    }

    try {
      const profile = await ProfileSource.getUserProfile(userId);

      if (!profile || profile.status === 404) {
        window.location.hash = '#/not-found';
        return;
      }

      this.profileData = profile;
      this.isLoadingInitialData = false;
      this.render();
      this.setupEventListeners();

      this.updateLoadingState('posts', true);
      await this.fetchPosts(1);

    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      if (error.status === 404) {
        window.location.hash = '#/not-found';
        return;
      }
      this.isLoadingInitialData = false;
      this.render();
    } finally {
      this.setupIntersectionObserver();
    }
  }

  async connectedCallback() {
    this.render();
    await this.fetchInitialData();
  }

  render() {
    this.shadowRoot.innerHTML = this.createTemplate();

    if (!this.isLoadingInitialData) {
      const profileHeader = this.shadowRoot.querySelector('profile-header');
      if (profileHeader) {
        profileHeader.profileData = this.profileData;
      }

      this.updateEmptyState('posts', this.posts.length === 0);
      if (this.hasLoadedLikedPosts) {
        this.updateEmptyState('liked', this.likedPosts.length === 0);
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

  static get observedAttributes() {
    return ['user-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'user-id' && oldValue !== newValue) {
      this.userId = newValue;
    }
  }
}

customElements.define('profile-index', ProfileIndex);