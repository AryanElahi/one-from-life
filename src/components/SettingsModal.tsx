import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { X, LogOut, User, Shield, Sun, Moon } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { user, settingsOpen, setSettingsOpen, updateProfile, logout, theme, toggleTheme, setTheme } = useApp();

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setAge(user.age);
      setCountry(user.country);
      setCity(user.city || '');
      setAnonymousMode(user.anonymousMode);
    }
  }, [user]);

  if (!settingsOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        age: Number(age) || user.age,
        country: country.trim(),
        city: city.trim() || undefined,
        anonymousMode,
      });
      setSettingsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 sm:p-8 max-w-md w-full rounded-sm shadow-2xl relative space-y-6 text-right"
      >
        <button
          onClick={() => setSettingsOpen(false)}
          className="absolute top-5 left-5 text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block">
            تنظیمات شخصی
          </span>
          <h3 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF]">
            حضور و هویت شما
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
              نام نمایشی
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
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
                className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
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
                className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
              شهر
            </label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] text-right"
            />
          </div>

          {/* Theme Mode Toggle in Settings */}
          <div className="p-3 bg-[#F5F2EC]/80 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#191918] dark:text-[#EDE8DF] block">پوسته ظاهری</span>
              <span className="text-[11px] text-[#73706B] dark:text-[#A6A29A]">انتخاب حالت روز (روشن) یا شب (تیره)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-1.5 text-xs rounded-xs border flex items-center gap-1 transition-colors ${
                  theme === 'light'
                    ? 'bg-[#191918] text-[#FAF8F5] border-[#191918]'
                    : 'border-[#D5D0C5] dark:border-[#3A3834] text-[#73706B] dark:text-[#A6A29A]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>روشن</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-1.5 text-xs rounded-xs border flex items-center gap-1 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#EDE8DF] text-[#121211] border-[#EDE8DF]'
                    : 'border-[#D5D0C5] dark:border-[#3A3834] text-[#73706B] dark:text-[#A6A29A]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>تیره</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#F5F2EC]/80 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#191918] dark:text-[#EDE8DF] block">حالت ناشناس</span>
              <span className="text-[11px] text-[#73706B] dark:text-[#A6A29A]">نام شما را در درس‌های عمومی پنهان می‌کند</span>
            </div>
            <input
              type="checkbox"
              checked={anonymousMode}
              onChange={e => setAnonymousMode(e.target.checked)}
              className="rounded-xs text-[#191918] focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
            <button
              type="button"
              onClick={() => {
                logout();
                setSettingsOpen(false);
              }}
              className="text-xs text-[#C53030] hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از حساب</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] rounded-sm text-xs font-medium"
            >
              {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
