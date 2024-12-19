class AuthRegister extends HTMLElement {
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
      
      .auth-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        padding: 24px;
        width: 100%;
        max-width: 440px;
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
      
      .auth-with-another button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
        border: 1px solid #eff4f8;
        outline: none;
        box-shadow: none;
        font-size: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 11px 30px;
        border-radius: 8px;
      }
      
      .auth-with-another button:hover {
        cursor: pointer;
      }
      
      .break-paragraph {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #5a6a85;
        margin: 24px 0;
      }
      
      form {
        width: 100%;
      }
      
      form .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
      }
      
      form .form-group label {
        margin-bottom: 8px;
        font-size: 14px;
        color: #2a3547;
        font-weight: 600;
      }
      
      form .form-group input {
        width: 100%;
        min-height: 40px;
        padding: 8px 16px;
        font-size: 14px;
        border: 1px solid #dfe5ef;
        border-radius: 8px;
        outline: none;
        box-sizing: border-box;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      
      form .form-group input:focus {
        border-color: #aec3ff;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.25);
      }
      
      .form-group .validation-message {
        display: none;
        align-items: center;
        text-align: center;
        margin-top: 4px;
        font-size: 14px;
        color: red;
      }
      
      .form-group .validation-message i {
        margin-right: 4px;
        font-size: 18px;
      }
      
      .input-container {
        position: relative;
        width: 100%;
      }
      
      input[type="password"] {
        width: 100%;
        min-height: 40px;
        padding: 8px 16px;
        font-size: 14px;
        border: 1px solid #dfe5ef;
        border-radius: 8px;
        outline: none;
        box-sizing: border-box;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      
      .eye-icon {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 18px;
        color: #5a6a85;
      }
      
      .eye-icon:hover {
        color: #4f73d9;
      }

      form button {
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
        width: 100%;
        margin-top: 24px;
      }
      
      form button:disabled {
        background: #d3d3d3;
        cursor: not-allowed;
      }
      
      form button:hover:enabled {
        cursor: pointer;
        background: #4f73d9;
      }
      
      .signin-link {
        margin-top: 21px;
        font-size: 14px;
        color: #5a6a85;
        text-align: center;
        font-size: 14px;
      }
      
      .signin-link a {
        color: #5d87ff;
        text-decoration: none;
      }
      
      .signin-link a:hover {
        text-decoration: underline;
        color: #4f73d9;
      }
      
      @media (max-width: 480px) {
        .auth-container {
          width: 90%;
        }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this._setupValidation();
  }

  _setupValidation() {
    const nameInput = this._shadowRoot.querySelector('#username');
    const emailInput = this._shadowRoot.querySelector('#email');
    const passwordInput = this._shadowRoot.querySelector('#password');
    const confirmPasswordInput = this._shadowRoot.querySelector('#confirmPassword');
    const submitButton = this._shadowRoot.querySelector('button[type="submit"]');

    const nameValidationMessage = this._shadowRoot.querySelector('.username-validation');
    const emailValidationMessage = this._shadowRoot.querySelector('.email-validation');
    const passwordValidationMessage = this._shadowRoot.querySelector('.password-validation');
    const confirmPasswordValidationMessage = this._shadowRoot.querySelector('.confirmPassword-validation');

    const nameFocused = { value: false };
    const emailFocused = { value: false };
    const passwordFocused = { value: false };
    const confirmPasswordFocused = { value: false };

    const validateInputs = () => {
      const nameValid = nameInput.value.trim().length >= 4;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      const passwordValid = passwordInput.value.trim().length >= 8;
      const confirmPasswordValid = confirmPasswordInput.value === passwordInput.value.trim();

      // Username validation
      if (nameValidationMessage) {
        if (nameFocused.value && !nameValid) {
          nameValidationMessage.style.display = 'flex';
          nameValidationMessage.querySelector('p').textContent = 'Username minimal 4 karakter';
          nameInput.style.borderColor = 'red';
        } else {
          nameValidationMessage.style.display = 'none';
          nameInput.style.borderColor = '#dfe5ef';
        }
      }

      // Email validation
      if (emailValidationMessage) {
        if (emailFocused.value && !emailValid) {
          emailValidationMessage.style.display = 'flex';
          emailValidationMessage.querySelector('p').textContent = 'Masukkan alamat email yang valid';
          emailInput.style.borderColor = 'red';
        } else {
          emailValidationMessage.style.display = 'none';
          emailInput.style.borderColor = '#dfe5ef';
        }
      }

      // Password validation
      if (passwordValidationMessage) {
        if (passwordFocused.value && !passwordValid) {
          passwordValidationMessage.style.display = 'flex';
          passwordValidationMessage.querySelector('p').textContent = 'Kata sandi minimal 8 karakter';
          passwordInput.style.borderColor = 'red';
        } else {
          passwordValidationMessage.style.display = 'none';
          passwordInput.style.borderColor = '#dfe5ef';
        }
      }

      // Confirm Password validation
      if (confirmPasswordValidationMessage) {
        if (confirmPasswordFocused.value && !confirmPasswordValid) {
          confirmPasswordValidationMessage.style.display = 'flex';
          confirmPasswordValidationMessage.querySelector('p').textContent = 'Kata sandi tidak cocok';
          confirmPasswordInput.style.borderColor = 'red';
        } else {
          confirmPasswordValidationMessage.style.display = 'none';
          confirmPasswordInput.style.borderColor = '#dfe5ef';
        }
      }

      // Enable/Disable submit button
      submitButton.disabled = !(nameValid && emailValid && passwordValid && confirmPasswordValid);
    };

    // Add event listeners to the inputs
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach((input) =>
      input.addEventListener('input', () => {
        if (input === nameInput) nameFocused.value = true;
        if (input === emailInput) emailFocused.value = true;
        if (input === passwordInput) passwordFocused.value = true;
        if (input === confirmPasswordInput) confirmPasswordFocused.value = true;
        validateInputs();
      })
    );

    // Focus event handlers for inputs
    nameInput.addEventListener('focus', () => nameFocused.value = true);
    emailInput.addEventListener('focus', () => emailFocused.value = true);
    passwordInput.addEventListener('focus', () => passwordFocused.value = true);
    confirmPasswordInput.addEventListener('focus', () => confirmPasswordFocused.value = true);

    // Initial validation
    validateInputs();

    // Toggle password visibility
    const togglePassword = this._shadowRoot.querySelector('#togglePassword');
    togglePassword.addEventListener('click', () => {
      const typePassword = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = typePassword;
      togglePassword.classList.toggle('fa-eye-slash');
    });

    // Toggle confirm password visibility
    const togglePasswordConfirm = this._shadowRoot.querySelector('#togglePasswordConfirm');
    togglePasswordConfirm.addEventListener('click', () => {
      const typePasswordConfirm = confirmPasswordInput.type === 'password' ? 'text' : 'password';
      confirmPasswordInput.type = typePasswordConfirm;
      togglePasswordConfirm.classList.toggle('fa-eye-slash');
    });
  }

  render() {
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `  
    <div class="auth-container">
      <article>
        <h1>Selamat datang 👋</h1>
        <p>Daftar sekarang untuk menjadi bagian dari komunitas seni yang kreatif</p>
      </article>
      <form>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" placeholder="Masukkan username">
          <div class="validation-message username-validation">
            <i class="fa fa-times"></i>
            <p></p>
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Masukkan email">
          <div class="validation-message email-validation">
            <i class="fa fa-times"></i>
            <p></p>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Kata Sandi</label>
          <div class="input-container">
            <input type="password" id="password" placeholder="Masukkan kata sandi">
            <i class="eye-icon fa fa-eye" id="togglePassword"></i>
          </div>
          <div class="validation-message password-validation">
            <i class="fa fa-times"></i>
            <p></p>
          </div>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Kata Sandi</label>
          <div class="input-container">
            <input type="password" id="confirmPassword" placeholder="Konfirmasi kata sandi">
            <i class="eye-icon fa fa-eye" id="togglePasswordConfirm"></i>
          </div>
          <div class="validation-message confirmPassword-validation">
            <i class="fa fa-times"></i>
            <p></p>
          </div>
        </div>
        <button type="submit" disabled>Daftar</button>
      </form>
      <div class="signin-link">
        <p>Sudah punya akun? <a href="#/login">Masuk</a></p>
      </div>
    </div>
  `;
  }

}

customElements.define('auth-register', AuthRegister);
