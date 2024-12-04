class PostCardProfile1 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set post(post) {
    this._post = post;
    this.render();
  }

  render() {
    if (!this._post) return;

    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          
          .grid-item {
            aspect-ratio: 1;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            cursor: pointer;
          }
  
          .grid-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
  
          .grid-item:hover img {
            transform: scale(1.05);
          }
        </style>
  
        <div class="grid-item">
          <img src="${this._post.image}" alt="Post Image">
        </div>
      `;

    const gridItem = this.shadowRoot.querySelector('.grid-item');
    gridItem.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('post-click', {
        detail: { postId: this._post.id },
        bubbles: true,
        composed: true
      }));
    });
  }

  disconnectedCallback() {
    const gridItem = this.shadowRoot.querySelector('.grid-item');
    if (gridItem) {
      gridItem.removeEventListener('click', this.handleClick);
    }
  }
}

customElements.define('post-card-profile-1', PostCardProfile1);