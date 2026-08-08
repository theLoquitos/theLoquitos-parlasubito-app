import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function parseCleanJson(text: string | undefined) {
  if (!text) return {};
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Error parseando JSON:', e, 'Texto original:', text);
    return {};
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const SYSTEM_INSTRUCTION = `Act as an expert, empathetic Italian language teacher playing a specific roleplay character in ParlaSubito AI.

RULES:
1. NEVER provide fixed copy-paste scripts or pre-written full answers to the user.
2. ALWAYS evaluate the user's latest message first for grammar, spelling, or politeness (tu vs. Lei).
3. Determine the correct character avatar expression based on user performance:
   - "HAPPY": User spoke accurately or completed a goal.
   - "TEACHING": User made a mistake; explain gently.
   - "CELEBRATING": All goals in the scenario are completed.
4. Format your output STRICTLY as a JSON object matching the schema.
5. Keep explanations clear, warm, and simple for all age groups (teens to seniors).`;

app.post('/api/chat', async (req, res) => {
  try {
    const { scenario, history, userMessage } = req.body;

    if (!scenario || !userMessage) {
      return res.status(400).json({ error: 'Scenario and userMessage are required' });
    }

    const recentHistory = (history || []).slice(-6);

    const promptContext = `
Active Scenario: ${scenario.title} (${scenario.locationName})
Persona Character: ${scenario.personaName} (${scenario.personaRole})
Scenario Goals: ${JSON.stringify(scenario.goals)}

Recent Conversation History:
${JSON.stringify(recentHistory)}

Latest Student Message: "${userMessage}"

Respond in character. Evaluate mistakes, select avatar expression ("HAPPY", "TEACHING", or "CELEBRATING"), provide instant correction, offer a native coaching tip, reply in conversational Italian, provide English translation, and update goal progress.
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
            avatarExpression: {
              type: Type.STRING,
              description: 'Expression state: HAPPY, TEACHING, or CELEBRATING',
            },
            replyText: {
              type: Type.STRING,
              description: 'The persona reply in natural everyday Italian.',
            },
            translationText: {
              type: Type.STRING,
              description: 'Clear English translation of replyText.',
            },
            correction: {
              type: Type.OBJECT,
              properties: {
                hasError: { type: Type.BOOLEAN },
                originalText: { type: Type.STRING },
                correctedText: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['hasError', 'originalText', 'correctedText', 'explanation'],
            },
            coachingTip: {
              type: Type.OBJECT,
              properties: {
                advice: { type: Type.STRING },
                naturalAlternative: { type: Type.STRING },
              },
              required: ['advice', 'naturalAlternative'],
            },
            goalUpdates: {
              type: Type.ARRAY,
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
            },
          },
          required: ['avatarExpression', 'replyText', 'translationText', 'correction', 'coachingTip', 'goalUpdates', 'scenarioCompleted'],
        },
      },
    });

    const parsedData = parseCleanJson(response.text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.post('/api/hint', async (req, res) => {
  try {
    const { scenario, lastAiMessage } = req.body;

    const hintPrompt = `
Scenario: ${scenario?.title || 'Italian Conversation'}
Last AI Message: "${lastAiMessage || ''}"

Provide 2 short conceptual hints in Spanish explaining WHAT topic or idea the student can express next.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: hintPrompt,
      config: {
        systemInstruction: 'You are a supportive Italian language coach giving conceptual guidance.',
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
                  concept: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['concept', 'tip'],
              },
            },
          },
          required: ['hints'],
        },
      },
    });

    const parsedData = parseCleanJson(response.text);
    return res.json(parsedData);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to generate hints' });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say in clear Italian with slow pace: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO' as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return res.status(500).json({ error: 'No audio generated' });

    return res.json({ audioBase64: base64Audio, mimeType: 'audio/mp3' });
  } catch (error: any) {
    return res.status(500).json({ error: 'TTS failed' });
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
    console.log(`Server running on port ${PORT}`);
  });
}
app.post('/api/evaluate-pronunciation', async (req, res) => {
  try {
    const { audioBase64, expectedText } = req.body;

    if (!audioBase64 || !expectedText) {
      return res.status(400).json({ error: 'Audio and expectedText are required' });
    }

    const prompt = `
You are an expert Italian phonetics coach. Listen to the student's recorded audio trying to say:
"${expectedText}"

Evaluate their Italian pronunciation based on:
1. Phonetic accuracy (correct Italian vowel sounds, double consonants "doppie", "gli", "gn", "sc", "c/g" sounds).
2. Stress accent and rhythm.
3. Clarity and fluency.

Return STRICT JSON matching the schema:
- score: integer from 0 to 100
- phoneticErrors: list of specific words/phonemes mispronounced
- feedback: clear, encouraging advice in Spanish on how to fix their pronunciation
- nativeTip: a tip about Italian phonetics or cadence relevant to this sentence
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'audio/webm',
                data: audioBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score between 0 and 100' },
            phoneticErrors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of words or sounds mispronounced',
            },
            feedback: { type: Type.STRING, description: 'Direct evaluation in Spanish' },
            nativeTip: { type: Type.STRING, description: 'Phonetic rule or native advice' },
          },
          required: ['score', 'phoneticErrors', 'feedback', 'nativeTip'],
        },
      },
    });

    const result = parseCleanJson(response.text);
    return res.json(result);
  } catch (error: any) {
    console.error('Error evaluando pronunciación:', error);
    return res.status(500).json({ error: 'Failed to evaluate pronunciation' });
  }
});
startServer();
