// src/useCloudData.js
// ─────────────────────────────────────────────────────────────────
//  Real-time Firestore listener hook.
//  Every change (by any user anywhere) flows to ALL open sessions
//  instantly via onSnapshot.
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import {
  doc, getDoc, setDoc, updateDoc,
  collection, onSnapshot, writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { SEED_MEMBERS } from './constants'

// ── collection / document references ─────────────────────────────
const CONFIG_REF    = doc(db, 'app', 'config')
const MEMBERS_REF   = doc(db, 'app', 'members')
const PAYMENTS_REF  = doc(db, 'app', 'payments')
const EXPENSES_REF  = doc(db, 'app', 'expenses')

// ── seed Firestore if first time ─────────────────────────────────
export async function seedIfEmpty() {
  const snap = await getDoc(MEMBERS_REF)
  if (!snap.exists()) {
    const batch = writeBatch(db)
    batch.set(MEMBERS_REF,  { list: SEED_MEMBERS,  updatedAt: serverTimestamp() })
    batch.set(PAYMENTS_REF, { data: {},             updatedAt: serverTimestamp() })
    batch.set(EXPENSES_REF, { list: [],             updatedAt: serverTimestamp() })
    batch.set(CONFIG_REF,   { seeded: true, createdAt: serverTimestamp() })
    await batch.commit()
  }
}

// ── main hook ─────────────────────────────────────────────────────
export function useCloudData() {
  const [members,  setMembers]  = useState(null)
  const [payments, setPayments] = useState(null)
  const [expenses, setExpenses] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState(null)

  // ── real-time listeners ────────────────────────────────────────
  useEffect(() => {
    const unsubs = []
    let loadCount = 0
    const onLoad = () => { if (++loadCount >= 3) setLoading(false) }

    unsubs.push(
      onSnapshot(MEMBERS_REF, snap => {
        setMembers(snap.exists() ? snap.data().list : [])
        onLoad()
      }, err => { setError(err.message); onLoad() })
    )

    unsubs.push(
      onSnapshot(PAYMENTS_REF, snap => {
        setPayments(snap.exists() ? snap.data().data : {})
        onLoad()
      }, err => { setError(err.message); onLoad() })
    )

    unsubs.push(
      onSnapshot(EXPENSES_REF, snap => {
        setExpenses(snap.exists() ? snap.data().list : [])
        onLoad()
      }, err => { setError(err.message); onLoad() })
    )

    return () => unsubs.forEach(u => u())
  }, [])

  // ── write helpers ──────────────────────────────────────────────
  const saveMembers = useCallback(async (data) => {
    setSaving(true)
    try {
      await setDoc(MEMBERS_REF, { list: data, updatedAt: serverTimestamp() })
    } finally { setSaving(false) }
  }, [])

  const savePayments = useCallback(async (data) => {
    setSaving(true)
    try {
      await setDoc(PAYMENTS_REF, { data, updatedAt: serverTimestamp() })
    } finally { setSaving(false) }
  }, [])

  const saveExpenses = useCallback(async (data) => {
    setSaving(true)
    try {
      await setDoc(EXPENSES_REF, { list: data, updatedAt: serverTimestamp() })
    } finally { setSaving(false) }
  }, [])

  return {
    members, payments, expenses,
    loading, saving, error,
    saveMembers, savePayments, saveExpenses
  }
}
