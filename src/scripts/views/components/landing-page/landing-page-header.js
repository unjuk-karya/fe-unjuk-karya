class LandingPage extends HTMLElement {
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
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css');
    
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      :host {
        display: block;
        background: #eef3ff;
      }
      
      .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        height: 80px;
      }
      
      .container-anchor {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      img {
        height: 38px;
      }
      
      .container-anchor button {
        background: none;
        color: #2a3547;
        font-size: 16px;
        font-weight: 550;
      }
      
      .container-anchor button:hover {
        cursor: pointer;
        color: #4f73d9;
      }
      
      button {
        display: flex;
        justify-content: center;
        align-items: center;
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
      }
      
      .begin:hover {
        cursor: pointer;
        background: #4f73d9;
      }
      
      .hamburger {
        display: none;
      }
      
      .menu-mobile {
        display: none;
      }
      
      @media (max-width: 768px) {
        .container {
          height: 80px;
        }
        
        img {
          height: 36px;
        } 
      
        .container-anchor {
          display: none;
        }
      
        .begin {
          display: none;
        }
      
        .hamburger {
          display: block;
          background: none;
          border: none;
          padding: 0;
          font-size: 21px;
          color: #2a3547;
        }
      
        .hamburger:hover {
          cursor: pointer;
          color: #4f73d9;
        }
      
        .menu-mobile {
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          right: -250px;
          background: white;
          height: 100%;
          width: 250px;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: right 0.3s ease;
        }
      
        .menu-mobile button {
          padding: 8px 0;
          background: none;
          color: #2a3547;
          font-size: 16px;
          font-weight: 550;
          justify-content: flex-start;
        }
        
        .menu-mobile button:hover {
          cursor: pointer;
          color: #4f73d9;
        }
      
        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
      
        .logo {
          height: 40px;
        }
      
        .close {
          background: none;
          border: none;
          font-size: 30px;
          color: #2a3547;
          cursor: pointer;
          padding: 0;
        }
      
        .close:hover {
          color: #4f73d9;
        }
      
        .menu-mobile.active {
          right: 0;
        }
      
        .menu-mobile.active + .backdrop {
          display: block;
        }
      }

    `;
  }

  connectedCallback() {
    this.render();
    this._addHamburgerListener();
  }

  render() {
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="container">
        <img src="./images/logo2.png" alt="Logo">
        <div class="container-anchor">
          <button>Beranda</button>
          <button>Tentang Kami</button>
          <button>Kontak</button>
        </div>
        <button class="begin">Ayo Mulai</button>
        
        <button class="hamburger" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        
        <div class="menu-mobile">
          <div class="menu-header">
            <img class="logo" src="./images/logo.png" alt="Logo">
            <button class="close" aria-label="Close"><i class="fa-solid fa-x"></i></button>
          </div>
          
          <button>Beranda</button>
          <button>Tentang Kami</button>
          <button>Kontak</button>
        </div>
      </div>
    `;
  }

  _addHamburgerListener() {
    const hamburger = this._shadowRoot.querySelector('.hamburger');
    const menuMobile = this._shadowRoot.querySelector('.menu-mobile');
    const closeButton = this._shadowRoot.querySelector('.close');

    hamburger.addEventListener('click', () => {
      menuMobile.classList.toggle('active');
    });

    closeButton.addEventListener('click', () => {
      menuMobile.classList.remove('active');
    });
  }

}

customElements.define('landing-page-header', LandingPage);
