import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ChatWindow } from './components/ChatWindow';
import { VocabularyDrawer } from './components/VocabularyDrawer';
import { ScenarioCompletionModal } from './components/ScenarioCompletionModal';
import { PREDEFINED_SCENARIOS } from './data/scenarios';
import {
  Scenario,
  ChatMessage,
  UserSettings,
  SavedPhrase,
  CorrectionInfo,
  SuggestedReply,
} from './types';
import {
  getSavedPhrases,
  savePhrase,
  deletePhrase,
  getUserSettings,
  saveUserSettings,
  getCompletedScenarioIds,
  markScenarioCompleted,
} from './utils/storage';
import { speakItalian } from './utils/speech';

export default function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>(PREDEFINED_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [goals, setGoals] = useState<Scenario['goals']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const [activeCorrection, setActiveCorrection] = useState<CorrectionInfo | undefined>(undefined);
  const [hintSuggestions, setHintSuggestions] = useState<SuggestedReply[]>([]);

  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>([]);

  const [isVocabularyOpen, setIsVocabularyOpen] = useState(false);
  const [isScenarioCompleted, setIsScenarioCompleted] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    setSavedPhrases(getSavedPhrases());
    setCompletedScenarioIds(getCompletedScenarioIds());
  }, []);

  // Save settings when updated
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  // Start or change scenario
  const handleSelectScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setGoals(scenario.goals.map((g) => ({ ...g, completed: false })));
    setIsScenarioCompleted(false);
    setActiveCorrection(undefined);
    setHintSuggestions([]);

    const initialMsg: ChatMessage = {
      id: 'msg_init_' + Date.now(),
      sender: 'ai',
      text: scenario.initialMessage,
      translation: scenario.initialTranslation,
      timestamp: Date.now(),
      suggestedReplies: [
        { text: 'Buongiorno!', translation: 'Good morning!' },
        { text: 'Vorrei ordinare...', translation: 'I would like to order...' },
      ],
    };

    setMessages([initialMsg]);

    // Auto-play initial message if setting enabled
    if (settings.autoPlayAudio) {
      setTimeout(() => {
        speakItalian(scenario.initialMessage, settings.audioSpeed);
      }, 300);
    }
  };

  // Create custom scenario
  const handleCreateCustomScenario = (title: string, personaRole: string, mainGoalText: string) => {
    const customScenario: Scenario = {
      id: 'custom_' + Date.now(),
      title,
      subtitle: 'Situazione Personalizzata',
      icon: '🎭',
      locationName: 'Italia',
      personaName: 'Persona locale',
      personaRole,
      description: `Conversazione personalizzata: ${mainGoalText}`,
      initialMessage: `Buongiorno! Benvenuto. Come posso aiutarti oggi per ${title}?`,
      initialTranslation: `Good morning! Welcome. How can I help you today for ${title}?`,
      level: 'Principiante',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      goals: [
        {
          id: 'custom_goal_1',
          label: mainGoalText,
          description: mainGoalText,
          completed: false,
        },
        {
          id: 'custom_goal_2',
          label: 'Salutare e ringraziare',
          description: 'Concludi la conversazione in modo cordiale',
          completed: false,
        },
      ],
    };

    setScenarios((prev) => [customScenario, ...prev]);
    handleSelectScenario(customScenario);
  };

  // Send message to AI backend
  const handleSendMessage = async (text: string) => {
    if (!activeScenario) return;

    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: {
            ...activeScenario,
            goals,
          },
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          userMessage: text,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      // Update goal completion statuses
      if (data.goalUpdates && Array.isArray(data.goalUpdates)) {
        setGoals((currentGoals) =>
          currentGoals.map((g) => {
            const update = data.goalUpdates.find((u: any) => u.id === g.id);
            return update ? { ...g, completed: update.completed } : g;
          })
        );
      }

      // Check if all goals are complete
      const allComplete =
        data.scenarioCompleted ||
        (data.goalUpdates &&
          data.goalUpdates.length > 0 &&
          goals.every((g) => {
            const match = data.goalUpdates.find((u: any) => u.id === g.id);
            return match ? match.completed : g.completed;
          }));

      if (allComplete) {
        setIsScenarioCompleted(true);
        const updatedCompleted = markScenarioCompleted(activeScenario.id);
        setCompletedScenarioIds(updatedCompleted);
      }

      // Format AI message
      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: data.replyText,
        translation: data.translationText,
        correction: data.correction,
        suggestedReplies: data.suggestedReplies,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setActiveCorrection(data.correction);

      if (data.suggestedReplies) {
        setHintSuggestions(data.suggestedReplies);
      }

      // Auto play audio if enabled
      if (settings.autoPlayAudio) {
        speakItalian(data.replyText, settings.audioSpeed);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback message if network/server issue
      const fallbackAiMsg: ChatMessage = {
        id: 'msg_ai_err_' + Date.now(),
        sender: 'ai',
        text: 'Scusa, si è verificato un errore di connessione. Puoi riprovare a inviare il tuo messaggio!',
        translation: 'Sorry, a connection error occurred. You can try sending your message again!',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Request Anti-block Hint from server on demand
  const handleRequestHint = async () => {
    if (!activeScenario) return;
    setIsHintLoading(true);

    try {
      const lastAi = messages.filter((m) => m.sender === 'ai').pop();
      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: activeScenario,
          lastAiMessage: lastAi ? lastAi.text : '',
        }),
      });

      if (!response.ok) throw new Error('Hint request failed');
      const data = await response.json();
      if (data.hints) {
        setHintSuggestions(data.hints);
      }
    } catch (e) {
      console.error('Error getting hints:', e);
    } finally {
      setIsHintLoading(false);
    }
  };

  // Save phrase to vocabulary
  const handleSavePhrase = (italian: string, english: string, context?: string) => {
    const updated = savePhrase(italian, english, context);
    setSavedPhrases(updated);
  };

  // Delete phrase from vocabulary
  const handleDeletePhrase = (id: string) => {
    const updated = deletePhrase(id);
    setSavedPhrases(updated);
  };

  const savedItalianPhrasesList = savedPhrases.map((p) => p.italian);

  return (
    <div
      className={`min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans transition-all selection:bg-[#CE2B37] selection:text-white ${
        settings.seniorMode ? 'text-lg' : 'text-base'
      }`}
    >
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        savedCount={savedPhrases.length}
        onOpenVocabulary={() => setIsVocabularyOpen(true)}
        onGoHome={() => setActiveScenario(null)}
        isChatActive={!!activeScenario}
        activeScenarioTitle={activeScenario?.title}
      />

      <main className="flex-1 flex flex-col">
        {activeScenario ? (
          <ChatWindow
            scenario={activeScenario}
            messages={messages}
            goals={goals}
            onSendMessage={handleSendMessage}
            onRequestHint={handleRequestHint}
            isLoading={isLoading}
            isHintLoading={isHintLoading}
            activeCorrection={activeCorrection}
            hintSuggestions={hintSuggestions}
            settings={settings}
            onSavePhrase={handleSavePhrase}
            savedItalianPhrases={savedItalianPhrasesList}
            isCompleted={isScenarioCompleted}
          />
        ) : (
          <HomeScreen
            scenarios={scenarios}
            completedScenarioIds={completedScenarioIds}
            onSelectScenario={handleSelectScenario}
            onCreateCustomScenario={handleCreateCustomScenario}
            seniorMode={settings.seniorMode}
          />
        )}
      </main>

      {/* Vocabulary Drawer */}
      <VocabularyDrawer
        isOpen={isVocabularyOpen}
        onClose={() => setIsVocabularyOpen(false)}
        savedPhrases={savedPhrases}
        onDeletePhrase={handleDeletePhrase}
        audioSpeed={settings.audioSpeed}
        seniorMode={settings.seniorMode}
      />

      {/* Scenario Completion Celebration Modal */}
      {isScenarioCompleted && activeScenario && (
        <ScenarioCompletionModal
          scenario={activeScenario}
          onRestart={() => handleSelectScenario(activeScenario)}
          onChooseNewScenario={() => {
            setIsScenarioCompleted(false);
            setActiveScenario(null);
          }}
          audioSpeed={settings.audioSpeed}
        />
      )}
    </div>
  );
}
