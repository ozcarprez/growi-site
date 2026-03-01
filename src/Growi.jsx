import { useState, useEffect, useRef } from "react";
import SubscribeModal from './SubscribeModal';
import AuthModal from './AuthModal';
import { useAuth, fetchProducers } from './useAuth';

const F = "'Instrument Serif', serif";
const FB = "'Outfit', sans-serif";
const WA_NUMBER = "526631261241";

// Fallback static data (used while Supabase loads or as backup)
const STATIC_PRODUCERS = [
  { id: "BC-1001", region: "Ensenada", crops: ["Red Beet", "Candy Beet", "Gold Beet"], capacity: "300+ Sacks", acreage: 20, certifications: ["NA"], salesType: "EXPORT", verified: true, season: "All year round" },
  { id: "BC-1002", region: "Ensenada", crops: ["Broccolini"], capacity: "50", acreage: 10, certifications: ["NA"], salesType: "EXPORT", verified: true, season: "All year round" },
  { id: "BC-1003", region: "Ensenada", crops: ["Yellow Summer Squash", "Green Summer Squash", "Baby Zucchini Squash", "Faba beans", "Red Beet", "Candy Beet", "Gold Beet", "Watermelon Radish"], capacity: "Few pallets per product", acreage: 20, certifications: ["PrimusGFS"], salesType: "EXPORT", verified: true, season: "All year round" },
  { id: "BC-1004", region: "San Vicente", crops: ["Cilantro", "Carrot", "Red Beet", "Red Radish"], capacity: "Few pallets per product", acreage: 40, certifications: ["USDA Organic", "SENASICA"], salesType: "EXPORT", verified: true, season: "Winter Season" },
  { id: "BC-1005", region: "Ensenada", crops: ["Strawberry", "Cherry Tomatoes"], capacity: "Few pallets per product", acreage: 40, certifications: ["GlobalG.A.P", "USDA Organic", "PrimusGFS"], salesType: "EXPORT", verified: true, season: "All year round" },
  { id: "BC-1006", region: "San vicente", crops: ["Red Beet", "Candy Beet", "Gold Beet", "Watermelon Radish"], capacity: "Few pallets per product", acreage: 10, certifications: ["NA"], salesType: "EXPORT", verified: true, season: "All year round" },
  { id: "BC-1007", region: "Camalu", crops: ["Strawberry"], capacity: "Few pallets per product", acreage: 20, certifications: ["SENASICA", "PrimusGFS"], salesType: "EXPORT", verified: true, season: "Dec - June" },
  { id: "BC-1008", region: "Vicente Guerrero", crops: ["Faba Bean", "Tarragon"], capacity: "Few pallets per product", acreage: 10, certifications: ["NA"], salesType: "EXPORT", verified: true, season: "Nov - March" },
  { id: "BC-1009", region: "Ensenada", crops: ["Dill", "Mint", "Carrots"], capacity: "Few pallets per product", acreage: 10, certifications: ["NA"], salesType: "EXPORT", verified: true, season: "All year round" },
  { id: "BC-1010", region: "El Rosario", crops: ["Shishito Pepper"], capacity: "Few pallets per product", acreage: 10, certifications: ["NA"], salesType: "EXPORT", verified: false, season: "Jul - Dec" },
  { id: "BC-1011", region: "Ojos Negros", crops: ["Shishito Pepper", "Jalape\u00f1o Pepper", "Serrano Pepper", "Red Fresno Pepper"], capacity: "Few pallets per product", acreage: 10, certifications: ["NA"], salesType: "EXPORT", verified: false, season: "Jul - Dec" },
  { id: "BC-1012", region: "Constitucion", crops: ["Shishito Pepper", "Broccolini", "Red Beet", "Watermelon Radish"], capacity: "Few pallets per product", acreage: 10, certifications: ["NA"], salesType: "EXPORT", verified: false, season: "Aug - Jun" },
  { id: "BC-1013", region: "Pescadero", crops: ["Basil", "Thai Basil", "Sage", "Chives", "Tarragon"], capacity: "Few pallets per product", acreage: 20, certifications: ["NA"], salesType: "EXPORT", verified: false, season: "Aug - Jun" },
];

const REGION_ORDER = ["Ensenada", "Maneadero", "Colonet", "Vicente Guerrero", "Camalu", "San Quintin", "El Rosario", "Pescadero"];

// Normalize producer from Supabase RPC to match component format
function normalizeProducer(p) {
  return {
    id: p.id,
    region: p.region || '',
    crops: Array.isArray(p.crops) ? p.crops : [],
    capacity: p.capacity || '',
    acreage: p.acreage || 0,
    certifications: Array.isArray(p.certifications) ? p.certifications : ['NA'],
    salesType: p.sales_type || 'EXPORT',
    verified: !!p.verified,
    season: p.season || '',
    // Contact fields (null if not subscriber)
    ranchName: p.ranch_name || null,
    producerName: p.producer_name || null,
    phone: p.phone || null,
    email: p.email || null,
    officePhone: p.office_phone || null,
    exactLocation: p.exact_location || null,
    notes: p.notes || null,
    // New commercial fields
    prices: Array.isArray(p.prices) ? p.prices : [],
    photoUrl: p.photo_url || null,
    packaging: p.packaging || null,
    paymentMethods: p.payment_methods || null,
    secondaryContactName: p.secondary_contact_name || null,
    secondaryContactPhone: p.secondary_contact_phone || null,
    borderCrossingDistance: p.border_crossing_distance || null,
    isSubscriber: p.is_subscriber || false,
  };
}

