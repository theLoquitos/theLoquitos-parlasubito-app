import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Send,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  VolumeX,
} from 'lucide-react';
import { Scenario, ChatMessage, UserSettings, CorrectionInfo, SuggestedReply } from '../types';
import { speakItalian, stopSpeech, createSpeechRecognizer } from '../utils/speech';
import { CorrectionBanner } from './CorrectionBanner';

interface ChatWindowProps {
  scenario: Scenario;
  messages: ChatMessage[];
  goals: Scenario.goals;
  onSendMessage: (text: string) => void;
  onRequestHint: () => void;
  isLoading: boolean;
  isHintLoading: boolean;
  activeCorrection?: CorrectionInfo;
  hintSuggestions: SuggestedReply[];
  settings: UserSettings;
  onSavePhrase: (italian: string, english: string, context?: string) => void;
  savedItalianPhrases: string[];
  isCompleted: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  scenario,
  messages,
  goals,
  onSendMessage,
  onRequestHint,
  isLoading,
  isHintLoading,
  activeCorrection,
  hintSuggestions,
  settings,
  onSavePhrase,
  savedItalianPhrases,
  isCompleted,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [showTranslationsMap, setShowTranslationsMap] = useState<Record<string, boolean>>({});
  const [showHintsPanel, setShowHintsPanel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<any>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeCorrection]);

  // Setup speech recognition
  useEffect(() => {
    const recognizer = createSpeechRecognizer(
      (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal) {
          setIsRecording(false);
        }
      },
      (error) => {
        console.warn('Recognition error:', error);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    recognizerRef.current = recognizer;

    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggleRecording = () => {
    if (!recognizerRef.current?.isSupported) {
      alert('Il tuo browser non supporta il riconoscimento vocale diretto. Puoi digitare la tua risposta nel campo di testo!');
      return;
    }

    if (isRecording) {
      recognizerRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognizerRef.current.start();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    stopSpeech();
  };

  const handlePlayAudio = (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      stopSpeech();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(messageId);
    speakItalian(
      text,
      settings.audioSpeed,
      () => setPlayingMessageId(messageId),
      () => setPlayingMessageId(null),
      () => setPlayingMessageId(null)
    );
  };

  const toggleTranslation = (id: string) => {
    setShowTranslationsMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUseSuggestedReply = (replyText: string) => {
    onSendMessage(replyText);
    setShowHintsPanel(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 flex flex-col h-[calc(100vh-80px)]">
      {/* Top Bar: Scenario Goal Tracker */}
      <div className="bg-white border-4 border-black rounded-3xl p-4 mb-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-[#FFF4E5] p-2 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{scenario.icon}</span>
            <div>
              <h2 className="font-black text-black text-lg sm:text-xl font-sans uppercase tracking-tight">
                {scenario.title} — <span className="text-[#0055A4]">{scenario.personaName}</span> ({scenario.personaRole})
              </h2>
              <p className="text-xs text-stone-600 font-bold uppercase tracking-wider">{scenario.locationName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FFF4E5] px-3.5 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-4 h-4 text-[#CE2B37]" />
            <span className="text-xs font-black uppercase text-black">
              Obiettivi: {goals.filter((g) => g.completed).length} / {goals.length}
            </span>
          </div>
        </div>

        {/* Goals Checklist Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t-2 border-black">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`flex items-start gap-2 p-2.5 rounded-2xl border-2 border-black text-xs font-extrabold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                goal.completed
                  ? 'bg-[#009246] text-white'
                  : 'bg-[#F4F1EA] text-black'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  goal.completed ? 'text-white' : 'text-stone-400'
                }`}
              />
              <span className="line-clamp-2">{goal.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-4 space-y-6 pr-1 bg-[#F4F1EA] rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-3">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const isUser = msg.sender === 'user';
          const isSaved = isAi && savedItalianPhrases.includes(msg.text);
          const showTranslation = showTranslationsMap[msg.id] ?? settings.showTranslations;

          return (
            <div key={msg.id} className="space-y-3">
              {/* Render Instant Feedback Card (Correction or Positive Praise Badge) */}
              {isAi && msg.correction && (
                <CorrectionBanner
                  correction={msg.correction}
                  audioSpeed={settings.audioSpeed}
                  seniorMode={settings.seniorMode}
                />
              )}

              {/* Chat Bubble */}
              <div
                className={`flex gap-3 max-w-[95%] sm:max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    isAi
                      ? 'bg-black text-white'
                      : 'bg-[#CE2B37] text-white font-black text-lg'
                  }`}
                >
                  {isAi ? scenario.icon : 'TU'}
                </div>

                {/* Message Box */}
                <div
                  className={`p-5 sm:p-6 border-4 border-black relative transition-all ${
                    settings.seniorMode ? 'text-xl leading-relaxed' : 'text-base sm:text-lg'
                  } ${
                    isAi
                      ? 'bg-white text-[#1A1A1A] rounded-3xl rounded-tl-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-[#009246] text-white font-extrabold italic rounded-3xl rounded-tr-none shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  {/* Speaker & Save buttons for AI messages */}
                  {isAi && (
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-black">
                      <div className="flex items-center gap-2">
                        {/* Prominent Speaker Button */}
                        <button
                          onClick={() => handlePlayAudio(msg.id, msg.text)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                            playingMessageId === msg.id
                              ? 'bg-[#CE2B37] text-white animate-pulse'
                              : 'bg-[#0055A4] hover:bg-blue-700 text-white'
                          }`}
                          title="Ascolta la risposta dell'AI a velocità naturale"
                        >
                          <Volume2 className="w-4 h-4 fill-current" />
                          <span>{playingMessageId === msg.id ? 'In ascolto...' : 'Ascolta Risposta'}</span>
                        </button>

                        <span className="text-xs font-black uppercase text-stone-700">
                          {scenario.personaName}
                        </span>
                      </div>

                      {/* Save Phrase Bookmark Button */}
                      <button
                        onClick={() => onSavePhrase(msg.text, msg.translation || '', scenario.title)}
                        className={`p-2 rounded-xl border-2 border-black transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          isSaved
                            ? 'text-white bg-[#009246]'
                            : 'text-black bg-white hover:bg-stone-100'
                        }`}
                        title={isSaved ? 'Frase già salvata' : 'Salva nel tuo vocabolario'}
                      >
                        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  {/* Italian Text */}
                  <p className="font-extrabold tracking-wide font-sans leading-relaxed">{msg.text}</p>

                  {/* English Translation Toggle for AI message */}
                  {isAi && msg.translation && (
                    <div className="mt-3 pt-2 border-t-2 border-black">
                      <button
                        onClick={() => toggleTranslation(msg.id)}
                        className="text-xs font-black text-[#0055A4] uppercase tracking-wider hover:underline flex items-center gap-1 transition"
                      >
                        {showTranslation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{showTranslation ? 'Nascondi Traduzione' : 'Mostra Traduzione'}</span>
                      </button>

                      {showTranslation && (
                        <p className="mt-2 text-sm text-black italic font-bold bg-[#FFF4E5] p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          "{msg.translation}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Inline AI Suggested Replies (Anti-Block Hints) after AI message */}
              {isAi && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                <div className="ml-12 sm:ml-16 my-2 bg-[#FFF4E5] border-3 border-black rounded-3xl p-4 max-w-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 mb-2.5 text-xs font-black text-black uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-[#D97706]" />
                    <span>Cosa puoi rispondere? (Suggerimenti pronti):</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {msg.suggestedReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUseSuggestedReply(reply.text)}
                        className="text-left p-3 bg-white hover:bg-[#F4F1EA] border-2 border-black rounded-2xl transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 group"
                      >
                        <p className="font-extrabold text-black text-sm sm:text-base">
                          🗣️ "{reply.text}"
                        </p>
                        <p className="text-xs text-stone-600 font-bold italic mt-0.5">{reply.translation}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 text-black bg-white border-3 border-black p-4 rounded-2xl max-w-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-[#0055A4]" />
            <span>{scenario.personaName} sta scrivendo...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Anti-Block Assistance Panel (On Demand) */}
      {showHintsPanel && (
        <div className="bg-[#FFF4E5] border-4 border-black rounded-3xl p-4 my-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#D97706]" />
              <h4 className="font-black text-black uppercase text-sm sm:text-base">
                Suggerimenti della Guida (Anti-Blocco)
              </h4>
            </div>
            <button
              onClick={() => setShowHintsPanel(false)}
              className="text-xs font-black uppercase text-black px-2.5 py-1 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Chiudi
            </button>
          </div>

          {isHintLoading ? (
            <div className="flex items-center gap-2 text-black text-sm p-3 font-bold">
              <RefreshCw className="w-4 h-4 animate-spin text-[#0055A4]" />
              <span>Generazione suggerimenti in corso...</span>
            </div>
          ) : hintSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {hintSuggestions.map((hint, i) => (
                <button
                  key={i}
                  onClick={() => handleUseSuggestedReply(hint.text)}
                  className="p-3 bg-white hover:bg-[#F4F1EA] border-2 border-black rounded-2xl text-left transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <p className="font-black text-black text-sm sm:text-base">"{hint.text}"</p>
                  <p className="text-xs text-stone-600 font-bold italic">{hint.translation}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-700 font-bold">Clicca sul pulsante per generare 3 risposte suggerite!</p>
          )}
        </div>
      )}

      {/* User Input & Speech Bar */}
      <div className="bg-white border-4 border-black rounded-3xl p-3 sm:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shrink-0">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2 sm:gap-3">
          {/* On-demand Hint Button ("Aiuto!") */}
          <button
            type="button"
            onClick={() => {
              setShowHintsPanel(!showHintsPanel);
              if (!showHintsPanel && hintSuggestions.length === 0) {
                onRequestHint();
              }
            }}
            className={`h-16 px-4 rounded-3xl border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${
              showHintsPanel
                ? 'bg-[#CE2B37] text-white'
                : 'bg-[#FFF4E5] hover:bg-amber-100 text-black'
            }`}
            title="Sbloccati! Clicca per vedere risposte suggerite"
          >
            <Lightbulb className="w-5 h-5 text-[#D97706]" />
            <span className="hidden sm:inline">Aiuto!</span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? '🎙️ Sto ascoltando... parla in italiano...'
                : 'Scrivi qui...'
            }
            disabled={isLoading}
            className={`flex-1 h-16 bg-[#F4F1EA] border-4 border-black rounded-3xl px-5 text-black font-bold placeholder-stone-400 focus:outline-none focus:bg-white transition ${
              settings.seniorMode ? 'text-xl' : 'text-base sm:text-xl'
            } ${
              isRecording
                ? 'border-[#CE2B37] ring-4 ring-[#CE2B37]/30'
                : 'border-black'
            }`}
          />

          {/* Large Microphone Button */}
          <button
            type="button"
            onClick={handleToggleRecording}
            className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-black shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 active:shadow-none active:translate-y-1 transition-all ${
              isRecording
                ? 'bg-[#CE2B37] text-white animate-bounce'
                : 'bg-[#CE2B37] hover:bg-red-700 text-white'
            }`}
            title={isRecording ? 'Interrompi registrazione' : 'Parla al microfono'}
          >
            {isRecording ? <MicOff className="w-8 h-8 sm:w-10 sm:h-10" /> : <Mic className="w-8 h-8 sm:w-10 sm:h-10" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`h-16 px-6 sm:px-8 bg-black hover:bg-stone-800 disabled:opacity-40 text-white font-black text-base sm:text-lg uppercase tracking-widest rounded-3xl border-4 border-black transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 shrink-0 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
              settings.seniorMode ? 'text-lg' : 'text-base'
            }`}
          >
            <Send className="w-5 h-5 fill-current" />
            <span className="hidden md:inline">Invia</span>
          </button>
        </form>
      </div>
    </div>
  );
};
