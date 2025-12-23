import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../../services/MainService';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketsClient } from '../../../models/WebSocketClient';
import { EventService } from '../../../models/global-events';
import { read } from 'original-fs';

@Component({
  standalone: true,
  selector: 'app-sales-view',
  templateUrl: './sales-view.component.html',
  styleUrl: './sales-view.component.css',
  imports: [CommonModule , AppIconModuleModule, MatIconModule],
  providers:[MainService]
})
export class SalesViewComponent  implements OnInit, AfterViewInit{

  connected = false
  tags : Array<TagData> = []
  selectedTag : TagData | null = null;
  waitTimer     = null;
  useAuth       = true;
  usePOSObject  = false;
  authToken     = "b7abebe6-2d05-4ac3-9130-5fd416d67d09";
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

  ngOnDestroy(){
    if(this.waitTimer) clearTimeout(this.waitTimer);
    this.waitTimer    = null;
    this.viewActive    = false;
  }

  initView(){
    this.serverControl("status")
    this.getTags(); 
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


  reloadTags(){
   var params = {
      method:"getTags",
      active:1
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.tags = result.data;
        this.selectTag(this.tags[this.tags.length - 1]);
      }
    });
  }

  getTags(){
    var params = {
      method:"getTags"
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.tags = result.data;
      }
    });
  }


  currentTag : TagData | null = null;
  currentSaleId : string = "";

  getNextTag(){
    var params = {
      method:"getTags",
      active:0
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.currentTag = result.data[0]
        this.currentSaleId = this.currentTag?.saleNumber || "";
      }
    });
  }


  createRandomSaleId(){
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    this.currentSaleId = "SALE-" + randomId;
  }
  
  validTadChasr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    'A', 'B', 'C', 'D', 'E', 'F'];

  createNewTagId(){ 
    this.currentTag = null;

    this.currentTag = new TagData() ;
    this.currentTag.id             = 0;
    this.currentTag.identifier     = this.randomDigit("xxxxxxxxxxxxxxxxxx",true).toUpperCase();
    this.currentTag.ticket         = this.randomDigit("xxxxxx");
    this.currentTag.uuid           = this.randomDigit("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",true);
    this.currentTag.saleNumber     = "SALE-" + Math.floor(100000 + Math.random() * 900000).toString();
    this.currentTag.adn            = this.randomDigit("xxxxx");
    this.currentTag.station        = "CAJA0" + this.randomDigit("x");
    this.currentTag.readPoint      = "POS-01";
    this.currentTag.readTime       = this.getDate();
    this.currentTag.email          = this.randomEmail();
    this.currentTag.creationDate   = this.getDate();
    this.currentTag.validDate      = this.getDate(1);
    this.currentTag.expirationDate = this.getDate(2);
    this.currentTag.active         = true;
    this.currentTag.selected       = false;

    let body = {};
    if(this.usePOSObject){
    
      body = {
        NotificationType  : "tap",
        SaleNumber        : this.currentTag.saleNumber,
        ReadPointName     : this.currentTag.readPoint,
        Identifier        : this.currentTag.identifier,
        Sales             : {
                            F_Emision  : this.currentTag.creationDate.split(' ')[0].split('-').reverse().join('/')+" "+this.currentTag.creationDate.split(' ')[1],
                            F_Venc     : this.currentTag.expirationDate.split(' ')[0].split('-').reverse().join('/')+" "+this.currentTag.expirationDate.split(' ')[1],
                            Venta      : this.currentTag.saleNumber,
                            Ticket     : this.currentTag.ticket,
                            Guid       : this.currentTag.uuid,
                            Email      : this.currentTag.email,
                            Adn        : this.currentTag.adn,
                            Station    : this.currentTag.station,
                            ValidDate  : this.currentTag.validDate.split(' ')[0].split('-').reverse().join('/')+" "+this.currentTag.validDate.split(' ')[1],
                          }
      }
    }else{
      body = {
        NotificationType  : "tap",
        SaleNumber        : this.currentTag.saleNumber,
        Identifier        : this.currentTag.identifier,
        CreationDate      : this.currentTag.creationDate,
        ValidDate         : this.currentTag.validDate,
        ExpirationDate    : this.currentTag.expirationDate,
        ReadTime          : this.currentTag.readTime,
        ReadPointName     : this.currentTag.readPoint,
        Ticket            : this.currentTag.ticket,
        Guid              : this.currentTag.uuid,
        Email             : this.currentTag.email,
        Adn               : this.currentTag.adn,
        Station           : this.currentTag.station
      }
    }

    this.consoleHeader = JSON.stringify(body, null, 2);
  }

  getDate(plusDays:number=0,plusMonths:number=0){
    let date = new Date();
    if(plusDays != 0){
      date.setDate(date.getDate() + plusDays);
    }
    if(plusMonths != 0){
      date.setMonth(date.getMonth() + plusMonths);
    }
   
 
    const formattedDate = date.toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Ensures 24-hour format
    }).replace(', ', ' ');
    console.log(formattedDate);
    return formattedDate;
  }

  randomDigit(format:string, hex:boolean=false){
    if(hex){
      return format.replace(/[x]/g, function(c) {
        var r = Math.random() * 16 | 0;
        return r.toString(16);
      });
    } else {
      return format.replace(/[x]/g, function(c) {
        var r = Math.random() * 10 | 0;
        return r.toString();
      });
    }
  }

  randomEmail(){
    const domains = ["example.com", "test.com", "demo.com", "sample.com"];
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let email = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      email += chars[randomIndex];
    }
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return email + '@' + randomDomain;
  }

  consoleOutput = "";
  consoleHeader = "";
  serverActive  = false;

  serverControl(action:string){
    let params = {
        action:action,
        service:"POSControl"
    }
    this.service.mainService(params,"ControlService").subscribe((result: any) =>  { 
          this.consoleHeader = result.data.status.header;
          this.consoleOutput = result.data.status.output;
          this.serverActive  = result.data.status.active;
      });
  }

  
 insertTag(){
    if(!this.currentTag) {
      EventService.sendEvent("SHOW_ALERT","sales_view",{title:"Error",message:"Incomplete Tag Data",confirm:"OK",cancel:"Cancel",sender:"sales_view",showCancel:false});
      return;
    }

  let body = {};
    if(this.usePOSObject){
      body = {
        NotificationType  : "tap",
        SaleNumber        : this.currentTag.saleNumber,
        ReadPointName     : this.currentTag.readPoint,
        Identifier        : this.currentTag.identifier,
        Sales             : {
                            F_Emision  : this.currentTag.creationDate.split(' ')[0].split('-').reverse().join('/')+" "+this.currentTag.creationDate.split(' ')[1],
                            F_Venc     : this.currentTag.expirationDate.split(' ')[0].split('-').reverse().join('/')+" "+this.currentTag.expirationDate.split(' ')[1],
                            Venta      : this.currentTag.saleNumber,
                            Ticket     : this.currentTag.ticket,
                            Guid       : this.currentTag.uuid,
                            Email      : this.currentTag.email,
                            Adn        : this.currentTag.adn,
                            Station    : this.currentTag.station
                          }
      }
    }else{
      body = {
        NotificationType  : "tap",
        SaleNumber        : this.currentTag.saleNumber,
        Identifier        : this.currentTag.identifier,
        CreationDate      : this.currentTag.creationDate,
        ValidDate         : this.currentTag.validDate,
        ExpirationDate    : this.currentTag.expirationDate,
        ReadTime          : this.currentTag.readTime,
        ReadPointName     : this.currentTag.readPoint,
        Ticket            : this.currentTag.ticket,
        Guid              : this.currentTag.uuid,
        Email             : this.currentTag.email,
        Adn               : this.currentTag.adn,
        Station           : this.currentTag.station
      }
    }

    this.service.POSService(body,this.useAuth,this.authToken).subscribe((result: any) =>  { 
      this.consoleHeader = JSON.stringify(body, null, 2);
      this.consoleOutput = JSON.stringify(result, null, 2);
      
      if(result.success){
        
        this.currentTag.id = result.tag.id;
        this.reloadTags();
      } else {
        console.log(result);
        EventService.sendEvent("SHOW_ALERT","sales_view",{title:"Error",message:result.message,confirm:"OK",cancel:"Cancel",sender:"sales_view",showCancel:false})
      }
    });
  }

  selectTag(tag:TagData){
    if(this.selectedTag) this.selectedTag.selected = false;
    tag.selected = true;
    this.selectedTag = tag;
    this.currentTag = tag;
  }

  attractionCode = "TR-01-";


  sendTagEvent(doorNumber: number) {
    let body = {
      NotificationType : "entrance",
      Identifier : this.selectedTag?.identifier,
      ReadTime : new Date().toISOString(),
      ReadPointName : this.attractionCode + "0" + doorNumber,
    }

    // this.outEvent = JSON.stringify(body, null, 2);
    this.service.tagNotification(body).subscribe((result: any) =>  { 
      console.log("Location service response:", result);
    });
  }

}



