// router.js
import { renderHome } from '../pages/home.js';
import { renderStore } from '../pages/store.js';
import { renderAbout } from '../pages/about.js';
import { renderFAQ } from '../pages/faq.js';
import { renderAdmin } from '../pages/admin.js';

const routes = {
  '': renderHome,
  '#home': renderHome,
  '#/home': renderHome,
  '#store': renderStore,
  '#/store': renderStore,
  '#about': renderAbout,
  '#/about': renderAbout,
  '#faq': renderFAQ,
  '#/faq': renderFAQ,
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
