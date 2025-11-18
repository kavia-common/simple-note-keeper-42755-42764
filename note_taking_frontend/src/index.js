import App from './App';

// Boot LightningJS Application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    stage: {
      clearColor: 0xfff9fafb,
      useImageWorker: false,
      w: window.innerWidth,
      h: window.innerHeight,
    },
  });

  const container = document.getElementById('app');
  if (container) {
    container.appendChild(app.stage.getCanvas());
  }

  // Handle resize to keep responsive layout
  const onResize = () => {
    app.stage.w = window.innerWidth;
    app.stage.h = window.innerHeight;
    app.emit('resize');
  };
  window.addEventListener('resize', onResize);
});