export class TagData {
  id              : number;
  identifier      : string;
  ticket          : string;
  uuid            : string;
  saleNumber      : string;
  adn             : string;
  station         : string;
  readPoint       : string;
  readTime        : string;
  email           : string;
  creationDate    : string;
  validDate       : string;
  expirationDate  : string;
  active          : boolean;
  accessDate      : string;
  selected        : boolean;

  // "id": 20,
  // "identifier": "ABCDEFG1",
  // "ticket": "1",
  // "uuid": "6B29FC40-CA47-1067-B31D-00DD010662DA",
  // "saleNumber": "150",
  // "adn": "07481",
  // "station": "CAJA01",
  // "readPoint": "OP-01",
  // "readTime": "2025-09-18T01:27:08.000Z",
  // "email": "no mail",
  // "creationDate": "2025-09-15T06:00:00.000Z",
  // "validDate": "2025-09-15T06:00:00.000Z",
  // "expirationDate": "2025-09-15T06:00:00.000Z",
  // "accessDate": null,
  // "active": 1

  // constructor(id:number, identifier:string, ticket:string, uuid:string, saleNumber:string, adn:string, station:string, readPoint:string, readTime:string, email:string, creationDate:string, validDate:string, expirationDate:string, active:number, accessDate?:string){
  //   this.id             = id;
  //   this.identifier     = identifier;
  //   this.ticket         = ticket;
  //   this.uuid           = uuid;
  //   this.saleNumber     = saleNumber;
  //   this.adn            = adn;
  //   this.station        = station;
  //   this.readPoint      = readPoint;
  //   this.readTime       = readTime;
  //   this.email          = email
  //   this.creationDate   = creationDate
  //   this.validDate      = validDate
  //   this.expirationDate = expirationDate
  //   this.active         = active == 1 ? true : false;
  //   this.accessDate     = accessDate || "";
  //   this.selected       = false;
  // }
}

