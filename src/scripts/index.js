import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/responsive.css';
import App from './views/app';

// Fungsi untuk mengimpor semua file di dalam folder components
function importAll(r) {
  r.keys().forEach(r);
}

// Mengimpor semua file di dalam folder components
importAll(require.context('./views/components', true, /\.js$/));

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