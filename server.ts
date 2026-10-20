import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API route to generate Telugu and English festival wishes
app.post('/api/generate-wishes', async (req: Request, res: Response) => {
  try {
    const { festival, language = 'te', tone = 'traditional', customName = '', customNote = '' } = req.body;

    const festivalNames: Record<string, { te: string; en: string }> = {
      ugadi: { te: 'ఉగాది (Ugadi)', en: 'Ugadi Telugu New Year' },
      sankranti: { te: 'సంక్రాంతి (Sankranti / Pongal)', en: 'Makara Sankranti / Pongal' },
      dasara: { te: 'దసరా & విజయదశమి (Dasara / Vijayadashami)', en: 'Vijayadashami / Dasara' },
      deepavali: { te: 'దీపావళి (Deepavali / Diwali)', en: 'Deepavali / Diwali' },
      vinayaka: { te: 'వినాయక చవితి (Vinayaka Chavithi / Ganesh Chaturthi)', en: 'Vinayaka Chavithi / Ganesh Chaturthi' },
      bathukamma: { te: 'బతుకమ్మ పండుగ (Bathukamma)', en: 'Bathukamma Festival of Flowers' },
    };

    const targetFest = festivalNames[festival] || { te: festival, en: festival };

    const prompt = `You are a master Telugu cultural poet and copywriter.
Create 3 distinct, beautiful and authentic festival greetings for ${targetFest.te} in ${language === 'te' ? 'pure, poetic Telugu script' : 'festive English'}.

Festival: ${targetFest.en}
Tone: ${tone} (e.g. traditional, poetic, family blessings, or modern crisp)
${customName ? `Sender or recipient context: "${customName}"` : ''}
${customNote ? `Special user request: "${customNote}"` : ''}

Output strictly valid JSON with this structure:
{
  "greetings": [
    {
      "title": "A short, impactful headline/greeting title (e.g. 'శుభోదయ ఉగాది శుభాకాంక్షలు' or 'Happy Ugadi')",
      "message": "2-3 lines of heartwarming, authentic, cultural festival wishes in ${language === 'te' ? 'Telugu' : 'English'}",
      "subtext": "A brief auspicious blessing line (e.g. 'మీ కుటుంబ సభ్యులకు ఆయురారోగ్యాలు ప్రసాదించాలని కోరుకుంటూ...' or 'Wishing you and your family prosperity and joy.')"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating wishes with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to generate festive wishes',
      message: error?.message || 'Server error',
    });
  }
});

// Setup dev server with Vite or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Festival Banner App listening on port ${PORT}`);
  });
}

startServer();
