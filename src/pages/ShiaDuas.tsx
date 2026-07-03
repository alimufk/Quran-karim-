import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const duasList = [
  { id: 'kumail', name: 'دعاء كميل', file: 'Dua_e_Kumail.mp3' },
  { id: 'nudba', name: 'دعاء الندبة', file: 'Dua_e_Nudbah.mp3' },
  { id: 'tawassul', name: 'دعاء التوسل', file: 'Dua_e_Tawassul.mp3' },
  { id: 'ahad', name: 'دعاء العهد', file: 'Dua_e_Ahad.mp3' },
  { id: 'sabah', name: 'دعاء الصباح', file: 'Dua_e_Sabah.mp3' },
  { id: 'faraj', name: 'دعاء الفرج', file: 'Dua_e_Faraj.mp3' },
  { id: 'iftitah', name: 'دعاء الافتتاح', file: 'Dua_e_Iftitah.mp3' },
  { id: 'jawshan', name: 'دعاء الجوشن الكبير', file: 'Dua_e_Jawshan Kabeer.mp3' },
  { id: 'mashlool', name: 'دعاء المشلول', file: 'Dua_e_Mashlool.mp3' },
  { id: 'mujeer', name: 'دعاء المجير', file: 'Dua_e_Mujeer.mp3' },
];

export function ShiaDuas() {
  const navigate = useNavigate();
  const [currentDuaId, setCurrentDuaId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayToggle = (duaId: string) => {
    if (currentDuaId === duaId) {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else { audioRef.current?.play().catch(console.error); setIsPlaying(true); }
    } else {
      setCurrentDuaId(duaId);
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play().catch(console.error), 500);
    }
  };

  const currentDua = duasList.find(d => d.id === currentDuaId);

  return (
    <div className="flex flex-col h-full bg-[#022c22] text-white">
      <header className="p-4 bg-[#064e3b] font-bold">أدعية بصوت حقيقي</header>
      <div className="flex-1 overflow-y-auto pb-24">
        {duasList.map((dua) => (
          <div key={dua.id} onClick={() => handlePlayToggle(dua.id)} className="p-4 border-b border-[#059669]/20 cursor-pointer flex justify-between">
            {dua.name}
            {currentDuaId === dua.id && isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </div>
        ))}
      </div>
      {currentDua && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#064e3b] p-4 flex justify-between items-center border-t border-[#059669]">
          <span>{currentDua.name}</span>
          <button onClick={() => handlePlayToggle(currentDua.id)} className="p-3 bg-[#fbbf24] rounded-full text-black">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <audio ref={audioRef} src={`https://archive.org/download/duas_arabic_audio_mp3/${encodeURIComponent(currentDua.file)}`} onEnded={() => setIsPlaying(false)} />
        </div>
      )}
    </div>
  );
}
