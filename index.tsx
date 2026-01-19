
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
  Punjabi: { welcome: "ਨਿਧੀਸਹਾਇ", tagline: "ਤੁਹਾਡਾ ਵਿੱਤੀ AI ਏਜੰਟ", createAccount: "ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ", login: "ਲੌਗਇਨ", wallet: "ਬਕਾਇਆ", addMoney: "ਪੈਸੇ ਜੋੜੋ", loanEl: "ਕਰਜ਼ੇ ਦੀ ਪਾਤਰਤਾ", logActivity: "ਗਤੀਵਿਧੀ", education: "ਸਿੱਖਿਆ", logout: "ਲੌਗਆਉਟ", profile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ", success: "ਸਫਲ!" },
  Telugu: { welcome: "నిధిసహాయ్", tagline: "మీ ఆర్థిక AI ఏజెంట్", createAccount: "కొత్త ఖాతాను సృష్టించండి", login: "లాగిన్", wallet: "వాలెట్ బ్యాలెన్స్", addMoney: "డబ్బు జోడించండి", loanEl: "రుణ అర్హత", logActivity: "కార్యాచరణ", education: "విద్య", logout: "లాగ్అవుట్", profile: "నా ప్రొఫైల్", success: "విజయం!" },
  Kannada: { welcome: "ನಿಧಿಸಹಾಯ್", tagline: "ನಿಮ್ಮ ಹಣಕาสಿನ AI ಏಜೆಂಟ್", createAccount: "ಹೊಸ ಖಾತೆಯನ್ನು ರಚಿಸಿ", login: "ಲಾಗಿನ್", wallet: "ವ್ಯಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್", addMoney: "ಹಣ ಸೇರಿಸಿ", loanEl: "ಸಾಲದ ಅರ್ಹತೆ", logActivity: "ಚಟುವಟಿಕೆ", education: "ಶಿಕ್ಷಣ", logout: "ಲಾಗ್ಔಟ್", profile: "ನನ್ನ ಪ್ರೊಫೈಲ್", success: "ಯಶಸ್ವಿ!" },
  Tamil: { welcome: "நிதிசஹாய்", tagline: "உங்கள் நிதி AI முகவர்", createAccount: "புதிய கணக்கை உருவாக்கவும்", login: "உள்நுழை", wallet: "இருப்பு", addMoney: "பணம் சேர்க்க", loanEl: "கடன் தகுதி", logActivity: "செயல்பாடு", education: "கல்வி", logout: "வெளியேறு", profile: "எனது சுயవిவரம்", success: "வெற்றி!" },
  Malayalam: { welcome: "ನಿಧಿಸഹಾಯ್", tagline: "നിങ്ങളുടെ സാമ്പത്തിക AI ഏജന്റ്", createAccount: "പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക", login: "ലോഗിൻ", wallet: "ബാലൻസ്", addMoney: "പണം ചേർക്കുക", loanEl: "വായ്പാ യോഗ്യത", logActivity: "പ്രവർത്തനം", education: "വിദ്യാഭ്യാസം", logout: "ലോഗൗട്ട്", profile: "എന്റെ പ്രൊഫൈൽ", success: "വിജയം!" }
};

const getTranslation = (lang: Language, key: string): string => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.English;
  return dict[key] || TRANSLATIONS.English[key] || key;
};

