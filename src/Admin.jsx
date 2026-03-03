import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'growi2025admin'
const API = 'https://ieujjmvwdoqomqyzgaqf.supabase.co/functions/v1/admin-api'
const FB = "'Outfit', sans-serif"

async function af(action, table, opts = {}) {
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: ADMIN_PASSWORD, action, table, data: opts.data, id: opts.id }) })
  const json = await res.json()
  if (!res.ok || json.error) throw new Error(json.error || 'Error')
  return json.data
}

const st = {
  page: { minHeight: '100vh', background: '#0a0f0a', fontFamily: FB, color: '#fff' },
  loginWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  loginCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 48, width: 360, textAlign: 'center' },
  input: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  btnSm: { background: '#4ade80', color: '#0a0f0a', border: 'none', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  btnOut: { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 20px', fontSize: 13, cursor: 'pointer' },
  btnDel: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: 100, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  main: { padding: 32 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', textTransform: 'uppercase', letterSpacing: 1 },
  td: { padding: '12px', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' },
  row: { cursor: 'pointer', transition: 'background 0.15s' },
  badge: (v) => ({ display: 'inline-block', borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600, background: v ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', color: v ? '#4ade80' : 'rgba(255,255,255,0.4)' }),
  sBadge: (s) => {
    const c = { pending: { bg: 'rgba(251,191,36,0.15)', c: '#fbbf24' }, paid: { bg: 'rgba(74,222,128,0.15)', c: '#4ade80' }, contacted: { bg: 'rgba(59,130,246,0.15)', c: '#60a5fa' }, connected: { bg: 'rgba(168,85,247,0.15)', c: '#c084fc' }, completed: { bg: 'rgba(34,197,94,0.25)', c: '#22c55e' }, cancelled: { bg: 'rgba(239,68,68,0.15)', c: '#f87171' } }
    const x = c[s] || c.pending
    return { display: 'inline-block', borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600, background: x.bg, color: x.c }
  },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { background: '#111a11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: 32 },
  section: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 20 },
  label: { display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 },
  formRow: { marginBottom: 14 },
  select: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', appearance: 'none' },
  toast: { position: 'fixed', bottom: 32, right: 32, background: '#4ade80', color: '#0a0f0a', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, zIndex: 9999 },
  toastErr: { position: 'fixed', bottom: 32, right: 32, background: '#ef4444', color: '#fff', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 15, zIndex: 9999 },
  statRow: { display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
  stat: { flex: 1, minWidth: 130, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' },
  statN: { fontSize: 36, fontWeight: 700, color: '#4ade80' },
  statL: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  tab: (active) => ({ padding: '10px 24px', borderRadius: 100, border: 'none', fontFamily: FB, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: active ? '#4ade80' : 'rgba(255,255,255,0.06)', color: active ? '#0a0f0a' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }),
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('growi_admin') === '1')
  const [pw, setPw] = useState(''), [pwErr, setPwErr] = useState('')
  const [tab, setTab] = useState('connections')
  const [producers, setProducers] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(false)
  const [editProd, setEditProd] = useState(null)
  const [viewConn, setViewConn] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'ok' })

  useEffect(() => { if (authed) loadAll() }, [authed])

  async function loadAll() {
    setLoading(true)
    try {
      const [prod, conn] = await Promise.all([
        af('select', 'producers'),
        af('select', 'connection_requests'),
      ])
      setProducers(prod || [])
      setConnections((conn || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
    } catch (err) { showToast('Error: ' + err.message, 'err') }
    setLoading(false)
  }

  function login() { if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('growi_admin', '1'); setAuthed(true) } else { setPwErr('Contraseña incorrecta') } }
  function logout() { sessionStorage.removeItem('growi_admin'); setAuthed(false) }
  function showToast(msg, type = 'ok') { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'ok' }), 3500) }

  // Producer edit
  function openProd(p) {
    setEditProd(p)
    setForm({
      region: p.region || '', crops: Array.isArray(p.crops) ? p.crops.join(', ') : '', capacity: p.capacity || '',
      acreage: p.acreage != null ? String(p.acreage) : '', certifications: Array.isArray(p.certifications) ? p.certifications.join(', ') : '',
      salesType: p.sales_type || 'EXPORT', verified: !!p.verified, season: p.season || '',
      packaging: p.packaging || '', borderCrossingDistance: p.border_crossing_distance || '',
      prices: Array.isArray(p.prices) ? p.prices : [],
    })
  }

  async function saveProd() {
    setSaving(true)
    try {
      await af('update', 'producers', {
        id: editProd.id,
        data: {
          region: form.region, crops: form.crops.split(',').map(c => c.trim()).filter(Boolean),
          capacity: form.capacity, acreage: parseInt(form.acreage) || null,
          certifications: form.certifications.split(',').map(c => c.trim()).filter(Boolean),
          sales_type: form.salesType, verified: form.verified, season: form.season,
          packaging: form.packaging || null, border_crossing_distance: form.borderCrossingDistance || null,
          prices: form.prices || [], updated_at: new Date().toISOString(),
        }
      })
      await loadAll(); setEditProd(null); showToast('Guardado')
    } catch (err) { showToast('Error: ' + err.message, 'err') }
    setSaving(false)
  }

  // Connection status update
  async function updateConnStatus(conn, newStatus) {
    try {
      await af('update', 'connection_requests', { id: conn.id, data: { status: newStatus, updated_at: new Date().toISOString() } })
      await loadAll()
      if (viewConn) setViewConn({ ...viewConn, status: newStatus })
      showToast('Estado actualizado')
    } catch (err) { showToast('Error: ' + err.message, 'err') }
  }

  const totalProd = producers.length
  const totalConn = connections.length
  const paidConn = connections.filter(c => c.payment_status === 'paid').length
  const pendingConn = connections.filter(c => c.status === 'paid' || c.status === 'pending').length

  if (!authed) {
    return (<div style={st.page}><div style={st.loginWrap}><div style={st.loginCard}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#4ade80', marginBottom: 8 }}>Growi Admin</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>Panel de administración</div>
      <input style={{ ...st.input, marginBottom: 16 }} type="password" placeholder="Contraseña" value={pw} onChange={e => { setPw(e.target.value); setPwErr('') }} onKeyDown={e => e.key === 'Enter' && login()} />
      {pwErr && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{pwErr}</div>}
      <button style={st.btn} onClick={login}>Entrar</button>
    </div></div></div>)
  }

  return (
    <div style={st.page}>
      <div style={st.header}><div style={{ fontSize: 22, fontWeight: 700, color: '#4ade80' }}>Growi Admin</div><button style={st.btnOut} onClick={logout}>Cerrar sesión</button></div>
      <div style={st.main}>
        {/* Stats */}
        <div style={st.statRow}>
          <div style={st.stat}><div style={st.statN}>{totalConn}</div><div style={st.statL}>Solicitudes totales</div></div>
          <div style={st.stat}><div style={st.statN}>{paidConn}</div><div style={st.statL}>Pagadas</div></div>
          <div style={st.stat}><div style={st.statN}>{pendingConn}</div><div style={st.statL}>Por atender</div></div>
          <div style={st.stat}><div style={st.statN}>{totalProd}</div><div style={st.statL}>Productores</div></div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button style={st.tab(tab === 'connections')} onClick={() => setTab('connections')}>Solicitudes de conexión</button>
          <button style={st.tab(tab === 'producers')} onClick={() => setTab('producers')}>Productores</button>
        </div>

        {/* CONNECTIONS TAB */}
        {tab === 'connections' && (
          <div style={st.card}>
            <table style={st.table}>
              <thead><tr>
                <th style={st.th}>Fecha</th><th style={st.th}>Comprador</th><th style={st.th}>Productor</th>
                <th style={st.th}>Cultivo</th><th style={st.th}>Pago</th><th style={st.th}>Estado</th>
              </tr></thead>
              <tbody>
                {connections.length === 0 && !loading && <tr><td colSpan={6} style={{ ...st.td, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 32 }}>Sin solicitudes</td></tr>}
                {connections.map(c => (
                  <tr key={c.id} style={st.row} onClick={() => setViewConn(c)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={st.td}><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('es-MX') : '—'}</span></td>
                    <td style={st.td}><strong>{c.buyer_name || '—'}</strong><br/><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{c.buyer_email}</span></td>
                    <td style={st.td}><span style={{ color: '#4ade80', fontWeight: 700 }}>{c.producer_id}</span></td>
                    <td style={st.td}>{c.crop_interest || '—'}</td>
                    <td style={st.td}><span style={st.badge(c.payment_status === 'paid')}>{c.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}</span></td>
                    <td style={st.td}><span style={st.sBadge(c.status)}>{c.status || 'pending'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCERS TAB */}
        {tab === 'producers' && (
          <div style={st.card}>
            <table style={st.table}>
              <thead><tr><th style={st.th}>ID</th><th style={st.th}>Región</th><th style={st.th}>Cultivo</th><th style={st.th}>Verificado</th></tr></thead>
              <tbody>{producers.map(p => (
                <tr key={p.id} style={st.row} onClick={() => openProd(p)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={st.td}><span style={{ color: '#4ade80', fontWeight: 700 }}>{p.id}</span></td>
                  <td style={st.td}>{p.region || '—'}</td>
                  <td style={st.td}>{Array.isArray(p.crops) ? p.crops[0] : '—'}</td>
                  <td style={st.td}><span style={st.badge(p.verified)}>{p.verified ? 'Sí' : 'No'}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONNECTION DETAIL MODAL */}
      {viewConn && (<div style={st.overlay} onClick={e => e.target === e.currentTarget && setViewConn(null)}><div style={st.modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Solicitud de conexión</div>
          <button style={st.btnOut} onClick={() => setViewConn(null)}>✕ Cerrar</button>
        </div>

        <div style={st.section}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' }}>Comprador</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><span style={st.label}>Nombre</span><div style={{ fontSize: 15, fontWeight: 600 }}>{viewConn.buyer_name}</div></div>
            <div><span style={st.label}>Empresa</span><div>{viewConn.company_name || '—'}</div></div>
            <div><span style={st.label}>Email</span><div><a href={`mailto:${viewConn.buyer_email}`} style={{ color: '#4ade80' }}>{viewConn.buyer_email}</a></div></div>
            <div><span style={st.label}>Teléfono</span><div><a href={`tel:${viewConn.buyer_phone}`} style={{ color: '#4ade80' }}>{viewConn.buyer_phone}</a></div></div>
          </div>
        </div>

        <div style={st.section}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' }}>Solicitud</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><span style={st.label}>Productor</span><div style={{ color: '#4ade80', fontWeight: 700 }}>{viewConn.producer_id}</div></div>
            <div><span style={st.label}>Cultivo</span><div>{viewConn.crop_interest}</div></div>
            <div><span style={st.label}>Volumen</span><div>{viewConn.volume}</div></div>
            <div><span style={st.label}>Timeline</span><div>{viewConn.timeline}</div></div>
            <div><span style={st.label}>Entrega</span><div>{viewConn.delivery_preference}</div></div>
            <div><span style={st.label}>Pago</span><div><span style={st.badge(viewConn.payment_status === 'paid')}>{viewConn.payment_status === 'paid' ? 'Pagado ✓' : 'Pendiente'}</span></div></div>
          </div>
          {viewConn.notes && <div style={{ marginTop: 12 }}><span style={st.label}>Notas</span><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{viewConn.notes}</div></div>}
        </div>

        <div style={st.section}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' }}>Estado de la conexión</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['paid', 'contacted', 'connected', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => updateConnStatus(viewConn, s)} style={{ ...st.sBadge(s), cursor: 'pointer', border: viewConn.status === s ? '2px solid currentColor' : '2px solid transparent', padding: '6px 14px', fontSize: 13 }}>
                {s === 'paid' ? '💰 Pagado' : s === 'contacted' ? '📞 Contactado' : s === 'connected' ? '🤝 Conectado' : s === 'completed' ? '✅ Completado' : '❌ Cancelado'}
              </button>
            ))}
          </div>
        </div>
      </div></div>)}

      {/* PRODUCER EDIT MODAL */}
      {editProd && (<div style={st.overlay} onClick={e => e.target === e.currentTarget && setEditProd(null)}><div style={st.modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Productor: <span style={{ color: '#4ade80' }}>{editProd.id}</span></div>
          <button style={st.btnOut} onClick={() => setEditProd(null)}>✕ Cerrar</button>
        </div>
        <div style={st.section}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 12, textTransform: 'uppercase' }}>Datos del productor</div>
          {[
            { k: 'region', l: 'Región' }, { k: 'crops', l: 'Cultivos (separar por comas)' },
            { k: 'capacity', l: 'Capacidad' }, { k: 'acreage', l: 'Hectáreas' },
            { k: 'certifications', l: 'Certificaciones (separar por comas)' }, { k: 'season', l: 'Temporada' },
            { k: 'packaging', l: 'Empaque' }, { k: 'borderCrossingDistance', l: 'Distancia cruce fronterizo' },
          ].map(({ k, l }) => (
            <div key={k} style={st.formRow}><label style={st.label}>{l}</label><input style={st.input} value={form[k] || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} /></div>
          ))}
          <div style={st.formRow}><label style={st.label}>Tipo de venta</label>
            <select style={st.select} value={form.salesType || 'EXPORT'} onChange={e => setForm(f => ({ ...f, salesType: e.target.value }))}>
              <option value="EXPORT" style={{ background: '#1a1a1a' }}>EXPORT</option><option value="DOMESTIC" style={{ background: '#1a1a1a' }}>DOMESTIC</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
            <input type="checkbox" checked={!!form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#4ade80' }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Verificado</span>
          </div>
        </div>
        <button style={{ ...st.btn, width: 'auto' }} onClick={saveProd} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      </div></div>)}

      {toast.msg && <div style={toast.type === 'err' ? st.toastErr : st.toast}>{toast.msg}</div>}
    </div>
  )
}
