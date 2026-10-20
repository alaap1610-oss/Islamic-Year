import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  BellRing,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsModalOpen,
    setIsNotificationsModalOpen,
    isPushActive,
    fcmToken,
    enablePushNotifications,
    disablePushNotifications,
    notificationHistory
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isNotificationsModalOpen) return null;

  const handleTogglePush = async () => {
    setLoading(true);
    setFeedback(null);
    if (!isPushActive) {
      const res = await enablePushNotifications();
      setFeedback(res.message);
    } else {
      disablePushNotifications();
      setFeedback('নোটিফিকেশন নিষ্ক্রিয় করা হয়েছে।');
    }
    setLoading(false);
  };

  const handleCopyToken = () => {
    if (!fcmToken) return;
    navigator.clipboard.writeText(fcmToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                নোটিফিকেশন ও পুশ অ্যালার্ট
              </h2>
              <p className="text-[11px] text-emerald-100">
                নামাজের ওয়াক্ত ও দৈনিক আমলের নোটিফিকেশন নিয়ন্ত্রণ
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationsModalOpen(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Main Push Toggle Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    isPushActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    FCM Web Push Notification
                  </h3>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {isPushActive
                      ? 'সক্রিয়: ওয়াক্তের আজান ও আমল রিমাইন্ডার আসছে'
                      : 'নিষ্ক্রিয়: কোনো পুশ নোটিফিকেশন আসবে না'}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isPushActive
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {isPushActive ? 'সক্রিয় ✓' : 'বন্ধ'}
              </span>
            </div>

            {feedback && (
              <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-300 text-xs text-emerald-900 font-medium">
                {feedback}
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={handleTogglePush}
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer ${
                isPushActive
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>প্রক্রিয়াকরণ হচ্ছে...</span>
                </>
              ) : isPushActive ? (
                <span>নোটিফিকেশন বন্ধ করুন</span>
              ) : (
                <span>নোটিফিকেশন চালু করুন (অনুমতি দিন)</span>
              )}
            </button>
          </div>

          {/* FCM Token Details (For Multi-device verification) */}
          {fcmToken && (
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ডিভাইস রেজিস্ট্রেশন টোকেন (FCM Token)</span>
                </span>
                <button
                  onClick={handleCopyToken}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2 rounded-xl bg-white border border-gray-200 text-[10px] font-mono text-gray-600 break-all select-all">
                {fcmToken}
              </div>

              <p className="text-[10px] text-gray-500">
                এই অনন্য টোকেনের মাধ্যমে আপনার এই ডিভাইসে নিরাপদ নোটিফিকেশন পাঠানো হয়।
              </p>
            </div>
          )}

          {/* Notifications Inbox */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-800">
              সাম্প্রতিক নোটিফিকেশন ইনবক্স ({notificationHistory.length})
            </h4>

            {notificationHistory.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-xs">
                কোনো নতুন নোটিফিকেশন নেই।
              </div>
            ) : (
              <div className="space-y-2">
                {notificationHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-gray-200 bg-white shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500">
            Islamic Life Notifications Center
          </span>
          <button
            onClick={() => setIsNotificationsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-2xs"
          >
            ঠিক আছে
          </button>
        </div>

      </div>
    </div>
  );
};
