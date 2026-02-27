import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const ADMIN_PASSWORD = 'growi2025admin'

const s = {
  page: { minHeight: '100vh', background: '#0a0f0a', fontFamily: "'Outfit', sans-serif", color: '#fff' },
  loginWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  loginCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 48, width: 360, textAlign: 'center' },
  loginTitle: { fontSize: 28, fontWeight: 700, color: '#4ade80', marginBottom: 8 },
  loginSub: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 },
  input: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 16 },
  btn: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  btnSm: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  btnLogout: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 20px', fontSize: 13, cursor: 'pointer' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  headerTitle: { fontSize: 22, fontWeight: 700, color: '#4ade80' },
  main: { padding: '32px' },
  statsRow: { display: 'flex', gap: 16, marginBottom: 32 },
  statCard: { flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' },
  statNum: { fontSize: 36, fontWeight: 700, color: '#4ade80' },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'rgba(255,255,255,0.9)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: 1 },
  td: { padding: '12px 12px', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' },
  row: { cursor: 'pointer', transition: 'background 0.15s' },
  badge: (v) => ({ display: 'inline-block', borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600, background: v ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', color: v ? '#4ade80' : 'rgba(255,255,255,0.4)' }),
  dot: (ok) => ({ width: 10, height: 10, borderRadius: '50%', background: ok ? '#4ade80' : '#ef4444', display: 'inline-block' }),
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { background: '#111a11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 32 },
  modalTitle: { fontSize: 20, fontWeight: 700, marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' },
  publicSection: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20, marginBottom: 24 },
  privateSection: { border: '1px solid rgba(74,222,128,0.15)', borderRadius: 14, padding: 20, marginBottom: 24 },
  readField: { marginBottom: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  readLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 12, marginRight: 8 },
  formRow: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 },
  toast: { position: 'fixed', bottom: 32, right: 32, background: '#4ade80', color: '#0a0f0a', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, zIndex: 9999, boxShadow: '0 4px 24px rgba(74,222,128,0.3)' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 },
  solicRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 120px 140px', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, alignItems: 'start' },
  solicHead: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 120px 140px', gap: 12, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 },
}

function hasPrivateData(p) {
  return !!(p.ranch_name && p.producer_name && p.phone && p.email)
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('growi_admin') === '1')
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [producers, setProducers] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (authed) loadData()
  }, [authed])

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

  function openModal(producer) {
    setSelected(producer)
    setForm({
      ranch_name: producer.ranch_name || '',
      producer_name: producer.producer_name || '',
      phone: producer.phone || '',
      email: producer.email || '',
      office_phone: producer.office_phone || '',
      exact_location: producer.exact_location || '',
      notes: producer.notes || '',
    })
  }

  async function saveProducer() {
    setSaving(true)
    const { error } = await supabase.from('producers').update(form).eq('id', selected.id)
    setSaving(false)
    if (!error) {
      setProducers(ps => ps.map(p => p.id === selected.id ? { ...p, ...form } : p))
      setSelected(prev => ({ ...prev, ...form }))
      showToast('Guardado correctamente')
    } else {
      showToast('Error al guardar: ' + error.message)
    }
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const totalProducers = producers.length
  const verified = producers.filter(p => p.verified).length
  const withData = producers.filter(p => hasPrivateData(p)).length

  if (!authed) {
    return (
      <div style={s.page}>
        <div style={s.loginWrap}>
          <div style={s.loginCard}>
            <div style={s.loginTitle}>Growi Admin</div>
            <div style={s.loginSub}>Panel de administración</div>
            <input
              style={s.input}
              type="password"
              placeholder="Contraseña"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwErr('') }}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
            {pwErr && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{pwErr}</div>}
            <button style={s.btn} onClick={login}>Entrar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerTitle}>Growi Admin</div>
        <button style={s.btnLogout} onClick={logout}>Cerrar sesión</button>
      </div>
      <div style={s.main}>
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

        <div style={s.sectionTitle}>Productores {loading && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Cargando...</span>}</div>
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
                <tr
                  key={p.id}
                  style={s.row}
                  onClick={() => openModal(p)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
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

        <div style={s.sectionTitle}>Solicitudes premium</div>
        <div style={s.card}>
          <div style={s.solicHead}>
            <span>Nombre</span>
            <span>Cultivo</span>
            <span>Región</span>
            <span>Detalles</span>
            <span>Status</span>
            <span>Fecha</span>
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

      {selected && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={s.modalTitle}>Productor: <span style={{ color: '#4ade80' }}>{selected.id}</span></div>
              <button style={s.btnLogout} onClick={() => setSelected(null)}>✕ Cerrar</button>
            </div>

            <div style={s.publicSection}>
              <div style={s.sectionLabel}>Datos públicos (solo lectura)</div>
              <div style={s.readField}><span style={s.readLabel}>ID:</span>{selected.id}</div>
              <div style={s.readField}><span style={s.readLabel}>Región:</span>{selected.region || '—'}</div>
              <div style={s.readField}><span style={s.readLabel}>Cultivos:</span>{Array.isArray(selected.crops) ? selected.crops.join(', ') : (selected.crops || '—')}</div>
              <div style={s.readField}><span style={s.readLabel}>Capacidad:</span>{selected.capacity || '—'}</div>
              <div style={s.readField}><span style={s.readLabel}>Hectáreas:</span>{selected.hectares || '—'}</div>
              <div style={s.readField}><span style={s.readLabel}>Temporada:</span>{selected.season || '—'}</div>
              <div style={s.readField}><span style={s.readLabel}>Certificaciones:</span>{Array.isArray(selected.certifications) ? selected.certifications.join(', ') : (selected.certifications || '—')}</div>
              <div style={s.readField}><span style={s.readLabel}>Verificado:</span><span style={s.badge(selected.verified)}>{selected.verified ? 'Sí' : 'No'}</span></div>
            </div>

            <div style={s.privateSection}>
              <div style={s.sectionLabel}>Datos privados (editable)</div>
              {[
                { key: 'ranch_name', label: 'Nombre del rancho' },
                { key: 'producer_name', label: 'Nombre del productor' },
                { key: 'phone', label: 'Teléfono' },
                { key: 'email', label: 'Email' },
                { key: 'office_phone', label: 'Teléfono oficina' },
                { key: 'exact_location', label: 'Ubicación exacta' },
              ].map(({ key, label }) => (
                <div key={key} style={s.formRow}>
                  <label style={s.label}>{label}</label>
                  <input
                    style={s.input}
                    type="text"
                    value={form[key] || ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div style={s.formRow}>
                <label style={s.label}>Notas</label>
                <textarea
                  style={s.textarea}
                  value={form.notes || ''}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <button style={s.btn} onClick={saveProducer} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  )
}
