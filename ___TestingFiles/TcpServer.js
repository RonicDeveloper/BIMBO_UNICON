const net = require('net');

const server = net.createServer(socket => {
  console.log('Client connected:', socket.remoteAddress, socket.remotePort);

  socket.on('data', data => {
    console.log('TCP data from client:', data);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.write('Hello from TCP server!\n');
});

// IMPORTANTE: 0.0.0.0 para aceptar conexiones desde la red
server.listen(4205, '0.0.0.0', () => {
  console.log('TCP server listening on 0.0.0.0:4205');
});