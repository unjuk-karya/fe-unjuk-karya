import MasonryGrid from '../../components/MasonryGrid';
import artworks from '../../data/artworks';

const Explore = {
  async render() {
    return `
      <div class="explore-container">
        ${MasonryGrid.render(artworks)}
      </div>
    `;
  },

  async afterRender() {
    if (!document.querySelector('[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      document.head.appendChild(link);
    }
  }
};

export default Explore;