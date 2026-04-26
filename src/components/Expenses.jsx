// src/components/Expenses.jsx
import { useState, useMemo } from 'react'
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
  description: '', amount: '',
  date: new Date().toISOString().slice(0, 10),
  category: 'Other', year: String(new Date().getFullYear())
})

const CAT_COLORS = {
  Food: '#16a34a', Transport: '#2563eb', Event: '#7c3aed',
  Equipment: '#ea580c', Maintenance: '#0891b2', Other: '#64748b'
}

export default function Expenses({ expenses, saveExpenses, balance, allTimeCollected, showToast, viewOnly }) {
  const [form,      setForm]      = useState(blank())
  const [open,      setOpen]      = useState(false)
  const [busy,      setBusy]      = useState(false)
  const [viewYear,  setViewYear]  = useState(String(new Date().getFullYear()))
  const [activeTab, setActiveTab] = useState('list') // list | yearly | category

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)

  // ── yearly breakdown ──────────────────────────────────────────
  const yearlyData = useMemo(() => {
    const m = {}
    expenses.forEach(e => {
      const y = e.date?.slice(0, 4) || e.year || 'Unknown'
      if (!m[y]) m[y] = { total: 0, items: [], categories: {} }
      m[y].total += e.amount
      m[y].items.push(e)
      m[y].categories[e.category] = (m[y].categories[e.category] || 0) + e.amount
    })
    return m
  }, [expenses])

  const years = Object.keys(yearlyData).sort((a, b) => b - a)

  // ── category breakdown for selected year ─────────────────────
  const catData = useMemo(() => {
    const yearExp = viewYear === 'all' ? expenses : expenses.filter(e => e.date?.slice(0, 4) === viewYear)
    const m = {}
    yearExp.forEach(e => { m[e.category] = (m[e.category] || 0) + e.amount })
    return m
  }, [expenses, viewYear])
  const catTotal = Object.values(catData).reduce((s, v) => s + v, 0)

  const save = async () => {
    const amt = parseFloat(form.amount)
    if (!form.description.trim() || !amt || amt <= 0) { showToast('Fill all fields', 'warn'); return }
    if (amt > balance) { showToast('Amount exceeds balance!', 'warn'); return }
    setBusy(true)
    const updated = [...expenses, { id: String(Date.now()), ...form, amount: amt }]
    await saveExpenses(updated)
    setBusy(false)
    setForm(blank()); setOpen(false)
    showToast('Expense saved ☁')
  }

  const del = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    setBusy(true)
    await saveExpenses(expenses.filter(e => e.id !== id))
    setBusy(false)
    showToast('Deleted', 'warn')
  }

  const currentYearExp = expenses.filter(e => e.date?.slice(0, 4) === viewYear)

  return (
    <div style={S.page}>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Expenses</h2>
        {!viewOnly && <button onClick={() => setOpen(!open)} style={S.addBtn}>{open ? '✕ Close' : '+ Add'}</button>}
      </div>

      {/* balance card */}
      <div style={{ ...S.card, background: 'linear-gradient(135deg,#0f172a,#134e4a)', border: 'none', marginBottom: 14 }}>
        <Row label='Total Collected' val={`৳${allTimeCollected}`} />
        <Row label='Total Spent'     val={`৳${totalSpent}`}       vc='#f87171' />
        <Row label='Balance'         val={`৳${balance}`}          vc='#4ade80' bold />
      </div>

      {/* add form */}
      {open && !viewOnly && ( <div style={S.formCard}>
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

      {/* view tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          { id: 'list',     label: '📋 List'     },
          { id: 'yearly',   label: '📅 Yearly'   },
          { id: 'category', label: '🏷️ Category' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 700,
            background: activeTab === t.id ? '#0f172a' : '#f1f5f9',
            color: activeTab === t.id ? '#fff' : '#6b7280',
            cursor: 'pointer', fontFamily: 'inherit'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── LIST VIEW ── */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...expenses].reverse().map(e => (
            <div key={e.id} style={{ ...S.mRow, border: '1.5px solid #fecaca', opacity: busy ? .6 : 1 }}>
              <div style={{ ...S.ava, background: `${CAT_COLORS[e.category] || '#64748b'}22`, color: CAT_COLORS[e.category] || '#64748b', fontSize: 14, fontWeight: 900 }}>
                {e.category?.charAt(0) || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.description}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{e.date} · {e.category}</div>
              </div>
              <span style={{ fontWeight: 800, color: '#dc2626', marginRight: 6 }}>৳{e.amount}</span>
              {!viewOnly && <button onClick={() => del(e.id)} disabled={busy} style={S.iconBtn}>🗑️</button>}
            </div>
          ))}
          {expenses.length === 0 && <div style={S.empty}>No expenses recorded yet.</div>}
        </div>
      )}

      {/* ── YEARLY VIEW ── */}
      {activeTab === 'yearly' && (
        <div>
          <select value={viewYear} onChange={e => setViewYear(e.target.value)} style={{ ...S.inp, marginBottom: 12 }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {yearlyData[viewYear] ? (
            <>
              {/* year summary */}
              <div style={S.card}>
                <div style={S.cardTitle}>📅 Year {viewYear} Summary</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, background: '#fef2f2', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#dc2626' }}>৳{yearlyData[viewYear].total}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Total Spent</div>
                  </div>
                  <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#16a34a' }}>{yearlyData[viewYear].items.length}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Transactions</div>
                  </div>
                </div>

                {/* category breakdown within year */}
                <div style={S.cardTitle}>By Category</div>
                {Object.entries(yearlyData[viewYear].categories).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
                  const pct = yearlyData[viewYear].total ? Math.round((amt / yearlyData[viewYear].total) * 100) : 0
                  return (
                    <div key={cat} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 3 }}>
                        <span style={{ color: CAT_COLORS[cat] || '#64748b' }}>● {cat}</span>
                        <span style={{ color: '#374151' }}>৳{amt} ({pct}%)</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: CAT_COLORS[cat] || '#64748b', borderRadius: 99, transition: 'width .6s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* all items for year */}
              <div style={S.cardTitle}>All Expenses — {viewYear}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {yearlyData[viewYear].items.sort((a, b) => b.date?.localeCompare(a.date)).map(e => (
                  <div key={e.id} style={{ ...S.mRow, border: `1.5px solid ${CAT_COLORS[e.category] || '#e5e7eb'}33` }}>
                    <div style={{ ...S.ava, background: `${CAT_COLORS[e.category] || '#64748b'}15`, color: CAT_COLORS[e.category] || '#64748b', fontWeight: 900 }}>
                      {e.category?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{e.description}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{e.date} · {e.category}</div>
                    </div>
                    <span style={{ fontWeight: 800, color: '#dc2626' }}>৳{e.amount}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={S.empty}>No expenses for {viewYear}.</div>
          )}
        </div>
      )}

      {/* ── CATEGORY VIEW ── */}
      {activeTab === 'category' && (
        <div>
          <select value={viewYear} onChange={e => setViewYear(e.target.value)} style={{ ...S.inp, marginBottom: 12 }}>
            <option value='all'>All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <div style={S.card}>
            <div style={S.cardTitle}>🏷️ Spending by Category — {viewYear === 'all' ? 'All Time' : viewYear}</div>
            <div style={{ fontWeight: 800, color: '#dc2626', fontSize: 16, marginBottom: 12 }}>৳{catTotal} total</div>
            {Object.entries(catData).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
              const pct = catTotal ? Math.round((amt / catTotal) * 100) : 0
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: CAT_COLORS[cat] || '#64748b' }}>● {cat}</span>
                    <span>৳{amt} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 10, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: CAT_COLORS[cat] || '#64748b', borderRadius: 99, transition: 'width .6s ease' }} />
                  </div>
                </div>
              )
            })}
            {Object.keys(catData).length === 0 && <div style={S.empty}>No data for this period.</div>}
          </div>
        </div>
      )}

    </div>
  )
}
