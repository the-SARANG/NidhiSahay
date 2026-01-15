
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ChevronRight,
  Upload,
  Trophy,
  X,
  Smartphone,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  PlayCircle,
  Clock,
  Settings,
  ShieldCheck,
  Languages,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types & Constants ---

type Language = 'English' | 'Hindi' | 'Marathi' | 'Punjabi' | 'Telugu' | 'Kannada' | 'Tamil' | 'Malayalam';

const LANGUAGES: Language[] = [
  'English', 'Hindi', 'Marathi', 'Punjabi', 'Telugu', 'Kannada', 'Tamil', 'Malayalam'
];

const TRANSLATIONS: Record<Language, any> = {
  English: {
    welcome: "NidhiSahay",
    createAccount: "Create New Account",
    login: "Login",
    name: "Full Name",
    mobile: "Mobile Number",
    consent: "By checking this box means you agree to AI agent to track the information and actions performed by the user.",
    setMpin: "Set mPIN",
    confirmMpin: "Confirm mPIN",
    enterMpin: "Enter mPIN",
    wallet: "Wallet",
    totalLogged: "Logged Activity",
    savingTip: "Saving Tip",
    addMoney: "Add Money",
    loanEl: "Loan & Application",
    logActivity: "Log Money Activity",
    education: "Learning Center",
    profile: "My Profile",
    logout: "Logout",
    forgetMe: "Forget Me",
    changeLang: "Change Language",
    savingTarget: "Daily Saving Target",
    userLevel: "User Level",
    streak: "Streak",
    reward: "Daily Reward",
    helpful: "Was this helpful?",
    uploadDoc: "Upload Doc",
    enterPin: "Enter UPI PIN",
    success: "Transaction Successful",
    discipline: "Discipline Level",
    chatPlaceholder: "Ask me anything about finance...",
    loanChatPlaceholder: "Describe your business or ask about eligibility...",
    activityChatPlaceholder: "e.g., 'Rs. 50 received from Friend' or 'Spent 20 on Tea'",
    yes: "Yes, Erase Data",
    no: "No, Cancel",
    forgetConfirm: "Are you sure you want to Erase your Data? All your progress and saved information will be lost forever."
  },
  Hindi: {
    welcome: "निधिसहाय",
    createAccount: "नया खाता बनाएं",
    login: "लॉगिन",
    name: "पूरा नाम",
    mobile: "मोबाइल नंबर",
    consent: "इस बॉक्स को चेक करने का अर्थ है कि आप उपयोगकर्ता द्वारा की गई जानकारी और कार्यों को ट्रैक करने के लिए एआई एजेंट से सहमत हैं।",
    setMpin: "एमपिन सेट करें",
    confirmMpin: "एमपिन की पुष्टि करें",
    enterMpin: "एमपिन दर्ज करें",
    wallet: "वॉलेट",
    totalLogged: "लॉग की गई गतिविधि",
    savingTip: "बचत टिप",
    addMoney: "पैसे जोड़ें",
    loanEl: "ऋण और आवेदन",
    logActivity: "पैसों की गतिविधि दर्ज करें",
    education: "शिक्षा केंद्र",
    profile: "मेरी प्रोफ़ाइल",
    logout: "लॉगआउट",
    forgetMe: "मुझे भूल जाएं",
    changeLang: "भाषा बदलें",
    savingTarget: "दैनिक बचत लक्ष्य",
    userLevel: "उपयोगकर्ता स्तर",
    streak: "लगातार दिन",
    reward: "दैनिक पुरस्कार",
    helpful: "क्या यह मददगार था?",
    uploadDoc: "दस्तावेज़ अपलोड",
    enterPin: "यूपीआई पिन दर्ज करें",
    success: "लेनदेन सफल",
    discipline: "अनुशासन स्तर",
    chatPlaceholder: "मुझसे वित्त के बारे में कुछ भी पूछें...",
    loanChatPlaceholder: "अपने व्यवसाय का वर्णन करें या पात्रता के बारे में पूछें...",
    activityChatPlaceholder: "जैसे, 'दोस्त से 50 रुपये मिले' या 'चाय पर 20 खर्च किए'",
    yes: "हाँ, डेटा मिटाएं",
    no: "नहीं, रद्द करें",
    forgetConfirm: "क्या आप वाकई अपना डेटा मिटाना चाहते हैं? आपकी सभी प्रगति और सहेजी गई जानकारी हमेशा के लिए खो जाएगी।"
  },
  Marathi: { welcome: "निधिसहाय", createAccount: "नवीन खाते तयार करा", login: "लॉगिन", forgetConfirm: "तुम्हाला तुमची माहिती पुसून टाकायची आहे याची खात्री आहे का?" },
  Punjabi: { welcome: "ਨਿਧੀਸਹਾਏ", createAccount: "ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ", login: "ਲੌਗਇਨ", forgetConfirm: "ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਜਾਣਕਾਰੀ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?" },
  Telugu: { welcome: "నిధిసహాయ్", createAccount: "కొత్త ఖాతాను సృష్టించండి", login: "లాగిన్", forgetConfirm: "మీరు మీ సమాచారాన్ని తుడిచివేయాలనుకుంటున్నారా?" },
  Kannada: { welcome: "ನಿಧಿಸಹಾಯ್", createAccount: "ಹೊಸ ಖಾತೆಯನ್ನು ರಚಿಸಿ", login: "ಲಾಗಿನ್", forgetConfirm: "ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?" },
  Tamil: { welcome: "நிதிசஹாய்", createAccount: "புதிய கணக்கை உருவாக்கவும்", login: "உள்நுழை", forgetConfirm: "உங்கள் தகவலை அழிக்க விரும்புகிறீர்களா?" },
  Malayalam: { welcome: "നിധിസഹായ്", createAccount: "പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക", login: "ലോഗിൻ", forgetConfirm: "നിങ്ങളുടെ വിവരങ്ങൾ മായ്ക്കാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുണ്ടോ?" }
};

