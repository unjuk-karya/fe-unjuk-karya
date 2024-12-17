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

    this.handleRetry = this.handleRetry.bind(this);
    this.handleNextPageRetry = this.handleNextPageRetry.bind(this);
    this.handlePostClick = this.handlePostClick.bind(this);
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
    if (mainStateHandler) {
      mainStateHandler.addEventListener('retry', this.handleRetry);
    }

    const nextPageStateHandler = this.shadowRoot.querySelector('#next-page-state-handler');
    if (nextPageStateHandler) {
      nextPageStateHandler.addEventListener('retry', this.handleNextPageRetry);
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

  disconnectedCallback() {
    const mainStateHandler = this.shadowRoot.querySelector('content-state-handler');
    const nextPageStateHandler = this.shadowRoot.querySelector('#next-page-state-handler');

    if (mainStateHandler) {
      mainStateHandler.removeEventListener('retry', this.handleRetry);
    }
    if (nextPageStateHandler) {
      nextPageStateHandler.removeEventListener('retry', this.handleNextPageRetry);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    this.shadowRoot.removeEventListener('post-click', this.handlePostClick);
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

      const response = await PostSource.getAllPosts(1, pageSize);
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

      const response = await PostSource.getAllPosts(this.currentPage + 1, 12);
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
        message: 'Belum ada postingan untuk ditampilkan.'
      };
    }

    return { state: 'success' };
  }

  render() {
    const { state, message } = this.getStateHandlerProps();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          margin: 0;
        }

        .container-explore {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          padding: 16px;
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
}

customElements.define('explore-index', ExploreIndex);