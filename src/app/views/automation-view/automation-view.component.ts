import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../services/MainService';
import { AttractionData,  Device,  DeviceData, LocationData, Site} from '../../models/Structs';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketsClient } from '../../models/WebSocketClient';
import { EventService } from '../../models/global-events';
import { webSocket }          from "rxjs/webSocket";
import { HttpClient } from '@angular/common/http';
import { SystemGlobals } from '../../models/SystemGlobals';

@Component({
  standalone: true,
  selector: 'app-automation-view',
  templateUrl: './automation-view.component.html',
  styleUrl: './automation-view.component.css',
  imports: [CommonModule , AppIconModuleModule, MatIconModule],
  providers:[MainService]
})
export class AutomationViewComponent  implements OnInit, AfterViewInit{

  connected = false
  waitTimer     = null;

  devices: Array<DeviceData> = new Array<DeviceData>()
  locations: Array<LocationData> = new Array<LocationData>()
  attractions: Array<AttractionData> = new Array<AttractionData>()


  selectedLocation: LocationData       = null
  selectedAttraction: AttractionData   = null
  selectedDevice: DeviceData           = null

  attractionCombo: Array<AttractionData> = new Array<AttractionData>();


  editLocation : Boolean = false;
  editAttraction : Boolean = false;
  editDevice : Boolean = false;
  editorActive : Boolean = false;

  constructor(private service : MainService,private http:HttpClient){ 
    
  }

   ngOnInit(){
    console.log("[WEB SOCKETS APP INIT]")
  }

  ngAfterViewInit(){
    EventService.emmiter.subscribe((data)=>{
      this.eventHandler(data)
    })
      this.waitTimer = setTimeout(() => {
      this.initView()
    }, 500);
    this.connect();
    // this.loadSettings();
  }

  initView(){
    this.getLocations();
  }



  selectLocation(id: number){
    this.sendCommand("UNLOAD_DEVICES",{})
    for(let loc of this.locations){
      if(loc.id === id){
        loc.selected = true;
        this.selectedLocation = loc
        this.selectedAttraction = null
        this.selectedDevice = null
        this.attractions = []
        this.devices = []
        this.getAttractions(loc.id);
      } else {
        loc.selected = false;
      }
    }
  }

  selectAttraction(id: number){
    for(let attr of this.attractions){ 
      if(attr.id === id){
        attr.selected = true;
        this.selectedAttraction = attr
        this.selectedDevice = null
        this.getDevices(attr.id);
      } else {
        attr.selected = false;
      }
    }
  }

  selectDevice(id: number){
    for(let dev of this.devices){
      if(dev.id === id){
        dev.selected = true;
        this.selectedDevice = dev
      } else {
        dev.selected = false;
      }
    }
  }

