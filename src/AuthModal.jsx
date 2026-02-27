import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const FB = "'Outfit', sans-serif";

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setView(initialView);
    setError('');
    setSuccess('');
  }, [initialView, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setSuccess('Cuenta creada. Revisa tu email para confirmar.');
        setView('login');
        setPassword('');
      } else if (view === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`,
        });
        if (error) throw error;
        setSuccess('Link de recuperación enviado a tu email.');
      }
    } catch (err) {
      const msg = err.message || 'Algo salió mal';
      // Friendly error messages
      if (msg.includes('Invalid login')) setError('Email o contraseña incorrectos');
      else if (msg.includes('already registered')) setError('Este email ya está registrado');
      else if (msg.includes('Password should be')) setError('La contraseña debe tener al menos 6 caracteres');
      else setError(msg);
    }
    setLoading(false);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontFamily: FB, fontSize: 24, fontWeight: 800, color: '#4ade80' }}>Growi</span>
        </div>

        <h2 style={s.title}>
          {view === 'login' && 'Inicia sesión'}
          {view === 'signup' && 'Crea tu cuenta'}
          {view === 'reset' && 'Recuperar contraseña'}
        </h2>
        <p style={s.subtitle}>
          {view === 'login' && 'Accede al directorio completo de productores'}
          {view === 'signup' && 'Regístrate para explorar productores agrícolas verificados'}
          {view === 'reset' && 'Te enviaremos un link para restablecer tu contraseña'}
        </p>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {view === 'signup' && (
            <div style={s.field}>
              <label style={s.label}>Nombre completo</label>
              <input style={s.input} type="text" placeholder="Tu nombre" value={fullName}
                onChange={(e) => setFullName(e.target.value)} />
            </div>
          )}

          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="tu@empresa.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {view !== 'reset' && (
            <div style={s.field}>
              <label style={s.label}>Contraseña</label>
              <input style={s.input} type="password" placeholder="Mínimo 6 caracteres" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Procesando...' :
              view === 'login' ? 'Entrar' :
              view === 'signup' ? 'Crear cuenta' :
              'Enviar link'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span>o</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Switch views */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {view === 'login' && (
            <>
              <button style={s.link} onClick={() => { setView('signup'); setError(''); setSuccess(''); }}>
                Crear cuenta nueva
              </button>
              <button style={s.link} onClick={() => { setView('reset'); setError(''); setSuccess(''); }}>
                Olvidé mi contraseña
              </button>
            </>
          )}
          {view === 'signup' && (
            <button style={s.link} onClick={() => { setView('login'); setError(''); setSuccess(''); }}>
              Ya tengo cuenta — Iniciar sesión
            </button>
          )}
          {view === 'reset' && (
            <button style={s.link} onClick={() => { setView('login'); setError(''); setSuccess(''); }}>
              Volver a iniciar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 10000,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  modal: {
    background: '#111a11',
    border: '1px solid rgba(74,222,128,0.15)',
    borderRadius: 20,
    padding: '40px 36px',
    maxWidth: 420,
    width: '100%',
    position: 'relative',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
  },
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    background: 'none', border: 'none', fontSize: 18,
    cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
    fontFamily: FB,
  },
  title: {
    fontFamily: FB, fontSize: 22, fontWeight: 700, color: '#fff',
    margin: '0 0 6px', textAlign: 'center',
  },
  subtitle: {
    fontFamily: FB, fontSize: 13, color: 'rgba(255,255,255,0.4)',
    margin: '0 0 24px', textAlign: 'center', lineHeight: 1.5,
  },
  field: { marginBottom: 14 },
  label: {
    display: 'block', fontFamily: FB, fontSize: 12, fontWeight: 600,
    color: 'rgba(255,255,255,0.5)', marginBottom: 6,
  },
  input: {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, fontSize: 14, color: '#fff',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: FB,
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%', padding: 14, border: 'none', borderRadius: 100,
    background: '#4ade80', color: '#0a0f0a',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: FB, marginTop: 8,
    transition: 'opacity 0.2s',
  },
  link: {
    background: 'none', border: 'none', color: '#4ade80',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: FB, textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', borderRadius: 10,
    padding: '10px 14px', fontSize: 13,
    marginBottom: 16, fontFamily: FB,
  },
  success: {
    background: 'rgba(74,222,128,0.1)',
    border: '1px solid rgba(74,222,128,0.3)',
    color: '#4ade80', borderRadius: 10,
    padding: '10px 14px', fontSize: 13,
    marginBottom: 16, fontFamily: FB,
  },
};
