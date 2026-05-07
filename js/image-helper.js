(function () {
  const blocks = document.querySelectorAll('.ph-block');
  if (!blocks.length) return;

  const style = document.createElement('style');
  style.textContent = `
    .ph-block { cursor: pointer !important; transition: border-color 0.2s, background 0.2s; }
    .ph-block:hover { border-color: var(--accent) !important; background: var(--accent-dim) !important; }
    .ph-block.ph-drag { border-color: var(--accent) !important; background: rgba(94,59,238,0.14) !important; }
    .ph-hint { font-family: 'DM Mono', monospace; font-size: 0.58rem; letter-spacing: 0.08em; color: var(--accent); opacity: 0.85; margin-top: 2px; }
    .ph-preview { position: relative; overflow: hidden; cursor: default !important; background: transparent !important; border-style: solid !important; }
    .ph-preview img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit; }
    .ph-snippet-bar {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(10,10,10,0.9); backdrop-filter: blur(10px);
      display: flex; align-items: center; gap: 8px; padding: 8px 12px;
      border-top: 1px solid rgba(255,255,255,0.07);
    }
    .ph-snippet-bar code {
      font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 0.02em;
      color: #a5b4fc; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .ph-snippet-bar button {
      font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 0.06em; text-transform: uppercase;
      background: var(--accent); color: #fff; border: none; border-radius: 4px;
      padding: 4px 10px; cursor: pointer; flex-shrink: 0; transition: background 0.15s;
    }
    .ph-snippet-bar button:hover { background: var(--accent-2); }
    .ph-change-btn {
      position: absolute; top: 10px; right: 10px;
      font-family: 'DM Mono', monospace; font-size: 0.55rem; letter-spacing: 0.06em; text-transform: uppercase;
      background: rgba(10,10,10,0.75); color: #fff; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 4px; padding: 4px 10px; cursor: pointer; backdrop-filter: blur(6px);
      transition: background 0.15s;
    }
    .ph-change-btn:hover { background: rgba(94,59,238,0.8); border-color: transparent; }
  `;
  document.head.appendChild(style);

  blocks.forEach(block => {
    const hint = document.createElement('span');
    hint.className = 'ph-hint';
    hint.textContent = 'Clic o arrastrá para agregar imagen';
    block.appendChild(hint);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    block.appendChild(input);

    block.addEventListener('click', e => {
      if (e.target.closest('.ph-snippet-bar') || e.target.closest('.ph-change-btn')) return;
      input.click();
    });

    block.addEventListener('dragover', e => {
      e.preventDefault();
      block.classList.add('ph-drag');
    });
    block.addEventListener('dragleave', e => {
      if (!block.contains(e.relatedTarget)) block.classList.remove('ph-drag');
    });
    block.addEventListener('drop', e => {
      e.preventDefault();
      block.classList.remove('ph-drag');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) replaceWithPreview(block, file, input);
    });

    input.addEventListener('change', () => {
      if (input.files[0]) replaceWithPreview(block, input.files[0], input);
    });
  });

  function replaceWithPreview(block, file, input) {
    const url = URL.createObjectURL(file);
    const tag = `<img src="img/${file.name}" alt="">`;

    block.innerHTML = '';
    block.classList.remove('ph-drag');
    block.classList.add('ph-preview');

    const img = document.createElement('img');
    img.src = url;
    block.appendChild(img);

    const changeBtn = document.createElement('button');
    changeBtn.className = 'ph-change-btn';
    changeBtn.textContent = 'Cambiar';
    changeBtn.addEventListener('click', e => { e.stopPropagation(); input.value = ''; input.click(); });
    block.appendChild(changeBtn);

    const bar = document.createElement('div');
    bar.className = 'ph-snippet-bar';

    const code = document.createElement('code');
    code.textContent = tag;

    const btn = document.createElement('button');
    btn.textContent = 'Copiar HTML';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      navigator.clipboard.writeText(tag).then(() => {
        btn.textContent = '✓ Copiado';
        setTimeout(() => btn.textContent = 'Copiar HTML', 1600);
      });
    });

    bar.appendChild(code);
    bar.appendChild(btn);
    block.appendChild(bar);
    block.appendChild(input);

    input.addEventListener('change', () => {
      if (input.files[0]) replaceWithPreview(block, input.files[0], input);
    });
  }
})();
