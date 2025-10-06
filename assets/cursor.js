(function () {
    // Mapa elemento -> instancia para poder destruir
    const instances = new WeakMap();
  
    function attach(el) {
      if (!el || instances.has(el) || !window.cursoreffects) return;
  
      let fx = null;
  
      const start = () => {
        if (fx) return;
        const kind = el.getAttribute('data-cursor-effect') || 'fairy';
        switch (kind) {
          case 'fairy':
            fx = new cursoreffects.fairyDustCursor({
              element: el,
              colors: ['#ff00ff', '#00ffff', '#ffffff'],
              fairySymbol: '★'
            });
            break;
          case 'trailing':
            fx = new cursoreffects.trailingCursor({ element: el, particles: 15, rate: 0.6 });
            break;
          case 'emoji':
            fx = new cursoreffects.emojiCursor({ element: el, emoji: ['🔥','🐬','🦆'], delay: 20 });
            break;
          case 'bubbles':
            fx = new cursoreffects.bubbleCursor({ element: el, fillColor: '#f771b4', strokeColor: '#e6f1f7' });
            break;
          default:
            fx = new cursoreffects.fairyDustCursor({ element: el });
        }
      };
  
      const stop = () => {
        if (fx) { fx.destroy(); fx = null; }
      };
  
      el.addEventListener('mouseenter', start);
      el.addEventListener('mouseleave', stop);
      el.addEventListener('touchstart', start, { passive: true });
      el.addEventListener('touchend', stop);
      el.addEventListener('touchcancel', stop);
  
      instances.set(el, { stop });
    }
  
    function detachWithin(root) {
      // Por si recargan una sección
      const els = (root || document).querySelectorAll('[data-cursor-effect]');
      els.forEach((el) => {
        const ref = instances.get(el);
        if (ref && ref.stop) { ref.stop(); instances.delete(el); }
      });
    }
  
    function initWithin(root) {
      const els = (root || document).querySelectorAll('[data-cursor-effect]');
      els.forEach(attach);
    }
  
    function ready() {
      if (!window.cursoreffects) return; // aún no cargó la librería
      initWithin(document);
    }
  
    // DOM listo
    document.addEventListener('DOMContentLoaded', ready);
  
    // Editor de Shopify / secciones dinámicas
    document.addEventListener('shopify:section:load', (e) => {
      initWithin(e.target);
    });
    document.addEventListener('shopify:section:unload', (e) => {
      detachWithin(e.target);
    });
  
    // Compatibilidad con temas con navegación turbo/pjax
    document.addEventListener('page:load', ready);
    document.addEventListener('turbo:load', ready);
  })();
  