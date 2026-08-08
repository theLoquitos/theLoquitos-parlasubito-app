import React from 'react';
import { Correction, CoachingTip } from '../types';

interface FloatingCorrectionCardProps {
  correction?: Correction;
  coachingTip?: CoachingTip;
}

export const FloatingCorrectionCard: React.FC<FloatingCorrectionCardProps> = ({ correction, coachingTip }) => {
  if (!correction && !coachingTip) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-3 px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-md border border-[#EADFCF] space-y-3">
        {correction && (
          <div className={`p-3 rounded-xl border ${correction.hasError ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-start gap-2">
              <span className="text-lg">{correction.hasError ? '✏️' : '✨'}</span>
              <div className="text-sm">
                {correction.hasError ? (
                  <>
                    <p className="text-stone-500 line-through text-xs">{correction.originalText}</p>
                    <p className="text-emerald-800 font-bold text-base">{correction.correctedText}</p>
                    <p className="text-stone-700 text-xs mt-1 font-medium">{correction.explanation}</p>
                  </>
                ) : (
                  <p className="text-emerald-800 font-bold">{correction.explanation}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {coachingTip && (
          <div className="p-3 rounded-xl bg-[#2C4A52]/5 border border-[#2C4A52]/20 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E05A47] block mb-0.5">
                Tip del Nativo ("Come si dice davvero")
              </span>
              <p className="text-[#2B1E1A] font-medium text-xs leading-relaxed">{coachingTip.advice}</p>
              <p className="text-[#2C4A52] font-bold text-xs mt-1 italic">
                Ejemplo: "{coachingTip.naturalAlternative}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
