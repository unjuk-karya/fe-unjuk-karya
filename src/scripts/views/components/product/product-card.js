class ProductCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
        
        .card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s;
          position: relative;
        }
 
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
 
        .image-wrap {
          position: relative;
          padding-top: 100%;
          background: #000;
        }
 
        .image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
 
        .category {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.95);
          color: #1a73e8;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }
 
        .rating {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(26,115,232,0.95);
          color: white;
          padding: 4px 8px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }
 
.love-button {
 position: absolute;
 bottom: 70px;
 right: 12px;
 width: 35px;
 height: 35px;
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

.love-button i {
 font-size: 16px;
 color: white;
 transition: color 0.2s;
}

.love-button:hover {
 transform: scale(1.1);
}

.love-button.active {
 background: #1a73e8;
}

.love-button.active i {
 color: #ff4444;
}
 
        .content {
          padding: 12px;
        }
 
        .name {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
          margin: 0 0 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
 
        .price {
          font-size: 16px;
          font-weight: 600;
          color: #1a73e8;
          margin: 0 0 4px;
        }
 
        .sold {
          font-size: 12px;
          color: #5f6368;
          margin: 0;
        }
      </style>
 
      <div class="card">
        <div class="image-wrap">
          <img class="image" src="${this.getAttribute('image')}" alt="Product">
          <div class="category">${this.getAttribute('category')}</div>
          <div class="rating">⭐ ${this.getAttribute('rating')}</div>
        </div>
        <button class="love-button">
          <i class="fa-solid fa-heart"></i>
        </button>
        <div class="content">
          <h3 class="name">${this.getAttribute('name')}</h3>
          <p class="price">${this.getAttribute('price')}</p>
          <p class="sold">${this.getAttribute('sold')} terjual</p>
        </div>
      </div>
    `;

    shadow.appendChild(template.content.cloneNode(true));

    const loveButton = shadow.querySelector('.love-button');
    loveButton.addEventListener('click', () => {
      loveButton.classList.toggle('active');
    });
  }

  static get observedAttributes() {
    return ['image', 'category', 'rating', 'name', 'price', 'sold'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const img = this.shadowRoot.querySelector('.image');
    const category = this.shadowRoot.querySelector('.category');
    const rating = this.shadowRoot.querySelector('.rating');
    const productName = this.shadowRoot.querySelector('.name');
    const price = this.shadowRoot.querySelector('.price');
    const sold = this.shadowRoot.querySelector('.sold');

    if (img) img.src = this.getAttribute('image');
    if (category) category.textContent = this.getAttribute('category');
    if (rating) rating.textContent = `⭐ ${this.getAttribute('rating')}`;
    if (productName) productName.textContent = this.getAttribute('name');
    if (price) price.textContent = this.getAttribute('price');
    if (sold) sold.textContent = `${this.getAttribute('sold')} terjual`;
  }
}

customElements.define('product-card', ProductCard);