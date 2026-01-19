
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Wallet, 
  Menu, 
  Mic, 
  Send, 
  Plus, 
  FileText, 
  BarChart3, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  LogOut, 
  User, 
  Trophy,
  X,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  PlayCircle,
  ShieldCheck,
  AlertCircle,
  Upload,
  ChevronDown,
  Globe,
  Settings,
  Star,
  Info,
  ExternalLink
} from 'lucide-react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Configuration ---
const SUPABASE_URL = "https://bgqbfwzyycgehcxlgrjk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncWJmd3p5eWNnZWhjeGxncmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODU1MDQsImV4cCI6MjA4NDA2MTUwNH0.VHHnYpVxzjIdwx8_2wa4HtwnPlUS2swB32-_sOMKcmg";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Types & Constants ---
type Language = 'English' | 'Hindi' | 'Marathi' | 'Punjabi' | 'Telugu' | 'Kannada' | 'Tamil' | 'Malayalam';

const LANGUAGES: Language[] = ['English', 'Hindi', 'Marathi', 'Punjabi', 'Telugu', 'Kannada', 'Tamil', 'Malayalam'];

const COUNTRY_CODES = [
  { code: '+91', label: 'India' },
  { code: '+1', label: 'USA' },
  { code: '+44', label: 'UK' },
  { code: '+971', label: 'UAE' }
];

const TRANSLATIONS: Record<Language, any> = {
  English: {
    welcome: "NidhiSahay", tagline: "Your Financial AI Agent", createAccount: "Create New Account", login: "Login",
    name: "Full Name", mobile: "Mobile Number", consent: "By checking this box means you agree to AI agent to track the information and actions performed by the user.",
    setMpin: "Set mPIN", confirmMpin: "Confirm mPIN", enterMpin: "Enter mPIN", wallet: "Wallet Balance",
    totalLogged: "Logged Activity", addMoney: "Add Money", loanEl: "Loan Eligibility", logActivity: "Log Activity",
    education: "Education Content", profile: "My Profile", logout: "Logout", forgetMe: "Forget Me",
    savingTarget: "Daily Savings Target", userLevel: "Savings Level", helpful: "Was this helpful?",
    success: "Success!", next: "Next", back: "Back", cancel: "Cancel", thinking: "Agent is thinking...",
    uploadDoc: "Upload Documents", enterPin: "Enter PIN", confirmDelete: "Erase All Data",
    forgetConfirm: "Are you sure? This will permanently delete your profile and all transaction history from our servers."
  },
  Hindi: { welcome: "निधिसहाय", tagline: "आपका वित्तीय एआई एजेंट", createAccount: "नया खाता बनाएं", login: "लॉगिन", wallet: "वॉलेट बैलेंस", addMoney: "पैसे जोड़ें", loanEl: "ऋण पात्रता", logActivity: "गतिविधि दर्ज करें", education: "शिक्षा", profile: "मेरी प्रोफाइल", logout: "लॉगआउट", forgetMe: "मुझे भूल जाओ", success: "सफल!" },
  Marathi: { welcome: "निधिसहाय", tagline: "तुमचा आर्थिक AI एजंट", createAccount: "नवीन खाते उघडा", login: "लॉगिन", wallet: "वॉलेट शिल्लक", addMoney: "पैसे जोडा", loanEl: "कर्ज पात्रता", logActivity: "व्यवहार नोंदवा", education: "शिक्षण", profile: "माझी प्रोफाइल", logout: "लॉगआउट", forgetMe: "माझी माहिती पुसा", success: "यशस्वी!" },
  Punjabi: { welcome: "ਨਿਧੀਸਹਾਇ", tagline: "ਤੁਹਾਡਾ ਵਿੱਤੀ AI ਏਜੰਟ", createAccount: "ਨਵਾਂ ਖਾਟਾ ਬਣਾਓ", login: "ਲੌਗਇਨ", wallet: "ਬਕਾਇਆ", addMoney: "ਪੈਸੇ ਜੋੜੋ", loanEl: "ਕਰਜ਼ੇ ਦੀ ਪਾਤਰਤਾ", logActivity: "ਗਤੀਵਿਧੀ", education: "ਸਿੱਖਿਆ", logout: "ਲੌਗਆਉਟ", profile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ", success: "ਸਫਲ!" },
  Telugu: { welcome: "నిధిసహాయ్", tagline: "మీ ఆర్థిక AI ఏజెంట్", createAccount: "కొత్త ఖాతాను సృష్టించండి", login: "లాగిన్", wallet: "వాలెట్ బ్యాలెన్స్", addMoney: "డబ్బు జోడించండి", loanEl: "రుణ అర్హత", logActivity: "కార్యాచరణ", education: "విద్య", logout: "లాగ్అవుట్", profile: "నా ప్రొఫైల్", success: "విజయం!" },
  Kannada: { welcome: "ನಿಧಿಸಹಾಯ್", tagline: "ನಿಮ್ಮ ಹಣಕಾಸಿನ AI ಏಜೆಂಟ್", createAccount: "ಹೊಸ ಕಾತೆಯನ್ನು ರಚಿಸಿ", login: "ಲಾಗಿನ್", wallet: "ವ್ಯಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್", addMoney: "ಹಣ ಸೇರಿಸಿ", loanEl: "ಸಾಲದ ಅರ್ಹತೆ", logActivity: "ಚಟುವಟಿಕೆ", education: "ಶಿಕ್ಷಣ", logout: "ಲಾಗ್ಔಟ್", profile: "ನನ್ನ ಪ್ರೊಫೈಲ್", success: "ಯಶಸ್ವಿ!" },
  Tamil: { welcome: "நிதிசஹாய்", tagline: "உங்கள் நிதி AI முகவர்", createAccount: "புதிய கணக்கை உருவாக்கவும்", login: "உள்நுழை", wallet: "இருப்பு", addMoney: "பணம் சேர்க்க", loanEl: "கடன் தகுதி", logActivity: "செயல்பாடு", education: "கல்வி", logout: "வெளியேறு", profile: "எனது சுயவிவரம்", success: "வெற்றி!" },
  Malayalam: { welcome: "നിധിസഹായ്", tagline: "നിങ്ങളുടെ സാമ്പത്തിക AI ഏജന്റ്", createAccount: "പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക", login: "ലോഗിൻ", wallet: "ബാലൻസ്", addMoney: "പണം ചേർക്കുക", loanEl: "വായ്പാ യോഗ്യത", logActivity: "പ്രവർത്തനം", education: "വിദ്യാഭ്യാസം", logout: "ലോഗൗട്ട്", profile: "എന്റെ പ്രൊഫൈൽ", success: "വിജയം!" }
};

const getTranslation = (lang: Language, key: string): string => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.English;
  return dict[key] || TRANSLATIONS.English[key] || key;
};

