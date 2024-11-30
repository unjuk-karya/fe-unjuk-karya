class SideBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <style>
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 80px;
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
          }
  
          .sidebar ul li {
            list-style-type: none;
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
            transition: opacity 0.5s ease;
            white-space: nowrap;
          }
  
          .sidebar.active ul li a .nav-item {
            opacity: 1;
          }
        </style>
        <div class="sidebar">
          <div class="top">
            <div class="logo">
              <img src="/images/logo.png" alt="Logo">
            </div>
            <i class="bx bx-menu" id="btn"></i>
          </div>
          <ul>
            <li>
              <a href="#/home">
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
                <i class="fa-solid fa-plus"></i>
                <span class="nav-item">Add Post</span>
              </a>
            </li>
            <li>
              <a href="#/marketplace">
                <i class="fa-solid fa-store"></i>
                <span class="nav-item">Marketplace</span>
              </a>
            </li>
            <li>
              <a href="#/profile">
                <i class="fa-solid fa-user"></i>
                <span class="nav-item">Profile</span>
              </a>
            </li>
          </ul>
        </div>
      `;

    const btn = this.querySelector('#btn');
    const layout = document.querySelector('.layout');

    if (btn) {
      btn.addEventListener('click', () => {
        const sidebar = this.querySelector('.sidebar');
        sidebar.classList.toggle('active');
        layout.classList.toggle('sidebar-active');

        const mainContent = document.querySelector('.main-content');
        if (layout.classList.contains('sidebar-active')) {
          mainContent.classList.add('app-bar-expanded');
          mainContent.classList.remove('app-bar-collapsed');
        } else {
          mainContent.classList.add('app-bar-collapsed');
          mainContent.classList.remove('app-bar-expanded');
        }
      });
    }
  }
}

customElements.define('side-bar', SideBar);
