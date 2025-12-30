import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  Clock, 
  Dumbbell, 
  Rocket, 
  AlertCircle,
  ChevronRight,
  Loader2,
  Copy,
  Check, 
  History,
  Trash2,
  ExternalLink,
  Download,
  Flame,
  Briefcase,
  ShoppingBag,
  Quote,
  Store,
  Settings,
  ChevronUp,
  FileText,
  FileJson,
  Plus,
  Star,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Lock,
  Brain,
  ShieldAlert,
  HardDrive,
  Cpu,
  Eye,
  Video,
  BookOpen,
  FileUp,
  X,
  KeyRound,
  UploadCloud,
  Sparkles,
  Database,
  Library,
  Search,
  BarChart3,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Languages,
  ChevronDown,
  FileDown,
  Sword,
  Skull,
  MessageSquareText,
  Mic,
  Send,
  ShieldQuestion,
  Crown,
  LogIn,
  LayoutDashboard,
  User
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from "jspdf";

// --- Supabase Client ---
const supabaseUrl = 'https://sxetinqdzjlstdlanjma.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZXRpbnFkemp5c3RkbGFuam1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMjc3MDMsImV4cCI6MjA1MDgwMzcwM30.gQfWR8rjuMG_czUsjsXUXzS1f3nfGz2OZQ3gaBPw_UaOg2i';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Types ---
type OfferCategory = 'high-ticket' | 'low-ticket' | 'ecommerce' | 'physical' | 'services';
type Language = 'es' | 'en';
type ScriptType = 'vsl' | 'closer' | 'dm' | 'email';
type UserPlan = 'free' | 'starter' | 'scale-master' | 'agency';

interface OfferResult {
  text: string;
  isStreaming: boolean;
  input?: string;
  offerType?: OfferCategory;
  timestamp?: number;
}

interface SavedOffer {
  id: string;
  input: string;
  text: string;
  offerType: OfferCategory;
  timestamp: number;
}

interface KnowledgeItem {
  id: string;
  type: 'pdf' | 'book' | 'video';
  name: string;
  content: string;
  timestamp: number;
  size?: string;
  isLearned: boolean;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  timestamp: number;
}

// --- Constants ---
const ADMIN_PASSWORD = "Daya2707";
const OWNER_EMAIL = "mlkonline2022@gmail.com";
const OWNER_PASS = "loko27";
const MAX_FREE_TRIAL = 9999; 
const STARTER_LIMIT = 10;

// --- Translations ---
const translations = {
  es: {
    badge: "Crea ofertas irresistibles que venden solas",
    heroTitle: "DEJA DE VENDER <span class='text-[#FF5C00]'>BARATO</span> Y EMPIEZA A SER <span class='text-[#FF5C00]'>IRRESISTIBLE</span>",
    heroSub: "La IA que diseña tu oferta Grand Slam en segundos. No compitas por precio, compite por <span class='text-white font-black underline decoration-[#FF5C00]'>valor masivo</span>.",
    placeholder: "Cuéntame qué vendes, a quién y cómo lo cobras ahora mismo. Ej: 'Membresía gym 30€/mes para mujeres 25-40 que quieren perder peso' o 'Tienda online de ropa, ticket medio 45€'...",
    generateBtn: "GENERAR OFERTA GRAND SLAM",
    generatingBtn: "DISEÑANDO VALOR MASIVO...",
    viewPlans: "Ver Planes",
    loginBtn: "Iniciar Sesión",
    credits: "Créditos Disponibles",
    adminMode: "Acceso Maestro",
    historyTitle: "Tu Historial",
    historySub: "Todas tus ofertas optimizadas",
    historyEmpty: "No hay ofertas guardadas todavía. Escribe arriba qué vendes y pulsa 'GENERAR OFERTA GRAND SLAM' para empezar.",
    exportBtn: "Exportar Ofertas",
    viewFull: "Ver completa",
    duplicate: "Duplicar",
    delete: "Eliminar",
    pricingTitle: "ELIGE TU VEHÍCULO DE ESCALADO",
    pricingSub: "Haz que se sientan estúpidos diciendo que no.",
    lockedTitle: "ACCESO BLOQUEADO",
    lockedSub: "HAS AGOTADO TU BÚSQUEDA GRATUITA. REGÍSTRATE GRATIS PARA SEGUIR ESCALANDO.",
    unlockNow: "REGÍSTRATE GRATIS Y PRUÉBALA",
    langName: "ES",
    navAdmin: "Panel Maestro",
    navPremium: "Herramientas Premium",
    navAnalyzer: "Analizador",
    navPanel: "Mi Bóveda",
    panelTitle: "BÓVEDA ESTRATÉGICA",
    panelSub: "Gestiona tu arsenal de ofertas ganadoras.",
    close: "Cerrar",
    exportJson: "Exportar JSON",
    exportTxt: "Exportar TXT",
    exportPdf: "Exportar PDF",
    successMsg: "¡BIENVENIDO A BORDO!",
    successSub: "Tu acceso ha sido desbloqueado. Ya puedes cerrar esta ventana y empezar a crear.",
    formName: "NOMBRE COMPLETO",
    formEmail: "TU EMAIL DE NEGOCIOS",
    formPhone: "TELÉFONO (PARA WHATSAPP)",
    downloadOffer: "Descargar Oferta",
    adminTabBrain: "Cerebro",
    adminTabLibrary: "Bóveda",
    adminTabLeads: "Leads",
    adminTabCompetitor: "Analizador",
    adminTabScripts: "Guiones",
    compPlaceholder: "Copia aquí la oferta de tu competencia (precio, qué prometen, qué incluyen)...",
    compBtn: "ANALIZAR Y DESTRUIR",
    compResultTitle: "TEARDOWN ESTRATÉGICO",
    scriptObjections: "OBJECIONES A DESTRUIR",
    scriptBtn: "GENERAR ARMA DE VENTAS",
    scriptTypeVSL: "Video (VSL)",
    scriptTypeCloser: "Llamada Closer",
    scriptTypeDM: "Mensajes DM",
    scriptTypeEmail: "Email Frío",
    scriptCopy: "Copiar Guion",
    premiumHubTitle: "HUB DE ELITE SCALE MASTER",
    premiumHubSub: "Herramientas de guerra comercial reservadas para profesionales.",
    premiumLocked: "PLAN SCALE MASTER REQUERIDO"
  },
  en: {
    badge: "Create irresistible offers that sell themselves",
    heroTitle: "STOP SELLING <span class='text-[#FF5C00]'>CHEAP</span> AND START BEING <span class='text-[#FF5C00]'>IRRESISTIBLE</span>",
    heroSub: "The AI that designs your Grand Slam offer in seconds. Don't compete on price, compete on <span class='text-white font-black underline decoration-[#FF5C00]'>massive value</span>.",
    placeholder: "Tell me what you sell, to whom, and how you charge right now. E.g.: 'Gym membership $30/mo for women 25-40 looking to lose weight' or 'Clothing online store, avg ticket $45'...",
    generateBtn: "GENERATE GRAND SLAM OFFER",
    generatingBtn: "DESIGNING MASSIVE VALUE...",
    viewPlans: "View Plans",
    loginBtn: "Login",
    credits: "Credits Available",
    adminMode: "Master Access",
    historyTitle: "Your History",
    historySub: "All your optimized offers",
    historyEmpty: "No saved offers yet. Type above what you sell and click 'GENERATE GRAND SLAM OFFER' to start.",
    exportBtn: "Export Offers",
    viewFull: "View Full",
    duplicate: "Duplicate",
    delete: "Delete",
    pricingTitle: "CHOOSE YOUR SCALING VEHICLE",
    pricingSub: "Make them feel stupid saying no.",
    lockedTitle: "ACCESS LOCKED",
    lockedSub: "YOU HAVE EXHAUSTED YOUR FREE SEARCH. REGISTER FOR FREE TO CONTINUE SCALING.",
    unlockNow: "REGISTER FOR FREE & TRY IT",
    langName: "EN",
    navAdmin: "Master Panel",
    navPremium: "Premium Tools",
    navAnalyzer: "Analyzer",
    navPanel: "My Vault",
    panelTitle: "STRATEGIC VAULT",
    panelSub: "Manage your arsenal of winning offers.",
    close: "Close",
    exportJson: "Export JSON",
    exportTxt: "Export TXT",
    exportPdf: "Export PDF",
    successMsg: "WELCOME ABOARD!",
    successSub: "Your access has been unlocked. You can now close this window and start creating.",
    formName: "FULL NAME",
    formEmail: "BUSINESS EMAIL",
    formPhone: "PHONE (FOR WHATSAPP)",
    downloadOffer: "Download Offer",
    adminTabBrain: "Brain",
    adminTabLibrary: "Vault",
    adminTabLeads: "Leads",
    adminTabCompetitor: "Analyzer",
    adminTabScripts: "Scripts",
    compPlaceholder: "Paste your competitor's offer here (price, promise, inclusions)...",
    compBtn: "ANALYZE & DESTROY",
    compResultTitle: "STRATEGIC TEARDOWN",
    scriptObjections: "OBJECTIONS TO CRUSH",
    scriptBtn: "GENERATE SALES WEAPON",
    scriptTypeVSL: "Video (VSL)",
    scriptTypeCloser: "Closer Call",
    scriptTypeDM: "DM Outreach",
    scriptTypeEmail: "Cold Email",
    scriptCopy: "Copy Script",
    premiumHubTitle: "SCALE MASTER ELITE HUB",
    premiumHubSub: "Commercial warfare tools reserved for professionals.",
    premiumLocked: "SCALE MASTER PLAN REQUIRED"
  }
};

