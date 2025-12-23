import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../services/MainService';

import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketsClient } from '../../models/WebSocketClient';
import { EventService } from '../../models/global-events';

@Component({
  standalone: true,
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.css',
  imports: [CommonModule , AppIconModuleModule, MatIconModule],
  providers:[MainService]
})
export class TemplateViewComponent  implements OnInit, AfterViewInit{

  connected = false
  waitTimer     = null;
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
      this.initView()
    }, 500);
  }

  initView(){
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

}
