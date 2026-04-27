// src/components/Login.jsx
import { useState } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import S from '../styles'

export default function Login({ onLogin, logoUrl }) {
  const [email,     setEmail]     = useState('')
  const [pass,      setPass]      = useState('')
  const [err,       setErr]       = useState('')
  const [loading,   setLoading]   = useState(false)
  const [showPass,  setShowPass]  = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async() => {
    setErr('')
    if(!email.trim()){ setErr('Please enter your email'); return }
    if(!pass.trim()) { setErr('Please enter your password'); return }
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass)
      const isAdmin = result.user.email.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
      onLogin(isAdmin?'admin':'member', {
        uid:   result.user.uid,
        email: result.user.email.toLowerCase(),
      })
    } catch(e) {
      switch(e.code){
        case 'auth/invalid-email':          setErr('Invalid email address'); break
        case 'auth/user-not-found':         setErr('No account found with this email'); break
        case 'auth/wrong-password':
        case 'auth/invalid-credential':     setErr('Wrong password. Please try again.'); break
        case 'auth/too-many-requests':      setErr('Too many attempts. Try again later.'); break
        default:                            setErr('Login failed. Check your email and password.')
      }
    }
    setLoading(false)
  }

  const handleReset = async() => {
    setErr('')
    if(!email.trim()){ setErr('Enter your email above first'); return }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setResetSent(true)
    } catch(e) {
      setErr('Could not send reset email. Check the address.')
    }
    setLoading(false)
  }

  return (
    <div style={S.loginBg}>
      <div style={S.loginGlow}/>
      <div style={S.loginCard}>
        <div style={{textAlign:'center',marginBottom:14}}>
          {logoUrl
            ? <img src={logoUrl} alt='logo' style={{width:60,height:60,borderRadius:16,objectFit:'cover'}}/>
            : <div style={S.loginLogo}>💰</div>
          }
        </div>
        <h1 style={S.loginH1}>Youth Organisations</h1>
        <p  style={S.loginSub}>by Team71 · Fund Manager</p>
        <div style={S.cloudBadge}>All rights reserved by Mahmood Shakil</div>

        {resetSent ? (
          <div style={{background:'#f0fdf4',border:'1.5px solid #86efac',borderRadius:14,padding:'20px 16px',textAlign:'center',color:'#14532d'}}>
            <div style={{fontSize:32,marginBottom:8}}>📧</div>
            <div style={{fontWeight:800,fontSize:15,marginBottom:6}}>Reset email sent!</div>
            <div style={{fontSize:13,marginBottom:14}}>Check your inbox and follow the link.</div>
            <button onClick={()=>{setResetSent(false);setResetMode(false)}} style={S.loginBtn}>← Back to Login</button>
          </div>
        ) : (
          <>
            {resetMode && (
              <>
                <button onClick={()=>{setResetMode(false);setErr('')}} style={{background:'none',border:'none',color:'#64748b',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',padding:'0 0 8px',display:'block'}}>← Back</button>
                <div style={{fontSize:13,color:'#6b7280',marginBottom:10}}>Enter your email to receive a reset link</div>
              </>
            )}

            <div style={ls.wrap}>
              <span style={ls.icon}>✉️</span>
              <input
                type='email' placeholder='Your email address'
                value={email} onChange={e=>{setEmail(e.target.value);setErr('')}}
                onKeyDown={e=>e.key==='Enter'&&!resetMode&&handleLogin()}
                style={ls.field} autoComplete='email'
              />
            </div>

            {!resetMode && (
              <div style={ls.wrap}>
                <span style={ls.icon}>🔒</span>
                <input
                  type={showPass?'text':'password'} placeholder='Your password'
                  value={pass} onChange={e=>{setPass(e.target.value);setErr('')}}
                  onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                  style={ls.field} autoComplete='current-password'
                />
                <button onClick={()=>setShowPass(p=>!p)} style={ls.eye} type='button'>
                  {showPass?'🙈':'👁️'}
                </button>
              </div>
            )}

            {err && <div style={S.loginErr}>⚠️ {err}</div>}

            {!resetMode ? (
              <>
                <button onClick={handleLogin} disabled={loading} style={{...S.loginBtn,opacity:loading?.7:1,marginTop:4}}>
                  {loading?'⏳ Logging in…':'Login →'}
                </button>
                <div style={{textAlign:'center',marginTop:12}}>
                  <button onClick={()=>{setResetMode(true);setErr('')}} style={ls.link}>Forgot password?</button>
                </div>
              </>
            ) : (
              <>
                <button onClick={handleReset} disabled={loading} style={{...S.loginBtn,background:'linear-gradient(135deg,#2563eb,#1d4ed8)',opacity:loading?.7:1}}>
                  {loading?'⏳ Sending…':'📧 Send Reset Link'}
                </button>
                <button onClick={()=>{setResetMode(false);setErr('')}} style={{width:'100%',padding:'11px',borderRadius:10,border:'1.5px solid #e5e7eb',background:'#f8fafc',color:'#374151',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit',marginTop:8}}>Cancel</button>
              </>
            )}
          </>
        )}
        <p style={S.loginHint}>Remember your password for future login.</p>
      </div>
    </div>
  )
}

const ls = {
  wrap: {display:'flex',alignItems:'center',border:'1.5px solid #e5e7eb',borderRadius:10,background:'#f8fafc',marginBottom:10,overflow:'hidden'},
  icon: {padding:'0 10px',fontSize:16,flexShrink:0},
  field: {flex:1,padding:'11px 8px 11px 0',border:'none',background:'transparent',fontSize:14,fontFamily:'inherit',outline:'none',color:'#0f172a'},
  eye:  {background:'none',border:'none',padding:'0 10px',cursor:'pointer',fontSize:16},
  link: {background:'none',border:'none',color:'#2563eb',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',textDecoration:'underline'},
}
