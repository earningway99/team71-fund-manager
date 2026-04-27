// src/components/Dashboard.jsx — V4
import { useMemo, useState } from 'react'
import { fmtMonth, DONATION_AMOUNT } from '../constants'
import S from '../styles'

function Row({label,val,vc='#111827',bold}){
  return(
    <div style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #f3f4f6'}}>
      <span style={{fontSize:13,color:'#6b7280'}}>{label}</span>
      <span style={{fontSize:13,fontWeight:bold?900:600,color:vc}}>{val}</span>
    </div>
  )
}

function StatCard({icon,label,val,clr,bg,bdr,onClick}){
  return(
    <div onClick={onClick} style={{background:bg,borderRadius:14,padding:'14px 8px',textAlign:'center',border:`1.5px solid ${bdr}`,cursor:onClick?'pointer':'default',transition:'transform .15s'}}>
      <div style={{fontSize:20,marginBottom:3}}>{icon}</div>
      <div style={{fontSize:15,fontWeight:900,color:clr}}>{val}</div>
      <div style={{fontSize:11,color:'#6b7280',fontWeight:600}}>{label}</div>
      {onClick&&<div style={{fontSize:9,color:clr,opacity:.7,marginTop:2}}>tap →</div>}
    </div>
  )
}

function MonthModal({mk,payments,members,expenses,extraDonations,totalCollected,onClose}){
  if(!mk) return null
  const paidIds  = Object.keys((payments||{})[mk]||{})
  const paidM    = paidIds.map(id=>members.find(m=>m.id===id)).filter(Boolean)
  const unpaidM  = members.filter(m=>!paidIds.includes(m.id))
  const monthExp = (expenses||[]).filter(e=>e.date?.slice(0,7)===mk)
  const monthExtra=(extraDonations||[]).filter(e=>e.date?.slice(0,7)===mk)
  const totalExp = monthExp.reduce((s,e)=>s+e.amount,0)
  const totalEx  = monthExtra.reduce((s,e)=>s+e.amount,0)

  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'#00000070',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:'20px 20px 0 0',width:'100%',maxWidth:430,maxHeight:'80vh',display:'flex',flexDirection:'column',boxShadow:'0 -8px 40px #00000030'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 18px 12px',borderBottom:'1px solid #f1f5f9',flexShrink:0}}>
          <div style={{fontWeight:900,fontSize:16,color:'#0f172a'}}>📅 {fmtMonth(mk)}</div>
          <button onClick={onClose} style={{background:'#f1f5f9',border:'none',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontWeight:700,color:'#6b7280'}}>✕</button>
        </div>
        <div style={{overflowY:'auto',padding:'14px 18px 24px'}}>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            {[
              {l:'Collected',v:`৳${totalCollected(mk)}`,c:'#16a34a'},
              {l:'Extra',    v:`৳${totalEx}`,           c:'#2563eb'},
              {l:'Expenses', v:`৳${totalExp}`,          c:'#dc2626'},
            ].map(s=>(
              <div key={s.l} style={{flex:1,background:'#f8fafc',borderRadius:10,padding:'8px 4px',textAlign:'center',border:'1px solid #e5e7eb'}}>
                <div style={{fontWeight:900,color:s.c,fontSize:14}}>{s.v}</div>
                <div style={{fontSize:10,color:'#6b7280'}}>{s.l}</div>
              </div>
            ))}
          </div>
          {paidM.length>0&&(
            <>
              <div style={{fontSize:11,fontWeight:800,color:'#16a34a',marginBottom:6}}>✅ PAID ({paidM.length})</div>
              {paidM.map(m=>(
                <div key={m.id} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f9fafb',fontSize:12}}>
                  <span>{m.name}</span><span style={{color:'#16a34a',fontWeight:700}}>৳{DONATION_AMOUNT}</span>
                </div>
              ))}
            </>
          )}
          {unpaidM.length>0&&(
            <>
              <div style={{fontSize:11,fontWeight:800,color:'#dc2626',marginTop:10,marginBottom:6}}>❌ UNPAID ({unpaidM.length})</div>
              {unpaidM.map(m=>(
                <div key={m.id} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #fff5f5',fontSize:12}}>
                  <span>{m.name}</span><span style={{color:'#dc2626',fontWeight:700}}>Due</span>
                </div>
              ))}
            </>
          )}
          {monthExtra.length>0&&(
            <>
              <div style={{fontSize:11,fontWeight:800,color:'#2563eb',marginTop:10,marginBottom:6}}>➕ EXTRA DONATIONS</div>
              {monthExtra.map(e=>(
                <div key={e.id} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f0f9ff',fontSize:12}}>
                  <span>{e.memberName} — {e.reason}</span><span style={{color:'#2563eb',fontWeight:700}}>৳{e.amount}</span>
                </div>
              ))}
            </>
          )}
          {monthExp.length>0&&(
            <>
              <div style={{fontSize:11,fontWeight:800,color:'#ea580c',marginTop:10,marginBottom:6}}>💸 EXPENSES</div>
              {monthExp.map(e=>(
                <div key={e.id} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #fff7ed',fontSize:12}}>
                  <span>{e.description} ({e.category})</span><span style={{color:'#dc2626',fontWeight:700}}>৳{e.amount}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({
  members,payments,monthKeys,currentMonth,
  totalCollected,totalUnpaid,
  allTimeCollected,balance,allTimeExpenses,
  expenses,extraDonations,totalExtraDonations,
  setTab
}){
  const [modalMk,setModalMk]=useState(null)
  const paid   = Object.keys((payments||{})[currentMonth]||{}).length
  const unpaid = members.length - paid
  const last6  = monthKeys.slice(-6)
  const maxC   = Math.max(...last6.map(mk=>totalCollected(mk)),100)

  const yearMap=useMemo(()=>{
    const m={}
    monthKeys.forEach(mk=>{const y=mk.slice(0,4);m[y]=(m[y]||0)+totalCollected(mk)})
    return m
  },[payments,monthKeys])

  const yearExpMap=useMemo(()=>{
    const m={}
    ;(expenses||[]).forEach(e=>{const y=e.date?.slice(0,4);if(y)m[y]=(m[y]||0)+e.amount})
    return m
  },[expenses])

  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Dashboard</h2>
        <span style={S.monthChip}>{fmtMonth(currentMonth)}</span>
      </div>

      <div style={S.grid4}>
        <StatCard icon='💰' label='Collected' val={`৳${totalCollected(currentMonth)}`} clr='#16a34a' bg='#f0fdf4' bdr='#bbf7d0' onClick={()=>setTab('donations')}/>
        <StatCard icon='⏳' label='Pending'   val={`৳${totalUnpaid(currentMonth)}`}    clr='#dc2626' bg='#fef2f2' bdr='#fecaca' onClick={()=>setTab('donations')}/>
        <StatCard icon='✅' label='Paid'      val={`${paid}/${members.length}`}        clr='#2563eb' bg='#eff6ff' bdr='#bfdbfe' onClick={()=>setModalMk(currentMonth)}/>
        <StatCard icon='🏦' label='Balance'   val={`৳${balance}`}                      clr='#7c3aed' bg='#f5f3ff' bdr='#ddd6fe'/>
      </div>

      {totalExtraDonations>0&&(
        <div onClick={()=>setTab('extradonation')} style={{background:'#eff6ff',border:'1.5px solid #bfdbfe',borderRadius:12,padding:'10px 14px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}}>
          <span style={{fontSize:13,color:'#2563eb',fontWeight:700}}>➕ Extra Donations (All Time)</span>
          <span style={{fontSize:15,fontWeight:900,color:'#2563eb'}}>৳{totalExtraDonations}</span>
        </div>
      )}

      {/* clickable bar chart */}
      <div style={S.card}>
        <div style={S.cardTitle}>📈 Last 6 Months — tap a bar for details</div>
        <div style={{fontSize:10,color:'#9ca3af',marginBottom:6}}>Tap any bar to see full month breakdown</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:6,height:100,paddingTop:8}}>
          {last6.map(mk=>{
            const h=Math.max((totalCollected(mk)/maxC)*85,4), cur=mk===currentMonth
            return(
              <div key={mk} onClick={()=>setModalMk(mk)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer'}}>
                <div style={{fontSize:9,color:'#6b7280',fontWeight:700}}>৳{totalCollected(mk)}</div>
                <div style={{width:'100%',height:h,background:cur?'linear-gradient(180deg,#16a34a,#15803d)':'#86efac',borderRadius:'4px 4px 0 0',transition:'height .5s'}}/>
                <div style={{fontSize:9,color:cur?'#16a34a':'#9ca3af',fontWeight:cur?800:400}}>{mk.slice(5)}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>👥 {fmtMonth(currentMonth)} — Status</div>
        <div style={{display:'flex',gap:10,marginBottom:10}}>
          <div onClick={()=>setModalMk(currentMonth)} style={{flex:1,background:'#f0fdf4',borderRadius:10,padding:'10px 8px',textAlign:'center',cursor:'pointer'}}>
            <div style={{fontSize:26,fontWeight:900,color:'#16a34a'}}>{paid}</div>
            <div style={{fontSize:11,color:'#16a34a',fontWeight:700}}>✅ Paid · tap</div>
          </div>
          <div onClick={()=>setModalMk(currentMonth)} style={{flex:1,background:'#fef2f2',borderRadius:10,padding:'10px 8px',textAlign:'center',cursor:'pointer'}}>
            <div style={{fontSize:26,fontWeight:900,color:'#dc2626'}}>{unpaid}</div>
            <div style={{fontSize:11,color:'#dc2626',fontWeight:700}}>❌ Unpaid · tap</div>
          </div>
        </div>
        <div style={{height:10,borderRadius:99,background:'#e5e7eb',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${members.length?(paid/members.length)*100:0}%`,background:'linear-gradient(90deg,#16a34a,#4ade80)',borderRadius:99,transition:'width .7s'}}/>
        </div>
        <div style={{fontSize:11,color:'#6b7280',textAlign:'right',marginTop:4}}>
          {members.length?Math.round((paid/members.length)*100):0}% collection rate
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>💼 Fund Overview (All Time)</div>
        <Row label='Regular Donations' val={`৳${allTimeCollected-totalExtraDonations}`}/>
        <Row label='Extra Donations'   val={`৳${totalExtraDonations}`} vc='#2563eb'/>
        <Row label='Total Collected'   val={`৳${allTimeCollected}`}    vc='#16a34a' bold/>
        <Row label='Total Expenses'    val={`৳${allTimeExpenses}`}     vc='#dc2626'/>
        <Row label='Balance'           val={`৳${balance}`}             vc='#7c3aed' bold/>
        <div style={{borderTop:'1px solid #f1f5f9',paddingTop:8,marginTop:6}}>
          <div style={{fontSize:12,fontWeight:800,color:'#374151',marginBottom:8}}>📅 Yearly Breakdown</div>
          {Object.keys(yearMap).sort((a,b)=>b-a).map(y=>(
            <div key={y}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0 2px',fontSize:12}}>
                <span style={{fontWeight:700,color:'#374151'}}>Year {y}</span>
                <span style={{fontWeight:700,color:'#16a34a'}}>৳{yearMap[y]}</span>
              </div>
              {yearExpMap[y]&&(
                <div style={{display:'flex',justifyContent:'space-between',padding:'1px 0 4px',paddingLeft:10,fontSize:11}}>
                  <span style={{color:'#9ca3af'}}>└ Expenses</span>
                  <span style={{color:'#dc2626',fontWeight:600}}>- ৳{yearExpMap[y]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalMk&&<MonthModal mk={modalMk} payments={payments} members={members} expenses={expenses} extraDonations={extraDonations} totalCollected={totalCollected} onClose={()=>setModalMk(null)}/>}
    </div>
  )
}