// --- TTS Helper ---
const playVoice = async (text: string, lang: Language) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const voicePrompt = `IMPORTANT: Speak the following text clearly and naturally as a human in ${lang}: ${text}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: voicePrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: lang === 'English' ? 'Kore' : 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const decode = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      };

      const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
          }
        }
        return buffer;
      };

      const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (err) {
    console.error("Voice output failed:", err);
  }
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

// --- Auth Components ---
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

// --- Main Screens ---
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
        <button onClick={() => onSelectFeature('ai_chat')} className="w-full bg-white text-indigo-900 font-black py-4 rounded-xl shadow-lg">Start Conversation</button>
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

// --- Loan Flow Specification ---
const LOAN_QUESTIONS = [
  {
    category: "KYC",
    question: "Can you provide the PAN and Aadhaar details for all promoters, partners, or directors involved in the business?",
    expectedFormat: "Yes/No, details follow",
  },
  {
    category: "KYC",
    question: "Are the KYC documents for all stakeholders updated and linked to their current mobile numbers?",
    expectedFormat: "Yes/No",
  },
  {
    category: "Business Proof",
    question: "Is your business GST-registered, and are your filings up to date for the current financial year?",
    expectedFormat: "Yes/No",
  },
  {
    category: "Business Proof",
    question: "Do you have a valid Trade License or Certificate of Incorporation for this specific entity?",
    expectedFormat: "Yes/No",
  },
  {
    category: "Bank Statements",
    question: "Which bank holds your primary current account, and can you provide statements for the last 12 months?",
    expectedFormat: "Bank Name, Statement availability",
  },
  {
    category: "Bank Statements",
    question: "Does your bank statement reflect high-value transactions that align with your reported turnover?",
    expectedFormat: "Yes/No",
  },
  {
    category: "Income Proof (ITR)",
    question: "Have you consistently filed your Income Tax Returns (ITR) for the last three assessment years?",
    expectedFormat: "Yes/No, number of years",
  },
  {
    category: "Income Proof (ITR)",
    question: "What is the 'Net Taxable Income' shown in your latest ITR compared to your previous year's filing?",
    expectedFormat: "Growth/Decline, percentage or brief details",
  }
];

const FeatureScreen = ({ type, user, language, onClose }: any) => {
  const [view, setView] = useState('main');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loanJourneyIndex, setLoanJourneyIndex] = useState(-1);
  const [educationVideos, setEducationVideos] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (type === 'loan_eligibility') {
      startLoanFlow();
    } else if (type === 'education') {
      loadEducationRecommendations();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      const langMap: Record<string, string> = {
        'English': 'en-US', 'Hindi': 'hi-IN', 'Marathi': 'mr-IN', 'Telugu': 'te-IN',
        'Kannada': 'kn-IN', 'Tamil': 'ta-IN', 'Malayalam': 'ml-IN', 'Punjabi': 'pa-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) handleSend(transcript);
      };
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => recognitionRef.current?.stop();
  }, [type, language]);

  const toggleListening = () => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start();

  const startLoanFlow = async () => {
    setIsTyping(true);
    const firstQ = LOAN_QUESTIONS[0];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Translate this Loan Officer question into natural ${language}: "${firstQ.question}". 
    Add a polite greeting like "Hello, I am your Loan Officer. Let's check your eligibility."
    Make the question very direct and clear so the user knows exactly what to answer (e.g., provide hints like "Yes/No").`;
    
    const resp = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }]
    });
    
    setChatLog([{ role: 'assistant', content: resp.text || firstQ.question }]);
    setLoanJourneyIndex(0);
    setIsTyping(false);
  };

  const handleLoanJourneyStep = async (userMsg: string) => {
    setIsTyping(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const nextIndex = loanJourneyIndex + 1;

    let assistantResponse = "";

    if (nextIndex < LOAN_QUESTIONS.length) {
      const nextQ = LOAN_QUESTIONS[nextIndex];
      const nextPrompt = `Politely acknowledge the previous response in ${language}, then ask the next Loan Officer question clearly in ${language}: "${nextQ.question}".
      The question should be asked in a way where the user knows exactly what to answer (Expected format: ${nextQ.expectedFormat}).
      Do NOT provide any suggestions or feedback, ONLY ask the question.`;
      
      const nextResp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: nextPrompt }] }]
      });
      assistantResponse = nextResp.text || nextQ.question;
      setLoanJourneyIndex(nextIndex);
    } else {
      // End of flow: Recommend Schemes
      const summaryPrompt = `Based on a completed loan eligibility interview, recommend 2 relevant Government Loan Schemes (e.g., PM SVANidhi, Mudra).
      For each scheme, provide:
      1. Scheme Name
      2. Key Benefit
      3. A direct application link in a button format (e.g., Apply Now [URL]).
      Official links: PM SVANidhi (https://pmsvanidhi.mohua.gov.in/), MUDRA (https://www.mudra.org.in/).
      Respond strictly in ${language} using Markdown.`;
      
      const summaryResp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: summaryPrompt }] }]
      });
      assistantResponse = summaryResp.text || "You have completed the assessment. Visit PM SVANidhi for next steps.";
      setLoanJourneyIndex(-1);
    }

    setChatLog(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    setIsTyping(false);
  };

  const handleSend = async (msg: string = inputText) => {
    if (!msg.trim()) return;
    setChatLog(prev => [...prev, { role: 'user', content: msg }]);
    setInputText('');
    if (type === 'loan_eligibility') {
      handleLoanJourneyStep(msg);
      return;
    }
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (type === 'log_activity') {
        const prompt = `Parse transaction: "${msg}". Respond JSON: { "amount": <number>, "type": "income" | "expense", "category": "<string>", "description": "<string>" }. User Language: ${language}.`;
        const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ parts: [{ text: prompt }] }], config: { responseMimeType: "application/json" } });
        const parsed = JSON.parse(resp.text || '{}');
        if (parsed.amount) {
          await DB.addMoneyLog(user.mobile, parsed);
          const newBal = await DB.getLoggedBalance(user.mobile);
          const voicePrompt = `Confirm logging ${parsed.amount} as ${parsed.type} in ${language}. Total is ${newBal}.`;
          const voiceRes = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ parts: [{ text: voicePrompt }] }] });
          playVoice(voiceRes.text || `Logged ${parsed.amount}.`, language);
          setChatLog(prev => [...prev, { role: 'assistant', content: voiceRes.text || `Logged ₹${parsed.amount}.` }]);
        } else {
          setChatLog(prev => [...prev, { role: 'assistant', content: "Identify amount error." }]);
        }
      } else {
        const resp = await ai.models.generateContent({ 
          model: 'gemini-3-flash-preview', 
          contents: [{ parts: [{ text: msg }] }], 
          config: { systemInstruction: `You are Nidhi Assistant. Speak ONLY in ${language}.` } 
        });
        setChatLog(prev => [...prev, { role: 'assistant', content: resp.text }]);
        playVoice(resp.text || "...", language);
      }
    } catch (e) { console.error(e); } finally { setIsTyping(false); }
  };

  const loadEducationRecommendations = async () => {
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Recommend 3 specific growth videos for MSMEs in ${language}. Respond JSON: [{ "id": "youtube_id", "title": "...", "description": "..." }]`;
      const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ parts: [{ text: prompt }] }], config: { responseMimeType: "application/json" } });
      setEducationVideos(JSON.parse(resp.text || '[]'));
    } catch (e) { setEducationVideos([]); } finally { setIsTyping(false); }
  };

  if (type === 'add_money') {
    if (view === 'main') return (
      <div className="space-y-8 py-4 animate-in slide-in-from-bottom-4">
        <header className="flex items-center gap-4 px-2">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={20}/></button>
          <h3 className="font-black text-indigo-900">{getTranslation(language, 'addMoney')}</h3>
        </header>
        <div className="text-center"><p className="text-xs font-bold text-slate-400 mb-2 uppercase">Amount to Add</p><h2 className="text-6xl font-black text-indigo-900">₹{amount || '0'}</h2></div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
            <button key={n} onClick={() => { if (n === 'C') setAmount(amount.slice(0, -1)); else if (n === '✓') amount && setView('pin'); else if (amount.length < 6) setAmount(amount + n); }} className="h-16 bg-white border border-slate-100 rounded-2xl font-black text-xl shadow-sm active:bg-slate-100 transition">{n}</button>
          ))}
        </div>
      </div>
    );
    if (view === 'pin') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 animate-in zoom-in-95">
        <h2 className="text-2xl font-black text-slate-800 mb-8">Enter UPI PIN</h2>
        <div className="flex gap-4 mb-12">{[1, 2, 3, 4].map(i => <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length >= i ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`} />)}</div>
        <div className="grid grid-cols-3 gap-8 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
            <button key={n} onClick={async () => { if (n === 'C') setPin(pin.slice(0, -1)); else if (n === '✓') { if (pin.length >= 4) { 
              await DB.addWalletTx(user.mobile, parseInt(amount)); 
              const newBal = await DB.getWalletBalance(user.mobile);
              const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
              const voiceRes = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ parts: [{ text: `Confirm adding ${amount} to wallet in ${language}.` }] }] });
              playVoice(voiceRes.text || `Added ${amount}.`, language);
              setView('success'); 
            } } else if (pin.length < 4) setPin(pin + n); }} className="h-12 font-black text-2xl active:bg-slate-50 rounded-full transition">{n}</button>
          ))}
        </div>
      </div>
    );
    if (view === 'success') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl"><CheckCircle2 size={56} /></div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">{getTranslation(language, 'success')}</h2>
        <p className="text-slate-400 font-bold mb-8">₹{amount} added to your Nidhi Wallet.</p>
        <button onClick={onClose} className="w-full max-w-sm bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl">Done</button>
      </div>
    );
  }

  if (type === 'education') {
    return (
      <div className="h-full flex flex-col p-4 animate-in slide-in-from-bottom-10">
        <header className="h-16 flex items-center gap-4 mb-6">
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition"><ArrowLeft size={20} /></button>
          <h3 className="font-black text-indigo-900">{getTranslation(language, 'education')}</h3>
        </header>
        <div className="flex-1 overflow-y-auto space-y-8 pb-10">
          <div className="grid grid-cols-1 gap-6">
            {educationVideos.map((video, idx) => (
              <div key={idx} className="card p-4 space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
                   <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.id}`} title={video.title} frameBorder="0" allowFullScreen />
                </div>
                <h4 className="font-black text-slate-800">{video.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{video.description}</p>
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
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition"><ArrowLeft size={20} /></button>
        <h3 className="font-black text-indigo-900">{getTranslation(language, type)}</h3>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {chatLog.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}><div className={`p-4 rounded-2xl max-w-[85%] text-sm font-bold shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-700'}`}><FormattedText text={m.content} /></div></div>)}
        {isTyping && <div className="text-xs text-slate-400 font-black animate-pulse flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"/> Thinking...</div>}
      </div>
      <div className="p-4 bg-white border-t flex flex-col gap-3 shadow-2xl">
        <div className="flex gap-2">
          <button onClick={toggleListening} className={`p-4 rounded-full transition relative ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}><Mic size={22} /></button>
          <input type="text" placeholder={getTranslation(language, 'next')} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-500 transition" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <button onClick={() => handleSend()} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg transition"><Send size={22} /></button>
        </div>
      </div>
    </div>
  );
};

// --- Profile Screen Component ---
const ProfileScreen = ({ user, language, onBack, onLogout, onForgetMe }: any) => {
  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <header className="flex items-center gap-4"><button onClick={onBack} className="p-2 hover:bg-white rounded-full"><ArrowLeft size={20} /></button><h2 className="text-xl font-black text-indigo-900">{getTranslation(language, 'profile')}</h2></header>
      <div className="card p-6 flex items-center gap-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner"><User size={32} /></div>
        <div><h3 className="text-lg font-black text-slate-800">{user.name}</h3><p className="text-sm text-slate-500 font-bold">{user.mobile}</p></div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-3xl text-slate-700 font-black shadow-sm transition hover:bg-slate-50"><LogOut size={20} className="text-indigo-600" /><span>{getTranslation(language, 'logout')}</span></button>
        <button onClick={onForgetMe} className="w-full flex items-center justify-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-3xl font-black shadow-sm transition border border-rose-100 hover:bg-rose-100"><Trash2 size={20} /><span>{getTranslation(language, 'forgetMe')}</span></button>
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
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">NS</div><span className="font-black text-xl text-indigo-900">NidhiSahay</span></div>
        <div className="flex items-center gap-3"><button onClick={() => setSubScreen('add_money')} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black text-xs">₹{balances.wallet}</button><button onClick={() => setIsMenuOpen(true)} className="p-2"><Menu size={24} /></button></div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-[100]" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-80 h-full bg-white p-8 animate-in slide-in-from-right" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black">Settings</h2><button onClick={() => setIsMenuOpen(false)}><X /></button></div>
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase">Language</p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(l => (
                  <button key={l} onClick={async () => { setLanguage(l); setIsMenuOpen(false); if(user) await DB.updateProfile(user.mobile, { language: l }); }} className={`p-3 rounded-2xl text-[10px] font-black border ${language === l ? 'bg-indigo-600 text-white' : 'bg-white'}`}>{l}</button>
                ))}
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

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-4 z-40">
        <button onClick={() => { setScreen('home'); setSubScreen(null); }} className={`flex flex-col items-center gap-1 ${screen === 'home' && !subScreen ? 'text-indigo-600' : 'text-slate-400'}`}><BarChart3 size={22} /><span className="text-[10px] font-black">HOME</span></button>
        <button onClick={() => setSubScreen('ai_chat')} className="p-3 -mt-8 bg-indigo-600 text-white rounded-full shadow-lg"><Mic size={24}/></button>
        <button onClick={() => setScreen('profile')} className={`flex flex-col items-center gap-1 ${screen === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}><User size={22} /><span className="text-[10px] font-black">PROFILE</span></button>
      </nav>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { createRoot(container).render(<App />); }
