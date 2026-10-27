import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lesson, Keep, Reflection } from '../types';
import { motion } from 'motion/react';
import {
  Feather,
  Bookmark,
  MessageSquare,
  Lock,
  Globe,
  Share2,
  Calendar,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export const JourneyView: React.FC = () => {
  const {
    user,
    token,
    quota,
    setShareModalOpen,
    setShareCardLesson,
    toggleKeep,
    setReflectModalLesson,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lessons' | 'keeps' | 'reflections'>('lessons');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [archivedLessons, setArchivedLessons] = useState<Lesson[]>([]);
  const [keeps, setKeeps] = useState<Keep[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJourneyData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch Journey (Current + Archive)
      const resJourney = await fetch('/api/user/journey', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resJourney.ok) {
        const data = await resJourney.json();
        setCurrentLesson(data.current || null);
        setArchivedLessons(data.archived || []);
      }

      // 2. Fetch Keeps
      const resKeeps = await fetch('/api/user/keeps', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resKeeps.ok) {
        const data = await resKeeps.json();
        setKeeps(data.keeps || []);
      }

      // 3. Fetch Reflections
      const resReflections = await fetch('/api/user/reflections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resReflections.ok) {
        const data = await resReflections.json();
        setReflections(data.reflections || []);
      }
    } catch (err) {
      console.error('Error loading journey:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneyData();
  }, [token]);

  const handleRemoveKeep = async (lessonId: string) => {
    await toggleKeep(lessonId);
    setKeeps(prev => prev.filter(k => k.lessonId !== lessonId));
  };

  if (!user) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto space-y-4">
        <p className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF]">سفر زیسته شما با اولین درس آغاز می‌شود.</p>
        <p className="text-sm text-[#73706B] dark:text-[#A6A29A]">لطفاً برای مشاهده آرشیو خصوصی و درس‌های ذخیره‌شده وارد حساب خود شوید.</p>
      </div>
    );
  }

  return (
    <div id="journey-view-container" className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 text-right">
      
      {/* Header Profile Summary */}
      <div className="border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block mb-1">
            خلوت و آرشیو شخصی
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#191918] dark:text-[#EDE8DF] font-normal">
            سفر و ردپای {user.displayName}
          </h1>
          <p className="text-xs text-[#73706B] dark:text-[#A6A29A] mt-1">
            {user.age} ساله · {user.city || user.country} {user.anonymousMode && '(به صورت عمومی ناشناس)'}
          </p>
        </div>

        <button
          onClick={() => setShareModalOpen(true)}
          className="px-4 py-2.5 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium flex items-center gap-2 self-start sm:self-auto"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>{currentLesson ? 'جایگزینی درس کنونی' : 'ثبت درس زندگی'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-3 text-xs text-[#73706B] dark:text-[#A6A29A]">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`py-1 transition-colors ${
            activeTab === 'lessons'
              ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]'
              : 'hover:text-[#191918] dark:hover:text-[#EDE8DF]'
          }`}
        >
          درس‌های من ({archivedLessons.length + (currentLesson ? 1 : 0)})
        </button>
        <button
          onClick={() => setActiveTab('keeps')}
          className={`py-1 transition-colors ${
            activeTab === 'keeps'
              ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]'
              : 'hover:text-[#191918] dark:hover:text-[#EDE8DF]'
          }`}
        >
          توشه من ({keeps.length})
        </button>
        <button
          onClick={() => setActiveTab('reflections')}
          className={`py-1 transition-colors ${
            activeTab === 'reflections'
              ? 'text-[#191918] dark:text-[#EDE8DF] font-semibold border-b-2 border-[#191918] dark:border-[#EDE8DF]'
              : 'hover:text-[#191918] dark:hover:text-[#EDE8DF]'
          }`}
        >
          تأملات من ({reflections.length})
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="text-center py-20 text-[#8C8880] dark:text-[#A6A29A] font-serif italic text-lg">
          در حال ورق زدن برگ‌های سفر شما…
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* TAB 1: MY LESSONS (CURRENT + HISTORICAL ARCHIVE) */}
          {activeTab === 'lessons' && (
            <div className="space-y-12">
              
              {/* Current Public Lesson */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#73706B] dark:text-[#A6A29A]">
                  <span className="flex items-center gap-1.5 text-[#191918] dark:text-[#EDE8DF] font-medium">
                    <Globe className="w-3.5 h-3.5" />
                    <span>درس عمومی کنونی شما</span>
                  </span>
                  <span className="text-[11px] text-[#8C8880] dark:text-[#73706B]">در هر زمان فقط یک درس عمومی وجود دارد</span>
                </div>

                {currentLesson ? (
                  <div className="p-8 bg-[#FAF8F5] dark:bg-[#181716] border-2 border-[#191918] dark:border-[#EDE8DF] rounded-sm space-y-6">
                    <blockquote className="font-serif text-2xl sm:text-3xl text-[#191918] dark:text-[#EDE8DF] font-normal leading-relaxed">
                      «{currentLesson.text}»
                    </blockquote>

                    {currentLesson.context && (
                      <div className="text-xs text-[#595754] dark:text-[#A6A29A] italic bg-white/60 dark:bg-[#121211] p-3 border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm text-right">
                        <span className="font-semibold not-italic block text-[11px] text-[#8C8880] dark:text-[#73706B] mb-1">
                          چه رخدادی این را به شما آموخت
                        </span>
                        {currentLesson.context}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#73706B] dark:text-[#A6A29A] border-t border-[#E8E4DC] dark:border-[#2D2B27] pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#8C8880] dark:text-[#A6A29A]" />
                        <span>انتشار در {new Date(currentLesson.publishedAt).toLocaleDateString('fa-IR')}</span>
                        {currentLesson.neededCount ? (
                          <>
                            <span>·</span>
                            <span className="text-[#191918] dark:text-[#EDE8DF] font-medium">
                              {currentLesson.neededCount} نفر نیازمند شنیدن این کلام بودند
                            </span>
                          </>
                        ) : null}
                      </div>

                      <button
                        onClick={() => setShareCardLesson(currentLesson)}
                        className="text-xs text-[#191918] dark:text-[#EDE8DF] hover:underline flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>کارت اشتراک‌گذاری</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-[#F5F2EC]/40 dark:bg-[#181716] border border-dashed border-[#C8C3B8] dark:border-[#3A3834] rounded-sm text-center space-y-3">
                    <p className="font-serif text-lg text-[#191918] dark:text-[#EDE8DF]">شما هنوز درسی از زندگی‌تان به یادگار نگذاشته‌اید.</p>
                    <p className="text-xs text-[#73706B] dark:text-[#A6A29A] max-w-md mx-auto">
                      هر انسانی زیسته‌ای گرانبها دارد. چکیده یک بینش را با این آرشیو زنده به اشتراک بگذارید.
                    </p>
                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="mt-2 px-4 py-2 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] rounded-sm text-xs font-medium inline-flex items-center gap-2"
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>ثبت درس زندگی</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Private Historical Archive: "What I used to carry" */}
              <div className="space-y-6 pt-6 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
                <div className="flex items-center gap-2 text-xs text-[#73706B] dark:text-[#A6A29A]">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="font-medium text-[#191918] dark:text-[#EDE8DF]">آنچه روزگاری بر جانم نقش بسته بود (آرشیو خصوصی)</span>
                </div>
                <p className="text-xs text-[#8C8880] dark:text-[#73706B] italic">
                  درس‌های قبلی پس از انتشار درس تازه، به این بخش منتقل می‌شوند. آن‌ها برای همیشه در خلوت سفر شما ماندگارند و حذف یا ویرایش نمی‌شوند.
                </p>

                {archivedLessons.length === 0 ? (
                  <div className="p-6 bg-white/40 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm text-center text-xs text-[#8C8880] dark:text-[#73706B]">
                    هنوز درس قبلی‌ای وجود ندارد. وقتی درس کنونی‌تان را جایگزین کنید، درس پیشین با متانت در اینجا نگهداری خواهد شد.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {archivedLessons.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 bg-white/70 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-3 text-right"
                      >
                        <blockquote className="font-serif text-xl text-[#403E3B] dark:text-[#EDE8DF] font-normal leading-relaxed">
                          «{item.text}»
                        </blockquote>

                        {item.context && (
                          <p className="text-xs text-[#73706B] dark:text-[#A6A29A] italic text-right">
                            {item.context}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-[#A6A29A] dark:text-[#73706B] border-t border-[#F0ECE4] dark:border-[#2D2B27] pt-3">
                          <span>
                            انتشار: {new Date(item.publishedAt).toLocaleDateString('fa-IR')}
                            {item.archivedAt && ` · انتقال به آرشیو: ${new Date(item.archivedAt).toLocaleDateString('fa-IR')}`}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 bg-[#F0ECE4] dark:bg-[#2D2B27] text-[#73706B] dark:text-[#A6A29A] rounded-xs font-medium">
                            آرشیو خلوت شخصی
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: THINGS I KEPT */}
          {activeTab === 'keeps' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-[#73706B] dark:text-[#A6A29A]">
                <p>درس‌هایی که انتخاب کرده‌اید با خود همراه داشته باشید.</p>
                {quota && (
                  <span className="text-[11px] text-[#8C8880] dark:text-[#73706B]">
                    سهمیه ماهانه: {quota.keepsUsedThisMonth} از {quota.maxKeepsPerMonth} استفاده شده
                  </span>
                )}
              </div>

              {keeps.length === 0 ? (
                <div className="p-12 bg-white/40 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm text-center space-y-2">
                  <p className="font-serif text-lg text-[#191918] dark:text-[#EDE8DF]">هنوز درسی را در توشه خود نگذاشته‌اید.</p>
                  <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">
                    هر زمان کلامی در بخش «یک درس» یا «پرسه» بر دلتان نشست، دکمه «نگه‌داشتن» را بزنید تا در اینجا ذخیره شود.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {keeps.map(k => {
                    const l = k.lesson;
                    if (!l) return null;
                    const authorLoc = [l.authorAge ? `${l.authorAge} ساله` : null, l.authorCity || l.authorCountry]
                      .filter(Boolean)
                      .join(' · ');
                    const name = l.isAnonymous ? 'ناشناس' : l.authorDisplayName;

                    return (
                      <div
                        key={k.id}
                        className="p-6 sm:p-8 bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-4 text-right"
                      >
                        <blockquote className="font-serif text-xl sm:text-2xl text-[#191918] dark:text-[#EDE8DF] leading-relaxed">
                          «{l.text}»
                        </blockquote>

                        {l.context && (
                          <p className="text-xs text-[#595754] dark:text-[#A6A29A] italic bg-white/60 dark:bg-[#121211] p-3 border border-[#E8E4DC]/60 dark:border-[#2D2B27] rounded-sm text-right">
                            {l.context}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#73706B] dark:text-[#A6A29A] border-t border-[#F0ECE4] dark:border-[#2D2B27] pt-4">
                          <span>
                            {name} · {authorLoc}
                          </span>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setReflectModalLesson(l)}
                              className="text-xs text-[#191918] dark:text-[#EDE8DF] hover:underline flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>تأمل</span>
                            </button>

                            <button
                              onClick={() => handleRemoveKeep(l.id)}
                              className="text-xs text-[#8C8880] hover:text-[#C53030] dark:hover:text-[#FC8181] transition-colors"
                            >
                              برداشتن از توشه
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY REFLECTIONS */}
          {activeTab === 'reflections' && (
            <div className="space-y-6">
              <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">
                تأملات خلوت شما که در پاسخ به تجربیات دیگران نگاشته شده‌اند. تنها خودتان به این نوشته‌ها دسترسی دارید.
              </p>

              {reflections.length === 0 ? (
                <div className="p-12 bg-white/40 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm text-center space-y-2">
                  <p className="font-serif text-lg text-[#191918] dark:text-[#EDE8DF]">تأملات شما در اینجا آرام خواهند گرفت.</p>
                  <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">
                    هر زمان بینشی شما را به فکر فرو برد، با گزینه «تأمل» آنچه در درونتان برانگیخته شد را ثبت کنید.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reflections.map(r => (
                    <div
                      key={r.id}
                      className="p-6 sm:p-8 bg-white/80 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-4 text-right"
                    >
                      {r.lesson && (
                        <div className="border-r-2 border-[#191918] dark:border-[#EDE8DF] pr-4 space-y-1">
                          <span className="text-[10px] text-[#8C8880] dark:text-[#A6A29A] block">
                            درسی که این تأمل را برانگیخت:
                          </span>
                          <p className="font-serif italic text-base text-[#403E3B] dark:text-[#EDE8DF]">
                            «{r.lesson.text}»
                          </p>
                        </div>
                      )}

                      <div className="bg-[#FAF8F5] dark:bg-[#121211] p-4 border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm">
                        <span className="text-[10px] text-[#191918] dark:text-[#EDE8DF] font-semibold block mb-1">
                          تأمل شما
                        </span>
                        <p className="text-sm text-[#191918] dark:text-[#EDE8DF] leading-relaxed whitespace-pre-wrap">
                          {r.text}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#A6A29A] dark:text-[#73706B]">
                        <span>ثبت‌شده در {new Date(r.createdAt).toLocaleDateString('fa-IR')}</span>
                        {r.lesson && (
                          <button
                            onClick={() => setReflectModalLesson(r.lesson!)}
                            className="text-xs text-[#191918] dark:text-[#EDE8DF] hover:underline"
                          >
                            ویرایش تأمل
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
