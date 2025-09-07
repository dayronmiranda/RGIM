/*
  Audio functionality module
  Extracted from app.js lines 152-228
*/

// Modern sound effect for adding to cart with vibration
export function playAddToCartSound() {
  try {
    // Enhanced vibration for iPhone and mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]); // Enhanced vibration pattern
    }
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Modern notification sound - ascending notes
    const frequencies = [440, 523.25, 659.25, 783.99] // A4, C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
      oscillator.type = 'sine'
      
      const startTime = audioContext.currentTime + (index * 0.08)
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })
  } catch(e) {
    console.log('Sound/vibration not available')
  }
}

// Modern success sound for order submission with vibration
export function playOrderSentSound() {
  try {
    // Success vibration pattern
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]); // Success vibration pattern
    }
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Success chord progression - more modern and pleasant
    const chords = [
      [523.25, 659.25, 783.99], // C major
      [587.33, 739.99, 880.00], // D major
      [659.25, 830.61, 987.77]  // E major
    ]
    
    chords.forEach((chord, chordIndex) => {
      chord.forEach((freq, noteIndex) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        oscillator.type = 'sine'
        
        const startTime = audioContext.currentTime + (chordIndex * 0.2) + (noteIndex * 0.02)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + 0.6)
      })
    })
  } catch(e) {
    console.log('Sound/vibration not available')
  }
}