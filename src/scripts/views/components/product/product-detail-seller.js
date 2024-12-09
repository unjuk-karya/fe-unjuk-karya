// product-detail-seller.js
class ProductDetailSeller extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['seller-data', 'stats'];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const seller = JSON.parse(this.getAttribute('seller-data'));
    const stats = JSON.parse(this.getAttribute('stats'));

    this.shadowRoot.innerHTML = `
        <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

          :host {
            display: block;
          }
  
          .seller-card {
            background: white;
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
  
          .stat-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--text-gray);
          }
  
          .stat-divider {
            width: 1px;
            height: 24px;
            background: var(--border-color);
          }
  
          @media screen and (max-width: 768px) {
            .seller-card {
              border-radius: var(--card-radius);
              box-shadow: 0 1px 4px rgba(0,0,0,0.05);
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
  
            .seller-info {
              padding: 16px;
            }
          }
  
          @media screen and (max-width: 480px) {
            .seller-card {
              margin: 0 8px;
            }
          }
        </style>
  
        <div class="seller-card">
          <div class="card-title">
            <i class="fas fa-store"></i>
            Informasi Penjual
          </div>
          <div class="seller-info">
            <div class="seller-profile">
              <div class="profile-main">
                <div class="seller-avatar">
                  <img src="${seller.avatar}" alt="${seller.name}">
                </div>
                <div class="seller-details">
                  <div class="seller-name">
                    <span>${seller.name}</span>
                    <i class="fas fa-chevron-right"></i>
                  </div>
                  <div class="seller-username">@${seller.username}</div>
                </div>
              </div>
              <div class="seller-stats">
                <div class="stat-item">
                  <i class="fas fa-box-open"></i>
                  <span>${stats.totalProducts} Produk</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <i class="fas fa-star"></i>
                  <span>${stats.sellerRating} Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const profileMain = this.shadowRoot.querySelector('.profile-main');
    profileMain?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('seller-profile-click'));
    });
  }

  disconnectedCallback() {
    const profileMain = this.shadowRoot.querySelector('.profile-main');
    profileMain?.removeEventListener('click', () => {});
  }
}

customElements.define('product-detail-seller', ProductDetailSeller);