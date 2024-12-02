const Explore = {
  async render() {
    return `
    <div class="container">
        <explore-index></explore-index>
        </div>
      `;
  },

  async afterRender() {
    // Kosong karena hanya fokus pada render
  }
};

export default Explore;