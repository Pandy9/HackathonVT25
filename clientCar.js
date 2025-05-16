const { io } = require('socket.io-client');

const socket = io('http://localhost:8080');

let carCount = 0;

socket.on('connect', () => {
  console.log('Ansluten till servern');
});

socket.on('frame', (frame) => {
  console.log('Mottagen frame:', frame);
  
  frame.data.forEach((detection) => {
    if (detection.detection === 'car' && parseFloat(detection.confidence) > 0.8) {
      carCount++;
    }
  });

  console.log("carCount = " + carCount);
});

socket.on('done', () => {
  console.log(`Färdig! Totalt antal "car" med confidence > 0.8: ${carCount}`);
  socket.disconnect();
});