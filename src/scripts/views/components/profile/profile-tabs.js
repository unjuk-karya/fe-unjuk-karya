class ProfileTabs extends HTMLElement {
  static get properties() {
    return {
      activeTab: { type: String }
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.activeTab = this.getAttribute('active-tab') || 'posts';
    this.render();
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
  
          @media screen and (max-width: 480px) {
            .tabs {
              overflow-x: auto;
              justify-content: flex-start;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
  
            .tabs::-webkit-scrollbar {
              display: none;
            }
  
            .tab {
              padding: 12px 20px;
              font-size: 13px;
            }
          }
        </style>
  
        <div class="tabs">
          <div class="tab ${this.activeTab === 'posts' ? 'active' : ''}" data-target="posts">Posts</div>
          <div class="tab ${this.activeTab === 'etalase' ? 'active' : ''}" data-target="etalase">Etalase</div>
          <div class="tab ${this.activeTab === 'liked' ? 'active' : ''}" data-target="liked">Disukai</div>
        </div>
      `;

    // Tab functionality
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.dataset.target;
        this.dispatchEvent(new CustomEvent('tabChange', {
          detail: { target: tab.dataset.target },
          bubbles: true,
          composed: true
        }));
        this.render();
      });
    });
  }
}

customElements.define('profile-tabs', ProfileTabs);
