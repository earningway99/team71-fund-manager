// src/components/Members.jsx
import { useState } from 'react'
import S from '../styles'

const blank = () => ({ name: '', phone: '', joinDate: new Date().toISOString().slice(0, 10) })

export default function Members({ members, saveMembers, showToast }) {
  const [form,   setForm]   = useState(blank())
  const [editId, setEditId] = useState(null)
  const [open,   setOpen]   = useState(false)
  const [busy,   setBusy]   = useState(false)

  const save = async () => {
    if (!form.name.trim()) { showToast('Name is required', 'warn'); return }
    setBusy(true)
    let updated
    if (editId) {
      updated = members.map(m => m.id === editId ? { ...m, ...form } : m)
      showToast('Member updated ☁')
    } else {
      const id = String(Date.now())
      updated = [...members, { id, ...form }]
      showToast('Member added ☁')
    }
    await saveMembers(updated)
    setBusy(false)
    setForm(blank()); setEditId(null); setOpen(false)
  }

  const del = async (id) => {
    if (!window.confirm('Delete this member? Cannot be undone.')) return
    setBusy(true)
    await saveMembers(members.filter(m => m.id !== id))
    setBusy(false)
    showToast('Member deleted', 'warn')
  }

  const startEdit = (m) => {
    setForm({ name: m.name, phone: m.phone, joinDate: m.joinDate })
    setEditId(m.id); setOpen(true)
  }

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Members ({members.length})</h2>
        <button
          onClick={() => { setForm(blank()); setEditId(null); setOpen(!open) }}
          style={S.addBtn}
        >
          {open ? '✕ Close' : '+ Add'}
        </button>
      </div>

      {open && (
        <div style={S.formCard}>
          <div style={S.cardTitle}>{editId ? '✏️ Edit Member' : '➕ Add New Member'}</div>
          <input placeholder='Full Name *' value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={S.inp} />
          <input placeholder='Phone Number' value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={S.inp} />
          <label style={{ fontSize: 12, color: '#6b7280' }}>Join Date</label>
          <input type='date' value={form.joinDate} onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))} style={{ ...S.inp, marginTop: 4 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={save} disabled={busy} style={S.primaryBtn}>
              {busy ? 'Saving…' : editId ? 'Update' : 'Add Member'}
            </button>
            <button onClick={() => { setOpen(false); setEditId(null) }} style={S.secondaryBtn}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map(m => (
          <div key={m.id} style={{ ...S.mRow, border: '1.5px solid #e5e7eb', opacity: busy ? .6 : 1 }}>
            <div style={{ ...S.ava, background: `hsl(${(+m.id * 41) % 360},55%,58%)`, color: '#fff', fontWeight: 900 }}>
              {m.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{m.phone || 'No phone'} · {m.joinDate}</div>
            </div>
            <button onClick={() => startEdit(m)} disabled={busy} style={S.iconBtn}>✏️</button>
            <button onClick={() => del(m.id)}    disabled={busy} style={S.iconBtn}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  )
}
