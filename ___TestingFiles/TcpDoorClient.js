const net = require('net');

class TcpDoorClient {
  constructor({
    name,
    host,
    port,
    reconnectDelay  = 5000,
    pingInterval    = 60000,
    pingBuffer      = Buffer.from([0x01, 0x10, 0x03]),
    onData          = null
  }) {
    this.name = name;
    this.host = host;
    this.port = port;

    this.reconnectDelay     = reconnectDelay;
    this.pingInterval       = pingInterval;
    this.pingBuffer         = pingBuffer;
    this.onData             = onData;
    this.socket             = null;
    this.isConnected        = false;
    this.isConnecting       = false;
    this.pingTimer          = null;
    this.reconnectTimer     = null;
  }

  log(...args) {
    console.log(`[${this.name}]`, ...args);
  }

  error(...args) {
    console.error(`[${this.name}]`, ...args);
  }

  start() {
    this.connect();
  }

  connect() {
    if (this.isConnected || this.isConnecting) return;

    this.isConnecting = true;
    this.log(`Trying to connect to ${this.host}:${this.port}`);

    const socket = new net.Socket();
    this.socket = socket;

    socket.setTimeout(120000);

    socket.connect(this.port, this.host, () => {
      this.isConnecting = false;
      this.isConnected = true;

      this.log('Connected');
      this.stopReconnect();
      this.startPing();
    });

    socket.on('data', (data) => {
      if (this.onData) {
        this.onData(data, this);
      }
    });

    socket.on('timeout', () => {
      this.error('Socket timeout');
      this.handleDisconnect();
    });

    socket.on('close', () => {
      this.log('Connection closed');
      this.handleDisconnect();
    });

    socket.on('error', (err) => {
      this.error('Connection error:', err.message);
      this.handleDisconnect();
    });
  }

  startPing() {
    this.stopPing();

    this.pingTimer = setInterval(() => {
      if (!this.isConnected || !this.socket) return;

      try {
        this.socket.write(this.pingBuffer);
        this.log('PING sent');
      } catch (e) {
        this.error('PING failed:', e.message);
        this.handleDisconnect();
      }
    }, this.pingInterval);
  }

  stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setInterval(() => {
      if (!this.isConnected && !this.isConnecting) {
        this.connect();
      }
    }, this.reconnectDelay);
  }

  stopReconnect() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  handleDisconnect() {
    if (!this.isConnected && !this.isConnecting) {
      this.scheduleReconnect();
      return;
    }

    this.isConnected = false;
    this.isConnecting = false;

    this.stopPing();

    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }

    this.scheduleReconnect();
  }

  send(buffer) {
    if (!this.isConnected || !this.socket) {
      this.error('Send failed: not connected');
      return false;
    }

    try {
      this.socket.write(buffer);
      console.log('Sent:', buffer);
      return true;
    } catch (e) {
      this.error('Send error:', e.message);
      this.handleDisconnect();
      return false;
    }
  }

  stop() {
    this.stopPing();
    this.stopReconnect();
    this.isConnected = false;
    this.isConnecting = false;

    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }

    this.log('Stopped');
  }
}

module.exports = TcpDoorClient;
