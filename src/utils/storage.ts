import { SavedPhrase, UserSettings } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'parlasubito_settings',
  VOCABULARY: 'parlasubito_vocabulary',
};

export const DEFAULT_SETTINGS: UserSettings = {
  targetLanguage: 'it-IT',
  nativeLanguage: 'es-ES',
  voiceGender: 'female',
  speechSpeed: 1.0,
  autoPlayAudio: true,
  showTranslations: true,
  difficulty: 'Principiante',
};

export const loadSettings = (): UserSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
};

export const loadSavedPhrases = (): SavedPhrase[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const savePhrase = (phrase: Omit<SavedPhrase, 'id' | 'createdAt'>): SavedPhrase[] => {
  const current = loadSavedPhrases();
  const newPhrase: SavedPhrase = {
    ...phrase,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newPhrase, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving phrase:', e);
  }
  return updated;
};

export const deleteSavedPhrase = (id: string): SavedPhrase[] => {
  const current = loadSavedPhrases();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting phrase:', e);
  }
  return updated;
};
