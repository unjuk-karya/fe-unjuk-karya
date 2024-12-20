import OrderSource from '../../../data/order-source';
import ProductSource from '../../../data/product-source';
import Swal from 'sweetalert2';

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
      return `${(num / 1000000).toFixed(1)}JT`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}RB`;
    }
    return num.toString();
  }

  async handleDelete() {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Produk yang dihapus tidak dapat dikembalikan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D77E6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Menghapus produk...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const productData = JSON.parse(this.getAttribute('product'));
        await ProductSource.deleteProduct(productData.id);

        await Swal.fire({
          title: 'Terhapus!',
          text: 'Produk berhasil dihapus',
          icon: 'success',
          confirmButtonColor: '#1D77E6'
        });

        window.location.reload();
      } catch (error) {
        console.error('Failed to delete product:', error);
        await Swal.fire({
          title: 'Gagal Menghapus',
          text: error.data?.message || 'Terjadi kesalahan saat menghapus produk',
          icon: 'error',
          confirmButtonColor: '#1D77E6'
        });
      }
    }
  }

  handleEdit() {
    const productData = JSON.parse(this.getAttribute('product'));
    window.location.href = `#/edit-product/${productData.id}`;
  }

  async handleSave(productId) {
    const saveButton = this.shadowRoot.querySelector('.save-button');
    saveButton.classList.toggle('active');

    try {
      await ProductSource.saveProduct(productId);
    } catch (error) {
      console.error('Failed to save product:', error);
      // Revert the UI state if the API call fails
      saveButton.classList.toggle('active');
    }
  }

  render() {
    const productData = JSON.parse(this.getAttribute('product'));
    const quantity = parseInt(this.getAttribute('quantity'));

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
    border: 1px solid #ebf1f6;
    padding: 24px;
    align-items: start;
    background: white;
    border-radius: var(--card-radius);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    margin: 0;
    position: relative;
  }

  .more-options {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 10;
  }

  .more-options-button {
    background: #1a73e8;
    border: none;
    width: 40px;
    height: 40px;
    font-size: 20px;
    color: white;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.2s;
  }

  .more-options-button:hover {
    transform: scale(1.1);
  }

  .options-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.12);
    z-index: 10;
    min-width: 150px;
    overflow: hidden;
    margin-top: 8px;
  }

  .save-button {
    position: absolute;
    top: 24px;
    right: ${productData.isMyself ? '72px' : '24px'};
    width: 40px;
    height: 40px;
    background: #1a73e8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: none;
    outline: none;
    z-index: 10;
    transition: all 0.2s;
  }

  .save-button i {
    font-size: 18px;
    color: white;
    transition: color 0.2s;
  }

  .save-button:hover {
    transform: scale(1.1);
  }

  .save-button.active {
    background: #1a73e8;
  }

  .save-button.active i {
    color: #ff4444;
  }

  .delete-button, .edit-button {
    width: 100%;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    font-family: inherit;
    transition: background-color 0.2s ease;
  }

  .delete-button {
    color: #ed4956;
  }

  .edit-button {
    color: #202124;
  }

  .delete-button:hover, .edit-button:hover {
    background: #f8f9fa;
  }

  .product-image {
    border: 1px solid #ebf1f6;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    aspect-ratio: 1;
    max-height: 500px;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    transition: transform 0.3s ease;
    padding: 16px;
  }

  .product-image:hover img {
    transform: scale(1.05);
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .category-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(26,115,232,0.1);
    color: #1a73e8;
    border-radius: 16px;
    font-size: 14px;
    margin-bottom: 8px;
    width: fit-content;
  }

  .category-tag i {
    font-size: 12px;
  }

  .product-title {
    font-size: 24px;
    font-weight: 600;
    color: #202124;
    margin: 0 0 16px 0;
    line-height: 1.4;
  }

  .product-stats {
    margin-bottom: 20px;
    width: 100%;
  }

  .product-stats-wrapper {
    background: #f8f9fa;
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
    gap: 6px;
    font-size: 14px;
    color: #5f6368;
  }

  .stats-value {
    font-weight: 600;
    color: #202124;
  }

  .stats-label {
    color: #5f6368;
    font-size: 14px;
  }

  .stats-divider {
    width: 1px;
    height: 24px;
    background: #dadce0;
  }

  .fa-star {
    color: #FFB800;
    font-size: 14px;
  }

  .price {
    font-size: 32px;
    font-weight: 700;
    color: #1a73e8;
    margin: 16px 0;
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .price-currency {
    font-size: 20px;
    font-weight: 500;
  }

  .stock-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    color: #5f6368;
    font-size: 14px;
  }

  .stock-count {
    color: #1a73e8;
    font-weight: 500;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    width: fit-content;
  }

  .quantity-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border: 1.5px solid #1a73e8;
    background: white;
    color: #1a73e8;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .quantity-btn:hover:not(:disabled) {
    background: #1a73e8;
    color: white;
  }

  .quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #dadce0;
    color: #5f6368;
  }

  .quantity-input {
    width: 48px;
    min-width: 48px;
    height: 36px;
    text-align: center;
    border: 1.5px solid #dadce0;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #202124;
  }

  .buy-button {
    width: 100%;
    height: 48px;
    background: #1a73e8;
    border: none;
    border-radius: 12px;
    color: white;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(26,115,232,0.2);
    margin-top: 8px;
  }

  .buy-button:hover:not(:disabled) {
    background: #1557b0;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(26,115,232,0.3);
  }

  .buy-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #dadce0;
    box-shadow: none;
  }

  .buy-button i {
    font-size: 18px;
  }

  @media screen and (max-width: 1024px) {
    .main-product-card {
      gap: 32px;
    }
  }

  @media screen and (max-width: 768px) {
    .main-product-card {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 16px;
    }

    .product-image {
      max-height: 400px;
    }

    .product-title {
      font-size: 20px;
      margin-bottom: 12px;
    }

    .product-stats {
      margin-bottom: 16px;
    }

    .product-stats-wrapper {
      width: 100%;
      justify-content: center;
    }

    .stats-item {
      font-size: 13px;
      text-align: center;
    }

    .stats-divider {
      height: 20px;
    }

    .price {
      font-size: 28px;
      margin: 12px 0;
    }

    .quantity-controls {
      margin: 8px 0 16px 0;
    }

    .buy-button {
      height: 44px;
      font-size: 15px;
    }

    .more-options {
      top: 16px;
      right: 16px;
    }

    .more-options-button, 
    .save-button {
      width: 36px;
      height: 36px;
    }

    .save-button {
      top: 16px;
      right: ${productData.isMyself ? '64px' : '16px'};
    }

    .save-button i,
    .more-options-button i {
      font-size: 16px;
    }
  }

  @media screen and (max-width: 480px) {
    .main-product-card {
      padding: 12px;
    }

    .product-image {
      max-height: 350px;
    }

    .category-tag {
      font-size: 12px;
      padding: 4px 10px;
    }

    .product-title {
      font-size: 18px;
    }

    .stats-item {
      font-size: 12px;
      gap: 4px;
    }

    .stats-divider {
      margin: 0 8px;
    }

    .price {
      font-size: 24px;
    }

    .price-currency {
      font-size: 16px;
    }

    .stock-info {
      font-size: 13px;
    }

    .quantity-btn {
      width: 32px;
      height: 32px;
      min-width: 32px;
      font-size: 14px;
    }

    .quantity-input {
      width: 44px;
      min-width: 44px;
      height: 32px;
      font-size: 14px;
    }

    .buy-button {
      height: 40px;
      font-size: 14px;
    }

    .buy-button i {
      font-size: 16px;
    }

    .more-options {
      top: 12px;
      right: 12px;
    }

    .more-options-button,
    .save-button {
      width: 32px;
      height: 32px;
    }

    .save-button {
      top: 12px;
      right: ${productData.isMyself ? '52px' : '12px'};
    }

    .save-button i,
    .more-options-button i {
      font-size: 14px;
    }
  }
