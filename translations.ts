
export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    dir: 'rtl',
    nav: { home: 'الرئيسية', bookings: 'حجوزاتي', profile: 'حسابي' },
    common: { 
      algeria: 'الجزائر 🇩🇿', 
      back: 'رجوع', 
      save: 'حفظ', 
      cancel: 'إلغاء', 
      delete: 'حذف', 
      confirm: 'تأكيد', 
      loading: 'جاري...', 
      dz: 'دج' 
    },
    home: {
      heroTitle: 'نظافة احترافية.. لحياة أرقى',
      heroSubtitle: 'اختر خدمتك المفضلة ودع خبراء "نظيف ستار" يتكفلون بالباقي بجودة جزائرية 100%.',
      guarantee: 'ضمان الجودة',
      guaranteeSub: 'عمال محترفون وموثوقون',
      servicesTitle: 'خدماتنا المميزة',
      bookNow: 'احجز الآن'
    },
    profile: {
      addresses: 'عناويني',
      payments: 'الدفع',
      support: 'الدعم',
      language: 'اللغة',
      logout: 'خروج'
    }
  },
  en: {
    dir: 'ltr',
    nav: { home: 'Home', bookings: 'My Bookings', profile: 'Profile' },
    common: { 
      algeria: 'Algeria 🇩🇿', 
      back: 'Back', 
      save: 'Save', 
      cancel: 'Cancel', 
      delete: 'Delete', 
      confirm: 'Confirm', 
      loading: 'Loading...', 
      dz: 'DZD' 
    },
    home: {
      heroTitle: 'Professional Clean for a Better Life',
      heroSubtitle: 'Choose your service and let Nadhif Star experts handle the rest with 100% quality.',
      guarantee: 'Quality Guarantee',
      guaranteeSub: 'Professional & trusted staff',
      servicesTitle: 'Premium Services',
      bookNow: 'Book Now'
    },
    profile: {
      addresses: 'My Addresses',
      payments: 'Payments',
      support: 'Support',
      language: 'Language',
      logout: 'Logout'
    }
  }
};
