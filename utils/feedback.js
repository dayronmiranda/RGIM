// utils/feedback.js
// Sistema de feedback táctil y sonoro para la tienda

/**
 * Clase para manejar el feedback de audio y vibración
 */
class CartFeedback {
  constructor() {
    this.audioContext = null;
    this.initAudio();
  }

  /**
   * Inicializa el contexto de audio
   */
  initAudio() {
    try {
      // Crear contexto de audio (compatible con todos los navegadores)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API no soportada:', e);
    }
  }

  /**
   * Reproduce un sonido de confirmación al agregar al carrito
   * Usa Web Audio API para generar el sonido sin necesidad de archivos externos
   */
  playAddToCartSound() {
    if (!this.audioContext) return;

    try {
      // Resume el contexto si está suspendido (requerido en iOS)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const currentTime = this.audioContext.currentTime;
      
      // Crear oscilador para el tono principal
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Configurar el sonido (dos tonos agradables)
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Primer tono (más bajo)
      oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
      gainNode.gain.setValueAtTime(0.3, currentTime);
      
      // Segundo tono (más alto) - crear efecto de "ding"
      oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1); // E5
      
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);
      
      // Iniciar y detener el sonido
      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.3);
      
      // Crear un segundo oscilador para armonía
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode2 = this.audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(this.audioContext.destination);
      
      // Tono de armonía
      oscillator2.frequency.setValueAtTime(783.99, currentTime); // G5
      gainNode2.gain.setValueAtTime(0.15, currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2);
      
      oscillator2.start(currentTime + 0.05);
      oscillator2.stop(currentTime + 0.25);
      
    } catch (e) {
      console.warn('Error reproduciendo sonido:', e);
    }
  }

  /**
   * Reproduce un sonido de error/eliminación
   */
  playRemoveSound() {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const currentTime = this.audioContext.currentTime;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Tono descendente para indicar eliminación
      oscillator.frequency.setValueAtTime(400, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.2, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.2);
      
    } catch (e) {
      console.warn('Error reproduciendo sonido:', e);
    }
  }

  /**
   * Activa la vibración del dispositivo
   * Compatible con Android y iOS
   */
  vibrate(pattern = [50]) {
    try {
      // Para iOS, usar un truco con el audio para simular vibración
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // Crear un pulso de audio muy corto que genera vibración física
        if (this.audioContext) {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          // Frecuencia muy baja para generar vibración física
          oscillator.frequency.value = 30;
          gainNode.gain.value = 0;
          
          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + 0.001);
        }
      }
      
      // Vibración estándar para Android
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
      
    } catch (e) {
      console.warn('Vibración no disponible:', e);
    }
  }

  /**
   * Feedback completo al agregar al carrito (sonido + vibración)
   */
  addToCartFeedback() {
    this.playAddToCartSound();
    this.vibrate([30, 20, 30]); // Patrón de vibración: vibra-pausa-vibra
  }

  /**
   * Feedback al eliminar del carrito
   */
  removeFromCartFeedback() {
    this.playRemoveSound();
    this.vibrate([50]); // Vibración simple
  }

  /**
   * Feedback de éxito (para checkout, etc.)
   */
  successFeedback() {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const currentTime = this.audioContext.currentTime;
      
      // Crear una melodía de éxito (3 notas ascendentes)
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      notes.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        const startTime = currentTime + (index * 0.15);
        
        oscillator.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
      
      // Vibración de éxito
      this.vibrate([50, 30, 50, 30, 100]);
      
    } catch (e) {
      console.warn('Error reproduciendo sonido de éxito:', e);
    }
  }

  /**
   * Inicializa el audio en respuesta a una interacción del usuario
   * (Requerido para iOS/Safari)
   */
  initOnUserInteraction() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Crear instancia global del sistema de feedback
const cartFeedback = new CartFeedback();

// Asegurar que el audio se inicialice con la primera interacción del usuario
document.addEventListener('click', () => {
  cartFeedback.initOnUserInteraction();
}, { once: true });

document.addEventListener('touchstart', () => {
  cartFeedback.initOnUserInteraction();
}, { once: true });

// Exportar para uso en otros módulos
export { cartFeedback };

// También hacer disponible globalmente para compatibilidad
window.cartFeedback = cartFeedback;