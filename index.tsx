
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
  Upload
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
    loanEl: "Loan Eligibility & Application",
    logActivity: "Log Money Activity",
    education: "Education Center",
    profile: "My Profile",
    logout: "Logout",
    forgetMe: "Forget Me",
    changeLang: "Change Language",
    savingTarget: "Daily Saving Target",
    userLevel: "User Level",
    streak: "Streak",
    reward: "Daily Reward",
    helpful: "Was this helpful?",
    uploadDoc: "Upload Documents",
    enterPin: "Enter UPI PIN",
    success: "Transaction Successful",
    discipline: "Discipline Level",
    yes: "Yes, Erase My Data",
    no: "No, Keep My Data",
    forgetConfirm: "Are you sure you want to Erase your Data? All your progress and saved information will be removed from our DB.",
    error: "AI Agent is currently unavailable. Please check your connection.",
    done: "Done",
    next: "Next",
    cancel: "Cancel",
    back: "Back",
    settings: "Settings",
    home: "Home",
    thinking: "Assistant is thinking..."
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
    loanEl: "ऋण पात्रता और आवेदन",
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
    yes: "हाँ, डेटा मिटाएं",
    no: "नहीं, रद्द करें",
    forgetConfirm: "क्या आप वाकई अपना डेटा मिटाना चाहते हैं?",
    error: "एआई एजेंट वर्तमान में अनुपलब्ध है। कृपया अपना कनेक्शन जांचें।",
    done: "हो गया",
    next: "अगला",
    cancel: "रद्द करें",
    back: "पीछे",
    settings: "सेटिङ्ग्स्",
    home: "होम",
    thinking: "असिस्टेंट सोच रहा है..."
  },
  Marathi: {
    welcome: "निधिसहाय",
    createAccount: "नवीन खाते तयार करा",
    login: "लॉगिन",
    name: "पूर्ण नाव",
    mobile: "मोबाईल नंबर",
    consent: "हा बॉक्स चेक करून तुम्ही तुमच्या माहितीचा मागोवा घेण्यास सहमती देता.",
    setMpin: "mPIN सेट करा",
    confirmMpin: "mPIN पुष्टी करा",
    enterMpin: "mPIN प्रविष्ट करा",
    wallet: "वॉलेट",
    totalLogged: "लॉग केलेली हालचाल",
    savingTip: "बचत टीप",
    addMoney: "पैसे जोडा",
    loanEl: "कर्ज पात्रता आणि अर्ज",
    logActivity: "खर्चाची नोंद करा",
    education: "शिक्षण केंद्र",
    profile: "माझी प्रोफाइल",
    logout: "लॉगआउट",
    forgetMe: "माझी माहिती पुसून टाका",
    changeLang: "भाषा बदला",
    savingTarget: "दैनिक बचत लक्ष्य",
    userLevel: "वापरकर्ता स्तर",
    streak: "स्ट्रिक",
    reward: "दैनिक रिवॉर्ड",
    helpful: "हे उपयुक्त होते का?",
    uploadDoc: "दस्तऐवज अपलोड करा",
    enterPin: "UPI PIN प्रविष्ट करा",
    success: "व्यवहार यशस्वी",
    discipline: "शिस्त पातळी",
    yes: "हो, माझा डेटा पुसा",
    no: "नाही, ठेवा",
    forgetConfirm: "तुमचा डेटा कायमचा हटवायचा आहे का?",
    error: "एआय सहाय्यक सध्या उपलब्ध नाही.",
    done: "पूर्ण",
    next: "पुढील",
    cancel: "रद्द करा",
    back: "मागे",
    settings: "सेटिंग्ज",
    home: "होम",
    thinking: "सहाय्यक विचार करत आहे..."
  },
  Punjabi: {
    welcome: "ਨਿਧੀਸਹਾਏ",
    createAccount: "ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ",
    login: "ਲੌਗਇਨ",
    name: "ਪੂਰਾ ਨਾਮ",
    mobile: "ਮੋਬਾਈਲ ਨੰਬਰ",
    consent: "ਇਸ ਬਾਕਸ ਨੂੰ ਚੈੱਕ ਕਰਨ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਤੁਸੀਂ AI ਏਜੰਟ ਨਾਲ ਸਹਿਮਤ ਹੋ।",
    setMpin: "mPIN ਸੈੱਟ ਕਰੋ",
    confirmMpin: "mPIN ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    enterMpin: "mPIN ਦਰਜ ਕਰੋ",
    wallet: "ਵਾਲਿਟ",
    totalLogged: "ਲੌਗ ਕੀਤੀ ਗਤੀਵਿਧੀ",
    savingTip: "ਬੱਚਤ ਟਿਪ",
    addMoney: "ਪੈਸੇ ਜੋੜੋ",
    loanEl: "ਲੋਨ ਯੋਗਤਾ ਅਤੇ ਅਰਜ਼ੀ",
    logActivity: "ਪੈਸੇ ਦੀ ਗਤੀਵਿਧੀ ਦਰਜ ਕਰੋ",
    education: "ਸਿੱਖਿਆ ਕੇਂਦਰ",
    profile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
    logout: "ਲੌਗਆਊਟ",
    forgetMe: "ਮੈਨੂੰ ਭੁੱਲ ਜਾਓ",
    changeLang: "ਭਾਸ਼ਾ ਬਦਲੋ",
    savingTarget: "ਰੋਜ਼ਾਨਾ ਬੱਚਤ ਦਾ ਟੀਚਾ",
    userLevel: "ਉਪਭੋਗਤਾ ਪੱਧਰ",
    streak: "ਸਟ੍ਰੀਕ",
    reward: "ਰੋਜ਼ਾਨਾ ਇਨਾਮ",
    helpful: "ਕੀ ਇਹ ਮਦਦਗਾਰ ਸੀ?",
    uploadDoc: "ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ",
    enterPin: "UPI PIN ਦਰਜ ਕਰੋ",
    success: "ਲੈਣ-ਦੇਣ ਸਫਲ",
    discipline: "ਅਨੁਸ਼ਾਸਨ ਪੱਧਰ",
    yes: "ਹਾਂ, ਡਾਟਾ ਮਿਟਾਓ",
    no: "ਨਹੀਂ",
    forgetConfirm: "ਕੀ ਤੁਸੀਂ ਡਾਟਾ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    error: "AI ਏਜੰਟ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    done: "ਹੋ ਗਿਆ",
    next: "ਅੱਗੇ",
    cancel: "ਰੱਦ ਕਰੋ",
    back: "ਪਿੱਛੇ",
    settings: "ਸੈਟਿੰਗਾਂ",
    home: "ਹੋਮ",
    thinking: "ਸਹਾਇਕ ਸੋਚ ਰਿਹਾ ਹੈ..."
  },
  Telugu: {
    welcome: "నిధి సహాయ్",
    createAccount: "కొత్త ఖాతాను సృష్టించండి",
    login: "లాగిన్",
    name: "పూర్తి పేరు",
    mobile: "మొబైల్ నంబర్",
    consent: "ఈ బాక్స్‌ను చెక్ చేయడం ద్వారా మీరు AI ఏజెంట్‌ను అంగీకరిస్తున్నారు.",
    setMpin: "mPIN సెట్ చేయండి",
    confirmMpin: "mPIN నిర్ధారించండి",
    enterMpin: "mPIN నమోదు చేయండి",
    wallet: "వాలెట్",
    totalLogged: "నమోదైన కార్యాచరణ",
    savingTip: "పొదుపు చిట్కా",
    addMoney: "డబ్బును జోడించండి",
    loanEl: "లోన్ అర్హత & దరఖాస్తు",
    logActivity: "డబ్బు కార్యకలాపాన్ని నమోదు చేయండి",
    education: "విద్యా కేంద్రం",
    profile: "నా ప్రొఫైల్",
    logout: "లాగ్అవుట్",
    forgetMe: "నన్ను మర్చిపో",
    changeLang: "భాషను మార్చండి",
    savingTarget: "రోజువారీ పొదుపు లక్ష్యం",
    userLevel: "యూజర్ లెవల్",
    streak: "స్ట్రీక్",
    reward: "రోజువారీ రివార్డ్",
    helpful: "ఇది సహాయపడిందా?",
    uploadDoc: "పత్రాలను అప్‌లోడ్ చేయండి",
    enterPin: "UPI PIN నమోదు చేయండి",
    success: "లావాదేవీ విజయవంతమైంది",
    discipline: "క్రమశిక్షణ స్థాయి",
    yes: "అవును, డేటాను తొలగించు",
    no: "వద్దు",
    forgetConfirm: "మీ డేటాను తొలగించాలనుకుంటున్నారా?",
    error: "ఏజెంట్ అందుబాటులో లేదు.",
    done: "పూర్తయింది",
    next: "తరువాత",
    cancel: "రద్దు",
    back: "వెనుకకు",
    settings: "సెట్టింగులు",
    home: "హోమ్",
    thinking: "ఆలోచిస్తున్నాను..."
  },
  Kannada: {
    welcome: "ನಿಧಿಸಹಾಯ್",
    createAccount: "ಹೊಸ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    login: "ಲಾಗಿನ್",
    name: "ಪೂರ್ಣ ಹೆಸರು",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    consent: "ಈ ಬಾಕ್ಸ್ ಅನ್ನು ಚೆಕ್ ಮಾಡುವ ಮೂಲಕ ನೀವು AI ಏಜೆಂಟ್ ಅನ್ನು ಒಪ್ಪುತ್ತೀರಿ.",
    setMpin: "mPIN ಹೊಂದಿಸಿ",
    confirmMpin: "mPIN ಖಚಿತಪಡಿಸಿ",
    enterMpin: "mPIN ನಮೂದಿಸಿ",
    wallet: "ವ್ಯಾಲೆಟ್",
    totalLogged: "ದಾಖಲಾದ ಚಟುವಟಿಕೆ",
    savingTip: "ಉಳಿತಾಯ ಸಲಹೆ",
    addMoney: "ಹಣವನ್ನು ಸೇರಿಸಿ",
    loanEl: "ಸಾಲ ಅರ್ಹತೆ ಮತ್ತು ಅರ್ಜಿ",
    logActivity: "ಹಣದ ಚಟುವಟಿಕೆಯನ್ನು ದಾಖಲಿಸಿ",
    education: "ಶಿಕ್ಷಣ ಕೇಂದ್ರ",
    profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    logout: "ಲಾಗ್ಔಟ್",
    forgetMe: "ನನ್ನನ್ನು ಮರೆತುಬಿಡಿ",
    changeLang: "ಭಾಷೆಯನ್ನು ಬದಲಿಸಿ",
    savingTarget: "ದೈನಂದಿನ ಉಳಿತಾಯ ಗುರಿ",
    userLevel: "ಬಳಕೆದಾರರ ಮಟ್ಟ",
    streak: "ಸರಣಿ",
    reward: "ದೈನಂದಿನ ಬಹುಮಾನ",
    helpful: "ಇದು ಸಹಾಯಕವಾಗಿದೆಯೇ?",
    uploadDoc: "ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    enterPin: "UPI PIN ನಮೂದಿಸಿ",
    success: "ವಹಿವಾಟು ಯಶಸ್ವಿಯಾಗಿದೆ",
    discipline: "ಶಿಸ್ತಿನ ಮಟ್ಟ",
    yes: "ಹೌದು, ಡೇಟಾವನ್ನು ಅಳಿಸಿ",
    no: "ಬೇಡ",
    forgetConfirm: "ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಅಳಿಸುವುದನ್ನು ನೀವು ಖಚಿತಪಡಿಸುತ್ತೀರಾ?",
    error: "ಏಜೆಂಟ್ ಲಭ್ಯವಿಲ್ಲ.",
    done: "ಮುಗಿಯಿತು",
    next: "ಮುಂದೆ",
    cancel: "ರದ್ದುಮಾಡಿ",
    back: "ಹಿಂದೆ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    home: "ಹೋಮ್",
    thinking: "ಆಲೋಚಿಸುತ್ತಿದೆ..."
  },
  Tamil: {
    welcome: "நிதிசஹாய்",
    createAccount: "புதிய கணக்கை உருவாக்கு",
    login: "உள்நுழை",
    name: "முழு பெயர்",
    mobile: "கைபேசி எண்",
    consent: "இந்த பெட்டியை சரிபார்ப்பதன் மூலம் நீங்கள் AI முகவரை ஒப்புக்கொள்கிறீர்கள்.",
    setMpin: "mPIN அமைக்கவும்",
    confirmMpin: "mPIN ஐ உறுதிப்படுத்தவும்",
    enterMpin: "mPIN ஐ உள்ளிடவும்",
    wallet: "வாலட்",
    totalLogged: "பதிவு செய்யப்பட்ட செயல்பாடு",
    savingTip: "சேமிப்பு குறிப்பு",
    addMoney: "பணம் சேர்க்க",
    loanEl: "கடன் தகுதி மற்றும் விண்ணப்பம்",
    logActivity: "பண நடவடிக்கையை பதிவு செய்யவும்",
    education: "கல்வி மையம்",
    profile: "எனது சுயவிவரம்",
    logout: "வெளியேறு",
    forgetMe: "என்னை மறந்துவிடு",
    changeLang: "மொழியை மாற்றவும்",
    savingTarget: "தினசரி சேமிப்பு இலக்கு",
    userLevel: "பயனர் நிலை",
    streak: "தொடர்ச்சி",
    reward: "தினசரி வெகுமதி",
    helpful: "இது உதவியாக இருந்ததா?",
    uploadDoc: "ஆவணங்களைப் பதிவேற்றவும்",
    enterPin: "UPI PIN ஐ உள்ளிடவும்",
    success: "பரிவர்த்தனை வெற்றி",
    discipline: "ஒழுக்க நிலை",
    yes: "ஆம், தரவை அழி",
    no: "இல்லை",
    forgetConfirm: "உங்கள் தரவை அழிக்க விரும்புகிறீர்களா?",
    error: "முகவர் கிடைக்கவில்லை.",
    done: "முடிந்தது",
    next: "அடுத்து",
    cancel: "ரத்து செய்",
    back: "பின்னால்",
    settings: "அமைப்புகள்",
    home: "முகப்பு",
    thinking: "யோசிக்கிறேன்..."
  },
  Malayalam: {
    welcome: "നിധി സഹായ്",
    createAccount: "പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    login: "ലോഗിൻ",
    name: "പൂർണ്ണമായ പേര്",
    mobile: "മൊബൈൽ നമ്പർ",
    consent: "ഈ ബോക്സ് ചെക്ക് ചെയ്യുന്നതിലൂടെ നിങ്ങൾ AI ഏജന്റിനെ സമ്മതിക്കുന്നു.",
    setMpin: "mPIN സജ്ജമാക്കുക",
    confirmMpin: "mPIN സ്ഥിരീകരിക്കുക",
    enterMpin: "mPIN നൽകുക",
    wallet: "വാലറ്റ്",
    totalLogged: "രേഖപ്പെടുത്തിയ പ്രവർത്തനം",
    savingTip: "സേവിംഗ് ടിപ്പ്",
    addMoney: "പണം ചേർക്കുക",
    loanEl: "ലോൺ യോഗ്യതയും അപേക്ഷയും",
    logActivity: "പണമിടപാടുകൾ രേഖപ്പെടുത്തുക",
    education: "വിദ്യാഭ്യാസ കേന്ദ്രം",
    profile: "എന്റെ പ്രൊഫൈൽ",
    logout: "ലോഗ്ഔട്ട്",
    forgetMe: "എന്നെ മറക്കുക",
    changeLang: "ഭാഷ മാറ്റുക",
    savingTarget: "പ്രതിദിന സേവിംഗ് ലക്ഷ്യം",
    userLevel: "യൂസർ లెవల్",
    streak: "സ്ട്രീക്ക്",
    reward: "പ്രതിദിന പ്രതിഫലം",
    helpful: "ഇത് സഹായിച്ചോ?",
    uploadDoc: "രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
    enterPin: "UPI PIN നൽകുക",
    success: "ഇടപാട് വിജയിച്ചു",
    discipline: "അച്ചടക്ക നില",
    yes: "അതെ, ഡാറ്റ മായ്ക്കുക",
    no: "വേണ്ട",
    forgetConfirm: "നിങ്ങളുടെ ഡാറ്റ മായ്ക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
    error: "ഏജന്റ് ലഭ്യമല്ല.",
    done: "പൂർത്തിയായി",
    next: "അടുത്തത്",
    cancel: "റദ്ദാക്കുക",
    back: "പിന്നിലേക്ക്",
    settings: "ക്രമീകരണങ്ങൾ",
    home: "ഹോം",
    thinking: "ആലോചിക്കുന്നു..."
  }
};

