const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');

let personCount = 0;

socket.on('open', () => {
  console.log('Ansluten till servern');
});

socket.on('message', (data) => {
  const frame = JSON.parse(data);

  // Om det är en riktig frame, inte en "done"-signal
  if (frame.object && frame.confidence) {
    if (frame.object === 'person' && frame.confidence > 0.8) {
      personCount++;
    }

    console.log(`Mottagen frame: ${frame.object} (${frame.confidence})`);
  } else if (frame.done) {
    console.log('Alla frames mottagna');
    console.log(`Totalt antal "person" med confidence > 0.8: ${personCount}`);
  }
});

socket.on('close', () => {
  console.log('Servern stängde anslutningen');
});