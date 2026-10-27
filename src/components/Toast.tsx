import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none max-w-sm">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto bg-[#191918] dark:bg-[#EDE8DF] text-[#FAF8F5] dark:text-[#121211] px-4 py-3 rounded-sm shadow-xl text-xs font-medium leading-relaxed border border-[#333230] dark:border-[#D5D0C5] flex items-center space-x-2.5 rtl:space-x-reverse"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5] dark:bg-[#121211]"></div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
