import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User as UserIcon, LogIn, Sparkles, Feather, Sun, Moon, History } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    activeView,
    setActiveView,
    theme,
    toggleTheme,
    setAuthModalOpen,
    setShareModalOpen,
    setSettingsOpen,
  } = useApp();

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#121211]/90 backdrop-blur-md border-b border-[#E8E4DC] dark:border-[#2D2B27] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Wordmark */}
        <div
          id="brand-logo"
          onClick={() => setActiveView('landing')}
          className="cursor-pointer flex items-center gap-3 group select-none"
        >
          {/* Conceptual Logo: One central point distilled from a life */}
          <div className="w-6 h-6 rounded-full border border-[#191918] dark:border-[#EDE8DF] flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-1.5 h-1.5 rounded-full bg-[#191918] dark:bg-[#EDE8DF]"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-wider text-base font-semibold text-[#191918] dark:text-[#EDE8DF]">
              یکی از یک زندگی
            </span>
          </div>
        </div>

        {/* Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] text-[#595754] dark:text-[#A6A29A]">
          <button
            id="nav-one"
            onClick={() => setActiveView('one')}
            className={`transition-colors hover:text-[#191918] dark:hover:text-[#EDE8DF] py-1 ${
              activeView === 'one' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]' : ''
            }`}
          >
            یکی
          </button>
          <button
            id="nav-wander"
            onClick={() => setActiveView('wander')}
            className={`transition-colors hover:text-[#191918] dark:hover:text-[#EDE8DF] py-1 ${
              activeView === 'wander' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]' : ''
            }`}
          >
            پرسه
          </button>
          <button
            id="nav-explore"
            onClick={() => setActiveView('explore')}
            className={`transition-colors hover:text-[#191918] dark:hover:text-[#EDE8DF] py-1 ${
              activeView === 'explore' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]' : ''
            }`}
          >
            کاوش
          </button>
          <button
            id="nav-previous"
            onClick={() => setActiveView('previous')}
            className={`transition-colors hover:text-[#191918] dark:hover:text-[#EDE8DF] py-1 flex items-center gap-1 ${
              activeView === 'previous' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]' : ''
            }`}
          >
            <span>درس‌های پیشین</span>
          </button>
          
          <button
            id="nav-journey"
            onClick={() => {
              if (!user) {
                setAuthModalOpen(true);
              } else {
                setActiveView('journey');
              }
            }}
            className={`transition-colors hover:text-[#191918] dark:hover:text-[#EDE8DF] py-1 ${
              activeView === 'journey' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]' : ''
            }`}
          >
            سفر شما
          </button>

          {user?.isAdmin && (
            <button
              id="nav-admin"
              onClick={() => setActiveView('moderation')}
              className={`transition-colors hover:text-[#191918] dark:hover:text-[#EDE8DF] py-1 flex items-center gap-1.5 ${
                activeView === 'moderation' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]' : 'text-[#888] dark:text-[#777]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>پاسداران آرشیو</span>
            </button>
          )}
        </nav>

        {/* Actions & User State */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Dark / Light Mode Toggle Button */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] hover:border-[#191918] dark:hover:border-[#EDE8DF] flex items-center justify-center transition-all bg-white/40 dark:bg-[#1E1D1B]"
            title={theme === 'dark' ? 'تغییر به حالت روشن (روز)' : 'تغییر به حالت تیره (شب)'}
            aria-label="Theme toggle"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#595754] transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>

          <button
            id="btn-leave-yours"
            onClick={() => setShareModalOpen(true)}
            className="px-3.5 sm:px-4 py-2 text-xs bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm font-medium flex items-center gap-2"
          >
            <Feather className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ثبت درس زندگی</span>
            <span className="sm:hidden">ثبت</span>
          </button>

          {user ? (
            <button
              id="btn-user-settings"
              onClick={() => setSettingsOpen(true)}
              className="w-8 h-8 rounded-full border border-[#D5D0C5] dark:border-[#3A3834] hover:border-[#191918] dark:hover:border-[#EDE8DF] flex items-center justify-center text-xs text-[#191918] dark:text-[#EDE8DF] font-medium transition-colors bg-white/60 dark:bg-[#1E1D1B]"
              title={user.displayName}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              id="btn-sign-in"
              onClick={() => setAuthModalOpen(true)}
              className="text-xs text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors px-2 py-1"
            >
              ورود
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E8E4DC] dark:border-[#2D2B27] py-2 px-2 text-[11px] text-[#73706B] dark:text-[#A6A29A] bg-[#FAF8F5] dark:bg-[#121211]">
        <button
          onClick={() => setActiveView('one')}
          className={`py-1 px-1.5 ${activeView === 'one' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold' : ''}`}
        >
          یکی
        </button>
        <button
          onClick={() => setActiveView('wander')}
          className={`py-1 px-1.5 ${activeView === 'wander' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold' : ''}`}
        >
          پرسه
        </button>
        <button
          onClick={() => setActiveView('explore')}
          className={`py-1 px-1.5 ${activeView === 'explore' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold' : ''}`}
        >
          کاوش
        </button>
        <button
          onClick={() => setActiveView('previous')}
          className={`py-1 px-1.5 ${activeView === 'previous' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold' : ''}`}
        >
          درس‌های پیشین
        </button>
        <button
          onClick={() => {
            if (!user) setAuthModalOpen(true);
            else setActiveView('journey');
          }}
          className={`py-1 px-1.5 ${activeView === 'journey' ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold' : ''}`}
        >
          سفر
        </button>
      </div>
    </header>
  );
};
