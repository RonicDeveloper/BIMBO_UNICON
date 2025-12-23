
const WebSocketServer   = require('ws');
const wss               = new WebSocketServer.Server({ port: 665 })
const PrinterTcpClient  = require('./PrinterTcpClient.js')




class Printer {
    uuid            = ""
    name            = ""
    ipAddress       = ""
    port            = 0
    printerTcpClient;
  
    constructor(uuid,name,ipAddress,port){
        this.uuid               = uuid
        this.name               = name
        this.ipAddress          = ipAddress
        this.port               = port
        this.printerTcpClient   = new PrinterTcpClient(this.ipAddress,this.port)
        this.printerTcpClient.handleConnection()
    }
    getInfo(){
        return {
            uuid      : this.uuid,     
            name      : this.name,
            ipAddress : this.ipAddress,
            port      : this.port     
        }
    }

    sendCommans(data){

        console.log(data);      // data -- Arrelglo de Strings con Códigos
        return                  // Remover para mandar el paquete TCP
                                // Convertir data a ZPL y a byteArray
        var buffer  = [];       // BUFFER EN BYTES
        console.log(buffer);
        

        if(this.printerTcpClient.connected){
            
            let zpl     = Buffer.alloc(buffer.length)
            for(var i = 0; i<buffer.length ; i++){
                zpl[i] = buffer[i]
            }
            console.log(zpl)
            this.printerTcpClient.sendData(zpl)
        }
        
    }

}


var PRINTERS = [new Printer("ff0a32b7-a04a-436c-8911-2b2a221995b0","Zebra_001",'192.168.33.112',9100)];



wss.on("connection", ws => {
    console.log("[NEW CLIENT]");
    let connection = {
        inst : "CLIENT_CONNECTED"
    }

    ws.send(JSON.stringify(connection));


    sendPrinters();

    ws.on("message", data => {
        processMessage(`${data}`)
    });

    ws.on("close", () => {
        console.log("[CLIENT DISCONNECTED]");
    });
    ws.onerror = function () { 
        console.log("[ERROR]")
    }
});

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) { 
        client.send(msg);
     });
};

function sendPrinters(){
    var printers = []
    PRINTERS.forEach(printer => {
        printers.push(printer.getInfo())
    })
    let info = {
        "inst": "GET_PRINTERS",
        "printers" : printers
    }
    console.log(info)
    wss.broadcast(JSON.stringify(info));
}

function processMessage(data){
    
    let dataObject = JSON.parse(data);
    let inst = dataObject.inst;
    
    switch(inst){
        case "PRINT_DATA":
            let printData   = dataObject.data;
            let uuid        = dataObject.uuid;
            console.log(dataObject)
            PRINTERS.forEach(printer => {
                if(printer.uuid == uuid){
                    printer.sendCommans(printData)
                }
            })
            break;
        case "GET_PRINTERS":
            sendPrinters()
            break
    }
    
}

console.log("[SERVER STARTED]")