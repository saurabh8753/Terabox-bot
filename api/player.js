export default async function handler(req, res) {
  const src = req.query.src;
  if (!src) return res.status(400).send("Missing video source");

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Terabox Video Player</title>
  <link href="https://vjs.zencdn.net/8.5.3/video-js.css" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      background: #000;
      color: #fff;
      font-family: "Poppins", sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      min-height: 100vh;
      overflow-x: hidden;
    }

    header {
      width: 100%;
      text-align: center;
      padding: 10px;
      font-weight: 600;
      font-size: 18px;
      background: #0f0f0f;
      color: #00ffae;
      box-shadow: 0 2px 10px rgba(0,255,174,0.2);
    }

    video {
      width: 95%;
      max-width: 900px;
      border-radius: 12px;
      margin-top: 15px;
      box-shadow: 0 0 25px rgba(0,255,174,0.3);
    }

    .download-btn {
      margin: 16px 0;
      background: linear-gradient(90deg, #00ffae, #007bff);
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
    }

    .download-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px #00ffae;
    }

    .ad-slot {
      width: 100%;
      max-width: 728px;
      margin: 10px auto;
      text-align: center;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 6px 0;
    }

    footer {
      color: #888;
      font-size: 13px;
      margin-top: auto;
      padding: 12px;
      text-align: center;
    }

    @media (max-width: 600px) {
      video { width: 98%; }
      .download-btn { font-size: 14px; padding: 10px 18px; }
      .ad-slot { max-width: 320px; }
    }
  </style>
</head>
<body>
  <header>🎬 Terabox Player</header>

  <!-- 🔝 Top Ad Slot -->
  <div class="ad-slot" id="ad-top">
    <!-- 🪧 Paste your Adsterra top banner script here -->
  </div>

  <!-- 🎥 Video Player -->
  <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto">
    <source src="${src}" type="video/mp4" />
    Your browser does not support HTML5 video.
  </video>

  <!-- ⬇️ Download Button -->
  <a href="${src}" target="_blank" download>
    <button class="download-btn">⬇️ Download Video</button>
  </a>

  <!-- 🔚 Bottom Ad Slot -->
  <div class="ad-slot" id="ad-bottom">
    <!-- 🪧 Paste your Adsterra bottom banner script here -->
  </div>

  <footer>© 2025 Terabox Player Bot | Powered by Vercel</footer>

  <script src="https://vjs.zencdn.net/8.5.3/video.min.js"></script>
  <script>const player = videojs("my-video");</script>
</body>
</html>
`);
      }
