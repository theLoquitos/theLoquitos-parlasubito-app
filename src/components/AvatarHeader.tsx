import React from 'react';
import { Bot, Sparkles, Volume2 } from 'lucide-react';

interface AvatarHeaderProps {
  scenarioTitle: string;
  difficulty: string;
  isSpeaking?: boolean;
}

export const AvatarHeader: React.FC<AvatarHeaderProps> = ({
  scenarioTitle,
  difficulty,
  isSpeaking = false,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/20 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-0.5 shadow-md shadow-emerald-500/20 ${isSpeaking ? 'animate-pulse' : ''}`}>
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-wide">ParlaSubito AI</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                Tutor Activo
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Escenario: <span className="text-slate-200">{scenarioTitle}</span> · <span className="text-emerald-400">{difficulty}</span>
            </p>
          </div>
        </div>

        {isSpeaking && (
          <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs text-emerald-300">
            <Volume2 className="w-4 h-4 animate-bounce text-emerald-400" />
            <span>Hablando italiano...</span>
          </div>
        )}
      </div>
    </div>
  );
};
