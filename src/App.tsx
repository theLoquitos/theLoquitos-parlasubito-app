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
    description: 'Pide un café espresso y un croissant en una cafetería clásica.',
    avatarIcon: '☕',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
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
    description: 'Elige tus sabores favoritos y pide en cono o vaso.',
    avatarIcon: '🍦',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Pedir 2 sabores en cono o vaso', completed: false },
      { id: '2', label: 'Preguntar el precio y pagar', completed: false },
    ],
  },
  {
    id: 'farmacia',
    title: 'In Farmacia',
    locationName: 'Milán',
    personaName: 'Elena',
    personaRole: 'Farmacéutica',
    description: 'Explica una molestia leve y solicita un analgésico básico.',
    avatarIcon: '💊',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Explicar qué síntoma tienes', completed: false },
      { id: '2', label: 'Pedir algo para el dolor', completed: false },
    ],
  },

  // --- NIVEL MEDIO ---
  {
    id: 'ristorante',
    title: 'Al Ristorante',
    locationName: 'Nápoles',
    personaName: 'Giuseppe',
    personaRole: 'Camarero',
    description: 'Reserva mesa, pide la auténtica pizza napolitana y solicita la cuenta.',
    avatarIcon: '🍕',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
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
    description: 'Realiza el registro de llegada y consulta los servicios del hotel.',
    avatarIcon: '🏨',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Confirmar tu reserva', completed: false },
      { id: '2', label: 'Preguntar la clave de Wi-Fi y horario de desayuno', completed: false },
    ],
  },
  {
    id: 'supermercato',
    title: 'Al Supermercato',
    locationName: 'Bolonia',
    personaName: 'Alessandro',
    personaRole: 'Atención al Cliente',
    description: 'Encuentra ingredientes típicos y pide embutido fresco al corte.',
    avatarIcon: '🛒',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Preguntar dónde está un producto', completed: false },
      { id: '2', label: 'Pedir 100g de prosciutto al corte', completed: false },
    ],
  },

  // --- NIVEL EXPERTO ---
  {
    id: 'noleggio',
    title: 'Noleggio Auto',
    locationName: 'Palermo',
    personaName: 'Roberto',
    personaRole: 'Agente de Alquiler',
    description: 'Gestiona el alquiler de un coche y aclara coberturas de seguro.',
    avatarIcon: '🚗',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Reportar o aclarar un daño previo del vehículo', completed: false },
      { id: '2', label: 'Consultar cobertura de seguro completo', completed: false },
    ],
  },
  {
    id: 'medico',
    title: 'Dal Medico',
    locationName: 'Génova',
    personaName: 'Dottoressa Bianchi',
    personaRole: 'Médico de Cabecera',
    description: 'Describe tu historial de síntomas y comprende la receta médica.',
    avatarIcon: '🩺',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Explicar síntomas detallados de varios días', completed: false },
      { id: '2', label: 'Entender las indicaciones del tratamiento', completed: false },
    ],
  },
  {
    id: 'lavoro',
    title: 'Colloquio di Lavoro',
    locationName: 'Milán',
    personaName: 'Andrea',
    personaRole: 'Reclutador HR',
    description: 'Realiza una entrevista formal de trabajo utilizando el tratamiento de cortesía (Lei).',
    avatarIcon: '💼',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Presentar tu trayectoria laboral', completed: false },
      { id: '2', label: 'Explicar tu motivación para el puesto', completed: false },
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
      setHintText('Prueba respondiendo con educación en italiano.');
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
            Aprende italiano interactuando con personajes en escenarios reales.
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

        {/* Grilla de Escenarios con foto de personaje */}
        <div className="w-full max-w-md space-y-4">
          {filteredScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => startScenario(sc)}
              className="w-full bg-white border-2 border-[#EADFCF] hover:border-[#E05A47] p-4 rounded-2xl shadow-sm text-left flex items-center gap-4 transition-all active:scale-98"
            >
              <img
                src={sc.avatarUrl}
                alt={sc.personaName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#EADFCF] flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-base font-extrabold text-[#2B1E1A]">{sc.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#2C4A52] border border-[#EADFCF]">
                    {sc.locationName}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#E05A47] mb-1">
                  {sc.personaName} • {sc.personaRole}
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
