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
    description: 'Elige tus sabores favoritos en cono o vaso.',
    avatarIcon: '🍦',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Pedir 2 sabores', completed: false },
      { id: '2', label: 'Preguntar precio y pagar', completed: false },
    ],
  },
  {
    id: 'farmacia',
    title: 'In Farmacia',
    locationName: 'Milán',
    personaName: 'Elena',
    personaRole: 'Farmacéutica',
    description: 'Explica una molestia leve y pide un remedio.',
    avatarIcon: '💊',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    level: 'Fácil',
    goals: [
      { id: '1', label: 'Explicar tu dolor', completed: false },
      { id: '2', label: 'Pedir medicamento', completed: false },
    ],
  },

  // --- NIVEL MEDIO ---
  {
    id: 'ristorante',
    title: 'Al Ristorante',
    locationName: 'Nápoles',
    personaName: 'Giuseppe',
    personaRole: 'Camarero',
    description: 'Pide mesa, ordena pizza napolitana y la cuenta.',
    avatarIcon: '🍕',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Pedir mesa', completed: false },
      { id: '2', label: 'Ordenar la pizza', completed: false },
      { id: '3', label: 'Pedir la cuenta', completed: false },
    ],
  },
  {
    id: 'hotel',
    title: 'In Hotel (Check-in)',
    locationName: 'Turín',
    personaName: 'Sofia',
    personaRole: 'Recepcionista',
    description: 'Realiza el registro y consulta servicios.',
    avatarIcon: '🏨',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Confirmar reserva', completed: false },
      { id: '2', label: 'Preguntar Wi-Fi y desayuno', completed: false },
    ],
  },
  {
    id: 'supermercato',
    title: 'Al Supermercato',
    locationName: 'Bolonia',
    personaName: 'Alessandro',
    personaRole: 'Atención al Cliente',
    description: 'Busca productos y pide embutido fresco.',
    avatarIcon: '🛒',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    level: 'Medio',
    goals: [
      { id: '1', label: 'Preguntar ubicación de productos', completed: false },
      { id: '2', label: 'Pedir 100g de prosciutto', completed: false },
    ],
  },

  // --- NIVEL EXPERTO ---
  {
    id: 'noleggio',
    title: 'Noleggio Auto',
    locationName: 'Palermo',
    personaName: 'Roberto',
    personaRole: 'Agente de Alquiler',
    description: 'Gestiona un vehículo y resuelve dudas del seguro.',
    avatarIcon: '🚗',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Aclarar daño previo', completed: false },
      { id: '2', label: 'Consultar seguro completo', completed: false },
    ],
  },
  {
    id: 'medico',
    title: 'Dal Medico',
    locationName: 'Génova',
    personaName: 'Dottoressa Bianchi',
    personaRole: 'Médico',
    description: 'Describe síntomas detallados y comprende el tratamiento.',
    avatarIcon: '🩺',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Explicar síntomas', completed: false },
      { id: '2', label: 'Entender indicación médica', completed: false },
    ],
  },
  {
    id: 'lavoro',
    title: 'Colloquio di Lavoro',
    locationName: 'Milán',
    personaName: 'Andrea',
    personaRole: 'Reclutador HR',
    description: 'Entrevista formal de trabajo usando el registro "Lei".',
    avatarIcon: '💼',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    level: 'Experto',
    goals: [
      { id: '1', label: 'Presentar experiencia laboral', completed: false },
      { id: '2', label: 'Explicar motivación para el puesto', completed: false },
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
      setHintText('Responde con educación en italiano.');
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
      <div className="min-h-screen bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364] p-4 sm:p-6 flex flex-col items-center">
        {/* Banner Superior Estilo Mondly */}
        <header className="w-full max-w-md bg-[#FF5A20] rounded-3xl p-6 text-center text-white shadow-2xl orange-glow mb-6">
          <span className="text-xs font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full">
            ParlaSubito AI 2.0
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Practicar Conversaciones</h1>
          <p className="text-xs font-semibold text-orange-100 mt-1">
            Habla con personajes nativos y mejora tu fluidez
          </p>
        </header>

        {/* Pestañas de Nivel */}
        <div className="flex bg-[#122B48] p-1.5 rounded-2xl mb-6 w-full max-w-md border border-blue-500/30">
          {(['Fácil', 'Medio', 'Experto'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedLevel === lvl
                  ? 'bg-[#FF5A20] text-white shadow-lg orange-glow'
                  : 'text-blue-200 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Tarjetas de Escenarios */}
        <div className="w-full max-w-md space-y-3.5">
          {filteredScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => startScenario(sc)}
              className="w-full blue-glass hover:border-[#FF5A20] p-4 rounded-2xl shadow-xl text-left flex items-center gap-4 transition-all active:scale-98 group"
            >
              <div className="relative">
                <img
                  src={sc.avatarUrl}
                  alt={sc.personaName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400/80 shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 text-base">{sc.avatarIcon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                    {sc.title}
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {sc.locationName}
                  </span>
                </div>
                <p className="text-xs font-bold text-orange-400 mb-1">
                  {sc.personaName} • <span className="text-blue-200 font-normal">{sc.personaRole}</span>
                </p>
                <p className="text-xs text-blue-100/70 leading-snug">{sc.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-between">
      <div>
        {/* Barra superior de navegación */}
        <div className="p-3 bg-[#0F2027] border-b border-blue-900/40 flex justify-between items-center max-w-2xl mx-auto px-4">
          <button
            onClick={() => setSelectedScenario(null)}
            className="text-xs font-black text-white bg-[#FF5A20] hover:bg-orange-600 px-3.5 py-1.5 rounded-full shadow-md orange-glow transition-all"
          >
            ← Menú
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Nivel {selectedScenario.level}
          </span>
        </div>

        <AvatarHeader scenario={selectedScenario} avatarState={avatarState} />
        <FloatingCorrectionCard correction={latestCorrection} coachingTip={latestCoachingTip} />

        {hintText && (
          <div className="max-w-2xl mx-auto px-4 mb-2">
            <div className="bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-bold p-3 rounded-2xl flex justify-between items-center shadow-lg">
              <span>{hintText}</span>
              <button onClick={() => setHintText(null)} className="text-amber-400 font-bold ml-2">✕</button>
            </div>
          </div>
        )}

     <main className="max-w-2xl mx-auto py-3 px-2">
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
      /* Burbuja de respuesta del estudiante (Estilo Mondly) */
      <div key={idx} className="flex justify-end my-3 px-2">
        <div className="bg-[#1A3A60] border border-blue-400/30 text-white p-4 rounded-2xl rounded-tr-none max-w-md shadow-xl flex items-center gap-3">
          <div className="flex-1">
            <p className="text-white font-extrabold text-base sm:text-lg leading-snug">{m.text}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FF5A20]/20 border border-[#FF5A20]/60 flex items-center justify-center text-[10px] font-black text-orange-400 shrink-0">
            TÚ
          </div>
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
