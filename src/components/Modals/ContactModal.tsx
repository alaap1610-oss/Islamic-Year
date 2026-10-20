import React, { useState } from 'react';
import { X, Mail, Copy, Check, MessageSquare, PhoneCall, ExternalLink } from 'lucide-react';
import { OWNER_ADMIN_EMAIL } from '../../services/firebaseAuth';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(OWNER_ADMIN_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <h2 className="text-base font-bold">যোগাযোগ করুন</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Islamic Life সম্পর্কিত যেকোনো প্রশ্ন, পরামর্শ, প্রযুক্তিগত জিজ্ঞাসা বা মতামতের জন্য সরাসরি আমাদের অফিসিয়াল জিমেইলে যোগাযোগ করতে পারেন:
          </p>

          {/* Gmail Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              অফিসিয়াল যোগাযোগ ইমেইল
            </span>
            <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-emerald-300">
              <div className="flex items-center gap-2 overflow-hidden">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-gray-800 font-mono truncate">
                  {OWNER_ADMIN_EMAIL}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0 ml-2"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
              </button>
            </div>
          </div>

          {/* Send Direct Email Button */}
          <a
            href={`mailto:${OWNER_ADMIN_EMAIL}?subject=Islamic Life App Feedback&body=আসসালামু আলাইকুম,%0D%0Aইসলামিক লাইফ অ্যাপ সম্পর্কে আমার মতামত:`}
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Mail className="w-4 h-4" />
            <span>সরাসরি জিমেইলে বার্তা পাঠান</span>
          </a>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500">
            আমরা সাধারণত ২৪ ঘণ্টার মধ্যে সকল অনুসন্ধান ও বার্তার উত্তর দিয়ে থাকি। জাযাকাল্লাহু খাইরান।
          </div>
        </div>

      </div>
    </div>
  );
};
