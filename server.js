const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Läs in frames en gång vid serverstart
const framesPath = path.join(__dirname, '/vt25/file.json');
const frames = JSON.parse(fs.readFileSync(framesPath, 'utf8'));

wss.on('connection', (ws) => {
  console.log('Ny klient ansluten');

  let index = 0;

  const intervalId = setInterval(() => {
    if (index >= frames.length) {
      clearInterval(intervalId);
      ws.send(JSON.stringify({ done: true }));
      return;
    }

    const frame = frames[index];
    ws.send(JSON.stringify(frame));
    index++;
  }, 1000);

  // Avsluta när klienten kopplar från
  ws.on('close', () => {
    clearInterval(intervalId);
    console.log('Klient frånkopplad');
  });
});

server.listen(8080, () => {
  console.log('WebSocket-server körs på ws://localhost:8080');
});