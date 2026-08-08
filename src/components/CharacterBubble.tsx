import React from 'react';

interface CharacterBubbleProps {
  personaName: string;
  replyText: string;
  translationText?: string;
  onPlayAudio?: (text: string) => void;
}

export function CharacterBubble({
  personaName,
  replyText,
  translationText,
  onPlayAudio,
}: CharacterBubbleProps) {
  return (
    <div className="flex items-start gap-3 my-3 px-2 max-w-2xl mx-auto">
      {/* Contenedor principal de la respuesta (Estilo Mondly) */}
      <div className="flex-1 bg-[#122B48]/90 border border-blue-400/20 rounded-2xl p-4 shadow-xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex-1">
          {/* Nombre del personaje */}
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block mb-1">
            {personaName}
          </span>

          {/* Texto principal en Italiano */}
          <p className="text-white font-extrabold text-base sm:text-lg leading-snug tracking-wide">
            {replyText}
          </p>

          {/* Traducción al Español directo en la tarjeta */}
          {translationText && (
            <p className="text-[#8ECAE6] text-xs font-semibold mt-1.5 leading-snug">
              {translationText}
            </p>
          )}
        </div>

        {/* Botón de reproducción de audio (Círculo Cian Mondly) */}
        {onPlayAudio && (
          <button
            onClick={() => onPlayAudio(replyText)}
            className="w-10 h-10 rounded-full bg-[#00D2FF] hover:bg-[#00B4D8] text-[#0A192F] flex items-center justify-center text-sm shadow-lg shadow-cyan-500/30 transition-all active:scale-90 shrink-0 font-bold"
            title="Escuchar audio"
          >
            🔊
          </button>
        )}
      </div>
    </div>
  );
}
