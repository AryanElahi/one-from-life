import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PreviousLessonItem, ALL_TOPICS, TOPIC_LABELS_FA, TopicType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  Search,
  Bookmark,
  MessageSquare,
  Share2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Clock,
  Filter,
  Check,
} from 'lucide-react';

export const PreviousLessonsView: React.FC = () => {
  const {
    user,
    setAuthModalOpen,
    toggleKeep,
    setReflectModalLesson,
    setShareCardLesson,
  } = useApp();

  const [lessons, setLessons] = useState<PreviousLessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewStyle, setViewStyle] = useState<'evolution' | 'cards'>('evolution');

  const ageGroups = ['All', '20–29', '30–39', '40–49', '50–59', '60+'];
  const ageLabelsFa: Record<string, string> = {
    All: 'همه سنین',
    '20–29': '۲۰ تا ۲۹ سال',
    '30–39': '۳۰ تا ۳۹ سال',
    '40–49': '۴۰ تا ۴۹ سال',
    '50–59': '۵۰ تا ۵۹ سال',
    '60+': '۶۰ سال به بالا',
  };

  const fetchPreviousLessons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTopic !== 'All') params.append('topic', selectedTopic);
      if (selectedAgeGroup !== 'All') params.append('ageGroup', selectedAgeGroup);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/lessons/previous?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data.previousLessons || []);
      }
    } catch (err) {
      console.error('Error fetching previous lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousLessons();
  }, [selectedTopic, selectedAgeGroup]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPreviousLessons();
  };

  const handleToggleKeep = async (lesson: PreviousLessonItem) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const newStatus = await toggleKeep(lesson.id);
    setLessons(prev =>
      prev.map(l => (l.id === lesson.id ? { ...l, isKept: newStatus } : l))
    );
  };

  return (
    <div id="previous-lessons-container" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 text-right">
      
      {/* Editorial Header */}
      <div className="space-y-4 border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-8">
        <div className="flex items-center gap-2 text-xs text-[#8C8880] dark:text-[#A6A29A]">
          <History className="w-3.5 h-3.5" />
          <span>آرشیو تاریخی تجارب زیسته</span>
          <span>·</span>
          <span>تکامل خرد انسان در گذر سال‌ها</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#191918] dark:text-[#EDE8DF] tracking-tight leading-tight">
          درس‌های پیشین و ردپای دگرگونی
        </h1>

        <p className="text-sm sm:text-base text-[#595754] dark:text-[#A6A29A] max-w-3xl leading-relaxed font-light">
          در فلسفه «یکی از یک زندگی»، وقتی کسی درسی را جایگزین می‌کند، گذشته محو نمی‌شود؛ بلکه به گنجینه بایگانی منتقل می‌شود تا سیر تحول اندیشه و بلوغ روان انسان‌ها را در گذر عمر به تصویر بکشد.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-6 bg-[#F5F2EC]/60 dark:bg-[#181716] p-6 border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="search-previous-lessons"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="جستجو در متن درس‌های گذشته، روایت‌ها یا نویسندگان..."
              className="w-full bg-[#FAF8F5] dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] rounded-sm py-2.5 px-4 pl-10 text-sm text-[#191918] dark:text-[#EDE8DF] placeholder-[#8C8880] dark:placeholder-[#73706B] focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] transition-colors"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
              title="جستجو"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium"
          >
            جستجو
          </button>
        </form>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
          
          {/* Topic & Age selects */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#73706B] dark:text-[#A6A29A] flex items-center gap-1">
                <Filter className="w-3 h-3" />
                موضوع:
              </span>
              <select
                id="filter-topic-select"
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="bg-[#FAF8F5] dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-[#191918] dark:text-[#EDE8DF] text-xs py-1.5 px-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF]"
              >
                <option value="All">همه موضوعات</option>
                {ALL_TOPICS.map(t => (
                  <option key={t} value={t}>
                    {TOPIC_LABELS_FA[t]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#73706B] dark:text-[#A6A29A]">رده سنی در آن زمان:</span>
              <select
                id="filter-age-select"
                value={selectedAgeGroup}
                onChange={e => setSelectedAgeGroup(e.target.value)}
                className="bg-[#FAF8F5] dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-[#191918] dark:text-[#EDE8DF] text-xs py-1.5 px-2.5 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF]"
              >
                {ageGroups.map(ag => (
                  <option key={ag} value={ag}>
                    {ageLabelsFa[ag] || ag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#121211] p-1 border border-[#D5D0C5] dark:border-[#3A3834] rounded-sm self-start sm:self-auto">
            <button
              onClick={() => setViewStyle('evolution')}
              className={`px-3 py-1 text-xs rounded-sm transition-colors flex items-center gap-1.5 ${
                viewStyle === 'evolution'
                  ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                  : 'text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>تطبیق و تکامل</span>
            </button>
            <button
              onClick={() => setViewStyle('cards')}
              className={`px-3 py-1 text-xs rounded-sm transition-colors flex items-center gap-1.5 ${
                viewStyle === 'cards'
                  ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                  : 'text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>کارت‌های آرشیو</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-[#191918] dark:border-[#EDE8DF] border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-sm text-[#73706B] dark:text-[#A6A29A]">در حال گشودن برگ‌های پیشین تاریخ...</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-dashed border-[#D5D0C5] dark:border-[#3A3834] p-8 rounded-sm">
          <History className="w-8 h-8 text-[#8C8880] dark:text-[#73706B] mx-auto opacity-60" />
          <p className="font-serif text-xl text-[#191918] dark:text-[#EDE8DF]">هیچ درس پیشینی با این مشخصات یافت نشد.</p>
          <p className="text-xs text-[#73706B] dark:text-[#A6A29A]">می‌توانید فیلترها را تغییر داده یا جستجوی دیگری انجام دهید.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs text-[#8C8880] dark:text-[#A6A29A]">
            <span>{lessons.length} درس پیشین در آرشیو ثبت شده است</span>
          </div>

          <div className="space-y-8">
            {lessons.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] hover:border-[#C8C3B8] dark:hover:border-[#3E3B36] p-6 sm:p-8 rounded-sm transition-all shadow-xs"
              >
                {viewStyle === 'evolution' && item.currentEvolution ? (
                  /* Evolution Comparison Layout */
                  <div className="space-y-6">
                    
                    {/* Header with author info */}
                    <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-4 text-xs text-[#73706B] dark:text-[#A6A29A]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#191918] dark:text-[#EDE8DF]">
                          {item.isAnonymous ? 'ناشناس' : item.authorDisplayName}
                        </span>
                        <span>·</span>
                        <span>{item.authorCity ? `${item.authorCity}، ${item.authorCountry}` : item.authorCountry}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[#8C8880] dark:text-[#73706B]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>سیر تکامل اندیشه</span>
                      </div>
                    </div>

                    {/* Side-by-Side or Stacked Evolution Contrast */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      
                      {/* Past Lesson Card */}
                      <div className="p-5 bg-[#F5F2EC]/80 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium px-2 py-0.5 bg-[#E8E4DC] dark:bg-[#252422] text-[#595754] dark:text-[#A6A29A] rounded-xs">
                              درس پیشین (در {item.authorAge} سالگی)
                            </span>
                            <span className="text-[11px] text-[#8C8880] dark:text-[#73706B]">
                              {new Date(item.publishedAt).toLocaleDateString('fa-IR')}
                            </span>
                          </div>

                          <p className="font-serif text-lg sm:text-xl text-[#333230] dark:text-[#D5D0C5] leading-relaxed italic">
                            «{item.text}»
                          </p>

                          {item.context && (
                            <p className="text-xs text-[#73706B] dark:text-[#8C8880] pt-2 border-t border-[#E8E4DC]/60 dark:border-[#2D2B27]">
                              زمینه: {item.context}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Current Lesson Card */}
                      <div className="p-5 bg-white dark:bg-[#1E1D1B] border border-[#D5D0C5] dark:border-[#3A3834] rounded-sm flex flex-col justify-between space-y-4 shadow-2xs">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium px-2 py-0.5 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] rounded-xs flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              درس کنونی (در {item.currentEvolution.authorAge} سالگی)
                            </span>
                            <span className="text-[11px] text-[#8C8880] dark:text-[#73706B]">
                              امروز
                            </span>
                          </div>

                          <p className="font-serif text-lg sm:text-xl text-[#191918] dark:text-[#EDE8DF] font-medium leading-relaxed">
                            «{item.currentEvolution.text}»
                          </p>

                          {item.currentEvolution.context && (
                            <p className="text-xs text-[#73706B] dark:text-[#A6A29A] pt-2 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
                              زمینه تکامل: {item.currentEvolution.context}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
                      <div className="flex flex-wrap gap-1.5">
                        {item.topics.map(t => (
                          <span
                            key={t}
                            className="text-[11px] text-[#73706B] dark:text-[#A6A29A] bg-[#F5F2EC] dark:bg-[#252422] px-2 py-0.5 rounded-xs"
                          >
                            {TOPIC_LABELS_FA[t] || t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleKeep(item)}
                          className={`p-2 rounded-xs border transition-colors flex items-center gap-1.5 text-xs ${
                            item.isKept
                              ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] border-[#191918] dark:border-[#EDE8DF]'
                              : 'bg-transparent border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
                          }`}
                          title={item.isKept ? 'در توشه شماست' : 'برداشتن در توشه'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${item.isKept ? 'fill-current' : ''}`} />
                          <span className="hidden sm:inline">{item.isKept ? 'در توشه' : 'توشه'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!user) setAuthModalOpen(true);
                            else setReflectModalLesson(item);
                          }}
                          className="p-2 rounded-xs border border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors flex items-center gap-1.5 text-xs"
                          title="نوشتن تأمل شخصی"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">تأمل</span>
                        </button>

                        <button
                          onClick={() => setShareCardLesson(item)}
                          className="p-2 rounded-xs border border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors flex items-center gap-1.5 text-xs"
                          title="ساخت کارت یادگار"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Standard Archive Card Layout */
                  <div className="space-y-5">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-3 text-xs text-[#73706B] dark:text-[#A6A29A]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#191918] dark:text-[#EDE8DF]">
                          {item.isAnonymous ? 'ناشناس' : item.authorDisplayName}
                        </span>
                        <span>·</span>
                        <span>در {item.authorAge} سالگی</span>
                        <span>·</span>
                        <span>{item.authorCity ? `${item.authorCity}، ${item.authorCountry}` : item.authorCountry}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[#8C8880] dark:text-[#73706B]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>بایگانی شده</span>
                      </div>
                    </div>

                    {/* Lesson Text */}
                    <blockquote className="font-serif text-2xl sm:text-3xl text-[#191918] dark:text-[#EDE8DF] leading-relaxed font-normal">
                      «{item.text}»
                    </blockquote>

                    {item.context && (
                      <p className="text-xs sm:text-sm text-[#595754] dark:text-[#A6A29A] italic border-r-2 border-[#D5D0C5] dark:border-[#3A3834] pr-3">
                        زمینه زیسته: {item.context}
                      </p>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
                      <div className="flex flex-wrap gap-1.5">
                        {item.topics.map(t => (
                          <span
                            key={t}
                            className="text-[11px] text-[#73706B] dark:text-[#A6A29A] bg-[#F5F2EC] dark:bg-[#252422] px-2 py-0.5 rounded-xs"
                          >
                            {TOPIC_LABELS_FA[t] || t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleKeep(item)}
                          className={`p-2 rounded-xs border transition-colors flex items-center gap-1.5 text-xs ${
                            item.isKept
                              ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] border-[#191918] dark:border-[#EDE8DF]'
                              : 'bg-transparent border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
                          }`}
                          title={item.isKept ? 'در توشه شماست' : 'برداشتن در توشه'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${item.isKept ? 'fill-current' : ''}`} />
                          <span className="hidden sm:inline">{item.isKept ? 'در توشه' : 'توشه'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!user) setAuthModalOpen(true);
                            else setReflectModalLesson(item);
                          }}
                          className="p-2 rounded-xs border border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors flex items-center gap-1.5 text-xs"
                          title="نوشتن تأمل شخصی"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">تأمل</span>
                        </button>

                        <button
                          onClick={() => setShareCardLesson(item)}
                          className="p-2 rounded-xs border border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors flex items-center gap-1.5 text-xs"
                          title="ساخت کارت یادگار"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
