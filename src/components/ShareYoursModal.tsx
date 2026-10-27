import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_TOPICS, TopicType, TOPIC_LABELS_FA } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Feather, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const ShareYoursModal: React.FC = () => {
  const {
    user,
    currentLesson,
    shareModalOpen,
    setShareModalOpen,
    publishLesson,
    setAuthModalOpen,
    setActiveView,
    updateProfile,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [text, setText] = useState('');
  const [context, setContext] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>(['Life']);
  const [anonymousMode, setAnonymousMode] = useState(user?.anonymousMode || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!shareModalOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] p-8 max-w-md w-full rounded-sm text-center space-y-6 shadow-xl text-right"
        >
          <div className="w-8 h-8 mx-auto rounded-full border border-[#191918] dark:border-[#EDE8DF] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#191918] dark:bg-[#EDE8DF]"></div>
          </div>
          <h3 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF] text-center">ثبت درس زیسته شما</h3>
          <p className="text-sm text-[#73706B] dark:text-[#A6A29A] leading-relaxed text-center">
            برای حفظ اصالت کلام و صیانت از خلوت شخصی سفر شما، لطفاً پیش از انتشار وارد حساب خود شوید یا نام‌نویسی کنید.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                setShareModalOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] rounded-sm text-xs font-medium transition-colors"
            >
              ورود / ثبت‌نام
            </button>
            <button
              onClick={() => setShareModalOpen(false)}
              className="text-xs text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
            >
              انصراف
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const toggleTopic = (topic: TopicType) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(t => t !== topic));
      }
    } else {
      if (selectedTopics.length < 3) {
        setSelectedTopics([...selectedTopics, topic]);
      }
    }
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!text.trim()) {
        setErrorMsg('لطفاً آنچه زندگی به شما آموخته را بنویسید.');
        return;
      }
      if (text.length > 700) {
        setErrorMsg('لطفاً کلام خود را در محدوده ۷۰۰ نویسه نگه دارید.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (anonymousMode !== user.anonymousMode) {
        await updateProfile({ anonymousMode });
      }

      await publishLesson({
        text: text.trim(),
        context: context.trim() || undefined,
        topics: selectedTopics,
      });

      setShareModalOpen(false);
      setText('');
      setContext('');
      setStep(1);
      setActiveView('journey');
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در انتشار درس.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 sm:p-10 max-w-2xl w-full rounded-sm shadow-2xl relative my-8 text-right"
      >
        {/* Close button */}
        <button
          onClick={() => setShareModalOpen(false)}
          className="absolute top-5 left-5 text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Step Indicator */}
        <div className="flex items-center justify-between text-xs text-[#8C8880] dark:text-[#A6A29A] mb-8 border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-3">
          <span>گام {step} از ۴</span>
          <span>
            {step === 1 && 'چکیده بینش'}
            {step === 2 && 'زمینه و رخداد (اختیاری)'}
            {step === 3 && 'موضوعات و نحوه نمایش'}
            {step === 4 && 'تأیید و انتشار ماندگار'}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-[#FFF5F5] dark:bg-[#2A1515] border border-[#FEB2B2] dark:border-[#742A2A] text-xs text-[#C53030] dark:text-[#FEB2B2] rounded-sm">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: The Core Distilled Lesson */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#191918] dark:text-[#EDE8DF] mb-2 font-normal">
                زندگی به شما چه آموخته است؟
              </h3>
              <p className="text-xs text-[#73706B] dark:text-[#A6A29A] leading-relaxed">
                چیزی را بنویسید که روزگار به شما آموخته؛ نه کلامی که صرفاً حکیمانه به نظر برسد. نیازی نیست فلسفی یا پیچیده باشد، تنها باید برآمده از تجربه زیسته شما باشد.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                id="share-lesson-textarea"
                rows={5}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="یک آموزه ارزشمند که تا اینجای زندگی با خود داشته‌اید…"
                className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-[#191918] dark:text-[#EDE8DF] font-serif text-lg p-4 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] leading-relaxed resize-none text-right"
                maxLength={700}
              />
              <div className="flex justify-between text-[11px] text-[#A6A29A] dark:text-[#73706B]">
                <span>یک جمله یا یک بند کوتاه</span>
                <span>{text.length} / ۷۰۰</span>
              </div>
            </div>

            <div className="flex justify-start pt-4">
              <button
                id="share-step1-next"
                onClick={handleNextStep}
                disabled={!text.trim()}
                className="px-6 py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] disabled:opacity-30 transition-colors rounded-sm text-xs font-medium flex items-center gap-2"
              >
                <span>ادامه</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Optional Context */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#191918] dark:text-[#EDE8DF] mb-2 font-normal">
                چه رخدادی این را به شما آموخت؟
              </h3>
              <p className="text-xs text-[#73706B] dark:text-[#A6A29A] leading-relaxed">
                اختیاری. زمینه یا موقعیتی را که باعث شکل‌گیری این بینش شد به کوتاهی شرح دهید. این کار از تبدیل شدن آرشیو به نقل‌قول‌های کلی و انتزاعی جلوگیری می‌کند.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                id="share-context-textarea"
                rows={4}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="مثلاً: پس از یک دهه کار در حقوق یا مراقبت از بیماری نزدیکانم آموختم که..."
                className="w-full bg-white dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-[#191918] dark:text-[#EDE8DF] text-sm p-4 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] leading-relaxed resize-none text-right"
                maxLength={400}
              />
              <div className="flex justify-between text-[11px] text-[#A6A29A] dark:text-[#73706B]">
                <span>زمینه و بستر اختیاری</span>
                <span>{context.length} / ۴۰۰</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 border border-[#E8E4DC] dark:border-[#2D2B27] text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] rounded-sm text-xs font-medium flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت</span>
              </button>

              <button
                id="share-step2-next"
                onClick={handleNextStep}
                className="px-6 py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium flex items-center gap-2"
              >
                <span>ادامه</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Topics & Presence */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#191918] dark:text-[#EDE8DF] mb-2 font-normal">
                موضوعات و نحوه نمایش
              </h3>
              <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">
                حداکثر ۳ موضوع که پیام تجربه شما را به بهترین شکل دربرمی‌گیرد برگزینید.
              </p>
            </div>

            {/* Topic Pills */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block">
                موضوعات ({selectedTopics.length}/۳)
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_TOPICS.map(t => {
                  const isSel = selectedTopics.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTopic(t)}
                      className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
                        isSel
                          ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                          : 'bg-white dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] text-[#595754] dark:text-[#A6A29A] hover:border-[#191918] dark:hover:border-[#EDE8DF]'
                      }`}
                    >
                      {TOPIC_LABELS_FA[t] || t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Author Presence & Anonymous Mode */}
            <div className="p-4 bg-[#F5F2EC]/80 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-3">
              <span className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block">
                انتساب عمومی
              </span>
              <div className="flex items-center justify-between text-xs text-[#595754] dark:text-[#A6A29A]">
                <div>
                  <p className="font-medium text-[#191918] dark:text-[#EDE8DF]">
                    {anonymousMode ? 'ناشناس' : user.displayName} · {user.age} ساله · {user.city || user.country}
                  </p>
                  <p className="text-[11px] text-[#8C8880] dark:text-[#73706B]">
                    {anonymousMode ? 'نام شما به صورت عمومی پنهان است.' : 'نام نمایشی شما در کنار درستان نمایش داده می‌شود.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnonymousMode(!anonymousMode)}
                  className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                    anonymousMode
                      ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] border-[#191918] dark:border-[#EDE8DF]'
                      : 'border-[#C8C3B8] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:border-[#191918] dark:hover:border-[#EDE8DF]'
                  }`}
                >
                  {anonymousMode ? 'حالت ناشناس روشن' : 'انتشار با نام خودم'}
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 border border-[#E8E4DC] dark:border-[#2D2B27] text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] rounded-sm text-xs font-medium flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت</span>
              </button>

              <button
                id="share-step3-next"
                onClick={handleNextStep}
                className="px-6 py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium flex items-center gap-2"
              >
                <span>بررسی و تأیید نهایی</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Irreversible Publication Rule */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-4">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#191918] dark:text-[#EDE8DF] font-normal">
                {currentLesson ? 'جایگزینی درس کنونی' : 'ثبت درس در آرشیو'}
              </h3>
            </div>

            {/* Core Invariant Philosophical Principle */}
            <div className="p-5 bg-white dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C53030] dark:text-[#FEB2B2]">
                <AlertTriangle className="w-4 h-4" />
                <span>قانون تغییرناپذیر آرشیو</span>
              </div>
              <p className="text-xs text-[#595754] dark:text-[#A6A29A] leading-relaxed">
                <strong>پس از انتشار، این درس قابل ویرایش یا حذف نیست.</strong> انسان نمی‌تواند گذشته خود را بازنویسی کند؛ بلکه تنها می‌تواند به سوی آینده گام بردارد.
              </p>
              {currentLesson && (
                <p className="text-xs text-[#73706B] dark:text-[#8C8880] leading-relaxed pt-2 border-t border-[#F0ECE4] dark:border-[#2D2B27]">
                  با انتشار این درس جدید، درس عمومی پیشین شما با متانت به آرشیو شخصی <strong>«سفر»</strong> منتقل خواهد شد.
                </p>
              )}
            </div>

            {/* Preview */}
            <div className="p-6 bg-[#FAF8F5] dark:bg-[#161514] border border-[#D5D0C5] dark:border-[#3A3834] rounded-sm space-y-3">
              <span className="text-[10px] text-[#8C8880] dark:text-[#A6A29A] block">
                نحوه نمایش درس شما
              </span>
              <blockquote className="font-serif text-xl sm:text-2xl text-[#191918] dark:text-[#EDE8DF] leading-relaxed">
                «{text}»
              </blockquote>
              {context && (
                <p className="text-xs text-[#595754] dark:text-[#A6A29A] italic">
                  {context}
                </p>
              )}
              <div className="text-xs text-[#73706B] dark:text-[#8C8880] pt-2 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
                {anonymousMode ? 'ناشناس' : user.displayName} · {user.age} ساله · {user.city || user.country}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 border border-[#E8E4DC] dark:border-[#2D2B27] text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] rounded-sm text-xs font-medium flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت</span>
              </button>

              <button
                id="share-btn-publish"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] disabled:opacity-50 transition-colors rounded-sm text-xs font-semibold flex items-center gap-2 shadow-md"
              >
                <Feather className="w-4 h-4" />
                <span>{isSubmitting ? 'در حال ثبت در آرشیو…' : 'ماندگار کردن در آرشیو'}</span>
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
