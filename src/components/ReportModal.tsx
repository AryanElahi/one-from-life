import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { X, Flag, ShieldAlert, Check } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const {
    reportModalLesson,
    setReportModalLesson,
    token,
    setAuthModalOpen,
    showToast,
  } = useApp();

  const [reason, setReason] = useState('محتوای نامناسب یا آسیب‌رسان');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalLesson) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setAuthModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId: reportModalLesson.id,
          reason,
          details: details.trim() || undefined,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        showToast('سپاسگزاریم. نگهبانان آرشیو این گزارش را با دقت بررسی خواهند کرد.');
        setTimeout(() => {
          setReportModalLesson(null);
          setSubmitted(false);
          setDetails('');
        }, 2500);
      }
    } catch (err) {
      console.error('Error reporting lesson:', err);
    } finally {
      setSubmitting(false);
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
          onClick={() => setReportModalLesson(null)}
          className="absolute top-5 left-5 text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#C53030] dark:text-[#FEB2B2] font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>صیانت و سلامت جامعه</span>
          </div>
          <h3 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF]">
            گزارش تخلف یا محتوا
          </h3>
          <p className="text-xs text-[#73706B] dark:text-[#A6A29A] leading-relaxed">
            ما از تجربیات اصیل انسانی پاسداری می‌کنیم و در عین حال حرمت و امنیت جامعه را در برابر آسیب و توهین محفوظ می‌داریم.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <p className="font-serif text-lg text-[#191918] dark:text-[#EDE8DF]">گزارش ثبت شد</p>
            <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">از اینکه در حفظ وقار و امنیت این فضا همراه ما هستید، سپاسگزاریم.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-white/80 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm text-xs italic text-[#595754] dark:text-[#D5D0C5] text-right">
              «{reportModalLesson.text}»
            </div>

            <div>
              <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
                دلیل گزارش
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF]"
              >
                <option value="محتوای نامناسب یا آسیب‌رسان">محتوای نامناسب یا آسیب‌رسان</option>
                <option value="نفرت‌پراکنی یا آزار و اذیت">نفرت‌پراکنی یا آزار و اذیت</option>
                <option value="نقض حریم خصوصی یا جعل هویت">نقض حریم خصوصی یا جعل هویت</option>
                <option value="هرزنامه یا تبلیغات تجاری">هرزنامه یا تبلیغات تجاری</option>
                <option value="مورد دیگر">مورد دیگر</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1">
                توضیحات تکمیلی (اختیاری)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="توضیحات و زمینه لازم برای بررسی نگهبانان آرشیو را بنویسید..."
                className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] p-3 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] resize-none text-right"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
              <button
                type="button"
                onClick={() => setReportModalLesson(null)}
                className="text-xs text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] disabled:opacity-50 rounded-sm text-xs font-medium"
              >
                {submitting ? 'در حال ارسال…' : 'ارسال گزارش'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
