import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 10000;

app.use(express.json());

interface ChatRequestBody {
  message: string;
  scenarioContext?: string;
  history?: Array<{
    sender: string;
    text: string;
  }>;
}

app.post('/api/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response): Promise<void> => {
  try {
    const { message, scenarioContext, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'Falta la API Key de Gemini en las variables de entorno.' });
      return;
    }

    const systemPrompt = `
Sos un tutor de italiano nativo, amable y paciente. El contexto de interacción es: "${scenarioContext || 'Conversación general'}".
Responde al usuario en italiano fluido. Si el usuario comete un error gramatical u ortográfico, genera una corrección constructiva.

DEBES responder strictly en formato JSON con la siguiente estructura:
{
  "text": "Tu respuesta en italiano",
  "correction": null o {
    "original": "Frase original del usuario",
    "corrected": "Frase corregida",
    "explanation": "Explicación breve en español",
    "grammarRule": "Regla gramatical relevante"
  },
  "suggestedReplies": [
    {"italian": "Respuesta sugerida 1", "spanish": "Traducción 1"},
    {"italian": "Respuesta sugerida 2", "spanish": "Traducción 2"}
  ]
}
Si no hay errores, el campo "correction" debe ser null.
    `.trim();

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nHistorial previo:\n${JSON.stringify(history || [])}\n\nMensaje del usuario: "${message}"`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Error desde la API de Gemini:', errorText);
      res.status(500).json({ error: 'Error al procesar la respuesta con el modelo de IA.' });
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
    console.error('Error en el servidor backend:', error);
    res.status(500).json({ error: 'Error interno en el servidor.' });
  }
});

// En el bundle ESM (server.mjs) alojado en server-dist/, dist/ está en el directorio padre
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[ParlaSubito Server] ESM Server corriendo en puerto ${PORT}`);
});
