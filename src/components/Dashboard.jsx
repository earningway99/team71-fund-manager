// src/components/Dashboard.jsx
import { useMemo } from 'react'
import { fmtMonth, DONATION_AMOUNT } from '../constants'
import S from '../styles'

function StatCard({ icon, label, val, clr, bg, bdr }) {
  return (
    <div style={{ background: bg, borderRadius: 14, padding: '14px 8px', textAlign: 'center', border: `1.5px solid ${bdr}` }}>
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

export default function Dashboard({
  members, payments, monthKeys, currentMonth,
  totalCollected, totalUnpaid, allTimeCollected, balance, allTimeExpenses
}) {
  const paid   = Object.keys(payments[currentMonth] || {}).length
  const unpaid = members.length - paid
  const last6  = monthKeys.slice(-6)
  const maxC   = Math.max(...last6.map(mk => totalCollected(mk)), 100)

  const yearMap = useMemo(() => {
    const m = {}
    monthKeys.forEach(mk => { const y = mk.slice(0, 4); m[y] = (m[y] || 0) + totalCollected(mk) })
    return m
  }, [payments, monthKeys])

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Dashboard</h2>
        <span style={S.monthChip}>{fmtMonth(currentMonth)}</span>
      </div>

      {/* stat grid */}
      <div style={S.grid4}>
        <StatCard icon='💰' label='Collected' val={`৳${totalCollected(currentMonth)}`} clr='#16a34a' bg='#f0fdf4' bdr='#bbf7d0' />
        <StatCard icon='⏳' label='Pending'   val={`৳${totalUnpaid(currentMonth)}`}    clr='#dc2626' bg='#fef2f2' bdr='#fecaca' />
        <StatCard icon='✅' label='Paid'      val={`${paid}/${members.length}`}        clr='#2563eb' bg='#eff6ff' bdr='#bfdbfe' />
        <StatCard icon='🏦' label='Balance'   val={`৳${balance}`}                      clr='#7c3aed' bg='#f5f3ff' bdr='#ddd6fe' />
      </div>

      {/* bar chart */}
      <div style={S.card}>
        <div style={S.cardTitle}>📈 Last 6 Months Collection</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, paddingTop: 8 }}>
          {last6.map(mk => {
            const h   = Math.max((totalCollected(mk) / maxC) * 85, 3)
            const cur = mk === currentMonth
            return (
              <div key={mk} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 700 }}>৳{totalCollected(mk)}</div>
                <div style={{ width: '100%', height: h, background: cur ? '#16a34a' : '#86efac', borderRadius: '4px 4px 0 0', transition: 'height .5s' }} />
                <div style={{ fontSize: 9, color: cur ? '#16a34a' : '#9ca3af', fontWeight: cur ? 800 : 400 }}>{mk.slice(5)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* progress */}
      <div style={S.card}>
        <div style={S.cardTitle}>👥 {fmtMonth(currentMonth)} — Collection Status</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#16a34a' }}>{paid}</div>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>✅ Paid</div>
          </div>
          <div style={{ flex: 1, background: '#fef2f2', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#dc2626' }}>{unpaid}</div>
            <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>❌ Unpaid</div>
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
        <Row label='Total Collected' val={`৳${allTimeCollected}`} />
        <Row label='Total Expenses'  val={`৳${allTimeExpenses}`}  vc='#dc2626' />
        <Row label='Balance'         val={`৳${balance}`}          vc='#7c3aed' bold />
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Yearly Totals</div>
          {Object.entries(yearMap).sort((a, b) => b[0] - a[0]).map(([y, a]) => (
            <Row key={y} label={`Year ${y}`} val={`৳${a}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
