import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Tv, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function HolyShrinesLive() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // قائمة العتبات المقدسة مع روابط بث تقريبية (يمكنك استبدال الروابط بروابط اليوتيوب الرسمية لاحقاً)
  const shrines = [
    { name: 'العتبة الحسينية المقدسة (كربلاء)', url: 'https://www.youtube.com/c/ImamHussainOrg/live' },
    { name: 'العتبة العباسية المقدسة (كربلاء)', url: 'https://www.youtube.com/user/AlkafeelNet/live' },
    { name: 'العتبة العلوية المقدسة (النجف الأشرف)', url: 'https://www.youtube.com/user/ImamAliNet/live' },
    { name: 'العتبة الكاظمية المقدسة (بغداد)', url: 'https://www.youtube.com/user/AlKadhimiya/live' },
    { name: 'العتبة العسكرية المقدسة (سامراء)', url: 'https://www.youtube.com/c/AskarianNet/live' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#022c22] text-[#f0f9ff]' : 'bg-[#f0fdf4] text-[#0f172a]'} pb-12 font-['Cairo'] transition-colors duration-300`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md ${theme === 'dark' ? 'bg-[#022c22]/80 border-[#059669]/20' : 'bg-[#f0fdf4]/80 border-[#bbf7d0]'} border-b px-4 py-4 flex items-center gap-3`}>
        <button onClick={() => navigate(-1)} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-[#064e3b] hover:bg-[#059669]/30 text-[#fbbf24]' : 'bg-[#bbf7d0] hover:bg-[#86efac] text-[#15803d]'} transition-all duration-200`}>
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">البث المباشر للعتبات</h1>
          <p className={`text-xs ${theme === 'dark' ? 'text-[#059669]' : 'text-[#16a34a]'}`}>مشاهدة البث المباشر للمراقد المقدسة</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-4">
        {shrines.map((shrine, index) => (
          <a
            key={index}
            href={shrine.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-[#064e3b]/40 to-[#022c22]/60 border border-[#059669]/30 hover:border-[#fbbf24]/50 transition-all duration-300 shadow-md group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#059669]/20 text-[#fbbf24]">
                <Tv size={20} />
              </div>
              <span className="font-bold text-sm text-[#f0f9ff] group-hover:text-[#fbbf24] transition-colors">{shrine.name}</span>
            </div>
            <div className="text-[#fbbf24] opacity-70">
              <ExternalLink size={18} />
            </div>
          </a>
        ))}
      </main>
    </div>
  );
}
