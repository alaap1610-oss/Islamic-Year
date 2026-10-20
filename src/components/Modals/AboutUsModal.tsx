import React from 'react';
import { X, Heart, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                আমাদের সম্পর্কে (About Islamic Life)
              </h2>
              <p className="text-[11px] text-emerald-100">
                ইসলামিক লাইফ: দ্বীনি জীবনের নিত্যদিনের পথপ্রদর্শক
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Essay Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-gray-700 leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 text-center space-y-2">
            <span className="text-xl font-arabic font-bold text-emerald-900 block">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <h3 className="text-sm font-bold text-gray-900">
              ইসলামিক লাইফ (Islamic Life): দ্বীনের আলোয় আলোকিত জীবনের সঙ্গী
            </h3>
            <p className="text-[11px] text-gray-600 italic">
              &ldquo;নিশ্চয় সালাত মুমিনদের ওপর নির্দিষ্ট সময়ে আবশ্যক করা হয়েছে।&rdquo; [সুরা আন-নিসা: ১০৩]
            </p>
          </div>

          {/* রচনা: অনুচ্ছেদ ১ - ভূমিকা */}
          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>১. ভূমিকা ও পরিচিতি</span>
            </h4>
            <p>
              আধুনিক ব্যস্ততম জীবনের প্রতিটি ধাপে একজন মুমিনের হৃদয় সবসময় খোঁজে আত্মিক শান্তি, আল্লাহর সন্তুষ্টি এবং খাঁটি সুন্নাহভিত্তিক জীবনাচরণ। সেই পবিত্র লক্ষ্যকে সামনে রেখে পরম যত্নে তৈরি করা হয়েছে <strong>ইসলামিক লাইফ (Islamic Life)</strong>। এটি কেবল একটি সাধারণ মোবাইল বা ওয়েব অ্যাপ্লিকেশন নয়, বরং প্রতিটি মুসলিমের দৈনন্দিন ইবাদত, আমল ও দ্বীনি চেতনাকে উজ্জীবিত রাখার একটি নির্ভরযোগ্য বিশ্বস্ত প্রতিষ্ঠান।
            </p>
          </section>

          {/* রচনা: অনুচ্ছেদ ২ - লক্ষ্য ও উদ্দেশ্য */}
          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>২. আমাদের মূল লক্ষ্য ও উদ্দেশ্য</span>
            </h4>
            <p>
              ইসলামিক লাইফ-এর প্রধান উদ্দেশ্য হলো প্রযুক্তির ইতিবাচক ব্যবহারের মাধ্যমে উম্মাহর ঘরে ঘরে ইসলামের সঠিক শিক্ষা, নামাজের সঠিক সময়সূচি ও নিয়মিত আমলের তাগিদ পৌঁছে দেওয়া। ৫ ওয়াক্ত ফরজ সালাতের পাশাপাশি তাহাজ্জুদ, ইশরাক, চাশত ও আউওয়াবিনের মতো গুরুত্বপূর্ণ নফল ইবাদতকে মানুষের দৈনন্দিন রুটিনে ফিরিয়ে আনা এবং কুরআন-সুন্নাহর আলোকে হৃদয়কে পরিশীলিত রাখা আমাদের মূল ব্রত।
            </p>
          </section>

          {/* রচনা: অনুচ্ছেদ ৩ - অনন্য বৈশিষ্ট্যসমূহ */}
          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>৩. ইসলামিক লাইফ-এর অনন্য বৈশিষ্ট্যসমূহ</span>
            </h4>
            <ul className="space-y-1.5 pl-2 list-none">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>স্থায়ী আমল সংরক্ষণ:</strong> ব্যবহারকারীর ট্র্যাক করা সকল আমল অফলাইনে স্থায়ীভাবে সংরক্ষিত থাকে, যাতে কখনো কোনো নেক আমলের রেকর্ড হারিয়ে না যায়।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>কুরআনের পূর্ণ ১১৪টি সূরা:</strong> সকল সূরা সহজ অর্থ, আয়াত সংখ্যা ও আরবি উচ্চারণের সাথে এক প্ল্যাটফর্মে বিদ্যমান।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>মাগরিবের হিজরি পরিবর্তন:</strong> শরীয়তের নির্দেশনানুযায়ী সূর্যাস্তকালীন মাগরিবের সাথে সাথে স্বয়ংক্রিয় হিজরি তারিখ পরিবর্তন।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>ত্রিমুখী ২১ দিনের দিনপঞ্জি:</strong> হিজরি, ইংরেজি ও বঙ্গাব্দের ১০ দিন আগের ও ১০ দিন পরের বিস্তারিত সময়সূচি।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span><strong>আলোকিত জীবন্ত আকাশ:</strong> সকালের স্নিগ্ধতা, দুপুরের তেজদীপ্ত সূর্য, বিকালের গোধূলি, রাতের রজনী ও মাঝরাতের তাহাজ্জুদের আকাশ চিত্র।</span>
              </li>
            </ul>
          </section>

          {/* রচনা: অনুচ্ছেদ ৪ - বিশুদ্ধতার অঙ্গীকার ও সমাপনী */}
          <section className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>৪. বিশুদ্ধতার অঙ্গীকার ও প্রার্থনা</span>
            </h4>
            <p>
              ইসলামিক লাইফ-এ পরিবেশিত প্রতিটি তথ্য নির্ভরযোগ্য ইসলামিক গবেষণাগার, বিশ্বস্ত হাদিস গ্রন্থ ও গ্রহণযোগ্য ফিকহি নিয়মের আলোকে সংকলিত। আল্লাহ তাআলা ইসলামিক লাইফ-এর মাধ্যমে আমাদের সকলকে তাঁর নৈকট্যশীল নেক বান্দা হিসেবে কবুল করুন এবং আখেরাতে নাজাতের অসিলা বানিয়ে দিন। আমীন।
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500 font-medium">
            Islamic Life App • Version 6.3.3
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-2xs"
          >
            ধন্যবাদ
          </button>
        </div>

      </div>
    </div>
  );
};
