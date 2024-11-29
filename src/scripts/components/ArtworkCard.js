const ArtworkCard = {
    render(artwork, variant = '') {
      return `
        <div class="grid-item ${variant}">
          <img src="${artwork.imageUrl}" alt="${artwork.title}" class="artwork">
          <div class="overlay">
            <div class="stats">
              <div class="stat-item">
                <i class="fas fa-heart"></i>
                <span>${artwork.likes}</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-comment"></i>
                <span>${artwork.comments}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
  
  export default ArtworkCard;