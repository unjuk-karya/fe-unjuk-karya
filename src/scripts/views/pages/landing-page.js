const LandingPage = {
  async render() {
    return `
      <header class="header">
        <landing-page-header></landing-page-header>
      </header>
      <main>
        <landing-page-main></landing-page-main>
      </main>
      <footer>
        <landing-page-footer></landing-page-footer>
      </footer>
    `;
  },

  async afterRender() {
    const header = document.querySelector('.header');
    const main = document.querySelector('landing-page-main');
    const containerWelcome = main.shadowRoot.querySelector('.container-welcome');
    const containerHome = main.shadowRoot.querySelector('.container-home');
    const containerAbout = main.shadowRoot.querySelector('.container-about');
    const home = document.querySelector('landing-page-header').shadowRoot.querySelector('button:nth-child(1)');
    const about = document.querySelector('landing-page-header').shadowRoot.querySelector('button:nth-child(2)');
    const contact = document.querySelector('landing-page-header').shadowRoot.querySelector('button:nth-child(3)');
    const begin = document.querySelector('landing-page-header').shadowRoot.querySelector('.begin');
    const join = main.shadowRoot.querySelector('.join');

    main.style.background = 'white';

    home.addEventListener('click', () => {
      containerWelcome.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    about.addEventListener('click', () => {
      containerHome.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    contact.addEventListener('click', () => {
      containerAbout.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    const token = localStorage.getItem('token');

    begin.addEventListener('click', () => {
      if (!token) {
        window.location.href = '#/login';
      } else {
        window.location.href = '#/home';
      }
    });

    join.addEventListener('click', () => {
      if (!token) {
        window.location.href = '#/login';
      } else {
        window.location.href = '#/home';
      }
    });

    header.style.position = 'absolute';
    header.style.top = '0';
    header.style.left = '0';
    header.style.width = '100%';
    header.style.zIndex = '999';
    header.style.backgroundColor = '#eef3ff';

    window.addEventListener('scroll', () => {
      const scrollThreshold = 0;
      if (window.scrollY > scrollThreshold) {
        header.style.position = 'fixed';
      } else {
        header.style.position = 'absolute';
      }
    });

  }
};

export default LandingPage;
