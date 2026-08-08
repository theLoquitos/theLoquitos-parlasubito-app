import React from 'react';
import { Volume2, BookMarked, Home, Eye, Sparkles, SlidersHorizontal } from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  savedCount: number;
  onOpenVocabulary: () => void;
  onGoHome?: () => void;
  isChatActive: boolean;
  activeScenarioTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  savedCount,
  onOpenVocabulary,
  onGoHome,
  isChatActive,
  activeScenarioTitle,
}) => {
  const toggleSeniorMode = () => {
    onUpdateSettings({
      ...settings,
      seniorMode: !settings.seniorMode,
    });
  };

  const toggleAudioSpeed = () => {
    const nextSpeed = settings.audioSpeed === 0.75 ? 1.0 : settings.audioSpeed === 1.0 ? 0.85 : 0.75;
    onUpdateSettings({
      ...settings,
      audioSpeed: nextSpeed,
    });
  };

  const speedLabel =
    settings.audioSpeed === 0.75 ? '🐢 Lento (0.75x)' : settings.audioSpeed === 0.85 ? '🎵 Medio (0.85x)' : '⚡ Naturale (1.0x)';

  return (
    <header className="sticky top-0 z-30 bg-white border-b-4 border-black text-[#1A1A1A] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Logo & Title / Back button */}
        <div className="flex items-center gap-3">
          {isChatActive && onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-black hover:text-white active:translate-y-0.5 text-black font-extrabold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              title="Ritorna alla Home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline uppercase text-xs tracking-wider">Home</span>
            </button>
          )}

          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onGoHome}>
            <div className="w-11 h-11 rounded-full bg-[#009246] border-2 border-black flex items-center justify-center text-white font-black text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-black font-sans">
                  PARLASUBITO <span className="text-[#CE2B37]">AI</span>
                </h1>
              </div>
              <p className="text-xs font-bold text-stone-600">
                {isChatActive && activeScenarioTitle
                  ? `Scenario: ${activeScenarioTitle}`
                  : 'L’italiano facile dal primo minuto'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Accessibility & Vocabulary Controls */}
        <div className="flex items-center gap-2.5">
          {/* Active Scenario Badge in Header if Chat Active */}
          {isChatActive && activeScenarioTitle && (
            <div className="hidden lg:flex items-center px-3.5 py-1.5 border-2 border-black rounded-full font-bold text-xs uppercase tracking-wider bg-[#FFF4E5] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>📍 {activeScenarioTitle}</span>
            </div>
          )}

          {/* Senior / High Contrast Mode Toggle */}
          <button
            onClick={toggleSeniorMode}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              settings.seniorMode
                ? 'bg-[#CE2B37] text-white'
                : 'bg-white hover:bg-stone-100 text-black'
            }`}
            title="Attiva la Modalità Caratteri Grandi per facilità di lettura"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">
              {settings.seniorMode ? 'Testo Grande ON' : 'Testo Grande'}
            </span>
          </button>

          {/* Audio Speed Toggle */}
          <button
            onClick={toggleAudioSpeed}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-black rounded-xl text-xs sm:text-sm font-extrabold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            title="Cambia la velocità della voce dell'AI"
          >
            <Volume2 className="w-4 h-4 text-[#0055A4]" />
            <span className="text-xs font-black">{speedLabel}</span>
          </button>

          {/* Vocabolario Salvato */}
          <button
            onClick={onOpenVocabulary}
            className="relative flex items-center gap-1.5 px-3 py-2 bg-[#009246] hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-extrabold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            title="Apri le tue frasi salvate"
          >
            <BookMarked className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Frasi</span>
            {savedCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[11px] font-black bg-white text-black border border-black rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
