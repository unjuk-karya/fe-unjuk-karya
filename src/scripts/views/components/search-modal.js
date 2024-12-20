import SearchSource from '../../data/search-source.js';

class SearchModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isLoading = false;
    this.searchResults = [];
    this.hasSearched = false;
    this.hasError = false;
    this.handleRetry = this.handleRetry.bind(this);
  }

  connectedCallback() {
    this.render();
    this.initEventListeners();
  }

  handleRetry() {
    const input = this.shadowRoot.querySelector('.search-input');
    if (input) {
      this.searchUsers(input.value);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
     <style>
       @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css');

       .modal-overlay {
         position: fixed;
         top: 0;
         left: 0;
         width: 100vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.75);
         z-index: 150;
         animation: fadeIn 0.2s ease;
       }

       .modal {
         position: fixed;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
         z-index: 200;
         background-color: #fff;
         width: 550px;
         max-height: 600px;
         padding: 1.5rem;
         border-radius: 16px;
         box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
         animation: slideIn 0.3s ease;
       }

       .modal-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 1.5rem;
       }

       .modal-title {
         font-size: 24px;
         font-weight: 600;
         color: #1a1a1a;
       }

       .modal-close {
         background: none;
         border: none;
         padding: 0;
         color: #666;
         cursor: pointer;
         font-size: 24px;
         display: flex;
         align-items: center;
         margin-top: -4px;
       }

       .modal-close:hover {
         color: #333;
       }

       .search-container {
         position: relative;
         margin-bottom: 1.5rem;
         margin-top: 0.5rem;
       }

       .search-input {
         width: 100%;
         font-family: 'Plus Jakarta Sans', sans-serif;
         padding: 12px 16px;
         border: 1px solid #ddd;
         border-radius: 8px;
         font-size: 16px;
         transition: all 0.2s;
         box-sizing: border-box;
       }

       .search-input:focus {
         outline: none;
         border-color: #2563eb;
         box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
       }

       .results-container {
         max-height: 400px;
         overflow-y: auto;
         padding-right: 0.5rem;
       }

       .results {
         list-style: none;
         padding: 0;
         margin: 0;
       }

       .results li {
         padding: 0.75rem;
         border-radius: 12px;
         display: flex;
         align-items: center;
         gap: 1rem;
         cursor: pointer;
         transition: background 0.2s;
         margin-bottom: 0.5rem;
       }

       .results li:hover {
         background-color: #f8fafc;
       }

       .results li img {
         width: 48px;
         height: 48px;
         border-radius: 50%;
         object-fit: cover;
         border: 2px solid #e5e7eb;
       }

       .user-info {
         flex: 1;
       }

       .user-name {
         font-weight: 500;
         color: #1a1a1a;
         margin-bottom: 0.25rem;
       }

       .user-handle {
         font-size: 0.875rem;
         color: #6b7280;
       }

       .results-container::-webkit-scrollbar {
         width: 6px;
       }

       .results-container::-webkit-scrollbar-track {
         background: #f1f1f1;
         border-radius: 3px;
       }

       .results-container::-webkit-scrollbar-thumb {
         background: #c5c5c5;
         border-radius: 3px;
       }

       .results-container::-webkit-scrollbar-thumb:hover {
         background: #a8a8a8;
       }

       @keyframes fadeIn {
         from { opacity: 0; }
         to { opacity: 1; }
       }

       @keyframes slideIn {
         from { 
           opacity: 0;
           transform: translate(-50%, -48%) scale(0.96);
         }
         to { 
           opacity: 1;
           transform: translate(-50%, -50%) scale(1);
         }
       }

       @media (max-width: 640px) {
         .modal {
           width: 90%;
           max-height: 80vh;
         }
       }
     </style>

     <div class="modal-overlay"></div>
     <div class="modal">
       <div class="modal-header">
         <div class="modal-title">Cari Orang</div>
         <button class="modal-close">×</button>
       </div>

       <div class="search-container">
         <input type="text" 
                class="search-input" 
                placeholder="Cari berdasarkan nama atau username">
       </div>

       <div class="results-container">
         <content-state-handler 
           state="${this.getState()}" 
           message="${this.getMessage()}"
           id="content-handler"
         >
           ${this.renderResults()}
         </content-state-handler>
       </div>
     </div>
   `;
  }

  getState() {
    if (this.isLoading) return 'loading';
    if (this.hasError) return 'error';
    if (!this.hasSearched) return 'empty';
    if (this.searchResults.length === 0) return 'empty';
    return 'success';
  }

  getMessage() {
    if (this.isLoading) return 'Memuat...';
    if (this.hasError) return 'Terjadi kesalahan. Silakan coba lagi.';
    if (!this.hasSearched) return 'Ketik minimal 3 karakter untuk mencari pengguna...';
    if (this.searchResults.length === 0) return 'Tidak ada hasil ditemukan';
    return '';
  }

  renderResults() {
    if (this.searchResults.length === 0) return '';

    return `
     <ul class="results">
       ${this.searchResults.map((user) => `
         <li data-user-id="${user.id}" onclick="this.getRootNode().host.handleUserClick('${user.id}')">
           <img src="${user.avatar || 'https://via.placeholder.com/48'}" 
                alt="${user.name || user.username}"
                onerror="this.src='https://via.placeholder.com/48'">
           <div class="user-info">
             <div class="user-name">${user.name || user.username}</div>
             <div class="user-handle">@${user.username}</div>
           </div>
         </li>
       `).join('')}
     </ul>
   `;
  }

  handleUserClick(userId) {
    this.remove();
    window.location.href = `#/profile/${userId}`;
  }

  async searchUsers(query = '') {
    const searchQuery = String(query).trim();

    if (searchQuery.length < 3) {
      this.searchResults = [];
      this.hasSearched = false;
      this.isLoading = false;
      this.hasError = false;
      this.updateContent();
      return;
    }

    try {
      this.isLoading = true;
      this.hasError = false;
      this.updateContent();

      const results = await SearchSource.searchUser(searchQuery);
      this.searchResults = results;
      this.hasSearched = true;
    } catch (error) {
      console.error('Pencarian gagal:', error);
      this.searchResults = [];
      this.hasSearched = true;
      this.hasError = true;
    } finally {
      this.isLoading = false;
      this.updateContent();
    }
  }

  updateContent() {
    const resultsContainer = this.shadowRoot.querySelector('.results-container');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
       <content-state-handler 
         state="${this.getState()}" 
         message="${this.getMessage()}"
         id="content-handler"
       >
         ${this.renderResults()}
       </content-state-handler>
     `;
    }

    const contentHandler = this.shadowRoot.querySelector('#content-handler');
    contentHandler?.addEventListener('retry', this.handleRetry);
  }

  initEventListeners() {
    const modalClose = this.shadowRoot.querySelector('.modal-close');
    const modalOverlay = this.shadowRoot.querySelector('.modal-overlay');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const contentHandler = this.shadowRoot.querySelector('#content-handler');

    modalClose?.addEventListener('click', () => this.remove());
    modalOverlay?.addEventListener('click', () => this.remove());
    contentHandler?.addEventListener('retry', this.handleRetry);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.remove();
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const value = e.target?.value || '';
        this.searchUsers(value);
      });
    }

    setTimeout(() => searchInput?.focus(), 100);
  }

  disconnectedCallback() {
    const contentHandler = this.shadowRoot.querySelector('#content-handler');
    contentHandler?.removeEventListener('retry', this.handleRetry);
  }
}

customElements.define('search-modal', SearchModal);
