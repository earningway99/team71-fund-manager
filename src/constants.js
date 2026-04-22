// src/constants.js

export const DONATION_AMOUNT = 100   // BDT per member per month

export const SEED_MEMBERS = [
  { id: '1',  name: 'Rahim Uddin',   phone: '01711-000001', joinDate: '2024-01-01' },
  { id: '2',  name: 'Karim Hossain', phone: '01711-000002', joinDate: '2024-01-01' },
  { id: '3',  name: 'Jamal Ahmed',   phone: '01711-000003', joinDate: '2024-02-01' },
  { id: '4',  name: 'Selim Reza',    phone: '01711-000004', joinDate: '2024-02-01' },
  { id: '5',  name: 'Nasim Khan',    phone: '01711-000005', joinDate: '2024-03-01' },
  { id: '6',  name: 'Tariq Islam',   phone: '01711-000006', joinDate: '2024-03-01' },
  { id: '7',  name: 'Faruk Miah',    phone: '01711-000007', joinDate: '2024-04-01' },
  { id: '8',  name: 'Rubel Sarker',  phone: '01711-000008', joinDate: '2024-04-01' },
  { id: '9',  name: 'Masum Billah',  phone: '01711-000009', joinDate: '2024-05-01' },
  { id: '10', name: 'Shakil Mahmud', phone: '01711-000010', joinDate: '2024-05-01' },
  { id: '11', name: 'Imran Haque',   phone: '01711-000011', joinDate: '2024-06-01' },
]

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Event', 'Equipment', 'Maintenance', 'Other'
]

export function nowMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function fmtMonth(key) {
  if (!key) return ''
  const [y, m] = key.split('-')
  return `${MONTHS[+m - 1]} ${y}`
}

export function genMonthKeys(from = '2025-01') {
  const keys = []
  const [fy, fm] = from.split('-').map(Number)
  const now = new Date()
  let y = fy, mo = fm
  while (
    y < now.getFullYear() ||
    (y === now.getFullYear() && mo <= now.getMonth() + 1)
  ) {
    keys.push(`${y}-${String(mo).padStart(2, '0')}`)
    if (++mo > 12) { mo = 1; y++ }
  }
  return keys
}
