class DetailPesanan extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
          /* CSS styles */
        </style>
        <div class="container">
          <div class="header">
            <h1>Detail Pesanan</h1>
          </div>
          <div class="content">
            <div class="pesan-section">
              <h3>Pesanan Selesai</h3>
              <div class="order-details">
                <p><strong>Nomor Pesanan:</strong> INV/20240609/MPL/3956326552</p>
                <p><strong>Tanggal Pembelian:</strong> 09 Juni 2024, 11:57 WIB</p>
              </div>
            </div>
            <div class="detail-section">
              <h3>Detail Produk</h3>
              <div class="order-item">
                <img src="photo2.jpg" alt="Panci Ramyun">
                <div>
                  <p><strong>Panci Ramyun Asli Korea size 14cm</strong></p>
                  <p>Harga: Rp94.640</p>
                  <p>Tambahan: Rp7.700</p>
                </div>
              </div>
              <div class="summary">
                Total Harga: Rp94.640
              </div>
            </div>
            <div class="info-section">
              <h3>Info Pengiriman</h3>
              <div class="shipping-info">
                <p><strong>Kurir:</strong> Kurir Rekomendasi - Reguler</p>
                <p><strong>No Resi:</strong> TKP01-QUL6L12U</p>
                <p><strong>Alamat:</strong> Muhammad Alif Abrar<br>Jl. Kopi Arabika IV, Gedong Meneng, Rajabasa, Bandar Lampung (Kos 3 Putri No. 6)<br>Bandar Lampung, Lampung, Indonesia</p>
              </div>
            </div>
            <div class="btn-section">
              <a href="#" class="btn" id="review-btn">Beri Ulasan</a>
            </div>
            <div class="modal" id="review-modal">
              <div class="modal-content">
                <h3>Beri Ulasan</h3>
                <div class="stars" id="stars">
                  <i class="star" data-value="1">★</i>
                  <i class="star" data-value="2">★</i>
                  <i class="star" data-value="3">★</i>
                  <i class="star" data-value="4">★</i>
                  <i class="star" data-value="5">★</i>
                </div>
                <textarea id="review-text" placeholder="Tulis ulasan Anda di sini..."></textarea>
                <div class="file-input">
                  <label for="upload-image">Upload Gambar (Opsional):</label>
                  <input type="file" id="upload-image" accept="image/*">
                </div>
                <div class="modal-buttons">
                  <a href="#" class="btn" id="submit-review">Kirim</a>
                  <a href="#" class="btn" id="close-modal">Batal</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    this.reviewBtn = this.shadowRoot.getElementById('review-btn');
    this.reviewModal = this.shadowRoot.getElementById('review-modal');
    this.closeModal = this.shadowRoot.getElementById('close-modal');
    this.stars = this.shadowRoot.querySelectorAll('.star');
    this.selectedRating = 0;

    this.reviewBtn.addEventListener('click', () => {
      this.reviewModal.style.display = 'flex';
    });

    this.closeModal.addEventListener('click', () => {
      this.reviewModal.style.display = 'none';
    });

    this.stars.forEach((star) => {
      star.addEventListener('click', () => {
        this.selectedRating = star.getAttribute('data-value');
        this.stars.forEach((s) => s.classList.remove('active'));
        for (let i = 0; i < this.selectedRating; i++) {
          this.stars[i].classList.add('active');
        }
      });
    });

    this.shadowRoot.getElementById('submit-review').addEventListener('click', () => {
      const reviewText = this.shadowRoot.getElementById('review-text').value;
      if (this.selectedRating && reviewText) {
        alert(`Ulasan Anda telah terkirim!\nRating: ${this.selectedRating} bintang\nUlasan: ${reviewText}`);
        this.reviewModal.style.display = 'none';
        this.shadowRoot.getElementById('review-text').value = '';
        this.stars.forEach((s) => s.classList.remove('active'));
      } else {
        alert('Mohon isi rating dan ulasan Anda!');
      }
    });
  }

  connectedCallback() {
    this.shadowRoot.querySelector('style').textContent = `
        /* CSS styles */
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
  
        .container {
          max-width: 1500px;
          margin: 20px auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
  
        .header {
          background: #1D77E6;
          color: #fff;
          padding: 15px;
          text-align: center;
        }
  
        .content {
          padding: 20px;
        }
  
        .btn {
          display: inline-block;
          background: #1D77E6;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 8px;
          text-align: center;
          margin-top: 10px;
        }
  
        .btn:hover {
          background: #3184e9;
        }
  
        /* Modal Styles */
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
        }
  
        .modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
  
        .modal-content h3 {
          margin-top: 0;
        }
  
        .stars {
          display: flex;
          margin-bottom: 10px;
        }
  
        .stars i {
          font-size: 24px;
          color: #ccc;
          cursor: pointer;
        }
  
        .stars i.active {
          color: #FFD700;
        }
  
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 10px;
        }
  
        .modal-buttons {
          text-align: right;
        }
  
        .modal-buttons .btn {
          margin-left: 10px;
        }
  
        .file-input {
          margin-top: 10px;
        }
  
        .file-input label {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
        }
  
        .file-input input[type="file"] {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px;
          width: 100%;
          cursor: pointer;
        }
  
        .pesan-section {
          margin-bottom: 20px;
          margin-top: 30px;
        }
  
        .pesan-section h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }
  
        .detail-section {
          margin-bottom: 20px;
          margin-top: 50px;
        }
  
        .detail-section h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }
  
        .info-section {
          margin-bottom: 50px;
          margin-top: 50px;
        }
  
        .info-section h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }
  
        .order-details {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background: #f4f4f4;
        }
  
        .order-item {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
        }
  
        .order-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 20px;
        }
  
        .order-item div {
          flex: 1;
        }
  
        .summary {
          margin-top: 20px;
          font-size: 16px;
          font-weight: bold;
        }
  
        .shipping-info {
          margin-top: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background: #f4f4f4;
        }
      `;
  }
}

customElements.define('detail-pesanan', DetailPesanan);