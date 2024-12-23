class AppLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            min-height: 100vh;
          }
  
          .container {
            display: flex;
            height: 100vh;
            overflow: hidden;
          }
  
          .main-wrapper {
            flex: 1;      
            margin-left: 0;
            transition: margin-left 0.5s ease;
            display: flex;        
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
          }
  
          .main-wrapper.expanded {
            margin-left: 290px;
          }
  
          .content-wrapper {
            flex: 1;
            overflow-y: auto; /* Tambahkan ini */
            height: 100%; /* Tambahkan ini */
          }
  
          ::slotted(main) {
            padding: 20px;
            height: 100%; /* Tambahkan ini */
          }
        </style>
        
        <div class="container">
          <side-bar></side-bar>
          <div class="main-wrapper">
            <div class="content-wrapper">
              <slot></slot>
            </div>
          </div>
        </div>
      `;

    this.initSidebarToggle();
  }

  initSidebarToggle() {
    const sidebar = this.shadowRoot.querySelector('side-bar');
    const mainWrapper = this.shadowRoot.querySelector('.main-wrapper');

    sidebar.addEventListener('sidebarToggle', () => {
      mainWrapper.classList.toggle('expanded');
    });
  }
}

customElements.define('app-layout', AppLayout);
