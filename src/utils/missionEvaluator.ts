import { Scenario, Message, Goal } from '../types';

export interface EvaluationResult {
  completed: boolean;
  completedGoals: Goal[];
  xpEarned: number;
  starsEarned: number;
  feedback: string;
}

/**
 * Evalúa el progreso de la misión basándose exclusivamente en datos estructurados y el historial.
 */
export function evaluateMissionCompletion(
  scenario: Scenario,
  messages: Message[]
): EvaluationResult {
  const playerMessages = messages.filter((m) => m.sender === 'player');
  const fullText = playerMessages.map((m) => m.text.toLowerCase()).join(' ');

  // 1. Evaluar objetivos estructurados basándose en palabras clave del vocabulario y turnos
  const baseGoals: Goal[] = scenario.goals || [
    { id: '1', description: `Interactuar en italiano en el escenario ${scenario.title}`, completed: false },
    { id: '2', description: `Usar vocabulario clave del nivel ${scenario.level}`, completed: false }
  ];

  const updatedGoals = baseGoals.map((goal, index) => {
    // Criterio 1: Mínimo de interacción conversacional (al menos 2 intercambios)
    if (index === 0 && playerMessages.length >= 2) {
      return { ...goal, completed: true };
    }
    // Criterio 2: Uso de al menos una palabra del vocabulario de la misión
    if (index === 1) {
      const usedVocab = scenario.vocabulary.some((v) =>
        fullText.includes(v.word.toLowerCase())
      );
      if (usedVocab || playerMessages.length >= 3) {
        return { ...goal, completed: true };
      }
    }
    return goal;
  });

  const completedCount = updatedGoals.filter((g) => g.completed).length;
  const isCompleted = completedCount >= Math.ceil(updatedGoals.length / 2) && playerMessages.length >= 2;

  // 2. Cálculo de recompensas
  const xpEarned = isCompleted ? (scenario.xpReward || 100) : 0;
  const starsEarned = isCompleted 
    ? (completedCount === updatedGoals.length ? (scenario.starsReward || 3) : 2)
    : 0;

  // 3. Feedback cuantitativo/pedagógico
  const feedback = isCompleted
    ? `¡Excelente trabajo! Completaste la misión interactuando ${playerMessages.length} veces y cumpliendo los objetivos clave.`
    : 'Seguí practicando para completar todos los objetivos de la escena.';

  return {
    completed: isCompleted,
    completedGoals: updatedGoals,
    xpEarned,
    starsEarned,
    feedback
  };
}
