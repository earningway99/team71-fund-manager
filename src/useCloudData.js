// src/useCloudData.js
// V4 — Members store their Firebase UID for reliable login matching
import { useState, useEffect, useCallback } from 'react'
import {
  doc, getDoc, setDoc, onSnapshot,
  writeBatch, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const MEMBERS_REF   = doc(db,'app','members')
const PAYMENTS_REF  = doc(db,'app','payments')
const EXPENSES_REF  = doc(db,'app','expenses')
const EXTRA_REF     = doc(db,'app','extraDonations')
const CONFIG_REF    = doc(db,'app','config')

// ── seed only if completely empty ─────────────────────────────────
export async function seedIfEmpty() {
  const snap = await getDoc(MEMBERS_REF)
  if (!snap.exists()) {
    const batch = writeBatch(db)
    batch.set(MEMBERS_REF,  { list:[], updatedAt:serverTimestamp() })
    batch.set(PAYMENTS_REF, { data:{}, updatedAt:serverTimestamp() })
    batch.set(EXPENSES_REF, { list:[], updatedAt:serverTimestamp() })
    batch.set(EXTRA_REF,    { list:[], updatedAt:serverTimestamp() })
    batch.set(CONFIG_REF,   { version:'4', createdAt:serverTimestamp() })
    await batch.commit()
  }
}

export function useCloudData() {
  const [members,        setMembers]        = useState(null)
  const [payments,       setPayments]       = useState(null)
  const [expenses,       setExpenses]       = useState(null)
  const [extraDonations, setExtraDonations] = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState(null)

  useEffect(()=>{
    const unsubs=[]
    let count=0
    const onLoad=()=>{ if(++count>=4) setLoading(false) }
    const onErr=(e)=>{ setError(e.message); onLoad() }

    unsubs.push(onSnapshot(MEMBERS_REF,  s=>{ setMembers(s.exists()?s.data().list:[]);               onLoad() }, onErr))
    unsubs.push(onSnapshot(PAYMENTS_REF, s=>{ setPayments(s.exists()?s.data().data:{});              onLoad() }, onErr))
    unsubs.push(onSnapshot(EXPENSES_REF, s=>{ setExpenses(s.exists()?s.data().list:[]);              onLoad() }, onErr))
    unsubs.push(onSnapshot(EXTRA_REF,    s=>{ setExtraDonations(s.exists()?s.data().list:[]);        onLoad() }, onErr))

    return ()=>unsubs.forEach(u=>u())
  },[])

  const saveMembers = useCallback(async(data)=>{
    setSaving(true)
    try{ await setDoc(MEMBERS_REF,{list:data,updatedAt:serverTimestamp()}) }
    finally{ setSaving(false) }
  },[])

  const savePayments = useCallback(async(data)=>{
    setSaving(true)
    try{ await setDoc(PAYMENTS_REF,{data,updatedAt:serverTimestamp()}) }
    finally{ setSaving(false) }
  },[])

  const saveExpenses = useCallback(async(data)=>{
    setSaving(true)
    try{ await setDoc(EXPENSES_REF,{list:data,updatedAt:serverTimestamp()}) }
    finally{ setSaving(false) }
  },[])

  const saveExtraDonations = useCallback(async(data)=>{
    setSaving(true)
    try{ await setDoc(EXTRA_REF,{list:data,updatedAt:serverTimestamp()}) }
    finally{ setSaving(false) }
  },[])

  return {
    members, payments, expenses, extraDonations,
    loading, saving, error,
    saveMembers, savePayments, saveExpenses, saveExtraDonations
  }
}
