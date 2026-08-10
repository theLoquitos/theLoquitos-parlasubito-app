import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.post('/api/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en Render.' });
    }

    const { message, scenarioContext, history } = req.body;

    const systemInstruction = `
Eres un tutor interactivo de italiano llamado "ParlaSubito AI". 
El usuario está practicando en la situación: "${scenarioContext || 'Conversación general'}".
Responde en italiano natural adecuado para un estudiante. 
Proporciona también:
1. Una corrección amigable si el usuario cometió algún error gramatical u ortográfico en su mensaje.
2. Dos sugerencias de respuesta en italiano con su traducción al español para ayudarlo a continuar.

Devuelve la respuesta estricta en formato JSON con la siguiente estructura:
{
  "text": "Tu respuesta en italiano",
  "correction": {
    "original": "Texto del usuario",
    "corrected": "Texto corregido",
    "explanation": "Explicación breve en español"
  },
  "suggestedReplies": [
    { "italian": "Opción 1 en italiano", "spanish": "Traducción 1" },
    { "italian": "Opción 2 en italiano", "spanish": "Traducción 2" }
  ]
}
Nota: Si no hay errores, deja "correction" como null.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        ...(history || []).map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error en /api/chat:', err);
    res.status(500).json({ error: 'Error procesando la solicitud en la IA.', details: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] ParlaSubito ejecutándose exitosamente en puerto ${PORT}`);
});
});
startServer();
