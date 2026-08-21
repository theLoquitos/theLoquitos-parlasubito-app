import React, { useState, useEffect, useRef } from 'react';
import { Scenario, Message } from '../types';
import { ArrowLeft, Send, Lightbulb, Bot, Target, MapPin, User } from 'lucide-react';

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

  // Inicializar primer mensaje del NPC (NO del Tutor)
  useEffect(() => {
    const initialNpcMessage: Message = {
      id: '1',
      sender: 'npc',
      text: scenario.initialMessage || `Ciao! Benvenuto. Come posso aiutarti?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialNpcMessage]);
  }, [scenario]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsgText = inputMessage;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
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
            role: m.sender === 'user' ? 'user' : 'model',
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
      console.error('Error al conectar con la Arena:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = () => {
    setCompanionHint(`Pista: Intentá usar palabras clave como "${scenario.vocabulary?.[0]?.word || 'grazie'}" o responde al saludo del NPC.`);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-slate-900 text-slate-100 shadow-2xl overflow-hidden font-sans">
      
      {/* 1. BARRA SUPERIOR DE JUEGO */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
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
        
        {/* 2. CONTEXTO DE LA ESCENA Y FICHA NPC */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Escena Activa</span>
          </div>
          <p className="text-sm text-slate-300 italic">{scenario.context}</p>

          <div className="flex items-center space-x-3 pt-2 border-t border-slate-700/60">
            <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-emerald-500 flex items-center justify-center overflow-hidden">
              {scenario.npc?.avatar ? (
                <img src={scenario.npc.avatar} alt={scenario.npc.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{scenario.npc?.name || 'NPC'}</h2>
              <p className="text-xs text-slate-400">{scenario.npc?.role || 'Personaje interactivo'}</p>
            </div>
          </div>
        </div>

        {/* 3. OBJETIVO DE LA MISIÓN */}
        <div className="bg-slate-800/50 border border-emerald-500/30 rounded-lg p-3 flex items-start space-x-3">
          <Target className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Objetivo de Misión</span>
            <p className="text-xs text-slate-200">{scenario.objective}</p>
          </div>
        </div>

        {/* 4. ÁREA DE CONVERSACIÓN (HISTORIAL) */}
        <div className="space-y-3 py-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-500 mb-1 px-1">
                {msg.sender === 'user' ? 'Tú' : scenario.npc?.name || 'NPC'} • {msg.timestamp}
              </span>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === 'user'
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

        {/* 5. SECCIÓN DEL COMPANION (SEPARADO DEL NPC) */}
        <div className="bg-slate-800/40 border border-indigo-500/30 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-indigo-400 text-xs font-semibold">
              <Bot className="w-4 h-4 mr-1.5" />
              <span>Companion IA</span>
            </div>
            {!companionHint && (
              <button
                onClick={handleRequestHint}
                className="flex items-center text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-400" />
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

      {/* 6. INPUT Y CONTROLES DEL JUGADOR */}
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
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

    </div>
  );
}
