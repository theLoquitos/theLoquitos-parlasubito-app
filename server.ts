import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// API Endpoint para comunicarse con Gemini AI
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, scenarioContext, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'Falta la API Key de Gemini en las variables de entorno.' });
      return;
    }

    const systemPrompt = `
Sos un tutor de italiano nativo, amable y paciente. El contexto actual es: "${scenarioContext || 'Conversación general'}".
Responde al usuario en italiano de manera natural. Si detectas un error gramatical u ortográfico en su mensaje, genera una corrección.

DEBES responder ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "text": "Tu respuesta en italiano",
  "correction": null o {
    "original": "Frase original con error",
    "corrected": "Frase corregida",
    "explanation": "Explicación breve en español del error",
    "grammarRule": "Regla gramatical"
  },
  "suggestedReplies": [
    {"italian": "Opción 1 en italiano", "spanish": "Traducción al español"},
    {"italian": "Opción 2 en italiano", "spanish": "Traducción al español"}
  ]
}
Si el usuario no comete errores, la clave "correction" debe ser null.
    `.trim();

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nHistorial previo:\n${JSON.stringify(history || [])}\n\nMensaje actual del usuario: "${message}"` }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Error desde Gemini API:', errorText);
      res.status(500).json({ error: 'Error al procesar la respuesta de la IA.' });
      return;
    }

    const data = await apiResponse.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText) {
      const parsed = JSON.parse(candidateText);
      res.json(parsed);
    } else {
      res.json({
        text: 'Scusa, non ho capito bene. Puoi ripetere?',
        correction: null,
        suggestedReplies: []
      });
    }
  } catch (error) {
    console.error('Error interno del servidor:', error);
    res.status(500).json({ error: 'Error interno en el servidor.' });
  }
});

// Servir archivos estáticos de la app en producción
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
