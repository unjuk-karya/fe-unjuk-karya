class ProductComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          }
          
          .main-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
            max-width: 1000px;
            margin: auto;
            padding: 20px;
          }
  
          .product-container {
            display: flex;
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 100%;
            height: 700px;
            padding: 30px;
          }
  
          .product-image img {
            width: 600px;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
          }
  
          .product-details {
            padding: 20px;
            flex: 1;
          }
  
          .stok {
            color: green;
            font-weight: bold;
          }
  
          .jenis {
            font-size: 14px;
            color: gray;
          }
  
          .product-title {
            font-size: 24px;
            margin: 10px 0;
            margin-top: 50px;
          }
  
          .product-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 40px;
          }
  
          .price {
            margin-bottom: 5px;
          }
  
          .current-price {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
  
          .rating {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 40px;
          }
  
          .quantity {
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-bottom: 40px;
          }
  
          .quantity-wrapper {
            display: flex;
            border: 1px solid #ccc;
            border-radius: 5px;
            overflow: hidden;
            margin-left: 10px;
          }
  
          .quantity-btn {
            padding: 5px 15px;
            border: none;
            background-color: #f9f9f9;
            color: #666;
            font-size: 14px;
            cursor: pointer;
          }
  
          .actions {
            display: flex;
            gap: 10px;
          }
  
          .buy-now {
            padding: 15px 25px;
            background-color: blue;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 10px;
          }
        </style>
  
        <div class="main-container">
          <div class="product-container">
            <div class="product-image">
              <img src="photo1.jpg" alt="Product Image">
            </div>
            <div class="product-details">
              <div class="stok">In Stock</div>
              <div class="jenis">Lukisan</div>
              <h1 class="product-title">Curology Face wash</h1>
              <p class="product-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ex arcu, tincidunt bibendum felis.
              </p>
              <div class="price">
                <span class="current-price">Rp.600.000</span>
              </div>
              <div class="rating">
                <p class="stars">⭐4.8</p>
                <span class="reviews">(236 reviews)</span>
              </div>
              <div class="quantity">
                <span>QTY:</span>
                <div class="quantity-wrapper">
                  <button class="quantity-btn decrement">-</button>
                  <input type="number" value="1" min="1" id="quantity-input">
                  <button class="quantity-btn increment">+</button>
                </div>
              </div>
              <div class="actions">
                <button class="buy-now">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  setupListeners() {
    const decrementButton = this.shadowRoot.querySelector('.decrement');
    const incrementButton = this.shadowRoot.querySelector('.increment');
    const quantityInput = this.shadowRoot.querySelector('#quantity-input');

    decrementButton.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > parseInt(quantityInput.min, 10)) {
        quantityInput.value = currentValue - 1;
      }
    });

    incrementButton.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value, 10);
      quantityInput.value = currentValue + 1;
    });
  }
}

customElements.define('product-component', ProductComponent);
