import { useState } from 'react';
import HomeScreen from './HomeScreen';
import ChatWindow from './ChatWindow';
import ScenarioCompletionModal from './ScenarioCompletionModal';
import { Scenario } from '../types';

export default function GameContainer() {
  const [gameState, setGameState] = useState<'MAP' | 'ARENA' | 'DEBRIEFING'>('MAP');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

  if (gameState === 'MAP') {
    return (
      <HomeScreen
        onSelectScenario={(scenario: Scenario) => {
          setCurrentScenario(scenario);
          setGameState('ARENA');
        }}
      />
    );
  }

  if (gameState === 'ARENA' && currentScenario) {
    return (
      <ChatWindow
        scenario={currentScenario}
        onComplete={() => setGameState('DEBRIEFING')}
        onBack={() => setGameState('MAP')}
      />
    );
  }

  if (gameState === 'DEBRIEFING' && currentScenario) {
    return (
      <ScenarioCompletionModal
        scenario={currentScenario}
        onClose={() => setGameState('MAP')}
      />
    );
  }

  return null;
}
