// src/constants.js
export const DONATION_AMOUNT = 100

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const EXPENSE_CATEGORIES = [
  'Food','Transport','Event','Equipment','Maintenance','Other'
]

export const EXTRA_REASONS = [
  'Eid Collection','Special Fund','Emergency','Event Cost','Voluntary','Other'
]

export function nowMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}

export function fmtMonth(key) {
  if (!key) return ''
  const [y,m] = key.split('-')
  return `${MONTHS[+m-1]} ${y}`
}

export function genMonthKeys(from='2025-10') {
  const keys=[]
  const [fy,fm] = from.split('-').map(Number)
  const now = new Date()
  let y=fy, mo=fm
  while(y < now.getFullYear() || (y===now.getFullYear() && mo<=now.getMonth()+1)) {
    keys.push(`${y}-${String(mo).padStart(2,'0')}`)
    if(++mo>12){mo=1;y++}
  }
  return keys
}