const getTranslation = (lang: Language, key: string): string => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.English;
  return dict[key] || TRANSLATIONS.English[key] || key;
};

// --- Helper for AI Text Formatting ---

const FormattedText = ({ text, className }: { text: string, className?: string }) => {
  const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|^\s*[-*]\s.*$)/m);
  
  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {segments.map((segment, i) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return <strong key={i} className="font-extrabold text-slate-900">{segment.slice(2, -2)}</strong>;
        }
        if (segment.startsWith('*') && segment.endsWith('*')) {
          return <em key={i} className="font-semibold italic text-slate-800">{segment.slice(1, -1)}</em>;
        }
        if (/^\s*[-*]\s/.test(segment)) {
          return <div key={i} className="pl-4 my-2 flex items-start">
            <span className="mr-2 text-indigo-500 font-bold">•</span>
            <span className="text-slate-700">{segment.replace(/^\s*[-*]\s/, '')}</span>
          </div>;
        }
        return <span key={i} className="text-slate-700">{segment}</span>;
      })}
    </div>
  );
};

// --- Mock Database (LocalStorage) ---

const DB = {
  getUsers: () => JSON.parse(localStorage.getItem('ns_users') || '[]'),
  saveUser: (user: any) => {
    const users = DB.getUsers();
    const newUser = { ...user, signupTiming: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('ns_users', JSON.stringify(users));
    return newUser;
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem('ns_current_user') || 'null'),
  setCurrentUser: (user: any) => localStorage.setItem('ns_current_user', JSON.stringify(user)),
  
  getWalletTxs: (mobile: string) => JSON.parse(localStorage.getItem(`ns_wallet_txs_${mobile}`) || '[]'),
  addWalletTx: (mobile: string, tx: any) => {
    const txs = DB.getWalletTxs(mobile);
    txs.push({ ...tx, date: new Date().toISOString() });
    localStorage.setItem(`ns_wallet_txs_${mobile}`, JSON.stringify(txs));
  },
  
  getActivityLogs: (mobile: string) => JSON.parse(localStorage.getItem(`ns_activity_logs_${mobile}`) || '[]'),
  addActivityLog: (mobile: string, log: any) => {
    const logs = DB.getActivityLogs(mobile);
    logs.push({ ...log, date: new Date().toISOString() });
    localStorage.setItem(`ns_activity_logs_${mobile}`, JSON.stringify(logs));
  },

  getLoginLogs: (mobile: string) => JSON.parse(localStorage.getItem(`ns_login_logs_${mobile}`) || '[]'),
  addLoginLog: (user: any) => {
    const logs = DB.getLoginLogs(user.mobile);
    logs.push({ 
      name: user.name, 
      mobile: user.mobile, 
      date: new Date().toISOString(), 
      languagePreference: user.language 
    });
    localStorage.setItem(`ns_login_logs_${user.mobile}`, JSON.stringify(logs));
  },

  getLoanData: (mobile: string) => JSON.parse(localStorage.getItem(`ns_loan_data_${mobile}`) || '[]'),
  saveLoanData: (mobile: string, data: any) => {
    const loans = DB.getLoanData(mobile);
    loans.push({ ...data, date: new Date().toISOString() });
    localStorage.setItem(`ns_loan_data_${mobile}`, JSON.stringify(loans));
  },

  getTargetMeets: (mobile: string) => JSON.parse(localStorage.getItem(`ns_target_meets_${mobile}`) || '[]'),
  saveTargetMeet: (mobile: string, targetValue: number, savedToday: number) => {
    const meets = DB.getTargetMeets(mobile);
    meets.push({ date: new Date().toISOString().split('T')[0], targetValue, savedToday, timestamp: new Date().toISOString() });
    localStorage.setItem(`ns_target_meets_${mobile}`, JSON.stringify(meets));
  },

  clearUserData: (mobile: string) => {
    const keys = [
      `ns_wallet_txs_${mobile}`, `ns_activity_logs_${mobile}`, 
      `ns_login_logs_${mobile}`, `ns_loan_data_${mobile}`, `ns_target_meets_${mobile}`
    ];
    keys.forEach(k => localStorage.removeItem(k));
    const users = DB.getUsers().filter((u: any) => u.mobile !== mobile);
    localStorage.setItem('ns_users', JSON.stringify(users));
    localStorage.removeItem('ns_current_user');
  }
};

// --- Custom Modal Component ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

// --- App Components ---

const AuthScreen = ({ onLogin }: { onLogin: (user: any, lang: Language) => void }) => {
  const [mode, setMode] = useState<'landing' | 'signup' | 'login' | 'mpin' | 'confirm_mpin'>('landing');
  const [formData, setFormData] = useState({ name: '', mobile: '', mpin: '', confirmMpin: '', consent: false });
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>('English');

  const handleSignup = () => {
    if (!formData.name || !formData.mobile || !formData.consent) {
      setError('Required fields missing.'); return;
    }
    setMode('mpin');
  };

  const finalizeSignup = () => {
    if (formData.mpin !== formData.confirmMpin) {
      setError('mPINs mismatch.'); return;
    }
    const newUser = { 
      mobile: formData.mobile, 
      name: formData.name, 
      mpin: formData.mpin, 
      language: selectedLang,
      streak: 0,
      level: 1,
      target: 100,
      levelPoints: 0
    };
    const saved = DB.saveUser(newUser);
    DB.setCurrentUser(saved);
    onLogin(saved, selectedLang);
  };

  const handleLogin = () => {
    const users = DB.getUsers();
    const foundUser = users.find((u: any) => u.mobile === formData.mobile && u.mpin === formData.mpin);
    if (foundUser) {
      DB.setCurrentUser(foundUser);
      onLogin(foundUser, foundUser.language || 'English');
    } else {
      setError('Invalid mobile or mPIN.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mb-4 mx-auto shadow-2xl shadow-indigo-100">NS</div>
        <h1 className="text-4xl font-black text-indigo-900 tracking-tight">NidhiSahay</h1>
        <p className="text-slate-400 font-medium text-sm mt-1">Smart Financial Agent for Bharat</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {mode === 'landing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2 mb-2">
              {LANGUAGES.map(l => (
                <button key={l} onClick={() => setSelectedLang(l)} className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedLang === l ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-200'}`}>{l}</button>
              ))}
            </div>
            <button onClick={() => setMode('signup')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-3xl shadow-xl shadow-indigo-100 active:scale-95 transition">{getTranslation(selectedLang, 'createAccount')}</button>
            <button onClick={() => setMode('login')} className="w-full border-2 border-slate-100 text-slate-700 font-bold py-4 rounded-3xl hover:bg-slate-50 active:scale-95 transition">{getTranslation(selectedLang, 'login')}</button>
          </div>
        )}

        {mode === 'signup' && (
          <div className="space-y-4">
            <input type="text" placeholder={getTranslation(selectedLang, 'name')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="tel" placeholder={getTranslation(selectedLang, 'mobile')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-start">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded text-indigo-600" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} />
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">{getTranslation(selectedLang, 'consent')}</p>
            </div>
            <button onClick={handleSignup} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-3xl shadow-lg">Next</button>
            <button onClick={() => setMode('landing')} className="w-full text-slate-400 font-bold py-2 text-sm">Cancel</button>
          </div>
        )}

        {mode === 'login' && (
          <div className="space-y-4">
            <input type="tel" placeholder={getTranslation(selectedLang, 'mobile')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <input type="password" placeholder={getTranslation(selectedLang, 'enterMpin')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.mpin} onChange={e => setFormData({...formData, mpin: e.target.value})} />
            <button onClick={handleLogin} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-3xl shadow-lg">Login</button>
            <button onClick={() => setMode('landing')} className="w-full text-slate-400 font-bold py-2 text-sm">Back</button>
          </div>
        )}

        {(mode === 'mpin' || mode === 'confirm_mpin') && (
          <div className="space-y-8 text-center py-4">
            <h2 className="text-2xl font-black text-slate-800">{getTranslation(selectedLang, mode === 'mpin' ? 'setMpin' : 'confirmMpin')}</h2>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${ (mode === 'mpin' ? formData.mpin : formData.confirmMpin).length >= i ? 'bg-indigo-600 border-indigo-600 scale-110' : 'bg-white border-slate-200'}`} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
                <button key={n} onClick={() => {
                  const key = mode === 'mpin' ? 'mpin' : 'confirmMpin';
                  const val = formData[key];
                  if (n === 'C') setFormData({ ...formData, [key]: val.slice(0, -1) });
                  else if (n === '✓') {
                    if (val.length === 4) mode === 'mpin' ? setMode('confirm_mpin') : finalizeSignup();
                  } else if (val.length < 4) setFormData({ ...formData, [key]: val + String(n) });
                }} className="h-16 bg-slate-50 flex items-center justify-center font-black text-xl rounded-2xl active:bg-slate-200 active:scale-95 transition shadow-sm">{n}</button>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-rose-500 text-xs text-center font-bold bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, label, desc, onClick, color }: any) => (
  <button onClick={onClick} className={`${color} p-6 rounded-[2.5rem] flex flex-col items-center gap-3 transition active:scale-95 hover:shadow-md border border-black/5 group`}>
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
      {icon}
    </div>
    <div className="text-center">
      <span className="text-sm font-black text-slate-800 block">{label}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{desc}</span>
    </div>
  </button>
);

const AITip = ({ language }: { language: Language }) => {
  const [tip, setTip] = useState('Generating a fresh financial tip for you...');
  const [feedback, setFeedback] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a single short financial saving tip for a lower-income worker in India in ${language}. motivational, rational. Max 15 words.`
      });
      setTip(resp.text || tip);
    };
    fetchTip();
  }, [language]);

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 animate-in fade-in slide-in-from-left-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(language, 'savingTip')}</h4>
        <div className="flex gap-2 bg-slate-50 p-1 rounded-full">
          <button onClick={() => setFeedback(true)} className={`p-1.5 rounded-full transition ${feedback === true ? 'bg-emerald-100 text-emerald-600' : 'text-slate-300'}`}><ThumbsUp size={14} /></button>
          <button onClick={() => setFeedback(false)} className={`p-1.5 rounded-full transition ${feedback === false ? 'bg-rose-100 text-rose-600' : 'text-slate-300'}`}><ThumbsDown size={14} /></button>
        </div>
      </div>
      <p className="text-slate-700 font-bold leading-relaxed italic text-sm">"{tip}"</p>
    </div>
  );
};

const Dashboard = ({ user, language, walletBalance, totalLogged, onSelectFeature }: any) => {
  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 group transition hover:border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Wallet size={14} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(language, 'wallet')}</p>
          </div>
          <p className="text-2xl font-black text-indigo-900">₹{walletBalance}</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 group transition hover:border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><BarChart3 size={14} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(language, 'totalLogged')}</p>
          </div>
          <p className={`text-2xl font-black ${totalLogged >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>₹{totalLogged}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-[2.5rem] p-7 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2 flex items-center gap-2">
            <ShieldCheck size={22} className="text-indigo-300" />
            Nidhi AI Assistant
          </h3>
          <p className="text-indigo-100/80 text-xs mb-6 leading-relaxed font-medium">
            Your personal finance guide. Ask me about loans, savings, or schemes in your language.
          </p>
          <button 
            onClick={() => onSelectFeature('ai_chat')}
            className="w-full bg-white text-indigo-900 font-black py-4 rounded-3xl flex items-center justify-center gap-3 shadow-lg shadow-black/20 group-hover:bg-indigo-50 transition active:scale-95"
          >
            <Mic size={20} className="text-indigo-600" />
            Talk to Assistant
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl transition group-hover:scale-125" />
      </div>

      <AITip language={language} />

      <div className="grid grid-cols-2 gap-4">
        <FeatureCard 
          icon={<Plus className="text-blue-600" size={24} />} 
          label={getTranslation(language, 'addMoney')} 
          desc="Top-up Wallet"
          onClick={() => onSelectFeature('add_money')} 
          color="bg-blue-50" 
        />
        <FeatureCard 
          icon={<FileText className="text-purple-600" size={24} />} 
          label={getTranslation(language, 'loanEl')} 
          desc="Apply for Loan"
          onClick={() => onSelectFeature('loan_eligibility')} 
          color="bg-purple-50" 
        />
        <FeatureCard 
          icon={<BarChart3 className="text-orange-600" size={24} />} 
          label={getTranslation(language, 'logActivity')} 
          desc="Track Expenses"
          onClick={() => onSelectFeature('log_activity')} 
          color="bg-orange-50" 
        />
        <FeatureCard 
          icon={<BookOpen className="text-emerald-600" size={24} />} 
          label={getTranslation(language, 'education')} 
          desc="Learn Finance"
          onClick={() => onSelectFeature('education')} 
          color="bg-emerald-50" 
        />
      </div>
    </div>
  );
};

const FeatureScreen = ({ type, user, language, onClose }: any) => {
  const [view, setView] = useState('main');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = getLangCode(language);
      recognitionRef.current.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }

    if (type === 'loan_eligibility' && chatLog.length === 0) {
      setTimeout(() => {
        handleSend("I need a loan for my business");
      }, 500);
    }
  }, [language, type]);

  const getLangCode = (l: Language) => {
    const codes: any = { English: 'en-IN', Hindi: 'hi-IN', Marathi: 'mr-IN', Punjabi: 'pa-IN', Telugu: 'te-IN', Kannada: 'kn-IN', Tamil: 'ta-IN', Malayalam: 'ml-IN' };
    return codes[l] || 'en-IN';
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;
    setChatLog(prev => [...prev, { role: 'user', content: text }]);
    setInputText('');
    setIsTyping(true);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      if (type === 'log_activity') {
        const systemPrompt = `You are a financial transaction parser for underserved workers in India. 
        Extract transaction details from natural language input in ${language}.
        Always return ONLY valid JSON: {"amount": number, "type": "income" | "expense", "category": string, "description": string}`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: text,
          config: { systemInstruction: systemPrompt }
        });
        
        const jsonMatch = resp.text?.match(/\{.*\}/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          DB.addActivityLog(user.mobile, parsed);
          setChatLog(prev => [...prev, { role: 'assistant', content: `**Logged Activity:** ₹${parsed.amount} as *${parsed.type}* for ${parsed.category}.` }]);
        } else {
          setChatLog(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't quite parse that. Try saying something like 'Spent 50 on Tea'." }]);
        }
      } else if (type === 'loan_eligibility') {
        const activityLogs = DB.getActivityLogs(user.mobile);
        const systemPrompt = `You are Nidhi Agent guiding a borrower through their loan journey.
        FLOW TO FOLLOW:
        1. Greet and start the journey.
        2. Ask Eligibility Questions (Business Type, Udyam, PAN, Transaction method).
        3. Save data and process (Analyze profile against MUDRA, PM SVAnidhi).
        4. Display Scheme list.
        5. Ask which scheme to know more about.
        6. Display details (Terms, Eligibility, Portal link like janasamarth.in).
        7. Ask if user wants step-by-step guidance.
        8. Provide steps or helpful end.
        
        Current Language: ${language}.
        User Context: ${JSON.stringify(user)}. 
        Activity Summary: ${activityLogs.length} logged transactions.
        
        Rules:
        - Use **bold** for emphasis.
        - Use *italic* for secondary info.
        - Use bullet points for lists.
        - Be professional but empathetic.`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Conversation History: ${JSON.stringify(chatLog)}. Latest user input: "${text}"`,
          config: { systemInstruction: systemPrompt }
        });
        setChatLog(prev => [...prev, { role: 'assistant', content: resp.text }]);
        
        if (text.toLowerCase().includes('udyam') || text.toLowerCase().includes('pan')) {
           DB.saveLoanData(user.mobile, { snippet: text });
        }
      } else {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: text,
          config: { systemInstruction: `You are Nidhi Assistant. Help with finance tips in ${language}. Use **bold** and bullet points.` }
        });
        setChatLog(prev => [...prev, { role: 'assistant', content: resp.text }]);
      }
    } catch (e) {
      setChatLog(prev => [...prev, { role: 'assistant', content: "I encountered a connection error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (type === 'education') {
    const activityLogs = DB.getActivityLogs(user.mobile);
    const loanLogs = DB.getLoanData(user.mobile);
    const walletTxs = DB.getWalletTxs(user.mobile);

    const hasManyExpenses = activityLogs.filter(l => l.type === 'expense').length > 3;
    const hasUdyamInterests = loanLogs.some(l => l.snippet?.toLowerCase().includes('udyam'));
    const lowWalletBalance = walletTxs.reduce((a:number, t:any) => a + t.amount, 0) < 500;
    
    const videos = [
      { id: 1, title: 'Budgeting 101: Track Every Rupee', desc: 'Stop your money from leaking away.', cat: 'Budgeting', trigger: hasManyExpenses },
      { id: 2, title: 'Udyam Registration Benefits', desc: 'Get MSME perks from Govt.', cat: 'Business', trigger: hasUdyamInterests },
      { id: 3, title: 'Micro-Savings Strategies', desc: 'Grow your money even with ₹10.', cat: 'Savings', trigger: lowWalletBalance },
      { id: 4, title: 'Emergency Fund Basics', desc: 'Protect your family in crisis.', cat: 'Security', trigger: true }
    ];

    const recommended = videos.filter(v => v.trigger).slice(0, 3);

    return (
      <div className="h-full space-y-6 animate-in slide-in-from-right-4 duration-300">
        <header className="flex items-center gap-4 py-2 border-b border-slate-100 sticky top-0 bg-slate-50 z-10">
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-black text-slate-800">{getTranslation(language, 'education')}</h2>
        </header>
        <div className="space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended for {user.name}</p>
          {recommended.map(v => (
            <div key={v.id} className="bg-white p-5 rounded-[2rem] flex items-center gap-4 shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm"><PlayCircle size={32} /></div>
              <div className="flex-1">
                <h4 className="font-black text-sm text-slate-800">{v.title}</h4>
                <p className="text-xs text-slate-500 font-medium mb-1">{v.desc}</p>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-black uppercase">{v.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'add_money') {
    if (view === 'main') return (
      <div className="space-y-8 animate-in slide-in-from-bottom-6">
        <header className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-black text-slate-800">{getTranslation(language, 'addMoney')}</h2>
        </header>
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enter Amount</p>
            <div className="text-6xl font-black text-indigo-900 tabular-nums">₹{amount || '0'}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
              <button key={n} onClick={() => {
                if (n === 'C') setAmount(amount.slice(0, -1));
                else if (n === '✓') amount && setView('upi_pin');
                else if (amount.length < 6) setAmount(amount + String(n));
              }} className="h-16 bg-white border border-slate-100 rounded-[1.5rem] font-black text-xl shadow-sm active:bg-slate-50 active:scale-95 transition">{n}</button>
            ))}
          </div>
        </div>
      </div>
    );
    if (view === 'upi_pin') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
        <h2 className="text-2xl font-black text-slate-800 mb-2">{getTranslation(language, 'enterPin')}</h2>
        <div className="flex gap-4 mb-16">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length >= i ? 'bg-indigo-600 border-indigo-600 scale-110' : 'bg-white border-slate-200'}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
            <button key={n} onClick={() => {
              if (n === 'C') setPin(pin.slice(0, -1));
              else if (n === '✓') {
                if (pin.length >= 4) {
                  DB.addWalletTx(user.mobile, { amount: parseInt(amount), type: 'credit' });
                  setView('success');
                }
              } else if (pin.length < 6) setPin(pin + String(n));
            }} className="h-14 font-black text-2xl active:bg-slate-50 rounded-full transition">{n}</button>
          ))}
        </div>
      </div>
    );
    if (view === 'success') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-110 duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 scale-110 shadow-lg shadow-emerald-50">
          <CheckCircle2 size={56} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">{getTranslation(language, 'success')}!</h2>
        <button onClick={onClose} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl mt-8 transition active:scale-95">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[50] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
      <header className="h-16 border-b flex items-center px-4 gap-4 bg-white sticky top-0 z-10">
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h3 className="font-black text-slate-800">{getTranslation(language, type)}</h3>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {chatLog.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
            <div className={`p-4 rounded-[1.5rem] max-w-[85%] shadow-sm text-sm font-bold ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-700'}`}>
              <FormattedText text={msg.content} />
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-slate-400 font-black px-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
          Assistant is typing...
        </div>}
      </div>
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <button onClick={() => { setIsListening(true); recognitionRef.current?.start(); }} className={`p-4 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><Mic size={22} /></button>
        <input type="text" placeholder="Type here..." className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 outline-none text-sm font-bold" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
        <button onClick={() => handleSend()} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition">
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

const ProfileScreen = ({ user, language, onBack, onLogout, onForgetMe }: any) => {
  const [target, setTarget] = useState(user.target || 100);
  const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);
  const walletTxs = DB.getWalletTxs(user.mobile);
  const today = new Date().toISOString().split('T')[0];
  const todaySavings = walletTxs.filter((t: any) => t.date.startsWith(today)).reduce((acc: number, t: any) => acc + (t.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-black text-slate-800">{getTranslation(language, 'profile')}</h2>
      </header>

      <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group">
        <div className="w-20 h-20 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-4 mx-auto border-4 border-white shadow-lg transition-transform group-hover:scale-110 duration-500"><Trophy size={40} /></div>
        <h3 className="text-xl font-black text-slate-800">Streak: {user.streak || 0} Days</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Level {user.level || 1} Saver</p>
      </div>

      <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div className="flex justify-between items-center">
          <span className="font-black text-slate-800">{getTranslation(language, 'savingTarget')}</span>
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl">
            <button onClick={() => setTarget((t: number) => Math.max(0, t - 10))} className="w-10 h-10 bg-white shadow-sm rounded-xl font-black hover:bg-slate-50 transition active:scale-90">-</button>
            <span className="font-black px-2">₹{target}</span>
            <button onClick={() => setTarget((t: number) => t + 10)} className="w-10 h-10 bg-white shadow-sm rounded-xl font-black hover:bg-slate-50 transition active:scale-90">+</button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="text-[11px] font-black text-slate-400 uppercase">Today's Progress</div>
            <div className="text-sm font-black text-indigo-600 tabular-nums">₹{todaySavings} / ₹{target}</div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (todaySavings / target) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-[2rem] text-slate-700 font-black hover:bg-slate-50 transition active:scale-95 shadow-sm"
        >
          <LogOut size={20} className="text-indigo-600" />
          <span>{getTranslation(language, 'logout')}</span>
        </button>
        <button 
          onClick={() => setIsForgetModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black hover:bg-rose-100 transition active:scale-95 border border-rose-100/50 shadow-sm"
        >
          <Trash2 size={20} />
          <span>{getTranslation(language, 'forgetMe')}</span>
        </button>
      </div>

      <Modal 
        isOpen={isForgetModalOpen} 
        onClose={() => setIsForgetModalOpen(false)} 
        title="Erase Data?"
      >
        <div className="space-y-6">
          <div className="flex gap-4 p-4 bg-rose-50 rounded-2xl text-rose-600 items-start">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-bold leading-relaxed">{getTranslation(language, 'forgetConfirm')}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => { onForgetMe(); setIsForgetModalOpen(false); }}
              className="p-4 bg-rose-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-rose-100 transition active:scale-95"
            >
              {getTranslation(language, 'yes')}
            </button>
            <button 
              onClick={() => setIsForgetModalOpen(false)}
              className="p-4 bg-slate-100 text-slate-700 rounded-[1.5rem] font-black transition active:scale-95"
            >
              {getTranslation(language, 'no')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const App = () => {
  const [screen, setScreen] = useState<'auth' | 'home' | 'profile'>('auth');
  const [subScreen, setSubScreen] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<Language>('English');
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalLogged, setTotalLogged] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = DB.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setLanguage(savedUser.language || 'English');
      setScreen('home');
      refreshBalances(savedUser.mobile);
    }
  }, []);

  const refreshBalances = (mobile: string) => {
    const walletTxs = DB.getWalletTxs(mobile);
    const wBalance = walletTxs.reduce((acc: number, t: any) => acc + (t.amount || 0), 0);
    setWalletBalance(wBalance);

    const activityLogs = DB.getActivityLogs(mobile);
    const aTotal = activityLogs.reduce((acc: number, l: any) => {
      if (l.type === 'income') return acc + (l.amount || 0);
      if (l.type === 'expense') return acc - (l.amount || 0);
      return acc;
    }, 0);
    setTotalLogged(aTotal);
  };

  const handleLogout = () => {
    DB.setCurrentUser(null);
    setUser(null);
    setScreen('auth');
    setIsMenuOpen(false);
  };

  const handleForgetMe = () => {
    DB.clearUserData(user.mobile);
    setUser(null);
    setScreen('auth');
    setIsMenuOpen(false);
  };

  if (screen === 'auth') {
    return <AuthScreen onLogin={(u, lang) => {
      setUser(u);
      setLanguage(lang);
      setScreen('home');
      DB.addLoginLog({...u, language: lang});
      refreshBalances(u.mobile);
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">NS</div>
          <span className="font-bold text-xl tracking-tight text-indigo-900">NidhiSahay</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSubScreen('add_money')} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-bold text-sm border border-indigo-100 active:scale-95 transition hover:bg-indigo-100/50 shadow-sm">
            <Wallet size={16} /> ₹{walletBalance}
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition"><Menu size={24} /></button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-800">Settings</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-slate-50 rounded-full transition"><X /></button>
            </div>
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Language</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={() => { setLanguage(l); setIsMenuOpen(false); }} className={`p-2 rounded-xl text-xs font-bold border transition-all duration-300 ${language === l ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold transition shadow-sm">
              <LogOut size={20} /> <span>{getTranslation(language, 'logout')}</span>
            </button>
          </div>
        </div>
      )}

      <main className="mt-16 p-4 space-y-4 max-w-lg mx-auto">
        {subScreen ? (
          <FeatureScreen type={subScreen} user={user} language={language} onClose={() => { setSubScreen(null); refreshBalances(user.mobile); }} />
        ) : screen === 'profile' ? (
          <ProfileScreen user={user} language={language} onBack={() => setScreen('home')} onLogout={handleLogout} onForgetMe={handleForgetMe} />
        ) : (
          <Dashboard user={user} language={language} walletBalance={walletBalance} totalLogged={totalLogged} onSelectFeature={setSubScreen} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-4 z-40">
        <button onClick={() => {setScreen('home'); setSubScreen(null);}} className={`flex flex-col items-center gap-1 transition-all duration-300 ${screen === 'home' && !subScreen ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <BarChart3 size={22} strokeWidth={screen === 'home' && !subScreen ? 2.5 : 2} /> <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setScreen('profile')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${screen === 'profile' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <User size={22} strokeWidth={screen === 'profile' ? 2.5 : 2} /> <span className="text-[10px] font-bold">{getTranslation(language, 'profile')}</span>
        </button>
      </nav>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
