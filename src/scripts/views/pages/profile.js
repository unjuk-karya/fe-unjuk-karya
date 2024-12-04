const Profile = {
  async render() {
    return `
    <div class="container">
        <profile-index></profile-index>
        </div>
        `;
  },

  async afterRender() {
    // Kosong karena hanya fokus pada render
  }
};

export default Profile;