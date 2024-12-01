class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: 99;
        }

        .app-bar {
          padding: 20px 16px;
          background-color: #fff;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .app-bar .app-bar__brand h1 {
          color: #1D77E6;
          text-transform: uppercase;
          font-size: 22px;
          margin: 0;
          user-select: none;
          margin-left: 75px;
        }

        .app-bar .app-bar__navigation {
          text-align: right;
        }

        .app-bar .app-bar__navigation a {
          text-decoration: none;
          color: black;
          font-size: 16px;
          font-weight: bold;
          padding: 8px;
          transition: color 0.3s;
          cursor: pointer;
        }

        .app-bar .app-bar__navigation a:hover {
          color: #1D77E6;
        }
      </style>
      
      <div class="app-bar">
        <div class="app-bar__brand">
          <h1>Unjuk Karya</h1>
        </div>
        <div></div>
        <nav class="app-bar__navigation">
          <a id="logout">Logout</a>
        </nav>
      </div>
    `;

    this.initLogout();
  }

  initLogout() {
    const logoutButton = this.shadowRoot.querySelector('#logout');
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = '#/login';
    });
  }
}

customElements.define('app-bar', AppBar);