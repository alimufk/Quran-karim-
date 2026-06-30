import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Clock, HeartPulse, Compass, Headphones, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'القراءة', path: '/quran', icon: BookOpen },
    { name: 'الاستماع', path: '/reciters', icon: Headphones },
    { name: 'أوقات الصلاة', path: '/prayer', icon: Clock },
    { name: 'الأذكار', path: '/azkar', icon: HeartPulse },
    { name: 'حول', path: '/about', icon: Info },
  ];

  // Hide nav on deeper screens like Surah reading or Audio Player
  if (path.match(/^\/quran\/\d+$/) || path.match(/^\/listen\/.+$/) || path === '/shia-duas') {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] border-t border-[#059669] px-4 py-2 pb-safe z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const isActive = path === tab.path || (tab.path !== '/' && path.startsWith(tab.path));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center justify-center w-14 h-14"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-[#059669]/20 rounded-2xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={clsx(
                  'w-5 h-5 z-10 transition-colors duration-200',
                  isActive ? 'text-[#fbbf24]' : 'text-[#059669]'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={clsx(
                  'text-[9px] mt-1 z-10 font-bold transition-colors duration-200 whitespace-nowrap',
                  isActive ? 'text-[#fbbf24]' : 'text-[#059669]'
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
