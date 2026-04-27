// src/components/MyPayments.jsx
import { fmtMonth, DONATION_AMOUNT } from '../constants'
import S from '../styles'

export default function MyPayments({ currentMember, authUser, payments, monthKeys }) {
  // currentMember is already resolved by App.jsx using UID or email
  const member   = currentMember
  const memberId = member?.id

  const myPaid = monthKeys.filter(mk => payments[mk]?.[memberId])
  const total  = myPaid.length * DONATION_AMOUNT
  const pending = monthKeys.length - myPaid.length

  if(!member) {
    return(
      <div style={S.page}>
        <h2 style={S.pageTitle}>My Payments</h2>
        <div style={{background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:14,padding:20,textAlign:'center',marginTop:20}}>
          <div style={{fontSize:32,marginBottom:10}}>⚠️</div>
          <div style={{fontWeight:800,fontSize:15,color:'#dc2626',marginBottom:8}}>Account Not Linked</div>
          <div style={{fontSize:13,color:'#6b7280',lineHeight:1.7}}>
            Your account is not linked to a member record yet.<br/>
            Please ask your admin to link your Firebase UID in the Members tab.
          </div>
          <div style={{marginTop:12,background:'#fff',borderRadius:10,padding:'10px 12px',fontSize:12,color:'#374151',textAlign:'left'}}>
            <div style={{fontWeight:700,marginBottom:4}}>Your details to give admin:</div>
            <div style={{fontFamily:'monospace',wordBreak:'break-all',color:'#2563eb',fontSize:11}}>{authUser?.email}</div>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>My Payments</h2>
      </div>

      {/* hero card */}
      <div style={{...S.card,background:'linear-gradient(135deg,#0f172a,#134e4a)',border:'none',marginBottom:14}}>
        <div style={{color:'#94a3b8',fontSize:12,marginBottom:4}}>{member.name}</div>
        <div style={{color:'#4ade80',fontSize:28,fontWeight:900}}>৳{total}</div>
        <div style={{color:'#86efac',fontSize:13}}>Total contributed to date</div>
        <div style={{display:'flex',gap:14,marginTop:10}}>
          <span style={{color:'#4ade80',fontSize:13}}>✅ {myPaid.length} months paid</span>
          <span style={{color:'#f87171',fontSize:13}}>❌ {pending} pending</span>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {[...monthKeys].reverse().map(mk=>{
          const p = payments[mk]?.[memberId]
          return(
            <div key={mk} style={{...S.mRow,border:`1.5px solid ${p?'#bbf7d0':'#fecaca'}`,background:p?'#f0fdf4':'#fff'}}>
              <div style={{...S.ava,background:p?'#16a34a':'#ef4444',color:'#fff'}}>{p?'✓':'✗'}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{fmtMonth(mk)}</div>
                {p
                  ? <div style={{fontSize:11,color:'#6b7280'}}>Paid on {p.date}</div>
                  : <div style={{fontSize:11,color:'#dc2626'}}>৳{DONATION_AMOUNT} due</div>
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
