class CreateProduct extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this._updateStyle();
  }

  _updateStyle() {
    this._style.textContent = `
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
    
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      :host {
        display: block;
      }

      /* Header Styling */
      .header-content {
        position: relative;
        border-radius: 8px;
        background-color: #5d87ff;
        overflow: hidden;
        padding: 20px;
      }

      .header-title h1 {
        font-size: 24px;
        color: white;
        margin-bottom: 8px;
      }

      .header-title p {
        font-size: 14px;
        color: white;
      }

      .header-image {
        position: absolute;
        right: 20px;
        bottom: -60px;
      }
      
      .header-image img {
        width: 150px;
        height: auto;
        object-fit: cover;
      }
      
      h1 {
        color: #2a3547;
        font-size: 18px;
        margin-bottom: 38px;
        text-align: left;
        width: 100%;
      }
      
      .container {
        display: grid;
        gap: 20px;
        width: 100%;
        grid-template-columns: 1.5fr 1fr;
        padding-top: 20px;
      }
      
      .form-container {
        display: flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 8px;
        background-color: white;
        border: 1px solid #ebf1f6;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      
      .image-container-wrapper {
        display: flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 8px;
        background-color: white;
        border: 1px solid #ebf1f6;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      
      form {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(2, 1fr);
      }
      
      form .form-group {
        display: flex;
        flex-direction: column;
      }
      
      form .form-group:nth-child(5) {
        grid-column: span 2;
      }
      
      form .form-group label {
        font-size: 14px;
        font-weight: 600;
        color: #2a3547;
        margin-bottom: 8px;
      }
      
      form .form-group input, textarea, select {
        min-height: 40px;
        padding: 8px 16px;
        font-size: 14px;
        border: 1px solid #dfe5ef;
        border-radius: 8px;
        outline: none;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      
      form .form-group input:focus, form .form-group textarea:focus {
        border-color: #aec3ff;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.25);
      }
      
      .form-group .validation-message {
        display: none;
        font-size: 14px;
        item-align: center;
        color: red;
        margin-top: 4px;
      }
      
      .form-group i {
        margin-top: 4px;
        margin-right: 4px;
      }
      
      .image-container-form {
        position: relative;
        width: 100%;
        min-height: 350px;
        border: 2px dashed #dfe5ef;
        border-radius: 8px;
        background-color: #5d87ff;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
        overflow: hidden;
      }
      
      .image-container-form img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: none;
      }

      .image-container-form:hover {
        background-color: #4f73d9;
      }

      .image-container-wrapper p {
        color: #2a3547;
        font-size: 14px;
        text-align: center;
        margin-top: 8px;
      }

      .upload-instructions {
        font-size: 14px;
        color: white;
        padding: 20px;
        text-align: center;
      }
      
      .upload-instructions p {
        color: white;
      }

      input[type="file"] {
        display: none;
      }

      .delete-icon {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        display: none;
      }

      .delete-icon:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }

      .image-container-form.show-delete .delete-icon {
        display: flex;
      }

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
        border: none;
        flex: 1;
        outline: none;
        box-shadow: none;
        font-size: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 11px 30px;
        border-radius: 8px;
        background: #5d87ff;
        font-weight: 600;
        color: #fff;
      }
      
      #submit-button {
        margin-top: 20px;
      }

      button:disabled {
        background: #d3d3d3;
        cursor: not-allowed;
      }

      button:hover:enabled {
        cursor: pointer;
        background: #4f73d9;
      }
      
      /* Modal Styles */
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        z-index: 1000;
      }
      
      .modal-content {
        width: 95%;
        height: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .modal img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
        object-fit: contain;
        display: block;
      }
      
      .modal.show {
        display: flex;
      }
      
      .mobile-submit-button {
        display: none;
      }
      
      @media (max-width: 885px) {
        .header-image {
          display: none;
        }
      
        .container {
          grid-template-columns: 1fr;
        }
        
        form {
          display: block;
          gap: 0;
        }
        
        form .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
      
        .image-container {
          order: -1;
        }
        
        .mobile-submit-button {
          display: block;
        }
        
        #submit-button {
          display: none;
        }
      }
    `;
  }

  render() {
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="header-content">
        <div class="header-title">
          <h1>Buat Produk</h1>
          <p>Wujudkan karya seni Anda menjadi produk yang dapat dijual</p>
        </div>
        <div class="header-image">
          <img src="./images/image-create.png" alt="image-create">
        </div>
      </div>
      
      <div class="container">
        <div class="form-container">
          <form>
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" placeholder="Masukkan nama produk">
              <div class="validation-message name-validation">
                <i class="fa fa-times"></i>
                <p class="validation-message-p"></p>
              </div>
            </div>
            
            <div class="form-group">
              <label for="price">Harga</label>
              <input type="text" id="price" placeholder="Masukkan harga produk">
              <div class="validation-message price-validation">
                <i class="fa fa-times"></i>
                <p class="validation-message-p"></p>
              </div>
            </div>
            
            <div class="form-group">
              <label for="stock">Stok</label>
              <input type="text" id="stock" placeholder="Masukkan stock produk">
              <div class="validation-message stock-validation">
                <i class="fa fa-times"></i>
                <p class="validation-message-p"></p>
              </div>
            </div>
            
            <div class="form-group">
              <label for="category">Kategori</label>
              <select id="category" placeholder="Pilih kategori produk">
                <option value="" disabled selected>-- Pilih kategori produk --</option>
              </select>
              <div class="validation-message category-validation">
                <i class="fa fa-times"></i>
                <p class="validation-message-p"></p>
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" placeholder="Masukkan deskripsi produk" cols="30" rows="11"></textarea>
              <div class="validation-message description-validation">
                <i class="fa fa-times"></i>
                <p class="validation-message-p"></p>
              </div>
            </div>
          </form>
        </div>
        
        <div class="image-container">
          <div class="image-container-wrapper">
            <div class="image-container-form" id="image-image-container-from">
              <img id="image-preview" alt="Thumbnail Preview">
              <div class="upload-instructions">
                <p>Klik di sini untuk mengunggah</p>
              </div>
              <input type="file" id="file-input" accept="image/png, image/jpeg, image/jpg">
              <div class="delete-icon" id="delete-icon">
                <i class="fa fa-times"></i>
              </div>
            </div>
            <p id="upload-sign">Hanya file gambar *.png, *.jpg, dan *.jpeg yang diterima (Max 5MB)</p>
          </div>
          
          <div class="submit-button-wrapper">
            <button id="submit-button" disabled>Buat Produk</button>
          </div>
        </div>
        
        <!--    Button For Mobile    -->
        <button id="mobile-submit-button" class="mobile-submit-button" disabled>Buat Produk</button>
      </div>
      
      <div class="modal">
        <div class="modal-content">
          <img src="" alt="Modal Image">
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
    this._attachEventListeners();
    this._setupValidation();
  }

  _attachEventListeners() {
    const fileInput = this._shadowRoot.querySelector('#file-input');
    const imageContainer = this._shadowRoot.querySelector('.image-container-form');
    const deleteIcon = this._shadowRoot.querySelector('#delete-icon');
    const modal = this._shadowRoot.querySelector('.modal');
    const modalImage = this._shadowRoot.querySelector('.modal img');
    const closeModal = this._shadowRoot.querySelector('.modal');

    imageContainer.addEventListener('click', () => this._triggerFileInput(fileInput));
    fileInput.addEventListener('change', (event) => this._previewImage(event));
    deleteIcon.addEventListener('click', (event) => this._removeImage(event));

    imageContainer.querySelector('img').addEventListener('click', (event) => {
      event.stopPropagation();
      modal.classList.add('show');
      modalImage.src = imageContainer.querySelector('img').src;
    });

    closeModal.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  _setupValidation() {
    const titleInput = this._shadowRoot.querySelector('#name');
    const priceInput = this._shadowRoot.querySelector('#price');
    const stockInput = this._shadowRoot.querySelector('#stock');
    const categoryInput = this._shadowRoot.querySelector('#category');
    const descInput = this._shadowRoot.querySelector('#description');
    const submitButton = this._shadowRoot.querySelector('#submit-button');
    const mobileSubmitButton = this._shadowRoot.querySelector('#mobile-submit-button');
    const imagePreview = this._shadowRoot.querySelector('#image-preview');
    const fileInput = this._shadowRoot.querySelector('#file-input');

    const titleValidationMessage = this._shadowRoot.querySelector('.name-validation');
    const descValidationMessage = this._shadowRoot.querySelector('.description-validation');
    const priceValidationMessage = this._shadowRoot.querySelector('.price-validation');
    const stockValidationMessage = this._shadowRoot.querySelector('.stock-validation');
    const categoryValidationMessage = this._shadowRoot.querySelector('.category-validation');

    const titleFocused = { value: false };
    const descFocused = { value: false };
    const priceFocused = { value: false };
    const stockFocused = { value: false };
    const categoryFocused = { value: false };

    // Format price input as Indonesian IDR currency
    const formatPriceInput = () => {
      let priceValue = priceInput.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      if (priceValue) {
        priceValue = `Rp ${  priceValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`; // Add dots for thousands and prepend Rp
      }
      priceInput.value = priceValue;
    };

    const validateInputs = () => {
      const titleValid = titleInput.value.trim().length >= 3;
      const descValid = descInput.value.trim().length >= 8;
      const priceValid = !isNaN(priceInput.value.replace(/[^\d]/g, '')) && parseFloat(priceInput.value.replace(/[^\d]/g, '')) > 0;
      const stockValid = !isNaN(stockInput.value) && stockInput.value >= 0;
      const categoryValid = categoryInput.value.trim().length > 0;
      const imageValid = fileInput && fileInput.files.length > 0;

      // Title validation
      if (titleValidationMessage) {
        if (titleFocused.value && !titleValid) {
          titleValidationMessage.style.display = 'flex';
          titleValidationMessage.querySelector('.validation-message-p').textContent = 'Nama harus lebih dari 3 karakter';
          titleInput.style.borderColor = 'red';
        } else {
          titleValidationMessage.style.display = 'none';
          titleInput.style.borderColor = '#dfe5ef';
        }
      }

      // Description validation
      if (descValidationMessage) {
        if (descFocused.value && !descValid) {
          descValidationMessage.style.display = 'flex';
          descValidationMessage.querySelector('.validation-message-p').textContent = 'Deskripsi harus lebih dari 10 karakter';
          descInput.style.borderColor = 'red';
        } else {
          descValidationMessage.style.display = 'none';
          descInput.style.borderColor = '#dfe5ef';
        }
      }

      // Price validation
      if (priceValidationMessage) {
        if (priceFocused.value && !priceValid) {
          priceValidationMessage.style.display = 'flex';
          priceValidationMessage.querySelector('.validation-message-p').textContent = 'Harga harus lebih dari 0';
          priceInput.style.borderColor = 'red';
        } else {
          priceValidationMessage.style.display = 'none';
          priceInput.style.borderColor = '#dfe5ef';
        }
      }

      // Stock validation
      if (stockValidationMessage) {
        if (stockFocused.value && !stockValid) {
          stockValidationMessage.style.display = 'flex';
          stockValidationMessage.querySelector('.validation-message-p').textContent = 'Stok harus lebih dari atau sama dengan 0';
          stockInput.style.borderColor = 'red';
        } else {
          stockValidationMessage.style.display = 'none';
          stockInput.style.borderColor = '#dfe5ef';
        }
      }

      // Category validation
      if (categoryValidationMessage) {
        if (categoryFocused.value && !categoryValid) {
          categoryValidationMessage.style.display = 'flex';
          categoryValidationMessage.querySelector('.validation-message-p').textContent = 'Kategori tidak boleh kosong';
          categoryInput.style.borderColor = 'red';
        } else {
          categoryValidationMessage.style.display = 'none';
          categoryInput.style.borderColor = '#dfe5ef';
        }
      }

      const isValid = titleValid && descValid && priceValid && stockValid && categoryValid && (imageValid || imagePreview.src !== null);
      submitButton.disabled = !isValid;
      mobileSubmitButton.disabled = !isValid;
    };

    // Adding event listeners
    [titleInput, descInput, priceInput, stockInput, categoryInput, fileInput].forEach((input) => {
      input.addEventListener('input', () => {
        if (input === titleInput) titleFocused.value = true;
        if (input === descInput) descFocused.value = true;
        if (input === priceInput) {
          priceFocused.value = true;
          formatPriceInput(); // Format the price input as IDR
        }
        if (input === stockInput) stockFocused.value = true;
        if (input === categoryInput) categoryFocused.value = true;
        validateInputs();
      });
    });

    // Adding focus events to show validation on focus
    titleInput.addEventListener('focus', () => (titleFocused.value = true));
    descInput.addEventListener('focus', () => (descFocused.value = true));
    priceInput.addEventListener('focus', () => (priceFocused.value = true));
    stockInput.addEventListener('focus', () => (stockFocused.value = true));
    categoryInput.addEventListener('focus', () => (categoryFocused.value = true));

    validateInputs();
  }

  _triggerFileInput(fileInput) {
    fileInput.click();
  }

  _previewImage(event) {
    const file = event.target.files[0];
    const imagePreview = this._shadowRoot.querySelector('#image-preview');
    const deleteIcon = this._shadowRoot.querySelector('#delete-icon');
    const uploadInstructions = this._shadowRoot.querySelector('#upload-sign');

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.src = reader.result;
        imagePreview.style.display = 'block';
        deleteIcon.style.display = 'flex';

        uploadInstructions.textContent = 'Untuk melihat detail klik gambar preview';
      };
      reader.readAsDataURL(file);
    }
  }

  _removeImage(event) {
    event.stopPropagation();
    const imagePreview = this._shadowRoot.querySelector('#image-preview');
    const deleteIcon = this._shadowRoot.querySelector('#delete-icon');
    const fileInput = this._shadowRoot.querySelector('#file-input');

    imagePreview.src = '';
    imagePreview.style.display = 'none';
    deleteIcon.style.display = 'none';
    fileInput.value = '';
  }
}

customElements.define('create-product', CreateProduct);
