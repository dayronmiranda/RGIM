/*
  Modal functionality module
  Extracted from app.js lines 297-332
*/

export function openModal(html, els) {
  // Close any existing modals first
  closeAllModals(els)
  
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'
  overlay.innerHTML = `<div class="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">${html}</div>`
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay) })
  
  // Store reference to cleanup function
  const onEsc = (e) => { 
    if (e.key === 'Escape') { 
      closeModal(overlay)
    } 
  }
  overlay._escHandler = onEsc
  document.addEventListener('keydown', onEsc)
  
  els.modalRoot.appendChild(overlay)
  return overlay
}

export function closeModal(overlay) {
  if (overlay && overlay.parentNode) {
    // Remove event listener
    if (overlay._escHandler) {
      document.removeEventListener('keydown', overlay._escHandler)
    }
    overlay.remove()
  }
}

export function closeAllModals(els) {
  const modals = els.modalRoot.querySelectorAll('.fixed.inset-0')
  modals.forEach(modal => closeModal(modal))
}