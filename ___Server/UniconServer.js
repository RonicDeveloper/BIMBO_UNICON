const WebSocketServer   = require('ws');
var ping = require ("net-ping"); 
//     "net-ping": "^1.2.4", on package.json
const wss               = new WebSocketServer.Server({ port: 5555 })
const dgram             = require('node:dgram');
const server            = dgram.createSocket('udp4');
const PJLink            = require('./PJLink.js');
const controlServer     = dgram.createSocket('udp4');

connected       = false;
client          = null
var DEVICES     = [];

    class DeviceData {
        id              = 0 
        idLocation      = 0
        idAttraction    = 0
        deviceType      = ""
        name            = "Device Name"
        ipAddress       = "0.0.0.0"
        macAddress      = "00:00:00:00:00:00"
        inPort          = 0
        outPort         = 0
        locationX       = 0
        locationY       = 0
        active          = false
        connectionType  = "TCP"
        status          = 0

        pjlink        = null
        pjLinkData    = {}

        constructor(id, idLocation, idAttraction, deviceType, name, ipAddress, macAddress, inPort, outPort, locationX, locationY, active, connectionType, status){
            this.id             = id
            this.idLocation     = idLocation
            this.idAttraction   = idAttraction
            this.deviceType     = deviceType
            this.name           = name
            this.ipAddress      = ipAddress
            this.macAddress     = macAddress
            this.inPort         = inPort
            this.outPort        = outPort
            this.locationX      = locationX
            this.locationY      = locationY
            this.active         = active
            this.connectionType = connectionType
            this.status         = status
       

          if(this.deviceType == "Projector"){
              this.pjlink = new PJLink(this.ipAddress, this.port,this);
          }
          this.status = 0;

         }

         updatePJLinkStatus(){
      if(this.pjLinkEnable){
        this.pjLinkStatus = this.pjlink.status;
        this.pjLinkData = {
          name:       this.pjlink.name,
          status:     this.pjlink.status,
          lamp1:      this.pjlink.lamp1,
          lamp2:      this.pjlink.lamp2,
          lamp1Hours: this.pjlink.lamp1Hours,
          lamp2Hours: this.pjlink.lamp2Hours
        }
      }
    }
    }



class Device {
    uuid          = ''
    ipAddress     = ''
    macAddress    = ''
    status        = 1
    type          = 5
    comPortEnable = false
    comPort       = 0
    pjLinkEnable  = true
    port          = 4352
    pjLinkStatus  = 3
    wolEnable     = false
    pjlink        = null
    pjLinkData    = {}

    constructor(uuid, ipAddress, macAddress, status, type, comPortEnable, comPort, pjLinkEnable, port, pjLinkStatus, wolEnable){
        this.uuid          = uuid
        this.ipAddress     = ipAddress
        this.macAddress    = macAddress
        this.status        = status
        this.type          = type
        this.comPortEnable = comPortEnable
        this.comPort       = comPort
        this.pjLinkEnable  = pjLinkEnable
        this.port          = port
        this.pjLinkStatus  = pjLinkStatus
        this.wolEnable     = wolEnable

        if(this.pjLinkEnable){
            this.pjlink = new PJLink(this.ipAddress, this.port,this);
        }
        this.status = 0;
    }

    getDeviceStatus(){
      return {
        uuid: this.uuid,
        ipAddress: this.ipAddress,
        macAddress: this.macAddress,
        status: this.status,
        type: this.type,
        comPortEnable: this.comPortEnable,
        comPort: this.comPort,
        pjLinkEnable: this.pjLinkEnable,
        port: this.port,
        pjLinkStatus: this.pjLinkStatus,
        wolEnable: this.wolEnable,
        pjLinkData: this.pjLinkData
      }
    }

    updatePJLinkStatus(){
      if(this.pjLinkEnable){
        this.pjLinkStatus = this.pjlink.status;
        this.pjLinkData = {
          name:       this.pjlink.name,
          status:     this.pjlink.status,
          lamp1:      this.pjlink.lamp1,
          lamp2:      this.pjlink.lamp2,
          lamp1Hours: this.pjlink.lamp1Hours,
          lamp2Hours: this.pjlink.lamp2Hours
        }
      }
    }



    unloadDevices(){
      switch(this.type){
        case 5:
          if(this.pjLinkEnable){
            this.pjlink.closeConnection();
          }
          break;
      }
    }
}

wss.on("connection", ws => {

    console.log("[NEW CLIENT] ");
    client    = ws;
    connected = true;
    ws.on("message", data => {
        processMessage(data);
    });

    ws.on("close", () => {
        console.log("[CLIENT DISCONNECTED] ");
        connected = false;
    });

    ws.onerror = function () {
        console.log("[ERROR]")
        connected = false;
    }

});

