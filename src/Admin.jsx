import React, { useState, useEffect, useRef } from 'react'

const ADMIN_PASSWORD = 'growi2025admin'
const API = 'https://ieujjmvwdoqomqyzgaqf.supabase.co/functions/v1/admin-api'
const UPLOAD_API = 'https://ieujjmvwdoqomqyzgaqf.supabase.co/functions/v1/upload-photo'
const FB = "'Outfit', sans-serif"
const REGIONS = ["Ensenada","Maneadero","Colonet","Vicente Guerrero","Camalu","San Quintin","El Rosario","Pescadero"]

async function af(action, table, opts = {}) {
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: ADMIN_PASSWORD, action, table, data: opts.data, id: opts.id }) })
  const json = await res.json()
  if (!res.ok || json.error) throw new Error(json.error || 'Error')
  return json.data
}

// Styles
const S = {
  page: { minHeight: '100vh', background: '#0a0f0a', fontFamily: FB, color: '#fff' },
  loginWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  loginCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 48, width: 360, textAlign: 'center' },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: FB },
  select: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: FB, appearance: 'none' },
  btn: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FB },
  btnSm: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FB },
  btnOut: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '8px 20px', fontSize: 13, cursor: 'pointer', fontFamily: FB },
  btnDel: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FB },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  main: { padding: 32, maxWidth: 1200, margin: '0 auto' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: 1 },
  td: { padding: '12px', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' },
  row: { cursor: 'pointer', transition: 'background 0.15s' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' },
  modal: { background: '#111a11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, width: '100%', maxWidth: 700, padding: 32 },
  section: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6 },
  formRow: { marginBottom: 16 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  badge: (active) => ({ display: 'inline-block', borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600, background: active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', color: active ? '#4ade80' : 'rgba(255,255,255,0.4)' }),
  sBadge: (s) => {
    const c = { pending: { bg: 'rgba(251,191,36,0.15)', c: '#fbbf24' }, paid: { bg: 'rgba(74,222,128,0.15)', c: '#4ade80' }, contacted: { bg: 'rgba(59,130,246,0.15)', c: '#60a5fa' }, connected: { bg: 'rgba(168,85,247,0.15)', c: '#c084fc' }, completed: { bg: 'rgba(34,197,94,0.25)', c: '#22c55e' }, cancelled: { bg: 'rgba(239,68,68,0.15)', c: '#f87171' } }
    const x = c[s] || c.pending
    return { display: 'inline-block', borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600, background: x.bg, color: x.c }
  },
  tab: (active) => ({ padding: '10px 24px', borderRadius: 100, border: 'none', fontFamily: FB, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: active ? '#4ade80' : 'rgba(255,255,255,0.06)', color: active ? '#0a0f0a' : 'rgba(255,255,255,0.4)' }),
  toast: { position: 'fixed', bottom: 32, right: 32, background: '#4ade80', color: '#0a0f0a', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, zIndex: 9999 },
  toastErr: { position: 'fixed', bottom: 32, right: 32, background: '#ef4444', color: '#fff', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, zIndex: 9999 },
  statRow: { display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
  stat: { flex: 1, minWidth: 130, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' },
  statN: { fontSize: 36, fontWeight: 700, color: '#4ade80' },
  statL: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  photoThumb: { width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' },
  photoGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  photoItem: { position: 'relative', display: 'inline-block' },
  photoRemove: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, lineHeight: 1 },
  priceRow: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' },
  priceInput: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: FB },
}

// Field component (outside render to avoid focus issues)
const Field = ({ label, children }) => (
  <div style={S.formRow}><label style={S.label}>{label}</label>{children}</div>
)

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('growi_admin') === '1')
  const [pw, setPw] = useState(''), [pwErr, setPwErr] = useState('')
  const [tab, setTab] = useState('producers')
  const [producers, setProducers] = useState([])
  const [connections, setConnections] = useState([])
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const [editProd, setEditProd] = useState(null) // null=closed, 'new'=new, object=editing
  const [viewConn, setViewConn] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'ok' })
  const [confirmDel, setConfirmDel] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => { if (authed) loadAll() }, [authed])

  async function loadAll() {
    setLoading(true)
    try {
      const [prod, conn, srch] = await Promise.all([af('select', 'producers'), af('select', 'connection_requests'), af('select', 'search_requests')])
      setProducers((prod || []).sort((a, b) => (a.id || '').localeCompare(b.id || '')))
      setConnections((conn || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
      setSearches((srch || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
    } catch (err) { showToast('Error: ' + err.message, 'err') }
    setLoading(false)
  }

  function login() { if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('growi_admin', '1'); setAuthed(true) } else { setPwErr('Contraseña incorrecta') } }
  function logout() { sessionStorage.removeItem('growi_admin'); setAuthed(false) }
  function showToast(msg, type = 'ok') { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'ok' }), 3500) }
  function updateForm(key, val) { setForm(f => ({ ...f, [key]: val })) }

  // ---- PRODUCER CRUD ----
  const emptyForm = { id: '', region: 'Ensenada', crops: '', capacity: '', acreage: '', certifications: '', salesType: 'EXPORT', verified: true, season: '', packaging: '', borderCrossingDistance: '', prices: [], photos: [] }

  function openNew() { setEditProd('new'); setForm({ ...emptyForm }); setConfirmDel(false) }

  function openEdit(p) {
    setEditProd(p); setConfirmDel(false)
    setForm({
      id: p.id || '', region: p.region || 'Ensenada',
      crops: Array.isArray(p.crops) ? p.crops.join(', ') : '',
      capacity: p.capacity || '', acreage: p.acreage != null ? String(p.acreage) : '',
      certifications: Array.isArray(p.certifications) ? p.certifications.join(', ') : '',
      salesType: p.sales_type || 'EXPORT', verified: !!p.verified, season: p.season || '',
      packaging: p.packaging || '', borderCrossingDistance: p.border_crossing_distance || '',
      prices: Array.isArray(p.prices) ? [...p.prices] : [],
      photos: Array.isArray(p.photos) ? [...p.photos.filter(Boolean)] : (p.photo_url ? [p.photo_url] : []),
    })
  }

  function closeModal() { setEditProd(null); setForm({}); setConfirmDel(false) }

  function buildData() {
    return {
      region: form.region, crops: form.crops.split(',').map(c => c.trim()).filter(Boolean),
      capacity: form.capacity, acreage: parseInt(form.acreage) || null,
      certifications: form.certifications.split(',').map(c => c.trim()).filter(Boolean),
      sales_type: form.salesType, verified: form.verified, season: form.season,
      packaging: form.packaging || null, border_crossing_distance: form.borderCrossingDistance || null,
      prices: form.prices || [], photos: form.photos || [],
      photo_url: (form.photos && form.photos.length > 0) ? form.photos[0] : null,
      updated_at: new Date().toISOString(),
    }
  }

  async function saveProducer() {
    if (!form.id.trim()) { showToast('ID es requerido (ej: BC-1025)', 'err'); return }
    if (!form.crops.trim()) { showToast('Agrega al menos un cultivo', 'err'); return }
    setSaving(true)
    try {
      if (editProd === 'new') {
        await af('insert', 'producers', { data: { id: form.id.trim().toUpperCase(), ...buildData(), created_at: new Date().toISOString() } })
        showToast('Productor creado')
      } else {
        await af('update', 'producers', { id: editProd.id, data: buildData() })
        showToast('Productor actualizado')
      }
      await loadAll(); closeModal()
    } catch (err) { showToast('Error: ' + err.message, 'err') }
    setSaving(false)
  }

  async function deleteProducer() {
    if (!editProd || editProd === 'new') return
    setSaving(true)
    try {
      await af('delete', 'producers', { id: editProd.id })
      showToast('Productor eliminado'); await loadAll(); closeModal()
    } catch (err) { showToast('Error: ' + err.message, 'err') }
    setSaving(false)
  }

  // ---- PHOTO UPLOAD ----
  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const prodId = editProd === 'new' ? (form.id || 'temp') : editProd.id
    setUploading(true)
    try {
      const reader = new FileReader()
      const base64 = await new Promise((res, rej) => { reader.onload = () => res(reader.result.split(',')[1]); reader.onerror = rej; reader.readAsDataURL(file) })
      const res = await fetch(UPLOAD_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producerId: prodId, fileName: file.name, fileData: base64, contentType: file.type }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed')
      updateForm('photos', [...(form.photos || []), data.url])
      showToast('Foto subida')
    } catch (err) { showToast('Error: ' + err.message, 'err') }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function removePhoto(idx) { updateForm('photos', (form.photos || []).filter((_, i) => i !== idx)) }

  // ---- PRICES ----
  function addPrice() { updateForm('prices', [...(form.prices || []), { crop: '', unit: 'Caja', price_min: '', price_mxn: '' }]) }
  function updatePrice(idx, key, val) { const p = [...(form.prices || [])]; p[idx] = { ...p[idx], [key]: val }; updateForm('prices', p) }
  function removePrice(idx) { updateForm('prices', (form.prices || []).filter((_, i) => i !== idx)) }

  // ---- CONNECTION STATUS ----
  async function updateConnStatus(conn, newStatus) {
    try {
      await af('update', 'connection_requests', { id: conn.id, data: { status: newStatus, updated_at: new Date().toISOString() } })
      await loadAll(); if (viewConn) setViewConn({ ...viewConn, status: newStatus }); showToast('Estado actualizado')
    } catch (err) { showToast('Error: ' + err.message, 'err') }
  }

  const totalProd = producers.length, totalConn = connections.length
  const paidConn = connections.filter(c => c.payment_status === 'paid').length
  const pendingConn = connections.filter(c => c.status === 'paid' || c.status === 'pending').length

  // ---- LOGIN ----
  if (!authed) {
    return (<div style={S.page}><div style={S.loginWrap}><div style={S.loginCard}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#4ade80', marginBottom: 8 }}>Growi Admin</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>Panel de administración</div>
      <input style={{ ...S.input, marginBottom: 16 }} type="password" placeholder="Contraseña" value={pw} onChange={e => { setPw(e.target.value); setPwErr('') }} onKeyDown={e => e.key === 'Enter' && login()} />
      {pwErr && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{pwErr}</div>}
      <button style={S.btn} onClick={login}>Entrar</button>
    </div></div></div>)
  }

  // ---- MAIN RENDER ----
  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#4ade80' }}>Growi Admin</div>
        <button style={S.btnOut} onClick={logout}>Cerrar sesión</button>
      </div>
      <div style={S.main}>
        {/* Stats */}
        <div style={S.statRow}>
          <div style={S.stat}><div style={S.statN}>{totalConn}</div><div style={S.statL}>Conexiones</div></div>
          <div style={S.stat}><div style={S.statN}>{paidConn}</div><div style={S.statL}>Pagadas</div></div>
          <div style={S.stat}><div style={S.statN}>{searches.length}</div><div style={S.statL}>Búsquedas</div></div>
          <div style={S.stat}><div style={S.statN}>{totalProd}</div><div style={S.statL}>Productores</div></div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
          <button style={S.tab(tab === 'producers')} onClick={() => setTab('producers')}>Productores</button>
          <button style={S.tab(tab === 'connections')} onClick={() => setTab('connections')}>Conexiones</button>
          <button style={S.tab(tab === 'searches')} onClick={() => setTab('searches')}>Búsquedas</button>
          {tab === 'producers' && <button style={{ ...S.btnSm, marginLeft: 'auto' }} onClick={openNew}>+ Agregar productor</button>}
        </div>

        {/* PRODUCERS TAB */}
        {tab === 'producers' && (
          <div style={S.card}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>ID</th><th style={S.th}>Región</th><th style={S.th}>Cultivos</th><th style={S.th}>Precios</th><th style={S.th}>Fotos</th><th style={S.th}>Verificado</th>
              </tr></thead>
              <tbody>{producers.map(p => (
                <tr key={p.id} style={S.row} onClick={() => openEdit(p)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={S.td}><span style={{ color: '#4ade80', fontWeight: 700 }}>{p.id}</span></td>
                  <td style={S.td}>{p.region || '—'}</td>
                  <td style={S.td}>{Array.isArray(p.crops) ? p.crops.join(', ') : '—'}</td>
                  <td style={S.td}>{Array.isArray(p.prices) ? p.prices.length : 0}</td>
                  <td style={S.td}>{Array.isArray(p.photos) ? p.photos.filter(Boolean).length : 0}</td>
                  <td style={S.td}><span style={S.badge(p.verified)}>{p.verified ? 'Sí' : 'No'}</span></td>
                </tr>
              ))}</tbody>
            </table>
            {producers.length === 0 && !loading && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>Sin productores. Agrega el primero.</div>}
          </div>
        )}

        {/* CONNECTIONS TAB */}
        {tab === 'connections' && (
          <div style={S.card}>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Comprador</th><th style={S.th}>Productor</th><th style={S.th}>Cultivo</th><th style={S.th}>Pago</th><th style={S.th}>Estado</th></tr></thead>
              <tbody>
                {connections.length === 0 && !loading && <tr><td colSpan={6} style={{ ...S.td, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 32 }}>Sin solicitudes</td></tr>}
                {connections.map(c => (
                  <tr key={c.id} style={S.row} onClick={() => setViewConn(c)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={S.td}><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('es-MX') : '—'}</span></td>
                    <td style={S.td}><strong>{c.buyer_name || '—'}</strong><br/><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{c.buyer_email}</span></td>
                    <td style={S.td}><span style={{ color: '#4ade80', fontWeight: 700 }}>{c.producer_id}</span></td>
                    <td style={S.td}>{c.crop_interest || '—'}</td>
                    <td style={S.td}><span style={S.badge(c.payment_status === 'paid')}>{c.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}</span></td>
                    <td style={S.td}><span style={S.sBadge(c.status)}>{c.status || 'pending'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SEARCHES TAB */}
        {tab === 'searches' && (
          <div style={S.card}>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Fecha</th><th style={S.th}>Nombre</th><th style={S.th}>Contacto</th><th style={S.th}>Cultivo</th><th style={S.th}>Volumen</th><th style={S.th}>Región</th><th style={S.th}>Estado</th></tr></thead>
              <tbody>
                {searches.length === 0 && !loading && <tr><td colSpan={7} style={{ ...S.td, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 32 }}>Sin búsquedas</td></tr>}
                {searches.map(s => (
                  <tr key={s.id} style={S.row} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={S.td}><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.created_at ? new Date(s.created_at).toLocaleDateString('es-MX') : '—'}</span></td>
                    <td style={S.td}><strong>{s.name || '—'}</strong></td>
                    <td style={S.td}>
                      {s.phone && <div><a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', fontSize: 13 }}>📱 {s.phone}</a></div>}
                      {s.email && <div><a href={`mailto:${s.email}`} style={{ color: '#4ade80', fontSize: 12 }}>{s.email}</a></div>}
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Prefiere: {s.contact_preference || 'whatsapp'}</span>
                    </td>
                    <td style={S.td}><span style={{ color: '#4ade80', fontWeight: 600 }}>{s.crop_interest || '—'}</span></td>
                    <td style={S.td}>{s.volume || '—'}</td>
                    <td style={S.td}>{s.region_preference || '—'}</td>
                    <td style={S.td}>
                      <select value={s.status || 'new'} onChange={async (e) => {
                        try { await af('update', 'search_requests', { id: s.id, data: { status: e.target.value } }); await loadAll(); showToast('Estado actualizado'); } catch (err) { showToast('Error: ' + err.message, 'err'); }
                      }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: 12, fontFamily: FB, cursor: 'pointer' }}>
                        <option value="new" style={{ background: '#1a1a1a' }}>🆕 Nuevo</option>
                        <option value="searching" style={{ background: '#1a1a1a' }}>🔍 Buscando</option>
                        <option value="found" style={{ background: '#1a1a1a' }}>✅ Encontrado</option>
                        <option value="contacted" style={{ background: '#1a1a1a' }}>📞 Contactado</option>
                        <option value="closed" style={{ background: '#1a1a1a' }}>🤝 Cerrado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====== PRODUCER MODAL (NEW + EDIT) ====== */}
      {editProd && (<div style={S.overlay} onClick={e => e.target === e.currentTarget && closeModal()}><div style={S.modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{editProd === 'new' ? '➕ Nuevo productor' : <>Editar: <span style={{ color: '#4ade80' }}>{editProd.id}</span></>}</div>
          <button style={S.btnOut} onClick={closeModal}>✕ Cerrar</button>
        </div>

        {/* Basic Info */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Información básica</div>
          <div style={S.grid2}>
            <Field label="ID del productor *">
              <input style={S.input} value={form.id || ''} onChange={e => updateForm('id', e.target.value.toUpperCase())} placeholder="BC-1025" disabled={editProd !== 'new'} />
            </Field>
            <Field label="Región *">
              <select style={S.select} value={form.region || ''} onChange={e => updateForm('region', e.target.value)}>
                {REGIONS.map(r => <option key={r} value={r} style={{ background: '#1a1a1a' }}>{r}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Cultivos * (separar por comas)">
            <input style={S.input} value={form.crops || ''} onChange={e => updateForm('crops', e.target.value)} placeholder="Red Beet, Candy Beet, Gold Beet" />
          </Field>
          <div style={S.grid3}>
            <Field label="Capacidad"><input style={S.input} value={form.capacity || ''} onChange={e => updateForm('capacity', e.target.value)} placeholder="300+ Sacks" /></Field>
            <Field label="Temporada"><input style={S.input} value={form.season || ''} onChange={e => updateForm('season', e.target.value)} placeholder="All year round" /></Field>
            <Field label="Hectáreas"><input style={S.input} type="number" value={form.acreage || ''} onChange={e => updateForm('acreage', e.target.value)} placeholder="20" /></Field>
          </div>
          <div style={S.grid2}>
            <Field label="Empaque"><input style={S.input} value={form.packaging || ''} onChange={e => updateForm('packaging', e.target.value)} placeholder="Saco" /></Field>
            <Field label="Dist. cruce fronterizo"><input style={S.input} value={form.borderCrossingDistance || ''} onChange={e => updateForm('borderCrossingDistance', e.target.value)} placeholder="2 horas a garita de Otay" /></Field>
          </div>
          <div style={S.grid2}>
            <Field label="Certificaciones (comas)"><input style={S.input} value={form.certifications || ''} onChange={e => updateForm('certifications', e.target.value)} placeholder="Organic, USDA" /></Field>
            <Field label="Tipo de venta">
              <select style={S.select} value={form.salesType || 'EXPORT'} onChange={e => updateForm('salesType', e.target.value)}>
                <option value="EXPORT" style={{ background: '#1a1a1a' }}>EXPORT</option>
                <option value="DOMESTIC" style={{ background: '#1a1a1a' }}>DOMESTIC</option>
              </select>
            </Field>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <input type="checkbox" checked={!!form.verified} onChange={e => updateForm('verified', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#4ade80' }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Verificado en campo</span>
          </div>
        </div>

        {/* Photos */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Fotos</div>
          <div style={S.photoGrid}>
            {(form.photos || []).map((url, i) => (
              <div key={i} style={S.photoItem}>
                <img src={url} style={S.photoThumb} alt={`Foto ${i + 1}`} />
                <button style={S.photoRemove} onClick={() => removePhoto(i)}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            <button style={S.btnSm} onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? '⏳ Subiendo...' : '📷 Agregar foto'}
            </button>
          </div>
        </div>

        {/* Prices */}
        <div style={S.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={S.sectionTitle}>Precios</div>
            <button style={S.btnSm} onClick={addPrice}>+ Agregar precio</button>
          </div>
          {(form.prices || []).length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Sin precios. Agrega uno.</div>}
          {(form.prices || []).map((p, i) => (
            <div key={i} style={S.priceRow}>
              <input style={{ ...S.priceInput, width: 120 }} value={p.crop || ''} onChange={e => updatePrice(i, 'crop', e.target.value)} placeholder="Cultivo" />
              <input style={{ ...S.priceInput, width: 80 }} value={p.unit || ''} onChange={e => updatePrice(i, 'unit', e.target.value)} placeholder="Unidad" />
              <input style={{ ...S.priceInput, width: 80 }} type="number" value={p.price_min || ''} onChange={e => updatePrice(i, 'price_min', e.target.value)} placeholder="USD" />
              <input style={{ ...S.priceInput, width: 80 }} type="number" value={p.price_mxn || ''} onChange={e => updatePrice(i, 'price_mxn', e.target.value)} placeholder="MXN" />
              <button style={S.btnDel} onClick={() => removePrice(i)}>✕</button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button style={{ ...S.btn, flex: 1 }} onClick={saveProducer} disabled={saving}>
            {saving ? 'Guardando...' : editProd === 'new' ? 'Crear productor' : 'Guardar cambios'}
          </button>
          {editProd !== 'new' && !confirmDel && (
            <button style={S.btnDel} onClick={() => setConfirmDel(true)}>🗑 Eliminar</button>
          )}
          {editProd !== 'new' && confirmDel && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#f87171' }}>¿Seguro?</span>
              <button style={{ ...S.btnDel, background: '#ef4444', color: '#fff' }} onClick={deleteProducer}>Sí, eliminar</button>
              <button style={S.btnOut} onClick={() => setConfirmDel(false)}>Cancelar</button>
            </div>
          )}
        </div>
      </div></div>)}

      {/* ====== CONNECTION DETAIL MODAL ====== */}
      {viewConn && (<div style={S.overlay} onClick={e => e.target === e.currentTarget && setViewConn(null)}><div style={S.modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Solicitud de conexión</div>
          <button style={S.btnOut} onClick={() => setViewConn(null)}>✕ Cerrar</button>
        </div>
        <div style={S.section}>
          <div style={S.sectionTitle}>Comprador</div>
          <div style={S.grid2}>
            <div><span style={S.label}>Nombre</span><div style={{ fontSize: 15, fontWeight: 600 }}>{viewConn.buyer_name}</div></div>
            <div><span style={S.label}>Empresa</span><div>{viewConn.company_name || '—'}</div></div>
            <div><span style={S.label}>Email</span><div><a href={`mailto:${viewConn.buyer_email}`} style={{ color: '#4ade80' }}>{viewConn.buyer_email}</a></div></div>
            <div><span style={S.label}>Teléfono</span><div><a href={`tel:${viewConn.buyer_phone}`} style={{ color: '#4ade80' }}>{viewConn.buyer_phone}</a></div></div>
          </div>
        </div>
        <div style={S.section}>
          <div style={S.sectionTitle}>Solicitud</div>
          <div style={S.grid2}>
            <div><span style={S.label}>Productor</span><div style={{ color: '#4ade80', fontWeight: 700 }}>{viewConn.producer_id}</div></div>
            <div><span style={S.label}>Cultivo</span><div>{viewConn.crop_interest}</div></div>
            <div><span style={S.label}>Volumen</span><div>{viewConn.volume}</div></div>
            <div><span style={S.label}>Timeline</span><div>{viewConn.timeline}</div></div>
            <div><span style={S.label}>Entrega</span><div>{viewConn.delivery_preference}</div></div>
            <div><span style={S.label}>Pago</span><div><span style={S.badge(viewConn.payment_status === 'paid')}>{viewConn.payment_status === 'paid' ? 'Pagado ✓' : 'Pendiente'}</span></div></div>
          </div>
          {viewConn.notes && <div style={{ marginTop: 12 }}><span style={S.label}>Notas</span><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{viewConn.notes}</div></div>}
        </div>
        <div style={S.section}>
          <div style={S.sectionTitle}>Estado de la conexión</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['paid', 'contacted', 'connected', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => updateConnStatus(viewConn, s)} style={{ ...S.sBadge(s), cursor: 'pointer', border: viewConn.status === s ? '2px solid currentColor' : '2px solid transparent', padding: '6px 14px', fontSize: 13 }}>
                {s === 'paid' ? '💰 Pagado' : s === 'contacted' ? '📞 Contactado' : s === 'connected' ? '🤝 Conectado' : s === 'completed' ? '✅ Completado' : '❌ Cancelado'}
              </button>
            ))}
          </div>
        </div>
      </div></div>)}

      {toast.msg && <div style={toast.type === 'err' ? S.toastErr : S.toast}>{toast.msg}</div>}
    </div>
  )
}