// --- DB Logic (Supabase Calls) ---
const DB = {
  async getProfile(mobile: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('mobile', mobile).single();
    if (error) return null;
    return data;
  },
  async saveUser(user: any) {
    const { data, error } = await supabase.from('profiles').insert([{
      mobile: user.mobile,
      name: user.name,
      mpin: user.mpin,
      language: user.language,
      streak: 0,
      level: 1,
      target: 100,
      signup_timing: new Date().toISOString()
    }]).select().single();
    if (error) throw error;
    return data;
  },
  async updateProfile(mobile: string, updates: any) {
    await supabase.from('profiles').update(updates).eq('mobile', mobile);
  },
  async logAuthEvent(mobile: string, type: 'login' | 'logout') {
    await supabase.from('login_logs').insert([{ profile_mobile: mobile, type, date: new Date().toISOString() }]);
  },
  async getWalletBalance(mobile: string) {
    const { data } = await supabase.from('wallet_transactions').select('amount, type').eq('profile_mobile', mobile);
    return (data || []).reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 0);
  },
  async addWalletTx(mobile: string, amount: number) {
    await supabase.from('wallet_transactions').insert([{ profile_mobile: mobile, amount, type: 'credit', date: new Date().toISOString() }]);
  },
  async getLoggedBalance(mobile: string) {
    const { data } = await supabase.from('money_logs').select('amount, type').eq('profile_mobile', mobile);
    return (data || []).reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  },
  async addMoneyLog(mobile: string, log: any) {
    await supabase.from('money_logs').insert([{ profile_mobile: mobile, ...log, date: new Date().toISOString() }]);
  },
  async saveLoanEligibility(mobile: string, loanData: any, interactions: any[]) {
    await supabase.from('loan_eligibility').insert([{
      profile_mobile: mobile,
      business_type: loanData.business_type,
      udyam_registered: loanData.udyam_registered,
      transaction_method: loanData.transaction_method,
      has_business_pan: loanData.has_business_pan,
      miscellaneous: { interactions }
    }]);
  },
  async clearUserData(mobile: string) {
    await supabase.from('profiles').delete().eq('mobile', mobile);
  }
};

