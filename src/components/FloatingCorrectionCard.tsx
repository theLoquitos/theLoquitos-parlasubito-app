import React from 'react';
import { AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { CorrectionInfo } from '../types';

interface FloatingCorrectionCardProps {
  correction: CorrectionInfo;
  onClose?: () => void;
}

export const FloatingCorrectionCard: React.FC<FloatingCorrectionCardProps> = ({ correction }) => {
  return (
    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 my-2 shadow-lg backdrop-blur-sm">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="space-y-1.5 flex-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-300 uppercase tracking-wider text-[10px]">
              Retroalimentación Gramatical
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400">
              Dijiste: <span className="line-through text-red-300/80">{correction.original}</span>
            </p>
            <p className="text-emerald-300 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 inline shrink-0" />
              Sugerencia: <span className="text-emerald-200 font-bold">{correction.corrected}</span>
            </p>
          </div>

          <p className="text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded-md border border-amber-500/10">
            {correction.explanation}
          </p>

          {correction.grammarRule && (
            <p className="text-[10px] text-amber-400/90 flex items-center gap-1 pt-0.5">
              <BookOpen className="w-3 h-3" />
              Regla: {correction.grammarRule}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