</style>

      <div class="main-product-card">
        ${productData.isMyself ? `
          <div class="more-options">
            <button class="more-options-button">
              <i class="fas fa-ellipsis-h"></i>
            </button>
            <div class="options-menu" style="display: none;">
              <button class="edit-button">
                <i class="far fa-edit"></i>
                <span>Edit</span>
              </button>
              <button class="delete-button">
                <i class="far fa-trash-alt"></i>
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ` : ''}

        <button class="save-button ${productData.isSaved ? 'active' : ''}">
          <i class="fa-solid fa-bookmark"></i>
        </button>
        
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
                <span class="stats-value">${productData.rating}</span>
                <i class="fas fa-star"></i>
                <span class="stats-label">(${this.formatNumber(productData.totalRatings)} Ulasan)</span>
              </div>
              <div class="stats-divider"></div>
              <div class="stats-item">
                <i class="fas fa-shopping-cart"></i>
                <span>${this.formatNumber(productData.totalPurchases)} Terjual</span>
              </div>
            </div>
          </div>

          <div class="price">
            <span class="price-currency">Rp</span>
            <span>${productData.price.toLocaleString('id-ID')}</span>
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

          <button class="buy-button" ${productData.stock === 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i>
            Beli Sekarang
          </button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const saveButton = this.shadowRoot.querySelector('.save-button');
    if (saveButton) {
      const productData = JSON.parse(this.getAttribute('product'));
      saveButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleSave(productData.id);
      });
    }

    if (JSON.parse(this.getAttribute('product')).isMyself) {
      const moreButton = this.shadowRoot.querySelector('.more-options-button');
      const optionsMenu = this.shadowRoot.querySelector('.options-menu');

      moreButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
      });

      const deleteButton = this.shadowRoot.querySelector('.delete-button');
      deleteButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDelete();
      });

      const editButton = this.shadowRoot.querySelector('.edit-button');
      editButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleEdit();
      });

      document.addEventListener('click', () => {
        if (optionsMenu) optionsMenu.style.display = 'none';
      });
    }

    const decrementBtn = this.shadowRoot.querySelector('.decrement');
    const incrementBtn = this.shadowRoot.querySelector('.increment');
    const buyBtn = this.shadowRoot.querySelector('.buy-button');

    decrementBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('quantity-change', { detail: 'decrease' }));
    });

    incrementBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('quantity-change', { detail: 'increase' }));
    });

    buyBtn?.addEventListener('click', async () => {
      const productData = JSON.parse(this.getAttribute('product'));
      const quantity = parseInt(this.getAttribute('quantity'));

      try {
        const result = await Swal.fire({
          title: 'Konfirmasi Pembelian',
          text: `Apakah Anda yakin ingin membeli ${quantity} ${productData.name}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1D77E6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, Beli Sekarang',
          cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
          Swal.fire({
            title: 'Memproses Pembelian...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const orderData = {
            productId: productData.id,
            quantity: quantity,
          };

          await OrderSource.createOrder(orderData);

          await Swal.fire({
            title: 'Pembelian Berhasil!',
            text: 'Anda akan diarahkan ke halaman riwayat transaksi',
            icon: 'success',
            confirmButtonColor: '#1D77E6'
          });

          window.location.href = '#/transaction-history';
        }
      } catch (error) {
        console.error('Failed to create order:', error);

        await Swal.fire({
          title: 'Gagal Membuat Pesanan',
          text: error.data?.message || 'Terjadi kesalahan saat memproses pesanan',
          icon: 'error',
          confirmButtonColor: '#1D77E6'
        });
      }
    });
  }

  disconnectedCallback() {
    const decrementBtn = this.shadowRoot.querySelector('.decrement');
    const incrementBtn = this.shadowRoot.querySelector('.increment');
    const buyBtn = this.shadowRoot.querySelector('.buy-button');
    const moreButton = this.shadowRoot.querySelector('.more-options-button');
    const deleteButton = this.shadowRoot.querySelector('.delete-button');
    const editButton = this.shadowRoot.querySelector('.edit-button');
    const saveButton = this.shadowRoot.querySelector('.save-button');

    decrementBtn?.removeEventListener('click', () => {});
    incrementBtn?.removeEventListener('click', () => {});
    buyBtn?.removeEventListener('click', () => {});
    moreButton?.removeEventListener('click', () => {});
    deleteButton?.removeEventListener('click', () => {});
    editButton?.removeEventListener('click', () => {});
    saveButton?.removeEventListener('click', () => {});
  }
}

customElements.define('product-detail-card', ProductDetailCard);
