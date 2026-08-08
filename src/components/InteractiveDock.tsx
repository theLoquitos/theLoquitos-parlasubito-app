import React, { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface InteractiveDockProps {
  onSendMessage: (text: string) => void;
  onRequestHint: () => void;
  isLoading: boolean;
}

export function InteractiveDock({
  onSendMessage,
  onRequestHint,
  isLoading,
}: InteractiveDockProps) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Soporte para Web Speech API en Chrome, Safari y Edge
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'it-IT'; // Reconocimiento nativo en italiano

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Error de micrófono:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta entrada por micrófono. Te recomendamos Chrome, Edge o Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error al activar micrófono:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-[#EADFCF] p-3 shadow-lg">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRequestHint}
            className="px-3 py-2 bg-[#FAF6F0] hover:bg-[#EADFCF] text-[#2C4A52] text-xs font-bold rounded-xl border border-[#EADFCF] transition-all flex items-center gap-1"
            title="Pedir pista conceptual"
          >
            💡 <span className="hidden sm:inline">Pista</span>
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Escuchando en italiano...' : 'Escribe o habla en italiano...'}
              disabled={isLoading}
              className={`w-full py-2.5 pl-4 pr-10 text-sm bg-[#FAF6F0] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4A52] text-[#2B1E1A] ${
                isListening ? 'border-red-400 ring-2 ring-red-300' : 'border-[#EADFCF]'
              }`}
            />

            {/* Botón de Micrófono (STT) */}
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-stone-400 hover:text-[#E05A47]'
              }`}
              title={isListening ? 'Detener micrófono' : 'Hablar en italiano'}
            >
              🎤
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 bg-[#E05A47] hover:bg-[#c94b3a] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}
