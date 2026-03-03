import { useState } from 'react';
import { supabase } from './supabaseClient';

const FB = "'Outfit', sans-serif";
const REGIONS = ["Ensenada","Maneadero","Colonet","Vicente Guerrero","Camalu","San Quintin","El Rosario","Pescadero","No tengo preferencia"];

const _inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: FB };

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontFamily: FB, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

export default function SearchRequestModal({ isOpen, onClose, lang = 'es' }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPref, setContactPref] = useState('whatsapp');
  const [cropInterest, setCropInterest] = useState('');
  const [volume, setVolume] = useState('');
  const [regionPref, setRegionPref] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;
  const es = lang === 'es';

  function handleClose() {
    onClose();
    setTimeout(() => { setStep(1); setSuccess(false); setError(''); setName(''); setEmail(''); setPhone(''); setCropInterest(''); setVolume(''); setRegionPref(''); setNotes(''); setContactPref('whatsapp'); }, 300);
  }

  function goStep2() {
    if (!name.trim()) { setError(es ? 'Tu nombre es requerido' : 'Name is required'); return; }
    if (!phone.trim() && !email.trim()) { setError(es ? 'Agrega teléfono o email' : 'Add phone or email'); return; }
    setError(''); setStep(2);
  }

  async function handleSubmit() {
    if (!cropInterest.trim()) { setError(es ? 'Indica qué cultivo buscas' : 'Specify which crop'); return; }
    setError(''); setLoading(true);
    try {
      const { error: dbErr } = await supabase.from('search_requests').insert({
        name: name.trim(), email: email.trim() || null, phone: phone.trim() || null,
        contact_preference: contactPref, crop_interest: cropInterest.trim(),
        volume: volume.trim() || null, region_preference: regionPref || null,
        notes: notes.trim() || null, status: 'new',
      });
      if (dbErr) throw dbErr;
      setSuccess(true);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  if (success) {
    return (
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#111a11', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 22, padding: '48px 32px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h3 style={{ fontFamily: FB, fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>{es ? '¡Solicitud enviada!' : 'Request sent!'}</h3>
          <p style={{ fontFamily: FB, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 28px' }}>
            {es ? 'Recibí tu solicitud. Te contactaré pronto para ayudarte a encontrar lo que buscas.' : "I received your request. I'll contact you soon to help you find what you're looking for."}
          </p>
          <button onClick={handleClose} style={{ padding: '14px 36px', border: 'none', borderRadius: 100, background: '#4ade80', color: '#0a0f0a', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>{es ? 'Cerrar' : 'Close'}</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111a11', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 22, padding: '36px 32px', maxWidth: 460, width: '100%', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontFamily: FB }}>✕</button>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FB, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: '#4ade80', padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.05)', marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
            {es ? 'Búsqueda personalizada' : 'Custom search'}
          </div>
          <p style={{ fontFamily: FB, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
            {es ? 'Dime qué buscas y yo lo encuentro en campo. Sin costo ni compromiso.' : "Tell me what you're looking for and I'll find it in the field. No cost, no commitment."}
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FB, fontSize: 12, fontWeight: 700, background: '#4ade80', color: '#0a0f0a' }}>1</div>
          <div style={{ width: 60, height: 2, background: step >= 2 ? '#4ade80' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FB, fontSize: 12, fontWeight: 700, background: step >= 2 ? '#4ade80' : 'rgba(255,255,255,0.15)', color: step >= 2 ? '#0a0f0a' : 'rgba(255,255,255,0.3)' }}>2</div>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 14, fontFamily: FB }}>{error}</div>}

        {/* Step 1: Contact info */}
        {step === 1 && (<div>
          <h3 style={{ fontFamily: FB, fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>{es ? 'Tus datos' : 'Your info'}</h3>
          <Field label={es ? 'Nombre completo *' : 'Full name *'}><input style={_inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder={es ? 'Tu nombre' : 'Your name'} /></Field>
          <Field label={es ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}><input style={_inputStyle} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+52 664 123 4567" /></Field>
          <Field label="Email"><input style={_inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@empresa.com" /></Field>
          <Field label={es ? '¿Cómo prefieres que te contacte?' : 'How should I contact you?'}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: 'whatsapp', l: 'WhatsApp' }, { v: 'email', l: 'Email' }, { v: 'either', l: es ? 'Cualquiera' : 'Either' }].map(({ v, l }) => (
                <button key={v} type="button" onClick={() => setContactPref(v)} style={{ flex: 1, padding: '10px 8px', border: `1px solid ${contactPref === v ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: FB, cursor: 'pointer', textAlign: 'center', background: contactPref === v ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.03)', color: contactPref === v ? '#4ade80' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}>{l}</button>
              ))}
            </div>
          </Field>
          <button onClick={goStep2} style={{ width: '100%', padding: 14, border: 'none', borderRadius: 100, background: '#4ade80', color: '#0a0f0a', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FB }}>{es ? 'Siguiente →' : 'Next →'}</button>
        </div>)}

        {/* Step 2: What they're looking for */}
        {step === 2 && (<div>
          <h3 style={{ fontFamily: FB, fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>{es ? '¿Qué buscas?' : 'What are you looking for?'}</h3>
          <Field label={es ? 'Cultivo o producto que buscas *' : 'Crop or product *'}><input style={_inputStyle} value={cropInterest} onChange={e => setCropInterest(e.target.value)} placeholder={es ? 'Ej: Aguacate, Fresa, Tomate...' : 'E.g. Avocado, Strawberry, Tomato...'} /></Field>
          <Field label={es ? 'Volumen aproximado' : 'Approximate volume'}><input style={_inputStyle} value={volume} onChange={e => setVolume(e.target.value)} placeholder={es ? 'Ej: 10 pallets semanales' : 'E.g. 10 pallets weekly'} /></Field>
          <Field label={es ? 'Región preferida' : 'Preferred region'}>
            <select style={{ ..._inputStyle, appearance: 'none' }} value={regionPref} onChange={e => setRegionPref(e.target.value)}>
              <option value="" style={{ background: '#1a1a1a' }}>{es ? 'Selecciona...' : 'Select...'}</option>
              {REGIONS.map(r => <option key={r} value={r} style={{ background: '#1a1a1a' }}>{es ? r : r}</option>)}
            </select>
          </Field>
          <Field label={es ? 'Detalles adicionales' : 'Additional details'}><textarea style={{ ..._inputStyle, resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder={es ? 'Certificaciones, especificaciones, timeline...' : 'Certifications, specs, timeline...'} rows={3} /></Field>

          {/* Free badge */}
          <div style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 14, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔍</span>
            <div>
              <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: '#4ade80' }}>{es ? 'Sin costo' : 'No cost'}</span>
              <span style={{ fontFamily: FB, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>{es ? '— Yo busco el productor por ti' : "— I'll find the producer for you"}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setStep(1); setError(''); }} style={{ padding: '14px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FB }}>← {es ? 'Atrás' : 'Back'}</button>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: 14, border: 'none', borderRadius: 100, background: '#4ade80', color: '#0a0f0a', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FB, opacity: loading ? 0.6 : 1 }}>
              {loading ? (es ? 'Enviando...' : 'Sending...') : (es ? 'Enviar solicitud' : 'Send request')}
            </button>
          </div>
        </div>)}
      </div>
    </div>
  );
}
