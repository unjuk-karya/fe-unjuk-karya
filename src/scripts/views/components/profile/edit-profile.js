class EditProfile extends HTMLElement {
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
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
    
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
      /* Closed Header Styling */
      
      .parent-container {
        padding: 0 20px 20px 20px;
        border: 1px solid #ebf1f6;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        margin-top: 16px;
      }
      
      .parent-button {
        margin-left: -20px;
        display: flex;
        margin-bottom: 16px;
      }
      
      .btn-setting {
        margin: 0;
        padding: 16px;
        display: block;
        background: none;
        color: #2a3547;
      }

      .btn-setting:hover:enabled {
        cursor: pointer;
        color: #5d87ff;
        background: none;
        border-radius: 0;
      }
      
      .btn-setting.active {
        color: #5d87ff;
        border-radius: 0;
        border-bottom: 2px solid #5d87ff;
      }
      
      .container {
        display: none;
        gap: 20px;
        width: 100%;
        grid-template-columns: 1fr 1fr;
      }
      
      .container.active {
        display: grid; /* Show the container when it's active */
      }
      
      .container .profile-container:nth-child(3) {
        grid-column: span 2;
      }
      
      #container-security {
        grid-template-columns: 1fr;
      }
      
      #container-wallet {
        grid-template-columns: 1fr;
      }
      
      #icon-info:hover {
        cursor: pointer;
        color: #4f73d9;
      }
      
      #container-wallet .profile-container:nth-child(1) {
        grid-column: span 2;
      }
      
      .profile-container .form-group {
        position: relative;
      }
      
      .profile-container .form-group input {
        padding-right: 40px;
        width: 100%;
      }
      
      .profile-container .input-password {
        position: relative;
      }
      
      .profile-container .eye-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-70%);
        cursor: pointer;
      }

      /* Profile Picture Styling */
      .profile-container-wrapper {
        display: flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 8px;
        background-color: white;
        border: 1px solid #ebf1f6;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        align-items: center;
      }
      
      article {
        width: 100%;
      }
      
      article h2 {
        color: #2a3547;
        font-size: 18px;
      }
      
      article p {
        color: #2a3547;
        font-size: 14px;
        margin-top: 4px;
        margin-bottom: 24px;
      }
      
      .image-container-form {
        position: relative;
        aspect-ratio: 1;
        height: 290px;
        border: 2px dashed white;
        border-radius: 50%;
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
      }

      .image-container-form:hover {
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
        display: flex;
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
      /* Closed Profile Picture Styling */
      
      /* Cover Picture Styling */
      #cover-picture-container-from {
        width: 100%;
        border-radius: 8px;
      }
      
      /* Form Input Styling */
      form {
        width: 100%;
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr 1fr;
      }
      
      form .form-group {
        display: flex;
        flex-direction: column;
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
      
      form .form-group:nth-child(5), .form-group:nth-child(6) {
        grid-column: span 2;
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
      
      /* TODO */
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
        margin-left: auto;
        grid-column: span 2;
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
      
      @media (max-width: 810px) {
        .container {
          grid-template-columns: 1fr;
        }
        
        .container .profile-container:nth-child(3) {
          grid-column: span 1;
        }
        
        .image-container-form {
          height: 100%;
        }
        
        #cover-picture-container-from {
          max-height: 290px;
        }
        
        form {
          display: flex;
          flex-direction: column;
        }
      }
      
      @media (max-width: 690px) {
        /* Header Styling */
        .header-image {
          display: none;
        }
        
        button {
          margin-left: 0;
        }
      }
    `;
  }

  render() {
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="header-content">
        <div class="header-title">
          <h1>Ubah Profil</h1>
          <p>Perbarui informasi profil Anda untuk lebih mengenalkan diri</p>
        </div>
        <div class="header-image">
          <img src="./images/image-create.png" alt="image-create">
        </div>
      </div>
     
      <div class="parent-container">
        <div class="parent-button">
          <button id="btn-setting" class="btn-setting"><i class="fa-solid fa-user" style="padding-right: 8px"></i> Pengaturan</button>
          <button id="btn-security" class="btn-setting"><i class="fa-solid fa-shield-halved" style="padding-right: 8px"></i> Keamanan</button>
          <button id="btn-wallet" class="btn-setting"><i class="fa-solid fa-wallet" style="padding-right: 8px"></i> Dompet</button>
        </div>
        
        <div id="container-setting" class="container">
          <div class="profile-container">
            <div class="profile-container-wrapper">
              <article>
                <h2>Ubah Foto Profil</h2>
                <p>Ubah foto profil Anda di sini</p>
              </article>
              <div class="image-container-form" id="profile-picture-container-from">
                <img id="profile-picture-preview" alt="Thumbnail Preview">
                <div class="upload-instructions">
                  <p>Klik di sini untuk mengunggah</p>
                </div>
                <input type="file" id="profile-picture-input" accept="image/png, image/jpeg, image/jpg">
                <div class="delete-icon" id="profile-picture-delete-icon">
                  <i class="fa fa-times"></i>
                </div>
              </div>
              <p class="upload-sign" id="profile-picture-upload-sign">*.png, *.jpg, dan *.jpeg yang diterima (Max 5MB)</p>
            </div>
          </div>
          
          <div class="profile-container">
            <div class="profile-container-wrapper">
              <article>
                <h2>Ubah Foto Sampul</h2>
                <p>Ubah foto sampul Anda di sini</p>
              </article>
              <div class="image-container-form" id="cover-picture-container-from">
                <img id="cover-picture-preview" alt="Thumbnail Preview">
                <div class="upload-instructions">
                  <p>Klik di sini untuk mengunggah</p>
                </div>
                <input type="file" id="cover-picture-input" accept="image/png, image/jpeg, image/jpg">
                <div class="delete-icon" id="cover-picture-delete-icon">
                  <i class="fa fa-times"></i>
                </div>
              </div>
              <p class="upload-sign" id="cover-picture-upload-sign">*.png, *.jpg, dan *.jpeg yang diterima (Max 5MB)</p>
            </div>
          </div>
          
          <div class="profile-container">
            <div class="profile-container-wrapper">
              <article>
                <h2>Personal Details</h2>
                <p>Untuk mengubah detail pribadi Anda, edit dan simpan di sini</p>
              </article>
              <form>
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
                
                <button type="submit" id="submit-btn">Simpan Perubahan</button>
              </form>
            </div>
          </div>
        </div>
        <div id="container-security" class="container">
          <div class="profile-container">
            <div class="profile-container-wrapper">
              <article>
                <h2>Keamanan</h2>
                <p>Untuk mengubah pengaturan keamanan Anda</p>
            </article>
              <form>
                <div class="form-group">
                  <label for="oldPassword">Kata sandi lama <span style="color: red">*</span></label>
                  <div class="input-password">
                    <input type="password" id="oldPassword" placeholder="Masukkan kata sandi lama">
                    <i class="eye-icon fa fa-eye" id="toggleOldPassword"></i>
                  </div>
                  <div class="validation-message oldPassword-validation">
                    <i class="fa fa-times"></i>
                    <p class="validation-message-p"></p>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="newPassword">Kata sandi baru <span style="color: red">*</span></label>
                  <div class="input-password">
                    <input type="password" id="newPassword" placeholder="Masukkan kata sandi baru">
                    <i class="eye-icon fa fa-eye" id="toggleNewPassword"></i>
                  </div>
                  <div class="validation-message newPassword-validation">
                    <i class="fa fa-times"></i>
                    <p class="validation-message-p"></p>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="confirmPassword">Konfirmasi kata sandi <span style="color: red">*</span></label>
                  <div class="input-password">
                    <input type="password" id="confirmPassword" placeholder="Masukkan konfirmasi kata sandi">
                    <i class="eye-icon fa fa-eye" id="toggleConfirmPassword"></i>
                  </div>
                  <div class="validation-message confirmPassword-validation">
                    <i class="fa fa-times"></i>
                    <p class="validation-message-p"></p>
                  </div>
                </div>
                
                <button type="submit" id="submit-btn-security">Ganti Kata Sandi</button>
              </form>
            </div>
          </div>
        </div>

        <div id="container-wallet" class="container">
          <div class="profile-container">
            <div class="profile-container-wrapper">
              <article>
                <h2>Dompet <i id="icon-info" class="fa-solid fa-circle-info" style="font-size: 14px; margin-left: 4px"></i></h2>
                <p>Untuk mengelola pengaturan dompet Anda</p>
              </article>

              <form>
                <div class="form-group">
                  <label for="midtransServerKey">Midtrans Server Key <span style="color: red">*</span></label>
                  <input type="text" id="midtransServerKey" placeholder="SB-Mid-server-xxx">
                  <div class="validation-message midtransServerKey-validation">
                    <i class="fa fa-times"></i>
                    <p class="validation-message-p"></p>
                  </div>
                </div>
              
                <div class="form-group">
                  <label for="midtransClientKey">Midtrans Client Key <span style="color: red">*</span></label>
                  <input type="text" id="midtransClientKey" placeholder="SB-Mid-client-xxx">
                  <div class="validation-message midtransClientKey-validation">
                    <i class="fa fa-times"></i>
                    <p class="validation-message-p"></p>
                  </div>
                </div>
              
                <div class="form-group">
                  <label for="midtransIsProduction">Midtrans Is Production <span style="color: red">*</span></label>
                  <select id="midtransIsProduction">
                    <option value="" disabled selected>-- Pilih kategori midtrans --</option>
                    <option value="true">Produksi</option>
                    <option value="false">Sandbox</option>
                  </select>
                  <div class="validation-message midtransIsProduction-validation">
                    <i class="fa fa-times"></i>
                    <p class="validation-message-p"></p>
                  </div>
                </div>
              
                <button type="submit" id="submit-btn-wallet">Simpan Dompet</button>
              </form>

            </div>
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
  }

  _attachEventListeners() {
    // Button Event Listeners for Show/Hide Containers
    const btnSetting = this._shadowRoot.querySelector('#btn-setting');
    const btnSecurity = this._shadowRoot.querySelector('#btn-security');
    const btnWallet = this._shadowRoot.querySelector('#btn-wallet');

    const containerSetting = this._shadowRoot.querySelector('#container-setting');
    const containerSecurity = this._shadowRoot.querySelector('#container-security');
    const containerWallet = this._shadowRoot.querySelector('#container-wallet');

    // Set the default active state on load
    containerSetting.classList.add('active');
    containerSecurity.classList.remove('active');
    btnSetting.classList.add('active');
    btnSecurity.classList.remove('active');

    // Handle Button Click to Show/Hide Containers
    btnSetting.addEventListener('click', () => {
      // Show the Setting container and hide the Security container
      containerSetting.classList.add('active');
      containerSecurity.classList.remove('active');
      containerWallet.classList.remove('active');

      // Activate the Setting button and deactivate the Security button
      btnSetting.classList.add('active');
      btnSecurity.classList.remove('active');
      btnWallet.classList.remove('active');
    });

    btnSecurity.addEventListener('click', () => {
      // Show the Security container and hide the Setting container
      containerSecurity.classList.add('active');
      containerSetting.classList.remove('active');
      containerWallet.classList.remove('active');

      // Activate the Security button and deactivate the Setting button
      btnSecurity.classList.add('active');
      btnSetting.classList.remove('active');
      btnWallet.classList.remove('active');
    });

    btnWallet.addEventListener('click', () => {
      // Show the Security container and hide the Setting container
      containerWallet.classList.add('active');
      containerSetting.classList.remove('active');
      containerSecurity.classList.remove('active');

      // Activate the Security button and deactivate the Setting button
      btnWallet.classList.add('active');
      btnSetting.classList.remove('active');
      btnSecurity.classList.remove('active');
    });

    // Toggle Password
    const passwordFields = [
      { inputId: '#oldPassword', toggleId: '#toggleOldPassword' },
      { inputId: '#newPassword', toggleId: '#toggleNewPassword' },
      { inputId: '#confirmPassword', toggleId: '#toggleConfirmPassword' }
    ];

    passwordFields.forEach(({ inputId, toggleId }) => {
      const passwordInput = this._shadowRoot.querySelector(inputId);
      const togglePassword = this._shadowRoot.querySelector(toggleId);

      togglePassword.addEventListener('click', () => {
        const typePassword = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = typePassword;
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
      });
    });

    // Profile Picture
    const profilePictureFormContainer = this._shadowRoot.querySelector('#profile-picture-container-from');
    const profilePictureInput = this._shadowRoot.querySelector('#profile-picture-input');
    const profilePictureDelete = this._shadowRoot.querySelector('#profile-picture-delete-icon');

    // Cover Picture
    const coverPictureFormContainer = this._shadowRoot.querySelector('#cover-picture-container-from');
    const coverPictureInput = this._shadowRoot.querySelector('#cover-picture-input');
    const coverPictureDelete = this._shadowRoot.querySelector('#cover-picture-delete-icon');

    // Modal Detail Preview Image
    const modal = this._shadowRoot.querySelector('.modal');
    const modalImage = this._shadowRoot.querySelector('.modal img');
    const closeModal = this._shadowRoot.querySelector('.modal');

    // Function Profile Picture
    profilePictureFormContainer.addEventListener('click', () => this._triggerFileInput(profilePictureInput));
    profilePictureFormContainer.querySelector('#profile-picture-preview').addEventListener('click', (event) => {
      event.stopPropagation();
      modal.classList.add('show');
      modalImage.src = profilePictureFormContainer.querySelector('#profile-picture-preview').src;
    });
    profilePictureInput.addEventListener('change', (event) => this._previewImageProfile(event));
    profilePictureDelete.addEventListener('click', (event) => this._removeImageProfile(event));

    // Function Cover Picture
    coverPictureFormContainer.addEventListener('click', () => this._triggerFileInput(coverPictureInput));
    coverPictureFormContainer.querySelector('#cover-picture-preview').addEventListener('click', (event) => {
      event.stopPropagation();
      modal.classList.add('show');
      modalImage.src = coverPictureFormContainer.querySelector('#cover-picture-preview').src;
    });
    coverPictureInput.addEventListener('change', (event) => this._previewImageCover(event));
    coverPictureDelete.addEventListener('click', (event) => this._removeImageCover(event));

    // Function Modal Detail Preview Image
    closeModal.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  _triggerFileInput(fileInput) {
    fileInput.click();
  }

  _previewImageProfile(event) {
    const profilePictureFile = event.target.files[0];
    const profilePicturePreview = this._shadowRoot.querySelector('#profile-picture-preview');
    const profilePictureDelete = this._shadowRoot.querySelector('#profile-picture-delete-icon');
    const profilePictureInstructions = this._shadowRoot.querySelector('#profile-picture-upload-sign');

    if (profilePictureFile) {
      const reader = new FileReader();
      reader.onload = () => {
        profilePicturePreview.src = reader.result;
        profilePicturePreview.style.display = 'block';
        profilePictureDelete.style.display = 'flex';

        profilePictureInstructions.textContent = 'Untuk melihat detail klik gambar preview';
      };
      reader.readAsDataURL(profilePictureFile);
    }
  }

  _previewImageCover(event) {
    const coverPictureFile = event.target.files[0];
    const coverPicturePreview = this._shadowRoot.querySelector('#cover-picture-preview');
    const coverPictureDelete = this._shadowRoot.querySelector('#cover-picture-delete-icon');
    const coverUploadInstructions = this._shadowRoot.querySelector('#cover-picture-upload-sign');

    if (coverPictureFile) {
      const reader = new FileReader();
      reader.onload = () => {
        coverPicturePreview.src = reader.result;
        coverPicturePreview.style.display = 'block';
        coverPictureDelete.style.display = 'flex';

        coverUploadInstructions.textContent = 'Untuk melihat detail klik gambar preview';
      };
      reader.readAsDataURL(coverPictureFile);
    }
  }

  _removeImageProfile(event) {
    event.stopPropagation();

    const profilePicturePreview = this._shadowRoot.querySelector('#profile-picture-preview');
    const profilePictureDelete = this._shadowRoot.querySelector('#profile-picture-delete-icon');
    const profilePictureInput = this._shadowRoot.querySelector('#profile-picture-input');
    const profileUploadInstructions = this._shadowRoot.querySelector('#profile-picture-upload-sign');

    profilePicturePreview.src = '';
    profilePicturePreview.style.display = 'none';
    profilePictureDelete.style.display = 'none';
    profilePictureInput.value = '';
    profileUploadInstructions.textContent = '*.png, *.jpg, dan *.jpeg yang diterima (Max 5MB)';
  }

  _removeImageCover(event) {
    event.stopPropagation();

    const coverPicturePreview = this._shadowRoot.querySelector('#cover-picture-preview');
    const coverPictureDelete = this._shadowRoot.querySelector('#cover-picture-delete-icon');
    const coverPictureInput = this._shadowRoot.querySelector('#cover-picture-input');
    const coverUploadInstructions = this._shadowRoot.querySelector('#cover-picture-upload-sign');

    coverPicturePreview.src = '';
    coverPicturePreview.style.display = 'none';
    coverPictureDelete.style.display = 'none';
    coverPictureInput.value = '';
    coverUploadInstructions.textContent = '*.png, *.jpg, dan *.jpeg yang diterima (Max 5MB)';
  }
}

customElements.define('edit-profile', EditProfile);
