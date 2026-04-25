// src/useCloudData.js
import { useState, useEffect, useCallback } from 'react'
import {
  doc, getDoc, setDoc, writeBatch, onSnapshot, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { SEED_MEMBERS } from './constants'

const MEMBERS_REF       = doc(db, 'app', 'members')
const PAYMENTS_REF      = doc(db, 'app', 'payments')
const EXPENSES_REF      = doc(db, 'app', 'expenses')
const EXTRA_DON_REF     = doc(db, 'app', 'extraDonations')
const CONFIG_REF        = doc(db, 'app', 'config')

// ── seed on first launch ──────────────────────────────────────────
export async function seedIfEmpty() {
  const snap = await getDoc(MEMBERS_REF)
  if (!snap.exists()) {
    const batch = writeBatch(db)
    batch.set(MEMBERS_REF,   { list: SEED_MEMBERS, updatedAt: serverTimestamp() })
    batch.set(PAYMENTS_REF,  { data: {},            updatedAt: serverTimestamp() })
    batch.set(EXPENSES_REF,  { list: [],            updatedAt: serverTimestamp() })
    batch.set(EXTRA_DON_REF, { list: [],            updatedAt: serverTimestamp() })
    batch.set(CONFIG_REF,    { seeded: true, createdAt: serverTimestamp() })
    await batch.commit()
  }
}

// ── main hook ─────────────────────────────────────────────────────
export function useCloudData() {
  const [members,        setMembers]        = useState(null)
  const [payments,       setPayments]       = useState(null)
  const [expenses,       setExpenses]       = useState(null)
  const [extraDonations, setExtraDonations] = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState(null)

  useEffect(() => {
    const unsubs = []
    let count = 0
    const onLoad = () => { if (++count >= 4) setLoading(false) }

    unsubs.push(onSnapshot(MEMBERS_REF,   s => { setMembers(s.exists() ? s.data().list : []);               onLoad() }, e => { setError(e.message); onLoad() }))
    unsubs.push(onSnapshot(PAYMENTS_REF,  s => { setPayments(s.exists() ? s.data().data : {});              onLoad() }, e => { setError(e.message); onLoad() }))
    unsubs.push(onSnapshot(EXPENSES_REF,  s => { setExpenses(s.exists() ? s.data().list : []);              onLoad() }, e => { setError(e.message); onLoad() }))
    unsubs.push(onSnapshot(EXTRA_DON_REF, s => { setExtraDonations(s.exists() ? s.data().list : []);        onLoad() }, e => { setError(e.message); onLoad() }))

    return () => unsubs.forEach(u => u())
  }, [])

  const saveMembers = useCallback(async (data) => {
    setSaving(true)
    try { await setDoc(MEMBERS_REF, { list: data, updatedAt: serverTimestamp() }) }
    finally { setSaving(false) }
  }, [])

  const savePayments = useCallback(async (data) => {
    setSaving(true)
    try { await setDoc(PAYMENTS_REF, { data, updatedAt: serverTimestamp() }) }
    finally { setSaving(false) }
  }, [])

  const saveExpenses = useCallback(async (data) => {
    setSaving(true)
    try { await setDoc(EXPENSES_REF, { list: data, updatedAt: serverTimestamp() }) }
    finally { setSaving(false) }
  }, [])

  const saveExtraDonations = useCallback(async (data) => {
    setSaving(true)
    try { await setDoc(EXTRA_DON_REF, { list: data, updatedAt: serverTimestamp() }) }
    finally { setSaving(false) }
  }, [])

  return {
    members, payments, expenses, extraDonations,
    loading, saving, error,
    saveMembers, savePayments, saveExpenses, saveExtraDonations
  }
}
