import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = "https://api.telegram.org/bot" + BOT_TOKEN;

// Replace with your Terabox API endpoint
const TERA_API = "https://iteraplay.com/api/play.php?url=";
const API_KEY = "iTeraPlay2025";

// Replace with your deployed Vercel player domain
const PLAYER_BASE = "https://YOUR_APP_NAME.vercel.app/api/player?src=";

app.post("/", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message || !message.text) return res.sendStatus(200);

    const chatId = message.chat.id;
    const text = message.text.trim();

    if (text.includes("terabox") || text.includes("1024tera")) {
      const apiUrl = `${TERA_API}${encodeURIComponent(text)}&key=${API_KEY}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data || !data.title || !data.download_url) {
        await fetch(`${BASE_URL}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "⚠️ Unable to fetch video details. Please try again later.",
          }),
        });
        return res.sendStatus(200);
      }

      const playerLink = `${PLAYER_BASE}${encodeURIComponent(data.download_url)}`;

      const replyMarkup = {
        inline_keyboard: [
          [{ text: "▶️ Play in Browser", url: playerLink }],
          [{ text: "⬇️ Download Video", url: data.download_url }],
        ],
      };

      await fetch(`${BASE_URL}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          photo: data.thumbnail || data.thumb || "",
          caption: `🎬 *${data.title}*\n\n📦 Terabox Video Ready!`,
          parse_mode: "Markdown",
          reply_markup: replyMarkup,
        }),
      });
    } else {
      await fetch(`${BASE_URL}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "📎 Please send a valid Terabox link!",
        }),
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

export default app;
