import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Site,Device } from '../../models/Structs';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketsClient } from '../../models/WebSocketClient';
import { EventService } from '../../models/global-events';
import { View } from 'electron';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { webSocket }          from "rxjs/webSocket";
import { SystemGlobals } from '../../models/SystemGlobals';

@Component({
  selector: 'app-system-view',
  standalone: true,
  imports: [CommonModule,AppIconModuleModule, MatIconModule,CdkDrag],
  templateUrl: './system-view.component.html',
  styleUrl: './system-view.component.css'
})

export class SystemViewComponent {

  @ViewChild('DevicesCanvas') devicesCanvasRef: ElementRef;
  devicesCanvas! : HTMLElement;

  SITES         : Array<Site> = new Array<Site>()
  SELECTED_SITE : Site        = new Site("","",false,"",0,"")
  SELECTED_DEVICES : Array<Device> = new Array<Device>()

  
  CONTROL_WSOCKET            : any;
  CONTROL_CONNECTED          : Boolean  = false;
  CONTROL_retryTimer         : any;
  CONTROL_CONNECTION_STATUS  : number   = 0;

  constructor(private http:HttpClient){
    
  }

  ngOnInit(): void {
    console.log("SYSTEM_VIEW_COMPONENT")
  }

  ngAfterViewInit(): void {
      this.loadSettings()
      EventService.emmiter.subscribe((data)=>{ 
        this.eventHandler(data)
      })
      this.connect();
  }


  
  connect(){
        if(this.CONTROL_CONNECTED) {
          console.log("[DISCONNECTING]")
        }else{
          console.log("[CONNECTING] "+SystemGlobals.CONTROL_SOCKET_SERVER);
          this.CONTROL_WSOCKET        = webSocket(SystemGlobals.CONTROL_SOCKET_SERVER);  
          
          this.CONTROL_WSOCKET.asObservable().subscribe(
            (socketData:any) => {
              if(socketData!=null || socketData!=undefined || socketData!=""){ 
                this.onMessageArrived(socketData);     
              }
              
              this.CONTROL_retryTimer = null;
              this.CONTROL_CONNECTION_STATUS  = 2 
              if(!this.CONTROL_CONNECTED){
                EventService.sendEvent("WEBSOCKET_CONNECTED","WebSocketClient",{})
                this.loadSettings()
              }
              this.CONTROL_CONNECTED  = true;
            },
            (err:any) => {
              this.CONTROL_CONNECTED          = false;
              this.CONTROL_retryTimer         = setTimeout(() => {  this.CONTROL_CONNECTION_STATUS = 1 ; this.connect() },1000)
              this.CONTROL_CONNECTION_STATUS  = 0
              console.log("[CONNECTION ERROR]", err);
              EventService.sendEvent("WEBSOCKET_DISCONNECTED","WebSocketClient",{})
            },
            () => {
              console.log("[DISCONNECTED]");
              this.CONTROL_CONNECTED          = false;
              this.CONTROL_CONNECTION_STATUS  = 0
              EventService.sendEvent("WEBSOCKET_DISCONNECTED","WebSocketClient",{})
            }
        );    
        }
      }



onMessageArrived(socketData){
  // console.log("CONTROL_SOCKET_DATA",socketData);

        var dataObj = socketData
        var inst    = dataObj.inst
          
          switch(inst){
            case "GET_MAC_ADDRESS" :
              for(var j=0;j<this.SELECTED_DEVICES.length;j++){
                if(this.SELECTED_DEVICES[j].uuid == dataObj.device.uuid){
                  this.SELECTED_DEVICES[j].macAddress = dataObj.device.macAddress
                  console.log("GET_MAC_ADDRESS",dataObj)
                }
              }
              break;
            case "DEVICE_STATUS" :
              var devices = dataObj.devices
              for(var i=0;i<devices.length;i++){
                var device = devices[i]
                // console.log("DEVICE_STATUS_UPDATE",device)
                for(var j=0;j<this.SELECTED_DEVICES.length;j++){
                  if(this.SELECTED_DEVICES[j].uuid == device.uuid){
                    this.SELECTED_DEVICES[j].status = device.status
                    
                    if(this.SELECTED_DEVICES[j].type == 5){
                      if(this.SELECTED_DEVICES[j].pjLinkEnable){
                        var pjLinkDta   = device.pjLinkData
                        this.SELECTED_DEVICES[j].pjLinkData.updateData(pjLinkDta)
                        // this.SELECTED_DEVICES[j].pjLinkData.name          = pjLinkDta.name
                        // this.SELECTED_DEVICES[j].pjLinkData.status        = pjLinkDta.status
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp1         = pjLinkDta.lamp1
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp2         = pjLinkDta.lamp2
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp1Hours    = pjLinkDta.lamp1Hours
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp2Hours    = pjLinkDta.lamp2Hours
                      }
                   }
                }
              }
            }
            
              break;
            }
          



}


