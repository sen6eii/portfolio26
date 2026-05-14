(function () {
  const style = document.createElement('style');
  style.textContent = `
    .lb-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out;
      opacity: 0; transition: opacity 0.22s ease;
      padding: 24px;
      pointer-events: none;
    }
    .lb-overlay.lb-open { opacity: 1; pointer-events: auto; }
    .lb-img {
      max-width: 90vw; max-height: 88vh;
      object-fit: contain;
      border-radius: 8px;
      cursor: default;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
      user-select: none;
      display: block;
    }
    .lb-close {
      position: absolute; top: 20px; right: 24px;
      width: 36px; height: 36px;
      border: 1px solid rgba(255,255,255,0.2); border-radius: 50%;
      background: transparent; color: #fff;
      font-size: 1rem; line-height: 1;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.18s, border-color 0.18s;
    }
    .lb-close:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.4); }
    .block-image img, .block-grid img { cursor: zoom-in; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';

  const img = document.createElement('img');
  img.className = 'lb-img';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lb-close';
  closeBtn.setAttribute('aria-label', 'Cerrar');
  closeBtn.innerHTML = '&#x2715;';

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    requestAnimationFrame(() => overlay.classList.add('lb-open'));
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('lb-open');
    document.body.style.overflow = '';
    setTimeout(() => { img.src = ''; }, 230);
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('lb-open')) close(); });

  document.querySelectorAll('.block-image img, .block-grid img').forEach(el => {
    el.addEventListener('click', () => open(el.src, el.alt));
  });
})();
