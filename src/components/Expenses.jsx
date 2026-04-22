// src/components/Expenses.jsx
import { useState } from 'react'
import { EXPENSE_CATEGORIES } from '../constants'
import S from '../styles'

function Row({ label, val, vc = '#e2e8f0', bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1e293b' }}>
      <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: bold ? 900 : 600, color: vc }}>{val}</span>
    </div>
  )
}

const blank = () => ({
  description: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  category: 'Other'
})

export default function Expenses({ expenses, saveExpenses, balance, allTimeCollected, showToast }) {
  const [form, setForm] = useState(blank())
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const save = async () => {
    const amt = parseFloat(form.amount)
    if (!form.description.trim() || !amt || amt <= 0) { showToast('Fill all fields correctly', 'warn'); return }
    if (amt > balance) { showToast('Amount exceeds available balance!', 'warn'); return }
    setBusy(true)
    const updated = [...expenses, { id: String(Date.now()), ...form, amount: amt }]
    await saveExpenses(updated)
    setBusy(false)
    setForm(blank()); setOpen(false)
    showToast('Expense recorded ☁')
  }

  const del = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    setBusy(true)
    await saveExpenses(expenses.filter(e => e.id !== id))
    setBusy(false)
    showToast('Expense deleted', 'warn')
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Expenses</h2>
        <button onClick={() => setOpen(!open)} style={S.addBtn}>{open ? '✕ Close' : '+ Add'}</button>
      </div>

      {/* balance card — dark */}
      <div style={{ ...S.card, background: 'linear-gradient(135deg,#0f172a,#134e4a)', border: 'none', marginBottom: 14 }}>
        <Row label='Total Collected' val={`৳${allTimeCollected}`} />
        <Row label='Total Spent'     val={`৳${totalSpent}`}       vc='#f87171' />
        <Row label='Balance'         val={`৳${balance}`}          vc='#4ade80' bold />
      </div>

      {open && (
        <div style={S.formCard}>
          <div style={S.cardTitle}>💸 Record Expense</div>
          <input placeholder='Description *' value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={S.inp} />
          <input type='number' placeholder='Amount (৳) *' value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={S.inp} />
          <input type='date' value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={S.inp} />
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={S.inp}>
            {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={busy} style={{ ...S.primaryBtn, background: '#dc2626' }}>
              {busy ? 'Saving…' : 'Record Expense'}
            </button>
            <button onClick={() => setOpen(false)} style={S.secondaryBtn}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...expenses].reverse().map(e => (
          <div key={e.id} style={{ ...S.mRow, border: '1.5px solid #fecaca', opacity: busy ? .6 : 1 }}>
            <div style={{ ...S.ava, background: '#fee2e2', color: '#dc2626', fontSize: 16 }}>💸</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{e.description}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{e.date} · {e.category}</div>
            </div>
            <span style={{ fontWeight: 800, color: '#dc2626', marginRight: 6 }}>৳{e.amount}</span>
            <button onClick={() => del(e.id)} disabled={busy} style={S.iconBtn}>🗑️</button>
          </div>
        ))}
        {expenses.length === 0 && <div style={S.empty}>No expenses recorded yet.</div>}
      </div>
    </div>
  )
}