  getLocations(){
    var params = {
      method:"getLocations",
      active:1
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.locations = result.data;
      }
    });
  }

  getAttractions(id: number){
    var params = {
      method:"getAttractions",
      idLocation: id
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.attractions      = result.data;
        this.attractionCombo  = result.data;
      }
    });
  }

  getDevices(id: number){
    var params = {
      method:"getDevices",
      idAttraction: id
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.devices = [];
        result.data.forEach(device => {
          this.devices.push(new DeviceData( //id:number,idLocation:number,idAttraction:number,deviceType:string,name:string,ipAddress:string,macAddress:string,inPort:number,outPort:number,locationX:number,locationY:number,active:number,protocol:string
            device.id,
            device.idLocation,
            device.idAttraction,
            device.deviceType,
            device.name,
            device.ipAddress,
            device.macAddress,
            device.inPort,
            device.outPort,
            device.locationX,
            device.locationY,
            device.active,
            device.protocol
          ));
        });
        this.sendCommand("LOAD_DEVICES",this.devices)
      }
    });

  }

  createLocation(){
    if(!this.selectedLocation){
      console.error("No location selected");
      return;   
    }
  }

  updateLocation(){

  }

  deleteDevice(){

  }

  deleteAttraction(){
    
  }

  updateAttraction(){

  }

  createAttraction(){
    if(!this.selectedLocation){
      console.error("No location selected");
      return;   
    }
  }

  createDevice(){
    if(!this.selectedAttraction){
      console.error("No attraction selected");
      return;   
    }

    var params = {
      method:"createDevice",
      idLocation: this.selectedLocation.id,
      idAttraction: this.selectedAttraction.id,
      name: "New Device",
      deviceType: "Computer"
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.getDevices(this.selectedAttraction.id);
      }
    });
  }

  openEditor(type: string) {
    this.editLocation   = false;
    this.editAttraction = false;
    this.editDevice     = false;
    switch(type) {   
      case 'location':
        this.editLocation = true;
        break;
      case 'attraction':
        this.editAttraction = true;
        break;
      case 'device':
        this.editDevice = true;
        break;
    }
    this.editorActive = true;
  }
  cancelEdit(){
    this.editLocation   = false;
    this.editAttraction = false;
    this.editDevice     = false;
    this.editorActive   = false;
  }

  eventHandler(messgae:any){
    if(messgae.sender == "WebSocketClient"){
      switch(messgae.type){
       
        case "WEBSOCKET_CONNECTED":
          this.connected = true
          break;
        case "WEBSOCKET_DISCONNECTED":
          this.connected = false
          break;
        case "WEBSOCKET_EVENT":
          var data = messgae.payload;
          var inst = data.inst;
          var node = data.node;
          console.log(data)
          switch(data.inst){
            case 'TAG_EVENT':
            break;
          }
          break;
      }
    }
  }

  getAttractionCombo(target: any){
    var id = target.value;
    var params = {
      method:"getAttractions",
      idLocation: id
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.attractionCombo = result.data;
      }
    });
  }



  CONTROL_WSOCKET            : any;
  CONTROL_CONNECTED          : Boolean  = false;
  CONTROL_retryTimer         : any;
  CONTROL_CONNECTION_STATUS  : number   = 0;
  SITES         : Array<Site> = new Array<Site>()
  SELECTED_SITE : Site        = new Site("","",false,"",0,"")
  SELECTED_DEVICES : Array<Device> = new Array<Device>()


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
    var dataObj = socketData
    var inst    = dataObj.inst
    
    switch(inst){
      case "GET_MAC_ADDRESS" :
        console.log("GET_MAC_ADDRESS_RESULT",dataObj)
        this.devices.filter(d => d.id === dataObj.device.id).forEach( d => {
          d.macAddress = dataObj.device.macAddress
        })

        // for(var j=0;j<this.SELECTED_DEVICES.length;j++){
        //   if(this.SELECTED_DEVICES[j].uuid == dataObj.device.uuid){
        //     this.SELECTED_DEVICES[j].macAddress = dataObj.device.macAddress
        //     console.log("GET_MAC_ADDRESS",dataObj)
        //   }
        // }
        break;
      case "DEVICE_STATUS" :
        var devices = dataObj.devices
        devices.forEach( device => {
          this.devices.filter(d => d.id === device.id).forEach( d => {
            d.status = device.status
           
            // d.pjLinkStatus = device.pjLinkData.status
            // d.lamp1 = device.pjLinkData.lamp1
            // d.lamp2 = device.pjLinkData.lamp2
            // d.lamp1Hours = device.pjLinkData.lamp1Hours
            // d.lamp2Hours = device.pjLinkData.lamp2Hours

            if(d.deviceType == "Projector"){
              d.name = device.pjLinkData.name //+ " Power:" + device.pjLinkData.powerStatus + " Lamp:" + device.pjLinkData.lamp1Hours
            }
          })
        })

        // for(var i=0;i<devices.length;i++){
        //   var device = devices[i]
        //   console.log("DEVICE_STATUS_UPDATE",device)
          

          // for(var j=0;j<this.SELECTED_DEVICES.length;j++){
          //   if(this.SELECTED_DEVICES[j].uuid == device.uuid){
          //     this.SELECTED_DEVICES[j].status = device.status
              
          //     if(this.SELECTED_DEVICES[j].type == 5){
          //       if(this.SELECTED_DEVICES[j].pjLinkEnable){
          //         var pjLinkDta   = device.pjLinkData
          //         this.SELECTED_DEVICES[j].pjLinkData.updateData(pjLinkDta)
          //         // this.SELECTED_DEVICES[j].pjLinkData.name          = pjLinkDta.name
          //         // this.SELECTED_DEVICES[j].pjLinkData.status        = pjLinkDta.status
          //         // this.SELECTED_DEVICES[j].pjLinkData.lamp1         = pjLinkDta.lamp1
          //         // this.SELECTED_DEVICES[j].pjLinkData.lamp2         = pjLinkDta.lamp2
          //         // this.SELECTED_DEVICES[j].pjLinkData.lamp1Hours    = pjLinkDta.lamp1Hours
          //         // this.SELECTED_DEVICES[j].pjLinkData.lamp2Hours    = pjLinkDta.lamp2Hours
          //       }
          //     }
          //   }
          // }
        // }
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

  // selectDevice(uuid:string){
  //   for(var i=0;i<this.SELECTED_DEVICES.length;i++){
  //     if(this.SELECTED_DEVICES[i].uuid == uuid){
  //       this.SELECTED_DEVICES[i].selected = true //!this.SELECTED_DEVICES[i].selected
  //       // console.log("SELECTED_DEVICE",this.SELECTED_DEVICES[i])
  //     } else{
  //       this.SELECTED_DEVICES[i].selected = false
  //     }
  //   }
  // }

  sendCommand(inst:string,payload:any){
    console.log("SEND_COMMAND",inst,payload)
    this.CONTROL_WSOCKET.next({inst:inst,data:payload})
  }

  powerOnAllDevices(){
    this.sendCommand("POWER_ON_ALL_DEVICES",this.devices)
  }

  powerOffAllDevices(){
    this.sendCommand("POWER_OFF_ALL_DEVICES",this.devices)
  }

  resetAllDevices(){
    this.sendCommand("RESTART_ALL_DEVICES",this.devices)
  }

  getMacAddress(){
    this.selectedDevice.macAddress = "Retrieving..."
    this.sendCommand("GET_MAC_ADDRESS",this.selectedDevice)
  }


  powerOnDevice(){
    this.sendCommand("POWER_ON_DEVICE",this.selectedDevice)
  }

  powerOffDevice(){
    this.sendCommand("POWER_OFF_DEVICE",this.selectedDevice)
  }

  resetDevice(){
    this.sendCommand("RESTART_DEVICE",this.selectedDevice)
  }

  sendDevices(){
    this.sendCommand("LOAD_DEVICES",this.devices)
  }


  runCommand(){
    this.CONTROL_WSOCKET.next({inst:"RUN_COMMAND",data:{
      ipAddress:this.selectedDevice.ipAddress,
      command:"C:\\RONIC\\BimboRunner.lnk"}})
  }

}
