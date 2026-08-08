export interface ScenarioGoal {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  locationName: string;
  personaName: string;
  personaRole: string;
  description: string;
  initialMessage: string;
  initialTranslation: string;
  goals: ScenarioGoal[];
  level: 'Principiante' | 'Intermedio' | 'Avanzato';
  badgeColor: string;
}

export interface CorrectionInfo {
  hasError: boolean;
  originalText: string;
  correctedText: string;
  explanation: string;
  keyConcept?: string;
  coachingTip?: string;
}

export interface SuggestedReply {
  text: string;
  translation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  translation?: string;
  correction?: CorrectionInfo;
  timestamp: number;
  suggestedReplies?: SuggestedReply[];
  audioUrl?: string;
}

export interface SavedPhrase {
  id: string;
  italian: string;
  english: string;
  context?: string;
  savedAt: number;
}

export interface UserSettings {
  audioSpeed: number; // 0.75, 0.85, 1.0
  autoPlayAudio: boolean;
  showTranslations: boolean;
  seniorMode: boolean; // Ultra legibility font & high contrast
  voiceGender: 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr';
}

export interface ChatSessionState {
  scenario: Scenario;
  messages: ChatMessage[];
  goals: ScenarioGoal[];
  isCompleted: boolean;
  score?: number;
}
