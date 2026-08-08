import React from 'react';
import { Award, CheckCircle2, RotateCcw, ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { Scenario } from '../types';
import { speakItalian } from '../utils/speech';

interface ScenarioCompletionModalProps {
  scenario: Scenario;
  onRestart: () => void;
  onChooseNewScenario: () => void;
  audioSpeed: number;
}

export const ScenarioCompletionModal: React.FC<ScenarioCompletionModalProps> = ({
  scenario,
  onRestart,
  onChooseNewScenario,
  audioSpeed,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 max-w-lg w-full text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-[#009246] text-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
          <Award className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FFF4E5] text-black border-2 border-black text-xs font-black rounded-full mb-3 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-3.5 h-3.5 text-[#CE2B37]" /> Scenario Completato!
        </span>

        <h3 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-2">
          Complimenti!
        </h3>
        <p className="text-stone-700 text-base leading-relaxed mb-6 font-medium">
          Hai completato tutti gli obiettivi di <strong className="text-black font-black">{scenario.title}</strong>! Ora riesci a parlare italiano in questa situazione reale.
        </p>

        {/* Objectives Accomplished Summary */}
        <div className="bg-[#F4F1EA] border-3 border-black rounded-2xl p-4 text-left mb-6 space-y-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black text-black uppercase tracking-wider mb-2">
            Traguardi Raggiunti:
          </p>
          {scenario.goals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-2.5 text-black text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#009246] shrink-0" />
              <span>{goal.label}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onRestart}
            className="py-3.5 px-4 bg-white hover:bg-stone-100 text-black font-black uppercase tracking-wider rounded-2xl border-3 border-black transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Ripeti Scenario</span>
          </button>

          <button
            onClick={onChooseNewScenario}
            className="py-3.5 px-4 bg-[#009246] hover:bg-emerald-600 text-white font-black uppercase tracking-wider rounded-2xl border-3 border-black transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Nuovo Scenario</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