const TX = {
  es: {
    nav_cta: "Ver Productores",
    badge: "Baja California, Mexico",
    h1a: "Inteligencia agr\u00edcola",
    h1b: "verificada en campo",
    hero_p: "Datos de productores reales que no encontrar\u00e1s en internet. Verificados en persona, actualizados por temporada. Suscr\u00edbete al directorio o solicita una b\u00fasqueda personalizada.",
    cta1: "Explorar Directorio",
    cta2: "C\u00f3mo funciona",
    s1: "Productores",
    s2: "Regiones",
    s3: "Cultivos",
    s4: "Verificados en campo",
    who_label: "\u00bfPara qui\u00e9n es Growi?",
    who_h2a: "Si necesitas llegar a un productor en Baja California,",
    who_h2b: "es para ti.",
    who_audiences: [
      { t: "Compradores e importadores", d: "Buscan producto fresco de Baja California" },
      { t: "Semilleras, insumos y empaque", d: "Semillas, pl\u00e1sticos, cintas de riego, cajas, tarimas y m\u00e1s" },
      { t: "Empresas de factoraje", d: "Necesitan relaciones comerciales activas verificadas" },
    ],
    how_label: "C\u00f3mo Funciona",
    how_h2a: "Explora.",
    how_h2b: "Conecta seguro.",
    steps: [
      { n: "01", t: "Explora el directorio", d: "Busca por cultivo, regi\u00f3n o temporada. Toda la informaci\u00f3n de producci\u00f3n es visible. El contacto del productor est\u00e1 protegido." },
      { n: "02", t: "Suscr\u00edbete para conectar", d: "Con tu suscripci\u00f3n mensual de $3,000 MXN desbloqueas todos los contactos y precios del directorio. Acceso ilimitado, nuevos productores cada mes." },
      { n: "03", t: "\u00bfNo lo encuentras? Solicitud premium", d: "Si el producto que buscas no est\u00e1 en el directorio, yo lo busco en campo. Viajo, verifico, y te entrego el contacto listo." },
    ],
    rec: "RECOMENDADO",
    pricing_label: "Acceso",
    pricing_h2a: "Dos formas de",
    pricing_h2b: "conectar",
    pricing_sub: "Si est\u00e1 en el directorio, desbloquea el contacto. Si no est\u00e1, lo buscamos en campo.",
    plan_dir_tag: "DIRECTORIO",
    plan_dir_t: "Suscripci\u00f3n mensual",
    plan_dir_d: "Acceso ilimitado a todos los contactos verificados del directorio. Nuevos productores se agregan cada mes \u2014 tu suscripci\u00f3n vale m\u00e1s con el tiempo.",
    plan_dir_features: [
      "Contacto completo: nombre, tel\u00e9fono, correo, ubicaci\u00f3n",
      "Acceso ilimitado a todos los productores",
      "Nuevos productores verificados cada mes",
      "Filtros por cultivo, regi\u00f3n y temporada",
      "Fotos de verificación en campo",
    ],
    plan_dir_price: "$3,000 MXN/mes",
    plan_dir_btn: "Solicitar acceso",
    plan_dir_wa: "Hola, me interesa la suscripci\u00f3n mensual al directorio de Growi.",
    plan_prem_t: "Solicitud premium",
    plan_prem_d: "\u00bfNo encuentras lo que buscas en el directorio? Yo lo busco en campo. Viajo, verifico, y te entrego el contacto listo.",
    plan_prem_features: [
      "B\u00fasqueda personalizada por cultivo y regi\u00f3n",
      "Verificaci\u00f3n en campo con evidencia",
      "Datos completos del productor",
      "Introducci\u00f3n facilitada",
      "Apoyo en negociaci\u00f3n + seguimiento 7 d\u00edas",
    ],
    plan_prem_price: "Precio seg\u00fan ubicaci\u00f3n y complejidad",
    plan_prem_btn: "Contactar por WhatsApp",
    plan_prem_wa: "Hola, necesito una solicitud premium. Busco [cultivo] en [regi\u00f3n].",
    why_label: "\u00bfPor Qu\u00e9 Growi?",
    why_h2a: "Cada dato fue recogido ",
    why_h2b: "en persona",
    why_cards: [
      { t: "Verificado en campo", d: "Cada productor fue visitado personalmente. No hay datos inventados ni scrapeados." },
      { t: "Privacidad total", d: "N\u00fameros y emails nunca se comparten. Toda la comunicaci\u00f3n pasa por Growi." },
      { t: "Conexi\u00f3n humana", d: "No eres un usuario m\u00e1s. Facilito introducciones personales y acompa\u00f1o la negociaci\u00f3n." },
    ],
    dir_label: "Directorio",
    dir_h2a: "Explora el directorio.",
    dir_h2b: "Crece cada mes.",
    dir_sub: "Explora cultivos, regiones y capacidad gratis. El contacto del productor se desbloquea con tu suscripci\u00f3n. \u00bfNo encuentras lo que buscas? Env\u00eda una solicitud.",
    search: "Buscar cultivo, regi\u00f3n...",
    filter: "Filtrar",
    results: "productores",
    corridor: "Ensenada - Pescadero",
    clear: "Limpiar filtros",
    no_t: "Sin resultados",
    no_p: "Intenta con otro cultivo o regi\u00f3n",
    f_crop: "CULTIVO",
    f_region: "REGI\u00d3N",
    f_type: "TIPO VENTA",
    f_all_c: "Todos",
    f_all_r: "Todas",
    f_all_t: "Todos",
    f_exp: "Export",
    f_dom: "Dom\u00e9stico",
    c_cap: "CAPACIDAD",
    c_sea: "TEMPORADA",
    c_acr: "HECT\u00c1REAS",
    intro_btn: "Desbloquear contacto \u2014 Suscr\u00edbete",
    wa_intro_msg: "Hola, me interesa suscribirme al directorio de Growi para acceder a los contactos de productores.",
    footer_p: "Datos verificados en campo. Corredor Ensenada - Pescadero.",
    footer_loc: "Baja California, Mexico.",
    footer_q: "El acceso a la red correcta lo cambia todo.",
    // Auth strings
    login: "Iniciar sesi\u00f3n",
    logout: "Salir",
    subscriber_badge: "SUSCRIPTOR",
    manage_sub: "Mi suscripción",
    contact_title: "Datos de contacto",
    contact_phone: "Tel\u00e9fono",
    contact_office: "Oficina",
    contact_email: "Email",
    contact_location: "Ubicaci\u00f3n",
    contact_login_prompt: "Inicia sesi\u00f3n para ver contacto",
  },
  en: {
    nav_cta: "View Producers",
    badge: "Baja California, Mexico",
    h1a: "Agricultural intelligence",
    h1b: "verified in the field",
    hero_p: "Real producer data you won't find online. Verified in person, updated by season. Subscribe to the directory or request a custom search.",
    cta1: "Explore Directory",
    cta2: "How it works",
    s1: "Producers",
    s2: "Regions",
    s3: "Crops",
    s4: "Field-verified",
    who_label: "Who is Growi for?",
    who_h2a: "If you need to reach a producer in Baja California,",
    who_h2b: "it's for you.",
    who_audiences: [
      { t: "Buyers and importers", d: "Looking for fresh produce from Baja California" },
      { t: "Seed companies, suppliers and packaging", d: "Seeds, plastics, drip tape, boxes, pallets and more" },
      { t: "Factoring companies", d: "Need verified active commercial relationships" },
    ],
    how_label: "How It Works",
    how_h2a: "Explore.",
    how_h2b: "Connect safely.",
    steps: [
      { n: "01", t: "Explore the directory", d: "Search by crop, region or season. All production info is visible. Producer contact is protected." },
      { n: "02", t: "Subscribe to connect", d: "With your $3,000 MXN monthly subscription you unlock all contacts and pricing in the directory. Unlimited access, new producers every month." },
      { n: "03", t: "Can't find it? Premium request", d: "If the product you need isn't in the directory, I'll find it in the field. I travel, verify, and deliver the contact ready." },
    ],
    rec: "RECOMMENDED",
    pricing_label: "Access",
    pricing_h2a: "Two ways to",
    pricing_h2b: "connect",
    pricing_sub: "If it's in the directory, unlock the contact. If not, we find it in the field.",
    plan_dir_tag: "DIRECTORY",
    plan_dir_t: "Monthly subscription",
    plan_dir_d: "Unlimited access to all verified contacts in the directory. New producers added every month \u2014 your subscription grows more valuable over time.",
    plan_dir_features: [
      "Full contact: name, phone, email, location",
      "Unlimited access to all producers",
      "New verified producers every month",
      "Filters by crop, region and season",
      "Field verification photos",
    ],
    plan_dir_price: "$3,000 MXN/mo",
    plan_dir_btn: "Request access",
    plan_dir_wa: "Hi, I'm interested in the monthly subscription to the Growi directory.",
    plan_prem_t: "Premium request",
    plan_prem_d: "Can't find what you're looking for in the directory? I'll find it in the field. I travel, verify, and deliver the contact ready.",
    plan_prem_features: [
      "Custom search by crop and region",
      "Field verification with evidence",
      "Complete producer data",
      "Facilitated introduction",
      "Negotiation support + 7-day follow-up",
    ],
    plan_prem_price: "Price based on location and complexity",
    plan_prem_btn: "Contact via WhatsApp",
    plan_prem_wa: "Hi, I need a premium request. I'm looking for [crop] in [region].",
    why_label: "Why Growi?",
    why_h2a: "Every data point was collected ",
    why_h2b: "in person",
    why_cards: [
      { t: "Field-verified", d: "Every producer was visited personally. No fabricated or scraped data." },
      { t: "Total privacy", d: "Phone numbers and emails are never shared. All communication goes through Growi." },
      { t: "Human connection", d: "You are not just another user. I facilitate personal introductions and support negotiations." },
    ],
    dir_label: "Directory",
    dir_h2a: "Explore the directory.",
    dir_h2b: "Grows every month.",
    dir_sub: "Explore crops, regions and capacity for free. Producer contact unlocks with your subscription. Can't find what you need? Submit a request.",
    search: "Search crop, region...",
    filter: "Filter",
    results: "producers",
    corridor: "Ensenada - Pescadero",
    clear: "Clear filters",
    no_t: "No results",
    no_p: "Try another crop or region",
    f_crop: "CROP",
    f_region: "REGION",
    f_type: "SALES TYPE",
    f_all_c: "All",
    f_all_r: "All",
    f_all_t: "All",
    f_exp: "Export",
    f_dom: "Domestic",
    c_cap: "CAPACITY",
    c_sea: "SEASON",
    c_acr: "ACREAGE",
    intro_btn: "Unlock contact \u2014 Subscribe",
    wa_intro_msg: "Hi, I'm interested in subscribing to the Growi directory to access producer contacts.",
    footer_p: "Field-verified data. Ensenada - Pescadero corridor.",
    footer_loc: "Baja California, Mexico.",
    footer_q: "Access to the right network changes everything.",
    // Auth strings
    login: "Sign in",
    logout: "Sign out",
    subscriber_badge: "SUBSCRIBER",
    manage_sub: "My subscription",
    contact_title: "Contact info",
    contact_phone: "Phone",
    contact_office: "Office",
    contact_email: "Email",
    contact_location: "Location",
    contact_login_prompt: "Sign in to view contact",
  },
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
}

