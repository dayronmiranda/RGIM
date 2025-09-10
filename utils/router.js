// router.js - Simplified for clean home page display
import { renderHome } from '../pages/home.js';
import { renderStore } from '../pages/store.js';

const routes = {
  '': renderHome,
  '#home': renderHome,
  '#/home': renderHome,
  '#store': renderStore,
  '#/store': renderStore,
  '#about': renderHome,
  '#/about': renderHome,
  '#faq': renderHome,
  '#/faq': renderHome,
  '#admin': renderHome,
  '#/admin': renderHome
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
