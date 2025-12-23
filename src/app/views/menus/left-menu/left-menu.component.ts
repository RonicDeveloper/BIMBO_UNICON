import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MenuItem, MenuSection } from '../../../models/Structs';
import { SystemGlobals } from '../../../models/SystemGlobals';
import { EventService } from '../../../models/global-events';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WebSocketsClient } from '../../../models/WebSocketClient';
// import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
    selector: 'app-left-menu',
    standalone: true,
    imports: [CommonModule, AppIconModuleModule, MatIconModule, MatButtonModule, MatSlideToggleModule], //MatProgressBarModule
    templateUrl: './left-menu.component.html',
    styleUrl: './left-menu.component.css'
})

export class LeftMenuComponent implements OnInit, AfterViewInit{

  connectButton = new MenuItem(0,"Connect", "server",  "connect_to_webSocket_server", []);
  alertButton = new MenuItem(0,"Alert", "alert",  "show_alert_panel", []);

  MainMenu : Array<MenuSection> = 
  [
    new MenuSection(0 ,"SETTINGS","cog" , true , [
      new MenuItem(0,"Server Admin","security", "server_admin_view" , []),
      new MenuItem(1,"Automation","remote", "automation_view" , []),
      new MenuItem(2,"Users","account", "user_admin_view" , []),
      new MenuItem(3,"WebSockets","memory", "web_sockets_view" , []),
      new MenuItem(4,"Database","database", "web_sockets_view" , []),
    ]),
  
    new MenuSection(1 ,"TOOLS","hammer" , true , [
      new MenuItem(0,"Sales","printer-pos-outline", "sales_view" , []),
      new MenuItem(1,"Register","card-account-details-outline", "registration_view" , []),
      new MenuItem(2,"Access Control","door-sliding-open", "access_control_view" , []),
      new MenuItem(3,"Tags","tag-outline", "tags_view" , []),
      new MenuItem(4,"Guests","account-supervisor", "guests_view" , []),
      new MenuItem(5,"Simulator","run", "simulator_view" , []),
  
    ]),

    new MenuSection(2 ,"ACCOUNT","shield-account" , true , [
      new MenuItem(0,"Logout","exit-to-app", "system_logout" , [this.connectButton,this.alertButton])
    ]),
  
    // new MenuSection(3 ,"SETTINGS","cog" , true , [
    //   new MenuItem(0,"ArtNet","memory", "system" , [this.connectButton,this.alertButton]),
    //   new MenuItem(1,"TimeCode","memory", "system" , [this.connectButton,this.alertButton]),
    //   new MenuItem(2,"DMX","memory", "system" , [this.connectButton,this.alertButton]),
    //   new MenuItem(3,"Firmware","memory", "system" , [this.connectButton,this.alertButton])
    // ]),
   
  ]


selectedMenuIndex             = 0
selectedSubMenuIndex          = 0
selectedMenu    : MenuSection = this.MainMenu[this.selectedMenuIndex] 
selectedSubMenu : MenuItem    = this.selectedMenu.menuItems[this.selectedSubMenuIndex]
selectedSecctionName          = this.selectedMenu.name

isOpen = true

MOBILE_VIEW = SystemGlobals.IS_MOBILE

ngOnInit(): void {
  SystemGlobals.selectedSecctionName  = this.selectedSecctionName
}

ngAfterViewInit(): void {  
  this.MOBILE_VIEW = SystemGlobals.IS_MOBILE
  // console.log("[LEFT MENU INIT]")
  EventService.emmiter.subscribe((data)=>{
    this.eventHandler(data)
  })
  
}

selectMenu(secction : any ,subMenu : any){
  this.selectedMenuIndex              = secction
  this.selectedSubMenuIndex           = subMenu
  this.selectedMenu                   = this.MainMenu[secction] 
  this.selectedSubMenu                = this.selectedMenu.menuItems[subMenu]  
  this.selectedSecctionName           = this.selectedMenu.name
  SystemGlobals.selectedMenuIndex     = secction
  SystemGlobals.selectedSubMenuIndex  = subMenu
  if(SystemGlobals.selectedSecctionName  != this.selectedSecctionName){
    SystemGlobals.selectedSecctionName  = this.selectedSecctionName
  }
  EventService.sendEvent("SUB_MENU_EVENT","left_menu",{selectedMenu:this.selectedMenu.name,selectedSubMenu:this.selectedSubMenu.tag})
}


toggleMenu(){
  this.isOpen = !this.isOpen
  EventService.sendEvent("MENU_EVENT","left_menu",{isOpen:this.isOpen})
}

subvMenuButtonClicked(tag:any){
  // console.log(tag)
  switch(tag){
    case "show_alert_panel" :
      EventService.sendEvent("SHOW_ALERT","left_menu",{title:"Alert",message:"This is a test alert",confirm:"OK",cancel:"Cancel",sender:"left_menu"})
      break
    case "connect_to_webSocket_server":
      if(!WebSocketsClient.CONNECTED){
        WebSocketsClient.connect()
        this.connectButton.state = 3
      }else{
        WebSocketsClient.WSOCKET.complete(); 
        this.connectButton.state = 1
      }
  }
  
}



  eventHandler(data:any){
    switch(data.type){
      case "SOCKET_SERVER_EVENT":
        this.connectButton.state = data.payload.state
        // console.log(this.connectButton.state)
        break;
    }
  }
}