// --- System Instruction ---
const getSystemInstruction = (lang: Language) => `
ROL: Eres la versión definitiva de Alex Hormozi impulsada por una Base de Conocimientos Específica.
TONO: Directo, brutalmente honesto, obsesionado con el ROI and el valor masivo. No seas breve. Sé exhaustivo.
IDIOMA: Responde siempre en ${lang === 'es' ? 'español' : 'inglés'}.
REGLA DE ORO DE MAGNITUD: Toda oferta generada DEBE tener al menos 7 PUNTOS DETALLADOS que compongan la solución completa. 
Estructura obligatoria de los 7 puntos:
1. EL MECANISEMO CENTRAL (Tu solución principal reinventada).
2. BONO DE VELOCIDAD (Algo que acelere el resultado).
3. BONO DE ESFUERZO CERO (Algo que les quite trabajo de encima).
4. EL MULTIPLICADOR DE VALOR (Un componente que haga la oferta 10 veces más valiosa).
5. GARANTÍA DE "SENTIDO COMÚN" (Una garantía tan fuerte que elimine el riesgo totalmente).
6. ACELERADOR DE RESULTADOS (Herramienta, software o comunidad).
7. COMPONENTE DE ESCASEZ Y URGENCIA (Por qué deben comprar HOY).

INSTRUCCIÓN CRÍTICA: Debes utilizar prioritariamente la información en el [KNOWLEDGE_NUCLEUS] para personalizar tus respuestas.
OBJETIVO: Crear una "Oferta Grand Slam" que reduzca el esfuerzo a cero y aumente la certeza al 100%. Haz que la respuesta sea ESPECTACULAR, LARGA y VISUALMENTE IMPACTANTE.
`;

// --- UI Components ---

const Badge = ({ children }: { children?: React.ReactNode }) => (
  <span className="bg-[#FF5C00]/10 text-[#FF5C00] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#FF5C00]/20 mb-4 inline-block">
    {children}
  </span>
);

