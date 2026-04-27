// src/components/Expenses.jsx — V4
import { useState, useMemo } from 'react'
import { EXPENSE_CATEGORIES } from '../constants'
import S from '../styles'

const CAT_COLORS = {Food:'#16a34a',Transport:'#2563eb',Event:'#7c3aed',Equipment:'#ea580c',Maintenance:'#0891b2',Other:'#64748b'}

function Row({label,val,vc='#e2e8f0',bold}){
  return(
    <div style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #1e293b'}}>
      <span style={{fontSize:13,color:'#94a3b8'}}>{label}</span>
      <span style={{fontSize:13,fontWeight:bold?900:600,color:vc}}>{val}</span>
    </div>
  )
}

const blank=()=>({description:'',amount:'',date:new Date().toISOString().slice(0,10),category:'Other',allowNeg:false})

export default function Expenses({expenses,saveExpenses,balance,allTimeCollected,showToast,viewOnly}){
  const [form,      setForm]      = useState(blank())
  const [open,      setOpen]      = useState(false)
  const [busy,      setBusy]      = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [viewYear,  setViewYear]  = useState(String(new Date().getFullYear()))

  const totalSpent = expenses.reduce((s,e)=>s+e.amount,0)

  const yearlyData = useMemo(()=>{
    const m={}
    expenses.forEach(e=>{
      const y=e.date?.slice(0,4)||'Unknown'
      if(!m[y])m[y]={total:0,items:[],categories:{}}
      m[y].total+=e.amount
      m[y].items.push(e)
      m[y].categories[e.category]=(m[y].categories[e.category]||0)+e.amount
    })
    return m
  },[expenses])

  const catData = useMemo(()=>{
    const m={}
    expenses.forEach(e=>{m[e.category]=(m[e.category]||0)+e.amount})
    return m
  },[expenses])
  const catTotal = Object.values(catData).reduce((s,v)=>s+v,0)
  const years = Object.keys(yearlyData).sort((a,b)=>b-a)

  const save=async()=>{
    const amt=parseFloat(form.amount)
    if(!form.description.trim()||!amt||amt<=0){showToast('Fill all fields','warn');return}
    if(amt>balance&&!form.allowNeg){showToast('Enable "Allow negative balance" to proceed','warn');return}
    setBusy(true)
    const updated=[...expenses,{id:String(Date.now()),...form,amount:amt}]
    await saveExpenses(updated)
    setBusy(false)
    setForm(blank()); setOpen(false)
    showToast('Expense saved ☁')
  }

  const del=async(id)=>{
    if(!window.confirm('Delete this expense?'))return
    setBusy(true)
    await saveExpenses(expenses.filter(e=>e.id!==id))
    setBusy(false)
    showToast('Deleted','warn')
  }

  return(
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Expenses</h2>
        {!viewOnly && <button onClick={()=>setOpen(!open)} style={S.addBtn}>{open?'✕ Close':'+ Add'}</button>}
      </div>

      <div style={{...S.card,background:'linear-gradient(135deg,#0f172a,#134e4a)',border:'none',marginBottom:14}}>
        <Row label='Total Collected' val={`৳${allTimeCollected}`}/>
        <Row label='Total Spent'     val={`৳${totalSpent}`}       vc='#f87171'/>
        <Row label='Balance'         val={`৳${balance}`}          vc={balance<0?'#f87171':'#4ade80'} bold/>
      </div>

      {open && !viewOnly && (
        <div style={S.formCard}>
          <div style={S.cardTitle}>💸 Record Expense</div>
          <input placeholder='Description *' value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={S.inp}/>
          <input type='number' placeholder='Amount (৳) *' value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={S.inp}/>
          <input type='date' value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={S.inp}/>
          <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={S.inp}>
            {EXPENSE_CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          {parseFloat(form.amount)>balance&&balance>=0&&(
            <div style={{background:'#fef3c7',border:'1.5px solid #fcd34d',borderRadius:10,padding:'10px 12px',marginBottom:8}}>
              <div style={{fontSize:12,color:'#92400e',fontWeight:700,marginBottom:6}}>⚠️ Amount exceeds balance by ৳{parseFloat(form.amount||0)-balance}</div>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                <div onClick={()=>setForm(p=>({...p,allowNeg:!p.allowNeg}))} style={{width:36,height:20,borderRadius:99,background:form.allowNeg?'#dc2626':'#e5e7eb',position:'relative',transition:'.2s',cursor:'pointer'}}>
                  <div style={{width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',top:2,left:form.allowNeg?18:2,transition:'.2s',boxShadow:'0 1px 4px #00000030'}}/>
                </div>
                <span style={{fontSize:12,color:'#92400e',fontWeight:700}}>Allow negative balance</span>
              </label>
            </div>
          )}
          {balance<0&&(
            <div style={{background:'#fee2e2',border:'1.5px solid #fecaca',borderRadius:10,padding:'8px 12px',marginBottom:8}}>
              <div style={{fontSize:11,color:'#dc2626',fontWeight:700}}>⚠️ Balance already negative — expense will be added</div>
            </div>
          )}
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={busy} style={{...S.primaryBtn,background:'#dc2626'}}>{busy?'Saving…':'Record'}</button>
            <button onClick={()=>setOpen(false)} style={S.secondaryBtn}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:6,marginBottom:14}}>
        {[{id:'list',l:'📋 List'},{id:'yearly',l:'📅 Yearly'},{id:'category',l:'🏷️ Category'}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:'8px 4px',borderRadius:10,border:'none',fontSize:12,fontWeight:700,background:activeTab===t.id?'#0f172a':'#f1f5f9',color:activeTab===t.id?'#fff':'#6b7280',cursor:'pointer',fontFamily:'inherit'}}>{t.l}</button>
        ))}
      </div>

      {activeTab==='list'&&(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[...expenses].reverse().map(e=>(
            <div key={e.id} style={{...S.mRow,border:'1.5px solid #fecaca',opacity:busy?.6:1}}>
              <div style={{...S.ava,background:`${CAT_COLORS[e.category]||'#64748b'}20`,color:CAT_COLORS[e.category]||'#64748b',fontWeight:900}}>{e.category?.charAt(0)||'?'}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{e.description}</div>
                <div style={{fontSize:11,color:'#6b7280'}}>{e.date} · {e.category}</div>
              </div>
              <span style={{fontWeight:800,color:'#dc2626',marginRight:6}}>৳{e.amount}</span>
              {!viewOnly&&<button onClick={()=>del(e.id)} disabled={busy} style={S.iconBtn}>🗑️</button>}
            </div>
          ))}
          {expenses.length===0&&<div style={S.empty}>No expenses recorded yet.</div>}
        </div>
      )}

      {activeTab==='yearly'&&(
        <div>
          {years.length>0&&<select value={viewYear} onChange={e=>setViewYear(e.target.value)} style={{...S.inp,marginBottom:12}}>
            {years.map(y=><option key={y} value={y}>{y}</option>)}
          </select>}
          {yearlyData[viewYear]?(
            <>
              <div style={S.card}>
                <div style={S.cardTitle}>📅 Year {viewYear} Summary</div>
                <div style={{display:'flex',gap:8,marginBottom:10}}>
                  <div style={{flex:1,background:'#fef2f2',borderRadius:10,padding:'10px 8px',textAlign:'center'}}>
                    <div style={{fontWeight:900,fontSize:18,color:'#dc2626'}}>৳{yearlyData[viewYear].total}</div>
                    <div style={{fontSize:11,color:'#6b7280'}}>Total Spent</div>
                  </div>
                  <div style={{flex:1,background:'#f0fdf4',borderRadius:10,padding:'10px 8px',textAlign:'center'}}>
                    <div style={{fontWeight:900,fontSize:18,color:'#16a34a'}}>{yearlyData[viewYear].items.length}</div>
                    <div style={{fontSize:11,color:'#6b7280'}}>Transactions</div>
                  </div>
                </div>
                {Object.entries(yearlyData[viewYear].categories).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
                  const pct=yearlyData[viewYear].total?Math.round((amt/yearlyData[viewYear].total)*100):0
                  return(
                    <div key={cat} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:12,fontWeight:700,marginBottom:3}}>
                        <span style={{color:CAT_COLORS[cat]||'#64748b'}}>● {cat}</span>
                        <span>৳{amt} ({pct}%)</span>
                      </div>
                      <div style={{height:7,borderRadius:99,background:'#f1f5f9',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${pct}%`,background:CAT_COLORS[cat]||'#64748b',borderRadius:99}}/>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {yearlyData[viewYear].items.sort((a,b)=>b.date?.localeCompare(a.date)).map(e=>(
                  <div key={e.id} style={{...S.mRow,border:`1.5px solid ${CAT_COLORS[e.category]||'#e5e7eb'}33`}}>
                    <div style={{...S.ava,background:`${CAT_COLORS[e.category]||'#64748b'}15`,color:CAT_COLORS[e.category]||'#64748b',fontWeight:900}}>{e.category?.charAt(0)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13}}>{e.description}</div>
                      <div style={{fontSize:11,color:'#6b7280'}}>{e.date} · {e.category}</div>
                    </div>
                    <span style={{fontWeight:800,color:'#dc2626'}}>৳{e.amount}</span>
                  </div>
                ))}
              </div>
            </>
          ):<div style={S.empty}>No expenses for {viewYear}.</div>}
        </div>
      )}

      {activeTab==='category'&&(
        <div style={S.card}>
          <div style={S.cardTitle}>🏷️ Spending by Category — All Time</div>
          <div style={{fontWeight:800,color:'#dc2626',fontSize:16,marginBottom:12}}>৳{catTotal} total</div>
          {Object.entries(catData).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
            const pct=catTotal?Math.round((amt/catTotal)*100):0
            return(
              <div key={cat} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:700,marginBottom:4}}>
                  <span style={{color:CAT_COLORS[cat]||'#64748b'}}>● {cat}</span>
                  <span>৳{amt} <span style={{color:'#9ca3af',fontWeight:400}}>({pct}%)</span></span>
                </div>
                <div style={{height:10,borderRadius:99,background:'#f1f5f9',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:CAT_COLORS[cat]||'#64748b',borderRadius:99,transition:'width .6s ease'}}/>
                </div>
              </div>
            )
          })}
          {Object.keys(catData).length===0&&<div style={S.empty}>No data yet.</div>}
        </div>
      )}
    </div>
  )
}
