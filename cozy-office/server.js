const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const os = require('os');
const path = require('path');
const url = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

// Identity config - server host = boy, everyone else = girl
const HOST_NAME = 'Thinh';
const GUEST_NAME = 'Bae';

app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store');
  }
}));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();
const users = new Map(); // ws -> { name, role }
let workoutActive = false; // server-side workout state for new client sync

function getIdentity(reqUrl) {
  const params = new url.URL(reqUrl, 'http://localhost').searchParams;
  if (params.get('role') === 'boy') {
    return { name: HOST_NAME, role: 'boy' };
  }
  return { name: GUEST_NAME, role: 'girl' };
}

function broadcast(payload) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastUsers() {
  const names = [...new Set([...users.values()].map(u => u.name))];
  broadcast(JSON.stringify({ type: 'users', names, count: names.length }));
}

wss.on('connection', (ws, req) => {
  const identity = getIdentity(req.url);

  clients.add(ws);
  users.set(ws, identity);

  // Send identity to this client
  ws.send(JSON.stringify({ type: 'identity', name: identity.name, role: identity.role, workoutActive }));

  // Broadcast join
  broadcast(JSON.stringify({ type: 'join', name: identity.name }));
  broadcastUsers();

  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }

    const user = users.get(ws);
    if (!user) return;

    if (msg.type === 'cuddle') {
      broadcast(JSON.stringify({ type: 'cuddle', name: user.name }));
    } else if (msg.type === 'workout') {
      workoutActive = !!msg.active;
      broadcast(JSON.stringify({ type: 'workout', name: user.name, active: workoutActive }));
    } else if (msg.text) {
      broadcast(JSON.stringify({ type: 'chat', name: user.name, text: msg.text }));
    }
  });

  ws.on('close', () => {
    const user = users.get(ws);
    users.delete(ws);
    clients.delete(ws);
    if (user) {
      // Reset workout if the boy disconnects while working out
      if (user.role === 'boy' && workoutActive) {
        workoutActive = false;
        broadcast(JSON.stringify({ type: 'workout', name: user.name, active: false }));
      }
      broadcast(JSON.stringify({ type: 'leave', name: user.name }));
      broadcastUsers();
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
        break;
      }
    }
  }
  console.log(`\n  Cozy Office is running!\n`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${localIP}:${PORT}\n`);
  console.log(`  Share the Network URL with your girlfriend!\n`);
});
