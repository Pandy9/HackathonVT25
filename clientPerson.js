const { io } = require('socket.io-client');

const socket = io('http://localhost:8080');

let personCount = 0;

socket.on('connect', () => {
  console.log('Ansluten till servern');
});

socket.on('frame', (frame) => {
  console.log('Mottagen frame:', frame);
  
  frame.data.forEach((detection) => {
    if (detection.detection === 'person' && parseFloat(detection.confidence) > 0.8) {
      personCount++;
    }
  });

  console.log("personCount = " + personCount);
});

socket.on('done', () => {
  console.log(`Färdig! Totalt antal "person" med confidence > 0.8: ${personCount}`);
  socket.disconnect();
});