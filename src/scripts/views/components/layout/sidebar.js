import Swal from 'sweetalert2';

class SideBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css');

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 55px;
          background-color: #fff;
          padding: 0.4rem 0.8rem;
          z-index: 200;
          transition: all 0.5s ease;
          border: 1px solid #ebf1f6;
        }

        .sidebar.active {
          width: 250px;
        }
        
        .sidebar #btn {
          position: absolute;
          margin-top: 20px;
          color: #2A3547;
          top: 0;
          left: 50%;
          font-size: 1.2rem;
          line-height: 50px;
          transform: translateX(-50%);
          cursor: pointer;
          transition: left 0.5s ease;
        }

        .sidebar.active #btn {
          left: 90%;
        }

        .sidebar .top {
          margin-top: 20px;
        }

        .sidebar .top .logo {
          color: #2A3547;
          display: flex;
          align-items: center;
          height: 30px;
          width: 100%;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
          margin-bottom: 40px;
        }

        .sidebar.active .top .logo {
          opacity: 1;
        }

        .sidebar .top .logo img {
          transform: scale(0.8);
          transform-origin: center;
        }

        .sidebar ul {
          padding-left: 0;
          list-style-type: none;
          position: relative;
          height: calc(100% - 50px);
          display: flex;
          flex-direction: column;
        }

        .sidebar ul li {
          height: 40px;
          width: 95%;
          margin: 0.8rem 0;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          line-height: 50px;
          transition: background-color 0.3s ease;
        }

        .sidebar ul li a {
          color: #2A3547;
          display: flex;
          align-items: center;
          text-decoration: none;
          border-radius: 0.8rem;
          width: 100%;
          transition: all 0.3s ease;
        }

        .sidebar ul li a:hover {
          background-color: #EEF3FF;
          color: #1D77E6;
        }

        .sidebar ul li a i {
          min-width: 50px;
          text-align: center;
          font-size: 1.2rem;
        }

        .sidebar ul li a .nav-item {
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s ease;
          white-space: nowrap;
        }

        .sidebar.active ul li a .nav-item {
          opacity: 1;
          visibility: visible;
        }

        .sidebar ul .more {
          position: absolute;
          bottom: 40px;
          width: 95%;
        }

        .more .dropdown {
          display: none;
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 95%;
          background-color: #fff;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          z-index: 200;
          padding: 10px;
        }

        .more .dropdown a {
          display: block;
          color: #2A3547;
          text-decoration: none;
          font-size: 1rem;
          transition: background-color 0.3s ease;
          margin-bottom: 15px;
        }

        .more .dropdown a:hover {
          background-color: #EEF3FF;
        }

        .more.active .dropdown {
          display: block;
        }
        
        /* Create */
        .create .dropdown {
          display: none;
          position: absolute;
          top: 20px;
          left: 0;
          width: 90%;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          z-index: 200;
          margin-left: 10px;
          padding: 10px;
        }
        
        .create .dropdown a {
          display: block;
          color: #2A3547;
          text-decoration: none;
          font-size: 1rem;
          transition: background-color 0.3s ease;
          margin-bottom: 15px;
        }
        
        .create .dropdown a:hover {
          background-color: #EEF3FF;
        }
        
        .create.active .dropdown {
          display: block;
        }
        
        .sidebar .nav-item-dropdown {
          opacity: 0;
          visibility: hidden;
          display: none;
          white-space: nowrap;
        }
        
        .sidebar.active .nav-item-dropdown {
          opacity: 1;
          visibility: visible;
          display: inline-block;
          margin-left: 10px;
        }
        
        .sidebar ul li a {
          display: flex;
          align-items: center;
          color: #2A3547;
          text-decoration: none;
          border-radius: 0.8rem;
          width: 100%;
        }
        
        .sidebar ul li a i {
          margin-right: 10px;
        }

        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 150;
        }

        .app-bar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 55px;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 200;
        }

        .app-bar #btn {
          font-size: 1.5rem;
          color: #2A3547;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .app-bar {
            display: flex;
          }
          
          .overlay {
            display: none;
          }

          .overlay.active {
            display: block;
          }

          .sidebar {
            left: -250px;
          }

          .sidebar.active {
            left: 0;
          }
        }

        @media (min-width: 769px) {
          .app-bar {
            display: none;
          }

          .overlay {
            display: none;
          }

          .content {
            transition: margin-left 0.5s ease;
          }

          .sidebar {
            position: relative;
          }

          .sidebar.active + .content {
            margin-left: 20px;
          }

          .sidebar ul li a.active {
            background-color: #EEF3FF;
            color: #1D77E6;
          }
        }
      </style>
      <div class="app-bar">
        <i class="fa fa-bars" id="btn-bar"></i>
      </div>
      
      <div class="sidebar">
        <div class="top">
          <div class="logo">
            <img src="./images/logo2.png" alt="Logo">
          </div>
          <i class="fa fa-bars" id="btn"></i>
        </div>
        <ul>
          <li>
            <a href="#/home" id="homeLink">
              <i class="fa-solid fa-house"></i>
              <span class="nav-item">Beranda</span>
            </a>
          </li>
          <li>
            <a href="#/explore" id="exploreLink">
              <i class="fa-solid fa-compass"></i>
              <span class="nav-item">Jelajahi</span>
            </a>
          </li>
          <li class="create">
            <a href="javascript:void(0)" id="createLink">
              <i class="fa-solid fa-square-plus"></i>
              <span class="nav-item">Tambah</span>
            </a>
            <div class="dropdown">
              <a href="#/create-post"><i class="fa-solid fa-file-image"></i><span class="nav-item-dropdown" id="postLink">Post</span></a>
              <a href="#/create-product"><i class="fa-solid fa-box"></i><span class="nav-item-dropdown" id="produkLink">Produk</span></a>
            </div>
          </li>
          <li>
            <a href="javascript:void(0)" id="searchIcon">
              <i class="fa-solid fa-magnifying-glass"></i>
              <span class="nav-item">Pencarian</span>
            </a>
          </li>
          <li>
            <a href="#/marketplace">
              <i class="fa-solid fa-shop"></i>
              <span class="nav-item">Marketplace</span>
            </a>
          </li>
          <li>
            <a href="#/profile" id="profileLink">
              <i class="fa-solid fa-user"></i>
              <span class="nav-item">Profil</span>
            </a>
          </li>
          <li class="more">
            <a href="javascript:void(0)" id="moreLink">
              <i class="fa-solid fa-ellipsis"></i>
              <span class="nav-item">Lainnya</span>
            </a>
            <div class="dropdown">
              <a href="#/transaction-history"><i class="fa-solid fa-clock-rotate-left"></i><span class="nav-item-dropdown">Riwayat Transaksi</span></a>
              <a href="#/logout"><i class="fa-solid fa-arrow-right-from-bracket"></i><span class="nav-item-dropdown">Keluar</span></a>
            </div>
          </li>
        </ul>
      </div>
      <div class="overlay"></div>
    `;

    this.initToggleButton();
    this.initDropdownToggle();
    this.initSearchModal();
    this.initCreatePostDropdown();
    this.initAppBarToggle();
    this.highlightActiveLink(); // Panggil fungsi untuk menyoroti item aktif
    this.listenForHashChange();
  }

  // TODO

  highlightActiveLink() {
    // Hapus semua kelas "active" dari item sebelumnya
    const links = this.querySelectorAll('.sidebar ul li a');
    links.forEach((link) => link.classList.remove('active'));

    // Periksa hash saat ini
    const currentHash = window.location.hash;

    // Temukan link dengan href yang sesuai dengan hash saat ini
    const activeLink = Array.from(links).find((link) => link.getAttribute('href') === currentHash);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  listenForHashChange() {
    window.addEventListener('hashchange', () => {
      this.highlightActiveLink();
    });
  }


  initAppBarToggle() {
    const btn = this.querySelector('#btn-bar');
    const sidebar = this.querySelector('.sidebar');
    const overlay = this.querySelector('.overlay');

    btn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.style.display = 'none';
    });
  }

  initToggleButton() {
    const btn = this.querySelector('#btn');
    const sidebar = this.querySelector('.sidebar');
    const overlay = this.querySelector('.overlay');

    btn.addEventListener('click', () => {
      sidebar.classList.toggle('active');

      // Periksa ukuran layar untuk menampilkan overlay
      if (window.innerWidth < 769) {
        overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
      }
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.style.display = 'none';
    });
  }

  initDropdownToggle() {
    const moreButton = this.querySelector('.more');
    if (moreButton) {
      moreButton.addEventListener('click', () => {
        const isOpen = moreButton.classList.contains('active');
        const sidebar = this.querySelector('.sidebar');

        if (sidebar.classList.contains('active')) {
          moreButton.classList.toggle('active', !isOpen);
        } else {
          moreButton.classList.add('active');
        }

        if (isOpen) {
          moreButton.classList.remove('active');
        }
      });

      const logoutButton = this.querySelector('.more .dropdown a[href="#/logout"]');
      if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
          event.preventDefault();
          Swal.fire({
            title: 'Apakah Anda yakin ingin keluar?',
            text: 'Anda akan keluar dari akun Anda.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, keluar',
            cancelButtonText: 'Batal',
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              Swal.fire({
                icon: 'success',
                title: 'Berhasil Keluar!',
                text: 'Anda telah keluar dari akun Anda.',
              }).then(() => {
                window.location.href = '#/login';
              });
            }
          });
        });
      }
    }
  }

  initSearchModal() {
    const searchIcon = this.querySelector('#searchIcon');

    if (searchIcon) {
      searchIcon.addEventListener('click', () => {
        const existingModal = document.querySelector('search-modal');
        if (existingModal) {
          existingModal.remove();
        }

        const searchModal = document.createElement('search-modal');
        document.body.appendChild(searchModal);
      });
    }
  }

  initCreatePostDropdown() {
    const createButton = this.querySelector('.create');
    if (createButton) {
      createButton.addEventListener('click', () => {
        const isOpen = createButton.classList.contains('active');
        const sidebar = this.querySelector('.sidebar');

        if (sidebar.classList.contains('active')) {
          createButton.classList.toggle('active', !isOpen);
        } else {
          createButton.classList.add('active');
        }

        if (isOpen) {
          createButton.classList.remove('active');
        }
      });
    }
  }
}

customElements.define('side-bar', SideBar);
