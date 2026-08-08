import React from 'react';
import { Scenario, AvatarState } from '../types';

interface AvatarHeaderProps {
  scenario: Scenario;
  avatarState: AvatarState;
}

export function AvatarHeader({ scenario, avatarState }: AvatarHeaderProps) {
  const getBadge = () => {
    switch (avatarState) {
      case 'HAPPY':
        return { emoji: '😊', label: 'Excelente', color: 'bg-emerald-500' };
      case 'TEACHING':
        return { emoji: '🧐', label: 'Tip Gramatical', color: 'bg-amber-500' };
      case 'THINKING':
        return { emoji: '🤔', label: 'Pensando...', color: 'bg-blue-500' };
      case 'CELEBRATING':
        return { emoji: '🎉', label: '¡Objetivo Logrado!', color: 'bg-purple-500' };
      default:
        return { emoji: '🙂', label: 'Atento', color: 'bg-stone-500' };
    }
  };

  const badge = getBadge();

  return (
    <div className="bg-white border-b border-[#EADFCF] p-4 shadow-sm">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={scenario.avatarUrl}
              alt={scenario.personaName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#E05A47] shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 text-xs p-1 rounded-full text-white shadow-sm ${badge.color}`}
              title={badge.label}
            >
              {badge.emoji}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#2B1E1A]">{scenario.personaName}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#2C4A52] border border-[#EADFCF]">
                {scenario.personaRole}
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-500">
              {scenario.title} • {scenario.locationName}
            </p>
          </div>
        </div>

        {/* Indicador de metas */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Progreso</span>
          <span className="text-xs font-extrabold text-[#E05A47]">
            {scenario.goals.filter((g) => g.completed).length} / {scenario.goals.length} Metas
          </span>
        </div>
      </div>
    </div>
  );
}
