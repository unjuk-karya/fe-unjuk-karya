class CreatePost extends HTMLElement {
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
      
      form .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
      }
      
      form .form-group label {
        font-size: 14px;
        font-weight: 600;
        color: #2a3547;
        margin-bottom: 8px;
      }
      
      form .form-group input, textarea {
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
        min-height: 290px;
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
      
      @media (max-width: 690px) {
        .header-image {
          display: none;
        }
      
        .container {
          grid-template-columns: 1fr;
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
    const titleInput = this._shadowRoot.querySelector('#title');
    const descInput = this._shadowRoot.querySelector('#description');
    const submitButton = this._shadowRoot.querySelector('#submit-button');
    const mobileSubmitButton = this._shadowRoot.querySelector('#mobile-submit-button');
    const fileInput = this._shadowRoot.querySelector('#file-input');

    const titleValidationMessage = this._shadowRoot.querySelector('.title-validation');
    const descValidationMessage = this._shadowRoot.querySelector('.description-validation');

    const titleFocused = { value: false };
    const descFocused = { value: false };

    const validateInputs = () => {
      const titleValid = titleInput.value.trim().length >= 3;
      const descValid = descInput.value.trim().length >= 8;
      const imageValid = fileInput && fileInput.files.length > 0;

      if (titleValidationMessage) {
        if (titleFocused.value && !titleValid) {
          titleValidationMessage.style.display = 'flex';
          titleValidationMessage.querySelector('.validation-message-p').textContent = 'Judul harus lebih dari 3 karakter';
          titleInput.style.borderColor = 'red';
        } else {
          titleValidationMessage.style.display = 'none';
          titleInput.style.borderColor = '#dfe5ef';
        }
      }

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

      const isValid = titleValid && descValid && imageValid;
      submitButton.disabled = !isValid;
      mobileSubmitButton.disabled = !isValid;
    };

    [titleInput, descInput, fileInput].forEach((input) => {
      input.addEventListener('input', () => {
        if (input === titleInput) titleFocused.value = true;
        if (input === descInput) descFocused.value = true;
        validateInputs();
      });
    });

    titleInput.addEventListener('focus', () => (titleFocused.value = true));
    descInput.addEventListener('focus', () => (descFocused.value = true));

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

  render() {
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="header-content">
        <div class="header-title">
          <h1>Buat Postingan</h1>
          <p>Buat postingan Anda untuk berbagi karya seni dengan komunitas</p>
        </div>
        <div class="header-image">
          <img src="./images/image-create.png" alt="image-create">
        </div>
      </div>
      
      <div class="container">
        <div class="form-container">
          <form>
            <div class="form-group">
              <label for="title">Judul</label>
              <input type="text" id="title" placeholder="Masukkan judul">
              <div class="validation-message title-validation">
                <i class="fa fa-times"></i>
                <p class="validation-message-p"></p>
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" placeholder="Masukkan deskripsi" cols="30" rows="13"></textarea>
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
            <button id="submit-button" disabled>Buat Postingan</button>
          </div>
        </div>
        
        <!--    Button For Mobile    -->
        <button id="mobile-submit-button" class="mobile-submit-button" disabled>Buat Postingan</button>
      </div>
      
      <div class="modal">
        <div class="modal-content">
          <img src="" alt="Modal Image">
        </div>
      </div>
    `;
  }
}

customElements.define('create-post', CreatePost);
