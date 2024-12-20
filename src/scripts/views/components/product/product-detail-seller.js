// product-detail-seller.js
class ProductDetailSeller extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['seller-data'];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const seller = JSON.parse(this.getAttribute('seller-data'));

    this.shadowRoot.innerHTML = `
        <style>
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

          :host {
            display: block;
          }
  
          .seller-card {
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

          .card-title i {
            color: #666;
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
            transition: all 0.2s;
          }

.seller-username {
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
}

.username-text {
    transition: all 0.2s;
}

.profile-main:hover .username-text {
    text-decoration: underline;
    text-underline-offset: 2px;
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
            gap: 4px;
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
            .card-title {
              padding: 12px 16px;
            }
          }
        </style>
  
        <div class="seller-card">
          <div class="card-title">
            <i class="fa-solid fa-store"></i>
            Informasi Penjual
          </div>
          <div class="seller-info">
            <div class="seller-profile">
              <div class="profile-main">
                <div class="seller-avatar">
                  <img src="${seller.avatar}" alt="${seller.username}">
                </div>
                <div class="seller-details">
<div class="seller-username">
    <span class="username-text">${seller.username}</span>
    <i class="fas fa-chevron-right"></i>
</div>
                </div>
              </div>
              <div class="seller-stats">
                <div class="stat-item">
                  <i class="fas fa-box-open"></i>
                  <span>${seller.totalProducts} Produk</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <i class="fas fa-star"></i>
                  <span>${seller.sellerRating} Rating</span>
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
