import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Compass, Navigation } from 'lucide-react';

export const QiblaModal: React.FC = () => {
  const { isQiblaModalOpen, setIsQiblaModalOpen, settings } = useApp();
  const [deviceHeading, setDeviceHeading] = useState(0);

  // Qibla direction from Bangladesh coordinates ~278°
  const qiblaAngle = 278;

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDeviceHeading(Math.round(e.alpha));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  if (!isQiblaModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-teal-800 to-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold">কিবলা কম্পাস (Qibla Direction)</h2>
          </div>
          <button
            onClick={() => setIsQiblaModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Compass Dial */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative w-56 h-56 rounded-full border-4 border-teal-200 bg-teal-50/50 shadow-inner flex items-center justify-center">
            {/* North Indicator */}
            <span className="absolute top-2 text-xs font-bold text-rose-600 font-mono">N</span>
            <span className="absolute bottom-2 text-xs font-bold text-gray-400 font-mono">S</span>
            <span className="absolute left-2 text-xs font-bold text-gray-400 font-mono">W</span>
            <span className="absolute right-2 text-xs font-bold text-gray-400 font-mono">E</span>

            {/* Qibla Needle (facing ~278° West-Northwest) */}
            <div
              style={{ transform: `rotate(${qiblaAngle - deviceHeading}deg)` }}
              className="absolute w-full h-full flex flex-col items-center justify-start transition-transform duration-300 ease-out pointer-events-none"
            >
              <div className="mt-6 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold font-arabic">
                  🕋
                </div>
                <div className="w-1.5 h-16 bg-gradient-to-t from-transparent via-emerald-500 to-emerald-700 rounded-full" />
              </div>
            </div>

            {/* Center Pivot */}
            <div className="w-5 h-5 rounded-full bg-teal-800 border-2 border-white shadow-md z-10" />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-gray-800">
              কিবলা কোণ: <span className="text-emerald-700 font-mono">{qiblaAngle}°</span> (পশ্চিম-উত্তর-পশ্চিম)
            </div>
            <div className="text-xs text-gray-500">
              অবস্থান: {settings.locationName}
            </div>
            <p className="text-[11px] text-gray-400">
              সঠিক দিক নির্দেশনার জন্য ফোনটিকে সমতল মেঝেতে রাখুন।
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
