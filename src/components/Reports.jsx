// src/components/Reports.jsx
import { useState, useMemo } from 'react'
import { fmtMonth, nowMonthKey, DONATION_AMOUNT } from '../constants'
import S from '../styles'

function Row({label,val,vc='#111827',bold}){
  return(
    <div style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #f3f4f6'}}>
      <span style={{fontSize:13,color:'#6b7280'}}>{label}</span>
      <span style={{fontSize:13,fontWeight:bold?900:600,color:vc}}>{val}</span>
    </div>
  )
}

export default function Reports({ members,payments,monthKeys,expenses,extraDonations,totalCollected,allTimeCollected,balance }) {
  const [sel,setSel]=useState(nowMonthKey())

  const paidM  = Object.keys(payments[sel]||{}).map(id=>members.find(m=>m.id===id)).filter(Boolean)
  const unpaidM = members.filter(m=>!payments[sel]?.[m.id])

  const yearMap = useMemo(()=>{
    const r={}
    monthKeys.forEach(mk=>{const y=mk.slice(0,4);r[y]=(r[y]||0)+totalCollected(mk)})
    return r
  },[payments,monthKeys])

  const exportCSV=()=>{
    const rows=[['Member','Status','Amount','Payment Date']]
    members.forEach(m=>{
      const p=payments[sel]?.[m.id]
      rows.push([m.name,p?'Paid':'Unpaid',p?DONATION_AMOUNT:0,p?.date||'-'])
    })
    const csv=rows.map(r=>r.join(',')).join('\n')
    const a=document.createElement('a')
    a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}))
    a.download=`Team71_${sel}.csv`
    a.click(); a.remove()
  }

  return(
    <div style={S.page}>
      <div style={S.pageHead}><h2 style={S.pageTitle}>Reports</h2></div>

      <select value={sel} onChange={e=>setSel(e.target.value)} style={{...S.inp,marginBottom:12}}>
        {[...monthKeys].reverse().map(mk=><option key={mk} value={mk}>{fmtMonth(mk)}</option>)}
      </select>

      <div style={S.card}>
        <div style={S.cardTitle}>📋 {fmtMonth(sel)}</div>
        <Row label='Total Members'  val={members.length}/>
        <Row label='Paid'           val={paidM.length}   vc='#16a34a'/>
        <Row label='Unpaid'         val={unpaidM.length} vc='#dc2626'/>
        <Row label='Collected'      val={`৳${totalCollected(sel)}`}/>
        <Row label='Due'            val={`৳${unpaidM.length*DONATION_AMOUNT}`} vc='#dc2626'/>
        <Row label='Collection Rate' val={`${members.length?Math.round((paidM.length/members.length)*100):0}%`}/>
        <button onClick={exportCSV} style={{...S.primaryBtn,marginTop:10,background:'#2563eb'}}>⬇ Export CSV</button>
      </div>

      {unpaidM.length>0&&(
        <div style={{...S.card,border:'1.5px solid #fecaca'}}>
          <div style={S.cardTitle}>❌ Unpaid — {fmtMonth(sel)}</div>
          {unpaidM.map(m=>(
            <div key={m.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #fff5f5',fontSize:13}}>
              <span>{m.name}</span><span style={{color:'#dc2626',fontWeight:700}}>৳{DONATION_AMOUNT}</span>
            </div>
          ))}
        </div>
      )}

      {paidM.length>0&&(
        <div style={{...S.card,border:'1.5px solid #bbf7d0'}}>
          <div style={S.cardTitle}>✅ Paid — {fmtMonth(sel)}</div>
          {paidM.map(m=>(
            <div key={m.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f0fdf4',fontSize:13}}>
              <span>{m.name}</span><span style={{color:'#16a34a',fontWeight:700}}>৳{DONATION_AMOUNT} · {payments[sel]?.[m.id]?.date}</span>
            </div>
          ))}
        </div>
      )}

      <div style={S.card}>
        <div style={S.cardTitle}>📅 Yearly Summary</div>
        {Object.entries(yearMap).sort((a,b)=>b[0]-a[0]).map(([y,a])=>(
          <Row key={y} label={`Year ${y}`} val={`৳${a}`}/>
        ))}
        <Row label='All-Time Balance' val={`৳${balance}`} vc='#7c3aed' bold/>
      </div>
    </div>
  )
}
