
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
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
  User as UserIcon,
  Fingerprint,
  MailCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from "jspdf";
import { supabase } from './supabaseClient';

// --- Types ---
type OfferCategory = 'high-ticket' | 'low-ticket' | 'ecommerce' | 'physical' | 'services';
type Language = 'es' | 'en';
type UserPlan = 'free' | 'starter' | 'scale-master' | 'agency';

interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  plan: UserPlan;
  created_at: string;
  trial_count: number;
  role: 'user' | 'admin';
}

interface OfferResult {
  text: string;
  isStreaming: boolean;
  input?: string;
  offerType?: OfferCategory;
  timestamp?: number;
}

interface SavedOffer {
  id: string;
  userId: string;
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

// --- Constants ---
const STORAGE_KEY = 'alexia_offers_history_v4';
const SESSION_KEY = 'alexia_active_session';
const PERMANENT_BRAIN_KEY = 'alexia_permanent_brain';
const ADMIN_PASSWORD = "Daya2707"; // Master Admin Pass

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
    registerBtn: "Crear Cuenta",
    credits: "Ofertas Generadas",
    adminMode: "Acceso Maestro",
    historyTitle: "Tu Historial",
    historySub: "Todas tus ofertas optimizadas",
    historyEmpty: "No hay ofertas guardadas todavía. Escribe arriba qué vendes y pulsa 'GENERAR' para empezar.",
    exportBtn: "Exportar Ofertas",
    viewFull: "Ver completa",
    duplicate: "Duplicar",
    delete: "Eliminar",
    pricingTitle: "ELIGE TU VEHÍCULO DE ESCALADO",
    pricingSub: "Haz que se sientan estúpidos diciendo que no.",
    lockedTitle: "ACCESO REQUERIDO",
    lockedSub: "DEBES ESTAR AUTENTICADO PARA GENERAR OFERTAS GRAND SLAM.",
    unlockNow: "REGÍSTRATE GRATIS Y PRUÉBALA",
    langName: "ES",
    navAdmin: "Panel Maestro",
    navPremium: "Herramientas Premium",
    navPanel: "Mi Bóveda",
    panelTitle: "BÓVEDA ESTRATÉGICA",
    panelSub: "Gestiona tu arsenal de ofertas ganadoras.",
    close: "Cerrar",
    exportJson: "Exportar JSON",
    exportTxt: "Exportar TXT",
    exportPdf: "Exportar PDF",
    formName: "NOMBRE COMPLETO",
    formEmail: "TU EMAIL DE NEGOCIOS",
    formPass: "CONTRASEÑA",
    authLogin: "Ya tengo cuenta",
    authRegister: "No tengo cuenta",
    adminTabUsers: "Usuarios",
    adminTabBrain: "Cerebro",
    adminTabScripts: "Guiones",
    premiumLocked: "PLAN SCALE MASTER REQUERIDO",
    compBtn: "ANALIZAR Y DESTRUIR",
    scriptBtn: "GENERAR ARMA DE VENTAS",
    compPlaceholder: "Copia aquí la oferta de tu competencia...",
    scriptObjections: "OBJECIONES A DESTRUIR",
    scriptTypeVSL: "Video (VSL)",
    scriptTypeCloser: "Llamada Closer",
    scriptTypeDM: "Mensajes DM",
    scriptTypeEmail: "Email Frío",
    scriptCopy: "Copiar Guion"
  },
  en: {
    badge: "Create irresistible offers that sell themselves",
    heroTitle: "STOP SELLING <span class='text-[#FF5C00]'>CHEAP</span> AND START BEING <span class='text-[#FF5C00]'>IRRESISTIBLE</span>",
    heroSub: "The AI that designs your Grand Slam offer in seconds. Don't compete on price, compete on <span class='text-white font-black underline decoration-[#FF5C00]'>massive value</span>.",
    placeholder: "Tell me what you sell, to whom, and how you charge right now...",
    generateBtn: "GENERATE GRAND SLAM OFFER",
    generatingBtn: "DESIGNING MASSIVE VALUE...",
    viewPlans: "View Plans",
    loginBtn: "Login",
    registerBtn: "Sign Up",
    credits: "Offers Generated",
    adminMode: "Master Access",
    historyTitle: "Your History",
    historySub: "All your optimized offers",
    historyEmpty: "No saved offers yet. Type above what you sell and click 'GENERATE' to start.",
    exportBtn: "Export Offers",
    viewFull: "View Full",
    duplicate: "Duplicate",
    delete: "Delete",
    pricingTitle: "CHOOSE YOUR SCALING VEHICLE",
    pricingSub: "Make them feel stupid saying no.",
    lockedTitle: "ACCESS REQUIRED",
    lockedSub: "YOU MUST BE AUTHENTICATED TO GENERATE GRAND SLAM OFFERS.",
    unlockNow: "REGISTER FOR FREE & TRY IT",
    langName: "EN",
    navAdmin: "Master Panel",
    navPremium: "Premium Tools",
    navPanel: "My Vault",
    panelTitle: "STRATEGIC VAULT",
    panelSub: "Manage your arsenal of winning offers.",
    close: "Close",
    exportJson: "Export JSON",
    exportTxt: "Export TXT",
    exportPdf: "Export PDF",
    formName: "FULL NAME",
    formEmail: "BUSINESS EMAIL",
    formPass: "PASSWORD",
    authLogin: "I have an account",
    authRegister: "Create account",
    adminTabUsers: "Users",
    adminTabBrain: "Brain",
    adminTabScripts: "Scripts",
    premiumLocked: "SCALE MASTER PLAN REQUIRED",
    compBtn: "ANALYZE & DESTROY",
    scriptBtn: "GENERATE SALES WEAPON",
    compPlaceholder: "Paste your competitor's offer here...",
    scriptObjections: "OBJECTIONS TO CRUSH",
    scriptTypeVSL: "Video (VSL)",
    scriptTypeCloser: "Closer Call",
    scriptTypeDM: "DM Outreach",
    scriptTypeEmail: "Cold Email",
    scriptCopy: "Copy Script"
  }
};

