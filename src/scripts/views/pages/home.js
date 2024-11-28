const Home = {
  async render() {
    const user = JSON.parse(localStorage.getItem('user'));
    return `
       <h2>Welcome, ${user.name}</h2>
   `;
  },

  async afterRender() {
  },
};

export default Home;