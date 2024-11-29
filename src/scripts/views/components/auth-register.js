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
      
      form button:hover {
        cursor: pointer;
        background: #4f73d9;
      }
      
      .signin-link {
        margin-top: 21px;
        font-size: 14px;
        color: #5a6a85;
        text-align: center;
        font-size: 16px;
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
  }

  render() {
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `  
      <div class="auth-container">
        <article>
          <!--   TODO Ganti logo   -->
<!--          <img class="auth-logo" src="../icons/dark-logo.svg" alt="Icon Logo">-->
          <h1>Selamat datang 👋</h1>
          <p>Daftar sekarang untuk menjadi bagian dari komunitas seni yang kreatif</p>
        </article>
        <form>
          <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input type="text" id="name">
          </div>
          <div class="form-group">
            <label for="email">Alamat Email</label>
            <input type="email" id="email">
          </div>
          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <input type="password" id="password">
          </div>
          <button type="submit">Daftar Sekarang</button>
        </form>
        <p class="signin-link">
          Sudah punya akun? <a href="#" class="signin">Masuk</a>
        </p>
      </div>   
  `;
  }
}

customElements.define('auth-register', AuthRegister);
