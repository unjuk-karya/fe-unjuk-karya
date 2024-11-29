import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/responsive.css';
import App from './views/app';
import './components/component.js';

const app = new App({
  content: document.querySelector('#mainContent'),
  appBarContainer: document.querySelector('#appBarContainer'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
});
