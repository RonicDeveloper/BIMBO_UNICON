import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../services/MainService';
// import { Node, NodeProperty, TagNotification } from '../../models/Structs';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
// import { WebSocketsClient } from '../../models/WebSocketClient';
import { EventService } from '../../models/global-events';

@Component({
  standalone: true,
  selector: 'app-admin-view',
  imports: [CommonModule , AppIconModuleModule, MatIconModule],
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.css',
  providers:[MainService]
})


export class AdminViewComponent  implements OnInit, AfterViewInit{

  connected     = false
  consoleOutput = "";
  consoleHeader = "";
  waitTimer     = null;
  serverActive  = false;

  services = [
    {value: 'UniconServer', viewValue: 'Unicon Server'},
    {value: 'TagServer', viewValue: 'Tag Service'},
    {value: 'MediaServer', viewValue: 'Media Server'},
    {value: 'POSControl', viewValue: 'POS Service'},
    {value: 'SurveyServer', viewValue: 'Survey Server'},
    {value: 'accessControl', viewValue: 'Access Service'}
    
  ];
  
  selectedService = "UniconServer";

  constructor(private service : MainService){  
    
  }

   ngOnInit(){
    console.log("[WEB SOCKETS APP INIT]") 
  }

  ngAfterViewInit(){
    EventService.emmiter.subscribe((data)=>{
      this.eventHandler(data)
    })
    this.waitTimer = setTimeout(() => {
      this.serverControl("status")
    }, 500);
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

  

  serverControl(action:string){
    let params = {
        action:action,
        service:this.selectedService
    }
    this.service.mainService(params,"ControlService").subscribe((result: any) =>  { 
          this.consoleHeader = result.data.status.header;
          this.consoleOutput = result.data.status.output;
          this.serverActive  = result.data.status.active;
      });
  }

  chanegeService(event:any){
    this.selectedService = event.target.value;
    console.log(event)
    this.serverControl("status")
  }

}
