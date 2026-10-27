import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Report } from '../types';
import { ShieldCheck, EyeOff, Check, X, AlertTriangle } from 'lucide-react';

export const ModerationView: React.FC = () => {
  const { user, token, showToast } = useApp();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/moderation', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);

  const handleAction = async (reportId: string, action: 'hide' | 'restore' | 'dismiss', lessonId?: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/moderation/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId, action, lessonId }),
      });
      if (res.ok) {
        showToast(`عملیات ${action === 'hide' ? 'مخفی‌سازی' : action === 'restore' ? 'بازگردانی' : 'رد گزارش'} اعمال شد.`);
        fetchReports();
      }
    } catch (err) {
      console.error('Error performing moderation action:', err);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto space-y-3">
        <p className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF]">فقط ویژه نگهبانان آرشیو</p>
        <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">برای دسترسی به صف نظارت و گزارش‌ها باید با حساب مدیر وارد شوید.</p>
      </div>
    );
  }

  return (
    <div id="moderation-view-container" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 text-right">
      
      <div className="border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block mb-1">
            میز کار نگهبانان آرشیو
          </span>
          <h1 className="font-serif text-3xl text-[#191918] dark:text-[#EDE8DF] font-normal">
            صف نظارت و گزارش‌های جامعه
          </h1>
          <p className="text-xs text-[#73706B] dark:text-[#A6A29A] mt-1">
            بررسی گزارش‌های مردمی جهت پاسداشت وقار، سلامت و اصالت آرشیو.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="text-xs text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] border border-[#E8E4DC] dark:border-[#2D2B27] px-3 py-1.5 rounded-sm"
        >
          تازه‌سازی
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#8C8880] dark:text-[#A6A29A] font-serif italic">
          در حال بارگذاری گزارش‌ها…
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 bg-white/60 dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm text-center space-y-2">
          <ShieldCheck className="w-8 h-8 mx-auto text-[#191918] dark:text-[#EDE8DF]" />
          <p className="font-serif text-xl text-[#191918] dark:text-[#EDE8DF]">آرشیو در آرامش و صفا به سر می‌برد.</p>
          <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">گزارش بررسی‌نشده‌ای در صف وجود ندارد.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map(rep => (
            <div
              key={rep.id}
              className={`p-6 bg-white dark:bg-[#1C1B19] border rounded-sm space-y-4 text-right ${
                rep.status === 'pending'
                  ? 'border-[#C8C3B8] dark:border-[#3A3834]'
                  : 'border-[#E8E4DC] dark:border-[#2D2B27] opacity-75'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0ECE4] dark:border-[#2D2B27] pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#C53030] dark:text-[#FEB2B2]">
                    {rep.reason}
                  </span>
                  <span>·</span>
                  <span className="text-[#8C8880] dark:text-[#A6A29A]">ثبت گزارش: {new Date(rep.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-xs text-[10px] ${
                  rep.status === 'pending'
                    ? 'bg-[#FFF5F5] dark:bg-[#2A1515] text-[#C53030] dark:text-[#FEB2B2]'
                    : 'bg-[#F0ECE4] dark:bg-[#252422] text-[#73706B] dark:text-[#A6A29A]'
                }`}>
                  وضعیت: {rep.status === 'pending' ? 'در انتظار بررسی' : rep.status === 'resolved' ? 'بررسی‌شده' : 'ردشده'}
                </span>
              </div>

              {rep.lesson ? (
                <div className="p-4 bg-[#FAF8F5] dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-2 text-right">
                  <span className="text-[10px] text-[#8C8880] dark:text-[#A6A29A] block">
                    درس گزارش‌شده (وضعیت: {rep.lesson.status === 'published' ? 'عمومی' : 'مخفی'})
                  </span>
                  <blockquote className="font-serif text-lg text-[#191918] dark:text-[#EDE8DF]">
                    «{rep.lesson.text}»
                  </blockquote>
                  <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">
                    نویسنده: {rep.lesson.authorDisplayName} ({rep.lesson.authorAge} ساله · {rep.lesson.authorCountry})
                  </p>
                </div>
              ) : (
                <p className="text-xs italic text-[#8C8880] dark:text-[#A6A29A]">شناسه درس دیگر در دسترس نیست.</p>
              )}

              {rep.details && (
                <div className="text-xs text-[#595754] dark:text-[#A6A29A] bg-[#F5F2EC]/60 dark:bg-[#121211] p-3 rounded-sm text-right">
                  <span className="font-medium block text-[11px] text-[#191918] dark:text-[#EDE8DF] mb-0.5">یادداشت گزارش‌دهنده:</span>
                  {rep.details}
                </div>
              )}

              {rep.status === 'pending' && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleAction(rep.id, 'dismiss')}
                    className="px-3 py-1.5 border border-[#E8E4DC] dark:border-[#2D2B27] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-xs text-[#595754] dark:text-[#A6A29A] rounded-sm"
                  >
                    رد گزارش
                  </button>

                  {rep.lesson?.status === 'published' ? (
                    <button
                      onClick={() => handleAction(rep.id, 'hide', rep.lesson?.id)}
                      className="px-4 py-1.5 bg-[#C53030] text-white hover:bg-[#9B2C2C] text-xs font-medium rounded-sm flex items-center gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>مخفی‌سازی درس</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(rep.id, 'restore', rep.lesson?.id)}
                      className="px-4 py-1.5 bg-[#191918] dark:bg-[#EDE8DF] text-white dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] text-xs font-medium rounded-sm flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>بازگردانی درس</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
