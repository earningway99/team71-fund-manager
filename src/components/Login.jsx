// src/components/Login.jsx
// ─────────────────────────────────────────────────────────────────
//  Firebase Email + Password Authentication
//  Admin and all 11 members each have their own email & password
// ─────────────────────────────────────────────────────────────────
import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../firebase'
import S from '../styles'

export default function Login({ onLogin }) {
  const [email,     setEmail]     = useState('')
  const [pass,      setPass]      = useState('')
  const [err,       setErr]       = useState('')
  const [loading,   setLoading]   = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showPass,  setShowPass]  = useState(false)

  // ── LOGIN ──────────────────────────────────────────────────────
  const handleLogin = async () => {
    setErr('')
    if (!email.trim()) { setErr('Please enter your email'); return }
    if (!pass.trim())  { setErr('Please enter your password'); return }

    setLoading(true)
    try {
      const result    = await signInWithEmailAndPassword(auth, email.trim(), pass)
      const uid       = result.user.uid
      const userEmail = result.user.email

      // Admin is identified by their email set in env variable
      if (userEmail === import.meta.env.VITE_ADMIN_EMAIL) {
        onLogin('admin', { name: 'Admin', id: '0', email: userEmail, uid })
      } else {
        // Regular member — App.jsx will match by email to member list
        onLogin('member', { email: userEmail, uid })
      }
    } catch (e) {
      switch (e.code) {
        case 'auth/invalid-email':
          setErr('Invalid email address'); break
        case 'auth/user-not-found':
          setErr('No account found with this email'); break
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setErr('Wrong password. Please try again.'); break
        case 'auth/too-many-requests':
          setErr('Too many failed attempts. Try again later.'); break
        default:
          setErr('Login failed. Check your email and password.')
      }
    }
    setLoading(false)
  }

  // ── FORGOT PASSWORD ────────────────────────────────────────────
  const handleReset = async () => {
    setErr('')
    if (!email.trim()) { setErr('Enter your email address above first'); return }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setResetSent(true)
    } catch (e) {
      setErr('Could not send reset email. Check the email address.')
    }
    setLoading(false)
  }

  return (
    <div style={S.loginBg}>
      <div style={S.loginGlow} />
      <div style={S.loginCard}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={S.loginLogo}>💰</div>
        </div>
        <h1 style={S.loginH1}>Youth Organisations</h1>
        <p  style={S.loginSub}>by Team71 · Fund Manager</p>
        <div style={S.cloudBadge}>
          ☁️ Secure Login · Each member has their own account
        </div>

        {/* ── RESET EMAIL SENT ── */}
        {resetSent ? (
          <div style={ls.successBox}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📧</div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
              Password reset email sent!
            </div>
            <div style={{ fontSize: 13, color: '#14532d', marginBottom: 16 }}>
              Check your inbox and follow the link to set a new password.
            </div>
            <button
              onClick={() => { setResetSent(false); setResetMode(false) }}
              style={S.loginBtn}
            >
              ← Back to Login
            </button>
          </div>
        ) : (
          <>
            {/* ── EMAIL FIELD ── */}
            <div style={ls.inputWrap}>
              <span style={ls.icon}>✉️</span>
              <input
                type='email'
                placeholder='Your email address'
                value={email}
                onChange={e => { setEmail(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && !resetMode && handleLogin()}
                style={ls.field}
                autoComplete='email'
              />
            </div>

            {/* ── PASSWORD FIELD ── */}
            {!resetMode && (
              <div style={ls.inputWrap}>
                <span style={ls.icon}>🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder='Your password'
                  value={pass}
                  onChange={e => { setPass(e.target.value); setErr('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={ls.field}
                  autoComplete='current-password'
                />
                <button
                  onClick={() => setShowPass(p => !p)}
                  style={ls.eyeBtn}
                  type='button'
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            )}

            {/* ── ERROR ── */}
            {err && (
              <div style={S.loginErr}>⚠️ {err}</div>
            )}

            {/* ── BUTTONS ── */}
            {!resetMode ? (
              <>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  style={{ ...S.loginBtn, opacity: loading ? .7 : 1, marginTop: 4 }}
                >
                  {loading ? '⏳ Logging in…' : 'Login →'}
                </button>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <button
                    onClick={() => { setResetMode(true); setErr('') }}
                    style={ls.linkBtn}
                    type='button'
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, textAlign: 'center' }}>
                  A password reset link will be sent to your email
                </div>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  style={{ ...S.loginBtn, background: '#2563eb', opacity: loading ? .7 : 1 }}
                >
                  {loading ? '⏳ Sending…' : '📧 Send Reset Link'}
                </button>
                <button
                  onClick={() => { setResetMode(false); setErr('') }}
                  style={{ ...ls.cancelBtn, marginTop: 8 }}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

// local styles
const ls = {
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #e5e7eb', borderRadius: 10,
    background: '#f8fafc', marginBottom: 10, overflow: 'hidden',
  },
  icon:  { padding: '0 10px', fontSize: 16, flexShrink: 0 },
  field: {
    flex: 1, padding: '11px 8px 11px 0',
    border: 'none', background: 'transparent',
    fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0f172a',
  },
  eyeBtn: {
    background: 'none', border: 'none',
    padding: '0 10px', cursor: 'pointer', fontSize: 16,
  },
  linkBtn: {
    background: 'none', border: 'none', color: '#2563eb',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'inherit', textDecoration: 'underline',
  },
  cancelBtn: {
    width: '100%', padding: '12px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', background: '#f8fafc',
    color: '#374151', fontWeight: 700, fontSize: 14,
    cursor: 'pointer', fontFamily: 'inherit', display: 'block',
  },
  successBox: {
    background: '#f0fdf4', border: '1.5px solid #86efac',
    borderRadius: 14, padding: '20px 16px',
    textAlign: 'center', color: '#14532d',
  },
}
