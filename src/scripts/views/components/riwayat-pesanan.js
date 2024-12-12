class TransactionPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }

                .container {
                    max-width: 1200px;
                    margin: 20px auto;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .search-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .search-bar input {
                    width: 60%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                .filters {
                    display: flex;
                    gap: 10px;
                }

                .filters button {
                    padding: 10px 20px;
                    background-color: #ddd;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .filters button:hover {
                    background-color: #bbb;
                }

                .transaction-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fafafa;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                }

                .transaction-item img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .transaction-info {
                    flex: 1;
                    margin-left: 15px;
                }

                .transaction-info h4 {
                    margin: 0;
                    font-size: 16px;
                    color: #333;
                }

                .transaction-info p {
                    margin: 5px 0;
                    font-size: 14px;
                    color: #555;
                }

                .transaction-actions {
                    display: flex;
                    gap: 10px;
                }

                .transaction-actions button {
                    padding: 10px 12px;
                    width: 80px;
                    background-color: #1D77E6;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .transaction-actions button:hover {
                    background-color: #3184e9;
                }

                .transaction-actions .secondary {
                    background-color: #f5f5f5;
                    color: #333;
                    border: 1px solid #ddd;
                }

                .transaction-actions .secondary:hover {
                    background-color: #ddd;
                }
            </style>
            <div class="container">
                <div class="search-bar">
                    <input type="text" placeholder="Cari transaksi" id="search-input">
                    <div class="filters">
                        <button id="status-filter">Semua Status</button>
                        <button id="product-filter">Semua Produk</button>
                        <button id="date-filter">Semua Tanggal</button>
                    </div>
                </div>
                <div id="transactions-container">
                    ${this.renderTransactions()}
                </div>
            </div>
        `;
  }

  renderTransactions() {
    const transactions = [
      {
        image: 'photo2.jpg',
        name: 'Panci Ramyun Asli Korea size 14cm',
        quantity: 1,
        total: 103040,
        canReview: true
      },
      {
        image: 'photo6.jpg',
        name: 'Ajazz AK820 GTS Wired Gaming Mechanical',
        quantity: 1,
        total: 562500,
        canReview: true
      },
      {
        image: 'photo1.jpg',
        name: 'TP-LINK USB Receiver Penerima WIFI 821N',
        quantity: 1,
        total: 112800,
        canReview: false
      },
      {
        image: 'photo4.jpg',
        name: 'Helm Bogo Retro Classic Abu-Abu Doff Solid',
        quantity: 1,
        total: 103040,
        canReview: false
      }
    ];

    return transactions.map((transaction) => `
            <div class="transaction-item">
                <img src="${transaction.image}" alt="${transaction.name}">
                <div class="transaction-info">
                    <h4>${transaction.name}</h4>
                    <p>${transaction.quantity} barang</p>
                    <p>Total Belanja: Rp ${transaction.total.toLocaleString()}</p>
                </div>
                <div class="transaction-actions">
                    ${transaction.canReview ?
    '<button class="review-btn">Ulas</button>' : ''
}
                    <button class="secondary">Beli Lagi</button>
                </div>
            </div>
        `).join('');
  }

  attachEventListeners() {
    const searchInput = this.shadowRoot.getElementById('search-input');
    const statusFilter = this.shadowRoot.getElementById('status-filter');
    const productFilter = this.shadowRoot.getElementById('product-filter');
    const dateFilter = this.shadowRoot.getElementById('date-filter');

    searchInput.addEventListener('input', this.handleSearch.bind(this));
    statusFilter.addEventListener('click', this.handleStatusFilter.bind(this));
    productFilter.addEventListener('click', this.handleProductFilter.bind(this));
    dateFilter.addEventListener('click', this.handleDateFilter.bind(this));

    // Add review button event listeners
    const reviewButtons = this.shadowRoot.querySelectorAll('.review-btn');
    reviewButtons.forEach((button) => {
      button.addEventListener('click', this.openReviewModal.bind(this));
    });
  }

  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const transactions = this.shadowRoot.querySelectorAll('.transaction-item');

    transactions.forEach((transaction) => {
      const productName = transaction.querySelector('.transaction-info h4').textContent.toLowerCase();
      transaction.style.display = productName.includes(searchTerm) ? 'flex' : 'none';
    });
  }

  handleStatusFilter() {
    alert('Filter Status dipilih');
  }

  handleProductFilter() {
    alert('Filter Produk dipilih');
  }

  handleDateFilter() {
    alert('Filter Tanggal dipilih');
  }

  openReviewModal() {
    // Implementasi modal review
    alert('Buka modal review');
  }
}

customElements.define('transaction-page', TransactionPage);