import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Shared Gemini AI instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// System prompt template for Italian Tutor
const SYSTEM_INSTRUCTION = `Act as an empathetic, expert Italian language tutor. Your top priority is instant, clear feedback followed by continuous dynamic conversation. You MUST NOT spoon-feed pre-written scripts to the user. Instead, analyze user inputs, correct mistakes, offer practical linguistic/cultural advice, and keep the roleplay flowing.

Rules:
1. Always analyze the user's input first for mistakes before responding.
2. Format your output strictly using two layers:

   SECTION A: [INSTANT FEEDBACK & COACHING CARD]
   - If the user made a grammar, spelling, gender, conjugation, or vocabulary mistake:
     * Set "correction.hasError" to true.
     * Set "correction.originalText" to the exact user input.
     * Set "correction.correctedText" to the corrected sentence in Italian.
     * Set "correction.explanation" to a 1-sentence simple explanation of the rule.
   - If the user's sentence was 100% correct:
     * Set "correction.hasError" to false.
     * Set "correction.correctedText" to the user's sentence.
     * Set "correction.explanation" to "Perfetto! 👏 Ottimo italiano, nessun errore!".

   - ALWAYS include "correction.coachingTip": 1-2 sentences in simple terms teaching a more natural, authentic, or polite way an Italian native would express that idea (e.g., "In Italia è più cortese dire 'Vorrei' invece di 'Voglio' al bar", or cultural nuances about coffee, gelato, markets, etc.).

   SECTION B: [CONVERSATIONAL RESPONSE]
   - The AI seamlessly resumes the roleplay in Italian as the assigned persona.
   - Keep your roleplay reply short (maximum 2 sentences) using clear, everyday vocabulary.
   - Always end your turn with a clear, easy-to-answer question to prompt the user's next message.

3. Provide a clear English translation of your roleplay reply in "translationText".
4. Always include 2-3 short, context-aware Italian "suggestedReplies" (with English translations) to help the user if they feel stuck.
5. Evaluate scenario goals and mark completed goal IDs in "goalUpdates". Set "scenarioCompleted" to true if all goals are completed.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { scenario, history, userMessage } = req.body;

    if (!scenario || !userMessage) {
      return res.status(400).json({ error: 'Scenario and userMessage are required' });
    }

    const promptContext = `
Active Scenario: ${scenario.title} (${scenario.subtitle})
Persona Role: ${scenario.personaRole} (${scenario.personaName})
Location: ${scenario.locationName}
Scenario Description: ${scenario.description}
Scenario Goals to track: ${JSON.stringify(scenario.goals)}

Conversation History so far:
${JSON.stringify(history || [])}

Latest Student Message: "${userMessage}"

Respond as the Italian teacher and persona. Evaluate mistakes in the latest message, produce the gentle correction, the coaching tip, the persona reply with a follow-up question, English translation, 2-3 contextual suggested replies, and update scenario goals status.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptContext,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: 'The persona reply in natural everyday Italian, ending with a clear question.',
            },
            translationText: {
              type: Type.STRING,
              description: 'Clear English translation of the replyText.',
            },
            correction: {
              type: Type.OBJECT,
              description: 'Gentle error correction & native coaching object.',
              properties: {
                hasError: { type: Type.BOOLEAN },
                originalText: { type: Type.STRING },
                correctedText: { type: Type.STRING },
                explanation: { type: Type.STRING },
                keyConcept: { type: Type.STRING },
                coachingTip: {
                  type: Type.STRING,
                  description: '1-2 sentences teaching a more natural, authentic, or polite way a native Italian expresses that concept.',
                },
              },
              required: ['hasError', 'originalText', 'correctedText', 'explanation', 'coachingTip'],
            },
            suggestedReplies: {
              type: Type.ARRAY,
              description: '2-3 contextual Italian responses for Anti-Block assistance.',
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  translation: { type: Type.STRING },
                },
                required: ['text', 'translation'],
              },
            },
            goalUpdates: {
              type: Type.ARRAY,
              description: 'Goals updated or completed in this turn.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN },
                },
                required: ['id', 'completed'],
              },
            },
            scenarioCompleted: {
              type: Type.BOOLEAN,
              description: 'Whether all goals for this scenario are now fulfilled.',
            },
          },
          required: ['replyText', 'translationText', 'correction', 'suggestedReplies', 'goalUpdates', 'scenarioCompleted'],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message || String(error),
    });
  }
});

// Anti-block hint endpoint (on demand)
app.post('/api/hint', async (req, res) => {
  try {
    const { scenario, lastAiMessage } = req.body;

    const hintPrompt = `
Scenario: ${scenario?.title || 'Italian Conversation'}
Last AI Message: "${lastAiMessage || ''}"

Provide 3 helpful, natural Italian response options that a beginner student can say next in this situation, along with English translations. Keep them short and easy to pronounce.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: hintPrompt,
      config: {
        systemInstruction: 'You are an empathetic Italian language coach helping a student who feels stuck. Give 3 clear, easy responses.',
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  translation: { type: Type.STRING },
                },
                required: ['text', 'translation'],
              },
            },
          },
          required: ['hints'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"hints":[]}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/hint:', error);
    return res.status(500).json({ error: 'Failed to generate hints' });
  }
});

// Gemini TTS audio generation endpoint (optional high quality audio synthesis)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say in clear, friendly Italian with slow pace: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO' as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS' });
    }

    return res.json({ audioBase64: base64Audio, mimeType: 'audio/mp3' });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    return res.status(500).json({ error: 'TTS generation failed', details: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ParlaSubito AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
