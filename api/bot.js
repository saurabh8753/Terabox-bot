import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = "https://api.telegram.org/bot" + BOT_TOKEN;

const TERA_API = "https://iteraplay.com/api/play.php?url=";
const API_KEY = "iTeraPlay2025";

const PLAYER_BASE = process.env.PLAYER_BASE || "https://your-domain/api/player?src=";

router.post("/", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message || !message.text) return res.sendStatus(200);

    const chatId = message.chat.id;
    const text = message.text.trim();

    if (text.includes("terabox")) {
      const apiUrl = `${TERA_API}${encodeURIComponent(text)}&key=${API_KEY}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data || !data.download_url) {
        await fetch(`${BASE_URL}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "⚠️ Unable to fetch video details.",
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

      await fetch(`${BASE_URL}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🎬 *${data.title || "Video"}*\n\n📦 Terabox Video Ready!`,
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
          text: "📎 Send a valid Terabox link!",
        }),
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Bot Error:", err);
    res.sendStatus(500);
  }
});

export default router;
