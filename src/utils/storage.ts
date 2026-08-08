import { SavedPhrase, UserSettings } from '../types';

const SAVED_PHRASES_KEY = 'parlasubito_saved_phrases';
const USER_SETTINGS_KEY = 'parlasubito_user_settings';
const COMPLETED_SCENARIOS_KEY = 'parlasubito_completed_scenarios';

export const DEFAULT_SETTINGS: UserSettings = {
  audioSpeed: 0.85, // 0.75 Lento, 0.85 Medio, 1.0 Naturale
  autoPlayAudio: true,
  showTranslations: true,
  seniorMode: false, // Large text & high contrast mode
  voiceGender: 'Kore',
};

export function getSavedPhrases(): SavedPhrase[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_PHRASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load saved phrases:', e);
    return [];
  }
}

export function savePhrase(italian: string, english: string, context?: string): SavedPhrase[] {
  const current = getSavedPhrases();
  // Avoid duplicates
  if (current.some((p) => p.italian.toLowerCase() === italian.toLowerCase())) {
    return current;
  }
  const newPhrase: SavedPhrase = {
    id: 'phrase_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    italian,
    english,
    context,
    savedAt: Date.now(),
  };
  const updated = [newPhrase, ...current];
  try {
    localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save phrase:', e);
  }
  return updated;
}

export function deletePhrase(id: string): SavedPhrase[] {
  const current = getSavedPhrases();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete phrase:', e);
  }
  return updated;
}

export function getUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(USER_SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getCompletedScenarioIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPLETED_SCENARIOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function markScenarioCompleted(scenarioId: string): string[] {
  const current = getCompletedScenarioIds();
  if (current.includes(scenarioId)) return current;
  const updated = [...current, scenarioId];
  try {
    localStorage.setItem(COMPLETED_SCENARIOS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to mark scenario completed:', e);
  }
  return updated;
}
