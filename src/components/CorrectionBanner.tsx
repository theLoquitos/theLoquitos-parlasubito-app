import React from 'react';
import { AlertCircle, CheckCircle2, Volume2, Sparkles, Lightbulb } from 'lucide-react';
import { CorrectionInfo } from '../types';
import { speakItalian } from '../utils/speech';

interface CorrectionBannerProps {
  correction: CorrectionInfo;
  audioSpeed: number;
  seniorMode: boolean;
}

export const CorrectionBanner: React.FC<CorrectionBannerProps> = ({
  correction,
  audioSpeed,
  seniorMode,
}) => {
  if (!correction) return null;

  const handlePlayCorrection = () => {
    speakItalian(correction.correctedText || correction.originalText, audioSpeed);
  };

  // If sentence was 100% correct, render Positive Praise Badge + Coaching Tip if present
  if (!correction.hasError) {
    return (
      <div
        className={`my-3 p-4 sm:p-5 bg-[#F0FDF4] border-4 border-black rounded-3xl text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
          seniorMode ? 'text-lg' : 'text-sm sm:text-base'
        }`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#009246] text-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#009246] text-sm sm:text-base uppercase tracking-tight">
                  Perfetto! 👏
                </span>
                <span className="px-2.5 py-0.5 bg-white text-black border border-black text-xs font-black uppercase rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  100% Corretto
                </span>
              </div>
              <p className="text-stone-800 font-bold text-xs sm:text-sm mt-0.5">
                {correction.explanation || 'Ottimo italiano! Nessun errore nella tua frase.'}
              </p>
            </div>
          </div>

          <button
            onClick={handlePlayCorrection}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0055A4] hover:bg-blue-700 text-white rounded-2xl border-2 border-black transition shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-extrabold text-xs uppercase active:translate-y-0.5"
            title="Ascolta la pronuncia della frase"
          >
            <Volume2 className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Ascolta Correzione</span>
          </button>
        </div>

        {/* Dedicated Coaching Tip Box */}
        {correction.coachingTip && (
          <div className="mt-3 p-3.5 bg-white rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-black text-black uppercase tracking-wider mb-1">
              <Lightbulb className="w-4 h-4 text-[#D97706]" />
              <span>💡 Consiglio del Coach (Modo Naturale):</span>
            </div>
            <p className="text-stone-900 font-bold leading-relaxed">
              {correction.coachingTip}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Error Correction Card
  return (
    <div
      className={`my-3 p-5 sm:p-6 bg-[#FFF4E5] border-4 border-black rounded-3xl text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
        seniorMode ? 'text-lg' : 'text-sm sm:text-base'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="font-black text-[#CE2B37] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              💡 Suggerimento Utile / Instant Correction
            </span>
            {correction.keyConcept && (
              <span className="px-3 py-1 bg-white text-black border-2 border-black text-xs font-black uppercase tracking-wider rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {correction.keyConcept}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
            {/* Original with mistake */}
            <div className="p-3.5 bg-white rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-black text-[#CE2B37] uppercase tracking-wider block mb-0.5">Prima (Inesatto):</span>
              <p className="line-through text-stone-600 font-mono text-sm sm:text-base font-bold">
                "{correction.originalText}"
              </p>
            </div>

            {/* Corrected form */}
            <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black text-[#009246] uppercase tracking-wider block mb-0.5">Forma Corretta:</span>
                <p className="font-black text-[#009246] underline text-base sm:text-lg">
                  "{correction.correctedText}"
                </p>
              </div>

              <button
                onClick={handlePlayCorrection}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#0055A4] hover:bg-blue-700 text-white rounded-xl border-2 border-black transition shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 font-bold text-xs uppercase"
                title="Ascolta la pronuncia della frase corretta"
              >
                <Volume2 className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Ascolta Correzione</span>
              </button>
            </div>
          </div>

          {/* Explanation */}
          <div className="text-stone-900 text-xs sm:text-sm font-medium bg-white p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
            <span className="font-black text-black uppercase tracking-wider">Spiegazione: </span>
            {correction.explanation}
          </div>

          {/* Dedicated Coaching Tip / Asesoría Box */}
          {correction.coachingTip && (
            <div className="p-3.5 bg-[#FFFBEB] rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-black text-black uppercase tracking-wider mb-1">
                <Lightbulb className="w-4 h-4 text-[#D97706]" />
                <span>💡 Consiglio del Coach (Espressione Naturale):</span>
              </div>
              <p className="text-stone-900 font-bold leading-relaxed">
                {correction.coachingTip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
