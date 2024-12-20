import ProductSource from '../../data/product-source.js';

class ProductDetailIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      product: null,
      contentState: 'loading',
      errorMessage: ''
    };

    this.quantity = 1;
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleBuyNow = this.handleBuyNow.bind(this);
    this.handleSellerProfile = this.handleSellerProfile.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
  }

  static get observedAttributes() {
    return ['product-id'];
  }

  async connectedCallback() {
    const productId = this.getAttribute('product-id');
    if (productId) {
      await this.fetchProductDetail(productId);
    } else {
      this.state.contentState = 'error';
      this.state.errorMessage = 'Product ID not found';
      this.render();
    }
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'product-id' && oldValue !== null && oldValue !== newValue) {
      await this.fetchProductDetail(newValue);
    }
  }

  async fetchProductDetail(productId) {
    try {
      this.state.contentState = 'loading';
      this.render();

      const productData = await ProductSource.getProductDetail(productId);
      if (!productData) {
        window.location.href = '#/not-found';
        return;
      }
      this.state.product = productData;
      this.state.contentState = 'success';
    } catch (error) {
      console.error('Error fetching product:', error);
      this.state.contentState = 'error';
      this.state.errorMessage = 'Gagal memuat data produk.';

      if (error.status === 404) {
        window.location.href = '#/not-found';
        return;
      }
    }
    this.render();
  }

  handleQuantityChange(action) {
    if (action === 'decrease' && this.quantity > 1) {
      this.quantity--;
    } else if (action === 'increase' && this.quantity < this.state.product.stock) {
      this.quantity++;
    }
    this.render();
  }

  handleBuyNow() {
    console.log('Buying:', {
      productId: this.state.product.id,
      quantity: this.quantity,
      totalPrice: this.quantity * this.state.product.price
    });
  }

  handleSellerProfile() {
    if (this.state.product?.user?.id) {
      window.location.href = `#/profile/${this.state.product.user.id}`;
    }
  }

  async handleRetry() {
    const productId = this.getAttribute('product-id');
    if (productId) {
      await this.fetchProductDetail(productId);
    }
  }

  render() {
    const { contentState, errorMessage, product } = this.state;
    const productId = this.getAttribute('product-id');

    this.shadowRoot.innerHTML = `
    
      <style>
              @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

        :host {
          display: block;
          --primary-color: #1D77E6;
          --primary-hover: #1565c0;
          --bg-gray: #f8f9fa;
          --text-gray: #666;
          --border-color: #eee;
          --card-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          --card-radius: 16px;
          min-height: 100vh;
          padding: 20px 0;
        }

        .container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin: 0 auto;
        }

        .description-card {
          background: white;
          border: 1px solid #ebf1f6;
          border-radius: var(--card-radius);
          box-shadow: var(--card-shadow);
          overflow: hidden;
          margin: 0;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          font-weight: 600;
          color: #333;
          border-bottom: 1px solid var(--border-color);
        }

        .description-content {
          padding: 24px;
          line-height: 1.6;
          color: #444;
          white-space: pre-line;
        }

        @media screen and (max-width: 768px) {
          .container {
            padding: 0;
            gap: 12px;
          }

          .description-card {
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          }

          .description-content {
            padding: 16px;
          }
        }

        @media screen and (max-width: 480px) {
          :host {
            padding: 8px;
          }

          .card-title {
padding: 12px 16px;
          }
        }
      </style>

      <content-state-handler 
        state="${contentState}"
        message="${errorMessage}">
        ${contentState === 'success' ? `
          <div class="container">
            <product-detail-card
              product='${JSON.stringify(product)}'
              quantity="${this.quantity}">
            </product-detail-card>

            <product-detail-seller
              seller-data='${JSON.stringify(product.user)}'>
            </product-detail-seller>

            <div class="description-card">
              <div class="card-title">
                <i class="fas fa-info-circle"></i>
                Deskripsi Produk
              </div>
              <div class="description-content">
                <p>${product.description || 'Tidak ada deskripsi produk.'}</p>
              </div>
            </div>

            <product-reviews 
              product-id="${productId}">
            </product-reviews>
          </div>
        ` : ''}
      </content-state-handler>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const productCard = this.shadowRoot.querySelector('product-detail-card');
    const sellerCard = this.shadowRoot.querySelector('product-detail-seller');
    const mainContentHandler = this.shadowRoot.querySelector('content-state-handler');

    productCard?.addEventListener('quantity-change', (e) => this.handleQuantityChange(e.detail));
    productCard?.addEventListener('buy-now', this.handleBuyNow);
    sellerCard?.addEventListener('seller-profile-click', this.handleSellerProfile);
    mainContentHandler?.addEventListener('retry', this.handleRetry);
  }

  disconnectedCallback() {
    const productCard = this.shadowRoot.querySelector('product-detail-card');
    const sellerCard = this.shadowRoot.querySelector('product-detail-seller');
    const mainContentHandler = this.shadowRoot.querySelector('content-state-handler');

    productCard?.removeEventListener('quantity-change', this.handleQuantityChange);
    productCard?.removeEventListener('buy-now', this.handleBuyNow);
    sellerCard?.removeEventListener('seller-profile-click', this.handleSellerProfile);
    mainContentHandler?.removeEventListener('retry', this.handleRetry);
  }
}

customElements.define('product-detail-index', ProductDetailIndex);
