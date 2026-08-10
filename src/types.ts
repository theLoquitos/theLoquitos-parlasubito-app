export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: Difficulty;
  category: string;
  promptContext: string;
  goals: Goal[];
}

export interface CorrectionInfo {
  original: string;
  corrected: string;
  explanation: string;
  grammarRule?: string;
}

export interface SuggestedReply {
  italian: string;
  spanish: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  audioUrl?: string;
  timestamp: Date | string;
  correction?: CorrectionInfo;
  suggestedReplies?: SuggestedReply[];
}

export interface SavedPhrase {
  id: string;
  original: string;
  translation: string;
  context?: string;
  createdAt: string;
}
