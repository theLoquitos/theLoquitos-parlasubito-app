import React, { useState } from 'react';
import { Scenario, AvatarState, Correction, CoachingTip, Message } from './types';
import { AvatarHeader } from './components/AvatarHeader';
import { FloatingCorrectionCard } from './components/FloatingCorrectionCard';
import { CharacterBubble } from './components/CharacterBubble';
import { InteractiveDock } from './components/InteractiveDock';

const SCENARIOS: Scenario[] = [
  {
    id: 'bar',
    title: 'Al Bar',
    locationName: 'Roma',
    personaName: 'Marco',
    personaRole: 'Barista',
    description: 'Pide un café y un cornetto en el centro de Roma.',
    avatarIcon: '☕',
    goals: [
      { id: '1', label: 'Pedir café y factura', completed: false },
      { id: '2', label: 'Pagar con educación', completed: false },
    ],
  },
  {
    id: 'gelato',
    title: 'Gelateria',
    locationName: 'Florencia',
    personaName: 'Lorenzo',
    personaRole: 'Maestro Heladero',
    description: 'Pide tus sabores preferidos en cono o vaso.',
    avatarIcon: '🍦',
    goals: [
      { id: '1', label: 'Pedir recomendación', completed: false },
      { id: '2', label: 'Elegir cono o vaso', completed: false },
    ],
  },
];

export function App() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>('HAPPY');
  const [messages, setMessages] = useState<Message[]>([]);
  const [latestCorrection, setLatestCorrection] = useState<Correction | undefined>();
  const [latestCoachingTip, setLatestCoachingTip] = useState<CoachingTip | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setAvatarState('HAPPY');
    setMessages([
      {
        sender: 'ai',
        text: `Buongiorno! Benvenuto a ${scenario.locationName}. Sono ${scenario.personaName}, come posso aiutarti oggi?`,
        translation: `¡Buenos días! Bienvenido a ${scenario.locationName}. Soy ${scenario.personaName}, ¿cómo puedo ayudarte hoy?`,
      },
    ]);
    setLatestCorrection(undefined);
    setLatestCoachingTip(undefined);
  };

  const handleSendMessage = async (userText: string) => {
    if (!selectedScenario) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);
    setAvatarState('THINKING');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario,
          history: newMessages,
          userMessage: userText,
        }),
      });

      const data = await response.json();

      if (data.avatarExpression) setAvatarState(data.avatarExpression);
      if (data.correction) setLatestCorrection(data.correction);
      if (data.coachingTip) setLatestCoachingTip(data.coachingTip);

      if (data.goalUpdates && selectedScenario) {
        const updatedGoals = selectedScenario.goals.map((g) => {
          const update = data.goalUpdates.find((u: any) => u.id === g.id);
          return update ? { ...g, completed: update.completed } : g;
        });
        setSelectedScenario({ ...selectedScenario, goals: updatedGoals });
      }

      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: data.replyText,
          translation: data.translationText,
        },
      ]);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = async () => {
    if (!selectedScenario || messages.length === 0) return;
    const lastAiMsg = messages.filter((m) => m.sender === 'ai').slice(-1)[0]?.text;

    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: selectedScenario, lastAiMessage: lastAiMsg }),
      });
      const data = await res.json();
      if (data.hints && data.hints.length > 0) {
        setHintText(`Pista: ${data.hints[0].concept} (${data.hints[0].tip})`);
      }
    } catch (err) {
      setHintText('Prueba saludando o pidiendo el menú.');
    }
  };

  const handlePlayAudio = async (text: string) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.play();
      }
    } catch (err) {
      console.error('Error jugando audio:', err);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black text-[#2B1E1A] mb-2">ParlaSubito AI 2.0</h1>
        <p className="text-sm font-semibold text-[#2C4A52] mb-8 text-center max-w-sm">
          Elige una escena y empieza a hablar italiano desde el primer minuto.
        </p>

        <div className="w-full max-w-md space-y-4">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => startScenario(sc)}
              className="w-full bg-white border-2 border-[#EADFCF] hover:border-[#E05A47] p-5 rounded-2xl shadow-sm text-left flex items-center gap-4 transition-all active:scale-95"
            >
              <span className="text-4xl">{sc.avatarIcon}</span>
              <div>
                <h3 className="text-lg font-bold text-[#2B1E1A]">{sc.title}</h3>
                <p className="text-xs text-stone-500">{sc.personaName} ({sc.personaRole}) • {sc.locationName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
      <div>
        <AvatarHeader scenario={selectedScenario} avatarState={avatarState} />
        <FloatingCorrectionCard correction={latestCorrection} coachingTip={latestCoachingTip} />

        {hintText && (
          <div className="max-w-2xl mx-auto px-4 mb-2">
            <div className="bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold p-2.5 rounded-xl flex justify-between items-center">
              <span>{hintText}</span>
              <button onClick={() => setHintText(null)} className="text-amber-700 font-bold ml-2">✕</button>
            </div>
          </div>
        )}

        <main className="max-w-2xl mx-auto py-2">
          {messages.map((m, idx) =>
            m.sender === 'ai' ? (
              <CharacterBubble
                key={idx}
                personaName={selectedScenario.personaName}
                replyText={m.text}
                translationText={m.translation}
                onPlayAudio={handlePlayAudio}
              />
            ) : (
              <div key={idx} className="flex justify-end my-2 mx-4">
                <div className="bg-[#2C4A52] text-white p-3 rounded-2xl rounded-tr-none max-w-xs shadow-sm">
                  <p className="text-sm font-medium">{m.text}</p>
                </div>
              </div>
            )
          )}
        </main>
      </div>

      <InteractiveDock
        onSendMessage={handleSendMessage}
        onRequestHint={handleRequestHint}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
