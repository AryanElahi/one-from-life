import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { X, LogIn, UserPlus } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, signup } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState<number | ''>(28);
  const [country, setCountry] = useState('ایران');
  const [city, setCity] = useState('');
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!email.trim()) {
          setErrorMsg('لطفاً نشانی رایانامه (ایمیل) خود را وارد کنید.');
          setLoading(false);
          return;
        }
        await login(email.trim());
      } else {
        if (!email.trim() || !displayName.trim() || !age || !country.trim()) {
          setErrorMsg('لطفاً ایمیل، نام نمایشی، سن و کشور خود را تکمیل نمایید.');
          setLoading(false);
          return;
        }
        await signup({
          email: email.trim(),
          displayName: displayName.trim(),
          age: Number(age),
          country: country.trim(),
          city: city.trim() || undefined,
          anonymousMode,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در اعتبارسنجی کاربر');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 sm:p-10 max-w-md w-full rounded-sm shadow-2xl relative space-y-6 text-right"
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 left-5 text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switch */}
        <div className="flex border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-3 gap-6 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`py-1 transition-colors ${
              mode === 'signin'
                ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]'
                : 'text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
            }`}
          >
            ورود به خلوت
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`py-1 transition-colors ${
              mode === 'signup'
                ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]'
                : 'text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
            }`}
          >
            آغاز سفر و نام‌نویسی
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF]">
            {mode === 'signin' ? 'خوش‌آمدید' : 'ساخت فضای شخصی'}
          </h3>
          <p className="text-xs text-[#73706B] dark:text-[#A6A29A] leading-relaxed">
            {mode === 'signin'
              ? 'دسترسی به آرشیو سفر زیسته و تأملات خصوصی‌تان.'
              : 'فضایی آرام برای به یادگار گذاشتن یک درس و همراه داشتن تجربه‌های دیگران.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#FFF5F5] dark:bg-[#2A1515] border border-[#FEB2B2] dark:border-[#742A2A] text-xs text-[#C53030] dark:text-[#FEB2B2] rounded-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
              نشانی ایمیل
            </label>
            <input
              id="auth-email-input"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] dir-ltr text-left"
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
                  نام نمایشی
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="مثلاً: سارا یا علی"
                  className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
                    سن
                  </label>
                  <input
                    type="number"
                    min={13}
                    max={120}
                    required
                    value={age}
                    onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
                    کشور
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="مثلاً: ایران"
                    className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
                  شهر (اختیاری)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="مثلاً: شیراز"
                  className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="signup-anon"
                  checked={anonymousMode}
                  onChange={e => setAnonymousMode(e.target.checked)}
                  className="rounded-xs text-[#191918] focus:ring-0"
                />
                <label htmlFor="signup-anon" className="text-xs text-[#595754] dark:text-[#A6A29A]">
                  انتشار ناشناس به صورت پیش‌فرض (هویت درسی عمومی مخفی می‌ماند)
                </label>
              </div>
            </>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] disabled:opacity-50 transition-colors rounded-sm text-xs font-medium"
          >
            {loading ? 'در حال پردازش…' : mode === 'signin' ? 'ورود' : 'عضویت در آرشیو'}
          </button>
        </form>

        {/* Quick Demo logins */}
        <div className="pt-3 border-t border-[#E8E4DC] dark:border-[#2D2B27] text-center space-y-2">
          <span className="text-[10px] text-[#8C8880] dark:text-[#A6A29A] block">
            حساب‌های نمونه آزمایشی
          </span>
          <div className="flex justify-center gap-2 text-[11px]">
            <button
              onClick={() => setDemoAccount('marta.lisbon@example.com')}
              className="px-2.5 py-1 bg-white dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#595754] dark:text-[#A6A29A] rounded-sm"
            >
              مارتا (۳۸ ساله · لیسبون)
            </button>
            <button
              onClick={() => setDemoAccount('admin@onefromalife.com')}
              className="px-2.5 py-1 bg-white dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#595754] dark:text-[#A6A29A] rounded-sm"
            >
              نگهبان آرشیو (مدیر)
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
