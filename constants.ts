
import { AppConfig, ServiceItem } from './types';

// --- CUSTOMIZE YOUR APP HERE ---
export const APP_CONFIG: AppConfig = {
  identity: {
    appNameAr: "نظيف ستار",
    appNameEn: "Nadhif Star",
    // Set to a URL (e.g., "https://example.com/logo.png") to use an image, or null to use the built-in SVG
    logoUrl: null, 
    taglineAr: "نظافة احترافية.. لحياة أرقى",
    taglineEn: "Professional Clean for a Better Life",
    descriptionAr: "اختر خدمتك المفضلة ودع خبراء 'نظيف ستار' يتكفلون بالباقي بجودة جزائرية 100%.",
    descriptionEn: "Choose your service and let Nadhif Star experts handle the rest with 100% quality."
  },
  contact: {
    phone: "0550 12 34 56",
    email: "contact@nadhifstar.dz",
    website: "www.nadhifstar.dz"
  },
  currency: {
    code: "DZD",
    symbolAr: "دج",
    symbolEn: "DA"
  },
  locations: [
    "الجزائر العاصمة", "البليدة", "تيبازة", "بومرداس", "وهران", 
    "قسنطينة", "سطيف", "تيزي وزو", "عنابة", "بجاية", 
    "تلمسان", "جيجل", "باتنة", "بسكرة"
  ],
  paymentMethods: [
    {
      id: 'cash',
      titleAr: 'الدفع نقداً',
      titleEn: 'Cash on Service',
      descriptionAr: 'الدفع عند الانتهاء من الخدمة',
      descriptionEn: 'Pay after service completion',
      icon: 'Wallet'
    },
    {
      id: 'card',
      titleAr: 'البطاقة الذهبية / CIB',
      titleEn: 'Edahabia / CIB',
      descriptionAr: 'دفع إلكتروني آمن وسريع',
      descriptionEn: 'Fast and secure online payment',
      icon: 'CreditCard'
    }
  ],
  services: [
    {
      id: 'deep-clean',
      title: 'تنظيف عميق',
      description: 'تنظيف شامل للمنازل والفلل يشمل الأرضيات، النوافذ، والزوايا الصعبة.',
      priceStart: 4500,
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1581578731117-104f2a9dc6a2?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 142
    },
    {
      id: 'standard-clean',
      title: 'تنظيف دوري',
      description: 'حل مثالي للحفاظ على نظافة منزلك أسبوعياً أو شهرياً بأسعار تنافسية.',
      priceStart: 2800,
      icon: 'ShieldCheck',
      image: 'https://images.unsplash.com/photo-1558317374-a3594743e9c7?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewsCount: 95
    },
    {
      id: 'sofa-clean',
      title: 'غسيل الأرائك والسجاد',
      description: 'إزالة البقع والروائح الكريهة من المفروشات باستخدام تقنية البخار المتطورة.',
      priceStart: 3500,
      icon: 'Armchair',
      image: 'https://images.unsplash.com/photo-1633505899105-0819777174e1?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 68
    },
    {
      id: 'kitchen-clean',
      title: 'تنظيف المطابخ',
      description: 'إزالة الدهون المستعصية وتنظيف الأفران والثلاجات ليعود مطبخك جديداً.',
      priceStart: 3000,
      icon: 'Utensils',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 42
    },
    {
      id: 'quick-clean',
      title: 'تنظيف سريع',
      description: 'خدمة سريعة للغرف الرئيسية قبل الحفلات أو المناسبات المفاجئة.',
      priceStart: 1800,
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      reviewsCount: 52
    },
    {
      id: 'move-in',
      title: 'تنظيف بعد البناء',
      description: 'تجهيز المنازل الجديدة أو المرممة وإزالة بقايا الطلاء والجبس بالكامل.',
      priceStart: 9500,
      icon: 'Home',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 38
    }
  ]
};

// Backwards compatibility exports
export const SERVICES = APP_CONFIG.services;
export const ALGERIA_WILAYAS = APP_CONFIG.locations;
