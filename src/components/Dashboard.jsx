// src/components/Dashboard.jsx
import { useMemo, useState } from 'react'
import { fmtMonth, DONATION_AMOUNT } from '../constants'
import S from '../styles'

function StatCard({ icon, label, val, clr, bg, bdr, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: bg, borderRadius: 14, padding: '14px 8px',
        textAlign: 'center', border: `1.5px solid ${bdr}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 4px 16px ${bdr}` } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ fontSize: 20, marginBottom: 3 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 900, color: clr }}>{val}</div>
      <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function Row({ label, val, vc = '#111827', bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: bold ? 900 : 600, color: vc }}>{val}</span>
    </div>
  )
}

// ── Clickable Bar Chart ───────────────────────────────────────────
function BarChart({ last6, totalCollected, currentMonth, payments, members, onBarClick }) {
  const [hoveredBar, setHoveredBar] = useState(null)
  const maxC = Math.max(...last6.map(mk => totalCollected(mk)), 100)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, paddingTop: 8 }}>
      {last6.map(mk => {
        const h      = Math.max((totalCollected(mk) / maxC) * 95, 4)
        const cur    = mk === currentMonth
        const hov    = hoveredBar === mk
        const paidN  = Object.keys((payments || {})[mk] || {}).length
        const total  = members.length

        return (
          <div
            key={mk}
            onClick={() => onBarClick(mk)}
            onMouseEnter={() => setHoveredBar(mk)}
            onMouseLeave={() => setHoveredBar(null)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', position: 'relative' }}
          >
            {/* tooltip on hover */}
            {hov && (
              <div style={{
                position: 'absolute', bottom: h + 28, left: '50%', transform: 'translateX(-50%)',
                background: '#0f172a', color: '#fff', fontSize: 10, fontWeight: 700,
                padding: '5px 8px', borderRadius: 8, whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px #00000040', zIndex: 10,
                border: '1px solid #1e293b',
              }}>
                ৳{totalCollected(mk)}<br/>
                <span style={{ color: '#4ade80' }}>{paidN}</span>
                <span style={{ color: '#94a3b8' }}>/{total} paid</span>
              </div>
            )}
            <div style={{ fontSize: 9, color: hov ? '#0f172a' : '#6b7280', fontWeight: 700 }}>
              ৳{totalCollected(mk)}
            </div>
            <div style={{
              width: '100%', height: h,
              background: cur
                ? 'linear-gradient(180deg,#16a34a,#15803d)'
                : hov
                  ? 'linear-gradient(180deg,#4ade80,#16a34a)'
                  : '#86efac',
              borderRadius: '6px 6px 0 0',
              transition: 'height .5s, background .2s',
              boxShadow: hov ? '0 -4px 12px #16a34a40' : 'none',
            }} />
            <div style={{
              fontSize: 9,
              color: cur ? '#16a34a' : hov ? '#374151' : '#9ca3af',
              fontWeight: cur || hov ? 800 : 400
            }}>
              {mk.slice(5)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Month Detail Modal ────────────────────────────────────────────
function MonthModal({ mk, payments, members, expenses, extraDonations, totalCollected, onClose }) {
  if (!mk) return null
  const paidIds   = Object.keys((payments || {})[mk] || {})
  const paidM     = paidIds.map(id => members.find(m => m.id === id)).filter(Boolean)
  const unpaidM   = members.filter(m => !paidIds.includes(m.id))
  const monthExp  = (expenses || []).filter(e => e.date && e.date.slice(0, 7) === mk)
  const monthExtra = (extraDonations || []).filter(e => e.date && e.date.slice(0, 7) === mk)
  const totalExp  = monthExp.reduce((s, e) => s + e.amount, 0)
  const totalExtra = monthExtra.reduce((s, e) => s + e.amount, 0)

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.modal} onClick={e => e.stopPropagation()}>
        <div style={ms.header}>
          <div style={ms.title}>📅 {fmtMonth(mk)}</div>
          <button onClick={onClose} style={ms.closeBtn}>✕</button>
        </div>
        <div style={ms.body}>

          {/* summary */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <div style={ms.miniCard}>
              <div style={{ fontWeight: 900, color: '#16a34a', fontSize: 16 }}>৳{totalCollected(mk)}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Regular</div>
            </div>
            <div style={ms.miniCard}>
              <div style={{ fontWeight: 900, color: '#2563eb', fontSize: 16 }}>৳{totalExtra}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Extra</div>
            </div>
            <div style={ms.miniCard}>
              <div style={{ fontWeight: 900, color: '#dc2626', fontSize: 16 }}>৳{totalExp}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Expenses</div>
            </div>
          </div>

          {/* paid members */}
          {paidM.length > 0 && (
            <>
              <div style={ms.sectionTitle}>✅ Paid ({paidM.length})</div>
              {paidM.map(m => (
                <div key={m.id} style={ms.row}>
                  <span>{m.name}</span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>৳{DONATION_AMOUNT}</span>
                </div>
              ))}
            </>
          )}

          {/* unpaid members */}
          {unpaidM.length > 0 && (
            <>
              <div style={{ ...ms.sectionTitle, color: '#dc2626', marginTop: 10 }}>❌ Unpaid ({unpaidM.length})</div>
              {unpaidM.map(m => (
                <div key={m.id} style={ms.row}>
                  <span>{m.name}</span>
                  <span style={{ color: '#dc2626', fontWeight: 700 }}>Due</span>
                </div>
              ))}
            </>
          )}

          {/* extra donations */}
          {monthExtra.length > 0 && (
            <>
              <div style={{ ...ms.sectionTitle, color: '#2563eb', marginTop: 10 }}>➕ Extra Donations</div>
              {monthExtra.map(e => (
                <div key={e.id} style={ms.row}>
                  <span>{e.memberName} — {e.reason}</span>
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>৳{e.amount}</span>
                </div>
              ))}
            </>
          )}

          {/* expenses */}
          {monthExp.length > 0 && (
            <>
              <div style={{ ...ms.sectionTitle, color: '#ea580c', marginTop: 10 }}>💸 Expenses</div>
              {monthExp.map(e => (
                <div key={e.id} style={ms.row}>
                  <span>{e.description} <span style={{ fontSize: 11, color: '#9ca3af' }}>({e.category})</span></span>
                  <span style={{ color: '#dc2626', fontWeight: 700 }}>৳{e.amount}</span>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

const ms = {
  overlay:     { position: 'fixed', inset: 0, background: '#00000070', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 0' },
  modal:       { background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 430, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 40px #00000030' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px 12px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 },
  title:       { fontWeight: 900, fontSize: 16, color: '#0f172a' },
  closeBtn:    { background: '#f1f5f9', border: 'none', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#6b7280' },
  body:        { padding: '14px 18px 24px', overflowY: 'auto' },
  miniCard:    { flex: 1, background: '#f8fafc', borderRadius: 10, padding: '10px 6px', textAlign: 'center', border: '1px solid #e5e7eb' },
  sectionTitle:{ fontSize: 12, fontWeight: 800, color: '#16a34a', marginBottom: 6, letterSpacing: '0.3px' },
  row:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f8fafc', fontSize: 13, color: '#374151' },
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────
export default function Dashboard({
  members, payments, monthKeys, currentMonth,
  totalCollected, totalUnpaid,
  allTimeCollected, balance, allTimeExpenses,
  expenses, extraDonations, totalExtraDonations,
  setTab
}) {
  const [modalMonth, setModalMonth] = useState(null)

  const paid   = Object.keys((payments || {})[currentMonth] || {}).length
  const unpaid = members.length - paid
  const last6  = monthKeys.slice(-6)

  const yearMap = useMemo(() => {
    const m = {}
    monthKeys.forEach(mk => { const y = mk.slice(0, 4); m[y] = (m[y] || 0) + totalCollected(mk) })
    return m
  }, [payments, monthKeys])

  // yearly expenses breakdown
  const yearExpMap = useMemo(() => {
    const m = {}
    ;(expenses || []).forEach(e => {
      const y = e.date?.slice(0, 4)
      if (y) m[y] = (m[y] || 0) + e.amount
    })
    return m
  }, [expenses])

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Dashboard</h2>
        <span style={S.monthChip}>{fmtMonth(currentMonth)}</span>
      </div>

      {/* stat cards */}
      <div style={S.grid4}>
        <StatCard icon='💰' label='Collected'  val={`৳${totalCollected(currentMonth)}`} clr='#16a34a' bg='#f0fdf4' bdr='#bbf7d0' onClick={() => setTab('donations')} />
        <StatCard icon='⏳' label='Pending'    val={`৳${totalUnpaid(currentMonth)}`}    clr='#dc2626' bg='#fef2f2' bdr='#fecaca' onClick={() => setTab('donations')} />
        <StatCard icon='✅' label='Paid'       val={`${paid}/${members.length}`}        clr='#2563eb' bg='#eff6ff' bdr='#bfdbfe' onClick={() => setModalMonth(currentMonth)} />
        <StatCard icon='🏦' label='Balance'    val={`৳${balance}`}                      clr='#7c3aed' bg='#f5f3ff' bdr='#ddd6fe' />
      </div>

      {/* extra donations quick stat */}
      {totalExtraDonations > 0 && (
        <div
          onClick={() => setTab('extradonation')}
          style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 700 }}>➕ Extra Donations (All Time)</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#2563eb' }}>৳{totalExtraDonations}</span>
        </div>
      )}

      {/* clickable bar chart */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={S.cardTitle}>📈 Last 6 Months — Tap a bar for details</div>
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>Tap any bar to see full month breakdown</div>
        <BarChart
          last6={last6}
          totalCollected={totalCollected}
          currentMonth={currentMonth}
          payments={payments}
          members={members}
          onBarClick={(mk) => setModalMonth(mk)}
        />
      </div>

      {/* this month status */}
      <div style={S.card}>
        <div style={S.cardTitle}>👥 {fmtMonth(currentMonth)} — Status</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div
            onClick={() => setModalMonth(currentMonth)}
            style={{ flex: 1, background: '#f0fdf4', borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 26, fontWeight: 900, color: '#16a34a' }}>{paid}</div>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>✅ Paid — tap to view</div>
          </div>
          <div
            onClick={() => setModalMonth(currentMonth)}
            style={{ flex: 1, background: '#fef2f2', borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 26, fontWeight: 900, color: '#dc2626' }}>{unpaid}</div>
            <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>❌ Unpaid — tap to view</div>
          </div>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: '#e5e7eb', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${members.length ? (paid / members.length) * 100 : 0}%`, background: 'linear-gradient(90deg,#16a34a,#4ade80)', borderRadius: 99, transition: 'width .7s' }} />
        </div>
        <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'right', marginTop: 4 }}>
          {members.length ? Math.round((paid / members.length) * 100) : 0}% collection rate
        </div>
      </div>

      {/* fund overview */}
      <div style={S.card}>
        <div style={S.cardTitle}>💼 Fund Overview (All Time)</div>
        <Row label='Regular Donations' val={`৳${allTimeCollected - totalExtraDonations}`} />
        <Row label='Extra Donations'   val={`৳${totalExtraDonations}`} vc='#2563eb' />
        <Row label='Total Collected'   val={`৳${allTimeCollected}`} vc='#16a34a' bold />
        <Row label='Total Expenses'    val={`৳${allTimeExpenses}`}  vc='#dc2626' />
        <Row label='Balance'           val={`৳${balance}`}          vc='#7c3aed' bold />

        {/* yearly breakdown */}
        {Object.keys(yearMap).length > 0 && (
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', marginBottom: 8 }}>📅 Yearly Breakdown</div>
            {Object.keys(yearMap).sort((a, b) => b - a).map(y => (
              <div key={y}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0 2px', borderBottom: '1px solid #f9fafb' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Year {y}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>৳{yearMap[y]}</span>
                </div>
                {yearExpMap[y] && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 4px', paddingLeft: 10 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>└ Expenses {y}</span>
                    <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>- ৳{yearExpMap[y]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* month detail modal */}
      {modalMonth && (
        <MonthModal
          mk={modalMonth}
          payments={payments}
          members={members}
          expenses={expenses}
          extraDonations={extraDonations}
          totalCollected={totalCollected}
          onClose={() => setModalMonth(null)}
        />
      )}
    </div>
  )
}
