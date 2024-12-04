import Swal from 'sweetalert2';
import './search-modal.js';

class SideBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css');

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 55px;
          background-color: #fff;
          padding: 0.4rem 0.8rem;
          z-index: 100;
          transition: all 0.5s ease;
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
          width: 90%;
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
          width: 100%;
        }

        .more .dropdown {
          display: none;
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 100%;
          background-color: #fff;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          z-index: 200;
          margin-left: 10px;
          padding: 10px;
        }

        .more .dropdown a {
          padding: 0.3rem;
          display: block;
          color: #2A3547;
          text-decoration: none;
          font-size: 1rem;
          transition: background-color 0.3s ease;
          width: 90%;
        }

        .more .dropdown a:hover {
          background-color: #EEF3FF;
          width: 90%;
        }

        .more.active .dropdown {
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
      </style>

      <div class="sidebar">
        <div class="top">
          <div class="logo">
            <img src="/images/logo.png" alt="Logo">
          </div>
          <i class="fa fa-bars" id="btn"></i>
        </div>
        <ul>
          <li>
            <a href="#/">
              <i class="fa-solid fa-house"></i>
              <span class="nav-item">Home</span>
            </a>
          </li>
          <li>
            <a href="#/explore">
              <i class="fa-solid fa-compass"></i>
              <span class="nav-item">Explore</span>
            </a>
          </li>
          <li>
            <a href="#/add-post">
              <i class="fa-solid fa-square-plus"></i>
              <span class="nav-item">Add Post</span>
            </a>
          </li>
          <li>
            <a href="javascript:void(0)" id="searchIcon">
              <i class="fa-solid fa-magnifying-glass"></i>
              <span class="nav-item">Search</span>
            </a>
          </li>
          <li>
            <a href="#/marketplace">
              <i class="fa-solid fa-shop"></i>
              <span class="nav-item">Marketplace</span>
            </a>
          </li>
          <li>
            <a href="#/profile">
              <i class="fa-solid fa-user"></i>
              <span class="nav-item">Profile</span>
            </a>
          </li>
          <li class="more">
            <a href="javascript:void(0)">
              <i class="fa-solid fa-ellipsis"></i>
              <span class="nav-item">More</span>
            </a>
            <div class="dropdown">
              <a href="#/transaction-history"><i class="fa-solid fa-clock-rotate-left"></i><span class="nav-item-dropdown">Riwayat Transaksi</span></a>
              <a href="#/settings"><i class="fa-solid fa-gear"></i><span class="nav-item-dropdown">Settings</span></a>
              <a href="#/logout"><i class="fa-solid fa-arrow-right-from-bracket"></i><span class="nav-item-dropdown">Logout</span></a>
            </div>
          </li>
        </ul>
      </div>
    `;

    this.initToggleButton();
    this.initDropdownToggle();
    this.initSearchModal();
  }

  initToggleButton() {
    const btn = this.querySelector('#btn');
    const sidebar = this.querySelector('.sidebar');

    if (btn) {
      btn.addEventListener('click', () => {
        sidebar.classList.toggle('active');

        this.dispatchEvent(new CustomEvent('sidebarToggle', {
          bubbles: true,
          composed: true,
          detail: {
            isActive: sidebar.classList.contains('active')
          }
        }));
      });
    }
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
}

customElements.define('side-bar', SideBar);