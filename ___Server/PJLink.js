
const Net       = require('net');

'use strict';

module.exports = class  PJLink {
    port        = 0;
    host        = '';
    client      = new Net.Socket();
    name        = '';
    connected   = false;
    lamp1       = 0;
    lamp1Hours  = 0;
    lamp2Hours  = 0;
    lamp2       = 0;
    status      = 0;
    parent      = null;
    
    constructor(host,port,parent){
        this.port       = port;
        this.host       = host;
        this.connect    = false;
        this.parent     = parent;

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

        setTimeout(() => {
            this.handleConnection();
        }, 1000);

        if(this.port == 4200){
            setInterval(() => {
                this.getStatus();
            }
            , 1000);
        }
    }

    processData(data){
        if(this.port == 4200 ){
            if(data.length == 9){
                this.status = parseInt(data[7]);
            }
        } else {
            let str     = data.toString().split("\r");
            for(let i = 0; i < str.length; i++){
                let command = str[i].split("=")[0];
                let value   = str[i].split("=")[1];
                switch(command){
                    case "%1NAME":
                        this.name = value;
                        break;
                    case "%1POWR":
                        this.status = value;
                        break;
                    case "%1LAMP":
                        this.lamp1Hours     = value.split(" ")[0];
                        this.lamp1          = value.split(" ")[1];
                        this.lamp2Hours     = value.split(" ")[2];
                        this.lamp2          = value.split(" ")[3];
                        break;
                }
            }
            
           
        }
        if(this.parent){
            this.parent.updatePJLinkStatus();
        }
    }

    handleConnection(){
        if(!this.client.connected){
            this.client.connect(this.port, this.host);
        }else{
            this.client.end();
        }
    }

    closeConnection(){
        this.client.end();
    }

    sendInstruction(instruction){
        if(this.port == 4200 ){
            var buffer =  Buffer.alloc(10);
            buffer.fill(0);
            let powerOn  = [0x06,0x14,0x00,0x04,0x00,0x34,0x11,0x00,0x00,0x5D]
            let powerOff = [0x06,0x14,0x00,0x04,0x00,0x34,0x11,0x01,0x00,0x5E]
            
            if(instruction == "%1POWR 1\r"){
                for(let i = 0; i < powerOn.length; i++){
                    buffer[i] = powerOn[i];
                }
            }else{
                for(let i = 0; i < powerOff.length; i++){
                    buffer[i] = powerOff[i];
                }
            }
            this.client.write(buffer);
        } else{
            this.client.write(instruction);
        }
    }

    getStatus(){
        let statusBuffer = [0x07,0x14,0x00,0x05,0x00,0x34,0x00,0x00,0x11,0x00,0x5E];
        var buffer =  Buffer.alloc(11);
        buffer.fill(0);
        for(let i = 0; i < statusBuffer.length; i++){
            buffer[i] = statusBuffer[i];
        }
        this.client.write(buffer);
    }
}

// 6k1_5u9gV