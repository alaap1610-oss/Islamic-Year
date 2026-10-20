import React, { useState } from 'react';
import { X, Flag, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { OWNER_ADMIN_EMAIL } from '../../services/firebaseAuth';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('পরামর্শ বা ত্রুটি');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    // Compose mailto body to send directly to user's Gmail
    const mailtoSubject = encodeURIComponent(`[Islamic Life Report] ${category}: ${subject || 'ব্যবহারকারীর অভিযোগ'}`);
    const mailtoBody = encodeURIComponent(
      `ক্যাটাগরি: ${category}\n` +
      `শিরোনাম: ${subject}\n\n` +
      `বিস্তারিত অভিযোগ / ত্রুটি:\n${details}\n\n` +
      `ডিভাইস তথ্য: ${navigator.userAgent}\n` +
      `তারিখ: ${new Date().toLocaleString()}`
    );

    // Open user's email client
    window.location.href = `mailto:${OWNER_ADMIN_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-800 to-rose-950 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-300" />
            <h2 className="text-base font-bold">সমস্যা বা অভিযোগ রিপোর্ট করুন</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-gray-800">
                অভিযোগ প্রেরণের লিংক তৈরি হয়েছে!
              </h3>
              <p className="text-xs text-gray-600">
                আপনার অভিযোগ সরাসরি <strong>{OWNER_ADMIN_EMAIL}</strong> এ পাঠানো হচ্ছে। আমরা দ্রুত ত্রুটি সমাধানের ব্যবস্থা গ্রহণ করব।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                অ্যাপের কোনো ভুল সময়, বাগ বা ত্রুটি নজরে এলে লিখুন। এটি সরাসরি আমাদের অফিসিয়াল জিমেইলে পৌঁছাবে:
              </p>

              {/* Category */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  বিষয়ের ধরন:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-emerald-600"
                >
                  <option value="নামাজের সময় বা তারিখ সংক্রান্ত ভুল">নামাজের সময় বা তারিখ সংক্রান্ত ভুল</option>
                  <option value="আমল ট্র্যাকারে সমস্যা">আমল ট্র্যাকারে সমস্যা</option>
                  <option value="নোটিফিকেশন সমস্যা">নোটিফিকেশন সমস্যা</option>
                  <option value="কুরআন ও দোয়ার বানানের ত্রুটি">কুরআন ও দোয়ার বানানের ত্রুটি</option>
                  <option value="অন্যান্য পরামর্শ বা অভিযোগ">অন্যান্য পরামর্শ বা অভিযোগ</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  সংক্ষিপ্ত শিরোনাম:
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মাগরিবের সময় ১ মিনিট ব্যবধান..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 focus:outline-emerald-600"
                />
              </div>

              {/* Details */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  বিস্তারিত বিবরণ*:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="সমস্যার বিস্তারিত বর্ণনা লিখুন..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 focus:outline-emerald-600 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>অভিযোগ পাঠান (Send to Gmail)</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
