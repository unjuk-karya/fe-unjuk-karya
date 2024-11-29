import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import { createAppShell, initLogout } from '../views/templates/template-creator';
import checkAuth from '../utils/middleware';

class App {
  constructor({ content, appBarContainer }) {
    this._content = content;
    this._appBarContainer = appBarContainer;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();

   

    if (url === '/login' || url === '/register') {
      this._appBarContainer.innerHTML = '';
    } else {
      this._appBarContainer.innerHTML = createAppShell();
      DrawerInitiator.init({
        button: document.querySelector('#hamburgerButton'),
        drawer: document.querySelector('#navigationDrawer'),
        content: this._content,
      });
      initLogout();
    }

    const page = routes[url];
    this._content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;