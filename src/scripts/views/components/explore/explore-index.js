import PostSource from '../../../data/post-source.js';
import './post-card.js';
import './post-detail.js';

class ExploreIndex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.posts = [];
  }

  async connectedCallback() {
    this.setupEventListeners();
    await this.fetchPosts();
    this.render();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('post-click', (e) => {
      console.log('Post clicked:', e.detail.postId);
      const postDetail = document.createElement('post-detail');
      postDetail.postId = e.detail.postId;
      document.body.appendChild(postDetail);
    });
  }

  async fetchPosts() {
    try {
      this.posts = await PostSource.getAllPosts();
    } catch (error) {
      this.posts = [];
      console.error('Failed to fetch posts:', error);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container-explore {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .container-explore {
            grid-template-columns: 1fr;
            padding: 16px;
          }
          
          :host {
            margin-left: 0;
          }
        }
      </style>

      <div class="container-explore" id="postsContainer">
      </div>
    `;

    const container = this.shadowRoot.getElementById('postsContainer');

    this.posts.forEach((post) => {
      const postCard = document.createElement('post-card');
      postCard.post = post;
      container.appendChild(postCard);
    });
  }
}

customElements.define('explore-index', ExploreIndex);