import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// API route for AI Advisor
app.post('/api/advisor', async (req, res) => {
  try {
    const { question, context, history, apiKey: clientKey } = req.body;
    const apiKey = clientKey || req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'API ключ Gemini не указан. Введите ключ в настройках советника или настройте GEMINI_API_KEY.'
      });
    }

    const ai = new GoogleGenAI({ apiKey: String(apiKey) });

    const systemInstruction = `Ты финансовый аналитик малого бизнеса. Отвечай коротко и просто, как живой человек, на «вы». Используй только цифры клиента. Ничего не выдумывай. Порядок: выпиши данные, посчитай по шагам, проверь себя, ответь. Если данных не хватает, скажи, каких именно. Формат:
1. Вывод (в 1-2 предложениях)
2. Причина (с конкретными цифрами клиента и нормами ниши)
3. Расчёт (по шагам)
4. 3 действия (ровно 3 конкретных действия с цифрами)
Не обещай гарантированный доход. Не давай налоговых и юридических заключений. Если бизнес в минусе, сначала помоги остановить убытки и выйти в безубыточность, а затем советуй рост.`;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Context from client's financial calculations
    if (context) {
      contents.push({
        role: 'user',
        parts: [{ text: `Вот точные финансовые данные моего бизнеса:\n${context}` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Данные приняты. Я вижу точные цифры вашего бизнеса, нишу, доходы, расходы, маржу и статьи выше нормы. Готов предоставить конкретный план продвижения.' }]
      });
    }

    // Previous chat history
    if (Array.isArray(history)) {
      history.slice(-6).forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Current user question
    contents.push({
      role: 'user',
      parts: [{ text: question || 'Составь план продвижения на 30 дней на основе моих цифр.' }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
      }
    });

    const reply = response.text || 'Не удалось сформировать ответ. Попробуйте еще раз.';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Advisor error:', err);
    return res.status(500).json({
      error: err.message || 'Ошибка сервиса ИИ-советника. Пожалуйста, повторите запрос.'
    });
  }
});

// API route for AI Marketing & Business Tools
app.post('/api/ai-tool', async (req, res) => {
  try {
    const { prompt, toolType, apiKey: clientKey } = req.body;
    const apiKey = clientKey || req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'API ключ Gemini не настроен на сервере.'
      });
    }

    const ai = new GoogleGenAI({ apiKey: String(apiKey) });

    const systemInstruction = `Ты опытный маркетолог и консультант малого бизнеса. Пиши коротко, просто, как живой человек, на языке пользователя. Используй только данные, которые дало приложение (ниша, город, цифры, ввод пользователя). Ничего не выдумывай: не придумывай отзывы, имена, статистику и факты о конкурентах. Если не хватает данных, задай один уточняющий вопрос. Не обещай гарантированный результат.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || '';
    return res.json({ reply });
  } catch (err: any) {
    console.error('AI Tool error:', err);
    return res.status(500).json({
      error: err.message || 'Ошибка генерации ИИ. Попробуйте еще раз.'
    });
  }
});

// Vite middleware in dev mode
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
