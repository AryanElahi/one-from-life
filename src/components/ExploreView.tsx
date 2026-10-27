import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lesson, ALL_TOPICS, TOPIC_LABELS_FA, TopicType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Bookmark,
  MessageSquare,
  Share2,
  Sparkles,
  Layers,
  Users,
  Compass,
  ArrowLeft,
} from 'lucide-react';

const AGE_GROUPS_FA = [
  { value: 'All', label: 'همه سنین' },
  { value: 'Under 20', label: 'زیر ۲۰ سال' },
  { value: '20–29', label: '۲۰ تا ۲۹ سال' },
  { value: '30–39', label: '۳۰ تا ۳۹ سال' },
  { value: '40–49', label: '۴۰ تا ۴۹ سال' },
  { value: '50–59', label: '۵۰ تا ۵۹ سال' },
  { value: '60+', label: '۶۰ سال به بالا' },
];

export const ExploreView: React.FC = () => {
  const {
    token,
    user,
    toggleKeep,
    setReflectModalLesson,
    setShareCardLesson,
    setAuthModalOpen,
  } = useApp();

  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedAge, setSelectedAge] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Curated collections
  const [activeTab, setActiveTab] = useState<'all' | 'generations' | 'twolives'>('all');
  const [curatedData, setCuratedData] = useState<any>(null);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedTopic !== 'All') queryParams.append('topic', selectedTopic);
      if (selectedAge !== 'All') queryParams.append('ageGroup', selectedAge);
      if (selectedCountry !== 'All') queryParams.append('country', selectedCountry);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/lessons/explore?${queryParams.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
        setCountries(data.availableCountries || []);
      }
    } catch (err) {
      console.error('Error fetching explore lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCuratedCollections = async () => {
    try {
      const res = await fetch('/api/lessons/curated-collections');
      if (res.ok) {
        const data = await res.json();
        setCuratedData(data);
      }
    } catch (err) {
      console.error('Error loading collections:', err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [selectedTopic, selectedAge, selectedCountry, token]);

  useEffect(() => {
    fetchCuratedCollections();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLessons();
  };

  const handleToggleKeep = async (lessonId: string) => {
    const kept = await toggleKeep(lessonId);
    setLessons(prev =>
      prev.map(l => (l.id === lessonId ? { ...l, isKept: kept } : l))
    );
  };

  return (
    <div id="explore-view-container" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Header & Modes */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block">
          آرشیو موضوعی و ساختاریافته
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#191918] dark:text-[#EDE8DF] font-normal">
          کاوش در درک‌ها و بینش‌های زیسته
        </h1>
        <p className="text-sm text-[#73706B] dark:text-[#A6A29A] leading-relaxed">
          جستجو و پالایش بر اساس درون‌مایه انسانی، مرحله سنی، یا اقلیم جغرافیایی.
        </p>

        {/* Tab switcher */}
        <div className="flex justify-center items-center gap-2 pt-4 border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs rounded-sm transition-colors ${
              activeTab === 'all'
                ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                : 'text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
            }`}
          >
            همه موضوعات
          </button>
          <button
            onClick={() => setActiveTab('generations')}
            className={`px-4 py-1.5 text-xs rounded-sm transition-colors ${
              activeTab === 'generations'
                ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                : 'text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
            }`}
          >
            در گذر نسل‌ها
          </button>
          <button
            onClick={() => setActiveTab('twolives')}
            className={`px-4 py-1.5 text-xs rounded-sm transition-colors ${
              activeTab === 'twolives'
                ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                : 'text-[#73706B] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
            }`}
          >
            دو زندگی، دو درس متناقض
          </button>
        </div>
      </div>

      {/* Signature Collection: Across Generations */}
      {activeTab === 'generations' && curatedData?.acrossGenerations && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 sm:p-10 rounded-sm text-right"
        >
          <div className="border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-4">
            <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block">
              نگاه در آینه زمان
            </span>
            <h2 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF] mt-1">
              {curatedData.acrossGenerations.title}
            </h2>
            <p className="text-xs text-[#73706B] dark:text-[#A6A29A] mt-1">
              سن تنها بستر تجربه است، نه ملاک برتری. ببینید دهه‌های مختلف چگونه با موضوعاتی مثل خانواده و پیوندها مواجه می‌شوند.
            </p>
          </div>

          <div className="space-y-6">
            {curatedData.acrossGenerations.lessons.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-6 bg-white/70 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-3 text-right"
              >
                <span className="text-xs font-medium text-[#8C8880] dark:text-[#A6A29A] block">
                  {item.ageRange}
                </span>
                <p className="font-serif text-xl sm:text-2xl text-[#191918] dark:text-[#EDE8DF] leading-relaxed">
                  «{item.lesson.text}»
                </p>
                {item.lesson.context && (
                  <p className="text-xs text-[#73706B] dark:text-[#8C8880] italic pt-2 border-t border-[#F0ECE4] dark:border-[#2D2B27]">
                    {item.lesson.context}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Signature Collection: Two Lives, Two Lessons */}
      {activeTab === 'twolives' && curatedData?.twoLives && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 sm:p-10 rounded-sm text-right"
        >
          <div className="border-b border-[#E8E4DC] dark:border-[#2D2B27] pb-4">
            <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block">
              خرد‌های متقابل
            </span>
            <h2 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF] mt-1">
              دو زندگی پیرامون: {curatedData.twoLives.theme}
            </h2>
            <p className="text-xs text-[#73706B] dark:text-[#A6A29A] mt-1">
              هیچ‌کدام درست یا غلط مطلق نیستند. مسیرهای متفاوت زندگی، حقایق متفاوتی را آشکار می‌سازند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/70 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-3 flex flex-col justify-between text-right">
              <div>
                <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block mb-2">
                  {curatedData.twoLives.lessonA.authorAge} ساله · {curatedData.twoLives.lessonA.authorCountry}
                </span>
                <p className="font-serif text-xl text-[#191918] dark:text-[#EDE8DF] leading-relaxed">
                  «{curatedData.twoLives.lessonA.text}»
                </p>
              </div>
              {curatedData.twoLives.lessonA.context && (
                <p className="text-xs text-[#73706B] dark:text-[#8C8880] italic pt-3 border-t border-[#F0ECE4] dark:border-[#2D2B27]">
                  {curatedData.twoLives.lessonA.context}
                </p>
              )}
            </div>

            <div className="p-6 bg-white/70 dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm space-y-3 flex flex-col justify-between text-right">
              <div>
                <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block mb-2">
                  {curatedData.twoLives.lessonB.authorAge} ساله · {curatedData.twoLives.lessonB.authorCountry}
                </span>
                <p className="font-serif text-xl text-[#191918] dark:text-[#EDE8DF] leading-relaxed">
                  «{curatedData.twoLives.lessonB.text}»
                </p>
              </div>
              {curatedData.twoLives.lessonB.context && (
                <p className="text-xs text-[#73706B] dark:text-[#8C8880] italic pt-3 border-t border-[#F0ECE4] dark:border-[#2D2B27]">
                  {curatedData.twoLives.lessonB.context}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Filtered Archive */}
      {activeTab === 'all' && (
        <div className="space-y-8">
          {/* Controls: Search, Topic Pills, Age, Place */}
          <div className="space-y-6 bg-[#F5F2EC]/60 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 rounded-sm text-right">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="explore-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="جستجو با واژگان کلیدی (مثال: والدین، آرامش، استقلال، کار)..."
                className="w-full bg-[#FAF8F5] dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-sm text-[#191918] dark:text-[#EDE8DF] px-4 py-2.5 pr-10 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF] placeholder-[#A6A29A] text-right"
              />
              <Search className="w-4 h-4 text-[#8C8880] dark:text-[#A6A29A] absolute right-3.5 top-3.5" />
            </form>

            {/* Controlled Topics Taxonomy */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block">
                موضوعات
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopic('All')}
                  className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                    selectedTopic === 'All'
                      ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                      : 'bg-[#FAF8F5] dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] text-[#595754] dark:text-[#A6A29A] hover:border-[#191918] dark:hover:border-[#EDE8DF]'
                  }`}
                >
                  همه موضوعات
                </button>
                {ALL_TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                      selectedTopic === topic
                        ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] font-medium'
                        : 'bg-[#FAF8F5] dark:bg-[#121211] border border-[#E8E4DC] dark:border-[#2D2B27] text-[#595754] dark:text-[#A6A29A] hover:border-[#191918] dark:hover:border-[#EDE8DF]'
                    }`}
                  >
                    {TOPIC_LABELS_FA[topic] || topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Age and Country Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8E4DC] dark:border-[#2D2B27]">
              <div>
                <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1.5">
                  بازه سنی
                </label>
                <select
                  id="select-age-filter"
                  value={selectedAge}
                  onChange={e => setSelectedAge(e.target.value)}
                  className="w-full bg-[#FAF8F5] dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF]"
                >
                  {AGE_GROUPS_FA.map(ag => (
                    <option key={ag.value} value={ag.value}>
                      {ag.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#73706B] dark:text-[#A6A29A] font-medium block mb-1.5">
                  کشور
                </label>
                <select
                  id="select-country-filter"
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#FAF8F5] dark:bg-[#121211] border border-[#D5D0C5] dark:border-[#3A3834] text-xs text-[#191918] dark:text-[#EDE8DF] px-3 py-2 rounded-sm focus:outline-none focus:border-[#191918] dark:focus:border-[#EDE8DF]"
                >
                  <option value="All">همه کشورها</option>
                  {countries.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="text-center py-20 text-[#8C8880] dark:text-[#A6A29A] font-serif italic text-lg">
              در حال جستجو در میان آرشیو زنده…
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-16 text-[#73706B] dark:text-[#A6A29A] space-y-2">
              <p className="font-serif text-lg">هنوز درسی با این فیلتر دقیق ثبت نشده است.</p>
              <button
                onClick={() => {
                  setSelectedTopic('All');
                  setSelectedAge('All');
                  setSelectedCountry('All');
                  setSearchQuery('');
                }}
                className="text-xs text-[#191918] dark:text-[#EDE8DF] underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {lessons.map(item => {
                const authorLoc = [
                  item.authorAge ? `${item.authorAge} ساله` : null,
                  item.authorCity || item.authorCountry,
                ]
                  .filter(Boolean)
                  .join(' · ');

                const authorName = item.isAnonymous ? 'ناشناس' : item.authorDisplayName;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 sm:p-8 bg-[#FAF8F5] dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded-sm hover:border-[#C8C3B8] dark:hover:border-[#3E3B36] transition-colors space-y-4 text-right"
                  >
                    <blockquote className="font-serif text-xl sm:text-2xl text-[#191918] dark:text-[#EDE8DF] font-normal leading-relaxed">
                      «{item.text}»
                    </blockquote>

                    {item.context && (
                      <p className="text-xs text-[#595754] dark:text-[#A6A29A] italic bg-white/60 dark:bg-[#121211] p-3 border border-[#E8E4DC]/60 dark:border-[#2D2B27] rounded-sm text-right">
                        {item.context}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#73706B] dark:text-[#A6A29A] border-t border-[#F0ECE4] dark:border-[#2D2B27] pt-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#2E2D2A] dark:text-[#EDE8DF]">{authorName}</span>
                        <span>·</span>
                        <span>{authorLoc}</span>
                        {item.topics && (
                          <>
                            <span>·</span>
                            <span className="text-[#8C8880] dark:text-[#73706B]">
                              {item.topics.map(t => TOPIC_LABELS_FA[t as TopicType] || t).join('، ')}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleKeep(item.id)}
                          className={`p-1.5 rounded-sm border transition-colors ${
                            item.isKept
                              ? 'bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] border-[#191918] dark:border-[#EDE8DF]'
                              : 'border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]'
                          }`}
                          title="نگه‌داشتن در توشه"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${item.isKept ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => {
                            if (!user) setAuthModalOpen(true);
                            else setReflectModalLesson(item);
                          }}
                          className="p-1.5 rounded-sm border border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] hover:border-[#191918] dark:hover:border-[#EDE8DF] transition-colors"
                          title="ثبت تأمل"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setShareCardLesson(item)}
                          className="p-1.5 rounded-sm border border-[#D5D0C5] dark:border-[#3A3834] text-[#595754] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF] hover:border-[#191918] dark:hover:border-[#EDE8DF] transition-colors"
                          title="اشتراک‌گذاری"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
