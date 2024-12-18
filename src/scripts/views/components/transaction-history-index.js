import OrderSource from '../../data/order-source.js';

class TransactionHistoryIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.orders = [];
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
    await this.fetchOrders();
    this.setupIntersectionObserver();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
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

  async handleRetry() {
    this.error = null;
    this.orders = [];
    this.currentPage = 1;
    await this.fetchOrders();
  }

  async handleNextPageRetry() {
    this.nextPageError = null;
    await this.fetchNextOrders();
  }

  setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoadingNext && !this.nextPageError && this.currentPage < this.totalPages) {
          this.fetchNextOrders();
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

  async fetchOrders() {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      const response = await OrderSource.getOrderHistory(1);
      this.orders = response.orders;
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

  async fetchNextOrders() {
    if (this.isLoadingNext) return;

    try {
      this.isLoadingNext = true;
      this.nextPageError = null;
      this.render();

      const response = await OrderSource.getOrderHistory(this.currentPage + 1);
      this.orders = [...this.orders, ...response.orders];
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

  getStateHandlerProps() {
    if (this.isLoading) {
      return { state: 'loading', message: 'Memuat riwayat transaksi...' };
    }

    if (this.error) {
      return {
        state: 'error',
        message: 'Gagal memuat riwayat transaksi. Silakan coba lagi.'
      };
    }

    if (!this.isLoading && this.orders.length === 0) {
      return {
        state: 'empty',
        message: 'Belum ada riwayat transaksi.'
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
          color: #212121;
        }

        @media (max-width: 640px) {
          .container {
            padding: 8px;
          }
        }
      </style>

      <content-state-handler state="${state}" message="${message}">
        ${state === 'success' ? `
          <div>
            ${this.orders.map((order) => `
              <transaction-card 
                order='${JSON.stringify(order)}'
              ></transaction-card>
            `).join('')}
            ${this.currentPage < this.totalPages ? `
              <div id="sentinel"></div>
              <content-state-handler 
                id="next-page-state-handler"
                state="${this.isLoadingNext ? 'loading' : this.nextPageError ? 'error' : 'success'}" 
                message="${this.nextPageError ? 'Gagal memuat transaksi berikutnya. Silakan coba lagi.' : 'Memuat lebih banyak transaksi...'}"
              >
              </content-state-handler>
            ` : ''}
          </div>
        ` : ''}
      </content-state-handler>
    `;

    this.setupEventListeners();
  }
}

customElements.define('transaction-history-index', TransactionHistoryIndex);