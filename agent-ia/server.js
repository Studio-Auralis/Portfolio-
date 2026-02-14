require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { orchestrate } = require('./orchestrator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting: max 5 analyses per IP per 15 minutes
const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GROQ_API_KEY });
});

// Main analysis endpoint — SSE stream
app.post('/api/analyze', analysisLimiter, (req, res) => {
  const { companyName, sector, employees, challenges, budget } = req.body;

  // Validation
  if (!companyName || !sector || !employees || !challenges) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Clé API Groq non configurée.' });
  }

  // Set up SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const sendEvent = (type, data) => {
    res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Handle client disconnect
  let aborted = false;
  req.on('close', () => {
    aborted = true;
  });

  const formData = { companyName, sector, employees, challenges, budget };

  orchestrate(formData, (type, data) => {
    if (!aborted) {
      sendEvent(type, data);
    }
  })
    .then(() => {
      if (!aborted) {
        sendEvent('done', {});
        res.end();
      }
    })
    .catch((err) => {
      console.error('Orchestration error:', err.message);
      if (!aborted) {
        sendEvent('error', { message: 'Une erreur est survenue. Veuillez réessayer.' });
        res.end();
      }
    });
});

app.listen(PORT, () => {
  console.log(`[OK] Agent IA Studio Auralis running on http://localhost:${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.warn('[WARN] GROQ_API_KEY is not set. Create a .env file with your key.');
  }
});
