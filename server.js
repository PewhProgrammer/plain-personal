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
    html, body { height: 100%; overflow: hidden; }
    body {
      background: #1a1a2e;
      color: #e8d5b7;
      font-family: 'Courier New', monospace;
      display: flex;
      flex-direction: column;
    }

    /* ── Nav Bar ──────────────────────────── */
    nav {
      height: 44px;
      min-height: 44px;
      background: #16213e;
      border-bottom: 1px solid #2a2a4a;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 4px;
      z-index: 100;
    }
    .nav-brand {
      color: #e8d5b7;
      font-size: 13px;
      letter-spacing: 1px;
      margin-right: 20px;
      cursor: pointer;
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .nav-brand:hover { opacity: 1; }
    .nav-sep {
      width: 1px;
      height: 20px;
      background: #2a2a4a;
      margin-right: 12px;
    }
    .nav-item {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      color: #8a8aaa;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-item:hover { background: #1a1a3e; color: #c8c8e8; }
    .nav-item.active { background: #2a2a4a; color: #e8d5b7; }
    .nav-item.disabled { opacity: 0.3; pointer-events: none; }
    .nav-icon { font-size: 14px; }

    /* ── Content Area ────────────────────── */
    #content { flex: 1; position: relative; }

    #home {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      overflow-y: auto;
    }
    #home h1 {
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
      cursor: pointer;
    }
    .app-card:hover {
      border-color: #5a5a8a;
      transform: translateY(-2px);
    }
    .app-icon { font-size: 32px; margin-bottom: 12px; }
    .app-name { font-size: 16px; color: #e8d5b7; margin-bottom: 6px; }
    .app-desc { font-size: 12px; color: #8a8aaa; line-height: 1.5; }
    .app-tag {
      display: inline-block;
      margin-top: 12px;
      padding: 3px 10px;
      background: #2a2a4a;
      border-radius: 10px;
      font-size: 10px;
      color: #6a6a8a;
    }
    .coming-soon { opacity: 0.4; pointer-events: none; }

    #app-frame {
      width: 100%;
      height: 100%;
      border: none;
      display: none;
      position: absolute;
      top: 0; left: 0;
    }

    @media (max-width: 600px) {
      .nav-brand { margin-right: 8px; font-size: 12px; }
      .nav-item { padding: 6px 10px; font-size: 11px; }
    }
  </style>
</head>
<body>
  <nav>
    <a class="nav-brand" onclick="showHome()">thinh's apps</a>
    <div class="nav-sep"></div>
    <a class="nav-item" data-app="/cozy-office" onclick="openApp(this)">
      <span class="nav-icon">&#127968;</span> Cozy Office
    </a>
    <a class="nav-item disabled">
      <span class="nav-icon">&#9744;</span> Todo List
    </a>
    <a class="nav-item disabled">
      <span class="nav-icon">&#128295;</span> More Tools
    </a>
  </nav>

  <div id="content">
    <div id="home">
      <h1>thinh's apps</h1>
      <p class="subtitle">a collection of small tools and toys</p>
      <div class="apps">
        <a class="app-card" onclick="openApp(document.querySelector('[data-app=&quot;/cozy-office&quot;]'))">
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
    </div>
    <iframe id="app-frame"></iframe>
  </div>

  <script>
    function openApp(navItem) {
      const appPath = navItem.getAttribute('data-app');
      if (!appPath) return;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      navItem.classList.add('active');
      document.getElementById('home').style.display = 'none';
      const frame = document.getElementById('app-frame');
      frame.style.display = 'block';
      if (frame.src !== location.origin + appPath + '/') {
        frame.src = appPath;
      }
    }

    function showHome() {
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      document.getElementById('home').style.display = '';
      document.getElementById('app-frame').style.display = 'none';
    }
  </script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
