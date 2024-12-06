class GalleryCard extends HTMLElement {
    constructor() {
      super();
  
      // Attach Shadow DOM
      const shadow = this.attachShadow({ mode: 'open' });
  
      // Component Template
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host {
            font-family: Arial, sans-serif;
          }
  
          .card {
            position: relative;
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
  
          .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
          }
  
          .card img {
            width: 100%;
            height: 400px;
            object-fit: cover;
          }
  
          .card-content {
            padding: 10px;
            text-align: left;
          }
  
          .card-content h3 {
            font-size: 28px;
            color: #333;
            margin: 5px 0;
          }
  
          .card-content .price {
            font-size: 18px;
            color: #1D77E6;
            margin: 10px 0;
          }
  
          .rating-badge {
            position: absolute;
            bottom: 180px;
            padding: 10px 15px;
            background-color: #1D77E6;
            color: white;
            border-radius: 0 10px 10px 0;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
            z-index: 1;
          }
  
          .favorite i {
            position: absolute;
            right: 10px;
            bottom: 110px;
            padding: 20px;
            background-color: #1D77E6;
            color: white;
            border-radius: 50%;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
          }
  
          .category-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #6a88ad;
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
          }
        </style>
        <div class="card">
          <img src="${this.getAttribute('image')}" alt="Produk">
          <div class="category-badge">${this.getAttribute('category')}</div>
          <div class="rating-badge">⭐ ${this.getAttribute('rating')}</div>
          <div class="favorite">
            <i class="fa-solid fa-heart"></i>
          </div>
          <div class="card-content">
            <h3>${this.getAttribute('title')}</h3>
            <p class="price"><strong>${this.getAttribute('price')}</strong></p>
            <p class="sold">${this.getAttribute('sold')} terjual</p>
          </div>
        </div>
      `;
  
      // Append Template to Shadow DOM
      shadow.appendChild(template.content.cloneNode(true));
    }
  }
  
  // Define the custom element
  customElements.define('gallery-card', GalleryCard);
  