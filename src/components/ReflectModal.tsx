import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { X, Lock, MessageSquare } from 'lucide-react';

export const ReflectModal: React.FC = () => {
  const {
    reflectModalLesson,
    setReflectModalLesson,
    saveReflection,
    token,
    user,
  } = useApp();

  const [reflectionText, setReflectionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (reflectModalLesson && token) {
      // Check existing reflection
      fetch('/api/user/reflections', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          const found = data.reflections?.find((r: any) => r.lessonId === reflectModalLesson.id);
          if (found) setReflectionText(found.text);
          else setReflectionText('');
        })
        .catch(err => console.error(err));
    }
  }, [reflectModalLesson, token]);

  if (!reflectModalLesson) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveReflection(reflectModalLesson.id, reflectionText);
      setReflectModalLesson(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const authorLoc = [
    reflectModalLesson.authorAge ? `${reflectModalLesson.authorAge} ساله` : null,
    reflectModalLesson.authorCity || reflectModalLesson.authorCountry,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 sm:p-8 max-w-lg w-full rounded-sm shadow-2xl relative space-y-6 text-right"
      >
        <button
          onClick={() => setReflectModalLesson(null)}
          className="absolute top-5 left-5 text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Privacy Guarantee */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#73706B] dark:text-[#A6A29A] font-medium">
            <Lock className="w-3.5 h-3.5 text-[#191918] dark:text-[#EDE8DF]" />
            <span>تأمل خصوصی و محرمانه</span>
          </div>
          <h3 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF] font-normal">
            این درس شما را به یاد چه انداخت؟
          </h3>
        </div>

        {/* Lesson Quote Reference */}
        <div className="p-4 bg-white/70 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-1">
          <blockquote className="font-serif text-base text-[#2E2D2A] dark:text-[#EDE8DF] italic">
            «{reflectModalLesson.text}»
          </blockquote>
          <span className="text-[11px] text-[#8C8880] dark:text-[#A6A29A] block">
            — {reflectModalLesson.isAnonymous ? 'ناشناس' : reflectModalLesson.authorDisplayName} · {authorLoc}
          </span>
        </div>

        {/* Reflection Input */}
        <div className="space-y-2">
          <textarea
            id="reflection-textarea"
            rows={5}
            value={reflectionText}
            onChange={e => setReflectionText(e.target.value)}
            placeholder="آسوده‌خاطر بنویسید. این نوشته در خلوت شخصی شما ذخیره می‌شود و هرگز توسط نویسنده یا عموم دیده نخواهد شد…"
            className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-sm text-[#191918] dark:text-[#EDE8DF] p-4 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] leading-relaxed resize-none text-right"
            maxLength={1000}
          />
          <p className="text-[11px] text-[#8C8880] dark:text-[#73706B] italic">
            تبدیل تجربه دیگران به تلنگری آرام برای خودشناسی و ژرف‌اندیشی.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
          <button
            onClick={() => setReflectModalLesson(null)}
            className="text-xs text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
          >
            بستن
          </button>

          <button
            id="reflection-save-btn"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] disabled:opacity-50 transition-colors rounded-sm text-xs font-medium flex items-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isSaving ? 'در حال ثبت…' : 'ماندگار کردن تأمل'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
