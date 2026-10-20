/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderSkyCard } from './components/HeaderSkyCard';
import { PrayerTimesCard } from './components/PrayerTimesCard';
import { DailyHadithCard } from './components/DailyHadithCard';
import { QuickFeaturesGrid } from './components/QuickFeaturesGrid';
import { ForbiddenAndNaflPrayers } from './components/ForbiddenAndNaflPrayers';
import { RemindersBanner } from './components/RemindersBanner';
import { BottomNav } from './components/BottomNav';
import { PWAInstallButton } from './components/PWAInstallButton';
import { ToolsTab } from './components/Tabs/ToolsTab';
import { DuaTab } from './components/Tabs/DuaTab';
import { QuranTab } from './components/Tabs/QuranTab';
import { MoreTab } from './components/Tabs/MoreTab';

// Modals
import { AmolTrackerModal } from './components/Modals/AmolTrackerModal';
import { CalendarModal } from './components/Modals/CalendarModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { AdminPanelModal } from './components/Modals/AdminPanelModal';
import { NotificationsModal } from './components/Modals/NotificationsModal';
import { TasbihModal } from './components/Modals/TasbihModal';
import { QiblaModal } from './components/Modals/QiblaModal';
import { AsmaulHusnaModal } from './components/Modals/AsmaulHusnaModal';
import { DaroodModal } from './components/Modals/DaroodModal';
import { AboutUsModal } from './components/Modals/AboutUsModal';
import { ContactModal } from './components/Modals/ContactModal';
import { ReportModal } from './components/Modals/ReportModal';
import { GoogleAuthModal } from './components/Modals/GoogleAuthModal';

import { BellRing, X } from 'lucide-react';

const MainAppLayout: React.FC = () => {
  const {
    activeTab,
    activeToast,
    dismissToast,
    isAboutUsModalOpen,
    setIsAboutUsModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    isReportModalOpen,
    setIsReportModalOpen,
    isGoogleAuthModalOpen,
    setIsGoogleAuthModalOpen
  } = useApp();

  return (
    <div className="min-h-screen bg-neutral-900/10 flex justify-center selection:bg-emerald-200">
      {/* Mobile-centric Frame */}
      <main className="w-full max-w-md min-h-screen bg-gray-50 flex flex-col relative shadow-2xl overflow-x-hidden">
        
        {/* Active Toast Notification Banner (FCM Realtime Alert) */}
        {activeToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-950 text-white shadow-2xl border border-emerald-400/40 flex items-start justify-between animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {activeToast.title}
                </h4>
                <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed">
                  {activeToast.body}
                </p>
              </div>
            </div>
            <button
              onClick={dismissToast}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'home' && (
          <div className="flex-1">
            <HeaderSkyCard />
            <PrayerTimesCard />
            <DailyHadithCard />
            <PWAInstallButton />
            <QuickFeaturesGrid />
            <ForbiddenAndNaflPrayers />
            <RemindersBanner />
          </div>
        )}

        {activeTab === 'tools' && <ToolsTab />}
        {activeTab === 'quran' && <QuranTab />}
        {activeTab === 'dua' && <DuaTab />}
        {activeTab === 'more' && <MoreTab />}

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Modals */}
        <AmolTrackerModal />
        <CalendarModal />
        <SettingsModal />
        <AdminPanelModal />
        <NotificationsModal />
        <TasbihModal />
        <QiblaModal />
        <AsmaulHusnaModal />
        <DaroodModal />
        <AboutUsModal
          isOpen={isAboutUsModalOpen}
          onClose={() => setIsAboutUsModalOpen(false)}
        />
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
        <GoogleAuthModal
          isOpen={isGoogleAuthModalOpen}
          onClose={() => setIsGoogleAuthModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
