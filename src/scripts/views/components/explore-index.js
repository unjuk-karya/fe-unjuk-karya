import PostSource from '../../data/post-source.js';
import './post/post-card.js';
import './post/post-detail.js';

class ExploreIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.posts = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;
    this.debounceTimeout = null;
    this.observer = null;
  }

  async connectedCallback() {
    await this.fetchPosts();
    this.render();
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoading && this.currentPage < this.totalPages) {
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

  async fetchPosts(page = 1, pageSize = 12) {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      const response = await PostSource.getAllPosts(page, pageSize);

      if (page === 1) {
        this.posts = response.posts;
      } else {
        this.posts = [...this.posts, ...response.posts];
      }

      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      this.isLoading = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }

        .container-explore {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin: 0;
          padding: 0;
        }

        @media screen and (max-width: 1200px) {
          .container-explore {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media screen and (max-width: 900px) {
          .container-explore {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media screen and (max-width: 600px) {
          .container-explore {
            grid-template-columns: repeat(1, 1fr);
            gap: 16px;
          }
          :host {
            padding: 16px;
          }
        }

        #sentinel {
          width: 100%;
          height: 20px;
          visibility: hidden;
          grid-column: 1 / -1;
          margin-top: 20px;
        }
      </style>

      <div class="container-explore" id="postsContainer"></div>
      ${this.currentPage < this.totalPages ? '<div id="sentinel"></div>' : ''}
    `;

    const container = this.shadowRoot.getElementById('postsContainer');

    if (this.posts && this.posts.length > 0) {
      this.posts.forEach((post) => {
        const postCard = document.createElement('post-card');
        postCard.post = post;
        container.appendChild(postCard);
      });
    }

    this.setupEventListeners();
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }
}

customElements.define('explore-index', ExploreIndex);