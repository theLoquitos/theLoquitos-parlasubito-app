import React, { useState } from 'react';
import { Play, CheckCircle2, Sparkles, MessageCircle, MapPin, UserCheck, Coffee, Navigation, Users, PlusCircle, Compass } from 'lucide-react';
import { Scenario } from '../types';

interface HomeScreenProps {
  scenarios: Scenario[];
  completedScenarioIds: string[];
  onSelectScenario: (scenario: Scenario) => void;
  onCreateCustomScenario: (customTitle: string, customPersona: string, customGoal: string) => void;
  seniorMode: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  scenarios,
  completedScenarioIds,
  onSelectScenario,
  onCreateCustomScenario,
  seniorMode,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPersona, setCustomPersona] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onCreateCustomScenario(
      customTitle.trim(),
      customPersona.trim() || 'Persona locale',
      customGoal.trim() || 'Praticare la conversazione in italiano'
    );
    setShowCustomModal(false);
    setCustomTitle('');
    setCustomPersona('');
    setCustomGoal('');
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 sm:py-12 transition-all ${seniorMode ? 'text-lg' : ''}`}>
      {/* Hero Greeting Section */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-2 border-black text-black font-extrabold text-xs sm:text-sm mb-4 uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-4 h-4 text-[#CE2B37]" />
          <span>Conversazione reale senza grammatica a memoria</span>
        </div>

        <h2
          className={`font-black tracking-tighter text-black uppercase ${
            seniorMode ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl'
          }`}
        >
          Pronto per <span className="text-[#009246]">parlare</span>?
        </h2>
        <p
          className={`mt-3 text-stone-800 leading-relaxed font-medium ${
            seniorMode ? 'text-xl' : 'text-base sm:text-lg'
          }`}
        >
          Scegli un luogo reale e inizia a ordinare al bar, chiedere informazioni o chiacchierare.
          L’AI ti guida passo passo con correzioni amichevoli in tempo reale.
        </p>
      </div>

      {/* Predefined Scenarios Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-black uppercase tracking-tight text-black ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
            Situazioni di Tutti i Giorni
          </h3>
          <span className="text-xs sm:text-sm font-extrabold px-3 py-1 bg-white border-2 border-black rounded-full uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {completedScenarioIds.length} / {scenarios.length} completati
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => {
            const isCompleted = completedScenarioIds.includes(scenario.id);

            return (
              <div
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                className={`group relative bg-white border-4 border-black rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${
                  isCompleted ? 'bg-[#F0FDF4]' : 'bg-white'
                }`}
              >
                {/* Header Badge */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF4E5] border-3 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
                      {scenario.icon}
                    </div>

                    {isCompleted ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-[#009246] text-white border-2 border-black text-xs font-black uppercase tracking-wider rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        Completato
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {scenario.level}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h4
                    className={`font-black text-black uppercase tracking-tight group-hover:text-[#0055A4] transition-colors ${
                      seniorMode ? 'text-2xl' : 'text-xl'
                    }`}
                  >
                    {scenario.title}
                  </h4>
                  <p className="text-sm font-bold text-[#CE2B37] mb-2">{scenario.subtitle}</p>

                  <p className="text-stone-700 text-sm line-clamp-2 leading-relaxed mb-4 font-medium">
                    {scenario.description}
                  </p>

                  {/* Persona Info */}
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900 bg-[#F4F1EA] p-3 rounded-2xl border-2 border-black mb-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <MapPin className="w-4 h-4 text-[#CE2B37] shrink-0" />
                    <span className="truncate">
                      {scenario.locationName} • <strong className="text-black font-black">{scenario.personaName}</strong> ({scenario.personaRole})
                    </span>
                  </div>
                </div>

                {/* Big Button */}
                <button
                  className={`w-full py-3.5 px-4 rounded-2xl font-black uppercase tracking-wider border-3 border-black flex items-center justify-center gap-2 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                    seniorMode ? 'text-lg py-4' : 'text-base'
                  } ${
                    isCompleted
                      ? 'bg-[#009246] hover:bg-emerald-600 text-white'
                      : 'bg-[#CE2B37] hover:bg-red-700 text-white'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{isCompleted ? 'Rigioca Scenario' : 'Inizia Conversazione'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scenario Builder Button */}
      <div className="bg-[#FFF4E5] border-4 border-black rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border-3 border-black flex items-center justify-center text-black shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Compass className="w-7 h-7 text-[#0055A4]" />
          </div>
          <div>
            <h4 className={`font-black uppercase tracking-tight text-black ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              Vuoi creare una situazione personalizzata?
            </h4>
            <p className="text-stone-700 text-sm mt-1 font-medium">
              Es. "Dal Medico", "In Aeroporto", "Chiedere un taxi" o qualsiasi altro luogo desideri.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className={`px-6 py-3.5 bg-black hover:bg-stone-800 text-white font-black uppercase tracking-wider border-3 border-black rounded-2xl transition flex items-center gap-2 shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${
            seniorMode ? 'text-lg' : 'text-base'
          }`}
        >
          <PlusCircle className="w-5 h-5 text-[#009246]" />
          <span>Crea Scenario Custom</span>
        </button>
      </div>

      {/* Custom Scenario Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 max-w-lg w-full text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black mb-2">
              Crea Nuova Situazione
            </h3>
            <p className="text-stone-700 text-sm mb-6 font-medium">
              Descrivi con chi vuoi parlare e dove ti trovi. L'AI creerà un gioco di ruolo su misura per te!
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Dove ti trovi? (Titolo scenario)
                </label>
                <input
                  type="text"
                  placeholder="Es. In Farmacia, Dal Dentista, In Libreria"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F1EA] border-3 border-black rounded-2xl text-black font-bold placeholder-stone-400 focus:outline-none focus:bg-white text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Con chi stai parlando? (Ruolo AI)
                </label>
                <input
                  type="text"
                  placeholder="Es. Il farmacista, L'agente di viaggio"
                  value={customPersona}
                  onChange={(e) => setCustomPersona(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F1EA] border-3 border-black rounded-2xl text-black font-bold placeholder-stone-400 focus:outline-none focus:bg-white text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Qual è il tuo obiettivo principale?
                </label>
                <input
                  type="text"
                  placeholder="Es. Chiedere un rimedio per il mal di testa"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F1EA] border-3 border-black rounded-2xl text-black font-bold placeholder-stone-400 focus:outline-none focus:bg-white text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-5 py-2.5 rounded-xl text-black font-bold hover:bg-stone-100 transition text-base"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#009246] hover:bg-emerald-600 text-white font-black uppercase tracking-wider border-3 border-black rounded-2xl transition text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                >
                  Inizia Subito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
