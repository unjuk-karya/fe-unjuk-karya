const Profile = {
  async render() {
    return `
    <div class="container">
        <profile-header></profile-header>
        </div>
        `;
  },

  async afterRender() {
    // Kosong karena hanya fokus pada render
  }
};

export default Profile;