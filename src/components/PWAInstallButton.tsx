import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="mx-3 mt-2 py-2 px-3 rounded-xl bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-emerald-900 transition active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span>অ্যাপটি ইনস্টল করুন (Offline PWA)</span>
      </button>

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl text-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>iPhone / iPad-এ ইনস্টল করুন</span>
              </h3>
              <button onClick={() => setShowIOSGuide(false)}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <p>১. Safari ব্রাউজারের নীচের <strong>Share (শেয়ার)</strong> বাটনে চাপ দিন।</p>
              <p>২. স্ক্রোল করে <strong>Add to Home Screen (হোম স্ক্রিনে যোগ করুন)</strong> এ চাপ দিন।</p>
              <p>৩. এরপর ওপরের <strong>Add</strong> বাটনে ট্যাপ করলেই অ্যাপটি হোমস্ক্রিনে ইনস্টল হয়ে যাবে।</p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
};
