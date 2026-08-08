import React, { useState } from 'react';
import { Scenario, AvatarState, Correction, CoachingTip, Message } from './types';
import { AvatarHeader } from './components/AvatarHeader';
import { FloatingCorrectionCard } from './components/FloatingCorrectionCard';
import { CharacterBubble } from './components/CharacterBubble';
import { InteractiveDock } from './components/InteractiveDock';

const SCENARIOS: Scenario[] = [
  // --- NIVEL FÁCIL ---
  {
    id: 'bar',
    title: 'Al Bar',
    locationName: 'Roma',
    personaName: 'Marco',
    personaRole: 'Barista',
    description: 'Pide un café espresso y un croissant en el centro de Roma.',
    avatarIcon: '☕',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Pedir café y cornetto', completed: false },
      { id: '2', label: 'Pagar con educación', completed: false },
    ],
  },
  {
    id: 'gelato',
    title: 'Gelateria',
    locationName: 'Florencia',
    personaName: 'Lorenzo',
    personaRole: 'Maestro Heladero',
    description: 'Elige tus sabores favoritos y si prefieres cono o vaso.',
    avatarIcon: '🍦',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Pedir 2 sabores en cono/vaso', completed: false },
      { id: '2', label: 'Preguntar el precio y pagar', completed: false },
    ],
  },
  {
    id: 'farmacia',
    title: 'In Farmacia',
    locationName: 'Milán',
    personaName: 'Elena',
    personaRole: 'Farmacéutica',
    description: 'Explica una molestia leve y pide un medicamento básico.',
    avatarIcon: '💊',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Explicar qué te duele', completed: false },
      { id: '2', label: 'Pedir algo para el dolor', completed: false },
    ],
  },
  {
    id: 'direcciones',
    title: 'Chiedere Informazioni',
    locationName: 'Venecia',
    personaName: 'Matteo',
    personaRole: 'Transeúnte',
    description: 'Pregunta a un local cómo llegar a la plaza o estación.',
    avatarIcon: '🗺️',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Preguntar por un lugar turístico', completed: false },
      { id: '2', label: 'Agradecer y despedirse', completed: false },
    ],
  },

  // --- NIVEL MEDIO ---
  {
    id: 'ristorante',
    title: 'Al Ristorante',
    locationName: 'Nápoles',
    personaName: 'Giuseppe',
    personaRole: 'Camarero',
    description: 'Pide mesa, ordena pizza típica napolitana y la cuenta.',
    avatarIcon: '🍕',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Pedir mesa para cenar', completed: false },
      { id: '2', label: 'Ordenar la pizza y bebida', completed: false },
      { id: '3', label: 'Solicitar la cuenta', completed: false },
    ],
  },
  {
    id: 'hotel',
    title: 'In Hotel (Check-in)',
    locationName: 'Turín',
    personaName: 'Sofia',
    personaRole: 'Recepcionista',
    description: 'Realiza el registro de llegada y consulta servicios del hotel.',
    avatarIcon: '🏨',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Confirmar tu reserva', completed: false },
      { id: '2', label: 'Preguntar la clave de Wi-Fi y desayuno', completed: false },
    ],
  },
  {
    id: 'supermercato',
    title: 'Al Supermercato',
    locationName: 'Bolonia',
    personaName: 'Alessandro',
    personaRole: 'Dependiente',
    description: 'Pregunta por pasillos y pide embutido fresco en el mostrador.',
    avatarIcon: '🛒',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Preguntar dónde está un producto', completed: false },
      { id: '2', label: 'Pedir 100g de prosciutto', completed: false },
    ],
  },
  {
    id: 'stazione',
    title: 'In Stazione Treni',
    locationName: 'Verona',
    personaName: 'Chiara',
    personaRole: 'Taquillera',
    description: 'Compra un billete de tren de ida y vuelta a otra ciudad.',
    avatarIcon: '🚆',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Pedir billete de ida y vuelta', completed: false },
      { id: '2', label: 'Consultar el andén (binario) de salida', completed: false },
    ],
  },

  // --- NIVEL EXPERTO ---
  {
    id: 'noleggio',
    title: 'Noleggio Auto',
    locationName: 'Palermo',
    personaName: 'Roberto',
    personaRole: 'Agente de Alquiler',
    description: 'Resuelve un problema con el seguro o estado del vehículo.',
    avatarIcon: '🚗',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Reclamar un desperfecto previo', completed: false },
      { id: '2', label: 'Negociar cobertura de seguro completo', completed: false },
    ],
  },
  {
    id: 'medico',
    title: 'Dal Medico',
    locationName: 'Génova',
    personaName: 'Dottoressa Bianchi',
    personaRole: 'Médico de Cabecera',
    description: 'Describe un historial de síntomas detallado en consulta.',
    avatarIcon: '🩺',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Describir síntomas de varios días', completed: false },
      { id: '2', label: 'Entender las instrucciones del tratamiento', completed: false },
    ],
  },
  {
    id: 'affitto',
    title: 'Cercare Casa',
    locationName: 'Siena',
    personaName: 'Giulia',
    personaRole: 'Agente Inmobiliaria',
    description: 'Consulta condiciones de un contrato de alquiler de apartamento.',
    avatarIcon: '🔑',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Preguntar por gastos incluidos y fianza', completed: false },
      { id: '2', label: 'Negociar la fecha de entrada', completed: false },
    ],
  },
  {
    id: 'lavoro',
    title: 'Colloquio di Lavoro',
    locationName: 'Milán',
    personaName: 'Andrea',
    personaRole: 'Reclutador HR',
    description: 'Realiza una entrevista de trabajo para un puesto profesional.',
    avatarIcon: '💼',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Presentar tu experiencia profesional', completed: false },
      { id: '2', label: 'Explicar por qué quieres trabajar en la empresa', completed: false },
    ],
  },
];

