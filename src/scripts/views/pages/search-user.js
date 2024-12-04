const SearchUser = {
  async render() {
    const url = window.location.hash;
    const userId = url.split('/')[2];

    return `
        <div class="container">
          <profile-index user-id="${userId}"></profile-index>
        </div>
      `;
  },

  async afterRender() {
    // Kosong atau bisa tambahkan logika tambahan jika diperlukan
  }
};

export default SearchUser;