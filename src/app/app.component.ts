import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemGlobals } from './models/SystemGlobals';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WebSocketsComponent } from './views/web-sockets/web-sockets.component';
import { MainAppComponent } from './views/main-app/main-app.component';
import { WebSocketsClient } from './models/WebSocketClient';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, MainAppComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Selectara';

  constructor(private http:HttpClient){}

  ngOnInit(): void {
     console.log("[GLOBAL INIT]")
     this.getConfig();
    //  let data = this.getConfig();
    //  console.log(data)
     console.log("[GLOBAL READY]")
     var main = document.getElementById('MainAppCanvas');
     main.addEventListener('mousemove', function(event) {
      event.preventDefault();
    });
    // main.addEventListener('mousedown', function(event) {
    //   event.preventDefault();
    // });
  }

  async getConfig(){ 
    var data : any              = await this.http.get("___Config/GlobalConfig.json").toPromise();

    SystemGlobals.USE_LOCAL_SERVER          = data.USE_LOCAL_SERVER;
    SystemGlobals.PROTOCOL                  = data.PROTOCOL;
    SystemGlobals.VPS_HOST                  = data.VPS_HOST;
    SystemGlobals.HOST                      = data.HOST;
    SystemGlobals.SERVICE                   = data.SERVICE;
    SystemGlobals.SERVICE_FOLDER            = data.SERVICE_FOLDER;
    SystemGlobals.WEBSOCKET_PORT            = data.WEBSOCKET_PORT;
    SystemGlobals.WEBSOCKET_SECURE_PORT     = data.WEBSOCKET_SECURE_PORT;
    SystemGlobals.API_MEDIA_PORT            = data.API_MEDIA_PORT;
    SystemGlobals.API_MEDIA_SECURE_PORT     = data.API_MEDIA_SECURE_PORT;
    SystemGlobals.API_MEDIA_GET_TOKEN       = data.API_MEDIA_GET_TOKEN;
    SystemGlobals.API_MEDIA_TEST_TOKEN      = data.API_MEDIA_TEST_TOKEN;
    SystemGlobals.API_MEDIA_CREATE_ACTIVITY = data.API_MEDIA_CREATE_ACTIVITY;
    SystemGlobals.API_MEDIA_UPLOAD          = data.API_MEDIA_UPLOAD;
    SystemGlobals.API_MEDIA_LIST            = data.API_MEDIA_LIST;
    SystemGlobals.API_MEDIA_SHARE           = data.API_MEDIA_SHARE;
    SystemGlobals.API_MEDIA_KEY             = data.API_MEDIA_KEY;
    SystemGlobals.API_TAGS_PORT             = data.API_TAGS_PORT;
    SystemGlobals.API_TAGS_SECURE_PORT      = data.API_TAGS_SECURE_PORT;
    SystemGlobals.API_TAGS_KEY              = data.API_TAGS_KEY;
    SystemGlobals.API_TAGS_NOTIFICATIONS    = data.API_TAGS_NOTIFICATIONS;
    SystemGlobals.API_POS_PORT              = data.API_POS_PORT;
    SystemGlobals.API_POS_SECURE_PORT       = data.API_POS_SECURE_PORT;
    SystemGlobals.API_POS_KEY               = data.API_POS_KEY;
    SystemGlobals.API_POS_SALE              = data.API_POS_SALE;
    SystemGlobals.API_POS_SALE_STATUS       = data.API_POS_SALE_STATUS;

    SystemGlobals.CONTROL_SOCKET_HOST       = data.CONTROL_SOCKET_HOST;
    SystemGlobals.CONTROL_SOCKET_PORT       = data.CONTROL_SOCKET_PORT;

    if(!SystemGlobals.USE_LOCAL_SERVER){
      SystemGlobals.PROTOCOL="http"
      console.warn("%c[USING VPS SERVER]","color:yellow;font-size:16px");
    }else{
      console.warn("%c[USING LOCAL SERVER]","color:red;font-size:16px");
    }

    if(SystemGlobals.USE_LOCAL_SERVER){
      SystemGlobals.SERVICE_URL   = SystemGlobals.PROTOCOL+"://"+SystemGlobals.HOST+"/"+SystemGlobals.SERVICE_FOLDER
      SystemGlobals.SITE_URL      = SystemGlobals.PROTOCOL+"://"+SystemGlobals.HOST
      if(SystemGlobals.PROTOCOL=="https"){
        SystemGlobals.SOCKET_SERVER         = "wss://"+SystemGlobals.HOST+":"+SystemGlobals.WEBSOCKET_SECURE_PORT+"/ws"
        SystemGlobals.CONTROL_SOCKET_SERVER = "wss://"+SystemGlobals.CONTROL_SOCKET_HOST+":"+SystemGlobals.CONTROL_SOCKET_PORT
        SystemGlobals.API_POS_ENDPOINT      = "https://"+SystemGlobals.HOST+":"+SystemGlobals.API_POS_SECURE_PORT+SystemGlobals.API_POS_SALE
        SystemGlobals.API_MEDIA_ENDPOINT    = "https://"+SystemGlobals.HOST+":"+SystemGlobals.API_MEDIA_SECURE_PORT
        SystemGlobals.API_TAGS_ENDPOINT     = "https://"+SystemGlobals.HOST+":"+SystemGlobals.API_TAGS_SECURE_PORT
      } else {
        SystemGlobals.SOCKET_SERVER         = "ws://"+SystemGlobals.HOST+":"+SystemGlobals.WEBSOCKET_PORT
        SystemGlobals.CONTROL_SOCKET_SERVER = "ws://"+SystemGlobals.CONTROL_SOCKET_HOST+":"+SystemGlobals.CONTROL_SOCKET_PORT
        SystemGlobals.API_POS_ENDPOINT      = "http://"+SystemGlobals.HOST+":"+SystemGlobals.API_POS_PORT+SystemGlobals.API_POS_SALE
        SystemGlobals.API_MEDIA_ENDPOINT    = "http://"+SystemGlobals.HOST+":"+SystemGlobals.API_MEDIA_PORT
        SystemGlobals.API_TAGS_ENDPOINT     = "http://"+SystemGlobals.HOST+":"+SystemGlobals.API_TAGS_PORT
      }
    } else{
      SystemGlobals.SERVICE_URL   = SystemGlobals.PROTOCOL+"://"+SystemGlobals.VPS_HOST+"/"+SystemGlobals.SERVICE_FOLDER
      SystemGlobals.SITE_URL      = SystemGlobals.PROTOCOL+"://"+SystemGlobals.VPS_HOST
      if(SystemGlobals.PROTOCOL=="https"){
        SystemGlobals.SOCKET_SERVER         = "wss://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.WEBSOCKET_SECURE_PORT+"/ws"
        SystemGlobals.CONTROL_SOCKET_SERVER = "wss://"+SystemGlobals.CONTROL_SOCKET_HOST+":"+SystemGlobals.CONTROL_SOCKET_PORT+"/ws"
        SystemGlobals.API_POS_ENDPOINT      = "https://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.API_POS_SECURE_PORT+SystemGlobals.API_POS_SALE
        SystemGlobals.API_MEDIA_ENDPOINT    = "https://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.API_MEDIA_SECURE_PORT
        SystemGlobals.API_TAGS_ENDPOINT     = "https://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.API_TAGS_SECURE_PORT
      } else {
        SystemGlobals.SOCKET_SERVER         = "ws://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.WEBSOCKET_PORT
        SystemGlobals.CONTROL_SOCKET_SERVER = "ws://"+SystemGlobals.CONTROL_SOCKET_HOST+":"+SystemGlobals.CONTROL_SOCKET_PORT
        SystemGlobals.API_POS_ENDPOINT      = "http://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.API_POS_PORT+SystemGlobals.API_POS_SALE
        SystemGlobals.API_MEDIA_ENDPOINT    = "http://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.API_MEDIA_PORT
        SystemGlobals.API_TAGS_ENDPOINT     = "http://"+SystemGlobals.VPS_HOST+":"+SystemGlobals.API_TAGS_PORT
      }
    }

    SystemGlobals.MAC_ADDRESS   = data.MAC_ADDRESS
    SystemGlobals.CONFIG_READY  = true;


    let uuid = localStorage.getItem("UUID");

    if (uuid) {
        SystemGlobals.MAC_ADDRESS   = uuid;
    }else{
        let newUUID = SystemGlobals.getUniqueId(6); 
        localStorage.setItem("UUID",newUUID); 
        SystemGlobals.MAC_ADDRESS = newUUID;
    }  
    console.log("[GET FINISH]")
    // WebSocketsClient.connectControl()
    return data
  }




}

    // SystemGlobals.SERVICE_URL   = data.PROTOCOL+"://"+data.HOST+"/"+data.SERVICE_FOLDER
    // SystemGlobals.SOCKET_SERVER = "wss://"+data.SOCKET_HOST+":"+data.SOCKET_PORT+"/ws"  
    // SystemGlobals.CONTROL_SOCKET_SERVER = "ws://"+data.CONTROL_SOCKET_HOST+":"+data.CONTROL_SOCKET_PORT
    // SystemGlobals.SITE_URL      = data.PROTOCOL+"://"+data.HOST
    // SystemGlobals.API_KEY       = data.API_KEY
    // SystemGlobals.API_URL       = data.PROTOCOL+"://"+data.HOST+":"+data.MEDIA_SERVER_PORT