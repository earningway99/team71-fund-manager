// src/App.jsx  — V4
import { useState, useEffect, useMemo }  from 'react'
import { onAuthStateChanged, signOut }   from 'firebase/auth'
import { auth }                          from './firebase'
import { seedIfEmpty, useCloudData }     from './useCloudData'
import { nowMonthKey, genMonthKeys, DONATION_AMOUNT } from './constants'
import Login         from './components/Login'
import Dashboard     from './components/Dashboard'
import Donations     from './components/Donations'
import Members       from './components/Members'
import Expenses      from './components/Expenses'
import ExtraDonation from './components/ExtraDonation'
import Reports       from './components/Reports'
import MyPayments    from './components/MyPayments'
import S             from './styles'

const _s = document.createElement('style')
_s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}'
document.head.appendChild(_s)

export default function App() {
  const [screen,   setScreen]   = useState('loading')
  const [role,     setRole]     = useState(null)
  const [authUser, setAuthUser] = useState(null)  // {uid, email}
  const [tab,      setTab]      = useState('dashboard')
  const [toast,    setToast]    = useState(null)
  const [seeded,   setSeeded]   = useState(false)

  const {
    members, payments, expenses, extraDonations,
    loading:dataLoading, saving, error,
    saveMembers, savePayments, saveExpenses, saveExtraDonations
  } = useCloudData()

  useEffect(()=>{
    if(!seeded) seedIfEmpty().then(()=>setSeeded(true)).catch(console.error)
  },[seeded])

  // ── Auth state listener ──────────────────────────────────────
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, fu=>{
      if(fu){
        const isAdmin = fu.email?.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
        setRole(isAdmin?'admin':'member')
        setAuthUser({ uid: fu.uid, email: fu.email?.toLowerCase() })
        setScreen('app')
      } else {
        setScreen('login'); setRole(null); setAuthUser(null)
      }
    })
    return ()=>unsub()
  },[])

  // ── Find logged-in member by UID (V4 — reliable) ─────────────
  // UID is stored in each member record by admin
  const currentMember = useMemo(()=>{
    if(role!=='member' || !authUser?.uid || !members) return null
    // First try UID match (most reliable)
    let found = members.find(m=> m.uid === authUser.uid)
    // Fallback: email match (case-insensitive)
    if(!found) found = members.find(m=>
      m.email?.toLowerCase().trim() === authUser.email?.toLowerCase().trim()
    )
    return found || null
  },[members, authUser, role])

  const showToast=(msg,type='success')=>{
    setToast({msg,type}); setTimeout(()=>setToast(null),3000)
  }

  const handleLogin=(r,u)=>{ setRole(r); setAuthUser(u); setScreen('app'); setTab('dashboard') }
  const handleLogout=async()=>{ await signOut(auth); setRole(null); setAuthUser(null); setScreen('login') }

  const monthKeys    = useMemo(()=>genMonthKeys('2025-10'),[])
  const currentMonth = nowMonthKey()

  const totalCollected=(mk)=> Object.keys((payments||{})[mk]||{}).length * DONATION_AMOUNT

  const totalExtraDonations = useMemo(()=>
    (extraDonations||[]).reduce((s,e)=>s+e.amount,0),[extraDonations])

  const totalUnpaid=(mk)=>
    ((members||[]).length - Object.keys((payments||{})[mk]||{}).length) * DONATION_AMOUNT

  const allTimeCollected = useMemo(()=>
    monthKeys.reduce((s,mk)=>s+totalCollected(mk),0) + totalExtraDonations,
    [payments,monthKeys,members,extraDonations])

  const allTimeExpenses = useMemo(()=>
    (expenses||[]).reduce((s,e)=>s+e.amount,0),[expenses])

  const balance = allTimeCollected - allTimeExpenses

  const logoUrl = import.meta.env.VITE_LOGO_URL || null

  // ── Loading screen ───────────────────────────────────────────
  if(screen==='loading' || (screen==='app' && dataLoading)){
    return(
      <div style={S.bootScreen}>
        <div style={S.bootCard}>
          {logoUrl
            ? <img src={logoUrl} alt='logo' style={{width:70,height:70,borderRadius:18,objectFit:'cover',marginBottom:16}}/>
            : <div style={S.bootLogo}>💰</div>
          }
          <div style={S.bootTitle}>Team71 Fund Manager</div>
          <div style={S.bootSub}>Connecting to cloud…</div>
          <div style={S.spinner}/>
        </div>
      </div>
    )
  }

  if(error){
    return(
      <div style={S.bootScreen}>
        <div style={{...S.bootCard,maxWidth:340}}>
          <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
          <div style={S.bootTitle}>Firebase Not Configured</div>
          <div style={{color:'#94a3b8',fontSize:13,lineHeight:1.6}}>
            Add your Firebase keys to Netlify Environment Variables and redeploy.
          </div>
        </div>
      </div>
    )
  }

  if(screen==='login') return <Login onLogin={handleLogin} logoUrl={logoUrl}/>

  // ── Nav items ────────────────────────────────────────────────
  const navItems = [
    {id:'dashboard',    icon:'🏠', label:'Home'},
    {id:'donations',    icon:'💳', label:'Donations'},
    ...(role==='admin'
      ? [
          {id:'members',       icon:'👥', label:'Members'},
          {id:'expenses',      icon:'💸', label:'Expenses'},
          {id:'extradonation', icon:'➕', label:'Extra'},
        ]
      : [
          {id:'mypay',         icon:'👤', label:'Mine'},
          {id:'expenses',      icon:'💸', label:'Expenses'},
          {id:'extradonation', icon:'➕', label:'Extra'},
        ]
    ),
    {id:'reports', icon:'📊', label:'Reports'},
  ]

  const sharedProps = {
    members:      members||[],
    payments:     payments||{},
    expenses:     expenses||[],
    extraDonations: extraDonations||[],
    monthKeys, currentMonth,
    totalCollected, totalUnpaid,
    allTimeCollected, allTimeExpenses, balance,
    totalExtraDonations,
    showToast, setTab,
    saveMembers, savePayments, saveExpenses, saveExtraDonations,
    role, authUser, currentMember,
  }

  const displayName = role==='admin'
    ? 'Admin'
    : currentMember?.name || authUser?.email || 'Member'

  return(
    <div style={S.shell}>
      {/* TOP BAR */}
      <header style={S.topBar}>
        <div style={S.topLeft}>
          {logoUrl
            ? <img src={logoUrl} alt='logo' style={{width:36,height:36,borderRadius:10,objectFit:'cover',flexShrink:0}}/>
            : <div style={S.orgBadge}>YO</div>
          }
          <div>
            <div style={S.orgName}>Team71 Fund Manager</div>
            <div style={S.orgSub}>{role==='admin'?'⚙️ Admin Panel':`👤 ${displayName}`}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {saving?<div style={S.savingPill}>☁ Saving…</div>:<div style={S.savedPill}>☁ Synced</div>}
          <button onClick={handleLogout} style={S.logoutBtn}>↩</button>
        </div>
      </header>

      {/* CONTENT */}
      <main style={S.main}>
        {tab==='dashboard'    && <Dashboard     {...sharedProps}/>}
        {tab==='donations'    && <Donations     {...sharedProps}/>}
        {tab==='members'      && role==='admin' && <Members      {...sharedProps}/>}
        {tab==='expenses'     && <Expenses      {...sharedProps} viewOnly={role==='member'}/>}
        {tab==='extradonation'&& <ExtraDonation {...sharedProps} viewOnly={role==='member'}/>}
        {tab==='reports'      && <Reports       {...sharedProps}/>}
        {tab==='mypay'        && role==='member'&& <MyPayments   {...sharedProps}/>}
      </main>

      {/* BOTTOM NAV */}
      <nav style={S.nav}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)}
            style={{...S.navBtn,...(tab===n.id?S.navActive:{})}}>
            <span style={S.navIcon}>{n.icon}</span>
            <span style={{...S.navLabel,color:tab===n.id?'#16a34a':'#64748b'}}>{n.label}</span>
          </button>
        ))}
      </nav>

      {toast&&(
        <div style={{...S.toast,background:toast.type==='warn'?'#dc2626':'#16a34a'}}>
          {toast.type==='warn'?'⚠️':'✓'} {toast.msg}
        </div>
      )}
    </div>
  )
}
