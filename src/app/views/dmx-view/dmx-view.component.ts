import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../models/global-events';
import { webSocket }          from "rxjs/webSocket";
import { SystemGlobals } from '../../models/SystemGlobals';


@Component({
  selector: 'app-dmx-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dmx-view.component.html',
  styleUrl: './dmx-view.component.css'
})


export class DmxViewComponent {
  DMX_BUFFER      = new Uint8Array(512)
  DMX_BUFFER_SIZE = 512


   WSOCKET     : any;
   CONNECTED   : Boolean  = false;
   retryTimer  : any;
   CONNECTION_STATUS  : number   = 0;
   ipAddress   : string  = "0.0.0.0";
   uuid        : string  = "";


  constructor(){
    this.DMX_BUFFER.fill(0);
    // for(var i = 0;i<512;i++){
    //   this.DMX_BUFFER[i] = (Math.floor(Math.random() * 255));  
    // }
  }

  ngOnInit(): void {
    console.log("DMX_VIEW_COMPONENT")
    EventService.emmiter.subscribe((data)=>{
      this.eventHandler(data)
    })
    
  }

  ngAfterViewInit(): void {
    // this.connect()
  }


 connect(){
         if(this.CONNECTED) {
           console.log("[DISCONNECTING]")
         }else{
           
           this.WSOCKET        = webSocket({url:"ws://192.168.0.21:5555",binaryType:'arraybuffer',  deserializer: ({ data }) => data});
          //  this.WSOCKET.binaryType = "arraybuffer";

           this.WSOCKET.asObservable().subscribe(
             (socketData:any) => {
              this.onMessageArrived(socketData);
               this.CONNECTED  = true;
               this.retryTimer = null;
             },
             (err:any) => {
               this.CONNECTED          = false;
               this.retryTimer         = setTimeout(() => {  this.CONNECTION_STATUS = 1 ; this.connect() },1000)
               this.CONNECTION_STATUS  = 0
               console.log("[CONNECTION ERROR]", err);
              
             },
             () => {
               console.log("[DISCONNECTED]");
               this.CONNECTED          = false;
               this.CONNECTION_STATUS  = 0
               
             }
         );    
         }
       }
         
       onMessageArrived(data:ArrayBuffer){
        var buffer = new Uint8Array(data.slice(18,530));
        this.DMX_BUFFER = buffer;
       }
     
       sendMessage(inst:any, data:any){
         this.WSOCKET.next({inst:inst,node:data})
       }

  eventHandler(data:any){
    // console.log("DMX_VIEW_COMPONENT",data)
    switch(data.type){
      case "ARTNET_IN":
        var universe = data.payload.universe;
        var buffer   = data.payload.buffer;
        var props = Object.keys(buffer).map(key => ({type: key, value: buffer[key]}));
        props.forEach((prop : any) => {
          this.DMX_BUFFER[prop.type] = prop.value;
        });
        break;

    }
  }

  updateDmxBuffer(data:any){
    this.DMX_BUFFER = data
  }

  

}
 