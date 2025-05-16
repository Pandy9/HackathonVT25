const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*', // tillåt alla (ändra detta i produktion)
  }
});

// Läs frames från JSON
const framesPath = path.join(__dirname, '/vt25/file.json');
let frames = [];

try {
  frames = JSON.parse(fs.readFileSync(framesPath, 'utf8'));
  console.log(`Läste in ${frames.length} frames`);
} catch (err) {
  console.error('Kunde inte läsa frames.json:', err);
}

io.on('connection', (socket) => {
  console.log('Klient ansluten:', socket.id);

  let index = 0;

  const intervalId = setInterval(() => {
    if (index >= frames.length) {
      socket.emit('done');
      clearInterval(intervalId);
      return;
    }

    socket.emit('frame', frames[index]);
    index++;
  }, 20);

  socket.on('disconnect', () => {
    clearInterval(intervalId);
    console.log('Klient frånkopplad:', socket.id);
  });
});

server.listen(8080, () => {
  console.log('Socket.IO-server körs på http://localhost:8080');
});