// --- AI Components ---
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((l, i) => {
        const urlMatch = l.match(/(https?:\/\/[^\s\]\)]+)/i);
        const isActionLine = l.toLowerCase().includes('apply') || l.toLowerCase().includes('portal') || l.toLowerCase().includes('link') || l.includes('http');
        
        const renderLine = (content: string) => {
          if (content.includes('**')) {
            const parts = content.split(/(\*\*.*?\*\*)/);
            return (
              <p key={i}>
                {parts.map((part, idx) => 
                  part.startsWith('**') && part.endsWith('**') 
                    ? <strong key={idx} className="font-extrabold text-indigo-900">{part.slice(2, -2)}</strong> 
                    : part
                )}
              </p>
            );
          }
          return <p key={i}>{content}</p>;
        };

        if (urlMatch && isActionLine) {
          const url = urlMatch[1].replace(/[).,\] ]$/, '');
          return (
            <div key={i} className="flex flex-col gap-2 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 shadow-sm animate-in zoom-in-95">
              {renderLine(l.split(/(https?:\/\/[^\s\]\)]+)/i)[0])}
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all w-full md:w-fit"
              >
                Apply Now <ExternalLink size={16} />
              </a>
            </div>
          );
        }

        return renderLine(l);
      })}
    </div>
  );
};

// --- Auth Screen Component ---
const AuthScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [mode, setMode] = useState<'landing' | 'signup' | 'login' | 'mpin' | 'confirm_mpin'>('landing');
  const [formData, setFormData] = useState({ name: '', mobile: '', mpin: '', confirmMpin: '', countryCode: '+91', consent: false });
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>('English');

  const handleSignupNext = async () => {
    if (!formData.name || formData.mobile.length !== 10 || !formData.consent) {
      setError('Check all fields, 10-digit mobile, and consent.'); return;
    }
    const fullMobile = formData.countryCode + formData.mobile;
    const exists = await DB.getProfile(fullMobile);
    if (exists) { setError('Account already exists.'); return; }
    setMode('mpin');
  };

  const handleFinalizeSignup = async () => {
    if (formData.mpin !== formData.confirmMpin) { setError('mPINs mismatch.'); return; }
    const fullMobile = formData.countryCode + formData.mobile;
    try {
      const user = await DB.saveUser({ ...formData, mobile: fullMobile, language: selectedLang });
      await DB.logAuthEvent(fullMobile, 'login');
      onLogin(user);
    } catch (e) { setError('Signup failed.'); }
  };

  const handleLogin = async () => {
    const fullMobile = formData.countryCode + formData.mobile;
    const user = await DB.getProfile(fullMobile);
    if (user && user.mpin === formData.mpin) {
      await DB.logAuthEvent(fullMobile, 'login');
      onLogin(user);
    } else { setError('Invalid credentials.'); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-in fade-in">
      <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl">NS</div>
      <h1 className="text-3xl font-black text-indigo-900 mb-2">{getTranslation(selectedLang, 'welcome')}</h1>
      <p className="text-slate-400 font-medium mb-12">{getTranslation(selectedLang, 'tagline')}</p>

      {mode === 'landing' && (
        <div className="w-full max-w-sm space-y-4">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setSelectedLang(l)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedLang === l ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{l}</button>
            ))}
          </div>
          <button onClick={() => setMode('signup')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg">{getTranslation(selectedLang, 'createAccount')}</button>
          <button onClick={() => setMode('login')} className="w-full border-2 border-slate-100 font-bold py-4 rounded-2xl">{getTranslation(selectedLang, 'login')}</button>
        </div>
      )}

      {(mode === 'signup' || mode === 'login') && (
        <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-4">
          {mode === 'signup' && <input type="text" placeholder={getTranslation(selectedLang, 'name')} className="w-full p-4 bg-slate-50 rounded-2xl border" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />}
          <div className="flex gap-2">
            <select className="p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.countryCode} onChange={e => setFormData({ ...formData, countryCode: e.target.value })}>
              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
            <input type="tel" maxLength={10} placeholder={getTranslation(selectedLang, 'mobile')} className="flex-1 p-4 bg-slate-50 rounded-2xl border" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })} />
          </div>
          {mode === 'login' && <input type="password" placeholder="mPIN" className="w-full p-4 bg-slate-50 rounded-2xl border" value={formData.mpin} onChange={e => setFormData({ ...formData, mpin: e.target.value })} />}
          {mode === 'signup' && (
            <div className="flex gap-3 p-3 bg-indigo-50/50 rounded-xl text-[10px] text-slate-500 font-medium">
              <input type="checkbox" checked={formData.consent} onChange={e => setFormData({ ...formData, consent: e.target.checked })} />
              <p>{getTranslation(selectedLang, 'consent')}</p>
            </div>
          )}
          <button onClick={mode === 'signup' ? handleSignupNext : handleLogin} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl">{getTranslation(selectedLang, mode === 'signup' ? 'next' : 'login')}</button>
          <button onClick={() => setMode('landing')} className="w-full text-slate-400 font-bold py-2 text-sm">{getTranslation(selectedLang, 'back')}</button>
        </div>
      )}

      {(mode === 'mpin' || mode === 'confirm_mpin') && (
        <div className="w-full max-w-sm space-y-8 text-center animate-in slide-in-from-bottom-4">
          <h2 className="text-xl font-black text-indigo-900">{getTranslation(selectedLang, mode === 'mpin' ? 'setMpin' : 'confirmMpin')}</h2>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className={`w-3 h-3 rounded-full border-2 ${ (mode === 'mpin' ? formData.mpin : formData.confirmMpin).length >= i ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`} />)}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
              <button key={n} onClick={() => {
                const key = mode === 'mpin' ? 'mpin' : 'confirmMpin';
                const val = (formData as any)[key];
                if (n === 'C') setFormData({ ...formData, [key]: val.slice(0, -1) });
                else if (n === '✓') val.length === 4 && (mode === 'mpin' ? setMode('confirm_mpin') : handleFinalizeSignup());
                else if (val.length < 4) setFormData({ ...formData, [key]: val + String(n) });
              }} className="h-16 bg-slate-50 rounded-2xl font-black text-xl shadow-sm">{n}</button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-rose-500 text-xs font-bold mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">{error}</p>}
    </div>
  );
};

