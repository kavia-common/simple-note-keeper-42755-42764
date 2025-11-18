import Blits from '@lightningjs/blits'
import App from './App'

// PUBLIC_INTERFACE
// Entry point: launches the Blits application and mounts it to #app
// Ensures proper stage configuration and responsive resizing.
document.addEventListener('DOMContentLoaded', () => {
  const app = Blits.launch(App, {
    target: '#app',
    stage: {
      // Using BG similar to Theme.background
      clearColor: 0xfff9fafb,
      useImageWorker: false,
      w: window.innerWidth,
      h: window.innerHeight,
    },
  })

  // Ensure canvas fills container and handles DPR properly
  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    // Resize Blits app/stage so template width/height functions get updated
    if (typeof app.resize === 'function') {
      app.resize(w, h)
    } else if (app.stage) {
      app.stage.w = w
      app.stage.h = h
      app.emit && app.emit('resize')
    }
    // Resize the canvas element to match CSS pixels
    const canvas = app.stage && app.stage.getCanvas ? app.stage.getCanvas() : document.querySelector('#app canvas')
    if (canvas) {
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }
  }

  window.addEventListener('resize', resize)
  resize()
})
