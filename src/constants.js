// src/constants.js

export const DONATION_AMOUNT = 100   // BDT per member per month

// ── Each member now has an email field ────────────────────────────
// Replace these emails with your real members' emails
export const SEED_MEMBERS = [
  { id: '0',  name: 'Shakil',   joinDate: '2025-10-09', email: 'mahmoodshakil4@gmail.com'  },
  { id: '2',  name: 'Karim Hossain', joinDate: '2025-10-09', email: 'karim_real@gmail.com'  },
  { id: '2',  name: 'Tasif',   joinDate: '2025-10-09', email: 'tanvirtasif2000@gmail.com'  },
  { id: '4',  name: 'Selim Reza',    joinDate: '2025-10-09', email: 'selim_real@gmail.com'  },
  { id: '5',  name: 'Nasim Khan',    joinDate: '2025-10-09', email: 'nasim_real@gmail.com'  },
  { id: '6',  name: 'Tariq Islam',   joinDate: '2025-10-09', email: 'tariq_real@gmail.com'  },
  { id: '7',  name: 'Faruk Miah',    joinDate: '2025-10-09', email: 'faruk_real@gmail.com'  },
  { id: '8',  name: 'Rubel Sarker',  joinDate: '2025-10-09', email: 'rubel_real@gmail.com'  },
  { id: '9',  name: 'Masum Billah',  joinDate: '2025-10-09', email: 'masum_real@gmail.com'  },
  { id: '10', name: 'Shakil Mahmud', joinDate: '2025-10-09', email: 'shakil_real@gmail.com' },
  { id: '11', name: 'Imran Haque',   joinDate: '2025-10-09', email: 'imran_real@gmail.com'  },
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

export function genMonthKeys(from = '2025-10') {
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
