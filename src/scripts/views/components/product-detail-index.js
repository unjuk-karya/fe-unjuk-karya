import ProductSource from '../../data/product-source';

class ProductDetailIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      product: null,
      contentState: 'loading',
      errorMessage: '',
      defaultStats: {
        rating: 4.5,
        totalRatings: 49400,
        totalPurchases: 1234,
        totalProducts: 23,
        sellerRating: 4.9,
      }
    };

    this.quantity = 1;
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleBuyNow = this.handleBuyNow.bind(this);
    this.handleSellerProfile = this.handleSellerProfile.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this._handleDecrease = () => this.handleQuantityChange('decrease');
    this._handleIncrease = () => this.handleQuantityChange('increase');
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
    }
    this.render();
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'product-id' && newValue && oldValue !== newValue) {
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
      this.state.errorMessage = 'Failed to load product details';

      if (error.status === 404) {
        window.location.href = '#/not-found';
        return;
      }
    }
    this.render();
  }

  async handleRetry() {
    const productId = this.getAttribute('product-id');
    if (productId) {
      await this.fetchProductDetail(productId);
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  removeEventListeners() {
    const decrementBtn = this.shadowRoot.querySelector('.decrement');
    const incrementBtn = this.shadowRoot.querySelector('.increment');
    const buyBtn = this.shadowRoot.querySelector('.buy-button');
    const sellerInfo = this.shadowRoot.querySelector('.seller-info');

    decrementBtn?.removeEventListener('click', this._handleDecrease);
    incrementBtn?.removeEventListener('click', this._handleIncrease);
    buyBtn?.removeEventListener('click', this.handleBuyNow);
    sellerInfo?.removeEventListener('click', this.handleSellerProfile);
  }

  setupEventListeners() {
    const decrementBtn = this.shadowRoot.querySelector('.decrement');
    const incrementBtn = this.shadowRoot.querySelector('.increment');
    const buyBtn = this.shadowRoot.querySelector('.buy-button');
    const sellerInfo = this.shadowRoot.querySelector('.seller-info');

    decrementBtn?.addEventListener('click', this._handleDecrease);
    incrementBtn?.addEventListener('click', this._handleIncrease);
    buyBtn?.addEventListener('click', this.handleBuyNow);
    sellerInfo?.addEventListener('click', this.handleSellerProfile);
  }

  handleQuantityChange(action) {
    if (action === 'decrease' && this.quantity > 1) {
      this.quantity--;
    } else if (action === 'increase' && this.quantity < this.state.product.stock) {
      this.quantity++;
    }
    this.updateQuantityDisplay();
  }

  updateQuantityDisplay() {
    const quantityInput = this.shadowRoot.querySelector('.quantity-input');
    if (quantityInput) {
      quantityInput.value = this.quantity;
      this.render();
    }
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

  formatNumber(num) {
    if (num >= 1000000) {
      return `${(num/1000000).toFixed(1)}JT`;
    }
    if (num >= 1000) {
      return `${(num/1000).toFixed(1)}RB`;
    }
    return num.toString();
  }

  renderProduct() {
    const { product, defaultStats } = this.state;
    if (!product) return '';

    const description = product.description || 'Tidak ada deskripsi produk.';

    return `
      <div class="container">
        <div class="main-product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          
          <div class="product-info">
            <div class="category-tag">
              <i class="fas fa-tag"></i>
              ${product.category.name}
            </div>
 
            <h1 class="product-title">${product.name}</h1>
            
            <div class="product-stats">
              <div class="product-stats-wrapper">
                <div class="stats-item">
                  <span class="stats-value">${defaultStats.rating}</span>
                  <i class="fas fa-star"></i>
                  <span class="stats-label">(${this.formatNumber(defaultStats.totalRatings)} Ulasan)</span>
                </div>
                <div class="stats-divider"></div>
                <div class="stats-item">
                  <i class="fas fa-shopping-cart"></i>
                  <span>${this.formatNumber(defaultStats.totalPurchases)} Terjual</span>
                </div>
              </div>
            </div>
 
            <div class="price">
              <span class="price-currency">Rp</span>
              <span>${product.price.toLocaleString()}</span>
            </div>
 
            <div class="stock-info">
              <i class="fas fa-box"></i>
              <span>Stok: <span class="stock-count">${product.stock} tersisa</span></span>
            </div>
 
            <div class="quantity-controls">
              <button class="quantity-btn decrement" ${this.quantity <= 1 ? 'disabled' : ''}>
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" class="quantity-input" value="${this.quantity}" min="1" max="${product.stock}" readonly>
              <button class="quantity-btn increment" ${this.quantity >= product.stock ? 'disabled' : ''}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
 
            <button class="buy-button">
              <i class="fas fa-shopping-cart"></i>
              Beli Sekarang
            </button>
          </div>
        </div>
 
        <div class="seller-card">
          <div class="card-title">
            <i class="fas fa-store"></i>
            Informasi Penjual
          </div>
          <div class="seller-info">
            <div class="seller-profile">
              <div class="profile-main">
                <div class="seller-avatar">
                  <img src="${product.user.avatar}" alt="${product.user.name}">
                </div>
                <div class="seller-details">
                  <div class="seller-name">
                    <span>${product.user.name}</span>
                    <i class="fas fa-chevron-right"></i>
                  </div>
                  <div class="seller-username">@${product.user.username}</div>
                </div>
              </div>
              <div class="seller-stats">
                <div class="stat-item">
                  <i class="fas fa-box-open"></i>
                  <span>${defaultStats.totalProducts} Produk</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <i class="fas fa-star"></i>
                  <span>${defaultStats.sellerRating} Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <div class="description-card">
          <div class="card-title">
            <i class="fas fa-info-circle"></i>
            Deskripsi Produk
          </div>
          <div class="description-content">
            <p>${description}</p>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const { contentState, errorMessage } = this.state;

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

 .main-product-card, .seller-card, .description-card {
   background: white;
   border-radius: var(--card-radius);
   box-shadow: var(--card-shadow);
   overflow: hidden;
   margin: 0;
 }

 .main-product-card {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 48px;
   padding: 24px;
   align-items: start;
 }

 .product-image {
   position: relative;
   overflow: hidden;
   border-radius: 12px;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
   height: 100%;
   width: 100%;
 }

 .product-image img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   display: block;
   transition: transform 0.3s ease;
 }

 .product-image:hover img {
   transform: scale(1.05);
 }

 .category-tag {
   display: inline-block;
   padding: 4px 12px;
   background: #e6f0fd;
   color: var(--primary-color);
   border-radius: 16px;
   font-size: 14px;
   margin-bottom: 16px;
   width: fit-content;
 }

 .product-title {
   font-size: 24px;
   font-weight: 600;
   color: #333;
   margin-bottom: 16px;
   line-height: 1.4;
 }

 .product-stats {
   margin-bottom: 24px;
   width: 100%;
 }

 .product-stats-wrapper {
   background: var(--bg-gray);
   border-radius: 12px;
   padding: 12px 16px;
   display: flex;
   align-items: center;
   gap: 16px;
   width: fit-content;
 }

 .stats-item {
   display: flex;
   align-items: center;
   gap: 4px;
   font-size: 14px;
   color: var(--text-gray);
 }

 .stats-value {
   font-weight: 600;
   color: #333;
 }

 .stats-label {
   color: var(--text-gray);
   font-size: 14px;
 }

 .stats-divider {
   width: 1px;
   height: 24px;
   background: var(--border-color);
 }

 .fa-star {
   color: #FFB800;
   font-size: 14px;
 }

 .price {
   font-size: 32px;
   font-weight: 700;
   color: var(--primary-color);
   margin-bottom: 24px;
   display: flex;
   align-items: baseline;
 }

 .price-currency {
   font-size: 20px;
   margin-right: 4px;
   font-weight: 500;
 }

 .stock-info {
   display: flex;
   align-items: center;
   gap: 8px;
   margin-bottom: 24px;
   color: #666;
   font-size: 14px;
 }

 .stock-count {
   color: var(--primary-color);
   font-weight: 500;
 }

 .quantity-controls {
   display: flex;
   align-items: center;
   gap: 8px;
   margin-bottom: 32px;
   width: auto;
 }

 .quantity-btn {
   width: 32px;
   height: 32px;
   min-width: 32px;
   border: 1px solid var(--primary-color);
   background: white;
   color: var(--primary-color);
   border-radius: 8px;
   cursor: pointer;
   font-size: 16px;
   display: flex;
   align-items: center;
   justify-content: center;
   transition: all 0.2s ease;
 }

 .quantity-btn:hover {
   background: var(--primary-color);
   color: white;
 }

 .quantity-btn:disabled {
   opacity: 0.5;
   cursor: not-allowed;
 }

 .quantity-input {
   width: 48px;
   min-width: 48px;
   height: 32px;
   text-align: center;
   border: 1px solid #ddd;
   border-radius: 8px;
   font-size: 14px;
   font-weight: 500;
 }

 .buy-button {
   width: 100%;
   height: 56px;
   background: var(--primary-color);
   border: none;
   border-radius: 12px;
   color: white;
   font-size: 18px;
   font-weight: 600;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 12px;
   transition: all 0.2s ease;
   box-shadow: 0 4px 12px rgba(29, 119, 230, 0.2);
 }

 .buy-button:hover {
   background: var(--primary-hover);
   transform: translateY(-2px);
   box-shadow: 0 6px 16px rgba(29, 119, 230, 0.3);
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

 .seller-info {
   padding: 24px;
 }

 .seller-profile {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 24px;
 }

 .profile-main {
   display: flex;
   align-items: center;
   gap: 16px;
   cursor: pointer;
 }

 .seller-avatar {
   width: 48px;
   height: 48px;
   border-radius: 24px;
   overflow: hidden;
   flex-shrink: 0;
 }

 .seller-avatar img {
   width: 100%;
   height: 100%;
   object-fit: cover;
 }

 .seller-details {
   display: flex;
   flex-direction: column;
 }

 .seller-name {
   display: flex;
   align-items: center;
   gap: 8px;
   font-weight: 600;
   color: #333;
   margin-bottom: 4px;
 }

 .seller-username {
   color: var(--text-gray);
   font-size: 14px;
 }

 .seller-stats {
   display: flex;
   align-items: center;
   gap: 16px;
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

   .main-product-card,
   .seller-card,
   .description-card {
     border-radius: var(--card-radius);
     margin: 0 12px;
     box-shadow: 0 1px 4px rgba(0,0,0,0.05);
   }

   .main-product-card {
     grid-template-columns: 1fr;
     gap: 24px;
     padding: 16px;
   }

   .product-image {
     aspect-ratio: 1;
   }

   .product-title {
     font-size: 20px;
   }

   .product-stats {
     margin-bottom: 16px;
   }


   .stats-item {
     font-size: 13px;
     padding: 0;
     text-align: center;
     flex: 1;
   }

   .stats-divider {
     height: 20px;
     margin: 0;
   }

   .price {
     font-size: 28px;
   }

   .seller-profile {
     flex-direction: column;
     align-items: flex-start;
   }

   .seller-stats {
     width: 100%;
     margin-top: 16px;
     padding-top: 16px;
     border-top: 1px solid var(--border-color);
     justify-content: space-between;
   }

   .seller-info,
   .description-content {
     padding: 16px;
   }

   .quantity-controls {
     margin-bottom: 24px;
   }

   .buy-button {
     height: 48px;
     font-size: 16px;
   }
 }

 @media screen and (max-width: 480px) {
   :host {
     padding: 8px;
   }

   .main-product-card,
   .seller-card,
   .description-card {
     margin: 0 8px;
   }

   .stats-item {
     font-size: 12px;
   }
 }
</style>

      <content-state-handler 
        state="${contentState}"
        message="${errorMessage}"
        @retry="${this.handleRetry}">
        ${contentState === 'success' ? this.renderProduct() : ''}
      </content-state-handler>
    `;

    if (contentState === 'success') {
      this.setupEventListeners();
    }
  }
}

customElements.define('product-detail-index', ProductDetailIndex);