const PricingCard = ({ title, price, value, features, popular = false, cta, onCtaClick, lang, promoText }: any) => {
  return (
    <div className={`relative flex flex-col p-8 rounded-3xl border-2 ${popular ? 'border-[#FF5C00] bg-[#1A1A1A] scale-105 z-10' : 'border-white/5 bg-[#111]'} transition-all`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF5C00] text-black text-[10px] font-black uppercase px-4 py-1 rounded-full">
          {lang === 'es' ? 'Más Popular' : 'Most Popular'}
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-black uppercase italic">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-4xl font-black text-white">{price}€</span>
        {value && <span className="text-gray-500 line-through text-sm font-bold">{value}€</span>}
      </div>
      {promoText && (
        <p className="text-[#FF5C00] text-[10px] font-black uppercase tracking-widest mb-4 animate-pulse">
          {promoText}
        </p>
      )}
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">
        {lang === 'es' ? 'Pago mensual. Sin permanencia.' : 'Monthly payment. No commitment.'}
      </p>
      
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <CheckCircle2 className="w-5 h-5 text-[#FF5C00] shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      
      <div className="space-y-3">
        <button 
          onClick={() => onCtaClick(title)}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-tighter transition-all ${popular ? 'bg-[#FF5C00] text-white hover:bg-[#E04F00] shadow-[0_10px_30px_rgba(255,92,0,0.3)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          {cta}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [language, setLanguage] = useState<Language>('es');
  const [input, setInput] = useState('');
  const [offerType, setOfferType] = useState<OfferCategory>('high-ticket');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OfferResult | null>(null);
  const [history, setHistory] = useState<SavedOffer[]>([]);
  const [globalLibrary, setGlobalLibrary] = useState<SavedOffer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [trialCount, setTrialCount] = useState(0);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState<string | null>(null);
  const [showPremiumHub, setShowPremiumHub] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [loginPass, setLoginPass] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
  const [permanentBrain, setPermanentBrain] = useState<string>('');
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'brain' | 'library' | 'leads' | 'competitor' | 'scripts'>('brain');
  const [premiumTab, setPremiumTab] = useState<'competitor' | 'scripts'>('competitor');
  const [searchQuery, setSearchQuery] = useState('');
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastLogoClick, setLastLogoClick] = useState(0);
  const [isUploading, setIsUploading] = useState<KnowledgeItem['type'] | null>(null);
  const [learningId, setLearningId] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  
  // Competitor Analyzer State
  const [competitorInput, setCompetitorInput] = useState('');
  const [competitorResult, setCompetitorResult] = useState('');
  const [isAnalyzingComp, setIsAnalyzingComp] = useState(false);

  // Sales Script Generator State
  const [scriptType, setScriptType] = useState<ScriptType>('closer');
  const [scriptObjections, setScriptObjections] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [scriptResult, setScriptResult] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '' });
  const [signupSuccess, setSignupSuccess] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: keyof typeof translations['es']) => translations[language][key];

  // Identificador de sesión para trial (no persistente en localStorage)
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Cargar Usuarios (Leads)
      const { data: usersData } = await supabase.from('usuarios').select('*');
      if (usersData) {
        setLeads(usersData.map(u => ({
          id: u.id || u.correo_electronico,
          name: u.nombre,
          email: u.correo_electronico,
          phone: u.telefono,
          plan: u.plan,
          timestamp: new Date(u.timestamp).getTime()
        })));
      }

      // 2. Cargar Ofertas (Globales)
      const { data: offersData } = await supabase.from('ofertas').select('*').order('timestamp', { ascending: false });
      if (offersData) {
        const mapped = offersData.map(o => ({
          id: o.id.toString(),
          input: o.input,
          text: o.texto,
          offerType: o.tipo_oferta as OfferCategory,
          timestamp: new Date(o.timestamp).getTime(),
          usuario_email: o.usuario_email
        }));
        setGlobalLibrary(mapped);
        // El historial del usuario actual lo filtramos si estuviera logueado, sino mostramos los de esta sesión
        setHistory(mapped.filter(o => o.usuario_email === loginEmail || !o.usuario_email));
      }

      // 3. Cargar Configuración (Cerebro y Conocimiento)
      const { data: configData } = await supabase.from('configuracion').select('*');
      if (configData) {
        const brainConfig = configData.find(c => c.clave === 'permanent_brain');
        const knowledgeConfig = configData.find(c => c.clave === 'knowledge_base');
        const trialConfig = configData.find(c => c.clave === `trial_${sessionId}`);

        if (brainConfig) setPermanentBrain(brainConfig.valor);
        if (knowledgeConfig) setKnowledgeBase(JSON.parse(knowledgeConfig.valor));
        if (trialConfig) setTrialCount(parseInt(trialConfig.valor));
      }
    } catch (err) {
      console.error("Error cargando datos de Supabase:", err);
    }
  };

  const logUsage = async (action: string, email?: string) => {
    await supabase.from('historial_de_uso').insert({
      usuario_email: email || OWNER_EMAIL,
      accion: action,
      timestamp: new Date().toISOString()
    });
  };

  const toggleLanguage = () => {
    const next = language === 'es' ? 'en' : 'es';
    setLanguage(next);
  };

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastLogoClick < 2000) {
      const newCount = logoClicks + 1;
      setLogoClicks(newCount);
      if (newCount >= 5) {
        setShowLogin(true);
        setLogoClicks(0);
      }
    } else {
      setLogoClicks(1);
    }
    setLastLogoClick(now);
  };

  const handleAdminLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (loginEmail.toLowerCase() === OWNER_EMAIL && loginPass === OWNER_PASS) {
      setIsAdmin(true);
      setUserPlan('scale-master');
      setShowLogin(false);
      setAdminMenuOpen(true);
      
      // Sincronizar historial del admin
      const { data } = await supabase.from('ofertas').select('*').eq('usuario_email', OWNER_EMAIL);
      if (data) {
          setHistory(data.map(o => ({
            id: o.id.toString(),
            input: o.input,
            text: o.texto,
            offerType: o.tipo_oferta as OfferCategory,
            timestamp: new Date(o.timestamp).getTime()
          })));
      }

      setLoginEmail('');
      setLoginPass('');
      setLoginError(false);
      logUsage("Login Administrador", OWNER_EMAIL);
      return;
    }

    setLoginError(true);
    setTimeout(() => setLoginError(false), 2000);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = {
      nombre: signupForm.name,
      correo_electronico: signupForm.email,
      telefono: signupForm.phone,
      plan: showSignup || 'starter',
      timestamp: new Date().toISOString()
    };

    try {
      await supabase.from('usuarios').upsert(newLead, { onConflict: 'correo_electronico' });
      
      setLeads(prev => [{
        id: Math.random().toString(),
        name: newLead.nombre,
        email: newLead.correo_electronico,
        phone: newLead.telefono,
        plan: newLead.plan,
        timestamp: Date.now()
      }, ...prev]);

      setUserPlan(newLead.plan.toLowerCase().includes('scale') ? 'scale-master' : 'starter');
      setSignupSuccess(true);
      logUsage(`Registro Usuario: ${newLead.plan}`, newLead.correo_electronico);
    } catch (err) {
      console.error("Error registrando usuario:", err);
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setUserPlan('free');
    setAdminMenuOpen(false);
    setShowUserDashboard(false);
  };

  const analyzeCompetitor = async () => {
    if (!competitorInput.trim()) return;
    setIsAnalyzingComp(true);
    setCompetitorResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: `ANALIZA ESTA COMPETENCIA: ${competitorInput}. 
        Usa los 4 pilares del valor de Hormozi: Certeza del resultado, Tiempo hasta el resultado, Esfuerzo/Sacrificio y la Solución en sí.
        Destruye su oferta, encuentra dónde están fallando y dime cómo podemos superarlos con una Oferta Grand Slam.
        Responde en ${language === 'es' ? 'Español' : 'Inglés'}. 
        Formato: Markdown con tablas comparativas.`,
        config: { systemInstruction: "Eres Alex Hormozi analizando a la competencia con el objetivo de destruirlos estratégicamente.", temperature: 0.7 },
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setCompetitorResult(fullText);
      }
      logUsage("Análisis de Competencia");
    } catch (e) {
      setCompetitorResult("Error analizando la competencia.");
    } finally {
      setIsAnalyzingComp(false);
    }
  };

  const generateSalesScript = async () => {
    const selectedOffer = history.find(o => o.id === selectedOfferId);
    if (!selectedOffer && !input.trim()) return;
    
    setIsGeneratingScript(true);
    setScriptResult('');

    const contextOffer = selectedOffer ? selectedOffer.text : result?.text || input;

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: `GENERA UN GUION DE VENTAS TIPO: ${scriptType.toUpperCase()}.
        CONTEXTO DE LA OFERTA: ${contextOffer}.
        OBJECIONES A DESTRUIR: ${scriptObjections || 'Ninguna especificada'}.
        MARCO DE TRABAJO: Usa el sistema C-L-O-S-E-R de Hormozi si es una llamada, o persuasión directa basada en valor si es VSL/Email.
        REGLA: El guion debe sonar natural pero autoritario. Usa ganchos emocionales fuertes.
        Responde en ${language === 'es' ? 'Español' : 'Inglés'}.`,
        config: { systemInstruction: "Eres el mejor cerrador de ventas del mundo, entrenado por Alex Hormozi. Escribes guiones que convierten el interés en dinero de inmediato.", temperature: 0.8 },
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setScriptResult(fullText);
      }
      logUsage(`Generación Script: ${scriptType}`);
    } catch (e) {
      setScriptResult("Error generando el guion.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const generateOffer = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult({ text: '', isStreaming: true });

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      let finalSystemInstruction = getSystemInstruction(language);
      finalSystemInstruction += `\n[KNOWLEDGE_NUCLEUS]:\n${permanentBrain}\n`;
      
      knowledgeBase.forEach(item => {
        if (!item.isLearned) {
           finalSystemInstruction += `- [Knowledge base snippet: ${item.name}]: ${item.content}\n`;
        }
      });

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: `TYPE: ${offerType}. USER INPUT: ${input}. GOLDEN RULE: Generate a spectacular offer with at least 7 points. Be exhaustive. Respond in ${language === 'es' ? 'Spanish' : 'English'}.`,
        config: { systemInstruction: finalSystemInstruction, temperature: 0.9 },
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setResult(prev => ({ text: fullText, isStreaming: true }));
      }

      const finalResult = { text: fullText, isStreaming: false, input, offerType, timestamp: Date.now() };
      setResult(finalResult);
      
      // Guardar Oferta en Supabase
      const { data: newOfferData } = await supabase.from('ofertas').insert({
        input: input,
        texto: fullText,
        tipo_oferta: offerType,
        usuario_email: isAdmin ? OWNER_EMAIL : (signupForm.email || null),
        timestamp: new Date().toISOString()
      }).select().single();

      if (newOfferData) {
        const mappedOffer: SavedOffer = { 
          id: newOfferData.id.toString(), 
          input, 
          text: fullText, 
          offerType, 
          timestamp: Date.now() 
        };
        setHistory(prev => [mappedOffer, ...prev]);
        setGlobalLibrary(prev => [mappedOffer, ...prev]);
      }

      // Actualizar Trial
      if (!isAdmin) {
        const nextTrial = trialCount + 1;
        setTrialCount(nextTrial);
        await supabase.from('configuracion').upsert({ clave: `trial_${sessionId}`, valor: nextTrial.toString() });
      }

      logUsage("Generación Oferta Grand Slam", signupForm.email);

    } catch (e) {
      setResult({ text: language === 'es' ? "## Error en la Matrix de Alex." : "## Error in Alex's Matrix.", isStreaming: false });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = (type: KnowledgeItem['type']) => {
    setIsUploading(type);
    if (fileInputRef.current) {
      if (type === 'pdf') fileInputRef.current.accept = ".pdf";
      else if (type === 'book') fileInputRef.current.accept = ".epub,.pdf,.txt,.md";
      else if (type === 'video') fileInputRef.current.accept = "video/*";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isUploading) {
      const fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB";
      let content = `File data for ${file.name}. `;
      if (file.type === "text/plain" || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        content += text.substring(0, 2000);
      } else {
        content += `This file contains ${isUploading} strategies to be applied for ROI maximization.`;
      }

      const newItem: KnowledgeItem = {
        id: Math.random().toString(36).substring(7),
        type: isUploading,
        name: file.name,
        content: content,
        timestamp: Date.now(),
        size: fileSize,
        isLearned: false
      };
      
      const updated = [newItem, ...knowledgeBase];
      setKnowledgeBase(updated);
      await supabase.from('configuracion').upsert({ clave: 'knowledge_base', valor: JSON.stringify(updated) });
      setIsUploading(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const digestKnowledge = async (id: string) => {
    setLearningId(id);
    setTimeout(async () => {
      const item = knowledgeBase.find(k => k.id === id);
      if (item) {
        const newBrain = permanentBrain + `\n--- LEARNED STRATEGY FROM ${item.name} ---\n${item.content}\n`;
        setPermanentBrain(newBrain);
        await supabase.from('configuracion').upsert({ clave: 'permanent_brain', valor: newBrain });

        const updated = knowledgeBase.map(k => k.id === id ? { ...k, isLearned: true } : k);
        setKnowledgeBase(updated);
        await supabase.from('configuracion').upsert({ clave: 'knowledge_base', valor: JSON.stringify(updated) });
      }
      setLearningId(null);
    }, 2000);
  };

  const deleteOffer = async (id: string) => {
    try {
      await supabase.from('ofertas').delete().eq('id', parseInt(id));
      setHistory(prev => prev.filter(o => o.id !== id));
      setGlobalLibrary(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Error eliminando oferta:", err);
    }
  };

  const duplicateOffer = (originalInput: string) => {
    setInput(originalInput);
    window.scrollTo({ top: 400, behavior: 'smooth' });
    setShowUserDashboard(false);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "alexia_offers.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setExportMenuOpen(false);
  };

  const exportTXT = () => {
    const textContent = history.map(o => `--- ${new Date(o.timestamp).toLocaleString()} ---\nINPUT: ${o.input}\nTYPE: ${o.offerType}\n\nOFFER:\n${o.text}\n\n====================\n\n`).join('\n');
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "alexia_offers.txt");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setExportMenuOpen(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const brandColor = [255, 92, 0]; // #FF5C00
    let yPos = 20;

    history.forEach((offer, index) => {
      if (index > 0) {
        doc.addPage();
        yPos = 20;
      }

      // Premium Header
      doc.setFillColor(15, 15, 15);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Bolt Icon
      doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.triangle(15, 10, 25, 10, 20, 25, 'F');
      doc.triangle(25, 15, 15, 15, 20, 5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("ALEXIA", 32, 22);
      doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.setFontSize(10);
      doc.text("OFERTA ESTRATÉGICA // REPORTE DE VALOR", 32, 30);
      
      yPos = 55;

      // Meta Row
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPos, 180, 10, 'F');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`${new Date(offer.timestamp).toLocaleString().toUpperCase()}  |  ID: ${offer.id.toUpperCase()}  |  MODO: ${offer.offerType.toUpperCase()}`, 105, yPos + 6.5, { align: 'center' });
      
      yPos += 20;

      // Input Context Section
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(12);
      doc.text(language === 'es' ? "RESUMEN DEL MERCADO:" : "MARKET SUMMARY:", 15, yPos);
      yPos += 7;
      
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const splitInput = doc.splitTextToSize(`"${offer.input}"`, 175);
      doc.text(splitInput, 18, yPos);
      yPos += (splitInput.length * 5) + 15;

      // Divider Line
      doc.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.setLineWidth(0.5);
      doc.line(15, yPos - 5, 40, yPos - 5);

      // Offer Content Section
      doc.setTextColor(15, 15, 15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(language === 'es' ? "ESTRATEGIA GRAND SLAM" : "GRAND SLAM STRATEGY", 15, yPos);
      yPos += 12;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(40, 40, 40);

      const cleanText = offer.text
        .replace(/##\s+/g, '--- ')
        .replace(/#+\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '•');
        
      const splitText = doc.splitTextToSize(cleanText, 175);
      
      splitText.forEach((line: string) => {
        if (yPos > 265) {
          doc.addPage();
          doc.setFillColor(15, 15, 15);
          doc.rect(0, 0, 210, 15, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.text("ALEXIA STRATEGY CONTINUED", 105, 10, { align: 'center' });
          yPos = 30;
          doc.setFontSize(10.5);
          doc.setTextColor(40, 40, 40);
        }
        
        if (line.startsWith('---')) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
          doc.text(line.replace('--- ', '').toUpperCase(), 15, yPos);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(40, 40, 40);
        } else {
          doc.text(line, 15, yPos);
        }
        yPos += 6.5;
      });

      // Professional Footer
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 282, 210, 15, 'F');
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(7);
      doc.text(language === 'es' ? "ESTE DOCUMENTO CONTIENE ESTRATEGIAS DE NEGOCIO PROPIETARIAS BASADAS EN EL MARCO DE $100M OFFERS." : "THIS DOCUMENT CONTAINS PROPRIETARY BUSINESS STRATEGIES BASED ON THE $100M OFFERS FRAMEWORK.", 105, 291, { align: 'center' });
    });

    doc.save(`ALEXIA_STRATEGY_REPORT_${new Date().getTime()}.pdf`);
    setExportMenuOpen(false);
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLocked = !isAdmin && userPlan === 'free' && trialCount >= STARTER_LIMIT; 
  const isScaleMaster = isAdmin || userPlan === 'scale-master' || userPlan === 'agency';
  const currentLimit = userPlan === 'starter' ? STARTER_LIMIT * 5 : STARTER_LIMIT;

  const CompetitorContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
        <textarea 
            className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-6 text-sm font-bold placeholder:text-gray-700 min-h-[300px] outline-none focus:border-[#FF5C00]/50 transition-all"
            placeholder={t('compPlaceholder')}
            value={competitorInput}
            onChange={(e) => setCompetitorInput(e.target.value)}
        />
        <button 
            onClick={analyzeCompetitor}
            disabled={isAnalyzingComp || !competitorInput.trim()}
            className="w-full py-5 bg-[#FF5C00] hover:bg-[#E04F00] disabled:bg-white/5 text-white font-black uppercase italic tracking-tighter rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group"
        >
            {isAnalyzingComp ? <Loader2 className="animate-spin w-6 h-6" /> : <Skull className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
            {isAnalyzingComp ? t('generatingBtn') : t('compBtn')}
        </button>
        </div>

        <div className="bg-black/20 border-2 border-white/5 rounded-3xl p-8 overflow-y-auto max-h-[500px] relative">
        {!competitorResult && !isAnalyzingComp ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-20">
            <Target className="w-16 h-16 mb-4" />
            <p className="font-black uppercase italic text-sm tracking-widest">Esperando objetivo para análisis estratégico...</p>
            </div>
        ) : (
            <div className="prose prose-invert max-w-none">
            <h4 className="text-[#FF5C00] font-black uppercase italic text-xl mb-6">{t('compResultTitle')}</h4>
            <ReactMarkdown components={{
                table: ({...props}) => <div className="overflow-x-auto my-6"><table className="w-full border-collapse border border-white/10" {...props} /></div>,
                th: ({...props}) => <th className="bg-[#FF5C00]/10 text-[#FF5C00] border border-white/10 p-4 text-left text-[10px] font-black uppercase" {...props} />,
                td: ({...props}) => <td className="border border-white/10 p-4 text-xs font-bold" {...props} />,
            }}>
                {competitorResult}
            </ReactMarkdown>
            </div>
        )}
        </div>
    </div>
  );

  const ScriptsContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">1. Seleccionar Oferta</label>
            <select 
            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 text-xs font-bold uppercase outline-none focus:border-[#FF5C00]/50"
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
            >
            <option value="">-- ÚLTIMA GENERADA --</option>
            {history.map(o => (
                <option key={o.id} value={o.id}>{o.input.substring(0, 30)}...</option>
            ))}
            </select>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">2. Formato del Arma</label>
            <div className="grid grid-cols-2 gap-2">
            {(['closer', 'vsl', 'dm', 'email'] as ScriptType[]).map(type => (
                <button 
                key={type}
                onClick={() => setScriptType(type)}
                className={`p-4 rounded-xl border-2 text-[10px] font-black uppercase italic flex items-center justify-center gap-2 transition-all ${scriptType === type ? 'bg-[#FF5C00] border-[#FF5C00] text-white shadow-lg' : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'}`}
                >
                {type === 'vsl' ? <Video className="w-4 h-4" /> : type === 'closer' ? <Mic className="w-4 h-4" /> : type === 'dm' ? <Send className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {t(`scriptType${type.toUpperCase()}` as any)}
                </button>
            ))}
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic flex items-center gap-2">
            <ShieldQuestion className="w-3 h-3 text-[#FF5C00]" /> {t('scriptObjections')}
            </label>
            <textarea 
            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-5 text-xs font-bold min-h-[120px] outline-none focus:border-[#FF5C00]/50"
            placeholder="Ej: Es muy caro, No tengo tiempo, Tengo que consultarlo..."
            value={scriptObjections}
            onChange={(e) => setScriptObjections(e.target.value)}
            />
        </div>

        <button 
            onClick={generateSalesScript}
            disabled={isGeneratingScript}
            className="w-full py-5 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group hover:bg-[#FF5C00] hover:text-white"
        >
            {isGeneratingScript ? <Loader2 className="animate-spin w-6 h-6" /> : <Flame className="w-6 h-6 group-hover:animate-bounce" />}
            {isGeneratingScript ? t('generatingBtn') : t('scriptBtn')}
        </button>
        </div>

        <div className="lg:col-span-2 bg-black/40 border-2 border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col min-h-[500px]">
        {!scriptResult && !isGeneratingScript ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10">
            <MessageSquareText className="w-24 h-24 mb-4" />
            <p className="font-black uppercase italic text-xl">LISTO PARA REDACTAR PERSUASIÓN</p>
            </div>
        ) : (
            <>
            <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black text-[#FF5C00] uppercase tracking-widest bg-[#FF5C00]/10 px-4 py-1 rounded-full">SCRIPT ACTIVO // {scriptType.toUpperCase()}</span>
                <button 
                onClick={() => {
                    navigator.clipboard.writeText(scriptResult);
                }}
                className="text-gray-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase transition-all"
                >
                <Copy className="w-4 h-4" /> {t('scriptCopy')}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar script-content">
                <div className="prose prose-invert max-w-none">
                <ReactMarkdown components={{
                    p: ({...props}) => <p className="mb-6 leading-relaxed text-lg font-medium text-gray-300" {...props} />,
                    strong: ({...props}) => <strong className="text-[#FF5C00] font-black uppercase italic" {...props} />,
                    h1: ({...props}) => <h1 className="text-3xl font-black uppercase italic border-b-2 border-[#FF5C00] pb-2 mb-8" {...props} />,
                }}>
                    {scriptResult}
                </ReactMarkdown>
                </div>
            </div>
            </>
        )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 font-sans selection:bg-[#FF5C00]">
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            onClick={handleLogoClick}
            className={`flex items-center gap-2 font-black italic text-xl cursor-pointer select-none transition-all ${isAdmin ? 'drop-shadow-[0_0_8px_rgba(255,92,0,0.8)] scale-110' : 'hover:scale-105 active:scale-95'}`}
          >
            <Zap className={`w-6 h-6 transition-colors ${isAdmin ? 'text-[#FF5C00]' : 'text-white'}`} fill={isAdmin ? "#FF5C00" : "none"} />
            ALEX<span className="text-[#FF5C00]">IA</span>
            {isAdmin && <span className="text-[10px] bg-[#FF5C00] text-black px-1.5 rounded-sm ml-2 not-italic">ADMIN</span>}
            {userPlan !== 'free' && !isAdmin && <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded-sm ml-2 not-italic uppercase tracking-widest">{userPlan}</span>}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black"
            >
              <Languages className="w-4 h-4 text-[#FF5C00]" />
              {t('langName')}
            </button>

            {!isAdmin && userPlan === 'free' && (
              <button 
                onClick={() => setShowLogin(true)}
                className="text-xs font-black uppercase flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <LogIn className="w-4 h-4 text-[#FF5C00]" />
                {t('loginBtn')}
              </button>
            )}

            {(userPlan !== 'free' || isAdmin || history.length > 0) && (
              <button 
                onClick={() => setShowUserDashboard(true)}
                className="text-xs font-black uppercase flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF5C00]/20 bg-[#FF5C00]/5 text-[#FF5C00] hover:bg-[#FF5C00]/10 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('navPanel')}
              </button>
            )}

            <button 
              onClick={() => setShowPremiumHub(true)}
              className={`text-xs font-black uppercase flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${isScaleMaster ? 'bg-[#FF5C00]/10 border-[#FF5C00]/40 text-[#FF5C00] hover:bg-[#FF5C00]/20' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
            >
              <Crown className="w-4 h-4" /> {t('navPremium')}
            </button>

            {isAdmin && (
              <button 
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="text-[#FF5C00] font-black text-xs uppercase flex items-center gap-2 bg-[#FF5C00]/10 px-4 py-2 rounded-full border border-[#FF5C00]/20 hover:bg-[#FF5C00]/20 transition-all"
              >
                <Database className="w-4 h-4" /> {t('navAdmin')}
              </button>
            )}
            
            {(userPlan !== 'free' || isAdmin) ? (
              <button 
                onClick={logoutAdmin}
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-red-500/20"
              >
                {language === 'es' ? 'Salir' : 'Logout'}
              </button>
            ) : (
              <button onClick={scrollToPricing} className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-white/10">
                {t('viewPlans')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ADMIN DASHBOARD MODAL */}
      {isAdmin && adminMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl p-6 overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
          <div className="max-w-6xl mx-auto pb-20 pt-10">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-8 gap-6">
              <div>
                <h2 className="text-4xl font-black italic uppercase flex items-center gap-4">
                  <ShieldAlert className="w-10 h-10 text-[#FF5C00]" />
                  Panel Maestro
                </h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  <button onClick={() => setAdminTab('leads')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'leads' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-gray-500'}`}>Usuarios Registrados</button>
                  <button onClick={() => setAdminTab('library')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'library' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-gray-500'}`}>Biblioteca Global</button>
                  <button onClick={() => setAdminTab('brain')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'brain' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-gray-500'}`}>Cerebro Estratégico (PDF)</button>
                  <button onClick={() => setAdminTab('competitor')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'competitor' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-gray-500'}`}>Analizador</button>
                  <button onClick={() => setAdminTab('scripts')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${adminTab === 'scripts' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-gray-500'}`}>Guiones</button>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setAdminMenuOpen(false)} className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><X className="w-6 h-6" /></button>
              </div>
            </div>

            {adminTab === 'brain' && (
              <div className="animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  <div className="bg-[#111] p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-[#FF5C00]/20 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><Cpu className="w-20 h-20 text-[#FF5C00]" /></div>
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Estado Neuronal</h4>
                    <div className="flex items-center gap-2 text-green-500 font-black text-xl mb-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> ACTIVO</div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase italic">Gemini 3 Pro Engine</p>
                  </div>
                  <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Carga de Memoria</h4>
                    <p className="text-3xl font-black">{Math.round(permanentBrain.length / 4)}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 italic tracking-widest">Tokens del Núcleo</p>
                  </div>
                  <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Docs Pendientes</h4>
                    <p className="text-3xl font-black">{knowledgeBase.filter(k => !k.isLearned).length}</p>
                  </div>
                </div>

                <div className="bg-[#141414] border-2 border-white/5 rounded-[3rem] p-8 md:p-12 mb-20 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div>
                      <h3 className="text-3xl font-black uppercase italic flex items-center gap-3"><Database className="w-8 h-8 text-[#FF5C00]" /> Cerebro de AlexIA</h3>
                      <p className="text-gray-500 text-sm font-bold uppercase mt-1 italic">Sube archivos para nutrir la inteligencia del sistema</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => triggerFileUpload('pdf')} className="bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl text-[10px] font-black uppercase border border-white/5 flex items-center gap-2"><FileUp className="w-4 h-4 text-[#FF5C00]" /> + SUBIR PDF</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {knowledgeBase.length === 0 ? (
                      <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-black/20"><p className="text-gray-600 font-bold uppercase tracking-widest italic">Cerebro vacío. Sube información estratégica para empezar.</p></div>
                    ) : (
                      knowledgeBase.map(item => (
                        <div key={item.id} className={`bg-black/40 border ${item.isLearned ? 'border-green-500/30' : 'border-white/5'} p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center group gap-6 relative overflow-hidden`}>
                          {learningId === item.id && (
                            <div className="absolute inset-0 bg-[#FF5C00]/20 backdrop-blur-md flex items-center justify-center z-10 animate-pulse">
                              <Brain className="w-10 h-10 text-white animate-bounce" />
                            </div>
                          )}
                          <div className="flex items-center gap-6 flex-1">
                            <div className={`p-5 rounded-2xl ${item.isLearned ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'}`}>
                              {item.type === 'pdf' ? <FileText className="w-8 h-8" /> : item.type === 'book' ? <BookOpen className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h5 className="font-black uppercase text-xl italic">{item.name}</h5>
                                {item.isLearned && <span className="bg-green-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic tracking-tighter">INTEGRADO EN EL NÚCLEO</span>}
                              </div>
                              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>{item.size}</span><div className="w-1 h-1 bg-gray-800 rounded-full" /><span>{item.type}</span><div className="w-1 h-1 bg-gray-800 rounded-full" /><span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          {!item.isLearned ? (
                            <button onClick={() => digestKnowledge(item.id)} className="bg-[#FF5C00] text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] shadow-lg hover:scale-105 transition-all flex items-center gap-2"><Sparkles className="w-4 h-4" /> NUTRIR INTELIGENCIA</button>
                          ) : (
                            <button onClick={() => {
                              const updated = knowledgeBase.filter(k => k.id !== item.id);
                              setKnowledgeBase(updated);
                              supabase.from('configuracion').upsert({ clave: 'knowledge_base', valor: JSON.stringify(updated) });
                            }} className="bg-white/5 text-gray-500 px-6 py-3 rounded-xl font-black uppercase text-[10px] border border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'competitor' && <div className="animate-in slide-in-from-right-4 duration-500"><CompetitorContent /></div>}
            {adminTab === 'scripts' && <div className="animate-in slide-in-from-right-4 duration-500"><ScriptsContent /></div>}

            {adminTab === 'library' && (
              <div className="bg-[#141414] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl animate-in fade-in duration-500">
                 <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <h3 className="text-2xl font-black uppercase italic flex items-center gap-3">
                      <Library className="w-6 h-6 text-[#FF5C00]" /> Biblioteca Global de Ofertas
                    </h3>
                    <input 
                      type="text" placeholder="Buscar preguntas de usuarios..."
                      className="w-full md:w-96 bg-black/40 border-2 border-white/5 rounded-2xl py-4 px-6 text-sm font-bold uppercase outline-none focus:border-[#FF5C00]/50 transition-all"
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    {globalLibrary.length === 0 ? (
                       <div className="text-center py-20 text-gray-500 font-black uppercase italic">No hay historial global registrado.</div>
                    ) : (
                      globalLibrary.filter(o => o.input.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                        <div key={item.id} className="bg-black/30 border border-white/5 rounded-2xl p-6 hover:border-[#FF5C00]/40 transition-all">
                           <div className="flex justify-between gap-4">
                              <div>
                                 <span className="text-[10px] text-[#FF5C00] font-black uppercase">{new Date(item.timestamp).toLocaleString()}</span>
                                 <p className="font-black italic uppercase text-lg mt-1">Pregunta: "{item.input}"</p>
                              </div>
                              <button onClick={() => setExpandedOfferId(expandedOfferId === item.id ? null : item.id)} className="text-xs font-black uppercase text-gray-500 hover:text-white px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                {expandedOfferId === item.id ? "Ocultar Respuesta" : "Ver Respuesta IA"}
                              </button>
                           </div>
                           {expandedOfferId === item.id && <div className="mt-4 pt-4 border-t border-white/10 text-sm opacity-80 prose prose-invert max-w-none"><ReactMarkdown>{item.text}</ReactMarkdown></div>}
                        </div>
                      ))
                    )}
                  </div>
              </div>
            )}

            {adminTab === 'leads' && (
              <div className="bg-[#141414] border-2 border-white/5 rounded-[3rem] p-10 shadow-2xl animate-in fade-in duration-500">
                 <h3 className="text-2xl font-black uppercase italic flex items-center gap-3 mb-10">
                    <UserCheck className="w-6 h-6 text-[#FF5C00]" /> Usuarios Registrados (Leads)
                 </h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-white/10">
                             <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-500">Nombre</th>
                             <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-500">Email</th>
                             <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-500">Teléfono</th>
                             <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-500">Plan</th>
                             <th className="py-4 px-2 text-[10px] font-black uppercase text-gray-500">Fecha</th>
                          </tr>
                       </thead>
                       <tbody>
                          {leads.length === 0 ? (
                             <tr><td colSpan={5} className="py-20 text-center text-gray-500 font-black uppercase italic">No hay usuarios registrados todavía.</td></tr>
                          ) : (
                            leads.map(lead => (
                              <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                 <td className="py-4 px-2 font-black text-sm uppercase italic">{lead.name}</td>
                                 <td className="py-4 px-2 text-xs text-gray-400">{lead.email}</td>
                                 <td className="py-4 px-2 text-xs text-gray-400">{lead.phone}</td>
                                 <td className="py-4 px-2"><span className="text-[9px] font-black bg-[#FF5C00]/10 text-[#FF5C00] px-2 py-1 rounded-full border border-[#FF5C00]/20">{lead.plan}</span></td>
                                 <td className="py-4 px-2 text-[10px] text-gray-500">{new Date(lead.timestamp).toLocaleDateString()}</td>
                              </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USER PERSONALIZED PANEL MODAL */}
      {showUserDashboard && (
        <div className="fixed inset-0 z-[65] bg-black/95 backdrop-blur-3xl p-6 overflow-y-auto animate-in slide-in-from-right-10 duration-500">
          <div className="max-w-6xl mx-auto pb-20 pt-10">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-white/10 pb-10 gap-8">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-[#FF5C00] rounded-3xl shadow-[0_0_30px_rgba(255,92,0,0.3)]">
                  <LayoutDashboard className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
                    {t('panelTitle')}
                  </h2>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2 italic">{t('panelSub')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">PLAN ACTUAL</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black uppercase text-sm tracking-tighter italic">{userPlan}</span>
                    <Star className="w-3 h-3 text-[#FF5C00] fill-[#FF5C00]" />
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">OFERTAS GENERADAS</span>
                  <span className="text-white font-black text-sm italic tracking-tighter">{history.length}</span>
                </div>
                <button onClick={() => setShowUserDashboard(false)} className="bg-white/10 p-5 rounded-2xl hover:bg-white/20 transition-all border border-white/5 shadow-xl">
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
                  <h4 className="text-xs font-black text-[#FF5C00] uppercase tracking-widest italic border-b border-white/5 pb-4">Herramientas</h4>
                  
                  <div className="space-y-3">
                    <button onClick={exportJSON} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] transition-all group">
                      <div className="flex items-center gap-3">
                        <FileJson className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                        <span className="text-[10px] font-black uppercase">{t('exportJson')}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </button>
                    <button onClick={exportTXT} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] transition-all group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                        <span className="text-[10px] font-black uppercase">{t('exportTxt')}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </button>
                    <button onClick={exportPDF} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] transition-all group">
                      <div className="flex items-center gap-3">
                        <FileDown className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                        <span className="text-[10px] font-black uppercase">{t('exportPdf')}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase italic flex items-center gap-3">
                    <History className="w-6 h-6 text-[#FF5C00]" /> 
                    {t('historyTitle')}
                  </h3>
                  <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <span className="text-[10px] font-black uppercase text-gray-500">{history.length} ITEMS TOTALES</span>
                  </div>
                </div>

                {history.length === 0 ? (
                  <div className="bg-black/20 border-2 border-dashed border-white/5 rounded-[3rem] p-24 text-center">
                    <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500 font-bold max-w-sm mx-auto text-lg italic leading-relaxed uppercase tracking-tighter">
                      {t('historyEmpty')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {history.map((item) => {
                      const titleMatch = item.text.match(/##\s*(.*)/) || item.text.match(/#\s*(.*)/);
                      const title = titleMatch ? titleMatch[1].replace(/\*/g, '').trim() : "Oferta Grand Slam";
                      const isExpanded = expandedOfferId === item.id;
                      const dateStr = new Date(item.timestamp).toLocaleString(language === 'es' ? 'es-ES' : 'en-US', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      });

                      return (
                        <div key={item.id} className="group bg-black/40 border border-white/5 hover:border-[#FF5C00]/40 rounded-[2.5rem] p-8 md:p-10 transition-all shadow-2xl relative overflow-hidden">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-4 mb-4">
                                <span className="text-[10px] font-black text-[#FF5C00] uppercase tracking-[0.2em] bg-[#FF5C00]/10 px-3 py-1 rounded-full">{dateStr}</span>
                                <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-black uppercase text-gray-400 border border-white/5 italic">{item.offerType}</span>
                              </div>
                              <h4 className="text-3xl font-black uppercase italic text-white group-hover:text-[#FF5C00] transition-colors mb-4 truncate">{title}</h4>
                              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                <p className="text-gray-400 text-xs font-bold italic leading-relaxed line-clamp-2">
                                  "{item.input}"
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0 flex-wrap md:flex-nowrap">
                              <button 
                                onClick={() => setExpandedOfferId(isExpanded ? null : item.id)} 
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${isExpanded ? 'bg-[#FF5C00] text-white border-[#FF5C00] shadow-[0_0_20px_rgba(255,92,0,0.3)]' : 'bg-white/5 text-white border-white/5 hover:bg-white/10'}`}
                              >
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                {isExpanded ? t('close') : t('viewFull')}
                              </button>
                              <button onClick={() => duplicateOffer(item.input)} className="p-5 bg-white/5 hover:bg-[#FF5C00]/20 hover:text-[#FF5C00] text-white rounded-2xl transition-all border border-white/5 group/btn">
                                <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform" />
                              </button>
                              <button onClick={() => deleteOffer(item.id)} className="p-5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-2xl transition-all border border-white/5">
                                <Trash2 className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="mt-10 pt-10 border-t border-white/10 animate-in slide-in-from-top-4 duration-500 prose prose-invert max-w-none">
                              <ReactMarkdown components={{
                                h2: ({...props}) => <h2 className="text-[#FF5C00] text-3xl font-black uppercase italic mb-8" {...props} />,
                                li: ({...props}) => <li className="bg-white/5 border-l-4 border-[#FF5C00] p-6 rounded-r-2xl mb-4 text-lg" {...props} />,
                              }}>
                                {item.text}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PREMIUM HUB MODAL (FOR SCALE MASTER) */}
      {showPremiumHub && (
          <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-3xl p-6 overflow-y-auto animate-in slide-in-from-top-10 duration-500">
              <div className="max-w-6xl mx-auto pb-20 pt-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-8 gap-6">
                      <div>
                        <h2 className="text-4xl font-black italic uppercase flex items-center gap-4 text-white">
                          <Crown className="w-10 h-10 text-[#FF5C00]" />
                          {t('premiumHubTitle')}
                        </h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2 italic">{t('premiumHubSub')}</p>
                      </div>
                      <button onClick={() => setShowPremiumHub(false)} className="bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><X className="w-6 h-6" /></button>
                  </div>

                  {!isScaleMaster ? (
                    <div className="bg-[#111] border-2 border-white/5 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center animate-in zoom-in duration-500">
                        <Lock className="w-20 h-20 text-[#FF5C00] mb-8" />
                        <h3 className="text-4xl font-black uppercase italic mb-4">{t('premiumLocked')}</h3>
                        <p className="text-gray-400 max-w-md mx-auto font-bold uppercase text-xs tracking-widest leading-loose mb-10">Las herramientas de espionaje comercial y persuasión avanzada están bloqueadas para usuarios gratuitos. Escala tu plan para dominar el mercado.</p>
                        <button onClick={() => { setShowPremiumHub(false); scrollToPricing(); }} className="bg-[#FF5C00] text-white px-12 py-6 rounded-2xl font-black uppercase text-xl shadow-2xl hover:scale-105 transition-all">DESBLOQUEAR AHORA</button>
                    </div>
                  ) : (
                    <div className="space-y-12">
                         <div className="flex gap-4">
                            <button onClick={() => setPremiumTab('competitor')} className={`px-10 py-4 rounded-2xl text-xs font-black uppercase italic tracking-widest transition-all ${premiumTab === 'competitor' ? 'bg-[#FF5C00] text-white shadow-xl scale-105' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                                <Sword className="w-4 h-4 inline mr-2" /> Analizador de Competencia
                            </button>
                            <button onClick={() => setPremiumTab('scripts')} className={`px-10 py-4 rounded-2xl text-xs font-black uppercase italic tracking-widest transition-all ${premiumTab === 'scripts' ? 'bg-[#FF5C00] text-white shadow-xl scale-105' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                                <MessageSquareText className="w-4 h-4 inline mr-2" /> Generador de Guiones
                            </button>
                         </div>
                         
                         <div className="animate-in fade-in duration-500">
                            {premiumTab === 'competitor' ? <CompetitorContent /> : <ScriptsContent />}
                         </div>
                    </div>
                  )}
              </div>
          </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#141414] border-2 border-[#FF5C00]/30 w-full max-w-md rounded-[2.5rem] p-10 relative shadow-[0_0_50px_rgba(255,92,0,0.25)]">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <div className="text-center mb-8">
              <KeyRound className="w-12 h-12 text-[#FF5C00] mx-auto mb-4" />
              <h3 className="text-3xl font-black uppercase italic">{t('loginBtn')}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 italic">Acceso Administrador</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="email" placeholder="EMAIL DE ADMINISTRADOR"
                className={`w-full bg-black/60 border-2 rounded-2xl p-4 text-center text-sm font-bold outline-none border-white/5 focus:border-[#FF5C00]`}
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input 
                autoFocus type="password" placeholder="CONTRASEÑA MAESTRA"
                className={`w-full bg-black/60 border-2 rounded-2xl p-5 text-center text-xl font-black tracking-[0.3em] outline-none ${loginError ? 'border-red-500 animate-shake' : 'border-white/5 focus:border-[#FF5C00]'}`}
                value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
              />
              <button type="submit" className="w-full bg-[#FF5C00] text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:scale-[1.02] transition-all">ACCEDER AL PANEL</button>
            </form>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[#141414] border-2 border-[#FF5C00]/30 w-full max-lg rounded-[3rem] p-10 md:p-14 relative shadow-[0_0_60px_rgba(255,92,0,0.25)]">
            <button onClick={() => setShowSignup(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X className="w-8 h-8" /></button>
            {!signupSuccess ? (
              <>
                <div className="text-center mb-10">
                  <div className="bg-[#FF5C00] w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3"><UserPlus className="w-8 h-8 text-white" /></div>
                  <h3 className="text-4xl font-black uppercase italic">{language === 'es' ? 'Únete a la Elite' : 'Join the Elite'}</h3>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2 italic">{language === 'es' ? `Desbloquea el plan ${showSignup}` : `Unlock ${showSignup} plan`}</p>
                </div>
                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <input required type="text" placeholder={t('formName')} className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 px-6 text-sm font-bold uppercase outline-none focus:border-[#FF5C00] transition-all" value={signupForm.name} onChange={(e) => setSignupForm({...signupForm, name: e.target.value})} />
                    <input required type="email" placeholder={t('formEmail')} className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 px-6 text-sm font-bold uppercase outline-none focus:border-[#FF5C00] transition-all" value={signupForm.email} onChange={(e) => setSignupForm({...signupForm, email: e.target.value})} />
                    <input required type="tel" placeholder={t('formPhone')} className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 px-6 text-sm font-bold uppercase outline-none focus:border-[#FF5C00] transition-all" value={signupForm.phone} onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full bg-[#FF5C00] text-white py-6 rounded-2xl font-black uppercase shadow-2xl hover:scale-[1.02] transition-all text-xl">{t('unlockNow')}</button>
                </form>
              </>
            ) : (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]"><Check className="w-12 h-12 text-white" /></div>
                <h3 className="text-4xl font-black uppercase italic">{t('successMsg')}</h3>
                <p className="text-gray-400 font-bold uppercase mt-4 text-sm leading-relaxed max-w-sm mx-auto">{t('successSub')}</p>
                <button onClick={() => { setShowSignup(null); setSignupSuccess(false); setSignupForm({ name: '', email: '', phone: '' }); }} className="mt-10 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-black uppercase text-xs transition-all border border-white/5">
                  ENTENDIDO, VOLVER AL GENERADOR
                </button>
              </div>
            )}
           </div>
        </div>
      )}

      <main className="pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-24">
          <Badge>{t('badge')}</Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8" dangerouslySetInnerHTML={{ __html: t('heroTitle') }} />
          <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: t('heroSub') }} />
          
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all text-xs font-black uppercase tracking-widest">
            <div className="flex items-center gap-2"><Users className="w-5 h-5"/> {language === 'es' ? '+5.000 Usuarios' : '+5,000 Users'}</div>
            <div className="flex items-center gap-2"><Trophy className="w-5 h-5"/> {language === 'es' ? 'Marco de $100M' : '$100M Framework'}</div>
            <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500"/> {language === 'es' ? '4.9/5 Calificación' : '4.9/5 Rating'}</div>
          </div>
        </section>

        {/* INTERACTIVE DEMO */}
        <section className="max-w-4xl mx-auto px-6 mb-40">
          <div className="bg-[#141414] border-2 border-[#FF5C00]/30 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(255,92,0,0.1)] relative overflow-hidden">
            <div className="absolute -top-6 left-12 bg-[#FF5C00] text-black font-black uppercase px-6 py-2 rounded-xl text-[10px] italic shadow-xl z-20">
              {isAdmin ? "ADMIN MASTER ACCESS" : `${t('credits')}: ${Math.max(0, currentLimit - trialCount)} / ${currentLimit}`}
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3">
                {['high-ticket', 'low-ticket', 'ecommerce', 'physical', 'services'].map((cat) => (
                  <button 
                    key={cat} onClick={() => !isLocked && setOfferType(cat as any)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${offerType === cat ? 'bg-[#FF5C00] border-[#FF5C00] text-white shadow-lg' : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {cat.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  className="w-full bg-black/60 border-2 border-white/5 rounded-3xl p-8 text-xl font-bold placeholder:text-gray-800 transition-all focus:border-[#FF5C00]/50 min-h-[180px] outline-none"
                  placeholder={t('placeholder')}
                  value={input} onChange={(e) => !isLocked && setInput(e.target.value)}
                />
                
                {isLocked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 z-10">
                    <Lock className="w-10 h-10 text-[#FF5C00] mb-6" />
                    <h4 className="text-3xl font-black uppercase italic mb-2">{t('lockedTitle')}</h4>
                    <p className="text-gray-300 font-bold uppercase text-xs tracking-widest italic max-w-xs">{t('lockedSub')}</p>
                    <button onClick={scrollToPricing} className="mt-8 bg-[#FF5C00] text-white px-10 py-5 rounded-2xl font-black uppercase text-xl shadow-2xl hover:scale-[1.02] transition-all">
                      {t('unlockNow')}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={isLocked ? scrollToPricing : generateOffer}
                disabled={loading || (!input.trim() && !isLocked)}
                className={`w-full relative overflow-hidden font-black py-8 rounded-3xl uppercase tracking-tighter text-2xl md:text-3xl flex items-center justify-center gap-4 transition-all shadow-lg active:scale-95 group ${loading ? 'bg-black text-[#FF5C00] cursor-wait animate-offer-pulse' : 'bg-[#FF5C00] hover:bg-[#E04F00] text-white hover:scale-[1.01]'}`}
              >
                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-offer-scan pointer-events-none" />
                )}
                
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-10 h-10 shrink-0" />
                    <span className="relative z-10">{t('generatingBtn')}</span>
                    <Sparkles className="w-8 h-8 text-[#FF5C00] animate-pulse" />
                  </>
                ) : isLocked ? (
                  t('unlockNow')
                ) : (
                  <>
                    {t('generateBtn')}
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {(result || isLocked) && (
            <div className="mt-16 animate-in slide-in-from-bottom-10 duration-700" ref={resultRef}>
              <div className="relative bg-[#141414] border border-white/10 rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl">
                {!isLocked && (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown components={{
                      h2: ({...props}) => <h2 className="text-[#FF5C00] uppercase font-black tracking-tighter text-4xl mt-12 mb-6" {...props} />,
                      li: ({...props}) => <li className="bg-black/50 border-l-4 border-[#FF5C00] p-6 rounded-r-2xl mb-4" {...props} />,
                    }}>
                      {result?.text || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 mb-40 scroll-mt-32">
          <div className="text-center mb-16">
            <Badge>{language === 'es' ? 'Inversión' : 'Investment'}</Badge>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4">{t('pricingTitle')}</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest italic">{t('pricingSub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            <PricingCard 
              lang={language} 
              title="Registro Gratis" 
              price="0" 
              features={language === 'es' ? ["Prueba la herramienta", "Guarda tu historial", "Bóveda estratégica", "Ideal para empezar"] : ["Try the tool", "Save history", "Strategic vault", "Perfect to start"]} 
              cta={language === 'es' ? 'Regístrate Gratis' : 'Register Free'} 
              onCtaClick={() => setShowSignup('Free Plan')}
            />
            <PricingCard 
              lang={language} 
              title="Starter Offer" 
              price="24,99" 
              value="49,99" 
              promoText={language === 'es' ? '50 primeros por vida' : 'First 50 for life'}
              cta={language === 'es' ? 'Empezar a Escalar' : 'Start Scaling'} 
              onCtaClick={() => window.location.href = 'https://buy.stripe.com/3cI7sL37IdAw7W52pCfjG0V'} 
              features={language === 'es' ? ["10 Generaciones al mes", "Super Agente IA", "Soporte vía Email", "Exportar a JSON/TXT"] : ["10 Generations/mo", "Super AI Agent", "Email Support", "JSON/TXT Export"]} 
            />
            <PricingCard 
              lang={language} 
              title="Scale Master" 
              price="97" 
              value="1.500" 
              popular={true} 
              cta={language === 'es' ? 'Domina tu Mercado' : 'Dominate your Market'} 
              onCtaClick={setShowSignup} 
              features={language === 'es' ? ["Generaciones ILIMITADAS", "Todos Los Agentes IA", "Analizador de Competencia", "Generador de Guiones de Venta", "Soporte Prioritario VIP"] : ["UNLIMITED Generations", "All AI Agents", "Competitor Analyzer", "Sales Script Gen", "Priority VIP Support"]} 
            />
            <PricingCard 
              lang={language} 
              title="Grand Slam Agency" 
              price="297" 
              value="5.000" 
              cta={language === 'es' ? 'Acceso Elite' : 'Elite Access'} 
              onCtaClick={setShowSignup} 
              features={language === 'es' ? ["Todo lo de Scale Master", "Modo Marca Blanca", "API para embudos", "Consultoría trimestral con IA", "Acceso a Bóveda Privada"] : ["Everything in Scale Master", "White Label Mode", "API for Funnels", "Quarterly AI Consulting", "Private Vault Access"]} 
            />
          </div>
        </section>

      </main>

      <footer className="py-20 bg-[#050505] border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto px-6">
           <p className="text-[#FF5C00] font-black uppercase italic tracking-widest text-sm mb-4">Nada es imposible Si lo crees lo creas</p>
           <div className="flex items-center justify-center gap-2 font-black italic text-3xl mb-8"><Zap className="w-8 h-8 text-[#FF5C00]" fill="#FF5C00" />ALEXIA</div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-8 leading-relaxed italic">© {new Date().getFullYear()} AlexIA - {language === 'es' ? 'Todos los derechos reservados' : 'All rights reserved'}.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0A0A0A; }
        .prose h2 { margin-bottom: 2rem; line-height: 1; color: #FF5C00; text-transform: uppercase; font-weight: 900; font-style: italic; font-size: 2.25rem; }
        .prose p { margin-bottom: 1.5rem; line-height: 1.6; }
        .prose li { list-style: none; background: rgba(255, 92, 0, 0.05); border-left: 4px solid #FF5C00; padding: 1rem 1.5rem; border-radius: 0 1rem 1rem 0; margin-bottom: 1rem; }
        .animate-in { animation: animateIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes animateIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        
        @keyframes offer-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 92, 0, 0); }
          50% { box-shadow: 0 0 50px rgba(255, 92, 0, 0.4); }
        }
        .animate-offer-pulse { animation: offer-pulse 2s infinite ease-in-out; }
        
        @keyframes offer-scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-offer-scan { animation: offer-scan 1.5s infinite linear; }

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: #FF5C00; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF5C00; }

        .script-content p { font-size: 1.125rem; }
      `}</style>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
