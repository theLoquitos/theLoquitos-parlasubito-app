export interface NPC {
  name: string;
  role: string;
  avatar?: string;
  personality?: string;
}

export interface VocabularyItem {
  word: string;
  translation: string;
}

export interface Goal {
  id: string;
  description: string;
  completed: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  level: string;
  context: string;
  objective: string;
  npc: NPC;
  vocabulary: VocabularyItem[];
  systemPrompt: string;
  initialMessage: string;
  goals?: Goal[];
  xpReward?: number;
  starsReward?: number;
}

export interface Message {
  id: string;
  sender: 'npc' | 'player' | 'companion';
  text: string;
  timestamp: string;
}
