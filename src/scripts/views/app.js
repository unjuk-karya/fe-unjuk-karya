import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import { initLogout } from '../views/templates/template-creator';
class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    if (url === '/login' || url === '/register') {
      const appBar = document.querySelector('app-bar');
      if (appBar) appBar.style.display = 'none';
    } else {
      const appBar = document.querySelector('app-bar');
      if (appBar) {
        appBar.style.display = 'block';
        DrawerInitiator.init({
          button: document.querySelector('#hamburgerButton'),
          drawer: document.querySelector('#navigationDrawer'),
          content: this._content,
        });

        initLogout();
      }
    }

    const page = routes[url];
    if (this._content) {
      this._content.innerHTML = await page.render();
      await page.afterRender();
    } else {
      console.error('Content container not found in DOM.');
    }
  }
}

export default App;
