const { io } = require('socket.io-client');

const socket = io('http://localhost:8080');

let personCount = 0;

socket.on('connect', () => {
  console.log('Ansluten till servern');
});

socket.on('frame', (frame) => {
  console.log('Mottagen frame:', frame);

  if (frame.object === 'person' && frame.confidence > 0.8) {
    personCount++;
  }
});

socket.on('done', () => {
  console.log(`Färdig! Totalt antal "person" med confidence > 0.8: ${personCount}`);
  socket.disconnect();
});