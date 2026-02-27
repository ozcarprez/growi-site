import { useState } from 'react';
import { startCheckout } from './stripeHelper';

export default function SubscribeModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
                await startCheckout({ email, company_name: companyName, phone });
        } catch (err) {
                setError(err.message || 'Error al procesar. Intenta de nuevo.');
                setLoading(false);
        }
  };

  return (
        <div style={styles.overlay} onClick={onClose}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                          <button style={styles.closeBtn} onClick={onClose}>✕</button>

                          <div style={styles.header}>
                                      <div style={styles.badge}>PRO</div>
                                      <h2 style={styles.title}>Growi Pro</h2>
                                      <p style={styles.subtitle}>
                                                    Accede al directorio completo de productores agrícolas verificados en campo
                                      </p>
                          </div>

                          <div style={styles.priceSection}>
                                      <span style={styles.price}>$3,000</span>
                                      <span style={styles.pricePeriod}> MXN / mes</span>
                          </div>

                          <ul style={styles.features}>
                                      <li style={styles.feature}>✓ Datos de contacto de productores</li>
                                      <li style={styles.feature}>✓ Ubicación y región verificada</li>
                                      <li style={styles.feature}>✓ Certificaciones y cultivos</li>
                                      <li style={styles.feature}>✓ Capacidad y temporadas</li>
                                      <li style={styles.feature}>✓ Actualizaciones mensuales</li>
                          </ul>

                          <form onSubmit={handleSubmit} style={styles.form}>
                                      <div style={styles.fieldWrapper}>
                                                    <label style={styles.label}>Correo electrónico *</label>
                                                    <input
                                                                    type="email"
                                                                    placeholder="tu@email.com"
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    required
                                                                    style={styles.input}
                                                                  />
                                      </div>
                                      <div style={styles.fieldWrapper}>
                                                    <label style={styles.label}>Empresa (opcional)</label>
                                                    <input
                                                                    type="text"
                                                                    placeholder="Nombre de tu empresa"
                                                                    value={companyName}
                                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                                    style={styles.input}
                                                                  />
                                      </div>
                                      <div style={styles.fieldWrapper}>
                                                    <label style={styles.label}>Teléfono (opcional)</label>
                                                    <input
                                                                    type="tel"
                                                                    placeholder="+52 1234567890"
                                                                    value={phone}
                                                                    onChange={(e) => setPhone(e.target.value)}
                                                                    style={styles.input}
                                                                  />
                                      </div>
                            {error && <p style={styles.error}>{error}</p>}
                                      <button
                                                    type="submit"
                                                    disabled={loading || !email}
                                                    style={{ ...styles.submitBtn, opacity: loading || !email ? 0.6 : 1 }}
                                                  >
                                        {loading ? 'Redirigiendo a Stripe...' : 'Suscribirse — $3,000 MXN/mes'}
                                      </button>
                          </form>
                
                        <p style={styles.secure}>🔒 Pago seguro procesado por Stripe. Cancela cuando quieras.</p>
                </div>
        </div>
      );
}

const styles = {
    overlay: {
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, backdropFilter: 'blur(4px)'
    },
    modal: {
          backgroundColor: '#fff', borderRadius: '16px', padding: '40px',
          maxWidth: '440px', width: '90%', position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
    },
    closeBtn: {
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', fontSize: '20px',
          cursor: 'pointer', color: '#666'
    },
    header: { textAlign: 'center', marginBottom: '20px' },
    badge: {
          display: 'inline-block', backgroundColor: '#16a34a', color: '#fff',
          padding: '4px 14px', borderRadius: '20px', fontSize: '12px',
          fontWeight: '700', letterSpacing: '1px', marginBottom: '12px'
    },
    title: { fontSize: '28px', fontWeight: '700', color: '#111', margin: '0 0 8px 0' },
    subtitle: { fontSize: '15px', color: '#666', margin: 0, lineHeight: '1.5' },
    priceSection: { textAlign: 'center', marginBottom: '24px' },
    price: { fontSize: '36px', fontWeight: '800', color: '#111' },
    pricePeriod: { fontSize: '16px', color: '#666' },
    features: { listStyle: 'none', padding: 0, margin: '0 0 24px 0' },
    feature: { padding: '6px 0', fontSize: '14px', color: '#333' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    fieldWrapper: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '4px' },
    input: { padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' },
    error: { color: '#dc2626', fontSize: '14px', margin: 0 },
    submitBtn: {
          padding: '14px', borderRadius: '10px', border: 'none',
          backgroundColor: '#16a34a', color: '#fff', fontSize: '16px',
          fontWeight: '700', cursor: 'pointer', marginTop: '4px'
    },
    secure: { textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '16px', marginBottom: 0 },
};</button>
