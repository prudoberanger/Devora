'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function IdePage() {
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const lineHLRef = useRef(null);
  const editorInnerRef = useRef(null);
  const filenameRef = useRef(null);
  const langDotRef = useRef(null);
  const stLangRef = useRef(null);
  const stPosRef = useRef(null);
  const stCharsRef = useRef(null);
  const stMsgRef = useRef(null);
  const modalOverlayRef = useRef(null);
  const modalOutputRef = useRef(null);
  const modalTitleRef = useRef(null);
  const previewFrameRef = useRef(null);
  const toastRef = useRef(null);

  const [defaultCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
</head>
<body>
  
</body>
</html>`);

  const LANG_MAP = {
    html:   { name: 'HTML',        piston: null,         color: '#e34c26' },
    css:    { name: 'CSS',         piston: null,         color: '#1572b6' },
    js:     { name: 'JavaScript',  piston: 'javascript', color: '#f7df1e' },
    py:     { name: 'Python',      piston: 'python',     color: '#3776ab' },
    java:   { name: 'Java',        piston: 'java',       color: '#ed8b00' },
    c:      { name: 'C',           piston: 'c',          color: '#00599c' },
    cpp:    { name: 'C++',         piston: 'cpp',        color: '#00599c' },
    sh:     { name: 'Shell',       piston: 'bash',       color: '#4eaa25' },
  };

  const detectLang = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return LANG_MAP[ext] || { name: ext.toUpperCase() || 'TXT', piston: null, color: '#7a7a7a' };
  };

  let currentLang = { name: 'HTML', piston: null, color: '#e34c26' };

  const updateLang = () => {
    if (filenameRef.current) {
      currentLang = detectLang(filenameRef.current.value.trim());
      if (stLangRef.current) stLangRef.current.textContent = currentLang.name;
      if (langDotRef.current) langDotRef.current.style.background = currentLang.color;
    }
  };

  const updateUI = () => {
    if (!editorRef.current) return;
    const val = editorRef.current.value;
    const lines = val.split('\n');
    const pos = editorRef.current.selectionStart;
    const before = val.substring(0, pos);
    const curLn = before.split('\n').length;
    const curCol = before.split('\n').pop().length + 1;

    let html = '';
    for (let i = 1; i <= lines.length; i++) {
      html += `<span class="ln${i === curLn ? ' active' : ''}">${i}</span>`;
    }
    if (lineNumbersRef.current) lineNumbersRef.current.innerHTML = html;
    if (lineNumbersRef.current && editorInnerRef.current) {
      lineNumbersRef.current.scrollTop = editorInnerRef.current.scrollTop;
    }

    const lh = 21;
    if (lineHLRef.current) lineHLRef.current.style.top = (8 + (curLn - 1) * lh) + 'px';

    if (stPosRef.current) stPosRef.current.textContent = `Ln ${curLn}, Col ${curCol}`;
    if (stCharsRef.current) stCharsRef.current.textContent = `${val.length} car.`;
  };

  const insertAt = (text) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertText', false, text);
    updateUI();
  };

  const saveFile = () => {
    const name = filenameRef.current?.value.trim() || 'file.txt';
    const blob = new Blob([editorRef.current?.value || ''], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    toast(`Enregistré : ${name}`, 'ok');
    flash(`Téléchargement — ${name}`);
  };

  const runCode = async () => {
    const code = editorRef.current?.value.trim();
    if (!code) { toast('Code vide', 'err'); return; }

    const ext = filenameRef.current?.value.split('.').pop().toLowerCase();
    const isWeb = ['html', 'css'].includes(ext);

    if (isWeb) {
      openModal('Aperçu', true);
      if (previewFrameRef.current) {
        previewFrameRef.current.srcdoc = ext === 'css'
          ? `<style>${code}</style><body style="padding:20px;font-family:monospace;color:#888;background:#1e1e1e">CSS preview — ajoutez du HTML pour voir le rendu.</body>`
          : code;
      }
      return;
    }

    const pistonLang = currentLang.piston;
    if (!pistonLang) {
      openModal(currentLang.name, false);
      if (modalOutputRef.current) modalOutputRef.current.textContent = `Exécution de ${currentLang.name} non disponible.`;
      return;
    }

    openModal(`Exécution — ${currentLang.name}`, false);
    if (modalOutputRef.current) modalOutputRef.current.textContent = 'Chargement…';

    try {
      const runtimes = await (await fetch('https://emkc.org/api/v2/piston/runtimes')).json();
      const rt = runtimes.find(r => r.language === pistonLang || r.aliases?.includes(pistonLang));
      if (!rt) { if (modalOutputRef.current) modalOutputRef.current.textContent = `Runtime « ${pistonLang} » non disponible.`; return; }

      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: rt.language,
          version: rt.version,
          files: [{ name: filenameRef.current?.value.trim() || `main.${ext}`, content: code }]
        })
      });
      const data = await res.json();
      const run = data.run || {};
      const stdout = (run.stdout || '').trim();
      const stderr = (run.stderr || '').trim();
      if (modalOutputRef.current) {
        modalOutputRef.current.textContent = (stdout || '(aucune sortie)') +
          (stderr ? `\n\n─── stderr ───\n${stderr}` : '') +
          `\n\n──────────────\nExit ${run.code ?? '?'} · ${data.language} ${data.version}`;
      }
    } catch (err) {
      if (modalOutputRef.current) modalOutputRef.current.textContent = `Erreur réseau :\n${err.message}`;
    }
  };

  const openModal = (title, isPreview) => {
    if (modalTitleRef.current) modalTitleRef.current.textContent = title;
    if (modalOverlayRef.current) modalOverlayRef.current.classList.add('open');
    if (modalOutputRef.current) modalOutputRef.current.style.display = isPreview ? 'none' : 'block';
    if (previewFrameRef.current) previewFrameRef.current.style.display = isPreview ? 'block' : 'none';
    if (!isPreview && previewFrameRef.current) previewFrameRef.current.srcdoc = '';
  };

  const closeModal = () => {
    if (modalOverlayRef.current) modalOverlayRef.current.classList.remove('open');
    if (previewFrameRef.current) previewFrameRef.current.srcdoc = '';
  };

  let toastTimer;
  const toast = (msg, type = '') => {
    clearTimeout(toastTimer);
    if (toastRef.current) {
      toastRef.current.textContent = msg;
      toastRef.current.className = `show${type ? ' toast-' + type : ''}`;
      toastTimer = setTimeout(() => { if (toastRef.current) toastRef.current.className = ''; }, 2400);
    }
  };

  let flashTimer;
  const flash = (msg) => {
    clearTimeout(flashTimer);
    if (stMsgRef.current) {
      stMsgRef.current.textContent = msg;
      stMsgRef.current.classList.add('show');
      flashTimer = setTimeout(() => { if (stMsgRef.current) stMsgRef.current.classList.remove('show'); }, 2600);
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.value = defaultCode;
    updateLang();
    updateUI();
    editorRef.current.focus();

    const handleInput = () => updateUI();
    const handleClick = () => updateUI();
    const handleKeyup = () => updateUI();
    const handleSelect = () => updateUI();
    const handleScroll = () => {
      if (lineNumbersRef.current && editorInnerRef.current) {
        lineNumbersRef.current.scrollTop = editorInnerRef.current.scrollTop;
      }
    };

    editorRef.current.addEventListener('input', handleInput);
    editorRef.current.addEventListener('click', handleClick);
    editorRef.current.addEventListener('keyup', handleKeyup);
    editorRef.current.addEventListener('select', handleSelect);
    if (editorInnerRef.current) editorInnerRef.current.addEventListener('scroll', handleScroll);

    const handleKeydown = (e) => {
      const s = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const val = editorRef.current.value;

      if (e.key === 'Tab') {
        e.preventDefault();
        if (s === end) {
          insertAt('    ');
        } else {
          const allLines = val.split('\n');
          const startLine = val.substring(0, s).split('\n').length - 1;
          const endLine = val.substring(0, end).split('\n').length - 1;
          const shifted = allLines.map((ln, i) => {
            if (i < startLine || i > endLine) return ln;
            return e.shiftKey ? (ln.startsWith('    ') ? ln.slice(4) : ln) : '    ' + ln;
          });
          const delta = e.shiftKey ? -4 : 4;
          editorRef.current.value = shifted.join('\n');
          editorRef.current.selectionStart = Math.max(0, s + delta);
          editorRef.current.selectionEnd = Math.max(0, end + delta * (endLine - startLine + 1));
          updateUI();
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const lineStart = val.lastIndexOf('\n', s - 1) + 1;
        const indent = val.substring(lineStart, s).match(/^(\s*)/)[1];
        const before = val[s - 1];
        const after = val[s];
        const extra = (before === '{' || before === '(' || before === '[') ? '    ' : '';
        if (extra && (before === '{' ? '}' : before === '(' ? ')' : ']') === after) {
          insertAt('\n' + indent + extra + '\n' + indent);
          editorRef.current.selectionStart = editorRef.current.selectionEnd = s + indent.length + extra.length + 1;
        } else {
          insertAt('\n' + indent + extra);
        }
        updateUI();
        return;
      }

      const pairs = { '(': ')', '[': ']', '{': '}' };
      if (pairs[e.key]) {
        e.preventDefault();
        if (s !== end) {
          const sel = val.substring(s, end);
          insertAt(e.key + sel + pairs[e.key]);
          editorRef.current.selectionStart = s + 1;
          editorRef.current.selectionEnd = end + 1;
        } else {
          insertAt(e.key + pairs[e.key]);
          editorRef.current.selectionStart = editorRef.current.selectionEnd = s + 1;
        }
        updateUI();
        return;
      }

      if (Object.values(pairs).includes(e.key) && val[s] === e.key) {
        e.preventDefault();
        editorRef.current.selectionStart = editorRef.current.selectionEnd = s + 1;
        return;
      }

      if (e.key === 'Backspace' && s === end && s > 0) {
        const b = val[s - 1];
        const a = val[s];
        if (pairs[b] === a) {
          e.preventDefault();
          editorRef.current.value = val.substring(0, s - 1) + val.substring(s + 1);
          editorRef.current.selectionStart = editorRef.current.selectionEnd = s - 1;
          updateUI();
          return;
        }
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); document.execCommand('undo'); updateUI(); }
        if (e.key === 'y' || (e.shiftKey && e.key === 'z')) { e.preventDefault(); document.execCommand('redo'); updateUI(); }
        if (e.key === 's') { e.preventDefault(); saveFile(); }
      }
    };

    editorRef.current.addEventListener('keydown', handleKeydown);
    if (filenameRef.current) filenameRef.current.addEventListener('input', updateLang);

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('input', handleInput);
        editorRef.current.removeEventListener('click', handleClick);
        editorRef.current.removeEventListener('keyup', handleKeyup);
        editorRef.current.removeEventListener('select', handleSelect);
        editorRef.current.removeEventListener('keydown', handleKeydown);
      }
      if (editorInnerRef.current) editorInnerRef.current.removeEventListener('scroll', handleScroll);
      if (filenameRef.current) filenameRef.current.removeEventListener('input', updateLang);
    };
  }, [defaultCode]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e', overflow: 'hidden' }}>
      {/* Barre d’outils simplifiée */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '44px', background: '#181818', borderBottom: '1px solid #383838', display: 'flex', alignItems: 'center', padding: '0 6px', gap: '4px', zIndex: 100 }}>
        <Link href="/dashboard" style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#7a7a7a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</Link>
        <div style={{ width: '1px', height: '20px', background: '#383838' }}></div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div ref={langDotRef} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#e34c26' }}></div>
          <input ref={filenameRef} type="text" defaultValue="index.html" style={{ background: 'none', border: 'none', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', outline: 'none', width: '100%' }} />
        </div>
        <button onClick={saveFile} style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#7a7a7a', cursor: 'pointer' }}>💾</button>
        <button onClick={runCode} style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#f5a623', cursor: 'pointer' }}>▶</button>
      </div>
      {/* Éditeur */}
      <div style={{ position: 'fixed', top: '44px', left: 0, right: 0, bottom: '24px', display: 'flex' }}>
        <div ref={lineNumbersRef} style={{ width: '46px', background: '#1e1e1e', borderRight: '1px solid #383838', overflow: 'hidden', paddingTop: '8px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '21px', color: '#4a4a4a', textAlign: 'right', paddingRight: '9px' }}></div>
        <div ref={editorInnerRef} style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
          <div ref={lineHLRef} style={{ position: 'absolute', left: 0, right: 0, height: '21px', background: '#ffffff06', borderLeft: '2px solid #f5a623', pointerEvents: 'none' }}></div>
          <textarea ref={editorRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', lineHeight: '21px', padding: '8px 16px 8px 12px', caretColor: '#f5a623', whiteSpace: 'pre' }}></textarea>
        </div>
      </div>
      {/* Barre de statut */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '24px', background: '#f5a623', display: 'flex', alignItems: 'center', padding: '0 10px', zIndex: 100 }}>
        <div ref={stLangRef} style={{ color: '#1a1a1a', fontSize: '11px', fontWeight: '600', paddingRight: '8px', borderRight: '1px solid #00000025' }}>HTML</div>
        <div ref={stPosRef} style={{ color: '#1a1a1a', fontSize: '11px', fontWeight: '600', paddingLeft: '8px' }}>Ln 1, Col 1</div>
        <div ref={stCharsRef} style={{ color: '#1a1a1a', fontSize: '11px', fontWeight: '600', paddingLeft: '8px' }}>0 car.</div>
        <div ref={stMsgRef} style={{ flex: 1, textAlign: 'right', color: '#1a1a1a', fontSize: '11px', fontWeight: '600', opacity: 0, transition: 'opacity 0.2s' }}></div>
      </div>
      {/* Modal */}
      <div ref={modalOverlayRef} style={{ display: 'none', position: 'fixed', inset: 0, background: '#000000bb', zIndex: 200, alignItems: 'center', justifyContent: 'center' }} onClick={closeModal}>
        <div style={{ background: '#252526', border: '1px solid #383838', borderRadius: '8px', width: '80%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
            <span ref={modalTitleRef}>Output</span>
            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ overflow: 'auto', padding: '10px' }}>
            <pre ref={modalOutputRef} style={{ fontFamily: 'monospace', color: '#d4d4d4' }}></pre>
            <iframe ref={previewFrameRef} style={{ display: 'none', width: '100%', height: '400px' }} title="preview"></iframe>
          </div>
        </div>
      </div>
      <div ref={toastRef} style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#252526', border: '1px solid #383838', borderRadius: '6px', padding: '7px 14px', fontSize: '12px', color: '#d4d4d4', opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none' }}></div>
    </div>
  );
}
