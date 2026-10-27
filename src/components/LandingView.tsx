import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, Compass, Feather, Bookmark, MessageSquareQuote } from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setActiveView, setShareModalOpen } = useApp();

  const curatedExamples = [
    {
      id: 'seed-2',
      text: '«بخش زیادی از عمرم را صرف این کردم که خودم را به کسانی بفهمانم که از قبل تصمیم‌شان را درباره من گرفته بودند.»',
      author: '۳۸ ساله · لیسبون',
      context: 'یک دهه تلاش برای جلب رضایت شرکای سابق تجاری.',
      topic: 'آزادی و رهایی',
    },
    {
      id: 'seed-1',
      text: '«فرصتی که داری کمتر از آن چیزی است که فکر می‌کنی، اما اختیارت بر زندگی بیشتر از آن است که تصور می‌کنی.»',
      author: '۷۱ ساله · کیوتو',
      context: 'تجربه‌ای حاصل از ۴۴ سال نجاری سنتی در کیوتو.',
      topic: 'زمان و کهنسالی',
    },
    {
      id: 'seed-3',
      text: '«کسانی که بیشترین تلاش را می‌کنی تا تحت تأثیر قرارشان دهی، حتی ذره‌ای از آنچه فکر می‌کنی به تو فکر نمی‌کنند.»',
      author: '۳۴ ساله · تهران',
      context: 'درک شده در گردهمایی دانشگاه پس از سال‌ها اضطراب پنهان.',
      topic: 'رشد و خرد',
    },
  ];

  return (
    <div id="landing-container" className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Editorial Brand Accent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center gap-2 text-xs text-[#73706B]"
        >
          <span>یک آرشیو زنده</span>
          <span>·</span>
          <span>تجربه زیسته انسان</span>
        </motion.div>

        {/* Primary Question */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#191918] tracking-tight leading-[1.25] mb-6 max-w-3xl"
        >
          زندگی به شما <span className="italic font-normal">چه آموخت؟</span>
        </motion.h1>

        {/* Supporting Line */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#595754] font-light max-w-xl mb-12 leading-relaxed"
        >
          یک درس. از یک زندگی.
        </motion.p>

        {/* Primary and Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            id="landing-cta-share"
            onClick={() => setShareModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-sm font-medium flex items-center justify-center gap-3 shadow-xs"
          >
            <Feather className="w-4 h-4" />
            <span>ثبت درس خودتان</span>
          </button>

          <button
            id="landing-cta-discover"
            onClick={() => setActiveView('one')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#191918] dark:border-[#EDE8DF] text-[#191918] dark:text-[#EDE8DF] hover:bg-[#191918]/5 dark:hover:bg-[#EDE8DF]/10 transition-colors rounded-sm text-sm font-medium flex items-center justify-center gap-3"
          >
            <Compass className="w-4 h-4" />
            <span>خواندن یک درس (یکی)</span>
          </button>

          <button
            id="landing-cta-previous"
            onClick={() => setActiveView('previous')}
            className="w-full sm:w-auto px-6 py-4 bg-[#F5F2EC] dark:bg-[#1E1D1B] border border-[#E8E4DC] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors rounded-sm text-sm font-medium flex items-center justify-center gap-2"
          >
            <span>آرشیو درس‌های پیشین</span>
          </button>
        </motion.div>
      </section>

      {/* Curated Authentic Seed Lessons Exhibition */}
      <section className="border-t border-[#E8E4DC] dark:border-[#2D2B27] py-16 md:py-24 px-4 sm:px-6 bg-[#F5F2EC]/60 dark:bg-[#181716]/60">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center">
            <span className="text-[12px] text-[#8C8880] dark:text-[#A6A29A] block">
              چکیده‌ای از زندگی‌های زیسته
            </span>
          </div>

          <div className="space-y-12">
            {curatedExamples.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="p-8 md:p-12 bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm transition-all hover:border-[#C8C3B8] dark:hover:border-[#3E3B36] text-right"
              >
                <p className="font-serif text-2xl sm:text-3xl md:text-3xl text-[#191918] dark:text-[#EDE8DF] leading-relaxed font-light mb-6">
                  {item.text}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#73706B] dark:text-[#A6A29A] border-t border-[#F0ECE4] dark:border-[#2D2B27] pt-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#403E3B] dark:text-[#D5D0C5]">{item.author}</span>
                    <span>·</span>
                    <span className="italic text-[#8C8880] dark:text-[#73706B]">{item.topic}</span>
                  </div>

                  <button
                    onClick={() => setActiveView('one')}
                    className="text-xs text-[#191918] dark:text-[#EDE8DF] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span>مشاهده در بخش «یکی»</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Calming invitation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-center">
            <button
              onClick={() => setActiveView('wander')}
              className="inline-flex items-center gap-2 text-sm text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] font-serif italic transition-colors"
            >
              <span>پرسه در میان صداها و بینش‌های سراسر جهان</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="text-[#8C8880] hidden sm:inline">·</span>

            <button
              onClick={() => setActiveView('previous')}
              className="inline-flex items-center gap-2 text-sm text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] font-serif italic transition-colors"
            >
              <span>مشاهده درس‌های پیشین و تکامل خرد انسان‌ها</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto text-center space-y-8">
        <h2 className="font-serif text-2xl md:text-3xl text-[#191918] dark:text-[#EDE8DF] font-normal leading-snug">
          «گذشته را نمی‌توان بازنویسی کرد؛ تنها می‌توان رو به جلو گام برداشت.»
        </h2>
        <p className="text-sm text-[#73706B] dark:text-[#A6A29A] leading-relaxed max-w-xl mx-auto">
          هر انسانی زندگی کرده است. در این آرشیو آرام، هر فرد در هر لحظه تنها یک درس عمومی به یادگار می‌گذارد. درسی که ثبت شود دیگر قابل ویرایش یا حذف نیست — تنها زمانی که خرد تازه‌ای جایش را بگیرد، درس پیشین به گنجینه درس‌های پیشین و خلوتگاه شخصی سفرتان منتقل می‌شود.
        </p>
      </section>

    </div>
  );
};
