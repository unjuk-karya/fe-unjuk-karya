class ProfileTabs extends HTMLElement {
  static get properties() {
    return {
      activeTab: { type: String }
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.activeTab = 'posts';
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  connectedCallback() {
    this.activeTab = this.getAttribute('active-tab') || 'posts';
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  setupEventListeners() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', this.handleTabClick);
    });
  }

  removeEventListeners() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.removeEventListener('click', this.handleTabClick);
    });
  }

  handleTabClick(event) {
    const newTarget = event.target.dataset.target;
    if (this.activeTab !== newTarget) {
      this.activeTab = newTarget;
      this.updateActiveTab();
      this.dispatchEvent(new CustomEvent('tabChange', {
        detail: { target: newTarget },
        bubbles: true,
        composed: true
      }));
    }
  }

  updateActiveTab() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      if (tab.dataset.target === this.activeTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  static get observedAttributes() {
    return ['active-tab'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active-tab' && oldValue !== newValue) {
      this.activeTab = newValue;
      if (this.shadowRoot) {
        this.updateActiveTab();
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .tabs {
          display: flex;
          justify-content: center;
          background-color: #EEF3FF;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          border: 1px solid #ebf1f6;
          border-top: none;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          padding: 15px 30px;
          cursor: pointer;
          text-transform: uppercase;
          font-size: 14px;
          color: #666;
          transition: all 0.3s;
          position: relative;
          white-space: nowrap;
        }

        .tab.active {
          color: #1D77E6;
          font-weight: 500;
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #1D77E6;
        }

        .tab:hover {
          color: #1D77E6;
        }

        @media screen and (max-width: 768px) {
          .tab {
            padding: 12px 20px;
            font-size: 13px;
          }
        }

        @media screen and (max-width: 480px) {
          .tab {
            padding: 10px 15px;
            font-size: 12px;
          }
        }
      </style>

      <div class="tabs">
        <div class="tab ${this.activeTab === 'posts' ? 'active' : ''}" data-target="posts">Postingan</div>
        <div class="tab ${this.activeTab === 'etalase' ? 'active' : ''}" data-target="etalase">Etalase</div>
        <div class="tab ${this.activeTab === 'liked' ? 'active' : ''}" data-target="liked">Disukai</div>
        <div class="tab ${this.activeTab === 'tersimpan' ? 'active' : ''}" data-target="tersimpan">Tersimpan</div>
      </div>
    `;
  }
}

customElements.define('profile-tabs', ProfileTabs);
