// src/components/Login.jsx
import { useState } from 'react'
import S from '../styles'

export default function Login({ onLogin, members }) {
  const [mode,  setMode]  = useState('admin')
  const [pass,  setPass]  = useState('')
  const [memId, setMemId] = useState('')
  const [err,   setErr]   = useState('')

  const go = () => {
    setErr('')
    if (mode === 'admin') {
      if (pass === 'admin123') onLogin('admin', { name: 'Admin', id: '0' })
      else setErr('Wrong password. Try: admin123')
    } else {
      const m = members?.find(x => x.id === memId)
      if (!m)   { setErr('Please select your name'); return }
      if (pass === 'member123') onLogin('member', m)
      else setErr('Wrong password. Try: member123')
    }
  }

  return (
    <div style={S.loginBg}>
      <div style={S.loginGlow} />
      <div style={S.loginCard}>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={S.loginLogo}>💰</div>
        </div>

        <h1 style={S.loginH1}>Youth Organisations</h1>
        <p  style={S.loginSub}>by Team71 · Fund Manager</p>

        <div style={S.cloudBadge}>
          ☁️ Cloud Edition · Live sync across all members
        </div>

        <div style={S.modeTabs}>
          {['admin', 'member'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setErr(''); setPass('') }}
              style={{ ...S.modeTab, ...(mode === m ? S.modeTabOn : {}) }}
            >
              {m === 'admin' ? '🔑 Admin' : '👤 Member'}
            </button>
          ))}
        </div>

        {mode === 'member' && (
          <select
            value={memId}
            onChange={e => setMemId(e.target.value)}
            style={S.inp}
          >
            <option value=''>— Select your name —</option>
            {(members || []).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        )}

        <input
          type='password'
          placeholder='Password'
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && go()}
          style={S.inp}
        />

        <button onClick={go} style={S.loginBtn}>Login →</button>

        {err && <div style={S.loginErr}>{err}</div>}

        <p style={S.loginHint}>Demo passwords: admin123 / member123</p>
      </div>
    </div>
  )
}
