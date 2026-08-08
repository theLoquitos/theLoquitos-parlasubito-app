import React from 'react';
import { X, Volume2, Trash2, BookMarked, Sparkles } from 'lucide-react';
import { SavedPhrase } from '../types';
import { speakItalian } from '../utils/speech';

interface VocabularyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPhrases: SavedPhrase[];
  onDeletePhrase: (id: string) => void;
  audioSpeed: number;
  seniorMode: boolean;
}

export const VocabularyDrawer: React.FC<VocabularyDrawerProps> = ({
  isOpen,
  onClose,
  savedPhrases,
  onDeletePhrase,
  audioSpeed,
  seniorMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white border-l-4 border-black text-black h-full flex flex-col shadow-[-10px_0px_0px_0px_rgba(0,0,0,1)]">
        {/* Drawer Header */}
        <div className="p-5 border-b-4 border-black flex items-center justify-between bg-[#FFF4E5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#009246] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black font-sans">Il Tuo Vocabolario</h3>
              <p className="text-xs font-bold text-stone-700">{savedPhrases.length} frasi salvate per la pratica</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-stone-100 text-black border-2 border-black rounded-xl transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Phrases List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FDFCFB]">
          {savedPhrases.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Sparkles className="w-12 h-12 text-[#D97706] mx-auto mb-3" />
              <p className="font-black uppercase text-black text-lg">Nessuna frase salvata ancora.</p>
              <p className="text-xs font-bold text-stone-600 mt-2 max-w-xs mx-auto">
                Clicca sull'icona segnalibro accanto ai messaggi dell'AI per salvare le frasi che vuoi ricordare!
              </p>
            </div>
          ) : (
            savedPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="bg-[#F4F1EA] p-4.5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition group relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p
                      className={`font-black text-black ${
                        seniorMode ? 'text-xl' : 'text-lg'
                      }`}
                    >
                      "{phrase.italian}"
                    </p>
                    <p className="text-stone-700 text-sm mt-1 font-bold italic">{phrase.english}</p>
                    {phrase.context && (
                      <span className="inline-block mt-2 text-[11px] font-black uppercase text-white bg-[#009246] px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {phrase.context}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => speakItalian(phrase.italian, audioSpeed)}
                      className="p-2.5 bg-[#0055A4] hover:bg-blue-700 text-white rounded-xl border-2 border-black transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                      title="Ascolta la pronuncia"
                    >
                      <Volume2 className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => onDeletePhrase(phrase.id)}
                      className="p-2.5 bg-white hover:bg-[#CE2B37] hover:text-white text-black border-2 border-black rounded-xl transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                      title="Elimina frase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
