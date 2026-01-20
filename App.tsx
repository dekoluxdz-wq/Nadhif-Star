
import React, { useState, useEffect, useMemo, createContext, useContext, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Home, Calendar, User, Star, ShieldCheck, Check, Zap, Sparkles, 
  Armchair, Utensils, Search, Filter, Loader2, ArrowRight, MapPin, 
  Phone, Clock, ChevronLeft, Calendar as CalendarIcon, 
  MapPin as MapPinIcon, User as UserIcon, Phone as PhoneIcon,
  Bell, Settings, LogOut, ChevronRight, Info, CreditCard, X, ThumbsUp, Camera, Download, Wallet
} from 'lucide-react';
import { APP_CONFIG } from './constants';
import { ServiceItem, Booking, UserProfile, BookingDetails, Notification, PaymentMethodConfig } from './types';
import { AIChat } from './components/AIChat';
import { translations, Language } from './translations';

// --- Customizable Logo Component ---
const AppLogo = ({ className = "w-16 h-16" }: { className?: string }) => {
  if (APP_CONFIG.identity.logoUrl) {
    return <img src={APP_CONFIG.identity.logoUrl} className={`${className} object-contain`} alt="Logo" />;
  }

  // Default SVG Logo
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M40 90 C 40 20, 180 20, 200 110" stroke="#4cc321" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
        <path d="M30 110 C 20 150, 80 170, 120 160" stroke="#4cc321" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="120" cy="95" rx="90" ry="65" fill="#0060af" />
        <circle cx="50" cy="40" r="15" stroke="white" strokeWidth="1" opacity="0.5" fill="white" fillOpacity="0.1" />
        <circle cx="195" cy="140" r="12" stroke="white" strokeWidth="1" opacity="0.5" fill="white" fillOpacity="0.1" />
        <text x="120" y="85" textAnchor="middle" fill="white" fontSize="42" fontWeight="900" style={{ fontFamily: 'sans-serif' }}>Nadhif</text>
        <text x="120" y="115" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>نـظـيـف</text>
        <g transform="translate(120, 135) scale(0.8)">
          <path d="M0 -30 C -15 -10, -10 0, 0 5 C 10 0, 15 -10, 0 -30Z" fill="#4cc321" />
          <path d="M-15 -25 C -30 -10, -25 5, -5 10 C -5 0, -10 -15, -15 -25Z" fill="#3da31a" />
          <path d="M15 -25 C 30 -10, 25 5, 5 10 C 5 0, 10 -15, 15 -25Z" fill="#3da31a" />
        </g>
        <text x="120" y="170" textAnchor="middle" fill="#003d70" fontSize="14" style={{ fontFamily: 'cursive, serif', fontStyle: 'italic' }}>Propreté des lieux</text>
        <path d="M105 50 L108 53 L105 56 L102 53 Z" fill="white" />
      </svg>
    </div>
  );
};

// --- Context & Providers ---
const LanguageContext = createContext<any>(undefined);
const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'ar');
  const setLanguage = (lang: Language) => { setLangState(lang); localStorage.setItem('language', lang); };
  useEffect(() => {
    document.documentElement.dir = translations[language].dir;
    document.documentElement.lang = language;
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>{children}</LanguageContext.Provider>;
};
const useTranslation = () => useContext(LanguageContext);

const InstallContext = createContext<any>(null);
const InstallProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    });
  };

  return (
    <InstallContext.Provider value={{ installPrompt, handleInstall, isInstalled }}>
      {children}
    </InstallContext.Provider>
  );
};
const useInstall = () => useContext(InstallContext);

