// src/styles.js  — shared style tokens used across all components
const S = {
  // ── layout ──────────────────────────────────────────────────────
  shell:       { display:'flex', flexDirection:'column', height:'100vh', maxWidth:430, margin:'0 auto', fontFamily:"'Nunito','Segoe UI',sans-serif", background:'#f8fafc', overflow:'hidden' },
  topBar:      { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0f172a', flexShrink:0 },
  topLeft:     { display:'flex', alignItems:'center', gap:10 },
  orgBadge:    { width:36, height:36, borderRadius:10, background:'#16a34a', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13, color:'#fff' },
  orgName:     { fontWeight:800, fontSize:14, color:'#f8fafc' },
  orgSub:      { fontSize:11, color:'#64748b' },
  savingPill:  { background:'#1e293b', border:'1px solid #f59e0b', color:'#f59e0b', padding:'3px 8px', borderRadius:99, fontSize:11, fontWeight:700 },
  savedPill:   { background:'#1e293b', border:'1px solid #22c55e', color:'#22c55e', padding:'3px 8px', borderRadius:99, fontSize:11, fontWeight:700 },
  logoutBtn:   { background:'#1e293b', border:'1.5px solid #334155', color:'#94a3b8', padding:'7px 12px', borderRadius:8, fontSize:14, cursor:'pointer' },
  main:        { flex:1, overflowY:'auto' },
  nav:         { display:'flex', background:'#fff', borderTop:'2px solid #f1f5f9', flexShrink:0 },
  navBtn:      { flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 2px', background:'none', border:'none', cursor:'pointer', gap:2, borderTop:'2.5px solid transparent' },
  navActive:   { borderTop:'2.5px solid #16a34a', background:'#f0fdf4' },
  navIcon:     { fontSize:18 },
  navLabel:    { fontSize:10, fontWeight:700 },

  // ── page ────────────────────────────────────────────────────────
  page:        { padding:'14px 14px 90px' },
  pageHead:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  pageTitle:   { fontSize:20, fontWeight:900, color:'#0f172a', margin:0 },
  monthChip:   { background:'#f0fdf4', color:'#16a34a', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, border:'1.5px solid #bbf7d0' },
  grid4:       { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 },

  // ── card ────────────────────────────────────────────────────────
  card:        { background:'#fff', borderRadius:14, padding:14, marginBottom:12, boxShadow:'0 1px 6px #0000000d', border:'1.5px solid #f1f5f9' },
  formCard:    { background:'#fff', borderRadius:14, padding:14, marginBottom:12, boxShadow:'0 4px 20px #00000018', border:'1.5px solid #dbeafe' },
  cardTitle:   { fontWeight:800, fontSize:13, color:'#374151', marginBottom:10 },

  // ── member row ──────────────────────────────────────────────────
  mRow:        { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'#fff' },
  ava:         { width:36, height:36, borderRadius:99, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, flexShrink:0 },
  badgeGreen:  { background:'#dcfce7', color:'#16a34a', padding:'3px 8px', borderRadius:8, fontSize:11, fontWeight:800, flexShrink:0 },
  badgeRed:    { background:'#fee2e2', color:'#dc2626', padding:'3px 8px', borderRadius:8, fontSize:11, fontWeight:800, flexShrink:0 },
  markBtn:     { background:'#f0fdf4', color:'#16a34a', border:'1.5px solid #bbf7d0', padding:'6px 10px', borderRadius:8, fontSize:12, fontWeight:800, cursor:'pointer' },
  undoBtn:     { background:'#fef2f2', color:'#dc2626', border:'1.5px solid #fecaca', padding:'5px 8px', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer', marginLeft:4 },

  // ── buttons ─────────────────────────────────────────────────────
  addBtn:      { background:'#16a34a', color:'#fff', border:'none', padding:'8px 14px', borderRadius:10, fontWeight:800, fontSize:13, cursor:'pointer' },
  iconBtn:     { background:'none', border:'none', fontSize:16, cursor:'pointer', padding:4 },
  primaryBtn:  { flex:1, width:'100%', padding:'12px', borderRadius:10, border:'none', background:'#16a34a', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'inherit' },
  secondaryBtn:{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#f8fafc', color:'#374151', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' },

  // ── form ────────────────────────────────────────────────────────
  inp:         { width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, marginBottom:8, boxSizing:'border-box', background:'#f8fafc', fontFamily:'inherit', outline:'none' },
  empty:       { textAlign:'center', color:'#9ca3af', padding:'24px 0', fontSize:13 },

  // ── toast ───────────────────────────────────────────────────────
  toast:       { position:'fixed', bottom:72, left:'50%', transform:'translateX(-50%)', color:'#fff', padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:700, zIndex:999, boxShadow:'0 4px 20px #00000040', whiteSpace:'nowrap', maxWidth:'90vw' },

  // ── boot ────────────────────────────────────────────────────────
  bootScreen:  { height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f172a,#134e4a)', fontFamily:"'Nunito','Segoe UI',sans-serif" },
  bootCard:    { textAlign:'center', padding:40 },
  bootLogo:    { fontSize:52, marginBottom:16 },
  bootTitle:   { color:'#f8fafc', fontWeight:900, fontSize:22, marginBottom:6 },
  bootSub:     { color:'#94a3b8', fontSize:13, marginBottom:24 },
  spinner:     { width:32, height:32, border:'3px solid #1e293b', borderTop:'3px solid #16a34a', borderRadius:'50%', margin:'0 auto', animation:'spin 0.9s linear infinite' },

  // ── login ───────────────────────────────────────────────────────
  loginBg:     { minHeight:'100vh', background:'linear-gradient(135deg,#0f172a 0%,#134e4a 60%,#064e3b 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, position:'relative', overflow:'hidden', fontFamily:"'Nunito','Segoe UI',sans-serif" },
  loginGlow:   { position:'fixed', top:'-10%', left:'50%', transform:'translateX(-50%)', width:400, height:400, background:'radial-gradient(circle,#16a34a22,transparent 70%)', pointerEvents:'none' },
  loginCard:   { background:'#fff', borderRadius:22, padding:'28px 22px', width:'100%', maxWidth:390, boxShadow:'0 24px 80px #00000050', position:'relative' },
  loginLogo:   { display:'inline-flex', width:58, height:58, borderRadius:16, background:'linear-gradient(135deg,#16a34a,#15803d)', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 6px 20px #16a34a44' },
  loginH1:     { textAlign:'center', fontWeight:900, fontSize:20, color:'#0f172a', margin:0 },
  loginSub:    { textAlign:'center', fontSize:12, color:'#6b7280', margin:'4px 0 10px' },
  cloudBadge:  { textAlign:'center', background:'#f0fdf4', border:'1.5px solid #bbf7d0', color:'#16a34a', fontSize:11, fontWeight:700, padding:'6px 10px', borderRadius:10, marginBottom:16 },
  modeTabs:    { display:'flex', gap:8, marginBottom:14 },
  modeTab:     { flex:1, padding:'10px', borderRadius:10, border:'1.5px solid #e5e7eb', background:'#f8fafc', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', color:'#374151' },
  modeTabOn:   { background:'#0f172a', color:'#f8fafc', border:'1.5px solid #0f172a' },
  loginBtn:    { width:'100%', padding:'13px', borderRadius:11, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', marginTop:2 },
  loginErr:    { color:'#dc2626', fontSize:12, textAlign:'center', marginTop:8, fontWeight:600 },
  loginHint:   { textAlign:'center', fontSize:11, color:'#9ca3af', marginTop:10, marginBottom:0 },
}

export default S
