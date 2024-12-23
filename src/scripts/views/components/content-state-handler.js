class ContentStateHandler extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['state', 'message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  handleRetry() {
    this.dispatchEvent(new CustomEvent('retry'));
  }

  render() {
    const state = this.getAttribute('state') || 'loading';
    const message = this.getAttribute('message') || '';

    this.shadowRoot.innerHTML = `
      <style>
        .state-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 32px 16px;
        }

        .state-content {
          text-align: center;
          color: #262626;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e9ecef;
          border-top: 3px solid #1D77E6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .icon {
          font-size: 48px;
          margin-bottom: 16px;
          color: #8e8e8e;
        }

        .message {
          font-size: 14px;
          color: #8e8e8e;
          margin: 8px 0 0;
        }

        .retry-button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #1D77E6;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .retry-button:hover {
          background-color: #1565C0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>

      ${state === 'success' ?
    '<slot></slot>' :
    this.getStateTemplate(state, message)
}
    `;

    if (state === 'error') {
      const retryButton = this.shadowRoot.querySelector('.retry-button');
      if (retryButton) {
        retryButton.addEventListener('click', () => this.handleRetry());
      }
    }
  }

  getStateTemplate(state, message) {
    const templates = {
      loading: `
        <div class="state-container">
          <div class="state-content">
            <div class="loading-spinner"></div>
            <p class="message">Memuat...</p>
          </div>
        </div>
      `,
      error: `
        <div class="state-container">
          <div class="state-content">
            <div class="icon">⚠️</div>
            <p class="message">${message || 'Terjadi kesalahan. Silakan coba lagi.'}</p>
            <button class="retry-button">Coba lagi</button>
          </div>
        </div>
      `,
      empty: `
        <div class="state-container">
          <div class="state-content">
            <div class="icon">📭</div>
            <p class="message">${message || 'Tidak ada data'}</p>
          </div>
        </div>
      `
    };

    return templates[state] || '<slot></slot>';
  }
}

customElements.define('content-state-handler', ContentStateHandler);