const getTranslation = (lang: Language, key: string): string => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.English;
  return dict[key] || TRANSLATIONS.English[key] || key;
};

// --- Helper for AI Text Formatting ---

const FormattedText = ({ text, className }: { text: string, className?: string }) => {
  const lines = text.split('\n');
  return (
    <div className={`space-y-1 ${className}`}>
      {lines.map((line, idx) => {
        let content: any = line;
        if (line.includes('**')) {
          const parts = line.split(/(\*\*.*?\*\*)/);
          content = parts.map((part, i) => 
            part.startsWith('**') && part.endsWith('**') 
              ? <strong key={i} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong> 
              : part
          );
        }
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-indigo-500 font-bold mt-0.5">•</span>
              <span className="flex-1">{content}</span>
            </div>
          );
        }
        return <div key={idx} className="leading-relaxed">{content}</div>;
      })}
    </div>
  );
};

// --- DB Logic ---

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

  addLogoutLog: (mobile: string) => {
    const logs = JSON.parse(localStorage.getItem(`ns_logout_logs_${mobile}`) || '[]');
    logs.push({ date: new Date().toISOString() });
    localStorage.setItem(`ns_logout_logs_${mobile}`, JSON.stringify(logs));
  },

  clearUserData: (mobile: string) => {
    const keys = [
      `ns_wallet_txs_${mobile}`, `ns_activity_logs_${mobile}`, 
      `ns_login_logs_${mobile}`, `ns_loan_data_${mobile}`, `ns_target_meets_${mobile}`,
      `ns_logout_logs_${mobile}`
    ];
    keys.forEach(k => localStorage.removeItem(k));
    const users = DB.getUsers().filter((u: any) => u.mobile !== mobile);
    localStorage.setItem('ns_users', JSON.stringify(users));
    localStorage.removeItem('ns_current_user');
  }
};

