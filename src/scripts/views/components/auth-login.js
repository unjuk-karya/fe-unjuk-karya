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
      @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');
    
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
        background-color: #f0f0f0;
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
      
      .remember-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        justify-content: space-between;
        font-size: 14px;
      }
      
      .remember-checkbox input {
        margin: 0;
      }
      
      .remember-checkbox input[type="checkbox"] {
        transform: scale(1.2);
        margin-right: 4px;
      }

      .remember-checkbox a {
        font-size: 14px;
        color: #5d87ff;
        text-decoration: none;
      }

      .remember-checkbox a:hover {
        text-decoration: underline;
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
    const passwordInput = this._shadowRoot.querySelector('#password');
    const submitButton = this._shadowRoot.querySelector('button[type="submit"]');

    const nameValidationMessage = this._shadowRoot.querySelector('.username-validation');
    const passwordValidationMessage = this._shadowRoot.querySelector('.password-validation');

    const nameFocused = { value: false };
    const passwordFocused = { value: false };

    const validateInputs = () => {
      const nameValid = nameInput.value.trim().length >= 5;
      const passwordValid = passwordInput.value.trim().length >= 8;

      // Username validation
      if (nameValidationMessage) {
        if (nameFocused.value && !nameValid) {
          nameValidationMessage.style.display = 'flex';
          nameValidationMessage.querySelector('p').textContent = 'Username minimal 5 karakter';
          nameInput.style.borderColor = 'red';
        } else {
          nameValidationMessage.style.display = 'none';
          nameInput.style.borderColor = '#dfe5ef';
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
      submitButton.disabled = !(nameValid && passwordValid);
    };

    // Add event listeners to the inputs
    [nameInput, passwordInput].forEach((input) =>
      input.addEventListener('input', () => {
        if (input === nameInput) nameFocused.value = true;
        if (input === passwordInput) passwordFocused.value = true;
        validateInputs();
      })
    );

    // Focus event handlers for inputs
    nameInput.addEventListener('focus', () => nameFocused.value = true);
    passwordInput.addEventListener('focus', () => passwordFocused.value = true);

    // Initial validation
    validateInputs();
  }

  render() {
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `  
      <div class="auth-container">
        <article>
          <h1>Selamat datang kembali 🎨</h1>
          <p>Masuk ke akun kamu untuk melanjutkan petualangan bersama kami</p>
        </article>
        <form>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Masukkan username">
            <div class="validation-message username-validation">
              <i class="ti ti-x"></i>
              <p></p>
            </div>
          </div>
          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" placeholder="Masukkan kata sandi">
            <div class="validation-message password-validation">
              <i class="ti ti-x"></i>
              <p></p>
            </div>
          </div>
          <div class="remember-checkbox">
            <div>
              <input type="checkbox" id="remember" name="remember">
              <label for="remember">Ingat perangkat ini</label>
            </div>
            <a href="#">Lupa kata sandi?</a>
          </div>
          <button type="submit" disabled>Masuk</button>
        </form>
        <div class="signin-link">
          <p>Belum punya akun? <a href="#/register">Daftar sekarang</a></p>
        </div>
      </div>
    `;
  }
}

customElements.define('auth-login', AuthLogin);
