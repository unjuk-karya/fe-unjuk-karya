import ProfileSource from '../../data/profile-source.js';

class ProfileIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._userId = null;
    this.error = null;

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

        .sentinel {
          width: 100%;
          height: 1px;
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

      <content-state-handler 
        state="${this.isLoadingInitialData ? 'loading' : this.error ? 'error' : 'success'}"
        message="${this.error ? 'Gagal memuat profil. Silakan coba lagi.' : 'Memuat profil...'}"
      >
        ${!this.isLoadingInitialData && !this.error ? `
          <profile-header></profile-header>
          <profile-tabs active-tab="${this.activeTab}"></profile-tabs>
          
          <div class="tabs-content">
            <div id="posts" class="tab-content ${this.activeTab === 'posts' ? 'active' : ''}">
              ${!this.hasLoadedPosts ? `
                <content-state-handler state="loading" message="Memuat postingan...">
                </content-state-handler>
              ` : this.posts.length === 0 ? `
                <content-state-handler state="empty" message="Belum ada postingan yang dibuat.">
                </content-state-handler>
              ` : `
                <div class="grid"></div>
                <div class="sentinel" id="posts-sentinel"></div>
                ${this.isLoadingPosts ? `
                  <content-state-handler state="loading" message="Memuat lebih banyak postingan...">
                  </content-state-handler>
                ` : ''}
              `}
            </div>

            <div id="etalase" class="tab-content ${this.activeTab === 'etalase' ? 'active' : ''}">
              <content-state-handler state="empty" message="Etalase masih kosong.">
              </content-state-handler>
            </div>

            <div id="liked" class="tab-content ${this.activeTab === 'liked' ? 'active' : ''}">
              ${!this.hasLoadedLikedPosts && this.activeTab === 'liked' ? `
                <content-state-handler state="loading" message="Memuat postingan yang disukai...">
                </content-state-handler>
              ` : this.hasLoadedLikedPosts && this.likedPosts.length === 0 ? `
                <content-state-handler state="empty" message="Belum ada postingan yang disukai.">
                </content-state-handler>
              ` : `
                <div class="grid"></div>
                <div class="sentinel" id="liked-posts-sentinel"></div>
                ${this.isLoadingLikedPosts ? `
                  <content-state-handler state="loading" message="Memuat lebih banyak postingan...">
                  </content-state-handler>
                ` : ''}
              `}
            </div>
          </div>
        ` : ''}
      </content-state-handler>
    `;
  }

  async resetAndRefetch() {
    this.posts = [];
    this.likedPosts = [];
    this.postsPage = 1;
    this.likedPostsPage = 1;
    this.isLoadingInitialData = true;
    this.error = null;
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
      this.error = new Error('User ID not found');
      this.render();
      return;
    }

    try {
      this.isLoadingPosts = true;
      this.render();

      const response = await ProfileSource.getUserPosts(userId, page);

      if (page === 1) {
        this.posts = response.posts;
        this.hasLoadedPosts = true;
      } else {
        this.posts = [...this.posts, ...response.posts];
      }

      this.postsPage = response.pagination.currentPage;
      this.postsTotalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Failed to fetch posts:', error);
      if (page === 1) {
        this.error = error;
      }
    } finally {
      this.isLoadingPosts = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  async fetchLikedPosts(page = 1) {
    if (this.isLoadingLikedPosts) return;

    const userId = this.getCurrentUserId();
    if (!userId) {
      this.error = new Error('User ID not found');
      this.render();
      return;
    }

    try {
      this.isLoadingLikedPosts = true;
      this.render();

      const response = await ProfileSource.getUserLikedPosts(userId, page);

      if (page === 1) {
        this.likedPosts = response.posts;
        this.hasLoadedLikedPosts = true;
      } else {
        this.likedPosts = [...this.likedPosts, ...response.posts];
      }

      this.likedPostsPage = response.pagination.currentPage;
      this.likedPostsTotalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
      if (page === 1) {
        this.error = error;
      }
    } finally {
      this.isLoadingLikedPosts = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  async fetchInitialData() {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.error = new Error('User ID not found');
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
      this.error = null;

    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.status === 404) {
        window.location.hash = '#/not-found';
        return;
      }
      this.error = error;
    } finally {
      this.isLoadingInitialData = false;
      this.render();

      if (!this.error) {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        await this.fetchPosts(1);
      }
    }
  }

  async connectedCallback() {
    this.render();
    await this.fetchInitialData();
  }

  render() {
    this.shadowRoot.innerHTML = this.createTemplate();

    if (!this.isLoadingInitialData && !this.error) {
      const profileHeader = this.shadowRoot.querySelector('profile-header');
      if (profileHeader) {
        profileHeader.profileData = this.profileData;
      }

      if (this.posts.length > 0) {
        const postsGrid = this.shadowRoot.querySelector('#posts .grid');
        if (postsGrid) {
          postsGrid.innerHTML = this.posts.map(() => '<post-card-profile-1></post-card-profile-1>').join('');
          const cards = postsGrid.querySelectorAll('post-card-profile-1');
          cards.forEach((card, index) => {
            card.post = this.posts[index];
          });
        }
      }

      if (this.likedPosts.length > 0) {
        const likedGrid = this.shadowRoot.querySelector('#liked .grid');
        if (likedGrid) {
          likedGrid.innerHTML = this.likedPosts.map(() => '<post-card-profile-2></post-card-profile-2>').join('');
          const cards = likedGrid.querySelectorAll('post-card-profile-2');
          cards.forEach((card, index) => {
            card.post = this.likedPosts[index];
          });
        }
      }
    }
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('post-click', this.handlePostClick);
    this.shadowRoot.addEventListener('tabChange', this.handleTabChange);
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