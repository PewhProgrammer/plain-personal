const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/cozy-office', express.static(path.join(__dirname, 'cozy-office/public')));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thinh's Apps</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #1a1a2e;
      color: #e8d5b7;
      font-family: 'Courier New', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
    }
    h1 {
      font-size: 28px;
      font-weight: normal;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #8a8aaa;
      font-size: 13px;
      margin-bottom: 48px;
    }
    .apps {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      max-width: 900px;
      width: 100%;
    }
    .app-card {
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 12px;
      padding: 24px;
      transition: border-color 0.2s, transform 0.2s;
      text-decoration: none;
      color: inherit;
      display: block;
    }
    .app-card:hover {
      border-color: #5a5a8a;
      transform: translateY(-2px);
    }
    .app-icon { font-size: 32px; margin-bottom: 12px; }
    .app-name {
      font-size: 16px;
      color: #e8d5b7;
      margin-bottom: 6px;
    }
    .app-desc {
      font-size: 12px;
      color: #8a8aaa;
      line-height: 1.5;
    }
    .app-tag {
      display: inline-block;
      margin-top: 12px;
      padding: 3px 10px;
      background: #2a2a4a;
      border-radius: 10px;
      font-size: 10px;
      color: #6a6a8a;
    }
    .coming-soon {
      opacity: 0.4;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <h1>thinh's apps</h1>
  <p class="subtitle">a collection of small tools and toys</p>
  <div class="apps">
    <a class="app-card" href="/cozy-office">
      <div class="app-icon">&#127968;</div>
      <div class="app-name">Cozy Office</div>
      <div class="app-desc">A 2.5D isometric office with pixel characters, pets, and weather. Watch Thinh & Bae work, play, and cuddle.</div>
      <span class="app-tag">interactive</span>
    </a>
    <div class="app-card coming-soon">
      <div class="app-icon">&#9744;</div>
      <div class="app-name">Todo List</div>
      <div class="app-desc">A simple, cozy task manager.</div>
      <span class="app-tag">coming soon</span>
    </div>
    <div class="app-card coming-soon">
      <div class="app-icon">&#128295;</div>
      <div class="app-name">More Tools</div>
      <div class="app-desc">More apps coming soon...</div>
      <span class="app-tag">coming soon</span>
    </div>
  </div>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
