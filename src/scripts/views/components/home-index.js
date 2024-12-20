import PostSource from '../../data/post-source.js';

class HomeIndex extends HTMLElement {
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
  }

  async connectedCallback() {
    await this.fetchPosts();
    this.render();
    this.setupIntersectionObserver();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const mainStateHandler = this.shadowRoot.querySelector('content-state-handler');
    const nextPageStateHandler = this.shadowRoot.querySelector('#next-page-state-handler');

    if (mainStateHandler) {
      mainStateHandler.addEventListener('retry', this.handleRetry);
    }
    if (nextPageStateHandler) {
      nextPageStateHandler.addEventListener('retry', this.handleNextPageRetry);
    }
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

  async fetchPosts(pageSize = 9) {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await PostSource.getFeedPosts(1, pageSize);
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

      const response = await PostSource.getFeedPosts(this.currentPage + 1, 9);
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
      const postCard = document.createElement('post-card-home');
      postCard.data = post;
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
        message: 'Belum ada postingan. Ikuti lebih banyak orang untuk melihat postingan mereka.'
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

        .container-home {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          width: 100%;
          margin: 0 auto;
          padding: 16px;
          box-sizing: border-box;
        }

        /* Large screens */
        @media screen and (min-width: 1200px) {
          .container-home {
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }
        }

        /* Medium screens */
        @media screen and (max-width: 1199px) and (min-width: 768px) {
          .container-home {
            grid-template-columns: repeat(3, 1fr);
            max-width: 900px;
            gap: 24px;
            padding: 16px;
          }
        }

        /* Small screens */
        @media screen and (max-width: 767px) {
          .container-home {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 12px;
            max-width: 100%;
          }
        }

        /* Extra small screens */
        @media screen and (max-width: 480px) {
          .container-home {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 8px;
          }
        }

        post-card-home {
          width: 100%;
          display: block;
          min-width: 0;
        }

        #sentinel {
          width: 100%;
          height: 1px;
          visibility: hidden;
          grid-column: 1 / -1;
        }
      </style>

      <content-state-handler state="${state}" message="${message}">
        ${state === 'success' ? `
          <div class="container-home" id="postsContainer"></div>
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

customElements.define('home-index', HomeIndex);