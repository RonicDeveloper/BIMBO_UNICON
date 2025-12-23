
const { exec }  = require("child_process");
const getmac    = require('getmac')
const dgram     = require('node:dgram');
const server    = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});


remoteAddress = ""
remotePort = ""

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  remoteAddress = `${rinfo.address}`;
  remotePort    = rinfo.port;

  console.log(remoteAddress,remotePort);
  processMessage(`${msg}`);
  
});

server.on('listening', () => {
  const address = server.address();
  console.log(`[SERVER LISTENINIG] ${address.address}:${address.port}`);
});


console.log("[SYSTEM CONTROL STARTED]");
server.bind(666);


function processMessage(data){
    var dataObject = JSON.parse(data)
    // console.log(dataObject)
    inst = dataObject.inst;
    switch(inst){
        case "SHUT_DOWN_DEVICE" :
            console.log("[SHUT DOWN DEVICE]");
            shutDownServer();
            break;
        case "RESTART_DEVICE" :
            restartServer();
            console.log("[RESTART DEVICE]");
            break;
        case "GET_MAC_ADDRESS":
            let data = {
                "inst" : "GET_MAC_ADDRESS",
                "macAddress"  : getMac()
            }
            server.send(JSON.stringify(data),666,remoteAddress);

            break
    }
}

function getMac(){
    return getmac.default();
}

function shutDownServer(){
    exec("cmd.exe /K shutdown /f /t 5 /s", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}




function restartServer(){
    exec("cmd.exe /K shutdown /f /t 5 /r", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`); 
    });
}


console.log("[MAC ADDRESS]       " + getMac())

//npm install -g pkg
//pkg controlServer.js --target node14-windows-x64


 let data = {
                "inst" : "GET_MAC_ADDRESS",
                "macAddress"  : getMac()
            }
            server.send(JSON.stringify(data),666,"192.168.33.120");