// --- System Instruction ---
const getSystemInstruction = (lang: Language) => `
ROL: Eres Alex Hormozi impulsado por IA.
TONO: Directo, obsesionado con el ROI.
REGLA DE ORO: Toda oferta generada DEBE tener al menos 7 PUNTOS DETALLADOS que compongan la solución completa (Mecanismo Central, Bonos, Garantía, Escasez, etc.).
IDIOMA: Responde siempre en ${lang === 'es' ? 'español' : 'inglés'}.
`;

// --- AuthService Implementation (Supabase) ---
const AuthService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error('Database connection failed:', e);
      return [];
    }
  },
  
  register: async (name: string, email: string, pass: string): Promise<User | null> => {
    try {
      const role = email === 'admin@alexia.ai' ? 'admin' : 'user';
      const { data, error } = await supabase
        .from('users')
        .insert([
          { name, email, password: pass, role, plan: 'free', trial_count: 0 }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Registration error:', error);
        return null;
      }
      return data;
    } catch (e) {
      console.error('Registration failed:', e);
      throw e;
    }
  },

  login: async (email: string, pass: string): Promise<User | null> => {
    // Master Admin Override
    if (email === 'admin@alexia.ai' && pass === ADMIN_PASSWORD) {
        return { id: 'admin-root', name: 'Master Admin', email, role: 'admin', plan: 'agency', created_at: new Date().toISOString(), trial_count: 0 };
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .single();

      if (error || !data) {
        console.error('Login error:', error);
        return null;
      }
      return data;
    } catch (e) {
      console.error('Login failed:', e);
      throw e;
    }
  },

  saveSession: (user: User) => localStorage.setItem(SESSION_KEY, JSON.stringify(user)),
  getSession: (): User | null => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'),
  logout: () => localStorage.removeItem(SESSION_KEY),
  
  updateUserTrial: async (userId: string) => {
    try {
      // Don't attempt DB update for local admin override
      if (userId === 'admin-root') return null;

      const { data, error } = await supabase
        .from('users')
        .select('trial_count')
        .eq('id', userId)
        .single();
      
      if (data) {
        const { data: updated, error: updateError } = await supabase
          .from('users')
          .update({ trial_count: data.trial_count + 1 })
          .eq('id', userId)
          .select()
          .single();
        
        if (updated) {
          AuthService.saveSession(updated);
          return updated;
        }
      }
    } catch (e) {
      console.warn('Could not update trial count in DB:', e);
    }
    return null;
  }
};

