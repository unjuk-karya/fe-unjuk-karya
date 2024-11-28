const createAppShell = () => `
<div class="app-bar">
  <div class="app-bar__menu">
    <button id="hamburgerButton">☰</button>
  </div>
  <div class="app-bar__brand">
    <h1>Unjuk Karya</h1>
  </div>
  <nav id="navigationDrawer" class="app-bar__navigation">
    <ul>
      <li><a href="#" id="logout">Logout</a></li>
    </ul>
  </nav>
</div>
`;

const initLogout = () => {
  document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '#/login';
  });
};

export { createAppShell, initLogout };