import ProfileSource from '../../data/profile-source';

class ProfileHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const userId = localStorage.getItem('id');
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
          <button>Lihat Arsip</button>
        </div>
      </section>

      <!-- Post Container -->
      <div class="post-container">
        ${userPosts.map((post) => `
          <div class="post">
            <div class="post-header">
              <img src="${post.user.avatar}" alt="Profile Picture" class="profile-picture">
              <div class="user-info">
                <h3>${post.user.name}</h3>
                <p>${new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p class="post-text">${post.content}</p>
            <img src="${post.image}" alt="Post Image" class="post-image">
            <div class="post-actions">
              <button class="like-btn">👍 ${post.likesCount}</button>
              <button class="comment-btn">💬 ${post.commentsCount}</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Gaya CSS
    const style = document.createElement('style');
    style.textContent = `

      .header {
        position: relative;
        background: linear-gradient(to right, #a5d6ff, #d6a5ff);
        background-image: url('${profileData.coverPhoto}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px 10px 0px 0px;
      }

      .cover {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .profile-pic {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        border: 5px solid #fff;
      }

      .profile-details h2 {
        font-size: 24px;
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
        border-radius: 0px 0px 10px 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
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
        margin-left: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      }

      .buttons button:hover {
        background-color: #0056b3;
      }

      /* New styles for posts and comments */
      .post-container {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-top: 20px;
      }

      .post, .comment {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 8px;
        background-color: #f8f9fa;
      }

      .post-header, .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }

      .profile-picture {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .user-info {
        flex: 1;
      }

      .user-info h3 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }

      .user-info p {
        margin: 0;
        font-size: 12px;
        color: #666;
      }

      .post-text, .comment-text {
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 1.5;
        color: #444;
      }

      .post-image {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 15px;
      }

      .post-actions, .comment-actions {
        display: flex;
        gap: 10px;
      }

      .like-btn, .comment-btn {
        background: none;
        border: none;
        padding: 5px 10px;
        font-size: 14px;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .like-btn:hover, .comment-btn:hover {
        color: #007bff;
      }

      @media (max-width: 768px) {
        .stats-section {
          flex-direction: column;
          text-align: center;
          gap: 20px;
        }

        .stats {
          flex-direction: column;
          gap: 15px;
        }

        .post-container {
          margin: 10px;
        }
      }
    `;

    // Menambahkan elemen dan gaya ke Shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

// Mendefinisikan custom element
customElements.define('profile-header', ProfileHeader);