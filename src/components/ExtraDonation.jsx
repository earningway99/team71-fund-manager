// src/components/ExtraDonation.jsx — V4
import { useState, useMemo } from 'react'
import { EXTRA_REASONS } from '../constants'
import S from '../styles'

const blank=()=>({memberId:'',amount:'',reason:'Voluntary',note:'',date:new Date().toISOString().slice(0,10)})

export default function ExtraDonation({
  members, extraDonations, saveExtraDonations,
  totalExtraDonations, showToast, viewOnly
}){
  const [form,   setForm]   = useState(blank())
  const [open,   setOpen]   = useState(false)
  const [busy,   setBusy]   = useState(false)
  const [filter, setFilter] = useState('all')

  const save=async()=>{
    const amt=parseFloat(form.amount)
    if(!form.memberId){showToast('Select a member','warn');return}
    if(!amt||amt<=0){showToast('Enter valid amount','warn');return}
    setBusy(true)
    const member=members.find(m=>m.id===form.memberId)
    const updated=[...extraDonations,{
      id:String(Date.now()),
      memberId:form.memberId,
      memberName:member?.name||form.memberId,
      amount:amt, reason:form.reason,
      note:form.note, date:form.date,
    }]
    await saveExtraDonations(updated)
    setBusy(false)
    setForm(blank()); setOpen(false)
    showToast('Extra donation saved ☁')
  }

  const del=async(id)=>{
    if(!window.confirm('Delete this record?'))return
    setBusy(true)
    await saveExtraDonations(extraDonations.filter(e=>e.id!==id))
    setBusy(false)
    showToast('Deleted','warn')
  }

  const byMember=useMemo(()=>{
    const m={}
    extraDonations.forEach(e=>{
      if(!m[e.memberName])m[e.memberName]={total:0,items:[]}
      m[e.memberName].total+=e.amount
      m[e.memberName].items.push(e)
    })
    return m
  },[extraDonations])

  const byReason=useMemo(()=>{
    const m={}
    extraDonations.forEach(e=>{
      if(!m[e.reason])m[e.reason]={total:0,items:[]}
      m[e.reason].total+=e.amount
      m[e.reason].items.push(e)
    })
    return m
  },[extraDonations])

  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Extra Donations</h2>
        {!viewOnly&&<button onClick={()=>setOpen(!open)} style={S.addBtn}>{open?'✕ Close':'+ Add'}</button>}
      </div>

      <div style={{background:'linear-gradient(135deg,#1e3a5f,#1e40af)',borderRadius:14,padding:16,marginBottom:14}}>
        <div style={{color:'#93c5fd',fontSize:12,marginBottom:4}}>Total Extra Donations</div>
        <div style={{color:'#fff',fontSize:28,fontWeight:900}}>৳{totalExtraDonations}</div>
        <div style={{color:'#bfdbfe',fontSize:12,marginTop:4}}>{extraDonations.length} records</div>
      </div>

      {open&&!viewOnly&&(
        <div style={S.formCard}>
          <div style={S.cardTitle}>➕ Add Extra Donation</div>
          <select value={form.memberId} onChange={e=>setForm(p=>({...p,memberId:e.target.value}))} style={S.inp}>
            <option value=''>— Select Member —</option>
            {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input type='number' placeholder='Amount (৳) *' value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={S.inp}/>
          <select value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} style={S.inp}>
            {EXTRA_REASONS.map(r=><option key={r}>{r}</option>)}
          </select>
          <input placeholder='Note (optional)' value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} style={S.inp}/>
          <input type='date' value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={S.inp}/>
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={busy} style={{...S.primaryBtn,background:'#2563eb'}}>{busy?'Saving…':'Save'}</button>
            <button onClick={()=>setOpen(false)} style={S.secondaryBtn}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:6,marginBottom:14}}>
        {[{id:'all',l:'📋 All'},{id:'byMember',l:'👤 Member'},{id:'byReason',l:'🏷️ Reason'}].map(t=>(
          <button key={t.id} onClick={()=>setFilter(t.id)} style={{flex:1,padding:'8px 4px',borderRadius:10,border:'none',fontSize:12,fontWeight:700,background:filter===t.id?'#1e40af':'#f1f5f9',color:filter===t.id?'#fff':'#6b7280',cursor:'pointer',fontFamily:'inherit'}}>{t.l}</button>
        ))}
      </div>

      {filter==='all'&&(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[...extraDonations].reverse().map(e=>(
            <div key={e.id} style={{...S.mRow,border:'1.5px solid #bfdbfe',opacity:busy?.6:1}}>
              <div style={{...S.ava,background:'#dbeafe',color:'#2563eb',fontWeight:900}}>{e.memberName?.charAt(0)}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{e.memberName}</div>
                <div style={{fontSize:11,color:'#6b7280'}}>{e.date} · {e.reason}{e.note?` · ${e.note}`:''}</div>
              </div>
              <span style={{fontWeight:800,color:'#2563eb',marginRight:6}}>৳{e.amount}</span>
              {!viewOnly&&<button onClick={()=>del(e.id)} disabled={busy} style={S.iconBtn}>🗑️</button>}
            </div>
          ))}
          {extraDonations.length===0&&<div style={S.empty}>No extra donations yet.</div>}
        </div>
      )}

      {filter==='byMember'&&(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {Object.entries(byMember).sort((a,b)=>b[1].total-a[1].total).map(([name,data])=>(
            <div key={name} style={S.card}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <div style={{fontWeight:800,fontSize:14}}>{name}</div>
                <div style={{fontWeight:900,color:'#2563eb'}}>৳{data.total}</div>
              </div>
              {data.items.map(e=>(
                <div key={e.id} style={{display:'flex',justifyContent:'space-between',fontSize:12,padding:'4px 0',borderBottom:'1px solid #f1f5f9',color:'#6b7280'}}>
                  <span>{e.date} · {e.reason}</span>
                  <span style={{fontWeight:700,color:'#374151'}}>৳{e.amount}</span>
                </div>
              ))}
            </div>
          ))}
          {Object.keys(byMember).length===0&&<div style={S.empty}>No records yet.</div>}
        </div>
      )}

      {filter==='byReason'&&(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {Object.entries(byReason).sort((a,b)=>b[1].total-a[1].total).map(([reason,data])=>(
            <div key={reason} style={S.card}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <div style={{fontWeight:800,fontSize:14}}>🏷️ {reason}</div>
                <div style={{fontWeight:900,color:'#2563eb'}}>৳{data.total}</div>
              </div>
              {data.items.map(e=>(
                <div key={e.id} style={{display:'flex',justifyContent:'space-between',fontSize:12,padding:'4px 0',borderBottom:'1px solid #f1f5f9',color:'#6b7280'}}>
                  <span>{e.memberName} · {e.date}</span>
                  <span style={{fontWeight:700,color:'#374151'}}>৳{e.amount}</span>
                </div>
              ))}
            </div>
          ))}
          {Object.keys(byReason).length===0&&<div style={S.empty}>No records yet.</div>}
        </div>
      )}
    </div>
  )
}
