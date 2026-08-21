import React, { useState, useEffect, useRef } from 'react';
import { Scenario, Message } from '../types';

interface ChatWindowProps {
  scenario: Scenario;
  onComplete: () => void;
  onBack: () => void;
}

export default function ChatWindow({ scenario, onComplete, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companionHint, setCompanionHint] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialNpcMessage: Message = {
      id: '1',
      sender: 'npc',
      text: scenario.initialMessage || 'Ciao! Benvenuto. Come posso aiutarti?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialNpcMessage]);
  }, [scenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsgText = inputMessage;
    const playerMsg: Message = {
      id: Date.now().toString(),
      sender: 'player',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, playerMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          systemPrompt: scenario.systemPrompt,
          history: messages.map((m) => ({
            role: m.sender === 'player' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      const npcReplyText = data.text || 'Scusa, non ho capito. Puoi ripetere?';

      const npcMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'npc',
        text: npcReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, npcMsg]);
    } catch (err) {
      console.error('Error en la comunicación con la Arena:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = () => {
    const wordHint = scenario.vocabulary?.[0]?.word || 'grazie';
    setCompanionHint(`Pista: Intentá usar palabras clave como "${wordHint}" o responde directamente a la pregunta.`);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-slate-900 text-slate-100 shadow-2xl overflow-hidden font-sans">
      
      {/* BARRA SUPERIOR */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Mapa</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">ParlaSubito Game Arena</span>
          <h1 className="text-lg font-bold text-white">{scenario.title}</h1>
        </div>

        <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-semibold">
          Nivel {scenario.level}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* CONTEXTO Y NPC */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Escena Activa</span>
          </div>
          <p className="text-sm text-slate-300 italic">{scenario.context}</p>

          <div className="flex items-center space-x-3 pt-2 border-t border-slate-700/60">
            <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-emerald-500 flex items-center justify-center overflow-hidden">
              {scenario.npc?.avatar ? (
                <img src={scenario.npc.avatar} alt={scenario.npc.name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{scenario.npc?.name || 'NPC'}</h2>
              <p className="text-xs text-slate-400">{scenario.npc?.role || 'Personaje interactivo'}</p>
            </div>
          </div>
        </div>

        {/* OBJETIVO */}
        <div className="bg-slate-800/50 border border-emerald-500/30 rounded-lg p-3 flex items-start space-x-3">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Objetivo de Misión</span>
            <p className="text-xs text-slate-200">{scenario.objective}</p>
          </div>
        </div>

        {/* HISTORIAL DE MENSAJES */}
        <div className="space-y-3 py-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'player' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-500 mb-1 px-1">
                {msg.sender === 'player' ? 'Tú' : scenario.npc?.name || 'NPC'} • {msg.timestamp}
              </span>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === 'player'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 italic py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{scenario.npc?.name || 'El personaje'} está respondiendo...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* COMPANION */}
        <div className="bg-slate-800/40 border border-indigo-500/30 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-indigo-400 text-xs font-semibold">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Companion IA</span>
            </div>
            {!companionHint && (
              <button
                onClick={handleRequestHint}
                className="flex items-center text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5 mr-1 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Pedir Pista</span>
              </button>
            )}
          </div>
          {companionHint && (
            <p className="text-xs text-indigo-200 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
              {companionHint}
            </p>
          )}
        </div>

      </div>

      {/* INPUT DEL JUGADOR */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribí tu respuesta en italiano..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>

    </div>
  );
}
