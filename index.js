import './utils/router.js';

// Menú móvil
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

if (mobileNavToggle && mobileNavOverlay && mobileNavClose) {
	mobileNavToggle.addEventListener('click', () => {
		mobileNavOverlay.classList.remove('hidden');
		mobileNavOverlay.classList.add('flex');
	});
	mobileNavClose.addEventListener('click', () => {
		mobileNavOverlay.classList.add('hidden');
		mobileNavOverlay.classList.remove('flex');
	});
	// Cerrar al hacer click en un enlace
	mobileNavOverlay.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			mobileNavOverlay.classList.add('hidden');
			mobileNavOverlay.classList.remove('flex');
		});
	});
}
