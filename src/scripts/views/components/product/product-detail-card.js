// product-detail-card.js
class ProductDetailCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['product', 'quantity'];
  }

  connectedCallback() {
    this.render();
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

  render() {
    const productData = JSON.parse(this.getAttribute('product'));
    const quantity = parseInt(this.getAttribute('quantity'));
    const defaultStats = {
      rating: 4.5,
      totalRatings: 49400,
      totalPurchases: 1234
    };

    this.shadowRoot.innerHTML = `
        <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

          :host {
            display: block;
          }
  
          .main-product-card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            padding: 24px;
            align-items: start;
            background: white;
            border-radius: var(--card-radius);
            box-shadow: var(--card-shadow);
            overflow: hidden;
            margin: 0;
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
  
          @media screen and (max-width: 768px) {
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
  
            .quantity-controls {
              margin-bottom: 24px;
            }
  
            .buy-button {
              height: 48px;
              font-size: 16px;
            }
          }
  
          @media screen and (max-width: 480px) {
            .stats-item {
              font-size: 12px;
            }
          }
        </style>
  
        <div class="main-product-card">
          <div class="product-image">
            <img src="${productData.image}" alt="${productData.name}">
          </div>
          
          <div class="product-info">
            <div class="category-tag">
              <i class="fas fa-tag"></i>
              ${productData.category.name}
            </div>
  
            <h1 class="product-title">${productData.name}</h1>
            
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
              <span>${productData.price.toLocaleString()}</span>
            </div>
  
            <div class="stock-info">
              <i class="fas fa-box"></i>
              <span>Stok: <span class="stock-count">${productData.stock} tersisa</span></span>
            </div>
  
            <div class="quantity-controls">
              <button class="quantity-btn decrement" ${quantity <= 1 ? 'disabled' : ''}>
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" class="quantity-input" value="${quantity}" min="1" max="${productData.stock}" readonly>
              <button class="quantity-btn increment" ${quantity >= productData.stock ? 'disabled' : ''}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
  
            <button class="buy-button">
              <i class="fas fa-shopping-cart"></i>
              Beli Sekarang
            </button>
          </div>
        </div>
      `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const decrementBtn = this.shadowRoot.querySelector('.decrement');
    const incrementBtn = this.shadowRoot.querySelector('.increment');
    const buyBtn = this.shadowRoot.querySelector('.buy-button');

    decrementBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('quantity-change', { detail: 'decrease' }));
    });

    incrementBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('quantity-change', { detail: 'increase' }));
    });

    buyBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('buy-now'));
    });
  }

  disconnectedCallback() {
    // Clean up event listeners if needed
    const decrementBtn = this.shadowRoot.querySelector('.decrement');
    const incrementBtn = this.shadowRoot.querySelector('.increment');
    const buyBtn = this.shadowRoot.querySelector('.buy-button');

    decrementBtn?.removeEventListener('click', () => {});
    incrementBtn?.removeEventListener('click', () => {});
    buyBtn?.removeEventListener('click', () => {});
  }
}

customElements.define('product-detail-card', ProductDetailCard);