
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
import { GoogleGenAI, Type } from "@google/genai";
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
  Hindi: { welcome: "निधिसहाय", tagline: "आपका वित्तीय एआई एजेंट", createAccount: "नया खाता बनाएं", login: "लॉगिन" },
  Marathi: {}, Punjabi: {}, Telugu: {}, Kannada: {}, Tamil: {}, Malayalam: {}
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
  async saveLoanEligibility(mobile: string, loanData: any) {
    await supabase.from('loan_eligibility').insert([{
      profile_mobile: mobile,
      business_type: loanData.business_type,
      udyam_registered: loanData.udyam_registered,
      transaction_method: loanData.transaction_method,
      has_business_pan: loanData.has_business_pan,
      data_json: loanData
    }]);
  },
  async clearUserData(mobile: string) {
    await supabase.from('profiles').delete().eq('mobile', mobile);
  }
};

// --- AI Components ---
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return <div className="space-y-1">{lines.map((l, i) => {
    // Basic Markdown handling for bold
    if (l.includes('**')) {
      const parts = l.split(/(\*\*.*?\*\*)/);
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
    return <p key={i}>{l}</p>;
  })}</div>;
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
      <h1 className="text-3xl font-black text-indigo-900 mb-2">NidhiSahay</h1>
      <p className="text-slate-400 font-medium mb-12">Empowering Small Savings</p>

      {mode === 'landing' && (
        <div className="w-full max-w-sm space-y-4">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setSelectedLang(l)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${selectedLang === l ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'}`}>{l}</button>
            ))}
          </div>
          <button onClick={() => setMode('signup')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg">{getTranslation(selectedLang, 'createAccount')}</button>
          <button onClick={() => setMode('login')} className="w-full border-2 border-slate-100 font-bold py-4 rounded-2xl">{getTranslation(selectedLang, 'login')}</button>
        </div>
      )}

      {(mode === 'signup' || mode === 'login') && (
        <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-4">
          {mode === 'signup' && <input type="text" placeholder="Name" className="w-full p-4 bg-slate-50 rounded-2xl border" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />}
          <div className="flex gap-2">
            <select className="p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.countryCode} onChange={e => setFormData({ ...formData, countryCode: e.target.value })}>
              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
            <input type="tel" maxLength={10} placeholder="Mobile Number" className="flex-1 p-4 bg-slate-50 rounded-2xl border" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })} />
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
            {[1, 2, 3, 4].map(i => <div key={i} className={`w-3 h-3 rounded-full border-2 ${ (mode === 'mpin' ? formData.mpin : formData.confirmMpin).length >= i ? 'bg-indigo-600 border-indigo-600' : 'bg-white'}`} />)}
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
          <p className="text-xs text-indigo-200 font-medium">I can help with finance tips, loans, and recording transactions.</p>
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

