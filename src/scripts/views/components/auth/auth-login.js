class AuthLogin extends HTMLElement {
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

      .signup-link {
        margin-top: 21px;
        font-size: 14px;
        color: #5a6a85;
        text-align: center;
        font-size: 14px;
      }

      .signup-link a {
        color: #5d87ff;
        text-decoration: none;
      }

      .signup-link a:hover {
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
    const identifierInput = this._shadowRoot.querySelector('#identifier');
    const passwordInput = this._shadowRoot.querySelector('#password');
    const submitButton = this._shadowRoot.querySelector('button[type="submit"]');

    const identifierValidationMessage = this._shadowRoot.querySelector('.identifier-validation');
    const passwordValidationMessage = this._shadowRoot.querySelector('.password-validation');

    const identifierFocused = { value: false };
    const passwordFocused = { value: false };

    const validateInputs = () => {
      const identifierValid = identifierInput.value.trim().length >= 4;
      const passwordValid = passwordInput.value.trim().length >= 8;

      // Identifier validation
      if (identifierValidationMessage) {
        if (identifierFocused.value && !identifierValid) {
          identifierValidationMessage.style.display = 'flex';
          identifierValidationMessage.querySelector('p').textContent = 'Identifier minimal 4 karakter';
          identifierInput.style.borderColor = 'red';
        } else {
          identifierValidationMessage.style.display = 'none';
          identifierInput.style.borderColor = '#dfe5ef';
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

      // Enable/Disable submit button
      submitButton.disabled = !(identifierValid && passwordValid);
    };

    [identifierInput, passwordInput].forEach((input) =>
      input.addEventListener('input', () => {
        if (input === identifierInput) identifierFocused.value = true;
        if (input === passwordInput) passwordFocused.value = true;
        validateInputs();
      })
    );

    identifierInput.addEventListener('focus', () => (identifierFocused.value = true));
    passwordInput.addEventListener('focus', () => (passwordFocused.value = true));

    validateInputs();

    // Toggle password visibility
    const togglePassword = this._shadowRoot.querySelector('#togglePassword');
    togglePassword.addEventListener('click', () => {
      const typePassword = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = typePassword;
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  render() {
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="auth-container">
        <article>
          <h1>Selamat datang kembali 👋</h1>
          <p>Masuk untuk melanjutkan</p>
        </article>
        <form>
          <div class="form-group">
            <label for="identifier">Username/Email</label>
            <input type="text" id="identifier" placeholder="Masukkan username atau email">
            <div class="validation-message identifier-validation">
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
          <button type="submit" disabled>Masuk</button>
        </form>
        <p class="signup-link">Belum punya akun? <a href="#/register">Daftar</a></p>
      </div>
    `;
  }
}

customElements.define('auth-login', AuthLogin);
