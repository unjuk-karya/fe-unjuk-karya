class CompletingRegister extends HTMLElement {
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
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #eef3ff;
      }
      
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        padding: 24px;
        margin: 24px;
        width: 100%;
        max-width: 640px;
      }
      
      article {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 16px;
        margin-bottom: 21px;
      }
      
      article h1 {
        color: #2a3547;
      }
      
      article p {
        font-size: 16px;
        color: #5a6a85;
      }
      
      .section  {
        display: none;
        flex-direction: column;
        width: 100%;
        justify-content: center;
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
      }

      .section.active {
        display: flex;
      }
      
      .profile-container-wrapper {
         display: flex;
         flex-direction: column;
         width: 100%;
         align-items: center;
      }
      
      #cover-picture-container-from {
        position: relative;
        background-color: #5d87ff;
        width: 100%;
        height: 215px;
        border: 2px dashed white;
        border-radius: 8px;
        cursor: pointer;
      }
      
      #profile-picture-container-from {
        position: relative;
        aspect-ratio: 1;
        max-width: 180px;
        max-height: 180px;
        border: 2px dashed white;
        border-radius: 50%;
        background-color: #5d87ff;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
        overflow: hidden;
        margin-top: -160px;
      }
      
      .image-container-form img {
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      #profile-picture-container-from:hover, #cover-picture-container-from:hover {
        background-color: #4f73d9;
      }
      
      .upload-sign {
        color: #2a3547;
        font-size: 14px;
        text-align: center;
        margin-top: 24px;
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
        top: 16px;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      .delete-icon:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }

      .image-container-form.show-delete .delete-icon {
        display: flex;
      }
      
      /* Form Input Styling */
      .form-group {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      
      .form-group label {
        font-size: 14px;
        font-weight: 600;
        color: #2a3547;
        margin-bottom: 8px;
        margin-top: 16px;
      }
      
      .form-group input, textarea {
        min-height: 40px;
        padding: 8px 16px;
        font-size: 14px;
        border: 1px solid #dfe5ef;
        border-radius: 8px;
        outline: none;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      
      .form-group input:focus, .form-group textarea:focus {
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
      
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
        border: none;
        outline: none;
        box-shadow: none;
        font-size: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 11px 30px;
        border-radius: 8px;
        background: #5d87ff;
        font-weight: 600;
        color: #fff;
        margin-top: 16px;
      }
      
      button:disabled {
        background: #d3d3d3;
        cursor: not-allowed;
      }

      button:hover:enabled {
        cursor: pointer;
        background: #4f73d9;
      }
      
      .button-container {
        display: flex;
        justify-content: space-between;
      }
      
      #nextBtn1 {
        margin-left: auto;
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
      
      @media (max-width: 570px) {
        .upload-instructions p {
          display: none;
        }
      
        .upload-instructions::after {
          content: "Klik untuk unggah foto";
          display: block;
          font-size: 14px;
          color: inherit;
        }
      }
    `;
  }

  render() {
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `  
    <div class="container">
      <article>
        <h1>Lengkapi Profil Anda 📝</h1>
        <p>Lengkapi biodata Anda untuk bergabung sepenuhnya dengan kami</p>
      </article>
      
      <div class="section active" id="section1">
        <div class="profile-container">
          <div class="profile-container-wrapper">
            <div class="image-container-form" id="cover-picture-container-from">
              <img id="cover-picture-preview" alt="Thumbnail Preview">
              <div class="upload-instructions">
                <p>Klik di sini untuk mengunggah foto latar belakang. Maks 5 MB</p>
              </div>
              <input type="file" id="cover-picture-input" accept="image/png, image/jpeg, image/jpg">
              <div class="delete-icon" id="cover-picture-delete-icon">
                <i class="fa fa-times"></i>
              </div>
            </div>
        
            <div class="image-container-form" id="profile-picture-container-from">
              <img id="profile-picture-preview" alt="Thumbnail Preview">
              <div class="upload-instructions">
                <p>Klik di sini untuk mengunggah foto profil. Maks 5 MB</p>
              </div>
              <input type="file" id="profile-picture-input" accept="image/png, image/jpeg, image/jpg">
              <div class="delete-icon" id="profile-picture-delete-icon">
                <i class="fa fa-times"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="name">Nama Lengkap <span style="color: red">*</span></label>
          <input type="text" id="name" placeholder="Masukkan nama lengkap">
          <div class="validation-message name-validation">
            <i class="fa fa-times"></i>
            <p class="validation-message-p"></p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="username">Username <span style="color: red">*</span></label>
          <input type="text" id="username" placeholder="Masukkan username">
          <div class="validation-message username-validation">
            <i class="fa fa-times"></i>
            <p class="validation-message-p"></p>
          </div>
        </div>
        <button id="nextBtn1">Selanjutnya</button>
      </div>
        
      <div class="section" id="section2">
        <div class="form-group">
          <label for="email">Email <span style="color: red">*</span></label>
          <input type="text" id="email" placeholder="Masukkan email">
          <div class="validation-message email-validation">
            <i class="fa fa-times"></i>
            <p class="validation-message-p"></p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="phone-number">Nomor Telepon</label>
          <input type="number" id="phone-number" placeholder="Masukkan nomor telepon">
          <div class="validation-message phone-number-validation">
            <i class="fa fa-times"></i>
            <p class="validation-message-p"></p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="address">Alamat</label>
          <input type="text" id="address" placeholder="Masukkan alamat">
          <div class="validation-message address-validation">
            <i class="fa fa-times"></i>
            <p class="validation-message-p"></p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea id="bio" name="bio" placeholder="Masukkan bio" cols="30" rows="5"></textarea>
          <div class="validation-message bio-validation">
            <i class="fa fa-times"></i>
            <p class="validation-message-p"></p>
          </div>
        </div>
        
        <div class="button-container">
          <button id="prevBtn2">Sebelumnya</button>
          <button id="submitBtn">Selesai</button>
        </div>
      </div>
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
    this._initializeEventListeners();
  }

  _attachEventListeners() {
    // Modal Detail Preview Image
    const modal = this._shadowRoot.querySelector('.modal');
    const modalImage = this._shadowRoot.querySelector('.modal img');
    const closeModal = this._shadowRoot.querySelector('.modal');

    const profilePictureFormContainer = this._shadowRoot.querySelector('#profile-picture-container-from');
    const profilePictureInput = this._shadowRoot.querySelector('#profile-picture-input');
    const profilePictureDelete = this._shadowRoot.querySelector('#profile-picture-delete-icon');

    profilePictureFormContainer.addEventListener('click', () => this._triggerFileInput(profilePictureInput));
    profilePictureFormContainer.querySelector('#profile-picture-preview').addEventListener('click', (event) => {
      event.stopPropagation();
      modal.classList.add('show');
      modalImage.src = profilePictureFormContainer.querySelector('#profile-picture-preview').src;
    });
    // profilePictureInput.addEventListener('change', (event) => this._previewImageProfile(event));
    profilePictureDelete.addEventListener('click', (event) => this._removeImageProfile(event));

    const coverPictureFormContainer = this._shadowRoot.querySelector('#cover-picture-container-from');
    const coverPictureInput = this._shadowRoot.querySelector('#cover-picture-input');
    const coverPictureDelete = this._shadowRoot.querySelector('#cover-picture-delete-icon');

    coverPictureFormContainer.addEventListener('click', () => this._triggerFileInputCover(coverPictureInput));
    coverPictureFormContainer.querySelector('#cover-picture-preview').addEventListener('click', (event) => {
      event.stopPropagation();
      modal.classList.add('show');
      modalImage.src = coverPictureFormContainer.querySelector('#cover-picture-preview').src;
    });
    // coverPictureInput.addEventListener('change', (event) => this._previewImageCover(event));
    coverPictureDelete.addEventListener('click', (event) => this._removeImageCover(event));

    // Function Modal Detail Preview Image
    closeModal.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  _initializeEventListeners() {
    const nextBtn1 = this._shadowRoot.querySelector('#nextBtn1');
    const prevBtn2 = this._shadowRoot.querySelector('#prevBtn2');
    const section1 = this._shadowRoot.querySelector('#section1');
    const section2 = this._shadowRoot.querySelector('#section2');

    nextBtn1.addEventListener('click', () => this._navigateToSection(section1, section2));
    prevBtn2.addEventListener('click', () => this._navigateToSection(section2, section1));
  }

  _navigateToSection(currentSection, nextSection) {
    currentSection.classList.remove('active');
    nextSection.classList.add('active');
  }

  _triggerFileInput(fileInput) {
    fileInput.click();
  }

  _triggerFileInputCover(fileInput) {
    fileInput.click();
  }

  _previewImageProfile(event) {
    const profilePictureFile = event.target.files[0];
    const profilePicturePreview = this._shadowRoot.querySelector('#profile-picture-preview');
    const profilePictureDelete = this._shadowRoot.querySelector('#profile-picture-delete-icon');

    if (profilePictureFile) {
      const reader = new FileReader();
      reader.onload = () => {
        profilePicturePreview.src = reader.result;
        profilePicturePreview.style.display = 'block';
        profilePictureDelete.style.display = 'flex';
      };
      reader.readAsDataURL(profilePictureFile);
    }
  }

  _removeImageProfile(event) {
    event.stopPropagation();

    const profilePicturePreview = this._shadowRoot.querySelector('#profile-picture-preview');
    const profilePictureDelete = this._shadowRoot.querySelector('#profile-picture-delete-icon');
    const profilePictureInput = this._shadowRoot.querySelector('#profile-picture-input');

    profilePicturePreview.src = '';
    profilePicturePreview.style.display = 'none';
    profilePictureDelete.style.display = 'none';
    profilePictureInput.value = '';
  }

  _previewImageCover(event) {
    const coverPictureFile = event.target.files[0];
    const coverPicturePreview = this._shadowRoot.querySelector('#cover-picture-preview');
    const coverPictureDelete = this._shadowRoot.querySelector('#cover-picture-delete-icon');

    if (coverPictureFile) {
      const reader = new FileReader();
      reader.onload = () => {
        coverPicturePreview.src = reader.result;
        coverPicturePreview.style.display = 'block';
        coverPictureDelete.style.display = 'flex';
      };
      reader.readAsDataURL(coverPictureFile);
    }
  }

  _removeImageCover(event) {
    event.stopPropagation();

    const coverPicturePreview = this._shadowRoot.querySelector('#cover-picture-preview');
    const coverPictureDelete = this._shadowRoot.querySelector('#cover-picture-delete-icon');
    const coverPictureInput = this._shadowRoot.querySelector('#cover-picture-input');

    coverPicturePreview.src = '';
    coverPicturePreview.style.display = 'none';
    coverPictureDelete.style.display = 'none';
    coverPictureInput.value = '';
  }
}

customElements.define('completing-register', CompletingRegister);