const Section = ({ children, delay = 0, style = {} }) => {
  const [ref, v] = useInView(0.1);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(40px)", transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
};

const StatCard = ({ number, label, delay }) => {
  const [ref, v] = useInView(0.1);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${delay}s` }}>
      <span style={{ fontFamily: F, fontSize: 48, fontWeight: 400, color: "#fff", display: "block", lineHeight: 1 }}>{number}</span>
      <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 8, display: "block" }}>{label}</span>
    </div>
  );
};

function waLink(msg) { return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`; }

const SearchIcon = ({ size = 18 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>);
const FilterIcon = ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>);
const MapPinIcon = ({ size = 14 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const ChevDown = ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
const XIcon = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>);
const ShieldCheck = ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>);
const UserCheckIcon = ({ size = 18 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>);
const ShieldIcon24 = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>);
const LockIcon24 = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>);
const UserIcon24 = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>);
const LayersIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>);
const WHY_ICONS = [<ShieldIcon24 key="s" />, <LockIcon24 key="l" />, <UserIcon24 key="u" />];
const CheckSm = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>);
const PhoneIcon = ({ size = 14 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>);
const MailIcon = ({ size = 14 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>);

const LangToggle = ({ lang, setLang }) => (
  <div style={{ display: "flex", borderRadius: 100, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: 3, gap: 2 }}>
    {["es", "en"].map((l) => (
      <button key={l} onClick={() => setLang(l)} style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 100, border: "none", background: lang === l ? "rgba(74,222,128,0.9)" : "transparent", color: lang === l ? "#0a0f0a" : "rgba(255,255,255,0.4)", transition: "all 0.25s ease", letterSpacing: 0.5 }}>
        {l.toUpperCase()}
      </button>
    ))}
  </div>
);