// --- LocalStorage Helpers ---
const getStoredBookings = (): Booking[] => {
  try {
    const data = localStorage.getItem('bookings');
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

const saveBookingToStorage = (booking: Booking) => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex(b => b.id === booking.id);
  
  if (index !== -1) {
    // Update existing
    bookings[index] = booking;
  } else {
    // Add new
    bookings.unshift(booking);
  }
  
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

// --- Components ---

const ServiceCard = React.memo(({ service, onClick, t }: { service: ServiceItem, onClick: () => void, t: any }) => {
  const { language } = useTranslation();
  const Icon = useMemo(() => {
    const iconMap: Record<string, React.ElementType> = {
      'Sparkles': Sparkles,
      'ShieldCheck': ShieldCheck,
      'Zap': Zap,
      'Armchair': Armchair,
      'Utensils': Utensils,
      'Home': Home
    };
    return iconMap[service.icon] || Sparkles;
  }, [service.icon]);

  return (
    <div onClick={onClick} className="group bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 hover:border-primary active:scale-[0.98] transition-all cursor-pointer">
      <div className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 relative">
        <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur p-1.5 rounded-xl text-primary shadow-sm border border-white">
          <Icon size={18} />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Star size={12} className="text-secondary fill-secondary" />
          <span className="text-[10px] font-bold text-slate-500">{service.rating} ({service.reviewsCount})</span>
        </div>
        <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{service.title}</h4>
        <p className="text-[10px] text-slate-400 line-clamp-1 mb-2">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-black text-sm">{service.priceStart} <span className="text-[10px] font-normal text-slate-400">{language === 'ar' ? APP_CONFIG.currency.symbolAr : APP_CONFIG.currency.symbolEn}</span></span>
          <div className="bg-secondary/10 group-hover:bg-secondary group-hover:text-white text-secondary p-1.5 rounded-full transition-colors">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
});

const ServiceDetailsModal = ({ service, onClose, onBook, t, language }: { 
  service: ServiceItem, 
  onClose: () => void, 
  onBook: () => void, 
  t: any,
  language: string
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all border border-white/20"
        >
          <X size={20} />
        </button>

        <div className="relative h-64 shrink-0">
          <img src={service.image} className="w-full h-full object-cover" alt={service.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                {language === 'ar' ? 'مميز' : 'Premium'}
              </span>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white text-xs border border-white/20">
                <Star size={12} className="fill-secondary text-secondary" />
                <span className="font-bold">{service.rating} ({service.reviewsCount} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>
            <h2 className="text-2xl font-black text-white">{service.title}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">{language === 'ar' ? 'عن الخدمة' : 'About Service'}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {service.description} {language === 'ar' ? 'نحن نضمن لك جودة عالية وأداءً احترافياً باستخدام أفضل المعدات ومواد التنظيف الصديقة للبيئة.' : 'We guarantee high quality and professional performance using the best equipment and eco-friendly cleaning materials.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-2xl shadow-sm text-secondary"><Clock size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ar' ? 'المدة' : 'Duration'}</p>
                  <p className="text-xs font-black text-slate-800">2-4 {language === 'ar' ? 'ساعات' : 'hours'}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-2xl shadow-sm text-primary"><ShieldCheck size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ar' ? 'الضمان' : 'Guarantee'}</p>
                  <p className="text-xs font-black text-slate-800">{language === 'ar' ? '100% رضا' : '100% Satisfied'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">{language === 'ar' ? 'ماذا تشمل؟' : 'What is included?'}</h3>
              <ul className="space-y-3">
                {[
                  language === 'ar' ? 'فريق عمل مدرب ومحترف' : 'Trained professional team',
                  language === 'ar' ? 'مواد تنظيف أصلية وعالية الجودة' : 'High quality original cleaning materials',
                  language === 'ar' ? 'متابعة ما بعد الخدمة' : 'Post-service follow-up'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                    <div className="w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-8 pt-4 bg-white border-t border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">{language === 'ar' ? 'يبدأ من' : 'Starting from'}</p>
              <p className="text-2xl font-black text-primary">{service.priceStart} <span className="text-sm font-bold text-slate-400">{language === 'ar' ? APP_CONFIG.currency.symbolAr : APP_CONFIG.currency.symbolEn}</span></p>
            </div>
            <div className="flex flex-col items-end">
               <div className="flex gap-1 text-secondary mb-1">
                 {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-secondary" />)}
               </div>
               <span className="text-[10px] font-black text-slate-400">BEST CHOICE</span>
            </div>
          </div>
          <button 
            onClick={onBook}
            className="w-full bg-secondary text-white py-4.5 rounded-[2rem] font-black text-lg shadow-xl shadow-secondary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Zap size={20} fill="white" />
            {language === 'ar' ? 'احجز موعداً الآن' : 'Book Appointment Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useTranslation();
  const service = APP_CONFIG.services.find(s => s.id === serviceId);

  // Check if we are editing an existing booking passed via navigation state
  const existingBooking = location.state?.booking as Booking | undefined;

  const [formData, setFormData] = useState<BookingDetails>({
    serviceId: serviceId || '',
    date: existingBooking?.date || '',
    time: existingBooking?.time || '',
    name: existingBooking?.name || '',
    phone: existingBooking?.phone || '',
    wilaya: existingBooking?.wilaya || APP_CONFIG.locations[0],
    address: existingBooking?.address || ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(APP_CONFIG.paymentMethods[0].id);

  if (!service) return <div className="p-10 text-center">{language === 'ar' ? 'الخدمة غير موجودة' : 'Service not found'}</div>;

  const steps = [
    { title: language === 'ar' ? 'الموعد' : 'Schedule', icon: CalendarIcon },
    { title: language === 'ar' ? 'العنوان' : 'Location', icon: MapPinIcon },
    { title: language === 'ar' ? 'الاتصال' : 'Contact', icon: UserIcon },
    { title: language === 'ar' ? 'الدفع' : 'Payment', icon: CreditCard }
  ];

  const canProceed = () => {
    switch(currentStep) {
      case 0: return !!(formData.date && formData.time);
      case 1: return !!(formData.wilaya && formData.address);
      case 2: return !!(formData.name && formData.phone);
      default: return true;
    }
  };

  const handleNext = () => {
    if (canProceed()) setCurrentStep(p => Math.min(steps.length - 1, p + 1));
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(p => p - 1);
    else navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking: Booking = {
        ...formData,
        id: existingBooking?.id || Math.random().toString(36).substr(2, 9),
        status: existingBooking?.status || 'upcoming',
        trackingStatus: existingBooking?.trackingStatus || 'confirmed',
        createdAt: existingBooking?.createdAt || new Date().toISOString(),
        serviceTitle: service.title,
        price: service.priceStart,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid' // Simplified logic
      };
      saveBookingToStorage(newBooking);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
        <AppLogo className="w-48 h-48 mb-4" />
        <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-secondary/30">
          <Check size={32} strokeWidth={4} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          {language === 'ar' 
            ? (existingBooking ? 'تم تحديث الحجز بنجاح!' : 'طلبك في أيدٍ أمينة!') 
            : (existingBooking ? 'Booking Updated Successfully!' : 'Your Request is in Good Hands!')}
        </h2>
        <p className="text-slate-500 mb-8 max-w-xs">{language === 'ar' ? `سنقوم بمراجعة طلبك وإرسال فريق "${APP_CONFIG.identity.appNameAr}" في الموعد المحدد.` : `We will review your request and send the ${APP_CONFIG.identity.appNameEn} team on time.`}</p>
        <button 
          onClick={() => navigate('/bookings')}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 mb-3 active:scale-95 transition-all"
        >
          {language === 'ar' ? 'تتبع الحجز' : 'Track Booking'}
        </button>
        <button onClick={() => navigate('/')} className="text-primary font-bold hover:underline">
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10 flex flex-col">
      <header className="bg-white p-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className={language === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h2 className="font-black text-lg text-slate-800">{language === 'ar' ? (existingBooking ? 'تعديل الحجز' : 'تفاصيل الحجز') : (existingBooking ? 'Edit Booking' : 'Booking Details')}</h2>
      </header>

      {/* Stepper */}
      <div className="w-full bg-white pt-2 pb-4 px-8 shadow-sm border-b border-slate-100 mb-6">
        <div className="flex justify-between relative">
          <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
          <div 
            className="absolute top-4 left-0 h-1 bg-secondary -z-10 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            
            return (
              <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
                  isActive || isCompleted
                    ? 'bg-secondary border-secondary text-white scale-110 shadow-lg shadow-secondary/20' 
                    : 'bg-white border-slate-200 text-slate-300'
                }`}>
                  {isCompleted ? <Check size={14} strokeWidth={4} /> : <Icon size={14} />}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-secondary' : 'text-slate-300'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-5 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
          
          <div className="flex-1">
            {currentStep === 0 && (
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="bg-primary/10 p-2.5 rounded-2xl text-primary"><CalendarIcon size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{language === 'ar' ? 'متى نأتي إليك؟' : 'When should we come?'}</h4>
                    <p className="text-xs text-slate-400">{language === 'ar' ? 'اختر التاريخ والوقت المناسبين' : 'Choose preferred date & time'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ar' ? 'التاريخ' : 'Date'}</label>
                    <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ar' ? 'الوقت' : 'Time'}</label>
                    <input required type="time" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}/>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 1 && (
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="bg-primary/10 p-2.5 rounded-2xl text-primary"><MapPinIcon size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{language === 'ar' ? 'أين يقع منزلك؟' : 'Where is your home?'}</h4>
                    <p className="text-xs text-slate-400">{language === 'ar' ? 'نحتاج العنوان للوصول إليك' : 'We need address to reach you'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ar' ? 'الولاية' : 'Wilaya'}</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-base outline-none appearance-none focus:ring-2 focus:ring-primary/20 transition-all" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                        {APP_CONFIG.locations.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <ChevronLeft className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 ${language === 'ar' ? 'left-4' : 'right-4 rotate-180'}`} size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ar' ? 'العنوان بالتفصيل' : 'Detailed Address'}</label>
                    <textarea required rows={3} placeholder={language === 'ar' ? 'رقم البيت، الطابق، الحي...' : 'Street, Building no, Floor...'} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-base outline-none resize-none focus:ring-2 focus:ring-primary/20 transition-all" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}/>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 2 && (
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="bg-primary/10 p-2.5 rounded-2xl text-primary"><UserIcon size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{language === 'ar' ? 'كيف نتواصل معك؟' : 'How to contact you?'}</h4>
                    <p className="text-xs text-slate-400">{language === 'ar' ? 'معلوماتك آمنة معنا' : 'Your info is safe with us'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input required type="text" placeholder={language === 'ar' ? 'أدخل اسمك' : 'Your full name'} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input required type="tel" placeholder="05 / 06 / 07 ..." className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <section className="bg-primary text-white p-6 rounded-[2rem] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <h4 className="font-bold text-lg mb-4 relative z-10">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h4>
                  <div className="space-y-3 relative z-10 text-sm">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="opacity-80">{language === 'ar' ? 'الخدمة' : 'Service'}</span>
                      <span className="font-bold">{service.title}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="opacity-80">{language === 'ar' ? 'الموعد' : 'Date'}</span>
                      <span className="font-bold dir-ltr">{formData.date} | {formData.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">{language === 'ar' ? 'السعر' : 'Price'}</span>
                      <span className="font-black text-xl">{service.priceStart} {language === 'ar' ? APP_CONFIG.currency.symbolAr : APP_CONFIG.currency.symbolEn}</span>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h4>
                  <div className="space-y-3">
                    {APP_CONFIG.paymentMethods.map(method => {
                      const icons: Record<string, React.ElementType> = { 'Wallet': Wallet, 'CreditCard': CreditCard };
                      const MethodIcon = icons[method.icon] || Wallet;
                      const isSelected = paymentMethod === method.id;

                      return (
                        <div 
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-secondary bg-secondary/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-secondary' : 'border-slate-300'}`}>
                            {isSelected && <div className="w-3 h-3 bg-secondary rounded-full"></div>}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <MethodIcon size={18} className="text-slate-600" />
                              <span className="font-bold text-slate-800">{language === 'ar' ? method.titleAr : method.titleEn}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{language === 'ar' ? method.descriptionAr : method.descriptionEn}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
          </div>

          <div className="mt-4">
            {currentStep < steps.length - 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none active:scale-95 transition-all"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
                <ArrowRight size={20} className={language === 'ar' ? 'rotate-180' : ''} />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:bg-slate-300 active:scale-95 transition-all"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><Check size={24} strokeWidth={3} />{language === 'ar' ? (existingBooking ? 'تحديث الحجز' : 'تأكيد وحجز') : (existingBooking ? 'Update Booking' : 'Confirm & Book')}</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const filteredServices = useMemo(() => {
    return APP_CONFIG.services.filter(s => 
      s.title.toLowerCase().includes(search.toLowerCase()) && 
      (category === 'all' || (category === 'fast' && ['quick-clean', 'kitchen-clean'].includes(s.id)) || (category === 'deep' && ['deep-clean', 'move-in'].includes(s.id)))
    );
  }, [search, category]);

  return (
    <div className="pb-28 animate-in fade-in duration-500">
      <header className="bg-primary pt-6 pb-24 px-6 rounded-b-[4rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/15 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-20 -mb-20 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/20 pr-4">
              <AppLogo className="w-12 h-12" />
              <h1 className="text-lg font-black text-white tracking-tight ml-2">{language === 'ar' ? APP_CONFIG.identity.appNameEn : APP_CONFIG.identity.appNameAr}</h1>
            </div>
            <Link to="/notifications" className="bg-white/20 p-3 rounded-full text-white relative hover:bg-white/30 transition-all active:scale-90">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full absolute top-2.5 right-2.5 border-2 border-primary ring-2 ring-primary/20"></div>
              <Bell size={22} />
            </Link>
          </div>
          
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white leading-[1.1] mb-3 drop-shadow-md">
              {language === 'ar' ? APP_CONFIG.identity.taglineAr : APP_CONFIG.identity.taglineEn}
            </h2>
            <p className="text-blue-50/70 text-sm max-w-[85%] font-medium">
              {language === 'ar' ? APP_CONFIG.identity.descriptionAr : APP_CONFIG.identity.descriptionEn}
            </p>
          </div>
          
          <div className="relative group">
            <Search className={`absolute ${language === 'ar' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors`} size={20} />
            <input 
              type="text" 
              placeholder={language === 'ar' ? 'عن أي خدمة تبحث؟' : 'Search for a service...'} 
              className={`w-full h-16 bg-white rounded-3xl ${language === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} text-slate-800 shadow-2xl border-none focus:ring-8 focus:ring-secondary/10 transition-all outline-none text-base font-medium`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="px-5 -mt-10 relative z-20">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-2 px-1">
          {['all', 'fast', 'deep'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)} 
              className={`px-8 py-3.5 rounded-2xl text-[13px] font-black transition-all shadow-md border-2 whitespace-nowrap ${category === cat ? 'bg-secondary text-white border-secondary shadow-secondary/20' : 'bg-white text-slate-500 border-white hover:border-slate-100'}`}
            >
              {cat === 'all' ? (language === 'ar' ? 'الكل' : 'All') : cat === 'fast' ? (language === 'ar' ? 'سريع' : 'Fast') : (language === 'ar' ? 'عميق' : 'Deep')}
            </button>
          ))}
        </div>

        <div className="mt-10 space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl font-black text-slate-800">{t.home.servicesTitle}</h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">{filteredServices.length} {language === 'ar' ? 'خدمات' : 'Services'}</span>
            </div>
          </div>
          
          <div className="grid gap-4">
            {filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  t={t} 
                  onClick={() => setSelectedService(service)} 
                />
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search size={32} />
                </div>
                <p className="text-slate-400 font-bold">{language === 'ar' ? 'لم نجد ما تبحث عنه' : 'No results found'}</p>
                <button onClick={() => {setSearch(''); setCategory('all')}} className="mt-4 text-primary font-bold text-sm">{language === 'ar' ? 'مسح البحث' : 'Clear search'}</button>
              </div>
            )}
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="mt-10 bg-accent p-6 rounded-[3rem] text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full -mr-16 -mt-16 blur-2xl opacity-40"></div>
           <div className="relative z-10 flex items-center justify-between">
             <div>
               <h4 className="text-lg font-black mb-1">{language === 'ar' ? 'خصم 20% على الحجز الأول' : '20% Off Your First Booking'}</h4>
               <p className="text-xs opacity-70">{language === 'ar' ? 'استخدم الرمز: STAR20' : 'Use code: STAR20'}</p>
             </div>
             <div className="bg-white/10 p-4 rounded-3xl"><Zap size={24} className="text-secondary" /></div>
           </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailsModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
          onBook={() => {
            const id = selectedService.id;
            setSelectedService(null);
            navigate(`/book/${id}`);
          }} 
          t={t}
          language={language}
        />
      )}
    </div>
  );
};

const MyBookingsPage = () => {
  const { t, language } = useTranslation();
  const [bookings] = useState<Booking[]>(getStoredBookings());
  const navigate = useNavigate();
  
  return (
    <div className="pb-24 min-h-screen bg-slate-50 animate-in fade-in duration-500">
      <header className="bg-white p-6 sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <h2 className="font-black text-2xl text-slate-800">{t.nav.bookings}</h2>
      </header>
      
      <div className="p-5 space-y-5">
        {bookings.length === 0 ? (
          <div className="py-24 text-center space-y-5 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <CalendarIcon size={48} />
            </div>
            <div>
              <p className="text-slate-400 font-black text-lg">{language === 'ar' ? 'حجوزاتك فارغة' : 'No bookings yet'}</p>
              <p className="text-slate-300 text-sm px-10 mt-1">{language === 'ar' ? 'احجز أول خدمة تنظيف اليوم واستمتع براحة البال.' : 'Book your first cleaning today and enjoy peace of mind.'}</p>
            </div>
            <Link to="/" className="inline-block bg-primary text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-primary/20">
              {language === 'ar' ? 'تصفح الخدمات' : 'Explore Services'}
            </Link>
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary p-3.5 h-fit rounded-2xl">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg leading-tight">{b.serviceTitle}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-bold">
                      <div className="flex items-center gap-1"><CalendarIcon size={12} /> {b.date}</div>
                      <div className="flex items-center gap-1"><Clock size={12} /> {b.time}</div>
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border ${
                  b.status === 'upcoming' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {language === 'ar' ? (b.status === 'upcoming' ? 'قادم' : 'مكتمل') : b.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
                <MapPinIcon size={14} className="text-secondary shrink-0" />
                <span className="truncate">{b.wilaya}, {b.address}</span>
              </div>

              {b.status === 'upcoming' && (
                <div className="pt-2 flex gap-3">
                  <button className="flex-1 bg-slate-50 text-slate-500 font-black py-3 rounded-xl text-xs hover:bg-slate-100 transition-colors">
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    onClick={() => navigate(`/book/${b.serviceId}`, { state: { booking: b } })}
                    className="flex-1 bg-primary/10 text-primary font-black py-3 rounded-xl text-xs hover:bg-primary/20 transition-colors"
                  >
                    {language === 'ar' ? 'تعديل' : 'Modify'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { t, language, setLanguage } = useTranslation();
  const [avatar, setAvatar] = useState<string>(localStorage.getItem('userAvatar') || "https://i.pravatar.cc/150?u=nadhif");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { installPrompt, handleInstall, isInstalled } = useInstall();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatar(result);
        localStorage.setItem('userAvatar', result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="pb-24 min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="bg-primary pt-12 pb-24 px-6 rounded-b-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-2xl relative mb-4 ring-8 ring-white/10 group">
            <img src={avatar} className="w-full h-full rounded-full object-cover" alt="Profile" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full border-4 border-primary shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <Camera size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <h3 className="text-white font-black text-2xl">عمر الجزائري</h3>
          <p className="text-blue-100/70 text-sm font-bold mt-1">{APP_CONFIG.contact.phone}</p>
        </div>
      </header>

      <div className="px-5 -mt-12 relative z-20 space-y-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-2 border border-slate-100">
           <div className="p-4 flex items-center justify-between border-b border-slate-50">
             <div className="flex items-center gap-4">
               <div className="bg-secondary/10 p-3 rounded-2xl text-secondary"><MapPinIcon size={20} /></div>
               <div>
                 <p className="font-bold text-slate-800">{language === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses'}</p>
                 <p className="text-[10px] text-slate-400">2 {language === 'ar' ? 'عناوين' : 'addresses'}</p>
               </div>
             </div>
             <ChevronRight className={`text-slate-300 ${language === 'ar' ? 'rotate-180' : ''}`} size={20} />
           </div>
           
           <div className="p-4 flex items-center justify-between border-b border-slate-50">
             <div className="flex items-center gap-4">
               <div className="bg-primary/10 p-3 rounded-2xl text-primary"><CreditCard size={20} /></div>
               <div>
                 <p className="font-bold text-slate-800">{language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}</p>
                 <p className="text-[10px] text-slate-400">{language === 'ar' ? 'نقد عند الخدمة' : 'Cash on Service'}</p>
               </div>
             </div>
             <ChevronRight className={`text-slate-300 ${language === 'ar' ? 'rotate-180' : ''}`} size={20} />
           </div>

           <div className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="bg-accent/10 p-3 rounded-2xl text-accent"><Info size={20} /></div>
               <div>
                 <p className="font-bold text-slate-800">{language === 'ar' ? 'مركز المساعدة' : 'Help Center'}</p>
                 <p className="text-[10px] text-slate-400">{APP_CONFIG.contact.email}</p>
               </div>
             </div>
             <ChevronRight className={`text-slate-300 ${language === 'ar' ? 'rotate-180' : ''}`} size={20} />
           </div>
        </div>

        {!isInstalled && installPrompt && (
          <button onClick={handleInstall} className="w-full bg-slate-800 text-white py-5 rounded-[2.5rem] font-black flex items-center justify-center gap-3 border border-slate-700 active:scale-95 transition-all mb-4 shadow-lg shadow-slate-300/50">
            <Download size={20} />
            {language === 'ar' ? 'تثبيت التطبيق' : 'Install App'}
          </button>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-sm p-2 border border-slate-100">
          <div className="p-4 flex items-center justify-between" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}>
             <div className="flex items-center gap-4">
               <div className="bg-slate-100 p-3 rounded-2xl text-slate-500"><Star size={20} /></div>
               <div>
                 <p className="font-bold text-slate-800">{language === 'ar' ? 'اللغة' : 'Language'}</p>
                 <p className="text-[10px] text-slate-400 font-bold">{language === 'ar' ? 'العربية' : 'English'}</p>
               </div>
             </div>
             <div className="w-12 h-6 bg-slate-100 rounded-full relative p-1 cursor-pointer">
               <div className={`w-4 h-4 bg-primary rounded-full transition-all ${language === 'en' ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </div>
          </div>
        </div>

        <button className="w-full bg-red-50 text-red-500 py-5 rounded-[2.5rem] font-black flex items-center justify-center gap-3 border border-red-100 active:scale-95 transition-all">
          <LogOut size={20} />
          {language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
        </button>
      </div>
    </div>
  );
};

const NotificationsPage = () => {
  const { language } = useTranslation();
  const navigate = useNavigate();
  
  const notifications: Notification[] = [
    { id: '1', title: 'تأكيد الحجز', message: 'تم تأكيد طلب التنظيف العميق ليوم الغد.', timestamp: 'قبل ساعة', type: 'booking', read: false },
    { id: '2', title: 'عرض خاص', message: 'احصل على خصم 15% على تنظيف الأرائك هذا الأسبوع!', timestamp: 'قبل 3 ساعات', type: 'offer', read: true },
    { id: '3', title: 'تحديث النظام', message: 'نحن الآن نوفر خدماتنا في ولاية سطيف!', timestamp: 'أمس', type: 'system', read: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="bg-white p-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className={language === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h2 className="font-black text-lg text-slate-800">{language === 'ar' ? 'التنبيهات' : 'Notifications'}</h2>
      </header>

      <div className="p-5 space-y-4">
        {notifications.map(n => (
          <div key={n.id} className={`p-5 rounded-[2rem] border transition-all ${n.read ? 'bg-white border-slate-100 opacity-70' : 'bg-primary/5 border-primary/10 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${n.type === 'booking' ? 'bg-secondary text-white' : n.type === 'offer' ? 'bg-orange-500 text-white' : 'bg-primary text-white'}`}>
                  {n.type === 'booking' ? <Check size={16} /> : n.type === 'offer' ? <Zap size={16} /> : <Info size={16} />}
                </div>
                <h4 className="font-black text-slate-800">{n.title}</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{n.timestamp}</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;
  if (['/book', '/notifications'].some(p => path.startsWith(p))) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-6 pt-2 z-40">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 flex justify-around items-center p-3 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        {[ 
          { to: '/', icon: Home, label: t.nav.home }, 
          { to: '/bookings', icon: Calendar, label: t.nav.bookings }, 
          { to: '/profile', icon: User, label: t.nav.profile } 
        ].map(item => {
          const isActive = path === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 scale-110 shadow-inner' : 'hover:bg-slate-50'}`}>
                <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <InstallProvider>
      <HashRouter>
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl relative overflow-x-hidden font-sans border-x border-slate-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:serviceId" element={<BookingForm />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
          <BottomNav />
          <AIChat />
        </div>
      </HashRouter>
    </InstallProvider>
  </LanguageProvider>
);

export default App;
