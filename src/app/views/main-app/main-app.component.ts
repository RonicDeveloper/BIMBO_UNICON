import { AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../../models/global-events';
import { SystemGlobals } from '../../models/SystemGlobals';
import { AlertData } from '../../models/Structs';
import { LeftMenuComponent } from '../menus/left-menu/left-menu.component';
import { MainContentComponent } from '../main-content/main-content.component';
import { MatIconModule } from '@angular/material/icon';
import { RightMenuComponent } from '../menus/right-menu/right-menu.component';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../modules/app-icon-module/app-icon-module.module';
import { LoginViewComponent } from "../login-view/login-view.component";
import { WebSocketsClient } from '../../models/WebSocketClient';



@Component({
  standalone: true,
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrl: './main-app.component.css',
  imports: [CommonModule, LeftMenuComponent, RightMenuComponent, MainContentComponent, MatIconModule, AppIconModuleModule, LoginViewComponent],
  host: {'(window:resize)': 'onResize($event)'}
  
})

export class MainAppComponent implements OnInit ,AfterViewInit{


  @ViewChild("LeftMenu") leftMenuRef! : ElementRef;
  @ViewChild("RighttMenu") rightMenuRef! : ElementRef;
  @ViewChild("MainContent") mainContent! : ElementRef;

  leftMenuElement! : HTMLElement;
  rightMenuElement! : HTMLElement;
  contentElement! : HTMLElement;

  ALERT : AlertData = new AlertData()
  MOBILE_VIEW = false 
  USER_LOGGED = true

  constructor(){
    EventService.emmiter.subscribe((data)=>{
      this.eventHandler(data)
    })
    
  }


  ngOnInit(): void {
    this.ALERT.show = false
    this.updateScale()
  }

  ngAfterViewInit(): void {
    this.leftMenuElement = this.leftMenuRef.nativeElement
    this.rightMenuElement = this.rightMenuRef.nativeElement
    this.contentElement   = this.mainContent.nativeElement
  }

  eventHandler(data:any){
    this.leftMenuElement = this.leftMenuRef.nativeElement
    switch(data.type){
       case "LOGIN":
          if(data.payload.logged){
            this.USER_LOGGED = true;
          }else{
            this.USER_LOGGED = false;
          }
          break;

      case "ALERT_EVENT":
        if(data.payload.action === "CONFIRM"){
          switch(data.sender){
            case "logout_user":
              this.USER_LOGGED = false;
              break;
          }
        }else if(data.payload.action === "CANCEL"){
          
        }
        break;

      case "SHOW_ALERT":
        this.ALERT.title   = data.payload.title
        this.ALERT.message = data.payload.message
        this.ALERT.confirm = data.payload.confirm
        this.ALERT.cancel  = data.payload.cancel
        this.ALERT.sender  = data.payload.sender
        this.ALERT.showCancel = data.payload.showCancel || false
        this.ALERT.show    = true
        break;
      case "MENU_EVENT":
        switch(data.sender){
          case "left_menu":
            if(SystemGlobals.IS_MOBILE){
              if(data.payload.isOpen){
                this.leftMenuElement.style.height = (SystemGlobals.CONTENT_HEIGHT-60)+"px" 
              }else{
                this.leftMenuElement.style.height = "55px"
              }
            }else{
              if(data.payload.isOpen){
                this.leftMenuElement.style.width = "350px"
              }else{
                this.leftMenuElement.style.width = "50px"
              }
            }
            
            this.updateScale();
            break
          case "right_menu":
            if(SystemGlobals.IS_MOBILE){
              if(data.payload.isOpen){
                this.rightMenuElement.style.height = (SystemGlobals.CONTENT_HEIGHT-170)+"px"
              }else{
                this.rightMenuElement.style.height = "50px"
              }
            } else{
              if(data.payload.isOpen){
                this.rightMenuElement.style.width = "350px"
              }else{
                this.rightMenuElement.style.width = "50px"
              }
            }
           
            break
        }
      }
  }
  onResize(event:any){
    SystemGlobals.CONTENT_WIDTH = parseInt(event.target.innerWidth)
    this.updateScale()
  }

  updateScale(){
    SystemGlobals.CONTENT_SCALE  = 1.0
    SystemGlobals.CONTENT_WIDTH  = window.innerWidth;
    SystemGlobals.CONTENT_HEIGHT = window.innerHeight
    SystemGlobals.IS_MOBILE = (SystemGlobals.CONTENT_WIDTH < 500);
    // console.log(SystemGlobals.IS_MOBILE,SystemGlobals.CONTENT_SCALE,SystemGlobals.CONTENT_WIDTH,SystemGlobals.CONTENT_HEIGHT)
    // console.log((SystemGlobals.CONTENT_HEIGHT-170))
    this.MOBILE_VIEW = SystemGlobals.IS_MOBILE    
  }


  alertConfirm(){
    this.ALERT.show = false
    EventService.sendEvent("ALERT_EVENT",this.ALERT.sender,{action:"CONFIRM"})
  }


  alertCancel(){
    this.ALERT.show = false
    EventService.sendEvent("ALERT_EVENT",this.ALERT.sender,{action:"CANCEL"})
  }
}