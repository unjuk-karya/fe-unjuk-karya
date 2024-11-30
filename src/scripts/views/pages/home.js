const Home = {
  async render() {
    return `
      <p>Hello World</p>
    `;
  },

  async afterRender() {
    // Tambahkan logika interaksi jika diperlukan
    console.log('Home page rendered');
  },
};

export default Home;