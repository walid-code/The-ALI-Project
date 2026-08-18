import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

const API_BASE = '/api'
const STORAGE_KEY = 'ali-convos'

function App() {
  const [conversations, setConversations] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })
  const [activeId, setActiveId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('connecting')
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [temperature, setTemperature] = useState(0.2)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [debugMode, setDebugMode] = useState(false)
  const [report, setReport] = useState(null)

  const endRef = useRef(null)
  const fileRef = useRef(null)
  const textareaRef = useRef(null)

  const active = conversations.find(c => c.id === activeId)
  const messages = active?.messages ?? []

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    fetch(API_BASE + '/health')
      .then(r => r.json())
      .then(d => {
        setStatus(d.ollama ? 'ready' : 'no-ollama')
        if (d.model) setSelectedModel(d.model)
      })
      .catch(() => setStatus('offline'))
    fetch(API_BASE + '/models')
      .then(r => r.json())
      .then(d => setModels(d.models || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const newChat = () => {
    const id = Date.now().toString()
    setConversations(prev => [{ id, title: 'New Chat', messages: [], createdAt: id }, ...prev])
    setActiveId(id)
    setImagePreview(null)
    setImageFile(null)
  }

  const delChat = (id, e) => {
    e.stopPropagation()
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id)
      if (activeId === id) setActiveId(next.length ? next[0].id : null)
      return next
    })
  }

  const fetchReport = async () => {
    try {
      const res = await fetch(API_BASE + '/report')
      const data = await res.json()
      setReport(data)
    } catch (e) {
      setReport({ error: e.message })
    }
  }

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text && !imageFile) return
    if (loading) return

    let convId = activeId
    if (!convId) {
      convId = Date.now().toString()
      setConversations(prev => [{ id: convId, title: 'New Chat', messages: [], createdAt: convId }, ...prev])
      setActiveId(convId)
    }

    const userMsg = { role: 'user', content: text || '(image attached)' }

    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length === 0 && text ? text.slice(0, 45) + (text.length > 45 ? '...' : '') : c.title } : c
    ))
    setInput('')
    setLoading(true)

    let images = []
    if (imageFile) {
      const b64 = await new Promise((resolve) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result.split(',')[1])
        r.readAsDataURL(imageFile)
      })
      images = [b64]
      setImagePreview(null)
      setImageFile(null)
    }

    try {
      const body = { message: text, images, model: selectedModel, debug: debugMode }
      if (temperature !== 0.2) body.temperature = temperature
      const res = await fetch(API_BASE + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      const assistantMsg = { role: 'assistant', content: data.reply, debug: data.debug }
      setConversations(prev => prev.map(c =>
        c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
      ))
    } catch (e) {
      setConversations(prev => prev.map(c =>
        c.id === convId ? { ...c, messages: [...c.messages, { role: 'assistant', content: `**Error**: ${e.message}` }] } : c
      ))
    }
    setLoading(false)
  }, [input, loading, activeId, imageFile, selectedModel, temperature, debugMode])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleImage = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setImageFile(f)
      setImagePreview(URL.createObjectURL(f))
    }
    e.target.value = ''
  }

  const copyCode = async (text) => {
    try { await navigator.clipboard.writeText(text) } catch {}
  }

  const copyMsg = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {}
  }

  const statusColor = status === 'ready' ? '#00ff88' : status === 'no-ollama' ? '#ffaa00' : '#ff4444'
  const statusLabel = status === 'ready' ? '$RED ACTIVE' : status === 'no-ollama' ? 'NO OLLAMA' : 'OFFLINE'

  const DbgBadge = ({ d }) => {
    if (!d) return null
    const items = [
      ['Model', d.model],
      ['Temp', d.temperature],
      ['Time', `${d.wall_time_s || '?'}s`],
      ['Prompt', `${d.prompt_eval_count ?? '?'} tok`],
      ['Output', `${d.eval_count ?? '?'} tok`],
      ['Speed', d.tokens_per_second ? `${d.tokens_per_second} tok/s` : '?'],
    ]
    return (
      <div style={dbg.container}>
        <div style={dbg.title}>Debug Info</div>
        <div style={dbg.grid}>
          {items.map(([k, v]) => (
            <div key={k} style={dbg.item}>
              <span style={dbg.key}>{k}</span>
              <span style={dbg.val}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ReportModal = ({ data, onClose }) => {
    if (!data) return null
    if (data.error) return <div style={modal.overlay} onClick={onClose}><div style={modal.body} onClick={e => e.stopPropagation()}><p style={{color:'#f88'}}>Error: {data.error}</p></div></div>
    const rows = [
      ['Session', data.session_id],
      ['Start', data.start],
      ['End', data.end],
      ['User Messages', data.user_messages],
      ['Responses', data.assistant_responses],
      ['Errors', data.errors],
      ['Ingested', data.documents_ingested],
      ['Log File', data.logs_file],
    ]
    return (
      <div style={modal.overlay} onClick={onClose}>
        <div style={modal.body} onClick={e => e.stopPropagation()}>
          <div style={modal.hdr}>
            <span style={modal.title}>Session Report</span>
            <button style={modal.close} onClick={onClose}>×</button>
          </div>
          <div style={modal.grid}>
            {rows.map(([k, v]) => (
              <div key={k} style={modal.row}>
                <span style={modal.key}>{k}</span>
                <span style={modal.val}>{v ?? 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const mdComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const code = String(children).replace(/\n$/, '')
      if (!inline) {
        return (
          <div style={cblock.out}>
            <div style={cblock.hdr}>
              <span style={cblock.lang}>{match?.[1] || 'code'}</span>
              <button style={cblock.btn} onClick={() => copyCode(code)}>Copy</button>
            </div>
            <pre style={cblock.pre}><code style={cblock.code}>{code}</code></pre>
          </div>
        )
      }
      return <code style={cblock.inline}>{children}</code>
    }
  }

  return (
    <div style={s.root}>
      {report && <ReportModal data={report} onClose={() => setReport(null)} />}

      <div style={{...s.sidebar, display: showSidebar ? 'flex' : 'none'}}>
        <div style={s.sbHead}>
          <button style={s.sbNew} onClick={newChat}>+ New Chat</button>
        </div>
        <div style={s.sbList}>
          {conversations.map(c => (
            <div key={c.id} className="sb-item" style={{...s.sbItem, background: c.id === activeId ? '#1e1e38' : 'transparent'}} onClick={() => setActiveId(c.id)}>
              <span style={s.sbTitle}>{c.title}</span>
              <button style={s.sbDel} onClick={(e) => delChat(c.id, e)}>×</button>
            </div>
          ))}
          {conversations.length === 0 && <div style={s.sbEmpty}>No conversations yet</div>}
        </div>
        <div style={s.sbFoot}>
          <span style={{...s.dot, background: statusColor}} />
          <span style={s.footTxt}>{statusLabel}</span>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.header}>
          <button style={s.toggle} onClick={() => setShowSidebar(v => !v)}>☰</button>
          <h1 style={s.title}>ALI</h1>
          <span style={s.sub}>Artificial Libre Intelligence</span>
          <div style={s.spacer} />
          {imagePreview && (
            <div style={s.imgBadge}>
              <span style={s.imgName}>{imageFile?.name || 'image'}</span>
              <button style={s.imgRm} onClick={() => { setImagePreview(null); setImageFile(null) }}>×</button>
            </div>
          )}
          <button style={{...s.gear, color: debugMode ? '#00ff88' : '#888'}} onClick={() => setDebugMode(v => !v)} title="Toggle debug mode">🛠</button>
          <button style={s.gear} onClick={() => { fetchReport(); setShowSettings(false) }} title="Session report">📊</button>
          <button style={s.gear} onClick={() => { setShowSettings(v => !v); setReport(null) }}>⚙</button>
        </div>

        {showSettings && (
          <div style={s.settings}>
            <div style={s.setRow}>
              <label style={s.setLabel}>Model</label>
              <select style={s.setSelect} value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
                {models.length === 0 && <option value={selectedModel}>{selectedModel || 'qwen3:8b'}</option>}
              </select>
            </div>
            <div style={s.setRow}>
              <label style={s.setLabel}>Temperature <span style={s.setVal}>{temperature.toFixed(1)}</span></label>
              <input type="range" min="0" max="1.5" step="0.1" value={temperature} style={s.setRange} onChange={e => setTemperature(parseFloat(e.target.value))} />
            </div>
            <div style={s.setRow}>
              <label style={s.setLabel}>Debug</label>
              <span style={{...s.toggleBadge, background: debugMode ? '#00ff88' : '#333', color: debugMode ? '#000' : '#888'}} onClick={() => setDebugMode(v => !v)}>{debugMode ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        )}

        <div style={s.chat}>
          {messages.length === 0 && !loading && (
            <div style={s.welcome}>
              <div style={s.logo}>🛡️</div>
              <p style={s.welTxt}>I am <strong>ALI</strong> — a sovereign, libre intelligence.</p>
              <p style={s.welSub}>Ask me anything. I answer with <span style={{color:'#00ff88'}}>$RED</span> logic.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{...s.msg, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? '#2a2a3e' : '#16162a', borderLeft: msg.role === 'assistant' ? '3px solid #00ff88' : 'none'}}>
              <div style={s.msgContent}>
                <ReactMarkdown components={mdComponents}>{msg.content}</ReactMarkdown>
                {msg.role === 'assistant' && msg.debug && <DbgBadge d={msg.debug} />}
              </div>
              {msg.role === 'assistant' && (
                <button style={s.copyBtn} onClick={() => copyMsg(msg.content, i)} title="Copy">
                  {copiedId === i ? '✓' : '📋'}
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div style={s.msgR}>
              <div style={s.typing}>
                <span style={s.tyDot}></span>
                <span style={{...s.tyDot, animationDelay: '0.2s'}}></span>
                <span style={{...s.tyDot, animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={s.inputBar}>
          {imagePreview && (
            <div style={s.preview}>
              <img src={imagePreview} style={s.previewImg} alt="preview" />
              <button style={s.previewRm} onClick={() => { setImagePreview(null); setImageFile(null) }}>×</button>
            </div>
          )}
          <div style={s.inputRow}>
            <button style={s.imgBtn} onClick={() => fileRef.current?.click()} title="Attach image">📷</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImage} />
            <textarea ref={textareaRef} style={s.input} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask ALI anything..." rows={1} />
            <button style={s.sendBtn} onClick={send} disabled={loading || (!input.trim() && !imageFile)} title="Send message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const dbg = {
  container: { marginTop: 8, padding: 8, background: '#0a0a16', borderRadius: 6, border: '1px solid #2a2a3e', fontSize: 11 },
  title: { color: '#00ff88', fontWeight: 600, marginBottom: 4, fontSize: 10, textTransform: 'uppercase' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' },
  item: { display: 'flex', justifyContent: 'space-between' },
  key: { color: '#666' },
  val: { color: '#aaa', fontFamily: 'monospace' },
}

const modal = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  body: { background: '#12122a', border: '1px solid #2a2a3e', borderRadius: 12, padding: 24, minWidth: 400, maxWidth: 600 },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 700, color: '#00ff88' },
  close: { background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' },
  grid: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1a1a2e', fontSize: 13 },
  key: { color: '#888' },
  val: { color: '#e0e0e0', fontFamily: 'monospace', fontSize: 12, textAlign: 'right', maxWidth: '50%', wordBreak: 'break-all' },
}

const cblock = {
  out: { borderRadius: 6, overflow: 'hidden', margin: '8px 0', border: '1px solid #2a2a3e', position: 'relative' },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', background: '#1a1a2e', borderBottom: '1px solid #2a2a3e', fontSize: 12 },
  lang: { color: '#888', textTransform: 'uppercase', fontSize: 11, fontWeight: 600 },
  btn: { background: 'none', border: '1px solid #444', color: '#aaa', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', fontSize: 11 },
  pre: { padding: 12, margin: 0, overflowX: 'auto', background: '#0d0d1a' },
  code: { fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace", fontSize: 13, lineHeight: 1.5, color: '#e0e0e0' },
  inline: { background: '#2a2a3e', padding: '2px 6px', borderRadius: 3, fontSize: '0.9em', fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace" },
}

const s = {
  root: { display: 'flex', height: '100vh', background: '#0f0f1a', color: '#e0e0e0', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  sidebar: { width: 260, minWidth: 260, flexDirection: 'column', background: '#0a0a16', borderRight: '1px solid #1a1a2e' },
  sbHead: { padding: 12, borderBottom: '1px solid #1a1a2e' },
  sbNew: { width: '100%', padding: '10px 0', background: '#00ff88', color: '#000', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  sbList: { flex: 1, overflowY: 'auto', padding: 8 },
  sbItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, marginBottom: 2 },
  sbTitle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: '#ccc' },
  sbDel: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: '0 4px', opacity: 0, transition: 'opacity 0.15s' },
  sbEmpty: { padding: 20, textAlign: 'center', color: '#444', fontSize: 13 },
  sbFoot: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderTop: '1px solid #1a1a2e', fontSize: 12, color: '#666' },
  dot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  footTxt: { fontSize: 11 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  header: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #1a1a2e', background: '#0d0d1a' },
  toggle: { background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer', padding: '4px 8px' },
  title: { fontSize: 20, fontWeight: 700, color: '#00ff88', margin: 0 },
  sub: { fontSize: 12, color: '#666' },
  spacer: { flex: 1 },
  imgBadge: { display: 'flex', alignItems: 'center', gap: 6, background: '#1a2a1a', padding: '4px 10px', borderRadius: 6, fontSize: 12, border: '1px solid #2a4a2a' },
  imgName: { color: '#8c8', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  imgRm: { background: 'none', border: 'none', color: '#f88', cursor: 'pointer', fontSize: 14 },
  gear: { background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer', padding: '4px 8px' },
  settings: { background: '#0d0d1a', borderBottom: '1px solid #1a1a2e', padding: '12px 20px', display: 'flex', gap: 24, flexWrap: 'wrap' },
  setRow: { display: 'flex', alignItems: 'center', gap: 10 },
  setLabel: { fontSize: 12, color: '#888', minWidth: 80 },
  setVal: { color: '#00ff88', fontWeight: 600, marginLeft: 4 },
  setSelect: { background: '#1a1a2e', color: '#e0e0e0', border: '1px solid #333', borderRadius: 4, padding: '6px 10px', fontSize: 13, outline: 'none' },
  setRange: { width: 120, accentColor: '#00ff88' },
  toggleBadge: { padding: '2px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  chat: { flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 },
  welcome: { textAlign: 'center', margin: 'auto', color: '#555' },
  logo: { fontSize: 48, marginBottom: 8 },
  welTxt: { fontSize: 16, margin: '4px 0' },
  welSub: { fontSize: 13, margin: '4px 0', color: '#666' },
  msg: { display: 'flex', gap: 8, maxWidth: '80%', padding: '12px 16px', borderRadius: 8, lineHeight: 1.6, fontSize: 14, position: 'relative' },
  msgContent: { flex: 1, minWidth: 0 },
  copyBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 12, padding: '2px 6px', alignSelf: 'flex-start', opacity: 0.5 },
  msgR: { alignSelf: 'flex-start', background: '#16162a', padding: '12px 20px', borderRadius: 8, borderLeft: '3px solid #00ff88' },
  typing: { display: 'flex', gap: 4, alignItems: 'center' },
  tyDot: { width: 6, height: 6, borderRadius: '50%', background: '#00ff88', animation: 'typing 1.4s infinite', display: 'inline-block' },
  inputBar: { padding: '12px 20px', borderTop: '1px solid #1a1a2e', background: '#0d0d1a' },
  preview: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  previewImg: { height: 60, borderRadius: 6, border: '1px solid #333' },
  previewRm: { background: '#3a1a1a', border: 'none', color: '#f88', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  inputRow: { display: 'flex', gap: 8, alignItems: 'flex-end' },
  imgBtn: { background: '#1a1a2e', border: '1px solid #333', color: '#888', borderRadius: 6, padding: '8px 10px', cursor: 'pointer', fontSize: 16, lineHeight: 1 },
  input: { flex: 1, padding: '10px 14px', borderRadius: 6, border: '1px solid #333', background: '#1a1a2e', color: '#e0e0e0', fontSize: 14, resize: 'none', outline: 'none', fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: 42, maxHeight: 200 },
  sendBtn: { width: 42, height: 42, borderRadius: '50%', border: 'none', background: '#00ff88', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.2s, transform 0.15s' },
}

const styleSheet = document.createElement('style')
styleSheet.textContent = `@keyframes typing { 0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); } 30% { opacity: 1; transform: scale(1); } }
  .sb-item:hover button { opacity: 1 !important; }`
document.head.appendChild(styleSheet)

export default App
