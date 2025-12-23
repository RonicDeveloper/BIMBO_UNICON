

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../services/MainService';
import { TagNotification } from '../../models/Structs';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketsClient } from '../../models/WebSocketClient';
import { EventService } from '../../models/global-events';


@Component({
    selector: 'app-web-sockets',
    templateUrl: './web-sockets.component.html',
    styleUrl: './web-sockets.component.css',
    standalone: true,
    imports: [CommonModule , AppIconModuleModule, MatIconModule],
    providers:[MainService]
})



export class WebSocketsComponent implements OnInit, AfterViewInit{

  tags : Array<TagNotification> = [];
  connected = false
  viewActive    = false;
  clientIpAddress = "";
  clientUUID      = "";
  attractionCode  = "";
  outEvent        = "";
  inputEvent      = "";
  clientList     = new Array<Client>();

  constructor(private service : MainService){ 
  }

  ngOnInit(){
    console.log("[WEB SOCKETS APP INIT]")
  }

  ngAfterViewInit(){
    this.loadSettings() 
    this.viewActive = true;
    EventService.emmiter.subscribe((data)=>{
      this.eventHandler(data)
    })
  }

loadSettings(){
  setTimeout(()=>{
    var date  =  new Date();
    var month = (date.getMonth()+1);
    var day   =  date.getDate()
    var currentDate = date.getFullYear() + "-" + (month<10?"0"+month:month) + "-" + (day<10?"0"+day:day) 
    // this.connect();
  },1000)
  }


  connect(){
    if(!WebSocketsClient.CONNECTED) {
      WebSocketsClient.connect();
    }else{
      WebSocketsClient.WSOCKET.complete();  
    }
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
          break;
        case "WEBSOCKET_EVENT":
          var data = messgae.payload;   
          // var inst = data.inst;
          // var node = data.node;
         
          switch(data.inst){
            case "TAG_EVENT":
              console.log(data)
              let attractionCode = data.readPointName;
       

              this.connectedClients.forEach(cc => {
                if(cc.attractionCode == attractionCode){
                  cc.notify();
                }
              });


              break;


            case "CLIENT_WELCOME":
              this.clientIpAddress = data.ipAddress;
              this.clientUUID      = data.uuid;
              this.attractionCode  = "*";
              let body = {
                inst: "REGISTER_CLIENT",
                ipAddress: this.clientIpAddress,
                uuid: this.clientUUID,
                attractionCode: this.attractionCode
              }
              WebSocketsClient.sendObjectMessage(body);
              // this.outEvent = JSON.stringify(body, null, 2);

              WebSocketsClient.sendObjectMessage({inst:"GET_CONNECTED_CLIENTS"});

              break;
            case "GET_CONNECTED_CLIENTS_RESULT":
              console.log("GET_CONNECTED_CLIENTS_RESULT",data)
              this.clientList = [];
              let clients     = data.clients;
              this.connectedClients = [];
              for(let i=0; i<clients.length; i++){
                let c = clients[i];
                let client = new Client(c.uuid, c.ipAddress, c.attractionCode);
                this.clientList.push(client);

                var exists = false;
                this.connectedClients.forEach(cc => {
                  if(cc.attractionCode == client.attractionCode){
                    exists = true;
                    cc.currentConnections++;
                  }
                });
                if(!exists){
                  client.currentConnections = 1;
                  if(client.attractionCode == "*"){
                    client.attractionCode = "ADMIN";
                  }
                  this.connectedClients.push(client);
                }
              }


              this.connectedClients.sort((a,b) => (a.attractionCode > b.attractionCode) ? 1 : ((b.attractionCode > a.attractionCode) ? -1 : 0));

              // Update current connections
              // for(let i=0; i<clients.length; i++){
              //   let c = clients[i];
              //   let client = new Client(c.uuid, c.ipAddress, c.attractionCode);
              //   this.connectedClients.forEach(cc => {
              //     if(cc.attractionCode == client.attractionCode){
              //       client.currentConnections++;
              //     }
              //   });

              // }
              break;
            // case 'TAG_EVENT':
            // let info = data;
            // this.tags.push(info)
            // if(this.tags.length > 25)  {
            //     this.tags.shift();
            //   }
            // break;
          }
          break;
      }
    }
    
  }


  selectedClient:Client | null = null;

  connectedClients : Array<Client> = [];


  selectClient(client){
    this.clientList.forEach(c => c.selected = false);
     client.selected = true; 
     this.selectedClient = client;
  }

   sendTagEvent() {
    let body = {
      NotificationType : "entrance",
      Identifier : "TEST_TAG_0001",
      ReadTime : new Date().toISOString(),
      ReadPointName : this.selectedClient.attractionCode,
    }

    this.service.tagNotification(body).subscribe((result: any) =>  { 
      // console.log("Location service response:", result);º
    });
  }

  toggleRelay(uuid:any,relay:any){
    var index = 0;
    if(relay == "R1") index = 1;
    if(WebSocketsClient.CONNECTED){
      console.log("TOGGLE_RELAY",{uuid:uuid,index:index})
      WebSocketsClient.sendMessage("TOGGLE_RELAY",{uuid:uuid,index:index});
    } 
  }



   resetList() {
    this.tags = [];
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

  refresh(){
    if(this.connected){
      WebSocketsClient.sendObjectMessage({inst:"GET_CONNECTED_CLIENTS"});
    }
  }

 

  }


export class Client {
  uuid                : string = "";
  ipAddress           : string = "";
  attractionCode      : string = "";
  selected            : boolean = false;
  currentConnections  : number  = 0;
  notified            : boolean = false;

  constructor(uuid:string, ipAddress:string, attractionCode:string){
    this.uuid           = uuid;
    this.ipAddress      = ipAddress;
    this.attractionCode = attractionCode; 
  }


  notify(){
    this.notified = true;
    setTimeout(()=>{
      this.notified = false;
    },2000)
  }

}


  


