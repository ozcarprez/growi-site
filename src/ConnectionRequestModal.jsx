import { useState } from 'react';

const FB = "'Outfit', sans-serif";
const API = 'https://ieujjmvwdoqomqyzgaqf.supabase.co/functions/v1';

export default function ConnectionRequestModal({ isOpen, onClose, producer, lang = 'es' }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cropInterest, setCropInterest] = useState('');
  const [volume, setVolume] = useState('');
  const [timeline, setTimeline] = useState('');
  const [deliveryPref, setDeliveryPref] = useState('pickup');
  const [notes, setNotes] = useState('');

  if (!isOpen || !producer) return null;
  const es = lang === 'es';

  const timelineOpts = es
    ? ['Lo antes posible', 'Esta semana', 'Este mes', 'Próximo mes', 'Solo explorando']
    : ['ASAP', 'This week', 'This month', 'Next month', 'Just exploring'];

  const features = es
    ? ['Introducción personal con el productor', 'Verificación de disponibilidad y precios', 'Apoyo en la negociación inicial', 'Seguimiento por 7 días']
    : ['Personal introduction with the producer', 'Availability and pricing verification', 'Support in initial negotiation', '7-day follow-up'];

  function goStep2() {
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setError(es ? 'Completa los campos obligatorios' : 'Fill in required fields'); return;
    }
    if (!buyerEmail.includes('@')) { setError(es ? 'Email inválido' : 'Invalid email'); return; }
    setError(''); setStep(2);
  }

  async function handlePay() {
    if (!cropInterest.trim() || !volume.trim()) {
      setError(es ? 'Indica el cultivo y volumen' : 'Specify crop and volume'); return;
    }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/create-connection-checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: buyerName.trim(), buyer_email: buyerEmail.trim(),
          buyer_phone: buyerPhone.trim(), company_name: companyName.trim(),
          producer_id: producer.id, producer_region: producer.region,
          crop_interest: cropInterest, volume: volume.trim(),
          timeline: timeline || (es ? 'No especificado' : 'Not specified'),
          delivery_preference: deliveryPref, notes: notes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Error');
      window.location.href = data.url;
    } catch (err) { setError(err.message); setLoading(false); }
  }

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontFamily: FB, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: FB };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111a11', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 22, padding: '36px 32px', maxWidth: 460, width: '100%', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontFamily: FB }}>✕</button>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FB, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: '#4ade80', padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.05)', marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
            {es ? 'Solicitar conexión' : 'Request connection'}
          </div>
          <p style={{ fontFamily: FB, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
            {es ? 'Completa tus datos y te conecto personalmente con este productor.' : "Fill in your details and I'll personally connect you with this producer."}
          </p>
        </div>

        {/* Producer mini card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: '#4ade80' }}>{producer.id}</span>
            <span style={{ fontFamily: FB, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{producer.region}, B.C.</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {producer.crops.slice(0, 4).map(c => (
              <span key={c} style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.12)' }}>{c}</span>
            ))}
            {producer.crops.length > 4 && <span style={{ fontFamily: FB, fontSize: 11, padding: '3px 8px', color: 'rgba(255,255,255,0.3)' }}>+{producer.crops.length - 4}</span>}
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FB, fontSize: 12, fontWeight: 700, background: '#4ade80', color: '#0a0f0a' }}>1</div>
          <div style={{ width: 60, height: 2, background: step >= 2 ? '#4ade80' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FB, fontSize: 12, fontWeight: 700, background: step >= 2 ? '#4ade80' : 'rgba(255,255,255,0.15)', color: step >= 2 ? '#0a0f0a' : 'rgba(255,255,255,0.3)' }}>2</div>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 14, fontFamily: FB }}>{error}</div>}

        {/* Step 1 */}
        {step === 1 && (<div>
          <h3 style={{ fontFamily: FB, fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>{es ? 'Tus datos' : 'Your info'}</h3>
          <Field label={es ? 'Nombre completo *' : 'Full name *'}><input style={inputStyle} value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder={es ? 'Tu nombre' : 'Your name'} /></Field>
          <Field label="Email *"><input style={inputStyle} type="email" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} placeholder="email@empresa.com" /></Field>
          <Field label={es ? 'Teléfono *' : 'Phone *'}><input style={inputStyle} type="tel" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} placeholder="+52 664 123 4567" /></Field>
          <Field label={es ? 'Empresa (opcional)' : 'Company (optional)'}><input style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder={es ? 'Nombre de tu empresa' : 'Company name'} /></Field>
          <button onClick={goStep2} style={{ width: '100%', padding: 14, border: 'none', borderRadius: 100, background: '#4ade80', color: '#0a0f0a', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>{es ? 'Siguiente →' : 'Next →'}</button>
        </div>)}

        {/* Step 2 */}
        {step === 2 && (<div>
          <h3 style={{ fontFamily: FB, fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>{es ? '¿Qué buscas?' : 'What are you looking for?'}</h3>
          <Field label={es ? '¿Qué cultivo te interesa? *' : 'Which crop? *'}>
            <select style={{ ...inputStyle, appearance: 'none' }} value={cropInterest} onChange={e => setCropInterest(e.target.value)}>
              <option value="" style={{ background: '#1a1a1a' }}>{es ? 'Selecciona...' : 'Select...'}</option>
              {producer.crops.map(c => <option key={c} value={c} style={{ background: '#1a1a1a' }}>{c}</option>)}
              <option value="multiple" style={{ background: '#1a1a1a' }}>{es ? 'Varios cultivos' : 'Multiple crops'}</option>
              <option value="other" style={{ background: '#1a1a1a' }}>{es ? 'Otro' : 'Other'}</option>
            </select>
          </Field>
          <Field label={es ? 'Volumen que necesitas *' : 'Volume needed *'}><input style={inputStyle} value={volume} onChange={e => setVolume(e.target.value)} placeholder={es ? 'Ej: 5 pallets semanales' : 'E.g. 5 pallets weekly'} /></Field>
          <Field label={es ? '¿Para cuándo?' : 'When?'}>
            <select style={{ ...inputStyle, appearance: 'none' }} value={timeline} onChange={e => setTimeline(e.target.value)}>
              <option value="" style={{ background: '#1a1a1a' }}>{es ? 'Selecciona...' : 'Select...'}</option>
              {timelineOpts.map(o => <option key={o} value={o} style={{ background: '#1a1a1a' }}>{o}</option>)}
            </select>
          </Field>
          <Field label={es ? 'Preferencia de entrega' : 'Delivery preference'}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: 'pickup', l: es ? 'Recoger' : 'Pick up' }, { v: 'delivery', l: es ? 'Envío' : 'Delivery' }, { v: 'either', l: es ? 'Cualquiera' : 'Either' }].map(({ v, l }) => (
                <button key={v} type="button" onClick={() => setDeliveryPref(v)} style={{ flex: 1, padding: '10px 8px', border: `1px solid ${deliveryPref === v ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: FB, cursor: 'pointer', textAlign: 'center', background: deliveryPref === v ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.03)', color: deliveryPref === v ? '#4ade80' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label={es ? 'Notas adicionales' : 'Additional notes'}><textarea style={{ ...inputStyle, resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder={es ? 'Especificaciones, certificaciones...' : 'Specifications, certifications...'} rows={3} /></Field>

          {/* Price summary */}
          <div style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 14, padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: '#fff' }}>{es ? 'Qué incluye' : "What's included"}</span>
              <span style={{ fontFamily: FB, fontSize: 22, fontWeight: 800, color: '#4ade80' }}>$5,000 MXN</span>
            </div>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontFamily: FB, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setStep(1); setError(''); }} style={{ padding: '14px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>← {es ? 'Atrás' : 'Back'}</button>
            <button onClick={handlePay} disabled={loading} style={{ flex: 1, padding: 14, border: 'none', borderRadius: 100, background: '#4ade80', color: '#0a0f0a', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FB, opacity: loading ? 0.6 : 1 }}>
              {loading ? (es ? 'Redirigiendo...' : 'Redirecting...') : (es ? 'Pagar $5,000 MXN y solicitar' : 'Pay $5,000 MXN and request')}
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14, marginBottom: 0, fontFamily: FB }}>🔒 {es ? 'Pago seguro por Stripe' : 'Secure payment via Stripe'}</p>
        </div>)}
      </div>
    </div>
  );
}
