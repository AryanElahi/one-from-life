import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { X, Copy, Check, Share2, Sparkles } from 'lucide-react';

export const ShareCardModal: React.FC = () => {
  const { shareCardLesson, setShareCardLesson, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!shareCardLesson) return null;

  const authorLoc = [
    shareCardLesson.authorAge ? `${shareCardLesson.authorAge} ساله` : null,
    shareCardLesson.authorCity || shareCardLesson.authorCountry,
  ]
    .filter(Boolean)
    .join(' · ');

  const authorName = shareCardLesson.isAnonymous
    ? 'ناشناس'
    : shareCardLesson.authorDisplayName;

  const formattedQuote = `«${shareCardLesson.text}»\n\n— ${authorName} · ${authorLoc}\n\nیک درس از یک زندگی · onefromalife.com`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedQuote);
      setCopied(true);
      showToast('متن درس در حافظه کپی شد.');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/#lesson-${shareCardLesson.id}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('پیوند کارت در حافظه کپی شد.');
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#FAF8F5] dark:bg-[#1C1B19] border border-[#E8E4DC] dark:border-[#2D2B27] p-6 sm:p-8 max-w-lg w-full rounded-sm shadow-2xl relative space-y-6 text-right"
      >
        <button
          onClick={() => setShareCardLesson(null)}
          className="absolute top-5 left-5 text-[#8C8880] dark:text-[#A6A29A] hover:text-[#191918] dark:hover:text-[#EDE8DF]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs text-[#8C8880] dark:text-[#A6A29A] block">
            کارت یادبود و اشتراک
          </span>
          <h3 className="font-serif text-2xl text-[#191918] dark:text-[#EDE8DF]">
            کلامی درخور همرسانی
          </h3>
        </div>

        {/* The Card Preview */}
        <div
          id="social-share-card"
          className="bg-[#FAF8F5] dark:bg-[#121211] border-2 border-[#191918] dark:border-[#EDE8DF] p-8 sm:p-10 rounded-sm space-y-8 text-right relative overflow-hidden shadow-xs"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full border border-[#191918] dark:border-[#EDE8DF] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#191918] dark:bg-[#EDE8DF]"></div>
            </div>
            <span className="font-serif text-xs font-semibold text-[#191918] dark:text-[#EDE8DF]">
              یک درس از یک زندگی
            </span>
          </div>

          {/* Body */}
          <blockquote className="font-serif text-2xl sm:text-3xl text-[#191918] dark:text-[#EDE8DF] font-normal leading-relaxed">
            «{shareCardLesson.text}»
          </blockquote>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-xs text-[#73706B] dark:text-[#A6A29A] border-t border-[#E8E4DC] dark:border-[#2D2B27] pt-4">
            <span className="font-medium text-[#2E2D2A] dark:text-[#EDE8DF]">
              — {authorName} · {authorLoc}
            </span>
            <span className="text-[11px] text-[#8C8880] dark:text-[#73706B] dir-ltr">
              onefromalife.com
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="share-card-copy-text"
            onClick={handleCopyText}
            className="w-full sm:w-1/2 py-3 bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] hover:bg-[#333230] dark:hover:bg-[#D5D0C5] transition-colors rounded-sm text-xs font-medium flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'کپی شد' : 'کپی متن درس'}</span>
          </button>

          <button
            id="share-card-copy-link"
            onClick={handleCopyLink}
            className="w-full sm:w-1/2 py-3 border border-[#191918] dark:border-[#EDE8DF] text-[#191918] dark:text-[#EDE8DF] hover:bg-[#191918]/5 dark:hover:bg-[#EDE8DF]/10 transition-colors rounded-sm text-xs font-medium flex items-center justify-center gap-2"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'پیوند کپی شد' : 'کپی پیوند'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
