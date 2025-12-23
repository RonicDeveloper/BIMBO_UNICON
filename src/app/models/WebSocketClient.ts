import { Injectable} from '@angular/core';
import { webSocket }          from "rxjs/webSocket";
import { SystemGlobals } from './SystemGlobals';
import { EventService } from './global-events';

@Injectable()
export class WebSocketsClient {
    static WSOCKET     : any;
    static CONNECTED   : Boolean  = false;
    static retryTimer  : any;
    static CONNECTION_STATUS  : number   = 0;
    static ipAddress   : string  = "0.0.0.0";
    static uuid        : string  = "";

    static CONTROL_WSOCKET            : any;
    static CONTROL_CONNECTED          : Boolean  = false;
    static CONTROL_retryTimer         : any;
    static CONTROL_CONNECTION_STATUS  : number   = 0;

    static randomNames = [
        "JAMES",
        "JOHN",
        "ROBERT",
        "MICHAEL",
        "WILLIAM",
        "DAVID",
        "RICHARD",
        "CHARLES",
        "JOSEPH",
        "THOMAS",
        "CHRISTOPHER",
        "DANIEL",
        "PAUL",
        "MARK",
        "DONALD",
        "GEORGE"];

    static connect(){
      if(this.CONNECTED) {
        console.log("[DISCONNECTING]")
      }else{
        console.log("[CONNECTING] "+SystemGlobals.SOCKET_SERVER);
        this.WSOCKET        = webSocket(SystemGlobals.SOCKET_SERVER);  
        
        this.WSOCKET.asObservable().subscribe(
          (socketData:any) => {
            if(socketData!=null || socketData!=undefined || socketData!=""){ 
              this.onMessageArrived(socketData);     
            }
            
            this.retryTimer = null;
            this.CONNECTION_STATUS  = 2 
            if(!this.CONNECTED){
              EventService.sendEvent("WEBSOCKET_CONNECTED","WebSocketClient",{})
            }
            this.CONNECTED  = true;
          },
          (err:any) => {
            this.CONNECTED          = false;
            this.retryTimer         = setTimeout(() => {  this.CONNECTION_STATUS = 1 ; this.connect() },1000)
            this.CONNECTION_STATUS  = 0
            console.log("[CONNECTION ERROR]", err);
            EventService.sendEvent("WEBSOCKET_DISCONNECTED","WebSocketClient",{})
          },
          () => {
            console.log("[DISCONNECTED]");
            this.CONNECTED          = false;
            this.CONNECTION_STATUS  = 0
            EventService.sendEvent("WEBSOCKET_DISCONNECTED","WebSocketClient",{})
          }
      );    
      }
    }
      
    static onMessageArrived(data:any){
      let inst = data.inst;
      switch(inst){
        // case "CLIENT_WELCOME":
        //   // console.log(data)
        //   this.ipAddress   = data.ipAddress;
        //   this.uuid        = data.uuid;
        //   // this.sendMessage("CLIENT_CONNECTED", {
        //   //     ipAddress: this.ipAddress,
        //   //     uuid: this.uuid,
        //   //     deviceName: "ANGULAR : "+this.randomNames[Math.floor(Math.random() * this.randomNames.length)],
        //   //     type: "NODE"
        //   // });
        //   break;

          default :
              EventService.sendEvent("WEBSOCKET_EVENT","WebSocketClient",data)
              break
      }
    }
  
    static sendMessage(inst:any, data:any){
      this.WSOCKET.next({inst:inst,node:data})
    }

    static sendObjectMessage(data:any){
      this.WSOCKET.next(data)
    }

    static connectControl(){
      if(this.CONTROL_CONNECTED) {
        console.log("[DISCONNECTING CONTROL]") // test 
      }else{
        
        this.CONTROL_WSOCKET        = webSocket(SystemGlobals.CONTROL_SOCKET_SERVER);
       //  this.WSOCKET.binaryType = "arraybuffer";

        this.CONTROL_WSOCKET.asObservable().subscribe(
          (socketData:any) => {
           this.onControlMessageArrived(socketData); 
            this.CONTROL_CONNECTED  = true;
            this.retryTimer = null;
          },
          (err:any) => {
            this.CONTROL_CONNECTED          = false;
            this.retryTimer         = setTimeout(() => {  this.CONTROL_CONNECTION_STATUS = 1 ; this.connectControl() },1000)
            this.CONTROL_CONNECTION_STATUS  = 0
            console.log("[CONNECTION ERROR]", err);
           
          },
          () => {
            console.log("[DISCONNECTED]");
            this.CONTROL_CONNECTED          = false;
            this.CONTROL_CONNECTION_STATUS  = 0
            
          }
      );    
      }
    }

    static onControlMessageArrived(data:any){
      // console.log(data)
      let inst = data.inst;
      switch(inst){
        case "ARTNET":
          EventService.sendEvent("ARTNET_IN","WebSocketControlClient",{universe:data.universe,buffer:data.buffer})
          break;
        default :
            EventService.sendEvent("WEBSOCKET_CONTROL_EVENT","WebSocketControlClient",data)
            break;
      } 
    }

    static sendControlMessage(inst:any, data:any){
      this.CONTROL_WSOCKET.next({inst:inst,data:data})
    }

  

}