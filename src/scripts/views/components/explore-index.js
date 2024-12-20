import PostSource from '../../data/post-source.js';

class ExploreIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.posts = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;
    this.isLoadingNext = false;
    this.error = null;
    this.nextPageError = null;
    this.observer = null;
    this.searchQuery = '';

    this.handleRetry = this.handleRetry.bind(this);
    this.handleNextPageRetry = this.handleNextPageRetry.bind(this);
    this.handlePostClick = this.handlePostClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  async connectedCallback() {
    await this.fetchPosts();
    this.render();
    this.setupIntersectionObserver();
    this.setupEventListeners();
    this.shadowRoot.addEventListener('post-click', this.handlePostClick);
  }

  setupEventListeners() {
    const mainStateHandler = this.shadowRoot.querySelector('content-state-handler');
    const nextPageStateHandler = this.shadowRoot.querySelector('#next-page-state-handler');
    const searchForm = this.shadowRoot.querySelector('.search-form');

    if (mainStateHandler) {
      mainStateHandler.addEventListener('retry', this.handleRetry);
    }
    if (nextPageStateHandler) {
      nextPageStateHandler.addEventListener('retry', this.handleNextPageRetry);
    }
    if (searchForm) {
      searchForm.addEventListener('submit', this.handleSearch);
    }
  }

  async handleSearch(event) {
    event.preventDefault();
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const newSearchQuery = searchInput.value.trim();

    if (this.searchQuery !== newSearchQuery) {
      this.searchQuery = newSearchQuery;
      this.posts = [];
      this.currentPage = 1;
      await this.fetchPosts();
    }
  }

  handlePostClick(e) {
    const postDetail = document.createElement('post-detail');
    postDetail.postId = e.detail.postId;
    document.body.appendChild(postDetail);
  }

  async handleRetry() {
    this.error = null;
    this.posts = [];
    this.currentPage = 1;
    await this.fetchPosts();
  }

  async handleNextPageRetry() {
    this.nextPageError = null;
    await this.fetchNextPosts();
  }

  setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoadingNext && !this.nextPageError && this.currentPage < this.totalPages) {
          this.fetchNextPosts();
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

  async fetchPosts(pageSize = 12) {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await PostSource.getAllPosts(1, pageSize, this.searchQuery);
      this.posts = response.posts;
      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Fetch error:', error);
      this.error = error;
    } finally {
      this.isLoading = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  async fetchNextPosts() {
    if (this.isLoadingNext) return;

    try {
      this.isLoadingNext = true;
      this.nextPageError = null;
      this.render();

      const response = await PostSource.getAllPosts(
        this.currentPage + 1,
        12,
        this.searchQuery
      );
      this.posts = [...this.posts, ...response.posts];
      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Fetch next error:', error);
      this.nextPageError = error;
    } finally {
      this.isLoadingNext = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  renderPosts() {
    const container = this.shadowRoot.querySelector('#postsContainer');
    if (!container) return;

    container.innerHTML = '';
    this.posts.forEach((post) => {
      const postCard = document.createElement('post-card-explore');
      postCard.post = post;
      container.appendChild(postCard);
    });
  }

  getStateHandlerProps() {
    if (this.isLoading) {
      return { state: 'loading', message: 'Memuat postingan...' };
    }

    if (this.error) {
      return {
        state: 'error',
        message: 'Gagal memuat postingan. Silakan coba lagi.'
      };
    }

    if (!this.isLoading && this.posts.length === 0) {
      return {
        state: 'empty',
        message: this.searchQuery ?
          'Tidak ada postingan yang sesuai dengan pencarian.' :
          'Belum ada postingan untuk ditampilkan.'
      };
    }

    return { state: 'success' };
  }

  render() {
    const { state, message } = this.getStateHandlerProps();

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          margin: 0;
        }

        .search-container {
          margin-bottom: 24px;
          display: flex;
          justify-content: flex-end;
          padding: 0 16px;
        }

        .search-form {
          width: 100%;
          max-width: 600px;
          display: flex;
          gap: 8px;
        }

        .search-input {
          flex: 1;
          height: 44px;
          padding: 0 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #1D77E6;
          box-shadow: 0 0 0 3px rgba(29, 119, 230, 0.1);
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-button {
          height: 44px;
          padding: 0 24px;
          background: #5d87ff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-button:hover {
          background: #4f73d9;
        }

        .search-button i {
          font-size: 16px;
        }

        .container-explore {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        @media screen and (min-width: 1200px) {
          .container-explore {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }
        }

        @media screen and (max-width: 1199px) {
          .container-explore {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
        }

        @media screen and (max-width: 900px) {
          .container-explore {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
            padding: 8px;
          }

          .search-container {
            position: relative;
            z-index: 10;
          }

          .search-form {
            max-width: 300px;
          }

          .search-input {
            height: 40px;
          }

          .search-button {
            height: 40px;
            padding: 0 16px;
            white-space: nowrap;
          }
        }

        @media screen and (max-width: 600px) {
          .container-explore {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 12px;
            padding: 4px;
          }
        }

        @media screen and (max-width: 400px) {
          .container-explore {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 8px;
            padding: 4px;
          }
        }

        #sentinel {
          width: 100%;
          height: 1px;
          visibility: hidden;
        }
      </style>

      <div class="search-container">
        <form class="search-form">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Cari postingan..."
            value="${this.searchQuery}"
          >
          <button type="submit" class="search-button">
            <i class="fas fa-search"></i>
            Cari
          </button>
        </form>
      </div>

      <content-state-handler state="${state}" message="${message}">
        ${state === 'success' ? `
          <div class="container-explore" id="postsContainer"></div>
          ${this.currentPage < this.totalPages ? `
            <div id="sentinel"></div>
            <content-state-handler 
              id="next-page-state-handler"
              state="${this.isLoadingNext ? 'loading' : this.nextPageError ? 'error' : 'success'}" 
              message="${this.nextPageError ? 'Gagal memuat postingan berikutnya. Silakan coba lagi.' : 'Memuat lebih banyak postingan...'}"
            >
            </content-state-handler>
          ` : ''}
        ` : ''}
      </content-state-handler>
    `;

    if (state === 'success') {
      this.renderPosts();
    }

    this.setupEventListeners();
  }

  disconnectedCallback() {
    const mainStateHandler = this.shadowRoot.querySelector('content-state-handler');
    const nextPageStateHandler = this.shadowRoot.querySelector('#next-page-state-handler');
    const searchForm = this.shadowRoot.querySelector('.search-form');

    if (mainStateHandler) {
      mainStateHandler.removeEventListener('retry', this.handleRetry);
    }
    if (nextPageStateHandler) {
      nextPageStateHandler.removeEventListener('retry', this.handleNextPageRetry);
    }
    if (searchForm) {
      searchForm.removeEventListener('submit', this.handleSearch);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    this.shadowRoot.removeEventListener('post-click', this.handlePostClick);
  }
}

customElements.define('explore-index', ExploreIndex);
