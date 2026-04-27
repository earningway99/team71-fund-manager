// src/components/Members.jsx
// V4 — Admin can link a member's Firebase UID when adding/editing
// This is how members see their own payments after login
import { useState } from 'react'
import S from '../styles'

const blank = ()=>({name:'',email:'',joinDate:new Date().toISOString().slice(0,10),uid:''})

export default function Members({ members, saveMembers, showToast }) {
  const [form,   setForm]   = useState(blank())
  const [editId, setEditId] = useState(null)
  const [open,   setOpen]   = useState(false)
  const [busy,   setBusy]   = useState(false)

  const save = async()=>{
    if(!form.name.trim()){ showToast('Name is required','warn'); return }
    setBusy(true)
    let updated
    if(editId){
      updated = members.map(m=>m.id===editId?{...m,...form}:m)
      showToast('Member updated ☁')
    } else {
      const id = String(Date.now())
      updated = [...members, {id,...form}]
      showToast('Member added ☁')
    }
    await saveMembers(updated)
    setBusy(false)
    setForm(blank()); setEditId(null); setOpen(false)
  }

  const del = async(id)=>{
    if(!window.confirm('Delete this member?')) return
    setBusy(true)
    await saveMembers(members.filter(m=>m.id!==id))
    setBusy(false)
    showToast('Member deleted','warn')
  }

  const startEdit=(m)=>{
    setForm({name:m.name,email:m.email||'',joinDate:m.joinDate,uid:m.uid||''})
    setEditId(m.id); setOpen(true)
  }

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Members ({members.length})</h2>
        <button onClick={()=>{setForm(blank());setEditId(null);setOpen(!open)}} style={S.addBtn}>
          {open?'✕ Close':'+ Add'}
        </button>
      </div>

      {open && (
        <div style={S.formCard}>
          <div style={S.cardTitle}>{editId?'✏️ Edit Member':'➕ Add Member'}</div>

          <label style={ls.label}>Full Name *</label>
          <input placeholder='Full name' value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={S.inp}/>

          <label style={ls.label}>Email address</label>
          <input type='email' placeholder='their@gmail.com' value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value.toLowerCase()}))} style={S.inp}/>

          <label style={ls.label}>Join Date</label>
          <input type='date' value={form.joinDate} onChange={e=>setForm(p=>({...p,joinDate:e.target.value}))} style={S.inp}/>

          <label style={ls.label}>Firebase UID <span style={{color:'#16a34a',fontWeight:700}}>(Required for member login)</span></label>
          <input placeholder='Paste UID from Firebase Auth' value={form.uid} onChange={e=>setForm(p=>({...p,uid:e.target.value.trim()}))} style={{...S.inp,fontFamily:'monospace',fontSize:12}}/>
          <div style={ls.hint}>
            📌 Get this from Firebase Console → Authentication → Users → click the member → copy their User UID
          </div>

          <div style={{display:'flex',gap:8,marginTop:6}}>
            <button onClick={save} disabled={busy} style={S.primaryBtn}>{busy?'Saving…':editId?'Update':'Add Member'}</button>
            <button onClick={()=>{setOpen(false);setEditId(null)}} style={S.secondaryBtn}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {members.map(m=>(
          <div key={m.id} style={{...S.mRow,border:'1.5px solid #e5e7eb',opacity:busy?.6:1}}>
            <div style={{...S.ava,background:`hsl(${parseInt(m.id)%360||42},55%,58%)`,color:'#fff',fontWeight:900}}>
              {m.name?.charAt(0)||'?'}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{m.name}</div>
              <div style={{fontSize:11,color:'#6b7280'}}>{m.email||'No email'} · {m.joinDate}</div>
              <div style={{fontSize:10,color:m.uid?'#16a34a':'#dc2626',fontWeight:700,marginTop:1}}>
                {m.uid?'✅ Login linked':'⚠️ No UID — member cannot login'}
              </div>
            </div>
            <button onClick={()=>startEdit(m)} disabled={busy} style={S.iconBtn}>✏️</button>
            <button onClick={()=>del(m.id)}    disabled={busy} style={S.iconBtn}>🗑️</button>
          </div>
        ))}
        {members.length===0 && <div style={S.empty}>No members yet. Add your first member above.</div>}
      </div>
    </div>
  )
}

const ls = {
  label: {fontSize:12,fontWeight:700,color:'#6b7280',display:'block',marginBottom:4},
  hint:  {fontSize:11,color:'#2563eb',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:8,padding:'8px 10px',marginBottom:8,lineHeight:1.5},
}
