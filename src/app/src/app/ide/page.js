'use client';'use client';

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

  // Langage mapping
  const LANG_MAP = {
    html:   { name: 'HTML',        piston: null,         color: '#e34c26' },
    css:    { name: 'CSS',         piston: null,         color: '#1572b6' },
    js:     { name: 'JavaScript',  piston: 'javascript', color: '#f7df1e' },
    jsx:    { name: 'React JSX',   piston: 'javascript', color: '#61dafb' },
    ts:     { name: 'TypeScript',  piston: 'typescript', color: '#3178c6' },
    tsx:    { name: 'React TSX',   piston: 'typescript', color: '#61dafb' },
    py:     { name: 'Python',      piston: 'python',     color: '#3776ab' },
    java:   { name: 'Java',        piston: 'java',       color: '#ed8b00' },
    c:      { name: 'C',           piston: 'c',          color: '#00599c' },
    cpp:    { name: 'C++',         piston: 'cpp',        color: '#00599c' },
    cs:     { name: 'C#',          piston: 'csharp',     color: '#239120' },
    go:     { name: 'Go',          piston: 'go',         color: '#00add8' },
    rs:     { name: 'Rust',        piston: 'rust',       color: '#ce412b' },
    rb:     { name: 'Ruby',        piston: 'ruby',       color: '#cc342d' },
    php:    { name: 'PHP',         piston: 'php',        color: '#777bb4' },
    sh:     { name: 'Shell',       piston: 'bash',       color: '#4eaa25' },
    json:   { name: 'JSON',        piston: null,         color: '#f5a623' },
    md:     { name: 'Markdown',    piston: null,         color: '#083fa1' },
    xml:    { name: 'XML',         piston: null,         color: '#f5a623' },
    sql:    { name: 'SQL',         piston: null,         color: '#e38c00' },
    swift:  { name: 'Swift',       piston: 'swift',      color: '#fa7343' },
    kt:     { name: 'Kotlin',      piston: 'kotlin',     color: '#7f52ff' },
  };

  const detectLang = (filename) => {
    const f = filename.toLowerCase();
    if ((f.includes('next') && (f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.tsx'))))
      return { name: 'Next.js', piston: 'javascript', color: '#ffffff' };
    const ext = f.split('.').pop();
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

    // line numbers
    let html = '';
    for (let i = 1; i <= lines.length; i++) {
      html += `<span class="ln${i === curLn ? ' active' : ''}">${i}</span>`;
    }
    if (lineNumbersRef.current) lineNumbersRef.current.innerHTML = html;
    if (lineNumbersRef.current && editorInnerRef.current) {
      lineNumbersRef.current.scrollTop = editorInnerRef.current.scrollTop;
    }

    // highlight
    const lh = 21; // --line-h
    if (lineHLRef.current) lineHLRef.current.style.top = (8 + (curLn - 1) * lh) + 'px';

    // status
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
      if (modalOutputRef.current) modalOutputRef.current.textContent = `Exécution de ${currentLang.name} non disponible en navigateur.\nUtilisez un terminal local.`;
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

    // Initialisation
    editorRef.current.value = defaultCode;
    updateLang();
    updateUI();
    editorRef.current.focus();

    // Gestionnaires d'événements
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

    // Keyboard shortcuts
    const handleKeydown = (e) => {
      const s = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const val = editorRef.current.value;

      // Tab
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
            return e.shiftKey ? (ln.startsWith('    ') ? ln.slice(4) : ln.startsWith('\t') ? ln.slice(1) : ln) : '    ' + ln;
          });
          const delta = e.shiftKey ? -4 : 4;
          editorRef.current.value = shifted.join('\n');
          editorRef.current.selectionStart = Math.max(0, s + delta);
          editorRef.current.selectionEnd = Math.max(0, end + delta * (endLine - startLine + 1));
          updateUI();
        }
        return;
      }

      // Enter with auto-indent
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

      // Auto-close brackets
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

      // Skip closing bracket
      if (Object.values(pairs).includes(e.key) && val[s] === e.key) {
        e.preventDefault();
        editorRef.current.selectionStart = editorRef.current.selectionEnd = s + 1;
        return;
      }

      // Backspace delete pair
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

      // Ctrl shortcuts
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
      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '44px', background: '#181818', borderBottom: '1px solid #383838', display: 'flex', alignItems: 'center', padding: '0 6px', gap: '4px', zIndex: 100 }}>
        <Link href="/dashboard" style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#7a7a7a', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <div style={{ width: '1px', height: '20px', background: '#383838', margin: '0 2px' }}></div>
        <div id="filename-wrap" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '7px', overflow: 'hidden', padding: '0 4px' }}>
          <div ref={langDotRef} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#e34c26', flexShrink: 0 }}></div>
          <input ref={filenameRef} id="filename" type="text" defaultValue="index.html" spellCheck="false" style={{ background: 'none', border: 'none', color: '#d4d4d4', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '500', outline: 'none', width: '100%', caretColor: '#f5a623' }} />
        </div>
        <div style={{ width: '1px', height: '20px', background: '#383838', margin: '0 2px' }}></div>
        <button id="btn-undo" style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#7a7a7a', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { editorRef.current?.focus(); document.execCommand('undo'); updateUI(); }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2.5 6H9C10.933 6 12.5 7.567 12.5 9.5C12.5 11.433 10.933 13 9 13H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M5 3.5L2.5 6L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button id="btn-redo" style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#7a7a7a', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { editorRef.current?.focus(); document.execCommand('redo'); updateUI(); }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M12.5 6H6C4.067 6 2.5 7.567 2.5 9.5C2.5 11.433 4.067 13 6 13H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 3.5L12.5 6L10 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button id="btn-fullscreen" style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#7a7a7a', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => document.documentElement.requestFullscreen()}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 5V2H5M10 2H13V5M13 10V13H10M5 13H2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ width: '1px', height: '20px', background: '#383838', margin: '0 2px' }}></div>
        <button id="btn-save" style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#7a7a7a', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={saveFile}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M8 2V10M8 10L5.5 7.5M8 10L10.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button id="btn-run" style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#f5a623', cursor: 'pointer', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={runCode}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5 3L12 7.5L5 12V3Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Editor area */}
      <div style={{ position: 'fixed', top: '44px', left: 0, right: 0, bottom: '64px', display: 'flex', overflow: 'hidden', background: '#1e1e1e' }}>
        <div ref={lineNumbersRef} id="line-numbers" style={{ width: '46px', background: '#1e1e1e', borderRight: '1px solid #383838', overflow: 'hidden', userSelect: 'none', flexShrink: 0, paddingTop: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', lineHeight: '21px', color: '#4a4a4a', textAlign: 'right', paddingRight: '9px' }}></div>
        <div ref={editorInnerRef} id="editor-inner" style={{ flex: 1, position: 'relative', overflow: 'auto', background: '#1e1e1e' }}>
          <div ref={lineHLRef} id="line-highlight" style={{ position: 'absolute', left: 0, right: 0, height: '21px', background: '#ffffff06', borderLeft: '2px solid #f5a623', pointerEvents: 'none', transition: 'top 0.04s' }}></div>
          <textarea ref={editorRef} id="code-editor" spellCheck="false" style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: '#d4d4d4', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '21px', padding: '8px 16px 8px 12px', tabSize: 4, caretColor: '#f5a623', whiteSpace: 'pre', overflowWrap: 'normal', overflowX: 'hidden', wordBreak: 'normal' }}></textarea>
        </
