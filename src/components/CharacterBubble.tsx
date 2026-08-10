import React from 'react';
import { Bot, User, Volume2, Sparkles, Plus } from 'lucide-react';
import { ChatMessage } from '../types';
import { FloatingCorrectionCard } from './FloatingCorrectionCard';

interface CharacterBubbleProps {
  message: ChatMessage;
  onPlayAudio?: (text: string) => void;
  onSelectSuggestion?: (text: string) => void;
  onSavePhrase?: (italian: string, spanish: string) => void;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  message,
  onPlayAudio,
  onSelectSuggestion,
  onSavePhrase,
}) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1.5 my-3`}>
      <div className={`flex items-center space-x-2 ${isAI ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
          isAI ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
        }`}>
          {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {isAI ? 'Tutor ParlaSubito' : 'Tú'}
        </span>
      </div>

      {message.correction && <FloatingCorrectionCard correction={message.correction} />}

      <div className={`max-w-[88%] sm:max-w-[78%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
        isAI
          ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-sm'
          : 'bg-emerald-600 text-white rounded-tr-sm'
      }`}>
        <p className="whitespace-pre-wrap">{message.text}</p>

        {isAI && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            {onPlayAudio && (
              <button
                onClick={() => onPlayAudio(message.text)}
                className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Escuchar pronunciación</span>
              </button>
            )}

            {onSavePhrase && (
              <button
                onClick={() => onSavePhrase(message.text, 'Frase de tutoría')}
                className="inline-flex items-center space-x-1 text-slate-400 hover:text-amber-400 transition text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>Guardar frase</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isAI && message.suggestedReplies && message.suggestedReplies.length > 0 && (
        <div className="mt-2 pl-2 space-y-1.5 max-w-[88%]">
          <p className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Sugerencias para responder:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {message.suggestedReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion && onSelectSuggestion(reply.italian)}
                className="text-left bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800/90 p-2.5 rounded-xl transition text-xs group"
              >
                <p className="font-semibold text-emerald-300 group-hover:text-emerald-200">{reply.italian}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{reply.spanish}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
