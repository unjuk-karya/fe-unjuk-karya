const Explore = {
  async render() {
    return `
    <div class="container">
        <explore-menu></explore-menu>
        </div>
      `;
  },

  async afterRender() {
    // Kosong karena hanya fokus pada render
  }
};

export default Explore;