'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function IAPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const chatZoneRef = useRef(null);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/connexion');
        return;
      }
      setUser(session.user);
      // Charger l'historique des conversations (optionnel)
      const { data: history } = await supabase
        .from('messages_ia')
        .select('contenu, created_at')
        .eq('user_id', session.user.id)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(20);
      if (history) {
        setConversations(history.map(h => ({ title: h.contenu.substring(0, 40), id: h.created_at })));
      }
    };
    init();
  }, [router]);

  const scrollToBottom = () => {
    if (chatZoneRef.current) chatZoneRef.current.scrollTop = chatZoneRef.current.scrollHeight;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && !selectedImage) return;
    if (loading) return;

    const userMessage = { role: 'user', content: text || '[Image]', image: selectedImage?.dataUrl };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Non authentifié');

      const body = {
        messages: messages.concat(userMessage).map(m => ({ role: m.role, content: m.content })),
      };
      if (selectedImage) {
        body.image = { base64: selectedImage.base64, mimeType: selectedImage.mimeType };
      }

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const assistantMessage = { role: 'assistant', content: data.response || 'Erreur' };
      setMessages(prev => [...prev, assistantMessage]);

      // Sauvegarder en base (optionnel)
      await supabase.from('messages_ia').insert([
        { user_id: user.id, role: 'user', contenu: text || '[Image]' },
        { user_id: user.id, role: 'assistant', contenu: data.response }
      ]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion à l’IA.' }]);
    } finally {
      setSelectedImage(null);
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage({
        base64: ev.target.result.split(',')[1],
        mimeType: file.type,
        dataUrl: ev.target.result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const newConversation = () => {
    setMessages([]);
    setSelectedImage(null);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: '260px', background: '#0A0A0A', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/dashboard" className="sb-logo" style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#fff', textDecoration: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="#FF5500"/><path d="M8 8h5.5a6.5 6.5 0 0 1 0 13H8V8z" fill="white"/><circle cx="18.5" cy="19.5" r="2.5" fill="white"/></svg>
            IA Devora
          </Link>
          <button onClick={newConversation} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 10px', background: 'none', color: 'rgba(255,255,255,0.75)', border: 'none', borderRadius: '8px', width: '100%', marginTop: '8px', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouvelle conversation
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.35)', padding: '8px 6px 4px' }}>Récents</div>
          {conversations.map((conv, idx) => (
            <button key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'none', border: 'none', borderRadius: '8px', width: '100%', textAlign: 'left', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.title}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 10px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', borderRadius: '8px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Tableau de bord
          </Link>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9 }} onClick={() => setSidebarOpen(false)}></div>}

      {/* Main chat area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', height: '100vh', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #E5E7EB' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="#FF5500"/><path d="M8 8h5.5a6.5 6.5 0 0 1 0 13H8V8z" fill="white"/><circle cx="18.5" cy="19.5" r="2.5" fill="white"/></svg>
            <strong>IA Devora</strong>
          </div>
        </div>

        <div ref={chatZoneRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#9CA3AF', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: '#FFF0EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div style={{ fontWeight: 'bold' }}>Comment puis-je vous aider ?</div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: msg.role === 'user' ? '#FF5500' : '#FFF0EB', color: msg.role === 'user' ? '#fff' : '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {msg.role === 'user' ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
              </div>
              <div>
                <div style={{ padding: '11px 16px', borderRadius: '16px', background: msg.role === 'user' ? '#FF5500' : '#F9FAFB', color: msg.role === 'user' ? '#fff' : '#1F2937', border: msg.role === 'user' ? 'none' : '1px solid #E5E7EB', borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px', borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px' }}>
                  {msg.image && <img src={msg.image} alt="upload" style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '8px' }} />}
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br>') }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '3px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
              <div style={{ width: '30px', height: '30px', background: '#FFF0EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', borderBottomLeftRadius: '4px', padding: '14px 18px', display: 'flex', gap: '5px' }}>
                <span className="dot" style={{ width: '7px', height: '7px', background: '#9CA3AF', borderRadius: '50%', animation: 'bounce 0.9s infinite' }}></span>
                <span className="dot" style={{ width: '7px', height: '7px', background: '#9CA3AF', borderRadius: '50%', animation: 'bounce 0.9s 0.15s infinite' }}></span>
                <span className="dot" style={{ width: '7px', height: '7px', background: '#9CA3AF', borderRadius: '50%', animation: 'bounce 0.9s 0.3s infinite' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{ padding: '10px 20px 14px', borderTop: '1px solid #E5E7EB' }}>
          {selectedImage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
              <img src={selectedImage.dataUrl} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} alt="preview" />
              <button onClick={() => setSelectedImage(null)} style={{ background: '#1F2937', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: '16px', padding: '6px 8px' }}>
            <button onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '5px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
            <textarea rows="1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: '0.9rem', padding: '6px 4px', maxHeight: '120px' }} placeholder="Message…"></textarea>
            <button onClick={sendMessage} disabled={loading} style={{ background: '#FF5500', color: '#fff', border: 'none', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @media (max-width: 768px) {
          .sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.28s; z-index: 10; }
          .sidebar.open { transform: translateX(0); }
          button:first-of-type { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
