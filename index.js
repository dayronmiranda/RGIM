import './utils/router.js';

// Page Loader
window.addEventListener('load', () => {
	setTimeout(() => {
		const loader = document.getElementById('page-loader');
		if (loader) {
			loader.classList.add('hidden');
		}
	}, 500);
});

// Show loader on route change
window.addEventListener('hashchange', () => {
	const loader = document.getElementById('page-loader');
	if (loader) {
		loader.classList.remove('hidden');
		setTimeout(() => {
			loader.classList.add('hidden');
		}, 300);
	}
});

// Menú móvil mejorado
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

if (mobileNavToggle && mobileNavOverlay && mobileNavClose) {
	mobileNavToggle.addEventListener('click', () => {
		mobileNavOverlay.classList.remove('hidden');
		mobileNavOverlay.classList.add('active');
		document.body.classList.add('menu-open');
	});
	
	mobileNavClose.addEventListener('click', () => {
		mobileNavOverlay.classList.remove('active');
		setTimeout(() => {
			mobileNavOverlay.classList.add('hidden');
		}, 300);
		document.body.classList.remove('menu-open');
	});
	
	// Cerrar al hacer click en un enlace
	mobileNavOverlay.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			mobileNavOverlay.classList.remove('active');
			setTimeout(() => {
				mobileNavOverlay.classList.add('hidden');
			}, 300);
			document.body.classList.remove('menu-open');
		});
	});
}
