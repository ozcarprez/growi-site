import { useState, useEffect, useRef } from "react";
import ConnectionRequestModal from './ConnectionRequestModal';
import SearchRequestModal from './SearchRequestModal';
import { supabase } from './supabaseClient';

const F = "'Instrument Serif', serif";
const FB = "'Outfit', sans-serif";
const WA_NUMBER = "526631261241";
const REGION_ORDER = ["Ensenada","Maneadero","Colonet","Vicente Guerrero","Camalu","San Quintin","El Rosario","Pescadero"];

function norm(p) {
  return { id:p.id, region:p.region||'', crops:Array.isArray(p.crops)?p.crops:[], capacity:p.capacity||'', acreage:p.acreage||0, certifications:Array.isArray(p.certifications)?p.certifications:['NA'], salesType:p.sales_type||'EXPORT', verified:!!p.verified, season:p.season||'', prices:Array.isArray(p.prices)?p.prices:[], photoUrl:p.photo_url||null, photos:Array.isArray(p.photos)?p.photos.filter(Boolean):(p.photo_url?[p.photo_url]:[]), packaging:p.packaging||null, borderCrossingDistance:p.border_crossing_distance||null };
}

async function fetchProd() {
  const { data, error } = await supabase.from('producers').select('id,region,crops,capacity,acreage,certifications,sales_type,verified,season,prices,photo_url,photos,packaging,border_crossing_distance').order('id');
  if (error) return [];
  return data || [];
}

function waLink(msg) { return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`; }
function useInView(th=0.15){const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect()}},{threshold:th});obs.observe(el);return()=>obs.disconnect()},[th]);return[ref,v]}
const Section=({children,delay=0,style={}})=>{const[ref,v]=useInView(0.1);return(<div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(40px)",transition:`opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,...style}}>{children}</div>)};
const StatCard=({number,label,delay})=>{const[ref,v]=useInView(0.1);return(<div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:`all 0.6s ease ${delay}s`}}><span style={{fontFamily:F,fontSize:48,fontWeight:400,color:"#fff",display:"block",lineHeight:1}}>{number}</span><span style={{fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginTop:8,display:"block"}}>{label}</span></div>)};

// Icons
const SearchIcon=({size=18})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const FilterIcon=({size=16})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const MapPinIcon=({size=14})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const ChevDown=({size=16})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);
const XIcon=({size=20})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>);
const ShieldCheck=({size=16})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>);
const LayersIcon=()=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>);
const ShieldIcon24=()=>(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>);
const TagIcon24=()=>(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>);
const UserIcon24=()=>(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>);
const WHY_ICONS=[<ShieldIcon24 key="s"/>,<TagIcon24 key="t"/>,<UserIcon24 key="u"/>];
const CheckSm=()=>(<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>);
const LinkIcon=({size=15})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>);

