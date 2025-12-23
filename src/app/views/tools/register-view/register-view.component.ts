import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MainService } from '../../../services/MainService';
import { EventService } from '../../../models/global-events';
import { CommonModule } from '@angular/common';
import { Guest } from '../../../models/Structs';
import { WebCamPictureComponent } from "../../../components/web-cam-picture/web-cam-picture.component";
import { MediaService, UploadMediaResponse } from '../../../services/MediaService';
import { SystemGlobals } from '../../../models/SystemGlobals';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-view',
  imports: [CommonModule,FormsModule],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.css'
})
export class RegisterViewComponent {

  @ViewChild('WebCamContainer', { read: ViewContainerRef }) WebCamContainerRef!: ViewContainerRef;


  connected     = false
  viewActive    = false
  waitTimer     = null;
  currentUser  : Guest = new Guest();

  users     :Array<Guest> = [];

  canCreateNewUser = false;
  canUpdateUser    = false;
  canDeleteUser    = false;
  currentImageData  = "";
   constructor(private service : MainService,private mediaService: MediaService){ 
      
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
  
    ngOnDestroy(){
      if(this.waitTimer) clearTimeout(this.waitTimer);
      this.waitTimer    = null;
      this.viewActive   = false;
    }
  
    initView(){
      this.serverControl("status")
      this.getActiveUsers();
    }
  
    eventHandler(messgae:any){
      // console.log(messgae)
      if(!this.viewActive) return;


      switch(messgae.sender){
        case "WebCamPictureComponent":
          if(messgae.payload.status == "COMPLETED"){
            // console.log(messgae.payload.image)  ;
            if(!this.currentUser) return;

            this.currentImageData     = messgae.payload.image;
            // this.currentUser.picture  = this.currentImageData;
            
          }
          this.WebCamContainerRef.remove(0);
          break;
        case "WebSocketClient":
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

            switch(data.inst){
              case 'TAG_EVENT':
              break;
            }
            break;
        }
          break;
      }


    }

  getActiveUsers(){
    var params = {
      method:"getGuests",
      active:1
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.users = result.data;
        if(this.currentUser){
          this.selectUser(this.currentUser);
        }
      }
    });
  }

  takePicture(){
    const componentRef = this.WebCamContainerRef.createComponent(WebCamPictureComponent);
  }

  // currentUser : Guest | null = null;
  currentIdentifier : string = "";

  getNextTag(){
    var params = {
      method:"getNextTag"
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.currentIdentifier = result.data.identifier;
      }
    });
  }
  

  selectUser(user:Guest){
    for(var u of this.users) u.selected = false;
    if(this.currentUser) this.currentUser.selected = false;
    this.currentUser = user;
    this.currentUser.selected = true;
    this.currentIdentifier = this.currentUser.identifier;
    this.canCreateNewUser = false;
    this.canUpdateUser    = true;
    this.canDeleteUser    = true;
  }

  insertUser(){
    if(!this.currentUser) return;
    if(this.currentIdentifier == "") return;
    this.currentUser.identifier = this.currentIdentifier;
    console.log(this.currentUser);
    var params = {
      method:"insertGuest",
      guest:this.currentUser
    };
    this.service.mainService(params, "AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.currentUser      = result.data;
        this.canCreateNewUser = false;
        this.canUpdateUser    = true;
        this.canDeleteUser    = true;
        this.getActiveUsers();
      }
    });
  }

  updateUser(){
    if(!this.currentUser) return;
    if(this.currentIdentifier == "") return;
    this.currentUser.identifier = this.currentIdentifier;
    var params = {
      method:"updateGuest",
      guest:this.currentUser
    };
    this.service.mainService(params, "AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.currentUser = result.data;
        this.canCreateNewUser = false;
        this.canUpdateUser    = true;
        this.canDeleteUser    = true;
        this.getActiveUsers();
      }
    });
  }

  deleteUser(){
    if(!this.currentUser) return;
    var params = {
      method:"deleteGuest",
      guestId:this.currentUser.id
    };
    this.service.mainService(params, "AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.currentUser = null;
        this.canCreateNewUser = false;
        this.canUpdateUser    = false;
        this.canDeleteUser    = false;
        this.getActiveUsers();
      }
    });
  }

  createNewUser(){
    var params = {
      method:"createRandomUsers",
      numUsers:1
    };
    this.currentIdentifier = "";
    this.service.mainService(params, "AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.currentUser = result.data[0];
        this.currentImageData = this.currentUser.imageData;
        // this.currentUser.picture  = this.currentImageData;
        this.getNextTag();
        this.canCreateNewUser = true;
        this.canUpdateUser    = false;
        this.canDeleteUser    = false;
      }
    });
  }

  consoleOutput = "";
  consoleHeader = "";
  serverActive  = false;

  serverControl(action:string){
    let params = {
        action:action,
        service:"TagServer"
    }
    this.service.mainService(params,"ControlService").subscribe((result: any) =>  { 
        this.consoleHeader = result.data.status.header;
        this.consoleOutput = result.data.status.output;
        this.serverActive  = result.data.status.active;
    });
  }



upload(){
  if(!this.currentImageData || this.currentImageData == "") return;
  this.uploadBase64(this.currentImageData);
}

uploadBase64(fileData: string) {
  if(SystemGlobals.JWT_TOKEN == "" || SystemGlobals.JWT_EXPIRES < (Date.now()/1000)){
      this.mediaService.getToken().subscribe({
      next: (response) => {
        console.log("Token recibido:", response.token);
        this.mediaService.setToken(response.token);
        SystemGlobals.JWT_TOKEN = response.token;
        SystemGlobals.JWT_EXPIRES = (Date.now()/1000) + response.expiresIn;
        this.performUpload(fileData);
      },
      error: (err) => {
        console.error("Error al obtener el token:", err);
      }
    });
  } else {
    this.mediaService.setToken(SystemGlobals.JWT_TOKEN);
    this.performUpload(fileData);
  }
}

performUpload(fileData: string) {
  this.mediaService.uploadBase64({
    activityId: "A-123",
    identifier: "707e3112",
    readPointName: "NT-04B",
    base64: fileData,
  }).subscribe({
    next: (event) => {
      console.log("evento:", event);
      if (event.type === 4) {
        console.log("[UPLOAD COMPLETED]", event);
        let fileResult = event.body as any;
        console.log(fileResult);
        if(this.currentUser){
          this.currentUser.picture = fileResult.url;
        }
      }
    },
    error: (err) => {
      console.error("Error:", err);
    }
  });
}










}