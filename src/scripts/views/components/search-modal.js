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
           <div class="avatar-container">
             ${user.avatar ?
    `<img class="avatar-image" src="${user.avatar}" alt="${user.name || user.username}">` :
    '<i class="fas fa-user avatar-icon"></i>'
}
           </div>
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
    document.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.remove();
    });
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
         display: flex;
         flex-direction: column;
       }

       .modal-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 1.5rem;
         padding-bottom: 0.5rem;
         border-bottom: 1px solid #e5e7eb;
       }

       .modal-title {
         font-size: 24px;
         font-weight: 600;
         color: #1a1a1a;
       }

       .modal-close {
         background: none;
         border: none;
         margin: -8px;
         color: #666;
         cursor: pointer;
         font-size: 24px;
         border-radius: 50%;
         transition: all 0.2s ease;
           width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
       }

       .modal-close:hover {
         color: #333;
         background-color: #f3f4f6;
       }

       .search-container {
         position: relative;
         margin-bottom: 1.5rem;
       }

       .search-input {
         width: 100%;
         font-family: 'Plus Jakarta Sans', sans-serif;
         padding: 12px 16px;
         border: 1.5px solid #e5e7eb;
         border-radius: 8px;
         font-size: 15px;
         transition: all 0.2s ease;
         box-sizing: border-box;
       }

       .search-input:focus {
         outline: none;
         border-color: #2563eb;
         box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
       }

       .search-input::placeholder {
         color: #9ca3af;
       }

       .results-container {
         flex: 1;
         overflow-y: auto;
         margin: 0 -1.5rem;
         padding: 0 1.5rem;
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
         transition: all 0.2s ease;
         margin-bottom: 0.5rem;
       }

       .results li:hover {
         background-color: #f8fafc;
         transform: translateY(-1px);
       }

       .results li:active {
         transform: translateY(0);
       }

       .avatar-container {
         width: 48px;
         height: 48px;
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         background: #e0e0e0;
         border: 2px solid #e5e7eb;
         overflow: hidden;
         flex-shrink: 0;
       }

       .avatar-image {
         width: 100%;
         height: 100%;
         border-radius: 50%;
         object-fit: cover;
       }

       .avatar-icon {
         font-size: 24px;
         color: #fff;
       }

       .user-info {
         flex: 1;
         min-width: 0;
       }

       .user-name {
         font-weight: 500;
         color: #1a1a1a;
         margin-bottom: 0.25rem;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
       }

       .user-handle {
         font-size: 0.875rem;
         color: #6b7280;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
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

       /* Large screens */
       @media screen and (min-width: 1024px) {
         .modal {
           width: 550px;
           max-height: 600px;
           padding: 1.5rem;
         }
       }

       /* Medium screens */
       @media screen and (max-width: 1023px) and (min-width: 768px) {
         .modal {
           width: 500px;
           max-height: 550px;
           padding: 1.25rem;
         }

         .modal-title {
           font-size: 22px;
         }

         .search-input {
           padding: 10px 14px;
           font-size: 14px;
         }
       }

       /* Small screens */
       @media screen and (max-width: 767px) {
         .modal {
           width: calc(100% - 32px);
           max-width: 400px;
           max-height: calc(100vh - 100px);
           padding: 1rem;
         }

         .modal-title {
           font-size: 20px;
         }

         .search-input {
           padding: 10px 12px;
           font-size: 14px;
         }

         .avatar-container {
           width: 40px;
           height: 40px;
         }

         .avatar-icon {
           font-size: 20px;
         }

         .user-name {
           font-size: 14px;
         }

         .user-handle {
           font-size: 12px;
         }

         .results li {
           padding: 0.5rem;
           gap: 0.75rem;
         }
       }

       /* Extra small screens */
       @media screen and (max-width: 400px) {
         .modal {
           width: calc(100% - 16px);
           padding: 0.75rem;
         }

         .results-container {
           margin: 0 -0.75rem;
           padding: 0 0.75rem;
         }
       }

       /* Handle landscape mode */
       @media screen and (max-height: 600px) {
         .modal {
           max-height: calc(100vh - 32px);
           padding: 1rem;
         }

         .modal-header {
           margin-bottom: 1rem;
         }

         .search-container {
           margin-bottom: 1rem;
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
}

customElements.define('search-modal', SearchModal);