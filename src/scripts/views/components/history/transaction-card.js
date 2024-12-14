import Swal from 'sweetalert2';
import OrderSource from '../../../data/order.source.js';

class TransactionCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  getReviewButtonState(order) {
    const REVIEW_BUTTON_STATES = {
      NOT_PAID: {
        show: false
      },
      NOT_REVIEWED: {
        show: true,
        text: 'Ulas Produk',
        action: 'review'
      },
      REVIEWED: {
        show: true,
        text: 'Edit Ulasan',
        action: 'edit'
      }
    };

    if (order.status !== 'PAID') return REVIEW_BUTTON_STATES.NOT_PAID;
    return order.isReviewed ? REVIEW_BUTTON_STATES.REVIEWED : REVIEW_BUTTON_STATES.NOT_REVIEWED;
  }

  handleProductClick(productId) {
    window.location.href = `#/product/${productId}`;
  }

  handleStoreClick(storeId) {
    window.location.href = `#/profile/${storeId}`;
  }

  handleBuyAgain(productId) {
    window.location.href = `#/product/${productId}`;
  }

  handlePayment(redirectUrl) {
    window.location.href = redirectUrl;
  }

  handleReviewClick(orderId, productId, action) {
    const path = action === 'edit' ? 'edit-review' : 'create-review';
    window.location.href = `#/${path}/${orderId}/${productId}`;
  }

  handleCancel(orderId) {
    Swal.fire({
      title: 'Batalkan Pesanan',
      text: 'Apakah Anda yakin ingin membatalkan pesanan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Batalkan',
      cancelButtonText: 'Tidak'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Membatalkan Pesanan...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          await OrderSource.cancelOrder(parseInt(orderId));

          await Swal.fire({
            title: 'Pesanan Dibatalkan',
            text: 'Pesanan Anda telah berhasil dibatalkan',
            icon: 'success',
            confirmButtonColor: '#1D77E6'
          });

          window.location.reload();
        } catch (error) {
          console.error('Failed to cancel order:', error);

          await Swal.fire({
            title: 'Gagal Membatalkan Pesanan',
            text: error.data?.message || 'Terjadi kesalahan saat membatalkan pesanan',
            icon: 'error',
            confirmButtonColor: '#1D77E6'
          });
        }
      }
    });
  }

  getActionButton(order) {
    if (order.status === 'PENDING') {
      return `
          <div class="pending-actions">
            <button 
              class="cancel-btn" 
              onclick="this.getRootNode().host.handleCancel('${order.id}')"
            >
              Batalkan
            </button>
            <button 
              class="buy-again" 
  onclick="window.open('${order.redirectUrl}', '_blank')"
            >
              Bayar
            </button>
          </div>
        `;
    }

    return `
        <button 
          class="buy-again" 
          onclick="this.getRootNode().host.handleBuyAgain('${order.productId}')"
        >
          Beli Lagi
        </button>
      `;
  }

  formatDate(dateString) {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

  connectedCallback() {
    const order = JSON.parse(this.getAttribute('order'));
    this.render(order);
  }

  render(order) {
    const reviewButtonState = this.getReviewButtonState(order);

    this.shadowRoot.innerHTML = `
        <style>
          .transaction-card {
            background: white;
            border-radius: 8px;
            margin-bottom: 12px;
            border: 1px solid #e0e0e0;
          }
  
          .card-header {
            padding: 8px 16px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            gap: 12px;
            height: 32px;
          }
  
          .date {
            font-size: 13px;
            color: rgb(49, 53, 59);
            font-weight: 400;
          }
  
          .status {
            font-size: 12px;
            background: #E5F0FF;
            color: #1D77E6;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: 500;
          }
  
          .invoice {
            font-size: 13px;
            color: rgb(49, 53, 59);
            margin-left: auto;
            text-align: right;
          }
  
          .store-name {
            font-size: 13px;
            color: rgb(49, 53, 59);
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 4px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: color 0.2s;
          }
  
          .store-name:hover {
            color: #1D77E6;
          }
  
          .product-section {
            padding: 12px 16px;
            display: flex;
            gap: 12px;
          }
  
          .product-image {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #f0f0f0;
          }
  
          .product-info {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
  
          .product-details {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
  
          .product-name {
            font-size: 13px;
            color: rgb(49, 53, 59);
            margin: 0;
            cursor: pointer;
            transition: color 0.2s;
          }
  
          .product-name:hover {
            color: #1D77E6;
          }
  
          .product-quantity {
            font-size: 13px;
            color: rgb(49, 53, 59);
            margin: 0;
          }
  
          .price-section {
            text-align: right;
            border: 0;
            padding: 0;
          }
  
          .price-label {
            font-size: 13px;
            color: rgb(49, 53, 59);
            margin-bottom: 2px;
          }
  
          .price-amount {
            font-size: 14px;
            font-weight: 600;
            color: rgb(49, 53, 59);
            white-space: nowrap;
          }
  
          .card-actions {
            padding: 8px 16px;
            border-top: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
  
          .detail-link {
            color: #1D77E6;
            font-size: 13px;
            text-decoration: none;
            cursor: pointer;
          }
  
          .pending-actions {
            display: flex;
            gap: 8px;
          }
  
          .cancel-btn {
            background: white;
            color: #EF4444;
            border: 1px solid #EF4444;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          }
  
          .cancel-btn:hover {
            background: #FEE2E2;
          }
  
          .buy-again {
            background: #1D77E6;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
          }
  
          .buy-again:hover {
            background: #1565c0;
          }
  
          .review-btn {
            background: white;
            color: #1D77E6;
            border: 1px solid #1D77E6;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          }
  
          .review-btn:hover {
            background: #E5F0FF;
          }
  
          .status-PAID { background: #E5F0FF; color: #1D77E6; }
          .status-PENDING { background: #FFF4E5; color: #FF9800; }
          .status-CANCELED { background: #FFEBEE; color: #F44336; }
          .status-EXPIRED { background: #EEEEEE; color: #757575; }
  
          @media (max-width: 640px) {
            .card-header {
              gap: 8px;
              flex-wrap: wrap;
              height: auto;
              padding: 8px 12px;
            }
  
            .invoice {
              font-size: 12px;
              width: 100%;
              text-align: left;
              margin: 0;
              order: 3;
            }
  
            .store-name {
              padding: 8px 12px;
            }
  
            .product-section {
              padding: 12px;
            }
  
            .product-info {
              flex-direction: column;
              gap: 8px;
            }
  
            .price-section {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 8px;
              margin-top: 4px;
              border-top: 1px solid #f0f0f0;
            }
  
            .card-actions {
              padding: 12px;
              flex-direction: column-reverse;
              gap: 12px;
            }
  
            .detail-link {
              width: 100%;
              text-align: center;
            }
  
            .buy-again, .review-btn, .cancel-btn {
              width: 100%;
            }
  
            .actions-container, .pending-actions {
              display: flex;
              flex-direction: column-reverse;
              gap: 8px;
              width: 100%;
            }
          }
        </style>
  
        <div class="transaction-card">
          <div class="card-header">
            <span class="date">${this.formatDate(order.createdAt)}</span>
            <span class="status status-${order.status}">${order.status}</span>
            <span class="invoice">${order.orderId}</span>
          </div>
          <div class="store-name" onclick="this.getRootNode().host.handleStoreClick('${order.storeId}')">
            ${order.storeName}
          </div>
          <div class="product-section">
            <img 
              src="${order.productImage}" 
              alt="${order.productName}"
              class="product-image"
              onerror="this.src='https://via.placeholder.com/48'"
            >
            <div class="product-info">
              <div class="product-details">
                <h3 class="product-name" onclick="this.getRootNode().host.handleProductClick('${order.productId}')">${order.productName}</h3>
                <p class="product-quantity">${order.quantity} barang</p>
              </div>
              <div class="price-section">
                <div class="price-label">Total Belanja</div>
                <div class="price-amount">Rp${order.totalAmount.toLocaleString('id-ID')}</div>                    
              </div>
            </div>
          </div>
          <div class="card-actions">
            <a class="detail-link">Lihat Detail Transaksi</a>
            <div class="actions-container">
              ${reviewButtonState.show ? `
                <button 
                  class="review-btn"
                  onclick="this.getRootNode().host.handleReviewClick('${order.orderId}', '${order.productId}', '${reviewButtonState.action}')"
                >
                  ${reviewButtonState.text}
                </button>
              ` : ''}
              ${this.getActionButton(order)}
            </div>
          </div>
        </div>
      `;
  }
}

customElements.define('transaction-card', TransactionCard);