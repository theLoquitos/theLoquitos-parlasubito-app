import { useState, useEffect, useRef } from 'react';
import { SCENARIOS } from './data/scenarios';
import { ChatMessage, Scenario, SavedPhrase } from './types';
import { AvatarHeader } from './components/AvatarHeader';
import { CharacterBubble } from './components/CharacterBubble';
import { InteractiveDock } from './components/InteractiveDock';
import { loadSavedPhrases, savePhrase, deleteSavedPhrase } from './utils/storage';
import { BookOpen, X, Trash2 } from 'lucide-react';

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [showVocabModal, setShowVocabModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedPhrases(loadSavedPhrases());
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: `Ciao! Benvenuto al modulo "${selectedScenario.title}". Io sono il tuo tutor di italiano. Come posso aiutarti oggi?`,
        timestamp: new Date().toISOString(),
        suggestedReplies: [
          { italian: 'Buongiorno! Vorrei fare una prova.', spanish: '¡Buenos días! Quisiera hacer una prueba.' },
          { italian: 'Ciao, possiamo iniziare?', spanish: 'Hola, ¿podemos empezar?' }
        ]
      }
    ]);
  }, [selectedScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          scenarioContext: selectedScenario.promptContext,
          history: messages
        })
      });

      if (!response.ok) {
        throw new Error('Error al conectar con la API.');
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'Ho capito. Continuiamo!',
        timestamp: new Date().toISOString(),
        correction: data.correction || undefined,
        suggestedReplies: data.suggestedReplies || []
      };

      setMessages((prev) => {
        if (data.correction) {
          const updated = [...prev];
          const lastUserIdx = updated.findLastIndex((m) => m.sender === 'user');
          if (lastUserIdx !== -1) {
            updated[lastUserIdx] = { ...updated[lastUserIdx], correction: data.correction };
          }
          return [...updated, aiMsg];
        }
        return [...prev, aiMsg];
      });

      playSpeech(data.text);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Scusa, si è verificato un errore di connessione. Riprova tra poco.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const playSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSavePhrase = (original: string, translation: string) => {
    const updated = savePhrase({ original, translation, context: selectedScenario.title });
    setSavedPhrases(updated);
  };

  const handleDeletePhrase = (id: string) => {
    const updated = deleteSavedPhrase(id);
    setSavedPhrases(updated);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      <AvatarHeader
        scenarioTitle={selectedScenario.title}
        difficulty={selectedScenario.difficulty}
        isSpeaking={isSpeaking}
      />

      <div className="bg-slate-900/60 border-b border-slate-800 p-2 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {SCENARIOS.map((scen) => (
          <button
            key={scen.id}
            onClick={() => setSelectedScenario(scen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
              selectedScenario.id === scen.id
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800/40 text-slate-400 border-slate-700/30 hover:text-slate-200'
            }`}
          >
            {scen.title}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-4xl w-full mx-auto space-y-2">
        {messages.map((msg) => (
          <CharacterBubble
            key={msg.id}
            message={msg}
            onPlayAudio={playSpeech}
            onSelectSuggestion={handleSendMessage}
            onSavePhrase={handleSavePhrase}
          />
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-3 bg-slate-900/50 rounded-xl max-w-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span>ParlaSubito AI sta elaborando la risposta...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <InteractiveDock
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onResetChat={() => {
          setMessages([
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: `Chat reiniciada. Ciao! Come posso aiutarti in "${selectedScenario.title}"?`,
              timestamp: new Date().toISOString()
            }
          ]);
        }}
        savedCount={savedPhrases.length}
        onOpenVocabulary={() => setShowVocabModal(true)}
      />

      {showVocabModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <BookOpen className="w-5 h-5" />
                <span>Mis Frases Guardadas ({savedPhrases.length})</span>
              </div>
              <button
                onClick={() => setShowVocabModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {savedPhrases.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  Aún no has guardado ninguna frase. Presiona "Guardar frase" durante tus conversaciones.
                </p>
              ) : (
                savedPhrases.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-emerald-300">{item.original}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.translation}</p>
                      {item.context && (
                        <span className="inline-block mt-1 text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                          {item.context}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePhrase(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
