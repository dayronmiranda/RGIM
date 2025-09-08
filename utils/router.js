// router.js
import { renderHome } from '../pages/home.js';
import { renderStore } from '../pages/store.js';
import { renderAdmin } from '../pages/admin.js';

const routes = {
  '': renderHome,
  '#home': renderHome,
  '#/home': renderHome,
  '#store': renderStore,
  '#/store': renderStore,
  '#about': renderHome, // Redirect to home since content is integrated
  '#/about': renderHome,
  '#faq': renderHome, // Redirect to home since content is integrated
  '#/faq': renderHome,
  '#admin': renderAdmin,
  '#/admin': renderAdmin
};

export function router() {
  const hash = window.location.hash;
  const render = routes[hash] || renderHome;
  const app = document.getElementById('app');
  if (app) {
    render(app);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
