import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const ADMIN_PASSWORD = 'growi2025admin'

const s = {
  page: { minHeight: '100vh', background: '#0a0f0a', fontFamily: "'Outfit', sans-serif", color: '#fff' },
  loginWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  loginCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 48, width: 360, textAlign: 'center' },
  loginTitle: { fontSize: 28, fontWeight: 700, color: '#4ade80', marginBottom: 8 },
  loginSub: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 },
  input: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 0 },
  inputError: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid #ef4444', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 0 },
  btn: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  btnSm: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  btnSmOutline: { background: 'transparent', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  btnLogout: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 20px', fontSize: 13, cursor: 'pointer' },
  btnDelete: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: 100, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnSave: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  headerTitle: { fontSize: 22, fontWeight: 700, color: '#4ade80' },
  main: { padding: '32px' },
  statsRow: { display: 'flex', gap: 16, marginBottom: 32 },
  statCard: { flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' },
  statNum: { fontSize: 36, fontWeight: 700, color: '#4ade80' },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: 1 },
  td: { padding: '12px 12px', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' },
  row: { cursor: 'pointer', transition: 'background 0.15s' },
  badge: (v) => ({ display: 'inline-block', borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600, background: v ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', color: v ? '#4ade80' : 'rgba(255,255,255,0.4)' }),
  dot: (ok) => ({ width: 10, height: 10, borderRadius: '50%', background: ok ? '#4ade80' : '#ef4444', display: 'inline-block' }),
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { background: '#111a11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 32 },
  modalConfirm: { background: '#1a1010', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, width: '100%', maxWidth: 440, padding: 32 },
  modalTitle: { fontSize: 20, fontWeight: 700, marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' },
  publicSection: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 24 },
  privateSection: { border: '1px solid rgba(74,222,128,0.15)', borderRadius: 14, padding: 20, marginBottom: 24 },
  formRow: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 },
  select: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', appearance: 'none' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 },
  toast: { position: 'fixed', bottom: 32, right: 32, background: '#4ade80', color: '#0a0f0a', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, zIndex: 9999, boxShadow: '0 4px 24px rgba(74,222,128,0.3)' },
  toastErr: { position: 'fixed', bottom: 32, right: 32, background: '#ef4444', color: '#fff', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, zIndex: 9999 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 },
  solicRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 120px 140px', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, alignItems: 'start' },
  solicHead: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 120px 140px', gap: 12, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 },
  divider: { borderTop: '1px solid rgba(255,255,255,0.06)', margin: '20px 0' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' },
}

const EMPTY_FORM = {
  id: '', region: '', crops: '', capacity: '', acreage: '', certifications: '',
  salesType: 'EXPORT', verified: false, season: '',
  ranchName: '', producerName: '', phone: '', email: '',
  officePhone: '', exactLocation: '', notes: '',
}

function hasPrivateData(p) {
  return !!(p.ranch_name && p.producer_name && p.phone && p.email)
}

function producerToForm(p) {
  return {
    id: p.id || '',
    region: p.region || '',
    crops: Array.isArray(p.crops) ? p.crops.join(', ') : (p.crops || ''),
    capacity: p.capacity || '',
    acreage: p.acreage != null ? String(p.acreage) : '',
    certifications: Array.isArray(p.certifications) ? p.certifications.join(', ') : (p.certifications || ''),
    salesType: p.sales_type || p.salesType || 'EXPORT',
    verified: !!p.verified,
    season: p.season || '',
    ranchName: p.ranch_name || '',
    producerName: p.producer_name || '',
    phone: p.phone || '',
    email: p.email || '',
    officePhone: p.office_phone || '',
    exactLocation: p.exact_location || '',
    notes: p.notes || '',
  }
}

function FormInput({ label, value, onChange, placeholder, type = 'text', error = false }) {
  return (
    <div style={s.formRow}>
      <label style={s.label}>{label}</label>
      <input
        style={error ? s.inputError : s.input}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ''}
      />
      {error && <span style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'block' }}>Campo requerido</span>}
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('growi_admin') === '1')
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [producers, setProducers] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)

  // Modal estados
  const [editModal, setEditModal] = useState(null)   // producer object being edited
  const [newModal, setNewModal] = useState(false)    // crear nuevo
  const [confirmDelete, setConfirmDelete] = useState(null) // producer id to delete

  const [form, setForm] = useState({})
  const [newForm, setNewForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'ok' })

  useEffect(() => { if (authed) loadData() }, [authed])

  async function loadData() {
    setLoading(true)
    const [{ data: prod }, { data: solic }] = await Promise.all([
      supabase.from('producers').select('*').order('id'),
      supabase.from('solicitudes').select('*').order('created_at', { ascending: false })
    ])
    setProducers(prod || [])
    setSolicitudes(solic || [])
    setLoading(false)
  }

  function login() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('growi_admin', '1')
      setAuthed(true)
    } else {
      setPwErr('Contraseña incorrecta')
    }
  }

  function logout() {
    sessionStorage.removeItem('growi_admin')
    setAuthed(false)
  }

  function openEdit(producer) {
    setEditModal(producer)
    setForm(producerToForm(producer))
    setErrors({})
  }

  function openNew() {
    setNewForm(EMPTY_FORM)
    setErrors({})
    setNewModal(true)
  }

  // Guardar edición
  async function saveEdit() {
    setSaving(true)
    const payload = {
      region: form.region,
      crops: form.crops.split(',').map(c => c.trim()).filter(Boolean),
      capacity: form.capacity,
      acreage: parseInt(form.acreage) || null,
      certifications: form.certifications.split(',').map(c => c.trim()).filter(Boolean),
      sales_type: form.salesType,
      verified: form.verified,
      season: form.season,
      ranch_name: form.ranchName,
      producer_name: form.producerName,
      phone: form.phone,
      email: form.email,
      office_phone: form.officePhone,
      exact_location: form.exactLocation,
      notes: form.notes,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('producers').update(payload).eq('id', editModal.id)
    setSaving(false)
    if (!error) {
      await loadData()
      setEditModal(null)
      showToast('Guardado correctamente', 'ok')
    } else {
      showToast('Error: ' + error.message, 'err')
    }
  }

  // Crear nuevo
  async function createProducer() {
    const errs = {}
    if (!newForm.id.trim()) errs.id = true
    if (!newForm.region.trim()) errs.region = true
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    const payload = {
      id: newForm.id.trim().toUpperCase(),
      region: newForm.region,
      crops: newForm.crops.split(',').map(c => c.trim()).filter(Boolean),
      capacity: newForm.capacity,
      acreage: parseInt(newForm.acreage) || null,
      certifications: newForm.certifications.split(',').map(c => c.trim()).filter(Boolean),
      sales_type: newForm.salesType,
      verified: newForm.verified,
      season: newForm.season,
      ranch_name: newForm.ranchName,
      producer_name: newForm.producerName,
      phone: newForm.phone,
      email: newForm.email,
      office_phone: newForm.officePhone,
      exact_location: newForm.exactLocation,
      notes: newForm.notes,
    }
    const { error } = await supabase.from('producers').insert(payload)
    setSaving(false)
    if (!error) {
      await loadData()
      setNewModal(false)
      showToast('Productor agregado', 'ok')
    } else {
      showToast('Error: ' + error.message, 'err')
    }
  }

  // Eliminar
  async function deleteProducer() {
    if (!confirmDelete) return
    setDeleting(true)
    const { error } = await supabase.from('producers').delete().eq('id', confirmDelete)
    setDeleting(false)
    if (!error) {
      await loadData()
      setConfirmDelete(null)
      setEditModal(null)
      showToast('Productor eliminado', 'ok')
    } else {
      showToast('Error: ' + error.message, 'err')
    }
  }

  function showToast(msg, type = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'ok' }), 3500)
  }

  const totalProducers = producers.length
  const verified = producers.filter(p => p.verified).length
  const withData = producers.filter(p => hasPrivateData(p)).length

  // ---- Pantalla de login ----
  if (!authed) {
    return (
      <div style={s.page}>
        <div style={s.loginWrap}>
          <div style={s.loginCard}>
            <div style={s.loginTitle}>Growi Admin</div>
            <div style={s.loginSub}>Panel de administración</div>
            <input style={{ ...s.input, marginBottom: 16 }} type="password" placeholder="Contraseña" value={pw}
              onChange={e => { setPw(e.target.value); setPwErr('') }}
              onKeyDown={e => e.key === 'Enter' && login()} />
            {pwErr && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{pwErr}</div>}
            <button style={s.btn} onClick={login}>Entrar</button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Bloque reutilizable: campos públicos editables ----
  function PublicFields({ f, setF, errs = {} }) {
    return (
      <>
        <div style={s.formRow}>
          <label style={s.label}>ID <span style={{ color: 'rgba(255,255,255,0.2)' }}>(solo lectura)</span></label>
          <input style={{ ...s.input, opacity: 0.5, cursor: 'not-allowed' }} type="text" value={f.id} readOnly />
        </div>
        <FormInput label="Región *" value={f.region} onChange={e => setF(x => ({ ...x, region: e.target.value }))} error={!!errs.region} />
        <FormInput label="Cultivos" value={f.crops} onChange={e => setF(x => ({ ...x, crops: e.target.value }))} placeholder="Separar por comas" />
        <FormInput label="Capacidad" value={f.capacity} onChange={e => setF(x => ({ ...x, capacity: e.target.value }))} />
        <FormInput label="Hectáreas" type="number" value={f.acreage} onChange={e => setF(x => ({ ...x, acreage: e.target.value }))} />
        <FormInput label="Certificaciones" value={f.certifications} onChange={e => setF(x => ({ ...x, certifications: e.target.value }))} placeholder="Separar por comas" />
        <div style={s.formRow}>
          <label style={s.label}>Tipo de venta</label>
          <select style={s.select} value={f.salesType} onChange={e => setF(x => ({ ...x, salesType: e.target.value }))}>
            <option value="EXPORT" style={{ background: '#1a1a1a' }}>EXPORT</option>
            <option value="DOMESTIC" style={{ background: '#1a1a1a' }}>DOMESTIC</option>
          </select>
        </div>
        <FormInput label="Temporada" value={f.season} onChange={e => setF(x => ({ ...x, season: e.target.value }))} />
        <div style={s.checkRow}>
          <input type="checkbox" id="verified-cb" checked={!!f.verified} onChange={e => setF(x => ({ ...x, verified: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: '#4ade80', cursor: 'pointer' }} />
          <label htmlFor="verified-cb" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Verificado</label>
        </div>
      </>
    )
  }

  // ---- Bloque reutilizable: campos privados ----
  function PrivateFields({ f, setF }) {
    return (
      <>
        {[
          { key: 'ranchName', label: 'Nombre del rancho' },
          { key: 'producerName', label: 'Nombre del productor' },
          { key: 'phone', label: 'Teléfono' },
          { key: 'email', label: 'Email' },
          { key: 'officePhone', label: 'Teléfono oficina' },
          { key: 'exactLocation', label: 'Ubicación exacta' },
        ].map(({ key, label }) => (
          <div key={key} style={s.formRow}>
            <label style={s.label}>{label}</label>
            <input style={s.input} type="text" value={f[key] || ''} onChange={e => setF(x => ({ ...x, [key]: e.target.value }))} />
          </div>
        ))}
        <div style={s.formRow}>
          <label style={s.label}>Notas</label>
          <textarea style={s.textarea} value={f.notes || ''} onChange={e => setF(x => ({ ...x, notes: e.target.value }))} />
        </div>
      </>
    )
  }

  // ======== RENDER PRINCIPAL ========
  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerTitle}>Growi Admin</div>
        <button style={s.btnLogout} onClick={logout}>Cerrar sesión</button>
      </div>

      <div style={s.main}>
        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statNum}>{totalProducers}</div>
            <div style={s.statLabel}>Total productores</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>{verified}</div>
            <div style={s.statLabel}>Verificados</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>{withData}</div>
            <div style={s.statLabel}>Con datos privados completos</div>
          </div>
        </div>

        {/* Header productores + botón agregar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 10 }}>
            Productores
            {loading && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Cargando...</span>}
          </div>
          <button style={s.btnSm} onClick={openNew}>+ Agregar productor</button>
        </div>

        {/* Tabla productores */}
        <div style={s.card}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Región</th>
                <th style={s.th}>Primer cultivo</th>
                <th style={s.th}>Verificado</th>
                <th style={s.th}>Datos privados</th>
              </tr>
            </thead>
            <tbody>
              {producers.map(p => (
                <tr key={p.id} style={s.row} onClick={() => openEdit(p)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={s.td}><span style={{ fontFamily: 'monospace', color: '#4ade80' }}>{p.id}</span></td>
                  <td style={s.td}>{p.region || '—'}</td>
                  <td style={s.td}>{Array.isArray(p.crops) ? p.crops[0] : (p.crops || '—')}</td>
                  <td style={s.td}><span style={s.badge(p.verified)}>{p.verified ? 'Verificado' : 'No verificado'}</span></td>
                  <td style={s.td}><span style={s.dot(hasPrivateData(p))} title={hasPrivateData(p) ? 'Completo' : 'Incompleto'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Solicitudes */}
        <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 16 }}>Solicitudes premium</div>
        <div style={s.card}>
          <div style={s.solicHead}>
            <span>Nombre</span><span>Cultivo</span><span>Región</span><span>Detalles</span><span>Status</span><span>Fecha</span>
          </div>
          {solicitudes.length === 0 && !loading && (
            <div style={{ padding: 24, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Sin solicitudes</div>
          )}
          {solicitudes.map((sol, i) => (
            <div key={sol.id || i} style={s.solicRow}>
              <span>{sol.name || sol.nombre || '—'}</span>
              <span>{sol.crop || sol.cultivo || '—'}</span>
              <span>{sol.region || '—'}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{sol.details || sol.detalles || '—'}</span>
              <span><span style={s.badge(sol.status === 'activo')}>{sol.status || '—'}</span></span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{sol.created_at ? new Date(sol.created_at).toLocaleDateString('es-MX') : '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MODAL EDITAR PRODUCTOR ===== */}
      {editModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setEditModal(null)}>
          <div style={s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={s.modalTitle}>
                Productor: <span style={{ color: '#4ade80' }}>{editModal.id}</span>
              </div>
              <button style={s.btnLogout} onClick={() => setEditModal(null)}>✕ Cerrar</button>
            </div>

            {/* Datos públicos editables */}
            <div style={s.publicSection}>
              <div style={s.sectionLabel}>Datos públicos (editable)</div>
              <PublicFields f={form} setF={setForm} errs={errors} />
            </div>

            {/* Datos privados */}
            <div style={s.privateSection}>
              <div style={s.sectionLabel}>Datos privados (editable)</div>
              <PrivateFields f={form} setF={setForm} />
            </div>

            {/* Botón guardar */}
            <button style={s.btnSave} onClick={saveEdit} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            {/* Zona de peligro: eliminar */}
            <div style={s.divider} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Zona de peligro</span>
              <button style={s.btnDelete} onClick={() => setConfirmDelete(editModal.id)}>
                Eliminar productor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL NUEVO PRODUCTOR ===== */}
      {newModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setNewModal(false)}>
          <div style={s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={s.modalTitle}>Nuevo productor</div>
              <button style={s.btnLogout} onClick={() => setNewModal(false)}>✕ Cerrar</button>
            </div>

            {/* Datos públicos */}
            <div style={s.publicSection}>
              <div style={s.sectionLabel}>Datos públicos</div>
              {/* ID es editable en el modal de creación */}
              <div style={s.formRow}>
                <label style={s.label}>ID * <span style={{ color: 'rgba(255,255,255,0.3)' }}>(ej: BC-1014)</span></label>
                <input
                  style={errors.id ? s.inputError : s.input}
                  type="text"
                  value={newForm.id}
                  onChange={e => { setNewForm(x => ({ ...x, id: e.target.value })); setErrors(err => ({ ...err, id: false })) }}
                  placeholder="BC-XXXX"
                />
                {errors.id && <span style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'block' }}>Campo requerido</span>}
              </div>
              <FormInput label="Región *" value={newForm.region}
                onChange={e => { setNewForm(x => ({ ...x, region: e.target.value })); setErrors(err => ({ ...err, region: false })) }}
                error={!!errors.region} />
              <FormInput label="Cultivos" value={newForm.crops} onChange={e => setNewForm(x => ({ ...x, crops: e.target.value }))} placeholder="Separar por comas" />
              <FormInput label="Capacidad" value={newForm.capacity} onChange={e => setNewForm(x => ({ ...x, capacity: e.target.value }))} />
              <FormInput label="Hectáreas" type="number" value={newForm.acreage} onChange={e => setNewForm(x => ({ ...x, acreage: e.target.value }))} />
              <FormInput label="Certificaciones" value={newForm.certifications} onChange={e => setNewForm(x => ({ ...x, certifications: e.target.value }))} placeholder="Separar por comas" />
              <div style={s.formRow}>
                <label style={s.label}>Tipo de venta</label>
                <select style={s.select} value={newForm.salesType} onChange={e => setNewForm(x => ({ ...x, salesType: e.target.value }))}>
                  <option value="EXPORT" style={{ background: '#1a1a1a' }}>EXPORT</option>
                  <option value="DOMESTIC" style={{ background: '#1a1a1a' }}>DOMESTIC</option>
                </select>
              </div>
              <FormInput label="Temporada" value={newForm.season} onChange={e => setNewForm(x => ({ ...x, season: e.target.value }))} />
              <div style={s.checkRow}>
                <input type="checkbox" id="new-verified-cb" checked={!!newForm.verified}
                  onChange={e => setNewForm(x => ({ ...x, verified: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: '#4ade80', cursor: 'pointer' }} />
                <label htmlFor="new-verified-cb" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Verificado</label>
              </div>
            </div>

            {/* Datos privados */}
            <div style={s.privateSection}>
              <div style={s.sectionLabel}>Datos privados</div>
              <PrivateFields f={newForm} setF={setNewForm} />
            </div>

            <button style={s.btnSave} onClick={createProducer} disabled={saving}>
              {saving ? 'Guardando...' : 'Crear productor'}
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL CONFIRMAR ELIMINACIÓN ===== */}
      {confirmDelete && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div style={s.modalConfirm}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f87171', marginBottom: 16 }}>
              ¿Eliminar productor?
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 28 }}>
              ¿Estás seguro de eliminar el productor <strong style={{ color: '#fff' }}>{confirmDelete}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ ...s.btnDelete, flex: 1 }} onClick={deleteProducer} disabled={deleting}>
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button style={{ ...s.btnLogout, flex: 1 }} onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div style={toast.type === 'err' ? s.toastErr : s.toast}>{toast.msg}</div>
      )}
    </div>
  )
                    }