// --- UI Components ---
const Badge = ({ children }: { children?: React.ReactNode }) => (
  <span className="bg-[#FF5C00]/10 text-[#FF5C00] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#FF5C00]/20 mb-4 inline-block">
    {children}
  </span>
);

const App = () => {
  const [language, setLanguage] = useState<Language>('es');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [input, setInput] = useState('');
  const [offerType, setOfferType] = useState<OfferCategory>('high-ticket');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [result, setResult] = useState<OfferResult | null>(null);
  const [history, setHistory] = useState<SavedOffer[]>([]);
  const [permanentBrain, setPermanentBrain] = useState<string>('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'users' | 'brain' | 'scripts'>('users');
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);

  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const t = (key: keyof typeof translations['es']) => translations[language][key];

  useEffect(() => {
    const session = AuthService.getSession();
    if (session) setCurrentUser(session);
    
    const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setHistory(savedHistory);
    
    const brain = localStorage.getItem(PERMANENT_BRAIN_KEY) || '';
    setPermanentBrain(brain);
  }, []);

  useEffect(() => {
    if (adminMenuOpen) {
      fetchAdminUsers();
    }
  }, [adminMenuOpen]);

  const fetchAdminUsers = async () => {
    try {
      const users = await AuthService.getAllUsers();
      setAllUsers(users);
    } catch (e) {
      console.error("Admin fetch failed", e);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
          const user = await AuthService.register(authForm.name, authForm.email, authForm.password);
          if (user) {
              setCurrentUser(user);
              AuthService.saveSession(user);
              setShowAuthModal(false);
          } else {
              setAuthError('Error al registrar. El email podría estar en uso.');
          }
      } else {
          const user = await AuthService.login(authForm.email, authForm.password);
          if (user) {
              setCurrentUser(user);
              AuthService.saveSession(user);
              setShowAuthModal(false);
          } else {
              setAuthError('Credenciales inválidas.');
          }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error de servidor. Verifica tu conexión o configuración de Supabase.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setAdminMenuOpen(false);
    setShowUserDashboard(false);
  };

  const generateOffer = async () => {
    if (!currentUser) {
        setShowAuthModal(true);
        return;
    }
    if (!input.trim()) return;
    
    setLoading(true);
    setResult({ text: '', isStreaming: true });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: `USER INPUT: ${input}. Offer Type: ${offerType}.`,
        config: { systemInstruction: getSystemInstruction(language) + permanentBrain, temperature: 0.9 },
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setResult({ text: fullText, isStreaming: true });
      }

      const finalOffer: SavedOffer = {
        id: Math.random().toString(36).substring(7),
        userId: currentUser.id,
        input,
        text: fullText,
        offerType,
        timestamp: Date.now()
      };

      const updatedHistory = [finalOffer, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      
      const updatedUser = await AuthService.updateUserTrial(currentUser.id);
      if (updatedUser) setCurrentUser(updatedUser);
      
      setResult({ ...finalOffer, isStreaming: false });
    } catch (e: any) {
      setResult({ text: `Error de generación: ${e.message || "Error de conexión."}`, isStreaming: false });
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = (id: string) => {
    const updated = history.filter(o => o.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const exportPDF = (offer: SavedOffer) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("ALEXIA - ESTRATEGIA GRAND SLAM", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generada el: ${new Date(offer.timestamp).toLocaleString()}`, 20, 30);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(offer.text, 170);
    doc.text(splitText, 20, 50);
    doc.save(`Oferta_${offer.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 font-sans selection:bg-[#FF5C00]">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-black italic text-xl cursor-pointer">
            <Zap className="w-6 h-6 text-[#FF5C00]" />
            ALEX<span className="text-[#FF5C00]">IA</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black"
            >
              {t('langName')}
            </button>

            {!currentUser ? (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="text-xs font-black uppercase flex items-center gap-2 px-6 py-2 rounded-full bg-[#FF5C00] text-white hover:bg-[#E04F00] transition-all"
              >
                <LogIn className="w-4 h-4" />
                {t('loginBtn')}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {currentUser.role === 'admin' && (
                  <button onClick={() => setAdminMenuOpen(true)} className="text-[#FF5C00] font-black text-[10px] uppercase bg-[#FF5C00]/10 px-4 py-2 rounded-full border border-[#FF5C00]/20">
                    {t('navAdmin')}
                  </button>
                )}
                <button onClick={() => setShowUserDashboard(true)} className="text-white font-black text-[10px] uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  {t('navPanel')}
                </button>
                <button onClick={handleLogout} className="text-red-500 font-black text-[10px] uppercase hover:text-white transition-all">
                  Salir
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#141414] border-2 border-[#FF5C00]/20 w-full max-w-md rounded-[2.5rem] p-10 relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            
            <div className="text-center mb-10">
              <div className="bg-[#FF5C00] w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Fingerprint className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black uppercase italic">{authMode === 'register' ? t('registerBtn') : t('loginBtn')}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">{authMode === 'register' ? 'Únete a la elite de $100M' : 'Bienvenido de nuevo'}</p>
            </div>

            {authError && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-xs font-bold mb-6 text-center border border-red-500/20">{authError}</div>}

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <input required placeholder={t('formName')} className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-sm font-bold uppercase outline-none focus:border-[#FF5C00]" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} />
              )}
              <input required type="email" placeholder={t('formEmail')} className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-sm font-bold uppercase outline-none focus:border-[#FF5C00]" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
              <input required type="password" placeholder={t('formPass')} className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-sm font-bold uppercase outline-none focus:border-[#FF5C00]" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
              
              <button type="submit" disabled={authLoading} className="w-full bg-[#FF5C00] text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {authLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (authMode === 'register' ? 'EMPEZAR AHORA' : 'ENTRAR')}
              </button>
            </form>

            <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full mt-6 text-xs font-black uppercase text-gray-500 hover:text-[#FF5C00] transition-all">
              {authMode === 'login' ? t('authRegister') : t('authLogin')}
            </button>
          </div>
        </div>
      )}

      {/* ADMIN PANEL */}
      {adminMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl p-6 overflow-y-auto animate-in slide-in-from-bottom-10">
          <div className="max-w-6xl mx-auto pt-20">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black uppercase italic flex items-center gap-4">
                <ShieldAlert className="w-10 h-10 text-[#FF5C00]" />
                Panel de Administración Real
              </h2>
              <button onClick={() => setAdminMenuOpen(false)} className="bg-white/5 p-4 rounded-2xl"><X className="w-8 h-8" /></button>
            </div>

            <div className="flex gap-4 mb-10">
              <button onClick={() => setAdminTab('users')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${adminTab === 'users' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-gray-500'}`}>Gestión de Usuarios</button>
            </div>

            {adminTab === 'users' && (
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-black/40 border-b border-white/5">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-500">Nombre</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-500">Email</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-500">Plan</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-500">Generaciones</th>
                      <th className="p-6 text-[10px] font-black uppercase text-gray-500">Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-500 italic">No se pudieron cargar usuarios o no hay registros.</td>
                      </tr>
                    ) : (
                      allUsers.map(user => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                          <td className="p-6 font-black italic uppercase text-sm">{user.name}</td>
                          <td className="p-6 text-xs text-gray-400 font-mono">{user.email}</td>
                          <td className="p-6"><span className="bg-[#FF5C00]/10 text-[#FF5C00] px-3 py-1 rounded-full text-[9px] font-black uppercase">{user.plan}</span></td>
                          <td className="p-6 font-black text-sm">{user.trial_count}</td>
                          <td className="p-6 text-[10px] text-gray-500 uppercase">{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USER VAULT */}
      {showUserDashboard && (
        <div className="fixed inset-0 z-[120] bg-black/98 backdrop-blur-3xl p-6 overflow-y-auto animate-in slide-in-from-right-10">
          <div className="max-w-5xl mx-auto pt-20">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">{t('panelTitle')}</h2>
                <p className="text-[#FF5C00] font-black text-[10px] uppercase mt-2 italic">{currentUser?.email}</p>
              </div>
              <button onClick={() => setShowUserDashboard(false)} className="bg-white/5 p-5 rounded-3xl"><X className="w-8 h-8" /></button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {history.filter(o => o.userId === currentUser?.id || currentUser?.role === 'admin').map(item => (
                <div key={item.id} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-[#FF5C00]/40 transition-all group">
                   <div className="flex justify-between items-start">
                     <div className="flex-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase mb-2 block">{new Date(item.timestamp).toLocaleString()}</span>
                        <h4 className="text-2xl font-black uppercase italic group-hover:text-[#FF5C00] transition-colors mb-4 truncate max-w-lg">{item.input}</h4>
                        <div className="flex gap-3">
                           <button onClick={() => setExpandedOfferId(expandedOfferId === item.id ? null : item.id)} className="px-6 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase border border-white/10 hover:bg-white/10">
                              {expandedOfferId === item.id ? 'Contraer' : 'Ver Completa'}
                           </button>
                           <button onClick={() => exportPDF(item)} className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white">
                              <Download className="w-5 h-5" />
                           </button>
                           <button onClick={() => deleteOffer(item.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white">
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                     <div className="bg-[#FF5C00]/10 px-4 py-2 rounded-2xl border border-[#FF5C00]/20">
                        <span className="text-[10px] font-black text-[#FF5C00] uppercase italic">{item.offerType}</span>
                     </div>
                   </div>
                   {expandedOfferId === item.id && (
                     <div className="mt-8 pt-8 border-t border-white/10 prose prose-invert max-w-none">
                        <ReactMarkdown>{item.text}</ReactMarkdown>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      <main className="pt-32 pb-20">
        <section className="max-w-5xl mx-auto px-6 text-center mb-24">
          <Badge>{t('badge')}</Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8" dangerouslySetInnerHTML={{ __html: t('heroTitle') }} />
          <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: t('heroSub') }} />
        </section>

        <section className="max-w-4xl mx-auto px-6 mb-40">
          <div className="bg-[#141414] border-2 border-[#FF5C00]/30 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(255,92,0,0.1)] relative">
            
            {!currentUser && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-[2.5rem] z-40 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                  <Lock className="w-12 h-12 text-[#FF5C00] mb-6" />
                  <h3 className="text-4xl font-black uppercase italic mb-4">{t('lockedTitle')}</h3>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest italic mb-8">{t('lockedSub')}</p>
                  <button onClick={() => setShowAuthModal(true)} className="bg-[#FF5C00] text-white px-12 py-5 rounded-2xl font-black uppercase text-xl shadow-2xl hover:scale-105 transition-all">
                    {t('unlockNow')}
                  </button>
               </div>
            )}

            <div className="space-y-8">
              <div className="flex flex-wrap gap-3">
                {['high-ticket', 'low-ticket', 'ecommerce', 'physical', 'services'].map((cat) => (
                  <button 
                    key={cat} onClick={() => setOfferType(cat as any)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${offerType === cat ? 'bg-[#FF5C00] border-[#FF5C00] text-white shadow-lg' : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {cat.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <textarea
                className="w-full bg-black/60 border-2 border-white/5 rounded-3xl p-8 text-xl font-bold placeholder:text-gray-800 transition-all focus:border-[#FF5C00]/50 min-h-[180px] outline-none"
                placeholder={t('placeholder')}
                value={input} onChange={(e) => setInput(e.target.value)}
              />

              <button
                onClick={generateOffer}
                disabled={loading || !input.trim()}
                className={`w-full relative overflow-hidden font-black py-8 rounded-3xl uppercase tracking-tighter text-2xl md:text-3xl flex items-center justify-center gap-4 transition-all shadow-lg active:scale-95 group ${loading ? 'bg-black text-[#FF5C00] cursor-wait' : 'bg-[#FF5C00] hover:bg-[#E04F00] text-white hover:scale-[1.01]'}`}
              >
                {loading ? <><Loader2 className="animate-spin w-10 h-10" /> {t('generatingBtn')}</> : <>{t('generateBtn')} <ArrowRight className="w-8 h-8" /></>}
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-16 animate-in slide-in-from-bottom-10">
              <div className="relative bg-[#141414] border border-white/10 rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown components={{
                    h2: ({...props}) => <h2 className="text-[#FF5C00] uppercase font-black tracking-tighter text-4xl mt-12 mb-6" {...props} />,
                    li: ({...props}) => <li className="bg-black/50 border-l-4 border-[#FF5C00] p-6 rounded-r-2xl mb-4" {...props} />,
                  }}>
                    {result.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="py-20 bg-[#050505] border-t border-white/5 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest italic">
        © {new Date().getFullYear()} AlexIA - Powered by Hormozi Framework (Supabase Real-Time)
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0A0A0A; }
        .animate-in { animation: animateIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes animateIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #FF5C00; }
        .prose h1, .prose h2, .prose h3 { color: #FF5C00; font-weight: 900; font-style: italic; }
      `}</style>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
