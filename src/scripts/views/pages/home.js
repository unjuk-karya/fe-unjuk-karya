const Home = {
  async render() {
    return `
    <div class="container">
      <home-index></home-index>
    </div>
    `;
  },

  async afterRender() {
    // Tambahkan logika interaksi jika diperlukan
  },
};

export default Home;