const Profile = {
  async render() {
    const url = window.location.hash;
    let content = '';

    if (url.startsWith('#/profile/')) {
      const userId = url.split('/')[2];
      content = `
        <div class="container">
          <profile-index user-id="${userId}"></profile-index>
        </div>
      `;
    } else if (url.startsWith('#/profile')) {
      content = `
        <div class="container">
          <profile-index></profile-index>
        </div>
      `;
    }

    return content;
  },

  async afterRender() {
    // Kosong atau bisa tambahkan logika tambahan jika diperlukan
  }
};

export default Profile;