const FeatureScreen = ({ type, user, language, onClose }: any) => {
  const [view, setView] = useState('main');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loanJourneyState, setLoanJourneyState] = useState({
    step: 0,
    data: {
      business_type: '',
      udyam_registered: false,
      transaction_method: '',
      has_business_pan: false
    }
  });
  const [educationVideos, setEducationVideos] = useState<any[]>([]);

  useEffect(() => {
    if (type === 'loan_eligibility') {
      setChatLog([{ role: 'assistant', content: "Hello! I can help you with a loan for your business. To find the best options, I need to build your profile first.\n\n**What is your business type?** (e.g., Kirana store, Tailoring shop, etc.)" }]);
    } else if (type === 'education') {
      loadEducationRecommendations();
    }
  }, [type]);

  const loadEducationRecommendations = async () => {
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const walletTxs = await DB.getWalletBalance(user.mobile);
      const activityLogs = await DB.getLoggedBalance(user.mobile);
      
      const prompt = `Based on a user with wallet balance ${walletTxs} and logged financial activity ${activityLogs}, recommend 3-4 specific educational videos for their financial growth. If there is no sufficient data, give 3-4 videos on Basic Finance. 
      Respond with ONLY a JSON array of objects: [{ "id": "youtube_id", "title": "video_title", "description": "short_desc" }] 
      Example YouTube IDs: "Z8f-1u3bL2w", "9L-rG6-7h6U", "P283YpA3lGk".`;

      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const parsed = JSON.parse(resp.text || '[]');
      if (parsed.length === 0) {
        setEducationVideos([
          { id: "Z8f-1u3bL2w", title: "Personal Finance 101", description: "Learn the basics of managing your money effectively." },
          { id: "9L-rG6-7h6U", title: "Saving for the Future", description: "Smart strategies to grow your savings day by day." },
          { id: "P283YpA3lGk", title: "Understanding Loans", description: "A guide to business and personal credit in India." }
        ]);
      } else {
        setEducationVideos(parsed);
      }
    } catch (e) {
      console.error(e);
      setEducationVideos([
        { id: "Z8f-1u3bL2w", title: "Personal Finance 101", description: "Learn the basics of managing your money effectively." },
        { id: "9L-rG6-7h6U", title: "Saving for the Future", description: "Smart strategies to grow your savings day by day." },
        { id: "P283YpA3lGk", title: "Understanding Loans", description: "A guide to business and personal credit in India." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLoanJourneyStep = async (msg: string) => {
    let nextStep = loanJourneyState.step + 1;
    let nextData = { ...loanJourneyState.data };
    let assistantMessage = "";

    switch (loanJourneyState.step) {
      case 0:
        nextData.business_type = msg;
        assistantMessage = "Great. Is your business **Udyam Registered**? (Yes/No)";
        break;
      case 1:
        nextData.udyam_registered = msg.toLowerCase().includes('yes');
        assistantMessage = "Got it. How do you mostly handle your business **transactions**? (e.g., Cash, Digital, or Both)";
        break;
      case 2:
        nextData.transaction_method = msg;
        assistantMessage = "Understood. One last thing for the profile: Do you have a **Business PAN Card**? (Yes/No)";
        break;
      case 3:
        nextData.has_business_pan = msg.toLowerCase().includes('yes');
        setIsTyping(true);
        // Save to DB
        await DB.saveLoanEligibility(user.mobile, nextData);
        
        // Analyze profile with AI
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const analysisPrompt = `A user wants a loan. Profile: Business Type: ${nextData.business_type}, Udyam Registered: ${nextData.udyam_registered}, Transaction Method: ${nextData.transaction_method}, Business PAN: ${nextData.has_business_pan}. 
        Recommend 2-3 suitable government loan schemes like MUDRA, PM SVANidhi, etc. 
        For each, provide:
        - Scheme Name
        - Terms: (Interest rate, max amount)
        - Eligibility: (Brief)
        - Portal: (Link to portal like janasamarth.in)
        Format with bullet points. End with: "Which scheme would you like to know more about?"`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: analysisPrompt }] }],
          config: { systemInstruction: `You are an expert financial loan agent for small businesses in India. Language: ${language}` }
        });
        assistantMessage = resp.text || "Thank you. I'm analyzing your profile against available loan schemes...";
        setIsTyping(false);
        break;
      default:
        // Journey continues (User selects scheme -> Detail -> Guide)
        setIsTyping(true);
        const aiCont = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const contPrompt = `History: ${JSON.stringify(chatLog)}. User says: ${msg}. If user selected a scheme, provide detailed terms and guide them through next steps: 1. Visit Portal. 2. Apply Now. 3. Pre-fill with existing data. Ask if they want you to guide them.`;
        const respCont = await aiCont.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: contPrompt }] }],
          config: { systemInstruction: `You are Nidhi Assistant guiding a user through a loan application. Language: ${language}` }
        });
        assistantMessage = respCont.text || "I can help you apply. Would you like me to guide you through the next steps?";
        setIsTyping(false);
        break;
    }

    setLoanJourneyState({ step: nextStep, data: nextData });
    setChatLog(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
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
        const prompt = `You are a financial transaction parser. Extract details from: "${msg}" in language ${language}. Respond ONLY with a JSON object: { "amount": <number>, "type": "income" | "expense", "category": "<string>", "description": "<string>" }`;
        const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ parts: [{ text: prompt }] }], config: { responseMimeType: "application/json" } });
        const parsed = JSON.parse(resp.text || '{}');
        if (parsed.amount) {
          await DB.addMoneyLog(user.mobile, parsed);
          setChatLog(prev => [...prev, { role: 'assistant', content: `Logged ₹${parsed.amount} as ${parsed.type} (${parsed.category}).` }]);
        } else {
          setChatLog(prev => [...prev, { role: 'assistant', content: "I couldn't identify the amount. Please try saying it like 'Spent 50 on tea'." }]);
        }
      } else {
        const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ parts: [{ text: msg }] }], config: { systemInstruction: `You are Nidhi Assistant. Help with ${type} in ${language}. Use **bold** text for important points.` } });
        setChatLog(prev => [...prev, { role: 'assistant', content: resp.text }]);
      }
    } catch (e) { console.error(e); } finally { setIsTyping(false); }
  };

  if (type === 'add_money') {
    if (view === 'main') return (
      <div className="space-y-8 py-4 animate-in slide-in-from-bottom-4">
        <header className="flex items-center gap-4 px-2">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={20}/></button>
          <h3 className="font-black text-indigo-900">Add Money to Wallet</h3>
        </header>
        <div className="text-center"><p className="text-xs font-bold text-slate-400 mb-2 uppercase">Amount to Add</p><h2 className="text-6xl font-black text-indigo-900">₹{amount || '0'}</h2></div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
            <button key={n} onClick={() => { if (n === 'C') setAmount(amount.slice(0, -1)); else if (n === '✓') amount && setView('pin'); else if (amount.length < 6) setAmount(amount + n); }} className="h-16 bg-white border border-slate-100 rounded-2xl font-black text-xl shadow-sm active:bg-slate-100 active:scale-95 transition">{n}</button>
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
            <button key={n} onClick={async () => { if (n === 'C') setPin(pin.slice(0, -1)); else if (n === '✓') { if (pin.length >= 4) { await DB.addWalletTx(user.mobile, parseInt(amount)); setView('success'); } } else if (pin.length < 4) setPin(pin + n); }} className="h-12 font-black text-2xl active:bg-slate-50 rounded-full transition">{n}</button>
          ))}
        </div>
      </div>
    );
    if (view === 'success') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl"><CheckCircle2 size={56} /></div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Transaction Successful</h2>
        <p className="text-slate-400 font-bold mb-8">₹{amount} added to your Nidhi Wallet.</p>
        <button onClick={onClose} className="w-full max-w-sm bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition">Done</button>
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
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-center">
            <Info className="text-indigo-600" size={20}/>
            <p className="text-xs font-bold text-indigo-900">Recommended for you by Nidhi AI based on your financial logs.</p>
          </div>
          {isTyping && <div className="text-center py-10 font-bold text-indigo-400 animate-pulse">Finding best recommendations...</div>}
          <div className="grid grid-cols-1 gap-6">
            {educationVideos.map((video, idx) => (
              <div key={idx} className="card p-4 space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-inner bg-slate-900">
                   <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${video.id}`} 
                    title={video.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
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
        {chatLog.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}><div className={`p-4 rounded-2xl max-w-[85%] text-sm font-bold shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-700'}`}><FormattedText text={m.content} /></div></div>)}
        {isTyping && <div className="text-xs text-slate-400 font-black animate-pulse flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"/> Thinking...</div>}
      </div>
      <div className="p-4 bg-white border-t flex flex-col gap-3 shadow-2xl">
        <div className="flex gap-2">
          <button className="p-4 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition"><Mic size={22} /></button>
          <input type="text" placeholder="Type message..." className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-500 transition" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <button onClick={() => handleSend()} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg active:scale-95 transition"><Send size={22} /></button>
        </div>
        {type === 'loan_eligibility' && (
          <button className="flex items-center justify-center gap-2 p-3 bg-slate-100 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-200 transition">
            <Upload size={14}/> Upload Documents
          </button>
        )}
      </div>
    </div>
  );
};

const ProfileScreen = ({ user, language, onBack, onLogout, onForgetMe }: any) => {
  const [target, setTarget] = useState(user.target || 100);
  const handleUpdateTarget = async (newVal: number) => {
    setTarget(newVal);
    await DB.updateProfile(user.mobile, { target: newVal });
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <header className="flex items-center gap-4"><button onClick={onBack} className="p-2 hover:bg-white rounded-full"><ArrowLeft size={20} /></button><h2 className="text-xl font-black text-indigo-900">My Profile</h2></header>
      <div className="card p-6 flex items-center gap-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner"><User size={32} /></div>
        <div>
          <h3 className="text-lg font-black text-slate-800">{user.name}</h3>
          <p className="text-sm text-slate-500 font-bold">{user.mobile}</p>
        </div>
      </div>
      <div className="card p-6 space-y-6">
        <div className="flex justify-between items-center"><span className="font-bold text-slate-600">Daily Savings Target</span><div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl"><button onClick={() => handleUpdateTarget(Math.max(0, target - 50))} className="w-8 h-8 bg-white border border-slate-200 rounded-lg font-bold shadow-sm hover:bg-slate-50">-</button><span className="font-black px-2 tabular-nums">₹{target}</span><button onClick={() => handleUpdateTarget(target + 50)} className="w-8 h-8 bg-white border border-slate-200 rounded-lg font-bold shadow-sm hover:bg-slate-50">+</button></div></div>
        <div className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-3xl shadow-sm">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md"><Star size={24} /></div>
          <div><h4 className="font-black text-indigo-900">Level {user.level || 1} Saver</h4><p className="text-[10px] text-indigo-700 font-black tracking-wide uppercase">Keep saving to increase your level!</p></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-5 bg-white border border-slate-200 rounded-3xl text-slate-700 font-black shadow-sm transition active:scale-95 hover:bg-slate-50"><LogOut size={20} className="text-indigo-600" /><span>Logout</span></button>
        <button onClick={onForgetMe} className="w-full flex items-center justify-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-3xl font-black shadow-sm transition active:scale-95 border border-rose-100 hover:bg-rose-100"><Trash2 size={20} /><span>Forget Me</span></button>
      </div>
    </div>
  );
};

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
          setUser(p); setLanguage(p.language || 'English');
          refreshBalances(p.mobile); setScreen('home');
        } else { setScreen('auth'); }
      });
    } else { setScreen('auth'); }
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
    if (user) DB.logAuthEvent(user.mobile, 'logout');
    localStorage.removeItem('ns_session_mobile');
    setUser(null); setScreen('auth'); setIsMenuOpen(false);
  };

  const handleForgetMe = async () => {
    if (window.confirm("Are you sure? This will delete all your data permanently from our database.")) {
      if (user) await DB.clearUserData(user.mobile);
      localStorage.removeItem('ns_session_mobile');
      setUser(null); setScreen('auth'); setIsMenuOpen(false);
    }
  };

  if (screen === 'loading') return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (screen === 'auth') return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">NS</div><span className="font-black text-xl tracking-tight text-indigo-900">NidhiSahay</span></div>
        <div className="flex items-center gap-3"><button onClick={() => setSubScreen('add_money')} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black text-xs border border-indigo-100 shadow-sm hover:bg-indigo-100 active:scale-95 transition">₹{balances.wallet}</button><button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition"><Menu size={24} /></button></div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl flex flex-col p-8 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black text-slate-800 tracking-tight">Settings</h2><button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition"><X /></button></div>
            <div className="flex-1 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Language</p>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {LANGUAGES.map(l => (
                   <button key={l} onClick={async () => { setLanguage(l); setIsMenuOpen(false); await DB.updateProfile(user.mobile, { language: l }); }} className={`p-3 rounded-2xl text-[10px] font-black border transition-all ${language === l ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}>{l}</button>
                ))}
              </div>
              <button onClick={handleForgetMe} className="w-full flex items-center gap-3 p-4 text-rose-600 bg-rose-50 rounded-2xl font-black shadow-sm active:scale-95 transition hover:bg-rose-100"><Trash2 size={20} /> {getTranslation(language, 'forgetMe')}</button>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-5 text-slate-700 bg-slate-100 rounded-3xl font-black active:scale-95 transition hover:bg-slate-200"><LogOut size={22} /><span>{getTranslation(language, 'logout')}</span></button>
          </div>
        </div>
      )}

      <main className="mt-20 p-4 max-w-lg mx-auto">
        {screen === 'home' && !subScreen && <Dashboard user={user} language={language} balances={balances} onSelectFeature={setSubScreen} />}
        {subScreen && <FeatureScreen type={subScreen} user={user} language={language} onClose={() => { setSubScreen(null); refreshBalances(user.mobile); }} />}
        {screen === 'profile' && <ProfileScreen user={user} language={language} onBack={() => setScreen('home')} onLogout={handleLogout} onForgetMe={handleForgetMe} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-4 z-40">
        <button onClick={() => { setScreen('home'); setSubScreen(null); }} className={`flex flex-col items-center gap-1 transition-all ${screen === 'home' && !subScreen ? 'text-indigo-600 scale-110 font-black' : 'text-slate-400 font-bold hover:text-indigo-400'}`}><BarChart3 size={22} /><span className="text-[10px] uppercase tracking-tighter">Home</span></button>
        <button onClick={() => { setSubScreen('ai_chat'); }} className={`flex flex-col items-center gap-1.5 p-3 -mt-8 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-200 active:scale-95 transition hover:bg-indigo-700`}><Mic size={24} /></button>
        <button onClick={() => { setScreen('profile'); }} className={`flex flex-col items-center gap-1 transition-all ${screen === 'profile' ? 'text-indigo-600 scale-110 font-black' : 'text-slate-400 font-bold hover:text-indigo-400'}`}><User size={22} /><span className="text-[10px] uppercase tracking-tighter">Profile</span></button>
      </nav>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { createRoot(container).render(<App />); }
