import ProfileSource from '../../data/profile-source.js';

class ProfileIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._userId = null;
    this.error = null;
    this.postsError = null;
    this.likedPostsError = null;
    this.productsError = null;
    this.savedProductsError = null;
    this.nextPostsError = null;
    this.nextLikedPostsError = null;
    this.nextProductsError = null;
    this.nextSavedProductsError = null;

    this.activeTab = 'posts';
    this.posts = [];
    this.likedPosts = [];
    this.products = [];
    this.savedProducts = [];
    this.postsPage = 1;
    this.postsTotalPages = 1;
    this.likedPostsPage = 1;
    this.likedPostsTotalPages = 1;
    this.productsPage = 1;
    this.productsTotalPages = 1;
    this.savedProductsPage = 1;
    this.savedProductsTotalPages = 1;
    this.isLoadingPosts = false;
    this.isLoadingLikedPosts = false;
    this.isLoadingProducts = false;
    this.isLoadingSavedProducts = false;
    this.isLoadingInitialData = true;
    this.profileData = null;
    this.hasLoadedLikedPosts = false;
    this.hasLoadedPosts = false;
    this.hasLoadedProducts = false;
    this.hasLoadedSavedProducts = false;

    this.postsObserver = null;
    this.likedPostsObserver = null;
    this.productsObserver = null;
    this.savedProductsObserver = null;

    this.handlePostClick = this.handlePostClick.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handlePostsRetry = this.handlePostsRetry.bind(this);
    this.handleLikedPostsRetry = this.handleLikedPostsRetry.bind(this);
    this.handleProductsRetry = this.handleProductsRetry.bind(this);
    this.handleSavedProductsRetry = this.handleSavedProductsRetry.bind(this);
    this.handleNextPostsRetry = this.handleNextPostsRetry.bind(this);
    this.handleNextLikedPostsRetry = this.handleNextLikedPostsRetry.bind(this);
    this.handleNextProductsRetry = this.handleNextProductsRetry.bind(this);
    this.handleNextSavedProductsRetry = this.handleNextSavedProductsRetry.bind(this);
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

  async handleRetry() {
    this.error = null;
    this.isLoadingInitialData = true;
    this.render();
    await this.fetchInitialData();
  }

  async handlePostsRetry() {
    this.postsError = null;
    await this.fetchPosts(1);
  }

  async handleLikedPostsRetry() {
    this.likedPostsError = null;
    await this.fetchLikedPosts(1);
  }

  async handleProductsRetry() {
    this.productsError = null;
    await this.fetchProducts(1);
  }

  async handleSavedProductsRetry() {
    this.savedProductsError = null;
    await this.fetchSavedProducts(1);
  }

  async handleNextPostsRetry() {
    this.nextPostsError = null;
    await this.fetchPosts(this.postsPage + 1);
  }

  async handleNextLikedPostsRetry() {
    this.nextLikedPostsError = null;
    await this.fetchLikedPosts(this.likedPostsPage + 1);
  }

  async handleNextProductsRetry() {
    this.nextProductsError = null;
    await this.fetchProducts(this.productsPage + 1);
  }

  async handleNextSavedProductsRetry() {
    this.nextSavedProductsError = null;
    await this.fetchSavedProducts(this.savedProductsPage + 1);
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
          border: 1px solid #ebf3fe;
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
        id="main-state-handler"
        state="${this.isLoadingInitialData ? 'loading' : this.error ? 'error' : 'success'}"
        message="${this.error ? 'Gagal memuat profil. Silakan coba lagi.' : 'Memuat profil...'}"
      >
        ${!this.isLoadingInitialData ? `
          ${this.error ? '' : `
            <profile-header></profile-header>
            <profile-tabs active-tab="${this.activeTab}"></profile-tabs>
            
            <div class="tabs-content">
              <div id="posts" class="tab-content ${this.activeTab === 'posts' ? 'active' : ''}">
                <content-state-handler
                  id="posts-state-handler"
                  state="${this.postsError ? 'error' : !this.hasLoadedPosts ? 'loading' : this.posts.length === 0 ? 'empty' : 'success'}"
                  message="${this.postsError ? 'Gagal memuat postingan. Silakan coba lagi.' : !this.hasLoadedPosts ? 'Memuat postingan...' : 'Belum ada postingan yang dibuat.'}"
                >
                  ${!this.postsError && this.hasLoadedPosts && this.posts.length > 0 ? `
                    <div class="grid"></div>
                    <div class="sentinel" id="posts-sentinel"></div>
                    ${this.postsPage < this.postsTotalPages ? `
                      <content-state-handler 
                        id="next-posts-handler"
                        state="${this.isLoadingPosts ? 'loading' : this.nextPostsError ? 'error' : 'success'}"
                        message="${this.nextPostsError ? 'Gagal memuat postingan berikutnya. Silakan coba lagi.' : 'Memuat lebih banyak postingan...'}"
                      >
                      </content-state-handler>
                    ` : ''}
                  ` : ''}
                </content-state-handler>
              </div>

              <div id="etalase" class="tab-content ${this.activeTab === 'etalase' ? 'active' : ''}">
                <content-state-handler
                  id="products-state-handler"
                  state="${this.productsError ? 'error' : !this.hasLoadedProducts && this.activeTab === 'etalase' ? 'loading' : this.hasLoadedProducts && this.products.length === 0 ? 'empty' : 'success'}"
                  message="${this.productsError ? 'Gagal memuat produk. Silakan coba lagi.' : !this.hasLoadedProducts ? 'Memuat produk...' : 'Belum ada produk yang ditambahkan.'}"
                >
                  ${!this.productsError && this.hasLoadedProducts && this.products.length > 0 ? `
                    <div class="grid"></div>
                    <div class="sentinel" id="products-sentinel"></div>
                    ${this.productsPage < this.productsTotalPages ? `
                      <content-state-handler 
                        id="next-products-handler"
                        state="${this.isLoadingProducts ? 'loading' : this.nextProductsError ? 'error' : 'success'}"
                        message="${this.nextProductsError ? 'Gagal memuat produk berikutnya. Silakan coba lagi.' : 'Memuat lebih banyak produk...'}"
                      >
                      </content-state-handler>
                    ` : ''}
                  ` : ''}
                </content-state-handler>
              </div>

              <div id="liked" class="tab-content ${this.activeTab === 'liked' ? 'active' : ''}">
                <content-state-handler
                  id="liked-state-handler"
                  state="${this.likedPostsError ? 'error' : !this.hasLoadedLikedPosts && this.activeTab === 'liked' ? 'loading' : this.hasLoadedLikedPosts && this.likedPosts.length === 0 ? 'empty' : 'success'}"
                  message="${this.likedPostsError ? 'Gagal memuat postingan yang disukai. Silakan coba lagi.' : !this.hasLoadedLikedPosts ? 'Memuat postingan yang disukai...' : 'Belum ada postingan yang disukai.'}"
                >
                  ${!this.likedPostsError && this.hasLoadedLikedPosts && this.likedPosts.length > 0 ? `
                    <div class="grid"></div>
                    <div class="sentinel" id="liked-posts-sentinel"></div>
                    ${this.likedPostsPage < this.likedPostsTotalPages ? `
                      <content-state-handler 
                        id="next-liked-handler"
                        state="${this.isLoadingLikedPosts ? 'loading' : this.nextLikedPostsError ? 'error' : 'success'}"
                        message="${this.nextLikedPostsError ? 'Gagal memuat postingan berikutnya. Silakan coba lagi.' : 'Memuat lebih banyak postingan...'}"
                      >
                      </content-state-handler>
                    ` : ''}
                  ` : ''}
                </content-state-handler>
              </div>

              <div id="tersimpan" class="tab-content ${this.activeTab === 'tersimpan' ? 'active' : ''}">
                <content-state-handler
                  id="saved-products-state-handler"
                  state="${this.savedProductsError ? 'error' : !this.hasLoadedSavedProducts && this.activeTab === 'tersimpan' ? 'loading' : this.hasLoadedSavedProducts && this.savedProducts.length === 0 ? 'empty' : 'success'}"
                  message="${this.savedProductsError ? 'Gagal memuat produk tersimpan. Silakan coba lagi.' : !this.hasLoadedSavedProducts ? 'Memuat produk tersimpan...' : 'Belum ada produk yang disimpan.'}"
                >
                  ${!this.savedProductsError && this.hasLoadedSavedProducts && this.savedProducts.length > 0 ? `
                    <div class="grid"></div>
                    <div class="sentinel" id="saved-products-sentinel"></div>
                    ${this.savedProductsPage < this.savedProductsTotalPages ? `
                      <content-state-handler 
                        id="next-saved-products-handler"
                        state="${this.isLoadingSavedProducts ? 'loading' : this.nextSavedProductsError ? 'error' : 'success'}"
                        message="${this.nextSavedProductsError ? 'Gagal memuat produk berikutnya. Silakan coba lagi.' : 'Memuat lebih banyak produk...'}"
                      >
                      </content-state-handler>
                    ` : ''}
                  ` : ''}
                </content-state-handler>
              </div>
            </div>
          `}
        ` : ''}
      </content-state-handler>
    `;
  }

  async resetAndRefetch() {
    this.posts = [];
    this.likedPosts = [];
    this.products = [];
    this.savedProducts = [];
    this.postsPage = 1;
    this.likedPostsPage = 1;
    this.productsPage = 1;
    this.savedProductsPage = 1;
    this.isLoadingInitialData = true;
    this.error = null;
    this.postsError = null;
    this.likedPostsError = null;
    this.productsError = null;
    this.savedProductsError = null;
    this.profileData = null;
    this.hasLoadedLikedPosts = false;
    this.hasLoadedPosts = false;
    this.hasLoadedProducts = false;
    this.hasLoadedSavedProducts = false;

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

    if (newTab === 'etalase' && !this.hasLoadedProducts) {
      await this.fetchProducts(1);
    }

    if (newTab === 'tersimpan' && !this.hasLoadedSavedProducts) {
      await this.fetchSavedProducts(1);
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
    if (this.productsObserver) this.productsObserver.disconnect();
    if (this.savedProductsObserver) this.savedProductsObserver.disconnect();

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.postsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting &&
          !this.isLoadingPosts &&
          !this.nextPostsError &&
          this.postsPage < this.postsTotalPages) {
          this.fetchPosts(this.postsPage + 1);
        }
      });
    }, options);

    this.likedPostsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting &&
          !this.isLoadingLikedPosts &&
          !this.nextLikedPostsError &&
          this.likedPostsPage < this.likedPostsTotalPages) {
          this.fetchLikedPosts(this.likedPostsPage + 1);
        }
      });
    }, options);

    this.productsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting &&
          !this.isLoadingProducts &&
          !this.nextProductsError &&
          this.productsPage < this.productsTotalPages) {
          this.fetchProducts(this.productsPage + 1);
        }
      });
    }, options);

    this.savedProductsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting &&
          !this.isLoadingSavedProducts &&
          !this.nextSavedProductsError &&
          this.savedProductsPage < this.savedProductsTotalPages) {
          this.fetchSavedProducts(this.savedProductsPage + 1);
        }
      });
    }, options);

    const postsSentinel = this.shadowRoot.querySelector('#posts-sentinel');
    const likedPostsSentinel = this.shadowRoot.querySelector('#liked-posts-sentinel');
    const productsSentinel = this.shadowRoot.querySelector('#products-sentinel');
    const savedProductsSentinel = this.shadowRoot.querySelector('#saved-products-sentinel');

    if (postsSentinel) this.postsObserver.observe(postsSentinel);
    if (likedPostsSentinel) this.likedPostsObserver.observe(likedPostsSentinel);
    if (productsSentinel) this.productsObserver.observe(productsSentinel);
    if (savedProductsSentinel) this.savedProductsObserver.observe(savedProductsSentinel);
  }

  async fetchPosts(page = 1) {
    if (this.isLoadingPosts) return;

    const userId = this.getCurrentUserId();
    if (!userId) {
      if (page === 1) {
        this.postsError = new Error('User ID not found');
      } else {
        this.nextPostsError = new Error('User ID not found');
      }
      this.render();
      return;
    }

    try {
      this.isLoadingPosts = true;
      if (page === 1) {
        this.postsError = null;
      } else {
        this.nextPostsError = null;
      }
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
        this.postsError = error;
      } else {
        this.nextPostsError = error;
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
      if (page === 1) {
        this.likedPostsError = new Error('User ID not found');
      } else {
        this.nextLikedPostsError = new Error('User ID not found');
      }
      this.render();
      return;
    }

    try {
      this.isLoadingLikedPosts = true;
      if (page === 1) {
        this.likedPostsError = null;
      } else {
        this.nextLikedPostsError = null;
      }
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
        this.likedPostsError = error;
      } else {
        this.nextLikedPostsError = error;
      }
    } finally {
      this.isLoadingLikedPosts = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  async fetchProducts(page = 1) {
    if (this.isLoadingProducts) return;

    const userId = this.getCurrentUserId();
    if (!userId) {
      if (page === 1) {
        this.productsError = new Error('User ID not found');
      } else {
        this.nextProductsError = new Error('User ID not found');
      }
      this.render();
      return;
    }

    try {
      this.isLoadingProducts = true;
      if (page === 1) {
        this.productsError = null;
      } else {
        this.nextProductsError = null;
      }
      this.render();

      const response = await ProfileSource.getUserProducts(userId, page);

      if (page === 1) {
        this.products = response.products;
        this.hasLoadedProducts = true;
      } else {
        this.products = [...this.products, ...response.products];
      }

      this.productsPage = response.pagination.currentPage;
      this.productsTotalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Failed to fetch products:', error);
      if (page === 1) {
        this.productsError = error;
      } else {
        this.nextProductsError = error;
      }
    } finally {
      this.isLoadingProducts = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  async fetchSavedProducts(page = 1) {
    if (this.isLoadingSavedProducts) return;

    const userId = this.getCurrentUserId();
    if (!userId) {
      if (page === 1) {
        this.savedProductsError = new Error('User ID not found');
      } else {
        this.nextSavedProductsError = new Error('User ID not found');
      }
      this.render();
      return;
    }

    try {
      this.isLoadingSavedProducts = true;
      if (page === 1) {
        this.savedProductsError = null;
      } else {
        this.nextSavedProductsError = null;
      }
      this.render();

      const response = await ProfileSource.getUserSavedProducts(userId, page);

      if (page === 1) {
        this.savedProducts = response.products;
        this.hasLoadedSavedProducts = true;
      } else {
        this.savedProducts = [...this.savedProducts, ...response.products];
      }

      this.savedProductsPage = response.pagination.currentPage;
      this.savedProductsTotalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Failed to fetch saved products:', error);
      if (page === 1) {
        this.savedProductsError = error;
      } else {
        this.nextSavedProductsError = error;
      }
    } finally {
      this.isLoadingSavedProducts = false;
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

      if (this.products.length > 0) {
        const productsGrid = this.shadowRoot.querySelector('#etalase .grid');
        if (productsGrid) {
          productsGrid.innerHTML = this.products.map(() => '<product-card-profile-1></product-card-profile-1>').join('');
          const cards = productsGrid.querySelectorAll('product-card-profile-1');
          cards.forEach((card, index) => {
            const product = this.products[index];
            card.setAttribute('image', product.image);
            card.setAttribute('category', product.category.name);
            card.setAttribute('name', product.name);
            card.setAttribute('price', `Rp ${product.price.toLocaleString('id-ID')}`);
            card.setAttribute('rating', product.rating);
            card.setAttribute('sold', product.sold);
            card.setAttribute('product-id', product.id);
            card.setAttribute('is-saved', product.isSaved);
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

      if (this.savedProducts.length > 0) {
        const savedProductsGrid = this.shadowRoot.querySelector('#tersimpan .grid');
        if (savedProductsGrid) {
          savedProductsGrid.innerHTML = this.savedProducts.map(() => '<product-card-profile-2></product-card-profile-2>').join('');
          const cards = savedProductsGrid.querySelectorAll('product-card-profile-2');
          cards.forEach((card, index) => {
            const product = this.savedProducts[index];
            card.setAttribute('image', product.image);
            card.setAttribute('category', product.category.name);
            card.setAttribute('name', product.name);
            card.setAttribute('price', `Rp ${product.price.toLocaleString('id-ID')}`);
            card.setAttribute('rating', product.rating);
            card.setAttribute('sold', product.sold);
            card.setAttribute('product-id', product.id);
            card.setAttribute('is-saved', product.isSaved);
          });
        }
      }
    }

    this.setupEventListeners();
    this.setupIntersectionObserver();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('post-click', this.handlePostClick);
    this.shadowRoot.addEventListener('tabChange', this.handleTabChange);

    const mainStateHandler = this.shadowRoot.querySelector('#main-state-handler');
    const postsStateHandler = this.shadowRoot.querySelector('#posts-state-handler');
    const likedStateHandler = this.shadowRoot.querySelector('#liked-state-handler');
    const productsStateHandler = this.shadowRoot.querySelector('#products-state-handler');
    const savedProductsStateHandler = this.shadowRoot.querySelector('#saved-products-state-handler');
    const nextPostsHandler = this.shadowRoot.querySelector('#next-posts-handler');
    const nextLikedHandler = this.shadowRoot.querySelector('#next-liked-handler');
    const nextProductsHandler = this.shadowRoot.querySelector('#next-products-handler');
    const nextSavedProductsHandler = this.shadowRoot.querySelector('#next-saved-products-handler');

    if (mainStateHandler) {
      mainStateHandler.addEventListener('retry', this.handleRetry);
    }
    if (postsStateHandler) {
      postsStateHandler.addEventListener('retry', this.handlePostsRetry);
    }
    if (likedStateHandler) {
      likedStateHandler.addEventListener('retry', this.handleLikedPostsRetry);
    }
    if (productsStateHandler) {
      productsStateHandler.addEventListener('retry', this.handleProductsRetry);
    }
    if (savedProductsStateHandler) {
      savedProductsStateHandler.addEventListener('retry', this.handleSavedProductsRetry);
    }
    if (nextPostsHandler) {
      nextPostsHandler.addEventListener('retry', this.handleNextPostsRetry);
    }
    if (nextLikedHandler) {
      nextLikedHandler.addEventListener('retry', this.handleNextLikedPostsRetry);
    }
    if (nextProductsHandler) {
      nextProductsHandler.addEventListener('retry', this.handleNextProductsRetry);
    }
    if (nextSavedProductsHandler) {
      nextSavedProductsHandler.addEventListener('retry', this.handleNextSavedProductsRetry);
    }
  }

  cleanupEventListeners() {
    const mainStateHandler = this.shadowRoot.querySelector('#main-state-handler');
    const postsStateHandler = this.shadowRoot.querySelector('#posts-state-handler');
    const likedStateHandler = this.shadowRoot.querySelector('#liked-state-handler');
    const productsStateHandler = this.shadowRoot.querySelector('#products-state-handler');
    const savedProductsStateHandler = this.shadowRoot.querySelector('#saved-products-state-handler');
    const nextPostsHandler = this.shadowRoot.querySelector('#next-posts-handler');
    const nextLikedHandler = this.shadowRoot.querySelector('#next-liked-handler');
    const nextProductsHandler = this.shadowRoot.querySelector('#next-products-handler');
    const nextSavedProductsHandler = this.shadowRoot.querySelector('#next-saved-products-handler');

    if (mainStateHandler) {
      mainStateHandler.removeEventListener('retry', this.handleRetry);
    }
    if (postsStateHandler) {
      postsStateHandler.removeEventListener('retry', this.handlePostsRetry);
    }
    if (likedStateHandler) {
      likedStateHandler.removeEventListener('retry', this.handleLikedPostsRetry);
    }
    if (productsStateHandler) {
      productsStateHandler.removeEventListener('retry', this.handleProductsRetry);
    }
    if (savedProductsStateHandler) {
      savedProductsStateHandler.removeEventListener('retry', this.handleSavedProductsRetry);
    }
    if (nextPostsHandler) {
      nextPostsHandler.removeEventListener('retry', this.handleNextPostsRetry);
    }
    if (nextLikedHandler) {
      nextLikedHandler.removeEventListener('retry', this.handleNextLikedPostsRetry);
    }
    if (nextProductsHandler) {
      nextProductsHandler.removeEventListener('retry', this.handleNextProductsRetry);
    }
    if (nextSavedProductsHandler) {
      nextSavedProductsHandler.removeEventListener('retry', this.handleNextSavedProductsRetry);
    }

    this.shadowRoot.removeEventListener('post-click', this.handlePostClick);
    this.shadowRoot.removeEventListener('tabChange', this.handleTabChange);
  }

  disconnectedCallback() {
    if (this.postsObserver) this.postsObserver.disconnect();
    if (this.likedPostsObserver) this.likedPostsObserver.disconnect();
    if (this.productsObserver) this.productsObserver.disconnect();
    if (this.savedProductsObserver) this.savedProductsObserver.disconnect();
    this.cleanupEventListeners();
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
