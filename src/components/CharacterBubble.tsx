import React, { useState } from 'react';

interface CharacterBubbleProps {
  personaName: string;
  replyText: string;
  translationText?: string;
  onPlayAudio: (text: string) => void;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  personaName,
  replyText,
  translationText,
  onPlayAudio,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = () => {
    setIsPlaying(true);
    onPlayAudio(replyText);
    setTimeout(() => setIsPlaying(false), 4000);
  };

  return (
    <div className="flex flex-col items-start max-w-lg my-2 mx-4">
      <span className="text-xs font-bold text-[#2C4A52] mb-1 ml-2">{personaName}</span>
      <div className="bg-[#FAF6F0] border border-[#EADFCF] text-[#2B1E1A] p-4 rounded-2xl rounded-tl-none shadow-sm">
        <p className="text-base font-semibold text-[#2B1E1A] leading-relaxed mb-1">{replyText}</p>
        {translationText && (
          <p className="text-xs text-stone-500 font-normal italic mb-3">{translationText}</p>
        )}

        <button
          onClick={handleAudio}
          className="flex items-center gap-2 bg-[#2C4A52] hover:bg-[#1F353B] text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <span>🔊</span>
          {isPlaying ? 'Reproduciendo...' : 'Escuchar italiano'}
        </button>
      </div>
    </div>
  );
};
