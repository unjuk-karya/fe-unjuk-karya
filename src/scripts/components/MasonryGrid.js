import ArtworkCard from './ArtworkCard';

const MasonryGrid = {
  render(artworks) {
    return `
      <div class="masonry-grid">
        ${artworks.map((artwork, index) => {
          let variant = '';
          if (index === 0) variant = 'grid-item-large';
          else if (index === 4) variant = 'grid-item-tall';
          else if (index === 6) variant = 'grid-item-wide';
          
          return ArtworkCard.render(artwork, variant);
        }).join('')}
      </div>
    `;
  }
};

export default MasonryGrid;