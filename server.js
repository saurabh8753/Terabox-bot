import express from "express";
import botRouter from "./api/bot.js";

const app = express();
app.use(express.json());

// Telegram bot endpoint
app.use("/api/bot", botRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Terabox Bot Server Running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
