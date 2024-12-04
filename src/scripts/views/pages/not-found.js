const NotFound = {
  async render() {
    return `
        <div class="container">
          <h1>404</h1>
          <p>Halaman tidak ditemukan</p>
          <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
        </div>
      `;
  },

  async afterRender() {
    // Kosong atau tambahkan logic jika diperlukan
  }
};

export default NotFound;