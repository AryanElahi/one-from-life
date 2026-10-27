import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lesson, TOPIC_LABELS_FA, TopicType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  MessageSquare,
  HeartHandshake,
  Share2,
  ArrowRight,
  ArrowLeft,
  Compass,
  Feather,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const WanderView: React.FC = () => {
  const {
    user,
    token,
    quota,
    toggleKeep,
    setReflectModalLesson,
    setShareCardLesson,
    setReportModalLesson,
    markNeeded,
    setShareModalOpen,
    setAuthModalOpen,
  } = useApp();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const fetchWanderBatch = async () => {
    setLoading(true);
    setSessionCompleted(false);
    setCurrentIndex(0);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/lessons/wander', { headers });
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
      }
    } catch (err) {
      console.error('Error fetching Wander lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWanderBatch();
  }, [token]);

  const currentLesson = lessons[currentIndex];

  const handleNext = () => {
    if (currentIndex + 1 < lessons.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reached the finite session limit
      setSessionCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleToggleKeep = async () => {
    if (!currentLesson) return;
    const kept = await toggleKeep(currentLesson.id);
    setLessons(prev =>
      prev.map((item, idx) => (idx === currentIndex ? { ...item, isKept: kept } : item))
    );
  };

  const authorLocation = [
    currentLesson?.authorAge ? `${currentLesson.authorAge} ساله` : null,
    currentLesson?.authorCity || currentLesson?.authorCountry,
  ]
    .filter(Boolean)
    .join(' · ');

  const authorName = currentLesson?.isAnonymous
    ? 'ناشناس'
    : currentLesson?.authorDisplayName || 'یک رهگذر';

  return (
    <div id="wander-view-container" className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Top Session Progress Bar & Philosophy */}
      <div className="flex items-center justify-between text-xs text-[#8C8880] dark:text-[#A6A29A]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#191918] dark:text-[#EDE8DF]" />
          <span className="font-medium">پرسه · صداهایی از افرادی که شاید هرگز نبینید</span>
        </div>

        {!sessionCompleted && lessons.length > 0 && (
          <div className="flex items-center gap-1.5">
            {lessons.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-[#191918] dark:bg-[#EDE8DF]'
                    : idx < currentIndex
                    ? 'w-2 bg-[#8C8880] dark:bg-[#73706B]'
                    : 'w-2 bg-[#E8E4DC] dark:bg-[#2D2B27]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
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
              در حال پرسه در میان خاطرات و زندگی‌های دور و نزدیک…
            </motion.div>
          ) : sessionCompleted ? (
            /* Finite Session Ending Screen (Anti-feed discipline) */
            <motion.div
              key="session-end"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center py-12 space-y-8 max-w-lg mx-auto"
            >
              <div className="w-8 h-8 mx-auto rounded-full border border-[#191918] dark:border-[#EDE8DF] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#191918] dark:bg-[#EDE8DF]"></div>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#191918] dark:text-[#EDE8DF] font-normal">
                برای اکنون همین بس است.
              </h2>

              <p className="text-sm text-[#73706B] dark:text-[#A6A29A] leading-relaxed">
                امروز در کنار چند زندگی درنگ کردید. خرد برای نشستن در جان به زمان و سکوت نیاز دارد. آنچه بر دلتان نشست را به همراه ببرید یا خود نیز درسی از زندگی‌تان به یادگار بگذارید.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  id="wander-btn-leave-yours"
                  onClick={() => setShareModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium flex items-center justify-center gap-2"
                >
                  <Feather className="w-3.5 h-3.5" />
                  <span>ثبت درس خودتان</span>
                </button>

                <button
                  id="wander-btn-restart"
                  onClick={fetchWanderBatch}
                  className="w-full sm:w-auto px-6 py-3 border border-[#191918] dark:border-[#EDE8DF] text-[#191918] dark:text-[#EDE8DF] hover:bg-[#191918]/5 dark:hover:bg-[#EDE8DF]/10 transition-colors rounded-sm text-xs font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>آغاز پرسه‌ای تازه</span>
                </button>
              </div>
            </motion.div>
          ) : currentLesson ? (
            /* Current Wander Lesson */
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-8 text-right"
            >
              <div className="relative">
                <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#191918] dark:text-[#EDE8DF] font-normal leading-[1.4] tracking-tight">
                  «{currentLesson.text}»
                </blockquote>
              </div>

              {/* Author and context */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#73706B] dark:text-[#A6A29A] border-t border-[#E8E4DC] dark:border-[#2D2B27] pt-6">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#2E2D2A] dark:text-[#EDE8DF]">{authorName}</span>
                  <span>·</span>
                  <span>{authorLocation}</span>
                  {currentLesson.topics && (
                    <>
                      <span>·</span>
                      <span className="text-xs text-[#8C8880] dark:text-[#73706B]">
                        {currentLesson.topics.map(t => TOPIC_LABELS_FA[t as TopicType] || t).join('، ')}
                      </span>
                    </>
                  )}
                </div>

                <span className="text-xs text-[#A6A29A] dark:text-[#73706B]">
                  درس {currentIndex + 1} از {lessons.length}
                </span>
              </div>

              {currentLesson.context && (
                <div className="bg-[#F5F2EC]/60 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] p-4 rounded-sm text-xs text-[#595754] dark:text-[#A6A29A] leading-relaxed text-right">
                  <span className="font-semibold text-[#191918] dark:text-[#EDE8DF] block mb-1 text-[11px]">
                    داستان و زمینه
                  </span>
                  {currentLesson.context}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      {!sessionCompleted && (
        <div className="border-t border-[#E8E4DC] dark:border-[#2D2B27] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center sm:justify-start">
            <button
              id="wander-btn-keep"
              onClick={handleToggleKeep}
              disabled={!currentLesson}
              className={`px-4 py-2.5 rounded-sm text-xs font-medium flex items-center gap-2 transition-all ${
                currentLesson?.isKept
                  ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211]'
                  : 'border border-[#C8C3B8] dark:border-[#3A3834] text-[#403E3B] dark:text-[#EDE8DF] hover:border-[#191918] dark:hover:border-[#EDE8DF] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${currentLesson?.isKept ? 'fill-current' : ''}`} />
              <span>{currentLesson?.isKept ? 'در توشه است' : 'نگه‌داشتن'}</span>
            </button>

            <button
              id="wander-btn-reflect"
              onClick={() => {
                if (!user) setAuthModalOpen(true);
                else if (currentLesson) setReflectModalLesson(currentLesson);
              }}
              disabled={!currentLesson}
              className="px-4 py-2.5 border border-[#C8C3B8] dark:border-[#3A3834] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#403E3B] dark:text-[#EDE8DF] hover:text-[#191918] dark:hover:text-[#EDE8DF] rounded-sm text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>تأمل</span>
            </button>

            <button
              id="wander-btn-share"
              onClick={() => {
                if (currentLesson) setShareCardLesson(currentLesson);
              }}
              disabled={!currentLesson}
              className="p-2.5 border border-[#C8C3B8] dark:border-[#3A3834] hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#403E3B] dark:text-[#EDE8DF] hover:text-[#191918] dark:hover:text-[#EDE8DF] rounded-sm transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              id="wander-btn-prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-3 border border-[#E8E4DC] dark:border-[#2D2B27] disabled:opacity-30 hover:border-[#191918] dark:hover:border-[#EDE8DF] text-[#191918] dark:text-[#EDE8DF] rounded-sm text-xs font-medium flex items-center gap-2"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>قبلی</span>
            </button>

            <button
              id="wander-btn-next"
              onClick={handleNext}
              className="px-6 py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium flex items-center gap-2"
            >
              <span>{currentIndex + 1 === lessons.length ? 'پایان پرسه' : 'بعدی'}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