// === CONTACT INFO SECTION (shown inside producer card) ===
const ContactInfo = ({ p, t, isSubscriber, user, onLogin, onSubscribe }) => {
  if (!user) {
    return (
      <button onClick={onLogin} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, fontFamily: FB, cursor: 'pointer', transition: 'all 0.15s ease' }}>
        {t.contact_login_prompt}
      </button>
    );
  }

  if (!isSubscriber) {
    return (
      <button onClick={onSubscribe} style={{ flex: 1, width: '100%', display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 16px", borderRadius: 12, background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.08))", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", fontSize: 13, fontWeight: 700, fontFamily: FB, transition: "all 0.15s ease", cursor: "pointer" }}>
        <UserCheckIcon size={15} />
        {t.intro_btn}
      </button>
    );
  }

  // \u2705 SUBSCRIBER \u2014 show contact data
  const hasContact = p.phone || p.email || p.exactLocation;
  if (!hasContact) {
    return (
      <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: FB, textAlign: 'center' }}>
        Datos de contacto pendientes de verificaci\u00f3n
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 14, border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.04)', padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <ShieldCheck size={14} />
        <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: '#4ade80', letterSpacing: 0.5 }}>{t.contact_title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {p.producerName && (
          <div style={{ fontFamily: FB, fontSize: 15, fontWeight: 700, color: '#fff' }}>
            {p.producerName}{p.ranchName ? ` \u2014 ${p.ranchName}` : ''}
          </div>
        )}
        {p.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PhoneIcon size={13} />
            <a href={`tel:${p.phone}`} style={{ fontFamily: FB, fontSize: 14, color: '#4ade80', textDecoration: 'none' }}>{p.phone}</a>
          </div>
        )}
        {p.officePhone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PhoneIcon size={13} />
            <a href={`tel:${p.officePhone}`} style={{ fontFamily: FB, fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{p.officePhone} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>({t.contact_office})</span></a>
          </div>
        )}
        {p.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MailIcon size={13} />
            <a href={`mailto:${p.email}`} style={{ fontFamily: FB, fontSize: 14, color: '#4ade80', textDecoration: 'none' }}>{p.email}</a>
          </div>
        )}
        {p.exactLocation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPinIcon size={13} />
            <span style={{ fontFamily: FB, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{p.exactLocation}</span>
          </div>
        )}
        {p.secondaryContactName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PhoneIcon size={13} />
            <span style={{ fontFamily: FB, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{p.secondaryContactName}{p.secondaryContactPhone ? ` — ${p.secondaryContactPhone}` : ''} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>(Contacto 2)</span></span>
          </div>
        )}
        {p.paymentMethods && (
          <div style={{ fontFamily: FB, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>💳 {p.paymentMethods}</div>
        )}
        {p.notes && (
          <div style={{ fontFamily: FB, fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
            {p.notes}
          </div>
        )}
      </div>
    </div>
  );
};

const ProducerCard = ({ p, t, lang, delay, visible, isSubscriber, user, onLogin, onSubscribe }) => {
  const isExport = p.salesType === "EXPORT";
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 16, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${delay}s` }}>
      {p.photoUrl && (
        <img src={p.photoUrl} alt="Rancho" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
      )}
      <div style={{ padding: "24px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 0.3 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#4ade80", marginRight: 8 }}>{p.id}</span>
            {lang === "es" ? "Productor verificado" : "Verified producer"}
          </span>
          {p.verified && <ShieldCheck size={18} />}
        </div>
        <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, padding: "4px 10px", borderRadius: 6, background: isExport ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)", color: isExport ? "#4ade80" : "#fbbf24" }}>
          {isExport ? t.f_exp.toUpperCase() : t.f_dom.toUpperCase()}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
        <MapPinIcon size={13} />
        <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{p.region}, B.C.</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {p.crops.map((c) => (
          <span key={c} style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, padding: "5px 12px", borderRadius: 8, background: "rgba(74,222,128,0.08)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.15)" }}>{c}</span>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 16 }}>
        {[
          { l: t.c_cap, v: p.capacity },
          { l: t.c_sea, v: p.season },
          { l: t.c_acr, v: p.acreage },
          ...(p.packaging ? [{ l: lang === "es" ? "EMPAQUE" : "PACKAGING", v: p.packaging }] : []),
          ...(p.borderCrossingDistance ? [{ l: lang === "es" ? "CRUCE FRONTERIZO" : "BORDER CROSSING", v: p.borderCrossingDistance }] : []),
        ].filter(s => s.v).map((s) => (
          <div key={s.l}>
            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: "rgba(74,222,128,0.6)", letterSpacing: 1 }}>{s.l}</span>
            <p style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "4px 0 0" }}>{s.v}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {p.certifications.map((c) => (
          <span key={c} style={{ fontFamily: FB, fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 5, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>{c}</span>
        ))}
      </div>
      {/* Public commercial data — visible to everyone */}
      {/* Prices — subscribers see data, others see teaser */}
      {p.prices && p.prices.length > 0 ? (
        <div style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: 'rgba(74,222,128,0.6)', letterSpacing: 1 }}>PRECIOS</span>
            <span style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, letterSpacing: 1, color: '#0a0f0a', background: '#4ade80', padding: '2px 8px', borderRadius: 100 }}>DIRECTO DE RANCHO</span>
          </div>
          {p.prices.map((pr, i) => (
            <div key={i} style={{ fontFamily: FB, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{pr.crop} <span style={{ color: 'rgba(255,255,255,0.3)' }}>/ {pr.unit}</span></span>
              <span>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>${pr.price_min} USD</span>
                {pr.price_mxn && <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>(${pr.price_mxn} MXN)</span>}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'rgba(74,222,128,0.03)', border: '1px dashed rgba(74,222,128,0.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, textAlign: 'center' }}>
          <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: 'rgba(74,222,128,0.7)' }}>Precios del cultivo disponibles con tu suscripción</span>
        </div>
      )}
      {/* Contact section — gated */}
      <ContactInfo p={p} t={t} isSubscriber={isSubscriber} user={user} onLogin={onLogin} onSubscribe={onSubscribe} />
      </div>
    </div>
  );
};

export default function Growi() {
  const [lang, setLang] = useState("es");
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [selCrop, setSelCrop] = useState("");
  const [selRegion, setSelRegion] = useState("");
  const [selType, setSelType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [producers, setProducers] = useState([]);
  const [producersLoading, setProducersLoading] = useState(true);
  const [dirVisible, setDirVisible] = useState(false);
  const dirRef = useRef(null);
  const t = TX[lang];

  const { user, isSubscriber, loading: authLoading, signOut } = useAuth();

  // Load producers from Supabase
  useEffect(() => {
    loadProducers();
  }, [user]); // Reload when user changes (to get contact data if subscriber)

  async function loadProducers() {
    setProducersLoading(true);
    try {
      const data = await fetchProducers();
      if (data.length > 0) {
        setProducers(data.map(normalizeProducer));
      } else {
        // Fallback to static data
        setProducers(STATIC_PRODUCERS.map(p => ({ ...p, ranchName: null, producerName: null, phone: null, email: null, officePhone: null, exactLocation: null, notes: null, prices: [], photoUrl: null, packaging: null, paymentMethods: null, secondaryContactName: null, secondaryContactPhone: null, borderCrossingDistance: null, isSubscriber: false })));
      }
    } catch {
      setProducers(STATIC_PRODUCERS.map(p => ({ ...p, ranchName: null, producerName: null, phone: null, email: null, officePhone: null, exactLocation: null, notes: null, prices: [], photoUrl: null, packaging: null, paymentMethods: null, secondaryContactName: null, secondaryContactPhone: null, borderCrossingDistance: null, isSubscriber: false })));
    }
    setProducersLoading(false);
  }

  const openAuth = (view = 'login') => { setAuthView(view); setShowAuth(true); };

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    const el = dirRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDirVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ALL_CROPS = [...new Set(producers.flatMap((p) => p.crops))].sort();

  const filtered = producers.filter((p) => {
    const q = searchQ.toLowerCase();
    return (
      (!q || p.crops.some((c) => c.toLowerCase().includes(q)) || p.region.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
      (!selCrop || p.crops.includes(selCrop)) &&
      (!selRegion || p.region === selRegion) &&
      (!selType || p.salesType === selType)
    );
  });

  const cropCounts = {};
  filtered.forEach((p) => p.crops.forEach((c) => { cropCounts[c] = (cropCounts[c] || 0) + 1; }));

  return (
    <div style={{ background: "#0a0f0a", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::placeholder{color:rgba(255,255,255,0.3)}
        input:focus,select:focus,textarea:focus{outline:none}
        button{cursor:pointer}
        select{appearance:none;-webkit-appearance:none}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(3%,-15%)}50%{transform:translate(12%,9%)}70%{transform:translate(9%,4%)}90%{transform:translate(-1%,7%)}}
        body{background:#0a0f0a!important}
        a{text-decoration:none}
      `}</style>

      {/* Grain overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px", animation: "grain 8s steps(10) infinite" }} />

      {/* NAV \u2014 now with auth */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 32px", background: scrollY > 50 ? "rgba(10,15,10,0.9)" : "transparent", backdropFilter: scrollY > 50 ? "blur(20px)" : "none", transition: "all 0.4s ease", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FB, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Growi</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LangToggle lang={lang} setLang={setLang} />

          {!authLoading && user ? (
            /* Logged in */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isSubscriber && (
                <button onClick={async () => {
                  try {
                    const { data: { session } } = await (await import('./supabaseClient')).supabase.auth.getSession();
                    const res = await fetch('https://ieujjmvwdoqomqyzgaqf.supabase.co/functions/v1/customer-portal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
                      body: JSON.stringify({ return_url: window.location.href }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                    else alert(data.error || 'Error');
                  } catch (e) { alert('Error: ' + e.message); }
                }} style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#0a0f0a', background: '#4ade80', padding: '4px 10px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
                  {t.manage_sub}
                </button>
              )}
              <span style={{ fontFamily: FB, fontSize: 12, color: 'rgba(255,255,255,0.4)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.user_metadata?.full_name || user.email}
              </span>
              <button onClick={signOut} style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 100, transition: 'all 0.2s' }}>
                {t.logout}
              </button>
            </div>
          ) : !authLoading ? (
            /* Not logged in */
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => openAuth('login')} style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 100, transition: 'all 0.2s' }}>
                {t.login}
              </button>
              <a href="#directorio" style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: "#0a0f0a", background: "#4ade80", padding: "10px 24px", borderRadius: 100 }}>{t.nav_cta}</a>
            </div>
          ) : null}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px 80px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.2s" }}>
          <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80", display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, border: "1px solid rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.05)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
            {t.badge}
          </span>
        </div>
        <h1 style={{ fontFamily: F, fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 400, lineHeight: 1.05, margin: "32px 0 0", maxWidth: 800, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 0.4s" }}>
          {t.h1a}<br /><em style={{ color: "#4ade80", fontStyle: "italic" }}>{t.h1b}</em>
        </h1>
        <p style={{ fontFamily: FB, fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.5)", maxWidth: 540, lineHeight: 1.7, margin: "28px 0 0", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.6s" }}>{t.hero_p}</p>
        <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.8s" }}>
          <a href="#directorio" style={{ fontFamily: FB, fontSize: 15, fontWeight: 600, color: "#0a0f0a", background: "#4ade80", padding: "16px 36px", borderRadius: 100, boxShadow: "0 0 40px rgba(74,222,128,0.3)" }}>{t.cta1}</a>
          <a href="#como-funciona" style={{ fontFamily: FB, fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.6)", padding: "16px 36px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)" }}>{t.cta2}</a>
        </div>
        <div style={{ position: "absolute", bottom: 40, animation: "float 3s ease infinite", opacity: loaded ? 0.3 : 0, transition: "opacity 1s ease 1.5s" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </div>
      </div>

      {/* STATS */}
      <div style={{ padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 40, textAlign: "center" }}>
          <StatCard number={`${producers.length}+`} label={t.s1} delay={0} />
          <StatCard number={REGION_ORDER.length} label={t.s2} delay={0.1} />
          <StatCard number={`${ALL_CROPS.length}+`} label={t.s3} delay={0.2} />
          <StatCard number="100%" label={t.s4} delay={0.3} />
        </div>
      </div>

      {/* \u00bfPARA QUI\u00c9N ES GROWI? */}
      <div style={{ padding: "120px 24px", background: "linear-gradient(180deg, transparent 0%, rgba(74,222,128,0.02) 50%, transparent 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Section>
            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80" }}>{t.who_label}</span>
            <h2 style={{ fontFamily: F, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, lineHeight: 1.2, margin: "20px 0 48px", maxWidth: 600 }}>
              {t.who_h2a}<br /><em style={{ color: "#4ade80", fontStyle: "italic" }}>{t.who_h2b}</em>
            </h2>
          </Section>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>
            {t.who_audiences.map((a, i) => (
              <Section key={i} delay={i * 0.1}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(74,222,128,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LayersIcon /></div>
                  <div>
                    <div style={{ fontFamily: FB, fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{a.t}</div>
                    <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.45)" }}>{a.d}</div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </div>

      {/* C\u00d3MO FUNCIONA */}
      <div id="como-funciona" style={{ padding: "120px 24px", background: "linear-gradient(180deg, transparent 0%, rgba(74,222,128,0.03) 50%, transparent 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Section>
            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80" }}>{t.how_label}</span>
            <h2 style={{ fontFamily: F, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, lineHeight: 1.15, margin: "20px 0 0" }}>
              {t.how_h2a}<br /><em style={{ color: "#4ade80", fontStyle: "italic" }}>{t.how_h2b}</em>
            </h2>
          </Section>
          <div style={{ marginTop: 64 }}>
            {t.steps.map((s, i) => (
              <Section key={i} delay={i * 0.12}>
                <div style={{ display: "flex", gap: 32, padding: "48px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: F, fontSize: 56, fontWeight: 400, color: i === 2 ? "#4ade80" : "rgba(255,255,255,0.08)", lineHeight: 1, flexShrink: 0, minWidth: 70 }}>{s.n}</span>
                  <div>
                    <h3 style={{ fontFamily: FB, fontSize: 20, fontWeight: 700, color: "#fff", margin: "8px 0 12px" }}>
                      {s.t}
                      {i === 2 && <span style={{ marginLeft: 12, fontFamily: FB, fontSize: 10, fontWeight: 700, color: "#0a0f0a", background: "#4ade80", padding: "3px 10px", borderRadius: 100, verticalAlign: "middle" }}>{t.rec}</span>}
                    </h3>
                    <p style={{ fontFamily: FB, fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, maxWidth: 480 }}>{s.d}</p>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Section style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80" }}>{t.pricing_label}</span>
            <h2 style={{ fontFamily: F, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, lineHeight: 1.15, margin: "20px 0 16px" }}>
              {t.pricing_h2a} <em style={{ color: "#4ade80", fontStyle: "italic" }}>{t.pricing_h2b}</em>
            </h2>
            <p style={{ fontFamily: FB, fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto" }}>{t.pricing_sub}</p>
          </Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 760, margin: "0 auto" }}>
            <Section delay={0.1}>
              <div style={{ padding: "36px 28px", borderRadius: 20, border: "1px solid rgba(74,222,128,0.3)", background: "linear-gradient(135deg, rgba(74,222,128,0.07), rgba(74,222,128,0.02))", height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#4ade80", background: "rgba(74,222,128,0.12)", padding: "4px 12px", borderRadius: 100 }}>{t.plan_dir_tag}</span>
                </div>
                <h3 style={{ fontFamily: FB, fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>{t.plan_dir_t}</h3>
                <p style={{ fontFamily: FB, fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 24px", flex: 1 }}>{t.plan_dir_d}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                  {t.plan_dir_features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <CheckSm />
                      <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: F, fontSize: 34, color: "#fff" }}>{t.plan_dir_price}</span>
                </div>
                <button onClick={() => setShowSubscribe(true)} style={{ display: "block", textAlign: "center", padding: "14px 24px", borderRadius: 100, background: "#4ade80", color: "#0a0f0a", fontFamily: FB, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", width: "100%", marginTop: 12, boxShadow: "0 0 30px rgba(74,222,128,0.25)" }}>
                  {lang === "es" ? "Suscribirse \u2014 Ver Datos de Contacto" : "Subscribe \u2014 View Contact Data"}
                </button>
              </div>
            </Section>
            <Section delay={0.2}>
              <div style={{ padding: "36px 28px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", height: "100%", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: FB, fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>{t.plan_prem_t}</h3>
                <p style={{ fontFamily: FB, fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 24px", flex: 1 }}>{t.plan_prem_d}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                  {t.plan_prem_features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <CheckSm />
                      <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{t.plan_prem_price}</span>
                </div>
                <a href={waLink(t.plan_prem_wa)} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "14px 24px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: FB, fontSize: 14, fontWeight: 600 }}>
                  {t.plan_prem_btn}
                </a>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* DIRECTORIO */}
      <div id="directorio" ref={dirRef} style={{ padding: "120px 24px 80px", background: "linear-gradient(180deg, transparent, rgba(74,222,128,0.03) 30%, rgba(74,222,128,0.05) 60%, rgba(74,222,128,0.03) 90%, transparent)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Section>
            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80" }}>{t.dir_label}</span>
            <h2 style={{ fontFamily: F, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, lineHeight: 1.15, margin: "20px 0 0" }}>
              {t.dir_h2a}<br /><em style={{ color: "#4ade80", fontStyle: "italic" }}>{t.dir_h2b}</em>
            </h2>
          </Section>
          <Section delay={0.1}>
            <p style={{ fontFamily: FB, fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "16px 0 0", maxWidth: 500 }}>{t.dir_sub}</p>
          </Section>
          <Section delay={0.15}>
            <div style={{ display: "flex", alignItems: "center", marginTop: 40, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "4px 4px 4px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <SearchIcon size={18} />
              <input type="text" placeholder={t.search} value={searchQ} onChange={(e) => setSearchQ(e.target.value)} style={{ flex: 1, border: "none", padding: "14px 12px", fontSize: 15, fontFamily: FB, background: "transparent", color: "#fff" }} />
              <button onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", border: "none", borderRadius: 10, background: showFilters ? "#4ade80" : "rgba(255,255,255,0.08)", color: showFilters ? "#0a0f0a" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, fontFamily: FB, transition: "all 0.2s ease" }}>
                <FilterIcon size={14} />{t.filter}
              </button>
            </div>
          </Section>
          {showFilters && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 18, marginTop: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { l: t.f_crop, v: selCrop, fn: setSelCrop, opts: ALL_CROPS, all: t.f_all_c },
                  { l: t.f_region, v: selRegion, fn: setSelRegion, opts: REGION_ORDER, all: t.f_all_r },
                  { l: t.f_type, v: selType, fn: setSelType, opts: [{ v: "EXPORT", l: t.f_exp }, { v: "DOMESTIC", l: t.f_dom }], all: t.f_all_t },
                ].map((f) => (
                  <div key={f.l} style={{ flex: 1, minWidth: 120 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(74,222,128,0.6)", letterSpacing: 1, display: "block", marginBottom: 6, fontFamily: FB }}>{f.l}</label>
                    <div style={{ position: "relative" }}>
                      <select value={f.v} onChange={(e) => f.fn(e.target.value)} style={{ width: "100%", padding: "10px 30px 10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, fontFamily: FB, color: "#fff", background: "rgba(255,255,255,0.05)" }}>
                        <option value="" style={{ background: "#1a1a1a" }}>{f.all}</option>
                        {f.opts.map((o) => typeof o === "string" ? <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option> : <option key={o.v} value={o.v} style={{ background: "#1a1a1a" }}>{o.l}</option>)}
                      </select>
                      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }}><ChevDown size={14} /></div>
                    </div>
                  </div>
                ))}
              </div>
              {(selCrop || selRegion || selType) && (
                <button onClick={() => { setSelCrop(""); setSelRegion(""); setSelType(""); }} style={{ marginTop: 12, padding: "6px 12px", border: "none", background: "rgba(239,68,68,0.15)", color: "#f87171", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FB }}>
                  {t.clear}
                </button>
              )}
            </div>
          )}
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                <strong style={{ color: "#fff" }}>{filtered.length}</strong> {t.results}
              </span>
              <span style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{t.corridor}</span>
            </div>
            {!selCrop ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {Object.entries(cropCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([crop, count]) => (
                  <button key={crop} onClick={() => setSelCrop(crop)} style={{ padding: "5px 11px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", fontFamily: FB, transition: "all 0.15s ease" }}>
                    {crop} <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: 3 }}>{count}</span>
                  </button>
                ))}
              </div>
            ) : (
              <button onClick={() => setSelCrop("")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", fontSize: 12, fontWeight: 600, color: "#4ade80", fontFamily: FB }}>
                {selCrop} <XIcon size={12} />
              </button>
            )}
          </div>

          {producersLoading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontFamily: FB, fontSize: 14 }}>
              Cargando productores...
            </div>
          )}

          {!producersLoading && filtered.map((p, i) => (
            <ProducerCard
              key={p.id}
              p={p}
              t={t}
              lang={lang}
              delay={0.1 + i * 0.06}
              visible={dirVisible}
              isSubscriber={isSubscriber}
              user={user}
              onLogin={() => openAuth('login')}
              onSubscribe={() => setShowSubscribe(true)}
            />
          ))}
          {!producersLoading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)" }}>
              <SearchIcon size={40} />
              <p style={{ fontFamily: FB, fontSize: 15, fontWeight: 500, margin: "16px 0 4px", color: "rgba(255,255,255,0.5)" }}>{t.no_t}</p>
              <p style={{ fontFamily: FB, fontSize: 13 }}>{t.no_p}</p>
            </div>
          )}
        </div>
      </div>

      {/* \u00bfPOR QU\u00c9 GROWI? */}
      <div style={{ padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Section>
            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80" }}>{t.why_label}</span>
            <h2 style={{ fontFamily: F, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, lineHeight: 1.15, margin: "20px 0 48px" }}>
              {t.why_h2a}<em style={{ fontStyle: "italic", color: "#4ade80" }}>{t.why_h2b}</em>
            </h2>
          </Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {t.why_cards.map((c, i) => (
              <Section key={i} delay={i * 0.1}>
                <div style={{ padding: "32px 24px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(74,222,128,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>{WHY_ICONS[i]}</div>
                  <h4 style={{ fontFamily: FB, fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>{c.t}</h4>
                  <p style={{ fontFamily: FB, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>{c.d}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "60px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontFamily: FB, fontSize: 20, fontWeight: 800, color: "#fff" }}>Growi</span>
        <p style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.2)", margin: "12px 0 0", lineHeight: 1.6 }}>{t.footer_p}<br />{t.footer_loc}</p>
        <p style={{ fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.1)", margin: "24px 0 0", fontStyle: "italic" }}>{t.footer_q}</p>
      </footer>

      {/* Modals */}
      <SubscribeModal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialView={authView} />
    </div>
  );
}