  eventHandler(data:any){

    switch(data.type){
        case "WEBSOCKET_CONTROL_EVENT"  :
          var dataObj = data.payload
          var inst    = dataObj.inst
          
          switch(inst){
            case "GET_MAC_ADDRESS" :
              for(var j=0;j<this.SELECTED_DEVICES.length;j++){
                if(this.SELECTED_DEVICES[j].uuid == dataObj.device.uuid){
                  this.SELECTED_DEVICES[j].macAddress = dataObj.device.macAddress
                  console.log("GET_MAC_ADDRESS",dataObj)
                }
              }
              break;
            case "DEVICE_STATUS" :
              var devices = dataObj.devices
              for(var i=0;i<devices.length;i++){
                var device = devices[i]
                
                for(var j=0;j<this.SELECTED_DEVICES.length;j++){
                  if(this.SELECTED_DEVICES[j].uuid == device.uuid){
                    this.SELECTED_DEVICES[j].status = device.status
                    
                    if(this.SELECTED_DEVICES[j].type == 5){
                      if(this.SELECTED_DEVICES[j].pjLinkEnable){
                        var pjLinkDta   = device.pjLinkData
                        this.SELECTED_DEVICES[j].pjLinkData.updateData(pjLinkDta)
                        // this.SELECTED_DEVICES[j].pjLinkData.name          = pjLinkDta.name
                        // this.SELECTED_DEVICES[j].pjLinkData.status        = pjLinkDta.status
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp1         = pjLinkDta.lamp1
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp2         = pjLinkDta.lamp2
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp1Hours    = pjLinkDta.lamp1Hours
                        // this.SELECTED_DEVICES[j].pjLinkData.lamp2Hours    = pjLinkDta.lamp2Hours
                      }
                   }
                }
              }
            }
            
              break;
            }
          break;
            
          }
  }
  

  async loadSettings(){
    var data : any              = await this.http.get("___Config/sites.json").toPromise()
    for(var i=0;i<data.length;i++){
      var site = new Site(data[i].uuid,data[i].name,data[i].useWebSockets,data[i].wsAddress,data[i].wsPort,data[i].floorPlan)
      for(var j=0;j<data[i].devices.length;j++){
        var device = data[i].devices[j]
        site.devices.push(new Device(device.uuid,device.name,device.ipAddress,device.macAddress,device.icon,device.status,device.type,device.comPortEnable,device.comPort,device.pjLinkEnable,device.port,device.pjLinkStatus,device.wolEnable,device.x,device.y))
      }
      this.SITES.push(site)
    }
    this.selectSite(0)
    
  }
  

  selectSite(siteIndex:number){
    this.SELECTED_SITE    = this.SITES[siteIndex]
    this.SELECTED_DEVICES = this.SELECTED_SITE.devices
    this.sendCommand("LOAD_DEVICES",this.SELECTED_SITE)
  }

  selectDevice(uuid:string){
    for(var i=0;i<this.SELECTED_DEVICES.length;i++){
      if(this.SELECTED_DEVICES[i].uuid == uuid){
        this.SELECTED_DEVICES[i].selected = true //!this.SELECTED_DEVICES[i].selected
        // console.log("SELECTED_DEVICE",this.SELECTED_DEVICES[i])
      } else{
        this.SELECTED_DEVICES[i].selected = false
      }
    }
  }

  sendCommand(inst:string,payload:any){
    console.log("SEND_COMMAND",inst,payload)
    this.CONTROL_WSOCKET.next({inst:inst,data:payload})
    // WebSocketsClient.sendControlMessage(inst,payload)
  }

  powerOnAllDevices(){
    this.sendCommand("POWER_ON_ALL_DEVICES",{})
  }

  powerOffAllDevices(){
    this.sendCommand("POWER_OFF_ALL_DEVICES",{})
  }

  resetAllDevices(){
    this.sendCommand("RESTART_ALL_DEVICES",{})
  }

  getMacAddress(){
    for(var i=0;i<this.SELECTED_DEVICES.length;i++){
      if(this.SELECTED_DEVICES[i].selected){
        this.sendCommand("GET_MAC_ADDRESS",{ipAddress:this.SELECTED_DEVICES[i].ipAddress})
      }
    }
  }



  startDrag(event: any,uuid:string){
 
  }

  drag(event: any,device:Device){
    //event.source.element.nativeElement.style.left
    console.log("DRAG",event);
  }

  endDrag(event: any){

  }



    
}



