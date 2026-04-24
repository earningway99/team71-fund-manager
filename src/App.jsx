// src/App.jsx
import { useState, useEffect, useMemo } from 'react'
import { seedIfEmpty, useCloudData }    from './useCloudData'
import { nowMonthKey, genMonthKeys, DONATION_AMOUNT } from './constants'
import Login      from './components/Login'
import Dashboard  from './components/Dashboard'
import Donations  from './components/Donations'
import Members    from './components/Members'
import Expenses   from './components/Expenses'
import Reports    from './components/Reports'
import MyPayments from './components/MyPayments'
import S          from './styles'

// inject spinner keyframe once
const _style = document.createElement('style')
_style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}'
document.head.appendChild(_style)

export default function App() {
  const [screen,   setScreen]   = useState('login')
  const [role,     setRole]     = useState(null)
  const [authUser, setAuthUser] = useState(null)
  const [tab,      setTab]      = useState('dashboard')
  const [toast,    setToast]    = useState(null)
  const [seeded,   setSeeded]   = useState(false)

  const {
    members, payments, expenses,
    loading, saving, error,
    saveMembers, savePayments, saveExpenses
  } = useCloudData()

  // seed Firestore once on first ever launch
  useEffect(() => {
    if (!seeded) {
      seedIfEmpty().then(() => setSeeded(true)).catch(console.error)
    }
  }, [seeded])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const monthKeys = useMemo(() => genMonthKeys('2025-10'), [])
  const currentMonth = nowMonthKey()

  const totalCollected = (mk) =>
    Object.keys((payments || {})[mk] || {}).length * DONATION_AMOUNT
  const totalUnpaid = (mk) =>
    ((members || []).length - Object.keys((payments || {})[mk] || {}).length) * DONATION_AMOUNT

  const allTimeCollected = useMemo(
    () => monthKeys.reduce((s, mk) => s + totalCollected(mk), 0),
    [payments, monthKeys, members]
  )
  const allTimeExpenses = useMemo(
    () => (expenses || []).reduce((s, e) => s + e.amount, 0),
    [expenses]
  )
  const balance = allTimeCollected - allTimeExpenses

  const login  = (r, u) => { setRole(r); setAuthUser(u); setScreen('app'); setTab('dashboard') }
  const logout = () => { setRole(null); setAuthUser(null); setScreen('login') }

  // ── BOOT / LOADING ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={S.bootScreen}>
        <div style={S.bootCard}>
          <div style={S.bootLogo}>💰</div>
          <div style={S.bootTitle}>Youth organisation - Fund manager</div>
          <div style={S.bootSub}>This is still in the beta phase, so some data may be inaccurate.</div>
          <div style={S.spinner} />
        </div>
      </div>
    )
  }

  // ── FIREBASE CONFIG ERROR ──────────────────────────────────────
  if (error) {
    return (
      <div style={S.bootScreen}>
        <div style={{ ...S.bootCard, maxWidth: 340 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={S.bootTitle}>Firebase Not Configured</div>
          <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
            Add your Firebase credentials to <code style={{ color: '#4ade80' }}>.env.local</code> (local) or Netlify Environment Variables (production).
          </div>
          <div style={{ background: '#1e293b', borderRadius: 10, padding: '12px 14px', textAlign: 'left', fontSize: 12, color: '#4ade80', lineHeight: 2, fontFamily: 'monospace' }}>
            VITE_FIREBASE_API_KEY=…<br/>
            VITE_FIREBASE_AUTH_DOMAIN=…<br/>
            VITE_FIREBASE_PROJECT_ID=…<br/>
            VITE_FIREBASE_APP_ID=…
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 12 }}>
            See README.md for full setup guide.
          </div>
        </div>
      </div>
    )
  }

  // ── LOGIN ──────────────────────────────────────────────────────
  if (screen === 'login') return <Login onLogin={login} members={members} />

  // ── NAV ITEMS ──────────────────────────────────────────────────
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Home'      },
    { id: 'donations', icon: '💳', label: 'Donations' },
    ...(role === 'admin'
      ? [
          { id: 'members',  icon: '👥', label: 'Members'  },
          { id: 'expenses', icon: '💸', label: 'Expenses' },
        ]
      : [{ id: 'mypay', icon: '👤', label: 'Mine' }]
    ),
    { id: 'reports', icon: '📊', label: 'Reports' },
  ]

  const sharedProps = {
    members:      members || [],
    payments:     payments || {},
    expenses:     expenses || [],
    monthKeys,
    currentMonth,
    totalCollected,
    totalUnpaid,
    allTimeCollected,
    allTimeExpenses,
    balance,
    showToast,
    saveMembers,
    savePayments,
    saveExpenses,
    role,
    authUser,
  }

  // ── MAIN APP SHELL ─────────────────────────────────────────────
  return (
    <div style={S.shell}>
      {/* TOP BAR */}
      <header style={S.topBar}>
        <div style={S.topLeft}>
          <div style={S.orgBadge}>YO</div>
          <div>
            <div style={S.orgName}>Youth Organisation - Fund Manager</div>
            <div style={S.orgSub}>{role === 'admin' ? '⚙️ Admin Panel' : `👤 ${authUser?.name}`}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saving
            ? <div style={S.savingPill}>☁ Saving…</div>
            : <div style={S.savedPill}>☁ Synced</div>
          }
          <button onClick={logout} style={S.logoutBtn}>Signout</button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main style={S.main}>
        {tab === 'dashboard' && <Dashboard  {...sharedProps} />}
        {tab === 'donations' && <Donations  {...sharedProps} />}
        {tab === 'members'   && role === 'admin' && <Members  {...sharedProps} />}
        {tab === 'expenses'  && role === 'admin' && <Expenses {...sharedProps} />}
        {tab === 'reports'   && <Reports    {...sharedProps} />}
        {tab === 'mypay'     && role === 'member' && <MyPayments {...sharedProps} />}
      </main>

      {/* BOTTOM NAV */}
      <nav style={S.nav}>
        {navItems.map(n => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{ ...S.navBtn, ...(tab === n.id ? S.navActive : {}) }}
          >
            <span style={S.navIcon}>{n.icon}</span>
            <span style={{ ...S.navLabel, color: tab === n.id ? '#16a34a' : '#64748b' }}>
              {n.label}
            </span>
          </button>
        ))}
      </nav>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ ...S.toast, background: toast.type === 'warn' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'warn' ? '⚠️' : '✓'} {toast.msg}
        </div>
      )}
    </div>
  )
}