function startArtNet(){
  server.on('error', (err) => {
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    if(connected){
      var arrByte = Uint8Array.from(msg)
      let replay = {
        inst: "ARTNET",
        universe: arrByte[14],
        buffer:   arrByte.slice(17, arrByte.length),
      }
      client.send(JSON.stringify(replay));
      // client.send(msg);
    }
  });

  server.on('listening', () => {
    const address = server.address();
  });

  server.bind(6454);
}

function startControlServer(){
  controlServer.on('error', (err) => {
    controlServer.close();
  });

  controlServer.on('message', (msg, rinfo) => {
    processControlMessage(msg, rinfo);
  });

  controlServer.on('listening', () => {
    const address = controlServer.address();
  });

  controlServer.bind(666);
  console.log("Control Server running on port 666");
  
}


function processControlMessage(data, rinfo){
  let dataObj = JSON.parse(data);
  let inst      = dataObj.inst;
  let ipAddress = rinfo.address;
  console.log(dataObj);
  switch(inst){
    case "GET_MAC_ADDRESS":
      DEVICES.forEach( device => {
        if(device.ipAddress == ipAddress){
          device.macAddress = dataObj.macAddress;
          let data = {
            "inst" : "GET_MAC_ADDRESS",
            "device"  : device
          }
          client.send(JSON.stringify(data));
        }
      });
      break;
  }
}

function sendWOL(macAddress){
  let mac = macAddress.split(":");
  let buf = Buffer.alloc(102);
  buf.fill(0xff, 0, 6);
  for (let i = 6; i < 102; i += 6) {
    mac.forEach((val, index) => {
      buf.writeUInt8(parseInt(val, 16), i + index);
    });
  }
  
  // let done = err => {
  //   count--
  //   if (!count || err) {
  //     socket.close()
  //     clearInterval(intervalId)
  //     if (err) return reject(err)
  //     return resolve()
  //   }
  // }


  // let doSend = () => {
    
  // }

  // let socket = dgram.createSocket('udp4')
  controlServer.setBroadcast(true)
  controlServer.send(buf, 0, buf.length, 9, '192.168.0.255', function(err, bytes) {
    if (err) throw err;
    console.log('WOL packet sent to:');  
  });
  // controlServer.setBroadcast(false);
  // socket.unref()

  // socket.bind(0, from, err => {
  //   if (err) return reject(err)
  //   socket.setBroadcast(true)
  //   socket.once('error', done)
  //   doSend()
  //   intervalId = setInterval(doSend, interval)
  // })

  // controlServer.send(buf, 0, buf.length, 9, "192.168.0.255");
}

function processMessage(data){
    let dataObj = JSON.parse(data);
    console.log(dataObj);
    let inst = dataObj.inst;
    let payload = dataObj.data;

    switch(inst){
       case "LOAD_DEVICES":
          unloadDevices();
          loadDevices(payload);
          break;
        case "POWER_ON_ALL_DEVICES":
          DEVICES.forEach( device => {
            switch(device.type){
              case 1:
                sendWOL(device.macAddress);
                break
              case 5:
                if(device.pjLinkEnable){
                  device.pjlink.sendInstruction("%1POWR 1\r");
                }
              }
          });
          break;
        case "POWER_OFF_ALL_DEVICES":
          DEVICES.forEach( device => {
            switch(device.type){
              case 1:
                let data = {
                  "inst" : "SHUT_DOWN_DEVICE",
                  "uuid" : device.uuid
                }
                controlServer.send(JSON.stringify(data), 666, device.ipAddress);
                break;
              case 5:
                if(device.pjLinkEnable){
                  device.pjlink.sendInstruction("%1POWR 0\r");
                }
                break;
            }
          });
          break;
        case "RESTART_ALL_DEVICES":
          DEVICES.forEach( device => {
            switch(device.type){
              case 1:
                let data = {
                  "inst" : "RESTART_DEVICE",
                  "uuid" : device.uuid
                }
                controlServer.send(JSON.stringify(data), 666, device.ipAddress);
                break;
            }
          });
          break;
        case "POWER_ON_DEVICE":
          DEVICES.forEach( device => {
            if(device.uuid == payload){
              if(device.pjLinkEnable){
                device.pjlink.sendInstruction("%1POWR 1\r");
              }
            }
          });
          break;
        case "POWER_OFF_DEVICE":
          DEVICES.forEach( device => {
            if(device.uuid == payload){
              if(device.pjLinkEnable){
                device.pjlink.sendInstruction("%1POWR 0\r");
              }
            }
          });
          break;
        case "GET_MAC_ADDRESS":
          let data = {
            "inst" : "GET_MAC_ADDRESS",
            "macAddress"  : "00:00:00:00:00:00"
          }
          controlServer.send(JSON.stringify(data), 666, payload.ipAddress);
        break;
    }
}

