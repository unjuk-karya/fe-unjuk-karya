class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .app-bar {
          padding: 8px 16px;
          background-color: white;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          position: sticky;
          top: 0;
          z-index: 99;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        }

        .app-bar .app-bar__brand h1 {
          color: #1D77E6;
          text-transform: uppercase;
          font-size: 22px;
          margin: 0;
          user-select: none;
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
        }

        .app-bar .app-bar__navigation a:hover {
          color: #1D77E6;
        }
      </style>
      <div class="app-bar">
        <!-- Brand Section -->
        <div class="app-bar__brand">
          <h1>Unjuk Karya</h1>
        </div>
        <div></div>

        <nav class="app-bar__navigation">
          <a href="#" id="logout">Logout</a>
        </nav>
      </div>
    `;

    const logoutButton = this.shadowRoot.querySelector('#logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Logout button clicked!');
      });
    } else {
      console.error('Logout button not found in Web Component.');
    }
  }
}

customElements.define('app-bar', AppBar);
