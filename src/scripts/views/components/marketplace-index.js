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

    this.handleRetry = this.handleRetry.bind(this);
    this.handleNextPageRetry = this.handleNextPageRetry.bind(this);
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

    if (mainStateHandler) {
      mainStateHandler.addEventListener('retry', this.handleRetry);
    }
    if (nextPageStateHandler) {
      nextPageStateHandler.addEventListener('retry', this.handleNextPageRetry);
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

  async fetchProducts() {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await ProductSource.getAllProducts(1);
      this.products = response.products.map((product) => ({
        id: product.id,
        image: product.image,
        category: product.category.name,
        rating: product.rating,
        name: product.name,
        price: `Rp ${product.price.toLocaleString('id-ID')}`,
        sold: product.sold,
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

      const response = await ProductSource.getAllProducts(this.currentPage + 1);
      const newProducts = response.products.map((product) => ({
        id: product.id,
        image: product.image,
        category: product.category.name,
        rating: product.rating,
        name: product.name,
        price: `Rp ${product.price.toLocaleString('id-ID')}`,
        sold: product.sold,
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
        message: 'Belum ada produk yang ditampilkan.'
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
       }

       #sentinel {
         width: 100%;
         height: 1px;
         visibility: hidden;
       }
     </style>

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

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
    const mainStateHandler = this.shadowRoot.querySelector('content-state-handler');
    const nextPageStateHandler = this.shadowRoot.querySelector('#next-page-state-handler');

    if (mainStateHandler) {
      mainStateHandler.removeEventListener('retry', this.handleRetry);
    }
    if (nextPageStateHandler) {
      nextPageStateHandler.removeEventListener('retry', this.handleNextPageRetry);
    }
  }
}

customElements.define('marketplace-index', MarketplaceIndex);