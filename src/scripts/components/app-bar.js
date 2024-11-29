class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
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

    // Menambahkan event listener untuk tombol hamburger
    const hamburgerButton = this.querySelector('#hamburgerButton');
    if (hamburgerButton) {
      hamburgerButton.addEventListener('click', () => {
        console.log('Hamburger button clicked from Web Component!');
      });
    } else {
      console.error('Hamburger button not found in Web Component.');
    }

    // Menambahkan event listener untuk tombol logout
    const logoutButton = this.querySelector('#logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Logout button clicked!');
        // Tambahkan logika logout di sini
      });
    } else {
      console.error('Logout button not found in Web Component.');
    }
  }
}

customElements.define('app-bar', AppBar);
