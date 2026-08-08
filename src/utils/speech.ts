/**
 * Speech synthesis and recognition utilities for Italian learning.
 */

// Speak Italian text using Web Speech API with customizable rate
export function speakItalian(
  text: string,
  rate: number = 0.85,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'it-IT';
  utterance.rate = rate; // 0.75 for slow/senior, 0.85-1.0 for normal
  utterance.pitch = 1.0;

  // Try to find a natural Italian voice
  const voices = window.speechSynthesis.getVoices();
  const italianVoices = voices.filter((v) => v.lang.startsWith('it'));
  
  if (italianVoices.length > 0) {
    // Prefer Google or Apple natural voices if available
    const preferredVoice =
      italianVoices.find(
        (v) =>
          v.name.includes('Google') ||
          v.name.includes('Alice') ||
          v.name.includes('Luca') ||
          v.name.includes('Federica') ||
          v.name.includes('Natural')
      ) || italianVoices[0];
    utterance.voice = preferredVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Web Speech Recognition for Italian spoken input
export interface SpeechRecognitionHelper {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
): SpeechRecognitionHelper {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'it-IT';
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    if (final) {
      onResult(final.trim(), true);
    } else if (interim) {
      onResult(interim.trim(), false);
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    },
    isSupported: true,
  };
}
