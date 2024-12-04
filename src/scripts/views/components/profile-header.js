import ProfileSource from '../../data/profile-source';

class ProfileHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const userId = JSON.parse(localStorage.getItem('user')).id;

    try {
      const profileData = await ProfileSource.getUserProfile(userId);
      const userPosts = await ProfileSource.getUserPosts(userId);
      this.render(profileData, userPosts);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    }
  }

  render(profileData, userPosts) {
    const container = document.createElement('div');
    container.innerHTML = `
    <div class="container">
      <!-- Header dengan Background -->
      <header class="header">
        <div class="cover">
          <div class="profile-info">
            <img src="${profileData.avatar}" alt="Profile Picture" class="profile-pic">
            <div class="profile-details">
              <h2>${profileData.name}</h2>
              <p>${profileData.bio || 'No bio available'}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Bagian Statistik dan Tombol -->
      <section class="stats-section">
        <div class="stats">
          <div class="stat-item">
            <h3>${profileData.postsCount}</h3>
            <p>Posts</p>
          </div>
          <div class="stat-item">
            <h3>${profileData.followersCount}</h3>
            <p>Followers</p>
          </div>
          <div class="stat-item">
            <h3>${profileData.followingCount}</h3>
            <p>Following</p>
          </div>
        </div>
        <div class="buttons">
          <button>Edit Profil</button>
        </div>
      </section>

      <!-- Tabs Section -->
      <div class="tabs">
        <div class="tab active" data-target="posts">Posts</div>
        <div class="tab" data-target="etalase">Etalase</div>
        <div class="tab" data-target="saved">Disukai</div>
      </div>

      <!-- Post Content -->
      <div class="tab-content active" id="posts">
        <div class="grid">
          ${userPosts.map((post) => `
            <div class="grid-item">
              <img src="${post.image}" alt="Post Image">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Etalase Content -->
      <div class="tab-content" id="etalase">
        <p>Etalase masih kosong.</p>
      </div>

      <!-- Saved Content -->
      <div class="tab-content" id="saved">
        <p>Saved masih kosong.</p>
      </div>
    </div>
    `;

    // Gaya CSS
    const style = document.createElement('style');
    style.textContent = `
      .container {
        padding:5px;
      }
      .header {
        position: relative;
        background: linear-gradient(to right, #a5d6ff, #d6a5ff);
        background-image: url('${profileData.coverPhoto}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        height: 350px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px 10px 0px 0px;
      }

      .profile-info {
        margin-top: 290px;
      }

      .cover {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .profile-pic {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 5px solid #fff;
      }
        

      .profile-details h2 {
        font-size: 20px;
        font-weight: bold;
        color: #000000;
        text-align: center;
      }

      .profile-details p {
        font-size: 16px;
        color: #7c7c7c;
        text-align: center;
      }

      .stats-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        padding: 20px;
        border-radius: 0px 0px 0px 0px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
        height: 80px;
      }

      .stats {
        display: flex;
        gap: 40px;
      }

      .stat-item h3 {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
      }

      .stat-item p {
        font-size: 14px;
        text-align: center;
        color: #777;
      }

      .buttons button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      }

      .buttons button:hover {
        background-color: #0056b3;
      }

      /* Tabs styles */
      .tabs {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
        background-color: #EEF3FF;
        border-radius: 0px 0px 10px 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .tab {
        padding: 10px 20px;
        cursor: pointer;
        text-transform: uppercase;
        font-size: 14px;
        color: #1D77E6;
      }

      .tab.active {
        color: #1D77E6;
        border-bottom: 2px solid #1D77E6;
      }

      .tab:hover {
        color: #1D77F9;
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr); /* Membagi menjadi 4 kolom */
        grid-auto-rows: 350px;
        gap: 10px;
        justify-content: center;
        align-content: center;
      }

      .grid-item img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        margin: auto;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .grid-item img:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
      }
    `;

    // Tab navigation functionality
    container.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        container.querySelector(`#${tab.dataset.target}`).classList.add('active');
      });
    });

    // Menambahkan elemen dan gaya ke Shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

// Mendefinisikan custom element
customElements.define('profile-header', ProfileHeader);
