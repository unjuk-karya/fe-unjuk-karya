const NotFound = {
  async render() {
    return `
        <div class="container">
         <not-found></not-found>
        </div>
      `;
  },

  async afterRender() {
    // Kosong atau tambahkan logic jika diperlukan
  }
};

export default NotFound;