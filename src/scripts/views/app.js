import routes from '../routes/routes';
import UrlParser from '../routes/url-parser';
import NotFound from '../views/pages/not-found';

class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    try {
      const url = UrlParser.parseActiveUrlWithCombiner();
      const token = localStorage.getItem('token');

      if (!token && url !== '/login' && url !== '/register') {
        window.location.href = '#/login';
        return;
      }

      if (token && (url === '/login' || url === '/register')) {
        window.location.href = '#/';
        return;
      }

      if (url === '/login' || url === '/register') {
        document.body.innerHTML = '<main id="mainContent"></main>';
        this._content = document.querySelector('#mainContent');
      } else if (!document.querySelector('app-layout')) {
        document.body.innerHTML = `
          <app-layout>
            <main id="mainContent"></main>
          </app-layout>
        `;
        this._content = document.querySelector('#mainContent');
      }

      const page = routes[url] || NotFound;

      if (this._content) {
        this._content.innerHTML = await page.render();
        await page.afterRender();
      }
    } catch (error) {
      console.error('Error in renderPage:', error);
      if (this._content) {
        this._content.innerHTML = await NotFound.render();
        await NotFound.afterRender();
      }
    }
  }
}

export default App;