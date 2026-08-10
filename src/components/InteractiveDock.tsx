import React, { useState } from 'react';
import { Send, Mic, RefreshCw, BookOpen } from 'lucide-react';

interface InteractiveDockProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onResetChat?: () => void;
  savedCount?: number;
  onOpenVocabulary?: () => void;
}

export const InteractiveDock: React.FC<InteractiveDockProps> = ({
  onSendMessage,
  isLoading,
  onResetChat,
  savedCount = 0,
  onOpenVocabulary,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'it-IT';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-slate-900/95 border-t border-slate-800 p-3 sm:p-4 backdrop-blur-md">
      <div className="max-w-4xl mx-auto space-y-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {onResetChat && (
            <button
              type="button"
              onClick={onResetChat}
              title="Reiniciar chat"
              className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {onOpenVocabulary && (
            <button
              type="button"
              onClick={onOpenVocabulary}
              title="Vocabulario guardado"
              className="relative p-2.5 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje en italiano..."
              disabled={isLoading}
              className="w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-2.5 text-sm outline-none transition disabled:opacity-50"
            />
          </div>

          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border transition shrink-0 ${
              isRecording
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 hover:text-emerald-400 border-slate-700/60'
            }`}
            title="Hablar en italiano"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition disabled:opacity-40 disabled:hover:bg-emerald-600 shrink-0 shadow-md shadow-emerald-900/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
