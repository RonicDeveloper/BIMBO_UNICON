import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../../services/MainService';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketsClient } from '../../../models/WebSocketClient';
import { EventService } from '../../../models/global-events';
import { TagData } from '../sales-view/sales-view.component';
import { AttractionData } from '../../../models/Structs';

@Component({
  standalone: true,
  selector: 'app-tags-view',
  templateUrl: './tags-view.component.html',
  styleUrl: './tags-view.component.css',
  imports: [CommonModule , AppIconModuleModule, MatIconModule],
  providers:[MainService]
})
export class TagsViewComponent  implements OnInit, AfterViewInit{

connected = false
waitTimer     = null;
tags : Array<TagData> = []
selectedTag : TagData | null = null;

attractions: Array<AttractionData> = new Array<AttractionData>()
selectedAttraction: AttractionData   = null
connectedAttraction: AttractionData   = null


clientUUID      = "";
clientIpAddress = "";
attractionCode  = "";
outEvent        = "";
inputEvent      = "";
seeAllNotifications = false;
 viewActive    = false;

  constructor(private service : MainService){ 
    
  }

   ngOnInit(){
    console.log("[WEB SOCKETS APP INIT]")
  }

  ngAfterViewInit(){
    this.viewActive = true;
    EventService.emmiter.subscribe((data)=>{
      this.eventHandler(data)
    })
      this.waitTimer = setTimeout(() => {
      this.initView()
    }, 500);
  }

  initView(){
    this.getTags();
    this.getAttractions(0);
  }

  getTags(){
    var params = {
      method:"getTags",
      random:100
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.tags = result.data;
      }
    });
  }

  selectTag(tagId: number) {
    // const tag = this.tags.find(t => t.id === tagId);
    // if (tag) {
    //   tag.selected = true;
    //   this.selectedTag = tag;
    // }
    for(let t of this.tags){
      if(t.id === tagId){
        t.selected = true;
        this.selectedTag = t;
      } else {
        t.selected = false;
      }
    }
  }

  clearSelection() {
    this.tags.forEach(tag => tag.selected = false);
  }

  selectTagsUsers(){

  }
 

    webSocketConnect(){
     if(!WebSocketsClient.CONNECTED){
        WebSocketsClient.connect()
        // this.connectButton.state = 3
      }else{
        WebSocketsClient.WSOCKET.complete(); 
        // this.connectButton.state = 1
      }
  }

  getAttractions(id: number){
    var params = {
      method:"getAttractions"
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.attractions      = result.data;
        this.connectedAttraction = this.attractions.length > 0 ? this.attractions[0] : null;
      }
    });
  }

  selectAttraction(attractionId: number) {
    for(let attr of this.attractions){
      if(attr.id === attractionId){
        attr.selected = true;
        this.selectedAttraction = attr
      } else {
        attr.selected = false;
      }
    }
  }

  attractionChange(event:any){
    const selectedId = event.target.value;
    console.log("Selected Attraction ID:", selectedId);
    this.connectedAttraction = this.attractions.find(attr => attr.id == selectedId) || null;
    console.log(this.connectedAttraction);
  }

  isEntrance: boolean = true;

  sendTagEvent() {
    let body = {
      NotificationType : this.isEntrance ? "entrance" : "exit",
      Identifier : this.selectedTag?.identifier,
      ReadTime : new Date().toISOString(),
      ReadPointName : this.selectedAttraction?.code,
    }

    this.outEvent = JSON.stringify(body, null, 2);
    this.service.tagNotification(body).subscribe((result: any) =>  { 
      // console.log("Location service response:", result);
    });
  }

  eventHandler(messgae:any){
    if(!this.viewActive) return;
    if(messgae.sender == "WebSocketClient"){
      switch(messgae.type){
       
        case "WEBSOCKET_CONNECTED":
          this.connected = true
          break;
        case "WEBSOCKET_DISCONNECTED":
          this.connected = false
          this.clientIpAddress = "";
          this.clientUUID      = "";
          this.attractionCode  = "";
          break;
        case "WEBSOCKET_EVENT":
          var data = messgae.payload;
          var inst = data.inst;
          var node = data.node;
          this.inputEvent = JSON.stringify(data, null, 2);
          // console.log(data)
          switch(data.inst){
             case "CLIENT_WELCOME":
              this.clientIpAddress = data.ipAddress;
              this.clientUUID      = data.uuid;
              this.attractionCode  = this.connectedAttraction?.code;
              let body = {
                inst: "REGISTER_CLIENT",
                ipAddress: this.clientIpAddress,
                uuid: this.clientUUID,
                attractionCode: this.seeAllNotifications ? "*" : this.attractionCode
              }
              WebSocketsClient.sendObjectMessage(body);
              this.outEvent = JSON.stringify(body, null, 2);
              break;
            case 'TAG_EVENT':
              this.inputEvent = JSON.stringify(data, null, 2);
            break;
          }
          break;
      }
    }
  }

}
