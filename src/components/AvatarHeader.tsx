import React from 'react';
import { AvatarState, Scenario } from '../types';

interface AvatarHeaderProps {
  scenario: Scenario;
  avatarState: AvatarState;
}

const stateBadgeConfig: Record<AvatarState, { label: string; bg: string; text: string; border: string }> = {
  HAPPY: { label: '¡Excelente! 👏', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
  TEACHING: { label: 'Un ajuste 💡', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  THINKING: { label: 'Pensando... 💭', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-300' },
  CELEBRATING: { label: '¡Completado! 🎉', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
};

export const AvatarHeader: React.FC<AvatarHeaderProps> = ({ scenario, avatarState }) => {
  const completedGoals = scenario.goals.filter((g) => g.completed).length;
  const progressPercent = Math.round((completedGoals / scenario.goals.length) * 100);
  const currentBadge = stateBadgeConfig[avatarState] || stateBadgeConfig.HAPPY;

  return (
    <header className="w-full bg-[#FAF6F0] border-b-2 border-[#EADFCF] p-4 rounded-b-3xl shadow-sm">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-3xl bg-[#2C4A52] shadow-inner ${currentBadge.border}`}>
              <span>{scenario.avatarIcon}</span>
            </div>
            <span className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentBadge.bg} ${currentBadge.text} ${currentBadge.border} shadow-sm`}>
              {currentBadge.label}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#2B1E1A] leading-tight">{scenario.personaName}</h2>
            <p className="text-xs font-semibold text-[#2C4A52]">{scenario.personaRole} • {scenario.locationName}</p>
          </div>
        </div>

        <div className="w-32 flex flex-col items-end">
          <span className="text-xs font-bold text-[#2B1E1A] mb-1">
            {completedGoals}/{scenario.goals.length} Objetivos
          </span>
          <div className="w-full h-2.5 bg-[#EADFCF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E05A47] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
