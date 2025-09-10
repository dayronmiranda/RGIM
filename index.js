import './utils/router.js';
import { analyticsTracker } from './utils/analytics.js';

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

// Page Loader - Removed since we don't have loader elements anymore

// Mobile menu functionality removed - no longer needed for clean home page design

// Initialize Analytics Tracking
document.addEventListener('DOMContentLoaded', () => {
	analyticsTracker.init();
});
