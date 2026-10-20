import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Crown,
  Sliders,
  PhoneCall,
  Gift,
  Flag,
  Share2,
  Star,
  Info,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { OWNER_ADMIN_EMAIL } from '../../services/firebaseAuth';

export const MoreTab: React.FC = () => {
  const {
    authUser,
    isOwnerAdmin,
    setIsSettingsModalOpen,
    setIsAdminModalOpen,
    setIsAboutUsModalOpen,
    setIsContactModalOpen,
    setIsReportModalOpen,
    setIsGoogleAuthModalOpen,
    setAuthModalInitialTab,
    handleGoogleSignOut
  } = useApp();

  const menuItems = [
    {
      id: 'settings',
      icon: Sliders,
      title: 'সেটিংস',
      desc: 'লোকেশন, ভাষা, থিম, হিজরি মাগরিব পরিবর্তন',
      onClick: () => setIsSettingsModalOpen(true)
    },
    // Admin Panel is strictly HIDDEN for regular users, visible ONLY when alaap1610@gmail.com logs in!
    ...(isOwnerAdmin
      ? [
          {
            id: 'admin',
            icon: ShieldCheck,
            title: 'অ্যাডমিন প্যানেল ও নো-কোড থিম',
            desc: 'কোডিং ছাড়া থিম পরিবর্তন ও পুশ নোটিফিকেশন নিয়ন্ত্রণ',
            onClick: () => setIsAdminModalOpen(true),
            badge: 'মালিক / অ্যাডমিন'
          }
        ]
      : []),
    {
      id: 'contact',
      icon: PhoneCall,
      title: 'যোগাযোগ করুন',
      desc: `অফিসিয়াল যোগাযোগ: ${OWNER_ADMIN_EMAIL}`,
      onClick: () => setIsContactModalOpen(true)
    },
    {
      id: 'report',
      icon: Flag,
      title: 'সমস্যা রিপোর্ট করুন',
      desc: 'অভিযোগ লিখে সরাসরি আমাদের জিমেইলে পাঠান',
      onClick: () => setIsReportModalOpen(true)
    },
    {
      id: 'support',
      icon: Gift,
      title: 'ইসলামিক লাইফ অ্যাপে সহায়তা করুন',
      desc: 'দ্বীন প্রচার ও অ্যাপের খেদমতে শরিক হোন',
      onClick: () => alert('জাযাকাল্লাহু খাইরান! আপনার দোয়াই আমাদের সবচেয়ে বড় শক্তি।')
    },
    {
      id: 'share',
      icon: Share2,
      title: 'অ্যাপ শেয়ার করুন',
      desc: 'Islamic Life সম্পর্কে পরিবার ও বন্ধুদের জানান',
      onClick: async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Islamic Life App',
              text: 'দৈনন্দিন সালাত ও আমল ট্র্যাকার ইসলামিক লাইফ ব্যবহার করুন।',
              url: window.location.href
            });
          } catch {}
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('অ্যাপ লিংক কপি হয়েছে!');
        }
      }
    },
    {
      id: 'rate',
      icon: Star,
      title: 'রেটিং দিন',
      desc: 'অ্যাপটি ভালো লাগলে একটি ৫-স্টার রিভিউ দিন',
      onClick: () => alert('ধন্যবাদ! আপনার ৫-স্টার রেটিং আমাদের অনুপ্রাণিত করবে।')
    },
    {
      id: 'about',
      icon: Info,
      title: 'আমাদের সম্পর্কে (Islamic Life রচনা)',
      desc: 'অ্যাপ পরিচিতি, মহৎ উদ্দেশ্য ও আত্মিক প্রেরণা',
      onClick: () => setIsAboutUsModalOpen(true)
    }
  ];

  return (
    <div className="space-y-4 pb-28">
      
      {/* Top Profile Header (Matching Screenshot 2 - with 1. Login and 2. Sign Up) */}
      <div className="bg-gradient-to-b from-teal-100/60 via-emerald-50 to-white px-4 pt-7 pb-5 text-center flex flex-col items-center">
        {authUser ? (
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 rounded-full border-2 border-emerald-500 shadow-sm overflow-hidden mb-2">
              <img
                src={authUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authUser.displayName)}`}
                alt={authUser.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-gray-900">{authUser.displayName}</h2>
              {authUser.isAdmin && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                  অ্যাডমিন (Admin)
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{authUser.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>অ্যাকাউন্ট সংযুক্ত রয়েছে</span>
              </span>
              <button
                onClick={handleGoogleSignOut}
                className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                লগআউট
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-emerald-200 shadow-sm flex items-center justify-center text-gray-400 mb-2">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              আপনার অ্যাকাউন্টে যুক্ত হোন
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
              আপনার আমল প্রগ্রেস স্থায়ীভাবে সংরক্ষণ করতে লগইন অথবা নতুন সাইন আপ করুন।
            </p>

            {/* Both 1. Login and 2. Sign Up Action Buttons */}
            <div className="flex items-center gap-2 mt-3.5">
              <button
                onClick={() => {
                  setAuthModalInitialTab('login');
                  setIsGoogleAuthModalOpen(true);
                }}
                className="py-2 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <span>১. লগইন (Log In)</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalInitialTab('signup');
                  setIsGoogleAuthModalOpen(true);
                }}
                className="py-2 px-4 rounded-full bg-white border border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <span>২. সাইন আপ (Sign Up)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sponsor Banner Card (Matching Screenshot 2) */}
      <div className="mx-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 text-white shadow-md space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-300" />
          <h3 className="text-sm font-bold text-amber-200">
            পৃষ্ঠপোষক হোন
          </h3>
        </div>
        <p className="text-xs text-gray-200 leading-relaxed max-w-sm">
          বিজ্ঞাপনমুক্ত অভিজ্ঞতা ও প্রিমিয়াম সুবিধার জন্য আপনার Google অ্যাকাউন্টে সংযুক্ত থাকুন।
        </p>
        <button
          onClick={() => setIsGoogleAuthModalOpen(true)}
          className="w-full py-2.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 font-bold text-xs text-white backdrop-blur-md transition shadow-2xs cursor-pointer"
        >
          {authUser ? 'অ্যাকাউন্ট ড্যাশবোর্ড' : 'লগইন করুন'}
        </button>
      </div>

      {/* Settings & Menu Rows (Matching Screenshot 2) */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 shadow-xs overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.onClick}
              className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full border border-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    {item.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* App Version Info */}
      <div className="text-center pt-2 pb-4 text-xs text-gray-500">
        Islamic Life • অ্যাপ ভার্শন – 6.3.3
      </div>

    </div>
  );
};