// --- Main Dashboard Component ---
const Dashboard = ({ user, language, onSelectFeature, balances }: any) => {
  return (
    <div className="space-y-6 pb-6 animate-in fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg shadow-indigo-100">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{getTranslation(language, 'wallet')}</p>
          <p className="text-2xl font-black">₹{balances.wallet}</p>
        </div>
        <div className="card p-5 bg-white border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{getTranslation(language, 'totalLogged')}</p>
          <p className={`text-2xl font-black ${balances.logged >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>₹{balances.logged}</p>
        </div>
      </div>

      <div className="card bg-indigo-900 rounded-3xl p-6 text-white shadow-xl flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Mic size={24} className="text-indigo-300" /></div>
        <div>
          <h3 className="text-lg font-black mb-1">Talk to Nidhi AI</h3>
          <p className="text-xs text-indigo-200 font-medium">Finance assistance in {language}</p>
        </div>
        <button onClick={() => onSelectFeature('ai_chat')} className="w-full bg-white text-indigo-900 font-black py-4 rounded-xl shadow-lg transition hover:bg-indigo-50 active:scale-95">Start Conversation</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onSelectFeature('add_money')} className="card p-6 flex flex-col items-center gap-3 bg-slate-50 border-slate-100 transition active:scale-95">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><Plus className="text-blue-600" /></div>
          <span className="text-xs font-black text-slate-800">{getTranslation(language, 'addMoney')}</span>
        </button>
        <button onClick={() => onSelectFeature('loan_eligibility')} className="card p-6 flex flex-col items-center gap-3 bg-slate-50 border-slate-100 transition active:scale-95">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><FileText className="text-purple-600" /></div>
          <span className="text-xs font-black text-slate-800">{getTranslation(language, 'loanEl')}</span>
        </button>
        <button onClick={() => onSelectFeature('log_activity')} className="card p-6 flex flex-col items-center gap-3 bg-slate-50 border-slate-100 transition active:scale-95">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><BarChart3 className="text-orange-600" /></div>
          <span className="text-xs font-black text-slate-800">{getTranslation(language, 'logActivity')}</span>
        </button>
        <button onClick={() => onSelectFeature('education')} className="card p-6 flex flex-col items-center gap-3 bg-slate-50 border-slate-100 transition active:scale-95">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><BookOpen className="text-emerald-600" /></div>
          <span className="text-xs font-black text-slate-800">{getTranslation(language, 'education')}</span>
        </button>
      </div>
    </div>
  );
};

// --- Agent Journey Types ---
interface LoanProfile {
  business_type: string;
  udyam_registered: string;
  transaction_method: string;
  has_business_pan: string;
}

const FeatureScreen = ({ type, user, language, onClose }: any) => {
  const [view, setView] = useState('main');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loanStep, setLoanStep] = useState(0);
  const [educationVideos, setEducationVideos] = useState<any[]>([]);
  const [loanProfile, setLoanProfile] = useState<Partial<LoanProfile>>({});
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (type === 'loan_eligibility') {
      const initialAgentBox = language === 'English' 
        ? "I can help with that! To find the best loan for you, I need to ask a few quick questions to build your profile. First, what type of business do you run?"
        : "मैं इसमें मदद कर सकता हूँ! आपके लिए सबसे अच्छा लोन खोजने के लिए, मुझे आपका प्रोफ़ाइल बनाने के लिए कुछ त्वरित प्रश्न पूछने की आवश्यकता है। सबसे पहले, आप किस प्रकार का व्यवसाय चलाते हैं?";
      setChatLog([{ role: 'assistant', content: initialAgentBox }]);
    } else if (type === 'education') {
      loadEducationRecommendations();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      recognitionRef.current.onresult = (e: any) => handleSend(e.results[0][0].transcript);
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [type, language]);

  const toggleListening = () => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start();

  const handleLoanFlow = async (msg: string) => {
    if (isTyping) return;
    setIsTyping(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let nextMsg = "";
    
    try {
      if (loanStep === 0) {
        // Step 0: User answers Business Type -> Agent asks Udyam
        setLoanProfile(prev => ({ ...prev, business_type: msg }));
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: `The user runs a "${msg}" business. As a Borrower Agentic AI, politely ask them if they are Udyam Registered in ${language}. Use clear, professional language.` }] }]
        });
        nextMsg = resp.text || (language === 'English' ? "Are you Udyam Registered?" : "क्या आप उद्यम पंजीकृत हैं?");
        setLoanStep(1);
      } else if (loanStep === 1) {
        // Step 1: User answers Udyam -> Agent asks PAN
        setLoanProfile(prev => ({ ...prev, udyam_registered: msg }));
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: `User Udyam status: "${msg}". As a Borrower Agentic AI, politely ask if they have a Business PAN card in ${language}.` }] }]
        });
        nextMsg = resp.text || (language === 'English' ? "Do you have a Business PAN card?" : "क्या आपके पास बिज़नेस पैन कार्ड है?");
        setLoanStep(2);
      } else if (loanStep === 2) {
        // Step 2: User answers PAN -> Agent asks Transaction Method
        setLoanProfile(prev => ({ ...prev, has_business_pan: msg }));
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: `User PAN status: "${msg}". As a Borrower Agentic AI, ask if their primary transaction method is Bank or Cash in ${language}.` }] }]
        });
        nextMsg = resp.text || (language === 'English' ? "Do you primarily transact via Bank or Cash?" : "क्या आप मुख्य रूप से बैंक या नकद के माध्यम से लेनदेन करते हैं?");
        setLoanStep(3);
      } else if (loanStep === 3) {
        // Step 3: User answers Transaction -> Agent: "Analyzing... Based on profile, eligible for: [List]. Which would you like to know more about?"
        setLoanProfile(prev => ({ ...prev, transaction_method: msg }));
        const prompt = `User Profile: ${JSON.stringify(loanProfile)}. 
        As a Borrower Agentic AI in ${language}, do the following:
        1. Say: "Thank you. I'm analyzing your profile against available loan schemes...".
        2. Say: "Based on your profile, you are eligible for these schemes:".
        3. List schemes like MUDRA Loan, PM SVANidhi, and CGTMSE.
        4. Ask: "Which scheme would you like to know more about?".
        Use Markdown for the list.`;
        
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: prompt }] }]
        });
        nextMsg = resp.text || (language === 'English' ? "Thank you. I'm analyzing your profile... Based on your profile, you are eligible for MUDRA Loan and PM SVANidhi. Which would you like to know more about?" : "धन्यवाद। मैं उपलब्ध ऋण योजनाओं के विरुद्ध आपकी प्रोफ़ाइल का विश्लेषण कर रहा हूँ... आपकी प्रोफ़ाइल के आधार पर, आप मुद्रा ऋण और पीएम स्वनिधि के लिए पात्र हैं। आप किसके बारे में अधिक जानना चाहेंगे?");
        setLoanStep(4);
      } else if (loanStep === 4) {
        // Step 4: User selects scheme -> Agent displays details + "Would you like me to guide you through next steps?"
        const prompt = `The user selected: "${msg}". 
        As a Borrower Agentic AI in ${language}:
        1. Say: "Great choice! Here are the details for [Scheme Name]:".
        2. Provide Details: Terms (e.g. Low interest, up to 10 Lakhs), Eligibility (Small businesses), Portal (e.g. janasamarth.in or pmsvanidhi.mohua.gov.in with links).
        3. Ask: "Would you like me to guide you through the next steps to apply?".
        Use professional tone and Markdown.`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: prompt }] }]
        });
        nextMsg = resp.text || (language === 'English' ? "Here are the details... Would you like me to guide you through the next steps?" : "यहाँ विवरण हैं... क्या आप चाहेंगे कि मैं आपको आवेदन करने के अगले चरणों के बारे में मार्गदर्शन करूँ?");
        setLoanStep(5);
      } else if (loanStep === 5) {
        // Step 5: User Responds "Yes" or "No" -> Agent provides steps or farewell
        const isYes = msg.toLowerCase().includes('yes') || msg.toLowerCase().includes('हाँ') || msg.toLowerCase().includes('guide') || msg.toLowerCase().includes('ok');
        if (isYes) {
          const prompt = `The user said YES to guidance in ${language}. 
          As a Borrower Agentic AI:
          1. Provide Step-by-Step guide: 
             - Visit the official portal link.
             - Click 'Apply Now'.
             - "I can help you pre-fill your application using the information you've given me."
          Use natural and helpful tone in ${language}.`;
          const resp = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ parts: [{ text: prompt }] }]
          });
          nextMsg = resp.text || (language === 'English' ? "Here is Step 1: Visit the portal... I can help you pre-fill your application!" : "यहाँ चरण 1 है: पोर्टल पर जाएँ... मैं आपके द्वारा दी गई जानकारी का उपयोग करके आपके आवेदन को प्री-फिल करने में आपकी मदद कर सकता हूँ!");
        } else {
          nextMsg = language === 'English' ? "No problem. I'm here if you change your mind!" : "कोई बात नहीं। अगर आप अपना मन बदलते हैं तो मैं यहाँ हूँ!";
        }
        setLoanStep(-1); // End journey
      }

      setChatLog(prev => [...prev, { role: 'assistant', content: nextMsg }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (msg: string = inputText) => {
    if (!msg.trim() || isTyping) return;
    setChatLog(prev => [...prev, { role: 'user', content: msg }]);
    setInputText('');
    
    if (type === 'loan_eligibility') {
      await handleLoanFlow(msg);
      return;
    }
    
    setIsTyping(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      if (type === 'log_activity') {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: `Parse this transaction: "${msg}". Return JSON {amount: number, type: "income"|"expense"}. Use strictly ${language} context.` }] }],
          config: { responseMimeType: "application/json" }
        });
        const parsed = JSON.parse(resp.text || '{}');
        if (parsed.amount) {
          await DB.addMoneyLog(user.mobile, parsed);
          const confirmMsg = language === 'English' ? `Logged ₹${parsed.amount} as ${parsed.type}.` : `₹${parsed.amount} को ${parsed.type} के रूप में दर्ज किया गया।`;
          setChatLog(prev => [...prev, { role: 'assistant', content: confirmMsg }]);
        }
      } else {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: msg }] }],
          config: { systemInstruction: `You are Nidhi Assistant, a helpful financial aid for MSMEs. Speak strictly in ${language}. Maintain a professional and reassuring tone.` }
        });
        setChatLog(prev => [...prev, { role: 'assistant', content: resp.text }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const loadEducationRecommendations = async () => {
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `Recommend 3 specific growth videos for MSMEs in ${language}. Focus on business management and digital skills. JSON: [{id: "youtube_id", title: "...", description: "..."}]` }] }],
        config: { responseMimeType: "application/json" }
      });
      setEducationVideos(JSON.parse(resp.text || '[]'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  // --- UI Views ---
  if (type === 'add_money') {
    if (view === 'main') return (
      <div className="space-y-8 py-4 animate-in slide-in-from-bottom-4">
        <header className="flex items-center gap-4 px-2">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
          <h3 className="font-black text-indigo-900 tracking-tight">{getTranslation(language, 'addMoney')}</h3>
        </header>
        <div className="text-center"><p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Amount to Add</p><h2 className="text-6xl font-black text-indigo-900">₹{amount || '0'}</h2></div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
            <button key={n} onClick={() => { if (n === 'C') setAmount(amount.slice(0, -1)); else if (n === '✓') amount && setView('pin'); else if (amount.length < 6) setAmount(amount + n); }} className="h-16 bg-white border border-slate-100 rounded-2xl font-black text-xl shadow-sm active:bg-indigo-50 active:scale-95 transition-all">{n}</button>
          ))}
        </div>
      </div>
    );
    if (view === 'pin') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 animate-in zoom-in-95">
        <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Enter UPI PIN</h2>
        <div className="flex gap-4 mb-12">{[1, 2, 3, 4].map(i => <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length >= i ? 'bg-indigo-600 border-indigo-600 scale-125' : 'bg-white border-slate-200'}`} />)}</div>
        <div className="grid grid-cols-3 gap-8 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
            <button key={n} onClick={async () => { if (n === 'C') setPin(pin.slice(0, -1)); else if (n === '✓') { if (pin.length >= 4) { await DB.addWalletTx(user.mobile, parseInt(amount)); setView('success'); } } else if (pin.length < 4) setPin(pin + n); }} className="h-12 font-black text-2xl active:bg-slate-50 rounded-full transition-colors">{n}</button>
          ))}
        </div>
      </div>
    );
    if (view === 'success') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce"><CheckCircle2 size={56} /></div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{getTranslation(language, 'success')}</h2>
        <p className="text-slate-400 font-bold mb-8">₹{amount} added to your Nidhi Wallet.</p>
        <button onClick={onClose} className="w-full max-w-sm bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl transition hover:bg-indigo-700 active:scale-95">Done</button>
      </div>
    );
  }

  if (type === 'education') {
    return (
      <div className="h-full flex flex-col p-4 animate-in slide-in-from-bottom-10">
        <header className="h-16 flex items-center gap-4 mb-6">
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ArrowLeft size={20} /></button>
          <h3 className="font-black text-indigo-900 tracking-tight">{getTranslation(language, 'education')}</h3>
        </header>
        <div className="flex-1 overflow-y-auto space-y-8 pb-10">
          <div className="grid grid-cols-1 gap-6">
            {educationVideos.map((video, idx) => (
              <div key={idx} className="card p-4 space-y-4 group">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xl relative">
                   <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.id}`} title={video.title} frameBorder="0" allowFullScreen className="transition-transform group-hover:scale-105 duration-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-800 leading-tight">{video.title}</h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom-10">
      <header className="h-16 border-b flex items-center px-4 gap-4 bg-white sticky top-0 z-10 shadow-sm">
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ArrowLeft size={20} /></button>
        <h3 className="font-black text-indigo-900 tracking-tight">{getTranslation(language, type)}</h3>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {chatLog.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}><div className={`p-4 rounded-2xl max-w-[85%] text-sm font-bold shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-700'}`}><FormattedText text={m.content} /></div></div>)}
        {isTyping && <div className="text-xs text-slate-400 font-black animate-pulse flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"/> Thinking...</div>}
      </div>
      <div className="p-4 bg-white border-t flex flex-col gap-3 shadow-2xl">
        <div className="flex gap-2">
          <button onClick={toggleListening} disabled={isTyping} className={`p-4 rounded-full transition-all relative ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'} ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}><Mic size={22} /></button>
          <input type="text" disabled={isTyping} placeholder={isTyping ? "..." : getTranslation(language, 'next')} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-500 transition-all disabled:opacity-50" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <button onClick={() => handleSend()} disabled={isTyping} className={`p-4 bg-indigo-600 text-white rounded-full shadow-lg transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50`}><Send size={22} /></button>
        </div>
      </div>
    </div>
  );
};

// --- Profile Screen Component ---
const ProfileScreen = ({ user, language, onBack, onLogout, onForgetMe }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <header className="flex items-center gap-4"><button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors"><ArrowLeft size={20} /></button><h2 className="text-xl font-black text-indigo-900 tracking-tight">{getTranslation(language, 'profile')}</h2></header>
      <div className="card p-6 flex items-center gap-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner"><User size={40} /></div>
        <div><h3 className="text-xl font-black text-slate-800">{user.name}</h3><p className="text-sm text-slate-500 font-bold">{user.mobile}</p></div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-3xl text-slate-700 font-black shadow-sm transition hover:bg-slate-50 active:scale-95"><LogOut size={20} className="text-indigo-600" /><span>{getTranslation(language, 'logout')}</span></button>
        <button onClick={onForgetMe} className="w-full flex items-center justify-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-3xl font-black shadow-sm transition border border-rose-100 hover:bg-rose-100 active:scale-95"><Trash2 size={20} /><span>{getTranslation(language, 'forgetMe')}</span></button>
      </div>
    </div>
  );
};

// --- App Root Component ---
const App = () => {
  const [screen, setScreen] = useState<'auth' | 'home' | 'profile' | 'loading'>('loading');
  const [subScreen, setSubScreen] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<Language>('English');
  const [balances, setBalances] = useState({ wallet: 0, logged: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ns_session_mobile');
    if (saved) {
      DB.getProfile(saved).then(p => {
        if (p) {
          setUser(p); setLanguage(p.language || 'English'); refreshBalances(p.mobile); setScreen('home');
        } else setScreen('auth');
      });
    } else setScreen('auth');
  }, []);

  const refreshBalances = async (mobile: string) => {
    const [w, l] = await Promise.all([DB.getWalletBalance(mobile), DB.getLoggedBalance(mobile)]);
    setBalances({ wallet: w, logged: l });
  };

  const handleLogin = (u: any) => {
    setUser(u); setLanguage(u.language || 'English');
    localStorage.setItem('ns_session_mobile', u.mobile);
    refreshBalances(u.mobile); setScreen('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('ns_session_mobile');
    setUser(null); setScreen('auth');
  };

  const handleForgetMe = async () => {
    if (user && window.confirm("Delete profile?")) {
      await DB.clearUserData(user.mobile);
      handleLogout();
    }
  };

  if (screen === 'loading') return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"/></div>;
  if (screen === 'auth') return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">NS</div><span className="font-black text-xl text-indigo-900 tracking-tighter uppercase">NidhiSahay</span></div>
        <div className="flex items-center gap-3"><button onClick={() => setSubScreen('add_money')} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black text-xs border border-indigo-100 transition-colors hover:bg-indigo-100">₹{balances.wallet}</button><button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"><Menu size={24} /></button></div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity duration-300" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-80 h-full bg-white p-8 animate-in slide-in-from-right shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black tracking-tighter uppercase">Settings</h2><button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all"><X /></button></div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={async () => { setLanguage(l); setIsMenuOpen(false); if(user) await DB.updateProfile(user.mobile, { language: l }); }} className={`p-3 rounded-2xl text-[10px] font-black border transition-all duration-200 ${language === l ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mt-20 p-4 max-w-lg mx-auto">
        {screen === 'home' && !subScreen && <Dashboard user={user} language={language} balances={balances} onSelectFeature={setSubScreen} />}
        {subScreen && <FeatureScreen type={subScreen} user={user} language={language} onClose={() => { setSubScreen(null); refreshBalances(user.mobile); }} />}
        {screen === 'profile' && <ProfileScreen user={user} language={language} onBack={() => setScreen('home')} onLogout={handleLogout} onForgetMe={handleForgetMe} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t flex items-center justify-around px-4 z-40 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => { setScreen('home'); setSubScreen(null); }} className={`flex flex-col items-center gap-1 transition-all duration-300 ${screen === 'home' && !subScreen ? 'text-indigo-600 scale-110 font-black' : 'text-slate-400'}`}><BarChart3 size={22} /><span className="text-[10px] font-black uppercase tracking-tight">HOME</span></button>
        <button onClick={() => setSubScreen('ai_chat')} className="p-3 -mt-10 bg-indigo-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:bg-indigo-700 active:scale-90 ring-4 ring-white"><Mic size={24}/></button>
        <button onClick={() => setScreen('profile')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${screen === 'profile' ? 'text-indigo-600 scale-110 font-black' : 'text-slate-400'}`}><User size={22} /><span className="text-[10px] font-black uppercase tracking-tight">PROFILE</span></button>
      </nav>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { createRoot(container).render(<App />); }
