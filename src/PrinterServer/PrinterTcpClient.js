const Net       = require('net');
'use strict';


module.exports = class  PrinterTcpClient {
    port        = 0;
    host        = '';
    client      = new Net.Socket();
    connected   = false;

    constructor(host,port){
        this.port       = port;
        this.host       = host;
        this.connect    = false;
        this.client.on('connect', function(frame) {
            console.log("[CONNECTED]");
            this.connected = true;
        });
        
        this.client.on('end', function() {
            console.log("[DISCONNECTED]");
            this.connected = false;
        });
        
        this.client.on('error', function(error) {
            console.log(error);
        });
        
        this.client.on('data', (data) => {
           this.processData(data)
        });


    }

    sendData(data){

        
        this.client.write(data, () => {
            console.log("DATOS ENVIADOS A IMPRESORA");
        })
    }

    processData(data){
        console.log(`${data}`);
    }

    handleConnection(){
        if(!this.client.connected){
            this.client.connect({ port: this.port, host: this.host }, function() {});
        }else{
            this.client.end();
        }
    }

}