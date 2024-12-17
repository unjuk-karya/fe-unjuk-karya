import Swal from 'sweetalert2';
import ReviewSource from '../../../data/review-source.js';

class ReviewModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.review = null;
    this.orderId = null;
    this.state = 'loading';
    this.stateMessage = '';
    this.boundHandleSubmit = this.handleSubmit.bind(this);
    this.boundHandleStarHover = this.handleStarHover.bind(this);
    this.boundHandleStarLeave = this.handleStarLeave.bind(this);
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.savedColors = [];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    document.addEventListener('keydown', this.boundHandleKeyDown);
  }

  disconnectedCallback() {
    this.cleanup();
    document.removeEventListener('keydown', this.boundHandleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      const modal = this.shadowRoot.querySelector('.modal.show');
      if (modal) {
        this.closeModal();
      }
    }
  }

  cleanup() {
    const form = this.shadowRoot.querySelector('.review-form');
    if (form) {
      form.removeEventListener('submit', this.boundHandleSubmit);
    }

    const starContainer = this.shadowRoot.querySelector('.stars');
    if (starContainer) {
      starContainer.removeEventListener('mouseenter', this.boundHandleStarHover);
      starContainer.removeEventListener('mouseleave', this.boundHandleStarLeave);

      const stars = starContainer.querySelectorAll('.star-label');
      stars.forEach((star) => {
        star.removeEventListener('click', star._clickHandler);
      });
    }

    const textarea = this.shadowRoot.querySelector('#review-comment');
    if (textarea) {
      textarea.removeEventListener('input', textarea._inputHandler);
    }
  }

  setState(newState, message = '') {
    this.state = newState;
    this.stateMessage = message;
    this.updateStateHandler();
  }

  updateStateHandler() {
    const stateHandler = this.shadowRoot.querySelector('content-state-handler');
    if (stateHandler) {
      stateHandler.setAttribute('state', this.state);
      if (this.stateMessage) {
        stateHandler.setAttribute('message', this.stateMessage);
      }
    }
  }

  async show(orderId) {
    if (this.orderId !== orderId) {
      this.review = null;
      this.state = 'loading';
    }
    this.orderId = orderId;

    this.render();
    this.setupEventListeners();
    this.showModal();
    await this.fetchReview();
  }

  async fetchReview() {
    try {
      this.setState('loading');
      const review = await ReviewSource.getReview(this.orderId);

      if (!this.shadowRoot.querySelector('.modal.show')) {
        return;
      }

      this.review = review;
      this.setState('success');
      this.render();
      this.setupEventListeners();
    } catch (error) {
      if (!this.shadowRoot.querySelector('.modal.show')) {
        return;
      }

      if (error.status === 404) {
        this.review = null;
        this.setState('success');
        this.render();
        this.setupEventListeners();
      } else {
        this.setState('error', error.data?.message || 'Gagal memuat ulasan');
      }
    }
  }

  handleStarHover() {
    const stars = this.shadowRoot.querySelectorAll('.star-label');
    this.savedColors = Array.from(stars).map((star) => star.style.color);
  }

  handleStarLeave() {
    const stars = this.shadowRoot.querySelectorAll('.star-label');
    stars.forEach((star, index) => {
      star.style.color = this.savedColors[index] || '#ddd';
    });
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('.review-form');
    if (form) {
      form.removeEventListener('submit', this.boundHandleSubmit);
      form.addEventListener('submit', this.boundHandleSubmit);
    }

    const starContainer = this.shadowRoot.querySelector('.stars');
    if (starContainer) {
      starContainer.removeEventListener('mouseenter', this.boundHandleStarHover);
      starContainer.removeEventListener('mouseleave', this.boundHandleStarLeave);

      starContainer.addEventListener('mouseenter', this.boundHandleStarHover);
      starContainer.addEventListener('mouseleave', this.boundHandleStarLeave);

      const stars = this.shadowRoot.querySelectorAll('.star-label');
      stars.forEach((star, index) => {
        if (star._clickHandler) {
          star.removeEventListener('click', star._clickHandler);
        }

        star._clickHandler = () => {
          const rating = 5 - index;
          const radioInput = this.shadowRoot.querySelector(`#star${rating}`);
          if (radioInput) {
            radioInput.checked = true;
          }
          stars.forEach((s, i) => {
            s.style.color = i >= index ? '#FFD700' : '#ddd';
          });
          this.savedColors = Array.from(stars).map((s) => s.style.color);
        };

        star.addEventListener('click', star._clickHandler);
      });
    }

    const textarea = this.shadowRoot.querySelector('#review-comment');
    const charCount = this.shadowRoot.querySelector('.character-count');
    const progressBar = this.shadowRoot.querySelector('.character-progress-bar');
    
    if (textarea && charCount && progressBar) {
      textarea._inputHandler = () => {
        const count = textarea.value.length;
        const percentage = (count / 500) * 100;
        
        charCount.textContent = `${count}/500`;
        progressBar.style.width = `${percentage}%`;

        charCount.classList.remove('warning', 'danger');
        progressBar.classList.remove('warning', 'danger');

        if (count >= 450) {
          charCount.classList.add('danger');
          progressBar.classList.add('danger');
        } else if (count >= 400) {
          charCount.classList.add('warning');
          progressBar.classList.add('warning');
        }
      };

      textarea._inputHandler();
      textarea.addEventListener('input', textarea._inputHandler);
    }

    const closeButton = this.shadowRoot.querySelector('.close-button');
    const modalOverlay = this.shadowRoot.querySelector('.modal');

    if (closeButton && modalOverlay) {
      closeButton.onclick = (e) => {
        e.preventDefault();
        this.closeModal();
      };

      modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
          this.closeModal();
        }
      };
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const reviewData = {
      rating: parseInt(formData.get('rating')),
      comment: formData.get('comment').trim()
    };

    if (!reviewData.rating || !reviewData.comment) {
      await Swal.fire({
        title: 'Error',
        text: 'Mohon lengkapi rating dan ulasan',
        icon: 'error',
        confirmButtonColor: '#1D77E6'
      });
      return;
    }

    try {
      Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      if (this.review) {
        await ReviewSource.updateReview(this.orderId, reviewData);
      } else {
        await ReviewSource.createReview(this.orderId, reviewData);
      }

      Swal.close();

      await Swal.fire({
        title: 'Berhasil',
        text: `Ulasan berhasil ${this.review ? 'diperbarui' : 'ditambahkan'}`,
        icon: 'success',
        confirmButtonColor: '#1D77E6',
      });

      this.dispatchEvent(new CustomEvent('reviewSubmitted', {
        detail: {
          orderId: this.orderId,
          success: true
        },
        bubbles: true,
        composed: true
      }));

      this.closeModal();
      window.location.reload();
    } catch (error) {
      Swal.close();

      await Swal.fire({
        title: 'Error',
        text: error.data?.message || 'Gagal menyimpan ulasan',
        icon: 'error',
        confirmButtonColor: '#1D77E6'
      });

      this.dispatchEvent(new CustomEvent('reviewSubmitted', {
        detail: {
          orderId: this.orderId,
          success: false,
          error: error.data?.message || 'Gagal menyimpan ulasan'
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  showModal() {
    const modal = this.shadowRoot.querySelector('.modal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = this.shadowRoot.querySelector('.modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';

      this.review = null;
      this.orderId = null;
      this.state = 'loading';
      this.cleanup();
    }
  }

  handleRetry = () => {
    if (this.orderId) {
      this.fetchReview();
    }
  };

  render() {
    const wasShown = this.shadowRoot.querySelector('.modal.show') !== null;

    this.shadowRoot.innerHTML = `
<style>
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .modal.show {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.9);
    transition: transform 0.3s ease-in-out;
  }

  .modal.show .modal-content {
    transform: scale(1);
  }

  .modal-header {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    border-radius: 8px 8px 0 0;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    line-height: 1;
    transition: all 0.2s ease;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .close-button:hover {
    color: #333;
    background: #f5f5f5;
  }

  .review-form {
    padding: 16px;
  }

  .rating-group {
    margin-bottom: 24px;
  }

  .rating-label {
    display: block;
    margin-bottom: 12px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .stars {
    display: flex;
    flex-direction: row-reverse;
    gap: 8px;
    justify-content: flex-end;
  }

  .star-radio {
    display: none;
  }

  .star-label {
    color: #ddd;
    font-size: 32px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .star-label:hover {
    animation: pulse 0.3s ease-in-out;
  }

  .star-radio:checked ~ .star-label,
  .star-label:hover ~ .star-label,
  .star-label:hover {
    color: #FFD700;
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  }

  .comment-group {
    margin-bottom: 24px;
    position: relative;
  }

  .comment-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .textarea-wrapper {
    position: relative;
    margin-bottom: 4px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    min-height: 120px;
    font-family: inherit;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.5;
    transition: all 0.2s ease;
  }

  textarea:focus {
    outline: none;
    border-color: #1D77E6;
    box-shadow: 0 0 0 2px rgba(29, 119, 230, 0.1);
  }

  textarea::placeholder {
    color: #999;
  }

  .character-counter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 6px;
    padding: 0 2px;
  }

  .character-progress {
    width: 50px;
    height: 4px;
    background: #eee;
    border-radius: 2px;
    overflow: hidden;
  }

  .character-progress-bar {
    height: 100%;
    background: #1D77E6;
    border-radius: 2px;
    transition: width 0.2s ease, background-color 0.2s ease;
    width: 0;
  }

  .character-progress-bar.warning {
    background: #ffa726;
  }

  .character-progress-bar.danger {
    background: #ef5350;
  }

  .character-count {
    min-width: 65px;
    text-align: right;
    font-size: 12px;
    color: #666;
  }

  .character-count.warning {
    color: #f57c00;
  }

  .character-count.danger {
    color: #d32f2f;
  }

  .submit-button {
    background: #1D77E6;
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .submit-button:hover {
    background: #1565c0;
    transform: translateY(-1px);
  }

  .submit-button:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    .modal-content {
      width: 95%;
      margin: 16px;
    }

    .modal-header {
      padding: 12px 16px;
    }

    .review-form {
      padding: 12px;
    }

    .star-label {
      font-size: 28px;
    }
  }
</style>

      <div class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Ulasan</h2>
            <button class="close-button" type="button">&times;</button>
          </div>

          <div class="modal-body">
            <content-state-handler 
              state="${this.state}" 
              message="${this.stateMessage || ''}"
              @retry="${this.handleRetry}"
            >
              <form class="review-form">
                <div class="rating-group">
                  <label class="rating-label">Rating</label>
                  <div class="stars">
                    ${[5, 4, 3, 2, 1].map((num) => `
                      <input 
                        type="radio" 
                        name="rating" 
                        value="${num}" 
                        class="star-radio" 
                        id="star${num}"
                        ${this.review?.rating === num ? 'checked' : ''}
                        required
                      >
                      <label class="star-label" for="star${num}" title="${num} stars">★</label>
                    `).join('')}
                  </div>
                </div>

                <div class="comment-group">
                  <label class="comment-label" for="review-comment">Ulasan</label>
                  <div class="textarea-wrapper">
                    <textarea 
                      id="review-comment"
                      name="comment" 
                      placeholder="Bagikan pengalaman Anda tentang produk ini..." 
                      required
                      maxlength="500"
                    >${this.review?.comment || ''}</textarea>
                  </div>
                  <div class="character-counter">
                    <div class="character-progress">
                      <div class="character-progress-bar"></div>
                    </div>
                    <span class="character-count">0/500</span>
                  </div>
                </div>

                <button type="submit" class="submit-button">
                  ${this.review ? 'Simpan Perubahan' : 'Kirim Ulasan'}
                </button>
              </form>
            </content-state-handler>
          </div>
        </div>
      </div>
    `;

    // Kembalikan status show jika sebelumnya sedang ditampilkan
    if (wasShown) {
      const modal = this.shadowRoot.querySelector('.modal');
      if (modal) {
        modal.classList.add('show');
      }
    }

    // Initialize star rating display based on review data
    if (this.review && this.state === 'success') {
      const stars = this.shadowRoot.querySelectorAll('.star-label');
      stars.forEach((star, index) => {
        if (4 - index < this.review.rating) {
          star.style.color = '#FFD700';
        }
      });
    }
  }
}

customElements.define('review-modal', ReviewModal);