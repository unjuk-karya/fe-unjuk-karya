import ProductSource from '../../data/product-source';

class MarketplaceIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.products = [];
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
    this.handleSearch = this.handleSearch.bind(this);
  }

  async connectedCallback() {
    await this.fetchProducts();
    this.render();
    this.setupIntersectionObserver();
    this.setupEventListeners();
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
      this.products = [];
      this.currentPage = 1;
      await this.fetchProducts();
    }
  }

  async handleRetry() {
    this.error = null;
    this.products = [];
    this.currentPage = 1;
    await this.fetchProducts();
  }

  async handleNextPageRetry() {
    this.nextPageError = null;
    await this.fetchNextProducts();
  }

  async fetchProducts() {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await ProductSource.getAllProducts(1, 8, this.searchQuery);
      this.products = response.products.map((product) => ({
        id: product.id,
        image: product.image,
        category: product.category.name,
        rating: product.rating,
        name: product.name,
        price: `Rp ${product.price.toLocaleString('id-ID')}`,
        sold: product.sold,
        isSaved: product.isSaved
      }));
      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Error fetching products:', error);
      this.error = error;
    } finally {
      this.isLoading = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  async fetchNextProducts() {
    if (this.isLoadingNext) return;

    try {
      this.isLoadingNext = true;
      this.nextPageError = null;
      this.render();

      const response = await ProductSource.getAllProducts(
        this.currentPage + 1,
        8,
        this.searchQuery
      );

      const newProducts = response.products.map((product) => ({
        id: product.id,
        image: product.image,
        category: product.category.name,
        rating: product.rating,
        name: product.name,
        price: `Rp ${product.price.toLocaleString('id-ID')}`,
        sold: product.sold,
        isSaved: product.isSaved
      }));

      this.products = [...this.products, ...newProducts];
      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;

    } catch (error) {
      console.error('Error fetching next products:', error);
      this.nextPageError = error;
    } finally {
      this.isLoadingNext = false;
      this.render();
      this.setupIntersectionObserver();
    }
  }

  getStateHandlerProps() {
    if (this.isLoading) {
      return { state: 'loading', message: 'Memuat produk...' };
    }

    if (this.error) {
      return {
        state: 'error',
        message: 'Gagal memuat produk. Silakan coba lagi.'
      };
    }

    if (!this.isLoading && this.products.length === 0) {
      return {
        state: 'empty',
        message: this.searchQuery ?
          'Tidak ada produk yang sesuai dengan pencarian.' :
          'Belum ada produk yang ditampilkan.'
      };
    }

    return { state: 'success' };
  }

  render() {
    // The render method remains the same, but we'll update the search form
    // to maintain the search value
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
         transition: all 0.2s ease;
         font-family: 'Plus Jakarta Sans', sans-serif;
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
         background-color: #4f73d9;
       }

       .search-button i {
         font-size: 16px;
       }

       .products-grid {
         display: grid;
         grid-template-columns: repeat(4, 1fr);
         gap: 20px;
       }

       @media screen and (max-width: 1200px) {
         .products-grid {
           grid-template-columns: repeat(3, 1fr);
         }
       }

       @media screen and (max-width: 900px) {
         .products-grid {
           grid-template-columns: repeat(2, 1fr);
         }
       }

       @media screen and (max-width: 600px) {
         .products-grid {
           grid-template-columns: 1fr;
           gap: 10px;
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
            placeholder="Cari produk..."
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
          <div class="products-grid">
            ${this.products.map((product) => `
              <product-card
                image="${product.image}"
                category="${product.category}"
                rating="${product.rating}"
                name="${product.name}"
                price="${product.price}"
                sold="${product.sold}"
                product-id="${product.id}"
                is-saved="${product.isSaved}"  
              ></product-card>
            `).join('')}
          </div>
          ${this.currentPage < this.totalPages ? `
            <div id="sentinel"></div>
            <content-state-handler 
              id="next-page-state-handler"
              state="${this.isLoadingNext ? 'loading' : this.nextPageError ? 'error' : 'success'}" 
              message="${this.nextPageError ? 'Gagal memuat produk berikutnya. Silakan coba lagi.' : 'Memuat lebih banyak produk...'}"
            >
            </content-state-handler>
          ` : ''}
        ` : ''}
      </content-state-handler>
    `;

    this.setupEventListeners();
  }

  setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoadingNext && !this.nextPageError && this.currentPage < this.totalPages) {
          this.fetchNextProducts();
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

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
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
  }
}

customElements.define('marketplace-index', MarketplaceIndex);
