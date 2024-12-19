import ProfileSource from '../../../data/profile-source.js';

class ProfileHeader extends HTMLElement {
  static get properties() {
    return {
      profileData: { type: Object }
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isFollowing = false;
  }

  set profileData(value) {
    this._profileData = value;
    if (value) {
      this._isFollowing = value.isFollowing;
      this.render();
    }
  }

  async toggleFollow() {
    try {
      this._isFollowing = !this._isFollowing;
      this.updateFollowStatus();
      await ProfileSource.followUser(this._profileData.id);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  }

  updateFollowStatus() {
    const followButton = this.shadowRoot.querySelector('.follow-button');
    if (followButton) {
      followButton.classList.toggle('following', this._isFollowing);
      followButton.textContent = this._isFollowing ? 'Mengikuti' : 'Ikuti';
    }
  }

  async showFollowers() {
    if (!this._profileData?.id) return;

    try {
      const userListModal = document.createElement('user-list-modal');
      userListModal.setType('followers'); // Set tipe dulu
      userListModal.setAttribute('user-id', this._profileData.id);
      document.body.appendChild(userListModal);
    } catch (error) {
      console.error('Error showing followers:', error);
    }
  }

  async showFollowings() {
    if (!this._profileData?.id) return;

    try {
      const userListModal = document.createElement('user-list-modal');
      userListModal.setType('following'); // Set tipe dulu
      userListModal.setAttribute('user-id', this._profileData.id);
      document.body.appendChild(userListModal);
    } catch (error) {
      console.error('Error showing following:', error);
    }
  }

  render() {
    if (!this._profileData) return;
    const coverPhoto = this._profileData.coverPhoto || 'https://picsum.photos/800/400';
    const avatar = this._profileData.avatar || 'https://picsum.photos/200';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .profile-container {
          position: relative;
          background: linear-gradient(to right, #a5d6ff, #d6a5ff);
          background-image: url('${coverPhoto}');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 10px 10px 0 0;
          border: 1px solid #ebf1f6;
          border-bottom: none;
        }

        .header {
          height: 350px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .profile-pic {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          border: 4px solid #fff;
          background-color: #fff;
          margin-bottom: -75px;
          object-fit: cover;
        }

        .profile-info {
          text-align: center;
          padding-top: 85px;
          margin-bottom: 0;
          background: rgba(255, 255, 255, 0.8);
        }

        .profile-info h2 {
          font-size: 24px;
          font-weight: bold;
          color: #000000;
          margin: 0;
          padding-bottom: 8px;
        }

        .profile-info h3 {
          font-size: 18px;
          font-weight: normal;
          color: #555;
          margin: 0;
          padding-bottom: 8px;
        }

        .profile-info p {
          font-size: 16px;
          color: #7c7c7c;
          margin: 0;
        }

        .stats-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #fff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #ebf1f6;
          border-top: none;
          border-bottom: none;
        }

        .stats {
          display: flex;
          gap: 60px;
        }
        
        .stat-item {
          text-align: center;
        }

        .stat-item.clickable {
          cursor: pointer;
        }

        .stat-item.clickable:hover {
          text-decoration: underline;
        }

        .stat-item h3 {
          font-size: 20px;
          font-weight: bold;
          margin: 0;
          color: #333;
        }

        .stat-item p {
          font-size: 14px;
          color: #777;
          margin: 5px 0 0;
        }

        .buttons {
          display: flex;
          gap: 10px;
        }

        .button {
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 11px 30px;
          border-radius: 8px;
          background: #5d87ff;
          font-weight: 600;
        }

        .button-primary {
          background-color: #5d87ff;
          color: #fff;
          border: none;
        }

        .button-primary:hover {
          background: #4f73d9;
        }

        .button-secondary {
          background-color: #f8f9fa;
          color: #333;
          border: 1px solid #ddd;
        }

        .button-secondary:hover {
          background-color: #e9ecef;
        }

        .follow-button {
          margin-left: auto;
          padding: 5px 10px;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid #1D77E6;
          background-color: #1D77E6;
          color: #fff;
          border-radius: 4px;
        }

        .follow-button:hover {
          background-color: #0056b3;
        }

        .follow-button.following {
          background-color: #fff;
          color: #1D77E6;
        }

        .follow-button.following:hover {
          background-color: #f8f9fa;
        }

        @media screen and (max-width: 768px) {
          .header {
            height: 280px;
          }

          .profile-pic {
            width: 120px;
            height: 120px;
            margin-bottom: -60px;
          }

          .profile-info {
            padding-top: 70px;
          }

          .profile-info h2 {
            font-size: 20px;
          }

          .profile-info h3 {
            font-size: 16px;
          }

          .profile-info p {
            font-size: 14px;
          }

          .stats-section {
            flex-direction: column;
            padding: 15px;
            gap: 15px;
          }

          .stats {
            gap: 40px;
            width: 100%;
            justify-content: center;
          }

          .buttons {
            width: 100%;
            justify-content: center;
          }
        }

        @media screen and (max-width: 480px) {
          .header {
            height: 200px;
          }

          .profile-pic {
            width: 100px;
            height: 100px;
            margin-bottom: -50px;
          }

          .profile-info {
            padding-top: 60px;
          }

          .profile-info h2 {
            font-size: 18px;
          }

          .profile-info h3 {
            font-size: 14px;
          }

          .profile-info p {
            font-size: 12px;
          }

          .stats {
            gap: 30px;
          }

          .stat-item h3 {
            font-size: 16px;
          }

          .button {
            padding: 6px 16px;
            font-size: 13px;
          }
        }
      </style>

      <div class="profile-container">
        <header class="header">
          <img src="${avatar}" alt="Foto Profil" class="profile-pic">
        </header>

        <div class="profile-info">
          <h2>${this._profileData.username}</h2>
          <h3>${this._profileData.name || ''}</h3>
          <p>${this._profileData.bio || 'Tidak ada bio'}</p>
        </div>
      </div>

      <section class="stats-section">
        <div class="stats">
          <div class="stat-item">
            <h3>${this._profileData.postsCount}</h3>
            <p>Post</p>
          </div>
          <div class="stat-item">
            <h3>${this._profileData.productsCount}</h3>
            <p>Produk</p>
          </div>
          <div class="stat-item clickable" id="followers">
            <h3>${this._profileData.followersCount}</h3>
            <p>Pengikut</p>
          </div>
          <div class="stat-item clickable" id="followings">
            <h3>${this._profileData.followingCount}</h3>
            <p>Mengikuti</p>
          </div>
        </div>
        <div class="buttons">
          ${!this._profileData.isMyself ? `
            <button class="button follow-button ${this._isFollowing ? 'following' : ''}">
              ${this._isFollowing ? 'Mengikuti' : 'Ikuti'}
            </button>
          ` : ''}
          ${this._profileData.isMyself ? `
            <button class="button button-primary" id="edit-profile">Edit Profil</button>
          ` : ''}
        </div>
      </section>
    `;

    // TODO Go to Edit Profile by Muh Dila
    if (this._profileData.isMyself) {
      const editProfileButton = this.shadowRoot.querySelector('#edit-profile');
      if (editProfileButton) {
        editProfileButton.addEventListener('click', () => {
          window.location.hash = `#/edit-profile/${this._profileData.id}`;
        });
      }
    }

    if (!this._profileData.isMyself) {
      this.shadowRoot.querySelector('.follow-button').addEventListener('click', () => this.toggleFollow());
    }

    this.shadowRoot.querySelector('#followers').addEventListener('click', () => this.showFollowers());
    this.shadowRoot.querySelector('#followings').addEventListener('click', () => this.showFollowings());
  }
}

customElements.define('profile-header', ProfileHeader);