function processData(data){
    console.log(data);
}

function sendStatus(){
  if(connected){
    var devices = [];
    DEVICES.forEach( device => {
      devices.push(device.getDeviceStatus());
    });

    let status = {
      inst: "DEVICE_STATUS",
      devices: devices
    }
    client.send(JSON.stringify(status));
  }
}

function unloadDevices(){
  for(let i = 0; i < DEVICES.length; i++){
    DEVICES[i].unloadDevices();
  }
  DEVICES = [];
  if(pingInterval){
    clearInterval(pingInterval);
  }
  
}

function loadDevices(data){
    data.devices.forEach( device => {
        let newDevice = new Device(device.uuid, device.ipAddress, device.macAddress, device.status, device.type, device.comPortEnable, device.comPort, device.pjLinkEnable, device.port, device.pjLinkStatus, device.wolEnable);
        DEVICES.push(newDevice)
    });
    pingReady         = true
    currentPinDevice  = 0
    pingInterval      = setInterval(pingDevice,500);
}

var pingInterval = null


console.log("Server running on port 5555");

// prj1.handleConnection();
// prj2.handleConnection();
// prj3.handleConnection();
// prj4.handleConnection();


// isOn = false

// function turnOn(){
//   if(isOn){
//     prj1.sendInstruction("%1POWR 0\r");
//     prj2.sendInstruction("%1POWR 0\r");
//     prj3.sendInstruction("%1POWR 0\r");
//     prj4.sendInstruction("%1POWR 0\r");
//   }else{
//     prj1.sendInstruction("%1POWR 1\r");
//     prj2.sendInstruction("%1POWR 1\r");
//     prj3.sendInstruction("%1POWR 1\r");
//     prj4.sendInstruction("%1POWR 1\r");
//   }
//   isOn = !isOn;
// }


// function getStatus(){
//   console.log(prj1.name,prj1.status,prj1.lamp1,prj1.lamp2,prj1.lamp1Hours,prj1.lamp2Hours);
//   console.log(prj2.name,prj2.status,prj2.lamp1,prj2.lamp2,prj2.lamp1Hours,prj2.lamp2Hours);
//   console.log(prj3.name,prj3.status,prj3.lamp1,prj3.lamp2,prj3.lamp1Hours,prj3.lamp2Hours);
//   console.log(prj4.name,prj4.status,prj4.lamp1,prj4.lamp2,prj4.lamp1Hours,prj4.lamp2Hours);
// }


var session = ping.createSession ({
  networkProtocol: ping.NetworkProtocol.IPv4,
  packetSize: 16,
  retries: 1,
  sessionId: (process.pid % 65535),
  timeout: 200,
  ttl: 64
});

var pingReady = true
var currentPinDevice = 0

function pingDevice(){
  if(!connected)      return
  if(!DEVICES.length) return
  if(!pingReady)      return

  session.pingHost (DEVICES[currentPinDevice].ipAddress, (error,target) =>  {
      if (error) {
        DEVICES[currentPinDevice].status = 0;
      }  else {
        DEVICES[currentPinDevice].status = 1;
      } 
      pingReady = true
      currentPinDevice++;
      if(currentPinDevice >= DEVICES.length){
        currentPinDevice = 0;
      }
    }
  );
}


setInterval(sendStatus,1000);
// setInterval(turnOn,20000);

startControlServer();
// startArtNet();


//npm install -g pkg
//pkg controlServer.js --target node14-windows-x64


// nodeRange (node8), node10, node12, node14, node16 or latest
// platform alpine, linux, linuxstatic, win, macos, (freebsd)
// arch x64, arm64, (armv6, armv7)

// console.log("Sending test GET MAC ADDRESS");
//  let data = {
//   "inst" : "GET_MAC_ADDRESS",
//   "macAddress"  : "00:00:00:00:00:00"
// }
// controlServer.send(JSON.stringify(data), 666, "192.168.33.120");


// let data = {
//   "inst" : "SHUT_DOWN_DEVICE",
//   "uuid" : "device.uuid"
// }
// controlServer.send(JSON.stringify(data), 666, "192.168.33.120");

// let data = {
//   "inst" : "RESTART_DEVICE",
//   "uuid" : ""
// }
// controlServer.send(JSON.stringify(data), 666, "192.168.33.120");