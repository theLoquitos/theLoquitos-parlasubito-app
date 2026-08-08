export type AvatarState = 'HAPPY' | 'TEACHING' | 'THINKING' | 'CELEBRATING';

export interface Correction {
  hasError: boolean;
  originalText: string;
  correctedText: string;
  explanation: string;
}

export interface CoachingTip {
  advice: string;
  naturalAlternative: string;
}

export interface Goal {
  id: string;
  label: string;
  completed: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  locationName: string;
  personaName: string;
  personaRole: string;
  description: string;
  avatarIcon: string;
  goals: Goal[];
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  translation?: string;
}
