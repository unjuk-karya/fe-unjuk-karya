import Swal from 'sweetalert2';
import OrderSource from '../../../data/order-source.js';

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

  handleReviewClick(orderId) {
    const reviewModal = document.querySelector('review-modal') || document.createElement('review-modal');
    if (!reviewModal.parentElement) {
      document.body.appendChild(reviewModal);
    }
    reviewModal.show(orderId);
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
    if (!dateString) return '-';
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
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

        .status {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 3px;
          font-weight: 500;
        }

        .payment-date {
          font-size: 13px;
          color: rgb(49, 53, 59);
          font-weight: 400;
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
          gap: 8px;
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

        .product-info-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
          color: rgb(49, 53, 59);
        }

        .unit-price {
          color: var(--primary-color);
          font-weight: 500;
        }

        .quantity {
          color: rgb(99, 115, 129);
          font-size: 13px;
        }

        .order-date {
          color: rgb(99, 115, 129);
          font-size: 13px;
        }

        .price-section {
          text-align: right;
          padding: 0;
          min-width: 180px;
        }

        .price-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
          padding-top: 8px;
        }

        .price-total .label {
          font-size: 13px;
          color: rgb(99, 115, 129);
        }

        .price-total .amount {
          font-size: 14px;
          font-weight: 600;
          color: rgb(49, 53, 59);
        }

        .card-actions {
          padding: 8px 16px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
        }

        .actions-container {
          display: flex;
          gap: 8px;
        }

        .pending-actions {
          display: flex;
          gap: 8px;
        }

        .cancel-btn {
          background: white;
          color: #EF4444;
          border: 1px solid #EF4444;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 11px 30px;
          font-weight: 600;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #FEE2E2;
        }

        .buy-again {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 11px 30px;
          border-radius: 8px;
          background: #1D77E6;
          color: white;
          border: none;
          font-weight: 600;
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

          .status, .payment-date {
            order: 1;
          }

          .invoice {
            font-size: 12px;
            width: 100%;
            text-align: left;
            margin: 0;
            order: 2;
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

          .product-info-row {
            gap: 4px;
          }

          .order-date {
            font-size: 12px;
          }

          .price-section {
            width: 100%;
            min-width: unset;
            margin-top: 12px;
          }

          .price-total {
            margin-top: 8px;
          }

          .card-actions {
            padding: 12px;
            flex-direction: column;
          }

          .actions-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }

          .pending-actions {
            flex-direction: column-reverse;
          }

          .buy-again, .review-btn, .cancel-btn {
            width: 100%;
          }
        }
      </style>

      <div class="transaction-card">
        <div class="card-header">
          <span class="status status-${order.status}">${order.status}</span>
          ${order.paidAt ? `<span class="payment-date">Dibayar: ${this.formatDate(order.paidAt)}</span>` : ''}
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
              <h3 class="product-name" onclick="this.getRootNode().host.handleProductClick('${order.productId}')">
                ${order.productName}
              </h3>
              <div class="product-info-row">
                <div class="unit-price">Rp${order.productPrice.toLocaleString('id-ID')}</div>
                <div class="quantity">${order.quantity} barang</div>
                <div class="order-date">Dipesan: ${this.formatDate(order.createdAt)}</div>
              </div>
            </div>
            <div class="price-section">
              <div class="price-total">
                <span class="label">Total Belanja:</span>
                <span class="amount">Rp${order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <div class="actions-container">
          ${reviewButtonState.show ? `
            <button 
              class="review-btn"
              onclick="this.getRootNode().host.handleReviewClick('${order.id}')"
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
