import React from 'react';
import { ChatMessage, Scenario } from '../types';
import { CorrectionBanner } from './CorrectionBanner';
import { Volume2, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  scenario: Scenario;
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectSuggestedReply: (reply: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  scenario,
  messages,
  isLoading,
  onSelectSuggestedReply,
}) => {
  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <span>{scenario.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
            {scenario.difficulty}
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">{scenario.subtitle}</p>

        {scenario.goals && scenario.goals.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 mb-2">Objetivos de la lección:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {scenario.goals.map((goal) => (
                <div key={goal.id} className="p-2 bg-slate-800/40 rounded-lg text-xs text-slate-300">
                  <p className="font-medium text-emerald-300">{goal.title}</p>
                  {goal.description && <p className="text-[10px] text-slate-400 mt-0.5">{goal.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
          {msg.correction && <CorrectionBanner correction={msg.correction} />}

          <div
            className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white rounded-br-none'
                : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none'
            }`}
          >
            <p>{msg.text}</p>

            {msg.sender === 'ai' && (
              <button
                onClick={() => playAudio(msg.text)}
                className="mt-2 text-slate-400 hover:text-emerald-400 flex items-center space-x-1 text-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Escuchar</span>
              </button>
            )}
          </div>

          {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
            <div className="mt-2 space-y-1.5 pl-2">
              <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Sugerencias para responder:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {msg.suggestedReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectSuggestedReply(reply.italian)}
                    className="text-left text-xs bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 text-emerald-300 p-2 rounded-xl transition"
                  >
                    <p className="font-medium">{reply.italian}</p>
                    <p className="text-[10px] text-slate-400">{reply.spanish}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
          <span>ParlaSubito AI está pensando...</span>
        </div>
      )}
    </div>
  );
};
