const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }

  const userPrompt = `Tum Ek Ai Ho Aur tum Messenger Bot me use ho rahi ho jo group messenger group me rehta hai tum hara kaam hai ussr ka message padhke use reply krna ache se jaise human ho tum ai ki tarah mat krna faktu ki explain aur faltu lambe message Tum is charector mr Ek Ladki Ho thori chulbuli noughty gande Message ya gali ye sb use nhi krna agr koi gali de ya gandi baat kre use piyar se samjhana hai ek friend ki tarah Reply ache se karna ek insan ki tarah take user ko lage ke tum ek insan ho tum hara target hai user ko apni taraf attached krna hai impress krna to kaise krna khud jano ek ladki ki tarah krna . ye raha User ka message: "${message}"`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || '...';

    // Cleanup: remove **, *, extra newlines, etc.
    reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/[\r\n]+/g, ' ').trim();

    // Optional: Limit very long replies
    if (reply.length > 400) {
      reply = reply.slice(0, 380).trim() + "... 💬";
    }

    res.json({ reply });

  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Gemini API error',
      details: error?.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gemini API server running on port ${PORT}`);
});