// --- Modal Component ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[1.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col gap-4">
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        {children}
      </div>
    </div>
  );
};

// --- App Screens ---

const AuthScreen = ({ onLogin }: { onLogin: (user: any, lang: Language) => void }) => {
  const [mode, setMode] = useState<'landing' | 'signup' | 'login' | 'mpin' | 'confirm_mpin'>('landing');
  const [formData, setFormData] = useState({ name: '', mobile: '', mpin: '', confirmMpin: '', consent: false });
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>('English');

  const handleSignup = () => {
    if (!formData.name || !formData.mobile || !formData.consent) {
      setError('Please fill all details and accept consent.'); return;
    }
    setMode('mpin');
  };

  const finalizeSignup = () => {
    if (formData.mpin !== formData.confirmMpin) {
      setError('mPINs do not match.'); return;
    }
    const newUser = { 
      mobile: formData.mobile, 
      name: formData.name, 
      mpin: formData.mpin, 
      language: selectedLang,
      streak: 0,
      level: 1,
      target: 100
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
      setError('Incorrect mobile number or mPIN.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mb-4 mx-auto shadow-2xl shadow-indigo-100">NS</div>
        <h1 className="text-4xl font-black text-indigo-900 tracking-tight">NidhiSahay</h1>
        <p className="text-slate-400 font-medium text-sm mt-1">Smarter Savings for You</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {mode === 'landing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2 mb-2">
              {LANGUAGES.map(l => (
                <button key={l} onClick={() => setSelectedLang(l)} className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedLang === l ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200'}`}>{l}</button>
              ))}
            </div>
            <button onClick={() => setMode('signup')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 active:scale-95 transition">{getTranslation(selectedLang, 'createAccount')}</button>
            <button onClick={() => setMode('login')} className="w-full border-2 border-slate-100 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 active:scale-95 transition">{getTranslation(selectedLang, 'login')}</button>
          </div>
        )}

        {mode === 'signup' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <input type="text" placeholder={getTranslation(selectedLang, 'name')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="tel" placeholder={getTranslation(selectedLang, 'mobile')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-start">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded text-indigo-600" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} />
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">{getTranslation(selectedLang, 'consent')}</p>
            </div>
            <button onClick={handleSignup} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg">{getTranslation(selectedLang, 'next')}</button>
            <button onClick={() => setMode('landing')} className="w-full text-slate-400 font-bold py-2 text-sm">{getTranslation(selectedLang, 'cancel')}</button>
          </div>
        )}

        {mode === 'login' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <input type="tel" placeholder={getTranslation(selectedLang, 'mobile')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <input type="password" placeholder={getTranslation(selectedLang, 'enterMpin')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-medium" value={formData.mpin} onChange={e => setFormData({...formData, mpin: e.target.value})} />
            <button onClick={handleLogin} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg">{getTranslation(selectedLang, 'login')}</button>
            <button onClick={() => setMode('landing')} className="w-full text-slate-400 font-bold py-2 text-sm">{getTranslation(selectedLang, 'back')}</button>
          </div>
        )}

        {(mode === 'mpin' || mode === 'confirm_mpin') && (
          <div className="space-y-8 text-center py-4 animate-in slide-in-from-bottom-4">
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

const Dashboard = ({ user, language, walletBalance, totalLogged, onSelectFeature }: any) => {
  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
        <div className="card p-5 group transition hover:border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Wallet size={14} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(language, 'wallet')}</p>
          </div>
          <p className="text-2xl font-black text-indigo-900">₹{walletBalance}</p>
        </div>
        <div className="card p-5 group transition hover:border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><BarChart3 size={14} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(language, 'totalLogged')}</p>
          </div>
          <p className={`text-2xl font-black ${totalLogged >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>₹{totalLogged}</p>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2 flex items-center gap-2">
            <ShieldCheck size={22} className="text-indigo-300" />
            Nidhi Assistant
          </h3>
          <p className="text-indigo-100/80 text-xs mb-6 leading-relaxed font-medium">
            Smarter loans, easy savings, and financial tips in your language. Talk to me now.
          </p>
          <button 
            onClick={() => onSelectFeature('ai_chat')}
            className="w-full bg-white text-indigo-900 font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition"
          >
            <Mic size={20} className="text-indigo-600" />
            Talk to Assistant
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl transition group-hover:scale-125" />
      </div>

      <AITip language={language} />

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onSelectFeature('add_money')} className="card bg-gradient-pastel-blue p-6 flex flex-col items-center gap-3 transition active:scale-95">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm"><Plus className="text-blue-600" size={24} /></div>
          <div className="text-center">
            <span className="text-sm font-black text-slate-800 block">{getTranslation(language, 'addMoney')}</span>
          </div>
        </button>
        <button onClick={() => onSelectFeature('loan_eligibility')} className="card bg-gradient-pastel-green p-6 flex flex-col items-center gap-3 transition active:scale-95">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm"><FileText className="text-purple-600" size={24} /></div>
          <div className="text-center">
            <span className="text-sm font-black text-slate-800 block">{getTranslation(language, 'loanEl')}</span>
          </div>
        </button>
        <button onClick={() => onSelectFeature('log_activity')} className="card bg-gradient-pastel-yellow p-6 flex flex-col items-center gap-3 transition active:scale-95">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm"><BarChart3 className="text-orange-600" size={24} /></div>
          <div className="text-center">
            <span className="text-sm font-black text-slate-800 block">{getTranslation(language, 'logActivity')}</span>
          </div>
        </button>
        <button onClick={() => onSelectFeature('education')} className="card bg-slate-50 p-6 flex flex-col items-center gap-3 transition active:scale-95">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm"><BookOpen className="text-emerald-600" size={24} /></div>
          <div className="text-center">
            <span className="text-sm font-black text-slate-800 block">{getTranslation(language, 'education')}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

const AITip = ({ language }: { language: Language }) => {
  const [tip, setTip] = useState('Fetching a fresh financial tip...');
  const [feedback, setFeedback] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: `Generate a single short financial saving tip for an Indian worker in ${language}. Make it motivational and rational. Max 15 words.` }] }]
        });
        setTip(resp.text || tip);
      } catch (e) {
        console.error("AI Tip Error:", e);
        setTip("Save a little today for a better tomorrow..");
      }
    };
    fetchTip();
  }, [language]);

  return (
    <div className="card p-6 space-y-3 animate-in fade-in slide-in-from-left-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation(language, 'savingTip')}</h4>
        <div className="flex gap-2 bg-slate-50 p-1 rounded-lg">
          <button onClick={() => setFeedback(true)} className={`p-1 rounded-lg transition ${feedback === true ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}><ThumbsUp size={14} /></button>
          <button onClick={() => setFeedback(false)} className={`p-1 rounded-lg transition ${feedback === false ? 'bg-rose-100 text-rose-600 shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}><ThumbsDown size={14} /></button>
        </div>
      </div>
      <p className="text-slate-700 font-bold leading-relaxed italic text-sm">"{tip}"</p>
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
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-IN'; 
      recognitionRef.current.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
    if (type === 'loan_eligibility' && chatLog.length === 0) {
      initiateLoanAgent();
    }
  }, [type]);

  const initiateLoanAgent = async () => {
    setIsTyping(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemPrompt = `Greet the user in ${language}. You are the Loan Application Assistant. Start the eligibility journey.
    Ask questions about:
    1. Business Type
    2. Udyam Registration (Yes/No)
    3. Business Plan existence.
    Ask the first question now.`;
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: "Initiate loan eligibility chat" }] }],
        config: { systemInstruction: systemPrompt }
      });
      setChatLog([{ role: 'assistant', content: resp.text }]);
    } catch (e) {
      console.error("AI Initiation Error:", e);
      setChatLog([{ role: 'assistant', content: getTranslation(language, 'error') }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;
    setChatLog(prev => [...prev, { role: 'user', content: text }]);
    setInputText('');
    setIsTyping(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      if (type === 'log_activity') {
        const systemPrompt = `You are a financial transaction parser for workers in India. Extract transaction details from the user input in ${language}.
        Always return a valid JSON object.`;
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: text }] }],
          config: { 
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                amount: { type: Type.NUMBER, description: "The numeric amount extracted." },
                type: { type: Type.STRING, enum: ['income', 'expense'], description: "The type of transaction." },
                category: { type: Type.STRING, description: "Inferred category (Food, Rent, Salary, etc.)" },
                description: { type: Type.STRING, description: "Brief summary." }
              },
              required: ['amount', 'type', 'category', 'description']
            }
          }
        });
        const parsed = JSON.parse(resp.text || '{}');
        if (parsed.amount) {
          DB.addActivityLog(user.mobile, parsed);
          setChatLog(prev => [...prev, { role: 'assistant', content: `**Activity Logged Successfully!**\n\n₹${parsed.amount} marked as *${parsed.type}* for ${parsed.category}.` }]);
        } else {
          setChatLog(prev => [...prev, { role: 'assistant', content: "I couldn't identify the amount. Could you try again?" }]);
        }
      } else if (type === 'loan_eligibility') {
        const systemPrompt = `You are following the Sahay App Agentic AI Loan Journey in ${language}. 
        Identify if user qualifies for MUDRA, PM SVAnidhi, etc.
        If eligibility is clear, suggest the links and portal (e.g., janasamarth.in).
        Ask the checklist questions: Identity Proof, Address Proof, Income Proof, etc.`;
        const resp = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: [{ parts: [{ text: `History: ${JSON.stringify(chatLog)}. User: ${text}` }] }],
          config: { systemInstruction: systemPrompt }
        });
        setChatLog(prev => [...prev, { role: 'assistant', content: resp.text }]);
      } else {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: text }] }],
          config: { systemInstruction: `You are Nidhi Assistant. Help the user with financial tips, loan procedures, or savings advice in ${language}. Use **bold** and bullet points.` }
        });
        setChatLog(prev => [...prev, { role: 'assistant', content: resp.text }]);
      }
    } catch (e) {
      console.error("AI Send Error:", e);
      setChatLog(prev => [...prev, { role: 'assistant', content: getTranslation(language, 'error') }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (type === 'education') {
    const recommendedVideos = [
      { id: 'zR0x9wGf9YQ', title: 'Pradhan Mantri Mudra Yojana (PMMY) Guide', desc: 'Step-by-step application process for PMMY loans.' },
      { id: 'R_I_p0NfU3s', title: 'PM SVAnidhi Scheme Explained', desc: 'Financial assistance for street vendors and micro-businesses.' },
      { id: 'P283YpA3lGk', title: 'Smart Budgeting & Savings Tips', desc: 'How to manage daily earnings and build a safety net.' },
      { id: '9L-rG6-7h6U', title: 'Digital Banking Security', desc: 'Learn how to stay safe while using mobile wallets and UPI.' }
    ];

    return (
      <div className="h-full space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <header className="flex items-center gap-4 py-2 border-b border-slate-100 sticky top-0 bg-slate-50 z-10">
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-black text-slate-800">{getTranslation(language, 'education')}</h2>
        </header>

        {activeVideo ? (
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <button 
              onClick={() => setActiveVideo(null)}
              className="w-full py-3 bg-white border border-slate-200 rounded-xl text-indigo-600 font-bold text-sm shadow-sm"
            >
              {getTranslation(language, 'cancel')}
            </button>
          </div>
        ) : null}

        <div className="space-y-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Featured Courses</p>
          {recommendedVideos.map(v => (
            <button 
              key={v.id} 
              onClick={() => setActiveVideo(v.id)}
              className={`w-full text-left card p-5 flex items-center gap-4 group transition-all ${activeVideo === v.id ? 'border-indigo-600 bg-indigo-50/50' : ''}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm ${activeVideo === v.id ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                <PlayCircle size={32} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm text-slate-800">{v.title}</h4>
                <p className="text-xs text-slate-500 font-medium line-clamp-2">{v.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'add_money') {
    if (view === 'main') return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4">
        <header className="flex items-center gap-4"><button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm"><ArrowLeft size={20} /></button><h2 className="text-xl font-black text-slate-800">{getTranslation(language, 'addMoney')}</h2></header>
        <div className="flex flex-col items-center gap-8"><div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enter Amount</p><div className="text-6xl font-black text-indigo-900 tabular-nums">₹{amount || '0'}</div></div>
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (<button key={n} onClick={() => { if (n === 'C') setAmount(amount.slice(0, -1)); else if (n === '✓') amount && setView('upi_pin'); else if (amount.length < 6) setAmount(amount + String(n)); }} className="h-16 bg-white border border-slate-100 rounded-2xl font-black text-xl shadow-sm active:bg-slate-50 active:scale-95 transition">{n}</button>))}</div>
        </div>
      </div>
    );
    if (view === 'upi_pin') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
        <h2 className="text-2xl font-black text-slate-800 mb-2">{getTranslation(language, 'enterPin')}</h2><div className="flex gap-4 mb-16">{[1, 2, 3, 4, 5, 6].map(i => (<div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length >= i ? 'bg-indigo-600 border-indigo-600 scale-110' : 'bg-white border-slate-200'}`} />))}</div>
        <div className="grid grid-cols-3 gap-6 w-full max-w-xs">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (<button key={n} onClick={() => { if (n === 'C') setPin(pin.slice(0, -1)); else if (n === '✓') { if (pin.length >= 4) { DB.addWalletTx(user.mobile, { amount: parseInt(amount), type: 'credit' }); setView('success'); } } else if (pin.length < 6) setPin(pin + String(n)); }} className="h-14 font-black text-2xl active:bg-slate-50 rounded-full transition">{n}</button>))}</div>
      </div>
    );
    if (view === 'success') return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-110 duration-500"><div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-50"><CheckCircle2 size={56} strokeWidth={3} /></div><h2 className="text-3xl font-black text-slate-900 mb-2">{getTranslation(language, 'success')}</h2><button onClick={onClose} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl mt-8 transition active:scale-95">{getTranslation(language, 'done')}</button></div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[50] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
      <header className="h-16 border-b flex items-center px-4 gap-4 bg-white sticky top-0 z-10"><button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition"><ArrowLeft size={20} /></button><h3 className="font-black text-slate-800 tracking-tight">{getTranslation(language, type)}</h3></header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">{chatLog.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}><div className={`p-4 rounded-[1.25rem] max-w-[85%] shadow-sm text-sm font-bold ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-700'}`}><FormattedText text={msg.content} /></div></div>))}
        {isTyping && <div className="text-xs text-slate-400 font-black px-2 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />{getTranslation(language, 'thinking')}</div>}
      </div>
      <div className="p-4 bg-white border-t flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => { setIsListening(true); recognitionRef.current?.start(); }} className={`p-4 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-sm'}`}><Mic size={22} /></button>
          <input type="text" placeholder="..." className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 outline-none text-sm font-bold" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <button onClick={() => handleSend()} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg active:scale-95 transition"><Send size={22} /></button>
        </div>
        {type === 'loan_eligibility' && (
          <div className="flex justify-center">
            <input type="file" ref={fileInputRef} className="hidden" />
            <button onClick={handleFileUpload} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition shadow-sm">
              <Upload size={18} /> {getTranslation(language, 'uploadDoc')}
            </button>
          </div>
        )}
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
  
  const levelPoints = user.streak || 0;
  const currentLevel = Math.floor(levelPoints / 7) + 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-4"><button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ArrowLeft size={20} /></button><h2 className="text-xl font-black text-slate-800">{getTranslation(language, 'profile')}</h2></header>
      <div className="card p-7 flex flex-col items-center text-center group"><div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 mx-auto border-4 border-white shadow-lg"><Trophy size={40} /></div><h3 className="text-xl font-black text-slate-800">{getTranslation(language, 'streak')}: {user.streak || 0} Days</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Level {currentLevel} Disciplined Saver</p></div>
      <div className="card p-7 space-y-6"><div className="flex justify-between items-center"><span className="font-black text-slate-800">{getTranslation(language, 'savingTarget')}</span><div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl"><button onClick={() => setTarget((t: number) => Math.max(0, t - 10))} className="w-10 h-10 bg-white shadow-sm rounded-lg font-black">-</button><span className="font-black px-2">₹{target}</span><button onClick={() => setTarget((t: number) => t + 10)} className="w-10 h-10 bg-white shadow-sm rounded-lg font-black">+</button></div></div>
        <div className="space-y-2"><div className="flex justify-between items-end"><div className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Today's Progress</div><div className="text-sm font-black text-indigo-600">₹{todaySavings} / ₹{target}</div></div><div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (todaySavings / target) * 100)}%` }} /></div></div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl text-slate-700 font-black active:scale-95 shadow-sm transition hover:bg-slate-50"><LogOut size={20} className="text-indigo-600" /><span>{getTranslation(language, 'logout')}</span></button>
        <button onClick={() => setIsForgetModalOpen(true)} className="w-full flex items-center justify-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-2xl font-black active:scale-95 border border-rose-100/50 shadow-sm transition hover:bg-rose-100"><Trash2 size={20} /><span>{getTranslation(language, 'forgetMe')}</span></button>
      </div>
      <Modal isOpen={isForgetModalOpen} onClose={() => setIsForgetModalOpen(false)} title={getTranslation(language, 'forgetMe')}><div className="flex gap-4 p-4 bg-rose-50 rounded-xl text-rose-600 items-start"><AlertCircle className="shrink-0 mt-0.5" size={20} /><p className="text-sm font-bold leading-relaxed">{getTranslation(language, 'forgetConfirm')}</p></div><div className="grid grid-cols-1 gap-3 mt-2"><button onClick={() => { onForgetMe(); setIsForgetModalOpen(false); }} className="p-4 bg-rose-600 text-white rounded-xl font-black shadow-lg active:scale-95 transition">{getTranslation(language, 'yes')}</button><button onClick={() => setIsForgetModalOpen(false)} className="p-4 bg-slate-100 text-slate-700 rounded-xl font-black active:scale-95 transition">{getTranslation(language, 'no')}</button></div></Modal>
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
    setWalletBalance(walletTxs.reduce((acc: number, t: any) => acc + (t.amount || 0), 0));
    const activityLogs = DB.getActivityLogs(mobile);
    setTotalLogged(activityLogs.reduce((acc: number, l: any) => l.type === 'income' ? acc + (l.amount || 0) : acc - (l.amount || 0), 0));
  };

  const handleLogout = () => {
    if (user) DB.addLogoutLog(user.mobile);
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

  if (screen === 'auth') return <AuthScreen onLogin={(u, lang) => { setUser(u); setLanguage(lang); setScreen('home'); refreshBalances(u.mobile); }} />;

  return (
    <div className="min-h-screen font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900 bg-slate-50/50">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">NS</div><span className="font-bold text-xl tracking-tight text-indigo-900">NidhiSahay</span></div>
        <div className="flex items-center gap-3"><button onClick={() => setSubScreen('add_money')} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-bold text-sm border border-indigo-100 active:scale-95 transition shadow-sm hover:bg-indigo-100"><Wallet size={16} /> ₹{walletBalance}</button><button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition"><Menu size={24} /></button></div>
      </header>
      {isMenuOpen && (<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setIsMenuOpen(false)}><div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-right" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-8"><h2 className="text-xl font-black text-slate-800 tracking-tight">{getTranslation(language, 'settings')}</h2><button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-slate-50 rounded-full transition"><X /></button></div><div className="space-y-6 flex-1"><div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{getTranslation(language, 'changeLang')}</label><div className="grid grid-cols-2 gap-2">{LANGUAGES.map(l => (<button key={l} onClick={() => { setLanguage(l); setIsMenuOpen(false); }} className={`p-2 rounded-xl text-xs font-bold border transition-all ${language === l ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}>{l}</button>))}</div></div></div><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold transition shadow-sm"><LogOut size={20} /><span>{getTranslation(language, 'logout')}</span></button></div></div>)}
      <main className="mt-16 p-4 space-y-4 max-w-lg mx-auto">{subScreen ? (<FeatureScreen type={subScreen} user={user} language={language} onClose={() => { setSubScreen(null); refreshBalances(user.mobile); }} />) : screen === 'profile' ? (<ProfileScreen user={user} language={language} onBack={() => setScreen('home')} onLogout={handleLogout} onForgetMe={handleForgetMe} />) : (<Dashboard user={user} language={language} walletBalance={walletBalance} totalLogged={totalLogged} onSelectFeature={setSubScreen} />)}</main>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-4 z-40"><button onClick={() => {setScreen('home'); setSubScreen(null);}} className={`flex flex-col items-center gap-1 transition-all ${screen === 'home' && !subScreen ? 'text-indigo-600 scale-110 font-bold' : 'text-slate-400'}`}><BarChart3 size={22} /><span className="text-[10px]">{getTranslation(language, 'home')}</span></button><button onClick={() => setScreen('profile')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'profile' ? 'text-indigo-600 scale-110 font-bold' : 'text-slate-400'}`}><User size={22} /><span className="text-[10px]">{getTranslation(language, 'profile')}</span></button></nav>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
