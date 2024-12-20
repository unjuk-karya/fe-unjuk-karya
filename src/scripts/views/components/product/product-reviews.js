import ProductSource from '../../../data/product-source.js';
import { formatDate } from '../../../utils/formatter.js';

class ProductReviews extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      reviews: [],
      reviewsState: 'idle',
      reviewsError: '',
      targetPage: 1,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalReviews: 0,
        totalPages: 0
      }
    };
    this._hasInitialized = false;

    this.handleReviewsRetry = this.handleReviewsRetry.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  static get observedAttributes() {
    return ['product-id'];
  }

  async connectedCallback() {
    const productId = this.getAttribute('product-id');
    if (productId) {
      this._hasInitialized = true;
      await this.fetchReviews(productId);
    }
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'product-id' && oldValue !== newValue && this._hasInitialized) {
      // Only fetch if it's not the initial setup
      this.state.targetPage = 1;
      await this.fetchReviews(newValue);
    }
  }

  async fetchReviews(productId, page = 1) {
    try {
      this.state.reviewsState = 'loading';
      this.state.targetPage = page;
      this.render();

      const reviewData = await ProductSource.getProductReviews(productId, page);
      this.state.reviews = reviewData.reviews;
      this.state.pagination = reviewData.pagination;
      this.state.reviewsState = 'success';
      this.state.reviewsError = '';
    } catch (error) {
      console.error('Error fetching reviews:', error);
      this.state.reviewsState = 'error';
      this.state.reviewsError = 'Gagal memuat ulasan produk.';
    }
    this.render();
  }

  async handleReviewsRetry() {
    const productId = this.getAttribute('product-id');
    if (productId) {
      await this.fetchReviews(productId, this.state.targetPage);
    }
  }

  async handleChangePage(newPage) {
    const productId = this.getAttribute('product-id');
    await this.fetchReviews(productId, newPage);
  }

  generateStars(rating) {
    const roundedRating = Math.round(rating * 2) / 2;
    return Array(5).fill(0)
      .map((_, index) => {
        if (roundedRating >= index + 1) {
          return '<i class="fas fa-star"></i>';
        } else if (roundedRating === index + 0.5) {
          return '<i class="fas fa-star-half-alt"></i>';
        } else {
          return '<i class="far fa-star"></i>';
        }
      })
      .join('');
  }

  render() {
    const { reviews, pagination, reviewsState, reviewsError } = this.state;

    this.shadowRoot.innerHTML = `
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

                :host {
                    display: block;
                }

                .review-card {
                    background: white;
                    border: 1px solid #ebf1f6;
                    border-radius: var(--card-radius, 16px);
                    box-shadow: var(--card-shadow, 0 2px 12px rgba(0, 0, 0, 0.08));
                    overflow: hidden;
                    margin: 0;
                }

                .card-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 16px 24px;
                    font-weight: 600;
                    color: #333;
                    border-bottom: 1px solid var(--border-color, #eee);
                }

                .card-title i {
                    color: #ffc107;
                }

                .review-list {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .review-item {
                    display: flex;
                    gap: 16px;
                }

                .reviewer-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .review-content {
                    flex: 1;
                }

                .reviewer-name {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                }

                .reviewer-name a {
                    color: inherit;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .reviewer-name a:hover {
                    text-decoration: underline;
                    text-underline-offset: 2px;
                    text-decoration-thickness: 1px;
                }

                .review-rating {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .star-rating {
                    display: inline-flex;
                    gap: 2px;
                }

                .star-rating i {
                    font-size: 16px;
                }

                .star-rating .fas.fa-star {
                    color: #ffc107;
                    filter: drop-shadow(0 0 1px rgba(255, 193, 7, 0.5));
                }

                .star-rating .fas.fa-star-half-alt {
                    color: #ffc107;
                    filter: drop-shadow(0 0 1px rgba(255, 193, 7, 0.5));
                }

                .star-rating .far.fa-star {
                    color: #e4e5e9;
                    opacity: 0.8;
                }

                .review-date {
                    color: var(--text-gray, #666);
                    font-size: 14px;
                }

                .review-text {
                    color: #444;
                    line-height: 1.6;
                    margin-top: 8px;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    padding: 16px 24px;
                    border-top: 1px solid var(--border-color, #eee);
                }

                .page-button {
                    padding: 8px 16px;
                    border: 1px solid var(--border-color, #eee);
                    border-radius: 8px;
                    background: white;
                    color: var(--text-gray, #666);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .page-button:hover:not(:disabled) {
                    background: var(--bg-gray, #f8f9fa);
                }

                .page-button.active {
                    background: var(--primary-color, #1D77E6);
                    color: white;
                    border-color: var(--primary-color, #1D77E6);
                }

                .page-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .empty-state {
                    text-align: center;
                    padding: 32px 24px;
                    color: #666;
                }

                @media screen and (max-width: 768px) {
                    .review-card {
                        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                    }

                    .review-list {
                        padding: 16px;
                    }

                    .review-item {
                        gap: 12px;
                    }

                    .reviewer-avatar {
                        width: 40px;
                        height: 40px;
                    }
                }

                @media screen and (max-width: 480px) {
                    .card-title {
                        padding: 12px 16px;
                    }

                    .pagination {
                        padding: 12px 16px;
                        flex-wrap: wrap;
                    }

                    .page-button {
                        padding: 6px 12px;
                        font-size: 14px;
                    }
                }
            </style>

            <div class="review-card">
                <div class="card-title">
                    <i class="fas fa-star"></i>
                    Ulasan Pembeli ${reviewsState === 'success' ? `(${pagination.totalReviews})` : ''}
                </div>
                <content-state-handler 
                    state="${reviewsState}"
                    message="${reviewsError}"
                    data-type="reviews">
                    ${reviewsState === 'success' && reviews.length > 0 ? `
                        <div class="review-list">
                            ${reviews.map((review) => `
                    <div class="review-item">
                        <img src="${review.user.avatar}" alt="${review.user.username}" class="reviewer-avatar">
                        <div class="review-content">
                            <div class="reviewer-name">
                                <a href="#/profile/${review.user.id}">
                                    ${review.user.username}
                                </a>
                            </div>
                            <div class="review-rating">
                                <div class="star-rating">${this.generateStars(review.rating)}</div>
                                <span class="review-date">${formatDate(review.createdAt)}</span>
                            </div>
                            <div class="review-text">${review.comment}</div>
                        </div>
                    </div>
                            `).join('')}
                        </div>
                        ${pagination.totalPages > 1 ? `
                            <div class="pagination">
                                <button 
                                    class="page-button" 
                                    ${pagination.currentPage === 1 ? 'disabled' : ''}
                                    onclick="this.getRootNode().host.handleChangePage(${pagination.currentPage - 1})">
                                    Sebelumnya
                                </button>
                                ${Array(pagination.totalPages).fill(0).map((_, index) => `
                                    <button 
                                        class="page-button ${pagination.currentPage === index + 1 ? 'active' : ''}"
                                        onclick="this.getRootNode().host.handleChangePage(${index + 1})">
                                        ${index + 1}
                                    </button>
                                `).join('')}
                                <button 
                                    class="page-button" 
                                    ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}
                                    onclick="this.getRootNode().host.handleChangePage(${pagination.currentPage + 1})">
                                    Selanjutnya
                                </button>
                            </div>
                        ` : ''}
                    ` : reviewsState === 'success' ? `
                        <div class="empty-state">
                            <p>Belum ada ulasan untuk produk ini.</p>
                        </div>
                    ` : ''}
                </content-state-handler>
            </div>
        `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const reviewsContentHandler = this.shadowRoot.querySelector('content-state-handler[data-type="reviews"]');
    reviewsContentHandler?.addEventListener('retry', this.handleReviewsRetry);
  }

  disconnectedCallback() {
    const reviewsContentHandler = this.shadowRoot.querySelector('content-state-handler[data-type="reviews"]');
    reviewsContentHandler?.removeEventListener('retry', this.handleReviewsRetry);
  }
}

customElements.define('product-reviews', ProductReviews);
