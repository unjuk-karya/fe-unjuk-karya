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

  async fetchPosts(pageSize = 8) {
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

      const response = await PostSource.getFeedPosts(this.currentPage + 1, 8);
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
          grid-template-columns: repeat(3, 1fr);
          // grid-template-columns: 800px;
          gap: 32px;
          width: 100%;
          box-sizing: border-box;
          justify-content: center;
        }

        post-card-home {
          width: 100%;
        }

        @media screen and (max-width: 600px) {
          .container-home {
            grid-template-columns: 1fr;
            padding: 0;
            gap: 1px;
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