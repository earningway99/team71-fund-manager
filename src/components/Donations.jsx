// src/components/Donations.jsx
import { useState } from 'react'
import { fmtMonth, nowMonthKey, DONATION_AMOUNT } from '../constants'
import S from '../styles'

export default function Donations({
  members, payments, monthKeys, currentMonth,
  savePayments, role, currentMember,
  totalCollected, totalUnpaid, showToast
}) {
  const [selMonth, setSelMonth] = useState(currentMonth)
  const [search,   setSearch]   = useState('')
  const [busy,     setBusy]     = useState(false)

  const isPaid=(id,mk)=>!!(payments[mk]&&payments[mk][id])

  const toggle=async(memberId,mk)=>{
    if(busy) return
    setBusy(true)
    const updated = {...payments,[mk]:{...(payments[mk]||{})}}
    if(updated[mk][memberId]){
      delete updated[mk][memberId]
      showToast('Marked as unpaid','warn')
    } else {
      updated[mk][memberId]={date:new Date().toISOString().slice(0,10),amount:DONATION_AMOUNT,recordedAt:new Date().toISOString()}
      showToast('Payment saved ☁')
    }
    await savePayments(updated)
    setBusy(false)
  }

  // members can only see their own row
  const visible = role==='member'
    ? members.filter(m=> m.id===currentMember?.id)
    : members.filter(m=> m.name?.toLowerCase().includes(search.toLowerCase()))

  const paidCount = Object.keys(payments[selMonth]||{}).length

  return(
    <div style={S.page}>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Donations</h2></div>

      <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{...S.inp,marginBottom:10}}>
        {[...monthKeys].reverse().map(mk=><option key={mk} value={mk}>{fmtMonth(mk)}</option>)}
      </select>

      {role==='admin' && (
        <input placeholder='🔍 Search member…' value={search} onChange={e=>setSearch(e.target.value)} style={{...S.inp,marginBottom:10}}/>
      )}

      <div style={{display:'flex',gap:8,marginBottom:14}}>
        {[
          {l:'Collected',v:`৳${totalCollected(selMonth)}`,c:'#16a34a',bg:'#f0fdf4'},
          {l:'Pending',  v:`৳${totalUnpaid(selMonth)}`,  c:'#dc2626',bg:'#fef2f2'},
          {l:'Paid',     v:`${paidCount}/${members.length}`,c:'#2563eb',bg:'#eff6ff'},
        ].map(s=>(
          <div key={s.l} style={{flex:1,background:s.bg,borderRadius:10,padding:'8px 4px',textAlign:'center'}}>
            <div style={{fontWeight:800,color:s.c,fontSize:13}}>{s.v}</div>
            <div style={{fontSize:10,color:'#6b7280'}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {visible.map(m=>{
          const paid=isPaid(m.id,selMonth)
          const info=payments[selMonth]?.[m.id]
          return(
            <div key={m.id} style={{...S.mRow,border:`1.5px solid ${paid?'#bbf7d0':'#fecaca'}`,background:paid?'#f0fdf4':'#fff',opacity:busy?.6:1}}>
              <div style={{...S.ava,background:paid?'#16a34a':'#ef4444',color:'#fff'}}>{paid?'✓':m.name?.charAt(0)}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{m.name}</div>
                <div style={{fontSize:11,color:'#6b7280'}}>
                  {paid?`Paid ${info?.date} · ৳${info?.amount}`:`৳${DONATION_AMOUNT} due`}
                </div>
              </div>
              {paid?(
                <>
                  <span style={S.badgeGreen}>✅ Paid</span>
                  {role==='admin' && <button onClick={()=>toggle(m.id,selMonth)} disabled={busy} style={S.undoBtn}>Undo</button>}
                </>
              ):role==='admin'?(
                <button onClick={()=>toggle(m.id,selMonth)} disabled={busy} style={S.markBtn}>
                  {busy?'…':'Mark Paid'}
                </button>
              ):(
                <span style={S.badgeRed}>❌ Due</span>
              )}
            </div>
          )
        })}
        {visible.length===0 && <div style={S.empty}>No members found.</div>}
      </div>
    </div>
  )
}
