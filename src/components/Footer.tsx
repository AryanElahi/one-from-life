import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();
  const [philosophyOpen, setPhilosophyOpen] = useState(false);

  return (
    <footer id="app-footer" className="mt-auto border-t border-[#E8E4DC] dark:border-[#2D2B27] py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] dark:bg-[#121211] text-[#73706B] dark:text-[#A6A29A] text-xs">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Central Brand Distillation */}
        <div className="w-4 h-4 rounded-full border border-[#99948B] dark:border-[#635F57] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#99948B] dark:bg-[#635F57]"></div>
        </div>

        <p className="font-serif italic text-base text-[#403E3B] dark:text-[#EDE8DF] max-w-lg leading-relaxed">
          «ما گفته‌ها و ادعاهای افراد را جمع‌آوری نمی‌کنیم؛ ما آنچه را که زندگی به آن‌ها آموخته گرد هم می‌آوریم.»
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6 text-[12px] text-[#8C8880] dark:text-[#A6A29A]">
          <button
            id="footer-btn-philosophy"
            onClick={() => setPhilosophyOpen(!philosophyOpen)}
            className="hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors underline-offset-4 hover:underline"
          >
            منشور و فلسفه آرشیو
          </button>
          <span>·</span>
          <button
            id="footer-btn-one"
            onClick={() => setActiveView('one')}
            className="hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors"
          >
            یکی
          </button>
          <span>·</span>
          <button
            id="footer-btn-wander"
            onClick={() => setActiveView('wander')}
            className="hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors"
          >
            پرسه
          </button>
          <span>·</span>
          <button
            id="footer-btn-explore"
            onClick={() => setActiveView('explore')}
            className="hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors"
          >
            کاوش
          </button>
          <span>·</span>
          <button
            id="footer-btn-previous"
            onClick={() => setActiveView('previous')}
            className="hover:text-[#191918] dark:hover:text-[#EDE8DF] transition-colors"
          >
            درس‌های پیشین
          </button>
        </div>

        {philosophyOpen && (
          <div className="mt-4 p-6 bg-white/70 dark:bg-[#181716] border border-[#E8E4DC] dark:border-[#2D2B27] rounded text-right max-w-xl text-xs leading-relaxed text-[#595754] dark:text-[#A6A29A] space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#191918] dark:text-[#EDE8DF]">اصول بنیادین «یکی از یک زندگی»</h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>کمتر بگو، عمیق‌تر معنا ببخش.</li>
              <li>یک انسان. یک زندگی زیسته. یک درس چکیده شده.</li>
              <li>گذشته را نمی‌توان بازنویسی کرد؛ تنها می‌توان به پیش رفت.</li>
              <li>یک درس منتشر شده قابل ویرایش یا حذف نیست؛ در صورت ثبت درس جدید، درس پیشین به خلوت سفر شما منتقل می‌شود.</li>
              <li>بدون لایک، بدون فالوور، بدون الگوریتم‌های اعتیادآور.</li>
              <li>کمیابی، توجه و تفکر می‌آفریند، نه اضطراب.</li>
            </ul>
          </div>
        )}

        <div className="text-[11px] text-[#A6A29A] dark:text-[#73706B]">
          یکی از یک زندگی &copy; {new Date().getFullYear()} — آرشیو زنده تجربیات زیسته انسان‌ها.
        </div>
      </div>
    </footer>
  );
};