export function App() {
  const [selectedLevel, setSelectedLevel] = useState<'Fácil' | 'Medio' | 'Experto'>('Fácil');
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
        text: `Buongiorno! Benvenuto a ${scenario.locationName}. Sono ${scenario.personaName}, il tuo ${scenario.personaRole.toLowerCase()}. Come posso aiutarti oggi?`,
        translation: `¡Buenos días! Bienvenido a ${scenario.locationName}. Soy ${scenario.personaName}, tu ${scenario.personaRole.toLowerCase()}. ¿Cómo puedo ayudarte hoy?`,
      },
    ]);
    setLatestCorrection(undefined);
    setLatestCoachingTip(undefined);
  };

  const filteredScenarios = SCENARIOS.filter((s) => s.level === selectedLevel);

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
      setHintText('Prueba respondiendo de forma clara en italiano.');
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
      console.error('Error al reproducir audio:', err);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] p-6 flex flex-col items-center">
        <header className="text-center my-6">
          <h1 className="text-3xl font-black text-[#2B1E1A]">ParlaSubito AI 2.0</h1>
          <p className="text-sm font-semibold text-[#2C4A52] mt-1">
            Selecciona nivel e interactúa con un personaje nativo en tiempo real.
          </p>
        </header>

        {/* Pestañas de Nivel */}
        <div className="flex bg-[#EADFCF]/60 p-1 rounded-2xl mb-8 w-full max-w-md">
          {(['Fácil', 'Medio', 'Experto'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedLevel === lvl
                  ? 'bg-[#2C4A52] text-white shadow-md'
                  : 'text-[#2B1E1A] hover:bg-white/40'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Grilla de Escenarios */}
        <div className="w-full max-w-md space-y-4">
          {filteredScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => startScenario(sc)}
              className="w-full bg-white border-2 border-[#EADFCF] hover:border-[#E05A47] p-5 rounded-2xl shadow-sm text-left flex items-center gap-4 transition-all active:scale-95"
            >
              <span className="text-4xl">{sc.avatarIcon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-base font-bold text-[#2B1E1A]">{sc.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#2C4A52] border border-[#EADFCF]">
                    {sc.locationName}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#E05A47] mb-1">
                  {sc.personaName} ({sc.personaRole})
                </p>
                <p className="text-xs text-stone-500 leading-snug">{sc.description}</p>
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
        <div className="p-2 bg-[#FAF6F0] flex justify-between items-center max-w-2xl mx-auto px-4">
          <button
            onClick={() => setSelectedScenario(null)}
            className="text-xs font-bold text-[#2C4A52] bg-white border border-[#EADFCF] px-3 py-1 rounded-full shadow-sm"
          >
            ← Cambiar Escena
          </button>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#E05A47]">
            Nivel: {selectedScenario.level}
          </span>
        </div>

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
