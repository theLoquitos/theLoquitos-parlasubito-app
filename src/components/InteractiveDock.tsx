import React, { useState } from 'react';

interface InteractiveDockProps {
  onSendMessage: (message: string) => void;
  onRequestHint: () => void;
  isLoading?: boolean;
}

export const InteractiveDock: React.FC<InteractiveDockProps> = ({
  onSendMessage,
  onRequestHint,
  isLoading = false,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="sticky bottom-0 w-full bg-[#FAF6F0]/90 backdrop-blur-md border-t border-[#EADFCF] p-3 shadow-lg">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRequestHint}
            className="text-xs font-bold text-[#E05A47] hover:text-[#C44332] bg-white border border-[#E05A47]/30 px-3 py-1 rounded-full shadow-sm flex items-center gap-1"
          >
            💡 ¿Necesitas una pista?
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Escribe tu respuesta en italiano..."
            className="flex-1 h-12 bg-white border-2 border-[#EADFCF] focus:border-[#2C4A52] rounded-2xl px-4 text-base font-medium text-[#2B1E1A] placeholder-stone-400 outline-none shadow-inner"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 px-5 bg-[#2C4A52] disabled:bg-stone-300 hover:bg-[#1F353B] text-white font-bold rounded-2xl transition-all shadow-md active:scale-95 shrink-0"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};
