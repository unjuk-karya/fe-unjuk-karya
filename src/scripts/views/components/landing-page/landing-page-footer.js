class LandingPageFooter extends HTMLElement {
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
    
    .container {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #eef3ff;
      text-align: center;
      color: #2a3547;
      gap: 4px;
      padding: 20px 0;
    }
  `;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="container">
        <p style="font-weight: 550">&copy; 2024 Unjuk Karya</p>
        <p>Platform untuk seniman Indonesia berkolaborasi dan berkembang</p>
      </div>
    `;
  }

}

customElements.define('landing-page-footer', LandingPageFooter);
