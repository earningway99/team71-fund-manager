// src/components/MyPayments.jsx
import { fmtMonth, DONATION_AMOUNT } from '../constants'
import S from '../styles'

export default function MyPayments({ authUser, payments, monthKeys }) {
  const myPaid = monthKeys.filter(mk => payments[mk]?.[authUser?.id])
  const total  = myPaid.length * DONATION_AMOUNT

  return (
    <div style={S.page}>
      <div style={S.pageHead}><h2 style={S.pageTitle}>My Payments</h2></div>

      {/* hero card */}
      <div style={{ ...S.card, background: 'linear-gradient(135deg,#0f172a,#134e4a)', border: 'none', marginBottom: 14 }}>
        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{authUser?.name}</div>
        <div style={{ color: '#4ade80', fontSize: 28, fontWeight: 900 }}>৳{total}</div>
        <div style={{ color: '#86efac', fontSize: 13 }}>Total contributed to date</div>
        <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
          <span style={{ color: '#4ade80', fontSize: 13 }}>✅ {myPaid.length} months paid</span>
          <span style={{ color: '#f87171', fontSize: 13 }}>❌ {monthKeys.length - myPaid.length} pending</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...monthKeys].reverse().map(mk => {
          const p = payments[mk]?.[authUser?.id]
          return (
            <div
              key={mk}
              style={{ ...S.mRow, border: `1.5px solid ${p ? '#bbf7d0' : '#fecaca'}`, background: p ? '#f0fdf4' : '#fff' }}
            >
              <div style={{ ...S.ava, background: p ? '#16a34a' : '#ef4444', color: '#fff' }}>
                {p ? '✓' : '✗'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{fmtMonth(mk)}</div>
                {p
                  ? <div style={{ fontSize: 11, color: '#6b7280' }}>Paid on {p.date}</div>
                  : <div style={{ fontSize: 11, color: '#dc2626' }}>৳{DONATION_AMOUNT} due</div>
                }
              </div>
              {p
                ? <span style={S.badgeGreen}>৳{DONATION_AMOUNT}</span>
                : <span style={S.badgeRed}>Pending</span>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
