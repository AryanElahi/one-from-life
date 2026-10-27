import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lesson, TOPIC_LABELS_FA, TopicType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  MessageSquare,
  HeartHandshake,
  Share2,
  ArrowLeft,
  Sparkles,
  Info,
  Flag,
  ChevronDown,
  ChevronUp,
  History,
} from 'lucide-react';

export const OneView: React.FC = () => {
  const {
    user,
    token,
    quota,
    toggleKeep,
    setReflectModalLesson,
    setShareCardLesson,
    setReportModalLesson,
    markNeeded,
    setAuthModalOpen,
    setActiveView,
  } = useApp();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isKept, setIsKept] = useState(false);
  const [userReflection, setUserReflection] = useState<string | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMarkedNeeded, setHasMarkedNeeded] = useState(false);
  const [hasEvolution, setHasEvolution] = useState(false);

  const fetchOneLesson = async (excludeId?: string) => {
    setLoading(true);
    setShowContext(false);
    try {
      const url = excludeId ? `/api/lessons/one?exclude=${excludeId}` : '/api/lessons/one';
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setLesson(data.lesson);
        setIsKept(Boolean(data.isKept));
        setUserReflection(data.userReflection || null);
        setHasMarkedNeeded(false);

        // Check if author has previous lessons
        if (data.lesson?.userId) {
          fetch(`/api/lessons/previous?userId=${data.lesson.userId}`)
            .then(r => r.json())
            .then(d => {
              if (d.previousLessons && d.previousLessons.length > 0) {
                setHasEvolution(true);
              } else {
                setHasEvolution(false);
              }
            })
            .catch(() => setHasEvolution(false));
        }
      }
    } catch (err) {
      console.error('Error fetching One lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOneLesson();
  }, [token]);

  const handleNext = () => {
    fetchOneLesson(lesson?.id);
  };

  const handleToggleKeep = async () => {
    if (!lesson) return;
    const kept = await toggleKeep(lesson.id);
    setIsKept(kept);
  };

  const handleNeeded = async () => {
    if (!lesson) return;
    if (hasMarkedNeeded) return;
    await markNeeded(lesson.id);
    setHasMarkedNeeded(true);
  };

  const authorLocation = [
    lesson?.authorAge ? `${lesson.authorAge} ساله` : null,
    lesson?.authorCity || lesson?.authorCountry,
  ]
    .filter(Boolean)
    .join(' · ');

  const authorName = lesson?.isAnonymous
    ? 'ناشناس'
    : lesson?.authorDisplayName || 'یک رهگذر';

  return (
    <div id="one-view-container" className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Top Subtle Label */}
      <div className="flex items-center justify-between text-xs text-[#8C8880] dark:text-[#A6A29A]">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#191918] dark:bg-[#EDE8DF]"></span>
          <span className="font-medium">یک بینش پالوده</span>
        </span>

        {quota && (
          <span className="text-[11px] text-[#A6A29A] dark:text-[#8C8880]">
            سهمیه توشه ماهانه: {quota.keepsUsedThisMonth} از {quota.maxKeepsPerMonth}
          </span>
        )}
      </div>

      {/* Main Single Exhibition Screen */}
      <div className="my-auto py-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-[#8C8880] dark:text-[#A6A29A] font-serif italic text-xl"
            >
              در سکوت به دنبال یک اندیشه ناب…
            </motion.div>
          ) : lesson ? (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-10 text-right"
            >
              {/* The Distilled Lesson */}
              <div className="relative">
                <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-[#191918] dark:text-[#EDE8DF] font-normal leading-[1.4] tracking-tight">
                  «{lesson.text}»
                </blockquote>
              </div>

              {/* Author Metadata & Evolution pill */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#73706B] dark:text-[#A6A29A] border-t border-[#E8E4DC] dark:border-[#2D2B27] pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-medium text-[#2E2D2A] dark:text-[#EDE8DF]">{authorName}</span>
                  <span>·</span>
                  <span>{authorLocation}</span>
                  {lesson.topics && lesson.topics.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-xs text-[#8C8880] dark:text-[#73706B]">
                        {lesson.topics.map(t => TOPIC_LABELS_FA[t as TopicType] || t).join('، ')}
                      </span>
                    </>
                  )}

                  {hasEvolution && (
                    <button
                      onClick={() => setActiveView('previous')}
                      className="text-[11px] px-2 py-0.5 bg-[#F5F2EC] dark:bg-[#1E1D1B] border border-[#D5D0C5] dark:border-[#3A3834] text-[#191918] dark:text-[#EDE8DF] hover:bg-[#E8E4DC] dark:hover:bg-[#2A2825] rounded-xs transition-colors flex items-center gap-1"
                      title="مشاهده درس‌های پیشین این فرد در آرشیو"
                    >
                      <History className="w-3 h-3" />
                      <span>دارای درس پیشین در آرشیو</span>
                    </button>
                  )}
                </div>

                {/* Report trigger */}
                <button
                  onClick={() => setReportModalLesson(lesson)}
                  className="text-xs text-[#A6A29A] dark:text-[#73706B] hover:text-[#595754] dark:hover:text-[#EDE8DF] transition-colors flex items-center gap-1"
                  title="گزارش محتوای نامناسب"
                >
                  <Flag className="w-3 h-3" />
                  <span>گزارش</span>
                </button>
              </div>

              {/* Optional Context Reveal ("What taught you this?") */}
              {lesson.context && (
                <div className="bg-[#F5F2EC]/80 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] p-5 rounded-sm space-y-2 text-right">
                  <button
                    onClick={() => setShowContext(!showContext)}
                    className="text-xs font-medium text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] flex items-center justify-between w-full"
                  >
                    <span>چه رخدادی این درس را آموخت؟</span>
                    {showContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {showContext && (
                    <p className="text-sm text-[#403E3B] dark:text-[#D5D0C5] font-light leading-relaxed pt-2 border-t border-[#E8E4DC]/60 dark:border-[#2D2B27]">
                      {lesson.context}
                    </p>
                  )}
                </div>
              )}

              {/* Personal Reflection Indicator if exists */}
              {userReflection && (
                <div className="p-4 bg-white/80 dark:bg-[#1C1B19] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#595754] dark:text-[#A6A29A] space-y-1 text-right rounded-sm">
                  <span className="font-semibold text-[#191918] dark:text-[#EDE8DF] block">
                    تأمل شخصی شما بر این درس
                  </span>
                  <p className="italic font-serif text-sm text-[#2E2D2A] dark:text-[#EDE8DF]">«{userReflection}»</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-20 font-serif text-xl text-[#73706B] dark:text-[#A6A29A]">
              درسی یافت نشد. می‌توانید درس دیگری را امتحان کنید.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Exhibition Bottom Actions */}
      <div className="border-t border-[#E8E4DC] dark:border-[#2D2B27] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Thoughtful Social Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          {/* Keep Button */}
          <button
            id="one-btn-keep"
            onClick={handleToggleKeep}
            disabled={!lesson}
            className={`px-4 py-2.5 rounded-sm text-xs font-medium flex items-center gap-2 transition-all ${
              isKept
                ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211]'
                : 'border border-[#C8C3B8] dark:border-[#3A3834] text-[#403E3B] dark:text-[#EDE8DF] hover:border-[#191918] dark:hover:border-[#EDE8DF] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
            }`}
            title="همراه داشتن این درس در توشه راه"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isKept ? 'fill-current' : ''}`} />
            <span>{isKept ? 'در توشه راه است' : 'نگه‌داشتن در توشه'}</span>
          </button>

          {/* Reflect Button */}
          <button
            id="one-btn-reflect"
            onClick={() => {
              if (!user) {
                setAuthModalOpen(true);
              } else if (lesson) {
                setReflectModalLesson(lesson);
              }
            }}
            disabled={!lesson}
            className="px-4 py-2.5 border border-[#C8C3B8] dark:border-[#3A3834] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#403E3B] dark:text-[#EDE8DF] hover:text-[#191918] dark:hover:text-[#EDE8DF] rounded-sm text-xs font-medium flex items-center gap-2 transition-colors"
            title="نوشتن یک تأمل شخصی و محرمانه"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>تأمل و یادداشت</span>
          </button>

          {/* "I Needed This" Button (rate limited / subtle note) */}
          <button
            id="one-btn-needed"
            onClick={handleNeeded}
            disabled={!lesson || hasMarkedNeeded}
            className={`px-4 py-2.5 border rounded-sm text-xs font-medium flex items-center gap-2 transition-colors ${
              hasMarkedNeeded
                ? 'border-[#A6A29A] dark:border-[#3A3834] text-[#8C8880] dark:text-[#73706B] cursor-default bg-white/40 dark:bg-[#1C1B19]'
                : 'border-[#C8C3B8] dark:border-[#3A3834] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#403E3B] dark:text-[#EDE8DF] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
            }`}
            title="فرستادن پیامی بی‌صدا به نویسنده که این درس گره‌گشای امروز شما بود"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{hasMarkedNeeded ? 'پیام ارسال شد' : 'امروز به این نیاز داشتم'}</span>
          </button>

          {/* Share Card Modal */}
          <button
            id="one-btn-share"
            onClick={() => {
              if (lesson) setShareCardLesson(lesson);
            }}
            disabled={!lesson}
            className="p-2.5 border border-[#C8C3B8] dark:border-[#3A3834] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#403E3B] dark:text-[#EDE8DF] hover:text-[#191918] dark:hover:text-[#EDE8DF] rounded-sm transition-colors"
            title="تولید کارت گرافیکی برای اشتراک‌گذاری"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Next Action */}
        <button
          id="one-btn-next"
          onClick={handleNext}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium flex items-center justify-center gap-2 shadow-xs"
        >
          <span>درس بعدی</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
