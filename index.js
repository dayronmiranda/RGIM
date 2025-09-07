import './utils/router.js';

// Prevenir zoom en iOS y otros dispositivos móviles
(function() {
	// Prevenir doble tap zoom
	let lastTouchEnd = 0;
	document.addEventListener('touchend', function(event) {
		const now = Date.now();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, { passive: false });

	// Prevenir pinch zoom
	document.addEventListener('touchstart', function(event) {
		if (event.touches.length > 1) {
			event.preventDefault();
		}
	}, { passive: false });

	// Prevenir zoom con gestos
	document.addEventListener('gesturestart', function(event) {
		event.preventDefault();
	}, { passive: false });

	document.addEventListener('gesturechange', function(event) {
		event.preventDefault();
	}, { passive: false });

	document.addEventListener('gestureend', function(event) {
		event.preventDefault();
	}, { passive: false });

	// Prevenir zoom con teclas (Ctrl/Cmd + +/-)
	document.addEventListener('keydown', function(event) {
		if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '0')) {
			event.preventDefault();
		}
	}, { passive: false });

	// Prevenir zoom con rueda del mouse
	document.addEventListener('wheel', function(event) {
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
		}
	}, { passive: false });
})();

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

// Menú móvil mejorado con animaciones estilo Apple
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

if (mobileNavToggle && mobileNavOverlay && mobileNavClose) {
	mobileNavToggle.addEventListener('click', () => {
		mobileNavOverlay.classList.remove('hidden');
		// Pequeño delay para que la animación funcione correctamente
		setTimeout(() => {
			mobileNavOverlay.classList.add('active');
			document.body.classList.add('menu-open');
			// Prevenir scroll del body
			document.body.style.overflow = 'hidden';
			document.body.style.position = 'fixed';
			document.body.style.width = '100%';
		}, 10);
	});
	
	mobileNavClose.addEventListener('click', () => {
		mobileNavOverlay.classList.remove('active');
		document.body.classList.remove('menu-open');
		// Restaurar scroll del body
		document.body.style.overflow = '';
		document.body.style.position = '';
		document.body.style.width = '';
		setTimeout(() => {
			mobileNavOverlay.classList.add('hidden');
		}, 300);
	});
	
	// Cerrar al hacer click en un enlace
	mobileNavOverlay.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			mobileNavOverlay.classList.remove('active');
			document.body.classList.remove('menu-open');
			// Restaurar scroll del body
			document.body.style.overflow = '';
			document.body.style.position = '';
			document.body.style.width = '';
			setTimeout(() => {
				mobileNavOverlay.classList.add('hidden');
			}, 300);
		});
	});
}