const LangToggle=({lang,setLang})=>(<div style={{display:"flex",borderRadius:100,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",padding:3,gap:2}}>{["es","en"].map(l=>(<button key={l} onClick={()=>setLang(l)} style={{fontFamily:FB,fontSize:12,fontWeight:600,padding:"6px 14px",borderRadius:100,border:"none",background:lang===l?"rgba(74,222,128,0.9)":"transparent",color:lang===l?"#0a0f0a":"rgba(255,255,255,0.4)",transition:"all 0.25s ease",letterSpacing:0.5}}>{l.toUpperCase()}</button>))}</div>);

const TX={
  es:{
    nav_cta:"Ver Productores",badge:"Baja California, Mexico",
    h1a:"Conecta directo",h1b:"con el productor",
    hero_p:"Encuentra productores agrícolas verificados en campo. Tú eliges, yo te conecto personalmente con el ranchero. Sin intermediarios.",
    cta1:"Explorar Directorio",cta2:"Cómo funciona",
    s1:"Productores",s2:"Regiones",s3:"Cultivos",s4:"Verificados en campo",
    who_label:"¿Para quién es Growi?",who_h2a:"Si necesitas llegar a un productor en Baja California,",who_h2b:"es para ti.",
    who_audiences:[{t:"Compradores e importadores",d:"Buscan producto fresco de Baja California"},{t:"Semilleras, insumos y empaque",d:"Semillas, plásticos, cintas de riego, cajas, tarimas y más"},{t:"Empresas de factoraje",d:"Necesitan relaciones comerciales activas verificadas"}],
    how_label:"Cómo Funciona",how_h2a:"Explora.",how_h2b:"Yo te conecto.",
    steps:[{n:"01",t:"Explora el directorio",d:"Busca por cultivo, región o temporada. Toda la información de producción y precios directos del rancho son visibles."},{n:"02",t:"Solicita una conexión",d:"¿Te interesa un productor? Solicita la conexión por $5,000 MXN. Me dices qué necesitas, cuánto volumen, y para cuándo."},{n:"03",t:"Yo hago la introducción",d:"Contacto personalmente al ranchero, le presento tu interés, y facilito la conexión directa entre ustedes."}],
    pricing_label:"Acceso",pricing_h2a:"Una conexión,",pricing_h2b:"un precio",
    pricing_sub:"Sin suscripciones. Pagas solo cuando quieres conectar con un productor específico.",
    plan_title:"Conexión directa",plan_desc:"Te conecto personalmente con el productor que elijas. Verifico disponibilidad, facilito la introducción, y te acompaño en la negociación inicial.",
    plan_features:["Introducción personal con el productor","Verificación de disponibilidad y precios","Apoyo en la negociación inicial","Seguimiento por 7 días","Sin compromisos ni suscripciones"],
    plan_price:"$5,000 MXN",plan_price_sub:"por conexión",plan_btn:"Solicitar conexión",
    plan_alt_title:"¿Buscas algo específico?",plan_alt_desc:"Si el producto que buscas no está en el directorio, lo busco en campo.",
    plan_alt_btn:"Solicitar búsqueda",plan_alt_wa:"Hola, busco un productor de [cultivo] en [región].",
    why_label:"¿Por Qué Growi?",why_h2a:"Cada dato fue recogido ",why_h2b:"en persona",
    why_cards:[{t:"Verificado en campo",d:"Cada productor fue visitado personalmente. No hay datos inventados."},{t:"Precios directos de rancho",d:"Ves los precios reales del productor. Sin intermediarios."},{t:"Conexión humana",d:"No eres un usuario más. Te conecto personalmente y acompaño la negociación."}],
    dir_label:"Directorio",dir_h2a:"Explora el directorio.",dir_h2b:"Crece cada mes.",
    dir_sub:"Explora cultivos, regiones, precios y capacidad. ¿Te interesa un productor? Solicita la conexión directa.",
    search:"Buscar cultivo, región...",filter:"Filtrar",results:"productores",corridor:"Ensenada - Pescadero",
    clear:"Limpiar filtros",no_t:"Sin resultados",no_p:"Intenta con otro cultivo o región",
    f_crop:"CULTIVO",f_region:"REGIÓN",f_type:"TIPO VENTA",f_all_c:"Todos",f_all_r:"Todas",f_all_t:"Todos",f_exp:"Export",f_dom:"Doméstico",
    c_cap:"CAPACIDAD",c_sea:"TEMPORADA",c_acr:"HECTÁREAS",
    connect_btn:"Solicitar conexión — $5,000 MXN",
    footer_p:"Datos verificados en campo. Corredor Ensenada - Pescadero.",footer_loc:"Baja California, Mexico.",footer_q:"El acceso a la red correcta lo cambia todo.",
  },
  en:{
    nav_cta:"View Producers",badge:"Baja California, Mexico",
    h1a:"Connect directly",h1b:"with the producer",
    hero_p:"Find field-verified agricultural producers. You choose, I personally connect you with the rancher. No middlemen.",
    cta1:"Explore Directory",cta2:"How it works",
    s1:"Producers",s2:"Regions",s3:"Crops",s4:"Field-verified",
    who_label:"Who is Growi for?",who_h2a:"If you need to reach a producer in Baja California,",who_h2b:"it's for you.",
    who_audiences:[{t:"Buyers and importers",d:"Looking for fresh produce from Baja California"},{t:"Seed companies, suppliers and packaging",d:"Seeds, plastics, drip tape, boxes, pallets and more"},{t:"Factoring companies",d:"Need verified active commercial relationships"}],
    how_label:"How It Works",how_h2a:"Explore.",how_h2b:"I'll connect you.",
    steps:[{n:"01",t:"Explore the directory",d:"Search by crop, region or season. All production info and direct ranch pricing are visible."},{n:"02",t:"Request a connection",d:"Interested in a producer? Request a connection for $5,000 MXN. Tell me what you need, how much, and when."},{n:"03",t:"I make the introduction",d:"I personally contact the rancher, present your interest, and facilitate the direct connection."}],
    pricing_label:"Access",pricing_h2a:"One connection,",pricing_h2b:"one price",
    pricing_sub:"No subscriptions. Pay only when you want to connect with a specific producer.",
    plan_title:"Direct connection",plan_desc:"I personally connect you with the producer you choose. I verify availability, facilitate the introduction, and support your negotiation.",
    plan_features:["Personal introduction with the producer","Availability and pricing verification","Support in initial negotiation","7-day follow-up","No commitments or subscriptions"],
    plan_price:"$5,000 MXN",plan_price_sub:"per connection",plan_btn:"Request connection",
    plan_alt_title:"Looking for something specific?",plan_alt_desc:"If the product you need isn't in the directory, I'll find it in the field.",
    plan_alt_btn:"Request a search",plan_alt_wa:"Hi, I'm looking for a producer of [crop] in [region].",
    why_label:"Why Growi?",why_h2a:"Every data point was collected ",why_h2b:"in person",
    why_cards:[{t:"Field-verified",d:"Every producer was visited personally. No fabricated data."},{t:"Direct ranch pricing",d:"See real producer prices. No middlemen."},{t:"Human connection",d:"You're not just another user. I personally connect you and support the negotiation."}],
    dir_label:"Directory",dir_h2a:"Explore the directory.",dir_h2b:"Grows every month.",
    dir_sub:"Explore crops, regions, pricing and capacity. Interested in a producer? Request a direct connection.",
    search:"Search crop, region...",filter:"Filter",results:"producers",corridor:"Ensenada - Pescadero",
    clear:"Clear filters",no_t:"No results",no_p:"Try another crop or region",
    f_crop:"CROP",f_region:"REGION",f_type:"SALES TYPE",f_all_c:"All",f_all_r:"All",f_all_t:"All",f_exp:"Export",f_dom:"Domestic",
    c_cap:"CAPACITY",c_sea:"SEASON",c_acr:"ACREAGE",
    connect_btn:"Request connection — $5,000 MXN",
    footer_p:"Field-verified data. Ensenada - Pescadero corridor.",footer_loc:"Baja California, Mexico.",footer_q:"Access to the right network changes everything.",
  },
};

const ProducerCard=({p,t,lang,delay,visible,onRequest})=>{
  const[photoIdx,setPhotoIdx]=useState(0);
  const photos=p.photos&&p.photos.length>0?p.photos:(p.photoUrl?[p.photoUrl]:[]);
  const isExp=p.salesType==="EXPORT";
  return(
    <div style={{background:"rgba(255,255,255,0.03)",borderRadius:20,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",marginBottom:16,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:`all 0.5s ease ${delay}s`}}>
      {photos.length>0&&(<div style={{position:'relative'}}>
        <img src={photos[photoIdx]} alt="Rancho" style={{width:'100%',height:260,objectFit:'cover',display:'block'}}/>
        {photos.length>1&&(<>
          <button onClick={e=>{e.stopPropagation();setPhotoIdx(i=>(i-1+photos.length)%photos.length)}} style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.5)',color:'#fff',border:'none',borderRadius:'50%',width:32,height:32,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
          <button onClick={e=>{e.stopPropagation();setPhotoIdx(i=>(i+1)%photos.length)}} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.5)',color:'#fff',border:'none',borderRadius:'50%',width:32,height:32,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
          <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>
            {photos.map((_,i)=>(<button key={i} onClick={e=>{e.stopPropagation();setPhotoIdx(i)}} style={{width:i===photoIdx?16:6,height:6,borderRadius:3,background:i===photoIdx?'#4ade80':'rgba(255,255,255,0.4)',border:'none',cursor:'pointer',transition:'all 0.2s',padding:0}}/>))}
          </div>
          <span style={{position:'absolute',top:8,right:8,fontFamily:FB,fontSize:11,fontWeight:600,color:'#fff',background:'rgba(0,0,0,0.5)',padding:'3px 8px',borderRadius:6}}>{photoIdx+1}/{photos.length}</span>
        </>)}
      </div>)}
      <div style={{padding:"24px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:FB,fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.5)"}}><span style={{fontWeight:700,color:"#4ade80",marginRight:8}}>{p.id}</span>{lang==="es"?"Productor verificado":"Verified producer"}</span>
            {p.verified&&<ShieldCheck size={18}/>}
          </div>
          <span style={{fontFamily:FB,fontSize:11,fontWeight:700,letterSpacing:0.8,padding:"4px 10px",borderRadius:6,background:isExp?"rgba(74,222,128,0.1)":"rgba(251,191,36,0.1)",color:isExp?"#4ade80":"#fbbf24"}}>{isExp?t.f_exp.toUpperCase():t.f_dom.toUpperCase()}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:14}}><MapPinIcon size={13}/><span style={{fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.4)"}}>{p.region}, B.C.</span></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{p.crops.map(c=>(<span key={c} style={{fontFamily:FB,fontSize:13,fontWeight:600,padding:"5px 12px",borderRadius:8,background:"rgba(74,222,128,0.08)",color:"#4ade80",border:"1px solid rgba(74,222,128,0.15)"}}>{c}</span>))}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:24,marginBottom:16}}>
          {[{l:t.c_cap,v:p.capacity},{l:t.c_sea,v:p.season},{l:t.c_acr,v:p.acreage},...(p.packaging?[{l:lang==="es"?"EMPAQUE":"PACKAGING",v:p.packaging}]:[]),...(p.borderCrossingDistance?[{l:lang==="es"?"CRUCE FRONTERIZO":"BORDER CROSSING",v:p.borderCrossingDistance}]:[])].filter(s=>s.v).map(s=>(
            <div key={s.l}><span style={{fontFamily:FB,fontSize:10,fontWeight:700,color:"rgba(74,222,128,0.6)",letterSpacing:1}}>{s.l}</span><p style={{fontFamily:FB,fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.8)",margin:"4px 0 0"}}>{s.v}</p></div>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:18}}>{p.certifications.map(c=>(<span key={c} style={{fontFamily:FB,fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.06)"}}>{c}</span>))}</div>
        {p.prices&&p.prices.length>0&&(
          <div style={{background:'rgba(74,222,128,0.04)',border:'1px solid rgba(74,222,128,0.12)',borderRadius:12,padding:'12px 16px',marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontFamily:FB,fontSize:10,fontWeight:700,color:'rgba(74,222,128,0.6)',letterSpacing:1}}>PRECIOS</span>
              <span style={{fontFamily:FB,fontSize:9,fontWeight:700,letterSpacing:1,color:'#0a0f0a',background:'#4ade80',padding:'2px 8px',borderRadius:100}}>DIRECTO DE RANCHO</span>
            </div>
            {p.prices.map((pr,i)=>(<div key={i} style={{fontFamily:FB,fontSize:13,color:'rgba(255,255,255,0.7)',marginTop:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}><span>{pr.crop} <span style={{color:'rgba(255,255,255,0.3)'}}>/ {pr.unit}</span></span><span><span style={{color:'#4ade80',fontWeight:600}}>${pr.price_min} USD</span>{pr.price_mxn&&<span style={{color:'rgba(255,255,255,0.4)',marginLeft:8}}>(${pr.price_mxn} MXN)</span>}</span></div>))}
          </div>
        )}
        <button onClick={()=>onRequest(p)} style={{width:'100%',display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 16px",borderRadius:12,background:"linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.08))",border:"1px solid rgba(74,222,128,0.25)",color:"#4ade80",fontSize:13,fontWeight:700,fontFamily:FB,cursor:"pointer",transition:"all 0.15s ease"}}>
          <LinkIcon size={15}/>{t.connect_btn}
        </button>
      </div>
    </div>
  );
};

export default function Growi(){
  const[lang,setLang]=useState("es");const[loaded,setLoaded]=useState(false);const[scrollY,setScrollY]=useState(0);
  const[searchQ,setSearchQ]=useState("");const[selCrop,setSelCrop]=useState("");const[selRegion,setSelRegion]=useState("");const[selType,setSelType]=useState("");
  const[showFilters,setShowFilters]=useState(false);const[showConn,setShowConn]=useState(false);const[selProd,setSelProd]=useState(null);const[showSearch,setShowSearch]=useState(false);
  const[producers,setProducers]=useState([]);const[loading,setLoading]=useState(true);const[dirVis,setDirVis]=useState(false);
  const dirRef=useRef(null);const t=TX[lang];

  useEffect(()=>{(async()=>{setLoading(true);try{const d=await fetchProd();if(d.length>0)setProducers(d.map(norm))}catch{}setLoading(false)})()},[]);
  useEffect(()=>{setTimeout(()=>setLoaded(true),100)},[]);
  useEffect(()=>{const h=()=>setScrollY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{const el=dirRef.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setDirVis(true);obs.disconnect()}},{threshold:0.05});obs.observe(el);return()=>obs.disconnect()},[]);

  const openReq=(p)=>{setSelProd(p);setShowConn(true)};
  const ALL_CROPS=[...new Set(producers.flatMap(p=>p.crops))].sort();
  const filtered=producers.filter(p=>{const q=searchQ.toLowerCase();return(!q||p.crops.some(c=>c.toLowerCase().includes(q))||p.region.toLowerCase().includes(q)||p.id.toLowerCase().includes(q))&&(!selCrop||p.crops.includes(selCrop))&&(!selRegion||p.region===selRegion)&&(!selType||p.salesType===selType)});
  const cropCounts={};filtered.forEach(p=>p.crops.forEach(c=>{cropCounts[c]=(cropCounts[c]||0)+1}));

  return(
    <div style={{background:"#0a0f0a",color:"#fff",minHeight:"100vh",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}::placeholder{color:rgba(255,255,255,0.3)}input:focus,select:focus,textarea:focus{outline:none}button{cursor:pointer}select{appearance:none;-webkit-appearance:none}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(3%,-15%)}50%{transform:translate(12%,9%)}70%{transform:translate(9%,4%)}90%{transform:translate(-1%,7%)}}body{background:#0a0f0a!important}a{text-decoration:none}`}</style>
      <div style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",opacity:0.03,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,backgroundSize:"128px 128px",animation:"grain 8s steps(10) infinite"}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 32px",background:scrollY>50?"rgba(10,15,10,0.9)":"transparent",backdropFilter:scrollY>50?"blur(20px)":"none",transition:"all 0.4s ease",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:FB,fontSize:22,fontWeight:800,color:"#fff",letterSpacing:-0.5}}>Growi</span>
        <div style={{display:"flex",alignItems:"center",gap:12}}><LangToggle lang={lang} setLang={setLang}/><a href="#directorio" style={{fontFamily:FB,fontSize:13,fontWeight:600,color:"#0a0f0a",background:"#4ade80",padding:"10px 24px",borderRadius:100}}>{t.nav_cta}</a></div>
      </nav>

      {/* HERO */}
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"120px 24px 80px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <div style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all 0.8s ease 0.2s"}}>
          <span style={{fontFamily:FB,fontSize:12,fontWeight:600,letterSpacing:3,textTransform:"uppercase",color:"#4ade80",display:"inline-flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:100,border:"1px solid rgba(74,222,128,0.2)",background:"rgba(74,222,128,0.05)"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",animation:"pulse 2s infinite"}}/>{t.badge}
          </span>
        </div>
        <h1 style={{fontFamily:F,fontSize:"clamp(40px, 8vw, 80px)",fontWeight:400,lineHeight:1.05,margin:"32px 0 0",maxWidth:800,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(30px)",transition:"all 0.8s ease 0.4s"}}>{t.h1a}<br/><em style={{color:"#4ade80",fontStyle:"italic"}}>{t.h1b}</em></h1>
        <p style={{fontFamily:FB,fontSize:18,fontWeight:300,color:"rgba(255,255,255,0.5)",maxWidth:540,lineHeight:1.7,margin:"28px 0 0",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all 0.8s ease 0.6s"}}>{t.hero_p}</p>
        <div style={{marginTop:48,display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all 0.8s ease 0.8s"}}>
          <a href="#directorio" style={{fontFamily:FB,fontSize:15,fontWeight:600,color:"#0a0f0a",background:"#4ade80",padding:"16px 36px",borderRadius:100,boxShadow:"0 0 40px rgba(74,222,128,0.3)"}}>{t.cta1}</a>
          <a href="#como-funciona" style={{fontFamily:FB,fontSize:15,fontWeight:500,color:"rgba(255,255,255,0.6)",padding:"16px 36px",borderRadius:100,border:"1px solid rgba(255,255,255,0.1)"}}>{t.cta2}</a>
        </div>
        <div style={{position:"absolute",bottom:40,animation:"float 3s ease infinite",opacity:loaded?0.3:0,transition:"opacity 1s ease 1.5s"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>
      </div>

      {/* STATS */}
      <div style={{padding:"60px 24px",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:40,textAlign:"center"}}>
          <StatCard number={`${producers.length}+`} label={t.s1} delay={0}/><StatCard number={REGION_ORDER.length} label={t.s2} delay={0.1}/><StatCard number={`${ALL_CROPS.length}+`} label={t.s3} delay={0.2}/><StatCard number="100%" label={t.s4} delay={0.3}/>
        </div>
      </div>

      {/* PARA QUIÉN */}
      <div style={{padding:"120px 24px",background:"linear-gradient(180deg, transparent 0%, rgba(74,222,128,0.02) 50%, transparent 100%)"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <Section><span style={{fontFamily:FB,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#4ade80"}}>{t.who_label}</span><h2 style={{fontFamily:F,fontSize:"clamp(28px, 4vw, 44px)",fontWeight:400,lineHeight:1.2,margin:"20px 0 48px",maxWidth:600}}>{t.who_h2a}<br/><em style={{color:"#4ade80",fontStyle:"italic"}}>{t.who_h2b}</em></h2></Section>
          <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:600}}>
            {t.who_audiences.map((a,i)=>(<Section key={i} delay={i*0.1}><div style={{display:"flex",alignItems:"center",gap:16,padding:"20px 24px",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)"}}><div style={{width:40,height:40,borderRadius:12,background:"rgba(74,222,128,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><LayersIcon/></div><div><div style={{fontFamily:FB,fontSize:15,fontWeight:700,color:"#fff",marginBottom:4}}>{a.t}</div><div style={{fontFamily:FB,fontSize:13,fontWeight:300,color:"rgba(255,255,255,0.45)"}}>{a.d}</div></div></div></Section>))}
          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div id="como-funciona" style={{padding:"120px 24px",background:"linear-gradient(180deg, transparent 0%, rgba(74,222,128,0.03) 50%, transparent 100%)"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <Section><span style={{fontFamily:FB,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#4ade80"}}>{t.how_label}</span><h2 style={{fontFamily:F,fontSize:"clamp(32px, 5vw, 52px)",fontWeight:400,lineHeight:1.15,margin:"20px 0 0"}}>{t.how_h2a}<br/><em style={{color:"#4ade80",fontStyle:"italic"}}>{t.how_h2b}</em></h2></Section>
          <div style={{marginTop:64}}>
            {t.steps.map((st,i)=>(<Section key={i} delay={i*0.12}><div style={{display:"flex",gap:32,padding:"48px 0",borderBottom:i<2?"1px solid rgba(255,255,255,0.06)":"none",alignItems:"flex-start"}}><span style={{fontFamily:F,fontSize:56,fontWeight:400,color:i===1?"#4ade80":"rgba(255,255,255,0.08)",lineHeight:1,flexShrink:0,minWidth:70}}>{st.n}</span><div><h3 style={{fontFamily:FB,fontSize:20,fontWeight:700,color:"#fff",margin:"8px 0 12px"}}>{st.t}{i===1&&<span style={{marginLeft:12,fontFamily:FB,fontSize:10,fontWeight:700,color:"#0a0f0a",background:"#4ade80",padding:"3px 10px",borderRadius:100,verticalAlign:"middle"}}>$5,000 MXN</span>}</h3><p style={{fontFamily:FB,fontSize:15,fontWeight:300,color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:0,maxWidth:480}}>{st.d}</p></div></div></Section>))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{padding:"120px 24px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <Section style={{textAlign:"center",marginBottom:56}}>
            <span style={{fontFamily:FB,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#4ade80"}}>{t.pricing_label}</span>
            <h2 style={{fontFamily:F,fontSize:"clamp(32px, 5vw, 52px)",fontWeight:400,lineHeight:1.15,margin:"20px 0 16px"}}>{t.pricing_h2a} <em style={{color:"#4ade80",fontStyle:"italic"}}>{t.pricing_h2b}</em></h2>
            <p style={{fontFamily:FB,fontSize:16,fontWeight:300,color:"rgba(255,255,255,0.45)",maxWidth:480,margin:"0 auto"}}>{t.pricing_sub}</p>
          </Section>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:760,margin:"0 auto"}}>
            <Section delay={0.1}><div style={{padding:"36px 28px",borderRadius:20,border:"1px solid rgba(74,222,128,0.3)",background:"linear-gradient(135deg, rgba(74,222,128,0.07), rgba(74,222,128,0.02))",height:"100%",display:"flex",flexDirection:"column"}}>
              <h3 style={{fontFamily:FB,fontSize:20,fontWeight:700,color:"#fff",margin:"0 0 14px"}}>{t.plan_title}</h3>
              <p style={{fontFamily:FB,fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.45)",lineHeight:1.7,margin:"0 0 24px",flex:1}}>{t.plan_desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>{t.plan_features.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8}}><CheckSm/><span style={{fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.4}}>{f}</span></div>))}</div>
              <div style={{marginBottom:24}}><span style={{fontFamily:F,fontSize:34,color:"#fff"}}>{t.plan_price}</span><span style={{fontFamily:FB,fontSize:14,color:"rgba(255,255,255,0.35)",marginLeft:8}}>{t.plan_price_sub}</span></div>
              <a href="#directorio" style={{display:"block",textAlign:"center",padding:"14px 24px",borderRadius:100,background:"#4ade80",color:"#0a0f0a",fontFamily:FB,fontSize:14,fontWeight:700,boxShadow:"0 0 30px rgba(74,222,128,0.25)"}}>{t.plan_btn}</a>
            </div></Section>
            <Section delay={0.2}><div style={{padding:"36px 28px",borderRadius:20,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.02)",height:"100%",display:"flex",flexDirection:"column"}}>
              <h3 style={{fontFamily:FB,fontSize:20,fontWeight:700,color:"#fff",margin:"0 0 14px"}}>{t.plan_alt_title}</h3>
              <p style={{fontFamily:FB,fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.45)",lineHeight:1.7,margin:"0 0 24px",flex:1}}>{t.plan_alt_desc}</p>
              <button onClick={()=>setShowSearch(true)} style={{display:"block",width:"100%",textAlign:"center",padding:"14px 24px",borderRadius:100,border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.7)",fontFamily:FB,fontSize:14,fontWeight:600,marginTop:"auto",background:"transparent",cursor:"pointer"}}>{t.plan_alt_btn}</button>
            </div></Section>
          </div>
        </div>
      </div>

      {/* DIRECTORIO */}
      <div id="directorio" ref={dirRef} style={{padding:"120px 24px 80px",background:"linear-gradient(180deg, transparent, rgba(74,222,128,0.03) 30%, rgba(74,222,128,0.05) 60%, rgba(74,222,128,0.03) 90%, transparent)"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <Section><span style={{fontFamily:FB,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#4ade80"}}>{t.dir_label}</span><h2 style={{fontFamily:F,fontSize:"clamp(32px, 5vw, 52px)",fontWeight:400,lineHeight:1.15,margin:"20px 0 0"}}>{t.dir_h2a}<br/><em style={{color:"#4ade80",fontStyle:"italic"}}>{t.dir_h2b}</em></h2></Section>
          <Section delay={0.1}><p style={{fontFamily:FB,fontSize:15,fontWeight:300,color:"rgba(255,255,255,0.45)",lineHeight:1.7,margin:"16px 0 0",maxWidth:500}}>{t.dir_sub}</p></Section>
          <Section delay={0.15}>
            <div style={{display:"flex",alignItems:"center",marginTop:40,background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"4px 4px 4px 16px",border:"1px solid rgba(255,255,255,0.08)"}}>
              <SearchIcon size={18}/><input type="text" placeholder={t.search} value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{flex:1,border:"none",padding:"14px 12px",fontSize:15,fontFamily:FB,background:"transparent",color:"#fff"}}/>
              <button onClick={()=>setShowFilters(!showFilters)} style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",border:"none",borderRadius:10,background:showFilters?"#4ade80":"rgba(255,255,255,0.08)",color:showFilters?"#0a0f0a":"rgba(255,255,255,0.5)",fontSize:13,fontWeight:600,fontFamily:FB,transition:"all 0.2s ease"}}><FilterIcon size={14}/>{t.filter}</button>
            </div>
          </Section>
          {showFilters&&(<div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,padding:18,marginTop:12,border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[{l:t.f_crop,v:selCrop,fn:setSelCrop,opts:ALL_CROPS,all:t.f_all_c},{l:t.f_region,v:selRegion,fn:setSelRegion,opts:REGION_ORDER,all:t.f_all_r},{l:t.f_type,v:selType,fn:setSelType,opts:[{v:"EXPORT",l:t.f_exp},{v:"DOMESTIC",l:t.f_dom}],all:t.f_all_t}].map(f=>(<div key={f.l} style={{flex:1,minWidth:120}}><label style={{fontSize:10,fontWeight:700,color:"rgba(74,222,128,0.6)",letterSpacing:1,display:"block",marginBottom:6,fontFamily:FB}}>{f.l}</label><div style={{position:"relative"}}><select value={f.v} onChange={e=>f.fn(e.target.value)} style={{width:"100%",padding:"10px 30px 10px 12px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:13,fontFamily:FB,color:"#fff",background:"rgba(255,255,255,0.05)"}}><option value="" style={{background:"#1a1a1a"}}>{f.all}</option>{f.opts.map(o=>typeof o==="string"?<option key={o} value={o} style={{background:"#1a1a1a"}}>{o}</option>:<option key={o.v} value={o.v} style={{background:"#1a1a1a"}}>{o.l}</option>)}</select><div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"rgba(255,255,255,0.3)"}}><ChevDown size={14}/></div></div></div>))}
            </div>
            {(selCrop||selRegion||selType)&&<button onClick={()=>{setSelCrop("");setSelRegion("");setSelType("")}} style={{marginTop:12,padding:"6px 12px",border:"none",background:"rgba(239,68,68,0.15)",color:"#f87171",borderRadius:6,fontSize:12,fontWeight:600,fontFamily:FB}}>{t.clear}</button>}
          </div>)}
          <div style={{marginTop:20,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.4)"}}><strong style={{color:"#fff"}}>{filtered.length}</strong> {t.results}</span><span style={{fontFamily:FB,fontSize:11,color:"rgba(255,255,255,0.2)"}}>{t.corridor}</span></div>
            {!selCrop?(<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{Object.entries(cropCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([crop,count])=>(<button key={crop} onClick={()=>setSelCrop(crop)} style={{padding:"5px 11px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.5)",fontFamily:FB}}>{crop} <span style={{color:"rgba(255,255,255,0.2)",marginLeft:3}}>{count}</span></button>))}</div>):(<button onClick={()=>setSelCrop("")} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,border:"1px solid rgba(74,222,128,0.3)",background:"rgba(74,222,128,0.08)",fontSize:12,fontWeight:600,color:"#4ade80",fontFamily:FB}}>{selCrop} <XIcon size={12}/></button>)}
          </div>
          {loading&&<div style={{textAlign:'center',padding:'40px 0',color:'rgba(255,255,255,0.3)',fontFamily:FB,fontSize:14}}>{lang==='es'?'Cargando productores...':'Loading producers...'}</div>}
          {!loading&&filtered.map((p,i)=>(<ProducerCard key={p.id} p={p} t={t} lang={lang} delay={0.1+i*0.06} visible={dirVis} onRequest={openReq}/>))}
          {!loading&&filtered.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,0.3)"}}><SearchIcon size={40}/><p style={{fontFamily:FB,fontSize:15,fontWeight:500,margin:"16px 0 4px",color:"rgba(255,255,255,0.5)"}}>{t.no_t}</p><p style={{fontFamily:FB,fontSize:13}}>{t.no_p}</p></div>}
        </div>
      </div>

      {/* POR QUÉ GROWI */}
      <div style={{padding:"120px 24px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <Section><span style={{fontFamily:FB,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#4ade80"}}>{t.why_label}</span><h2 style={{fontFamily:F,fontSize:"clamp(32px, 5vw, 48px)",fontWeight:400,lineHeight:1.15,margin:"20px 0 48px"}}>{t.why_h2a}<em style={{fontStyle:"italic",color:"#4ade80"}}>{t.why_h2b}</em></h2></Section>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>{t.why_cards.map((c,i)=>(<Section key={i} delay={i*0.1}><div style={{padding:"32px 24px",borderRadius:20,border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)",textAlign:"center"}}><div style={{width:52,height:52,borderRadius:14,background:"rgba(74,222,128,0.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>{WHY_ICONS[i]}</div><h4 style={{fontFamily:FB,fontSize:15,fontWeight:700,color:"#fff",margin:"0 0 10px"}}>{c.t}</h4><p style={{fontFamily:FB,fontSize:13,fontWeight:300,color:"rgba(255,255,255,0.4)",lineHeight:1.6,margin:0}}>{c.d}</p></div></Section>))}</div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{padding:"60px 24px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <span style={{fontFamily:FB,fontSize:20,fontWeight:800,color:"#fff"}}>Growi</span>
        <p style={{fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.2)",margin:"12px 0 0",lineHeight:1.6}}>{t.footer_p}<br/>{t.footer_loc}</p>
        <p style={{fontFamily:F,fontSize:14,color:"rgba(255,255,255,0.1)",margin:"24px 0 0",fontStyle:"italic"}}>{t.footer_q}</p>
      </footer>

      <ConnectionRequestModal isOpen={showConn} onClose={()=>{setShowConn(false);setSelProd(null)}} producer={selProd} lang={lang}/>
      <SearchRequestModal isOpen={showSearch} onClose={()=>setShowSearch(false)} lang={lang}/>
    </div>
  );
}
