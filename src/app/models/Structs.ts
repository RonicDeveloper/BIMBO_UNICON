import { Injectable } from '@angular/core';



export class User {
  id              = 0
  uuid            = ""
  name            = ""
  familyName      = ""
  lastName        = ""
  mail            = ""
  level           = 0
  active          = 0
  adminName       = ""
  logged          = false

  constructor( id:number,name:string,familyName:string,lastName:string,mail:string,level:number,active:number,adminName:string,logged:boolean = false){
    this.id            = id
    this.name          = name
    this.familyName    = familyName
    this.lastName      = lastName
    this.mail          = mail
    this.level         = level
    this.active        = active
    this.adminName     = adminName
    this.logged        = logged
  }
}



export class Guest {
  id            : number  = 0;
  identifier    : string  = '';
  gender        : string  = '';
  firstName     : string  = '';
  familyName    : string  = '';
  lastName      : string  = '';
  age           : number  = 0;
  mail          : string  = '';
  hasDisability : boolean = false;
  disability    : string  = '';
  phone         : string  = '';
  creationDate  : string  = '';
  picture       : string  = '';
  zipCode       : string  = '';
  language      : string  = '';

  imageData     : string  = ''; // Base64 image data
  selected      : boolean = false;

  constructor() {}

  setData(id:number, identifier:string, gender:string, firstName:string, familyName:string, lastName:string, age:number, mail:string, hasDisability:number, disability:string, phone:string, creationDate:string, picture:string, zipCode:string, language:string) {
    this.id            = id;
    this.identifier    = identifier;
    this.gender        = gender;
    this.firstName     = firstName;
    this.familyName    = familyName;
    this.lastName      = lastName;
    this.age           = age;
    this.mail          = mail;
    this.hasDisability = hasDisability == 1 ? true : false;
    this.disability    = disability;
    this.phone         = phone;
    this.creationDate  = creationDate;
    this.picture       = picture;
    this.zipCode       = zipCode;
    this.language      = language;
  }
}


export class TagNotification {
  notificationType  : string = '';
  identifier        : string = '';
  readTime          : string = '';
  readPointName     : string = '';
  user              : Guest | null = null;

  constructor(notificationType:string, identifier:string, readTime:string, readPointName:string, user:Guest | null = null) {
    this.notificationType = notificationType;
    this.identifier       = identifier;
    this.readTime         = readTime;
    this.readPointName    = readPointName;
    this.user             = user;
  }
}



export class Show {
  id                    : number = 0;
  attractionCode        : string = '';
  name                  : string = '';
  maxGuests             : number = 0;
  maxDisabilityGuests   : number = 0;
  active                : number = 0;
  selected              : boolean = false;
}

export class ShowData {
  id                    : number = 0;
  attractionCode        : string = '';
  name                  : string = '';
  maxGuests             : number = 0;
  maxDisabilityGuests   : number = 0;
  active                : number = 0;
  schedule              : Array<ShowSchedule> = [];
  selected              : boolean = false;

  constructor(id:number, attractionCode:string, name:string, maxGuests:number, maxDisabilityGuests:number, active:number, schedule:Array<ShowSchedule>) {
    this.id                  = id;
    this.attractionCode      = attractionCode;
    this.name                = name;
    this.maxGuests           = maxGuests;
    this.maxDisabilityGuests = maxDisabilityGuests;
    this.active              = active;
    this.schedule            = schedule;
  }
}

export class ShowSchedule {
  id                        : number = 0;
  idShow                    : number = 0;
  showTime                  : string = '';
  maxGuests                 : number = 0;
  totalGuests               : number = 0;
  totalDisabilityGuests     : number = 0;
  maxDisabilityGuests       : number = 0;
  availableGuestSlots       : number = 0;
  availableDisabilitySlots  : number = 0;
  status                    : string = '';
  selected                  : boolean = false;

  constructor(id:number, idShow:number, showTime:string, maxGuests:number, totalGuests:number, totalDisabilityGuests:number, maxDisabilityGuests:number, availableGuestSlots:number, availableDisabilitySlots:number, status:string) {
    this.id                          = id;
    this.idShow                      = idShow;
    this.showTime                    = showTime;
    this.maxGuests                   = maxGuests;
    this.totalGuests                 = totalGuests;
    this.totalDisabilityGuests       = totalDisabilityGuests;
    this.maxDisabilityGuests         = maxDisabilityGuests;
    this.availableGuestSlots         = availableGuestSlots;
    this.availableDisabilitySlots    = availableDisabilitySlots;
    this.status                      = status;
  }
}


export class ShowSlot {
  id           : number = 0;
  idShow       : number = 0;
  idSchedule   : number = 0;
  identifier   : string = '';
  registerDate : string = '';
  entranceDate : string = '';
  status       : string = '';
  selected     : boolean = false;
  guest        : Guest | null = null;
}



// export class TagUser {
//   id         : number;
//   tag_id     : string;
//   first_name : string;
//   last_name  : string;
//   email      : string;
//   phone      : string;

//   constructor(id:number, tag_id:string, first_name:string, last_name:string, email:string, phone:string) {
//     this.id         = id;
//     this.tag_id     = tag_id;
//     this.first_name = first_name;
//     this.last_name  = last_name;
//     this.email      = email;
//     this.phone      = phone;
//   }
// }


// export enum VerticalFlow {
//   Both = 0,
//   UpOnly = 1,
//   DownOnly = 2,
// }

// export enum HorizontalFlow {
//   Both = 0,
//   LeftOnly = 1,
//   RightOnly = 2,
// }

// export enum WalkStatus {
//   WalkingAround  = 0,
//   Idle           = 1,
//   InCue        = 2,
//   InAttraction   = 3,
//   AheadToCue   = 4,
//   IsInGame       = 5,
//   AheadToExit    = 6,
// }

// export class Attraction {

//   cuePosition: number;
//   gameDuration: number;
//   height: number;
//   id: number;
//   code: string;
//   name: string;
//   numGuestInCue: number;
//   numGuestInGame: number;
//   sensorRadious: number;
//   sensorX: number;
//   sensorY: number;
//   width: number;
//   x: number;
//   y: number;
//   active : number = 1; // Flag to indicate if the attraction is active (1) or inactive (0)

//   // SIMULATOR DATA
//   currentGuestInCue: number = 0; // Current number of guests in the queue
//   currentGuestInGame: number = 0; // Current number of guests in the game
//   currentGameDuration: number = 0; // Current game duration in seconds

//   gameClock: string = "00:00:00"; // Game clock in HH:MM:SS format

//   cueBoundingBox = { x: 0, y: 0, width: 0, height: 0 };
//   cueX: number = 0;
//   cueY: number = 0;
//   cueStartPosition = { x: 0, y: 0 , direction:"Down"}; // Starting position of the cue

//   guestInCue: Array<Guest> = Array<Guest>(); // Guests currently in the queue
//   guestInGame: Array<Guest> = Array<Guest>(); // Guests currently in the game
//   isGameActive: boolean = false; // Flag to indicate if the game is active

//   center      = { x: 0, y: 0 }; // Center point of the attraction
//   exitPoints  : Array<{ x: number, y: number }> = [];
//   exits = [
//     [0,0,0,0,2,2,2,4,4,0,0,0],
//     [0,0,0,0,2,2,2,2,1,1,1,1],
//     [0,0,0,0,2,2,2,2,1,1,1,1],
//     [0,0,0,0,0,0,0,3,3,3,1,1],
//     [2,2,2,0,0,0,0,3,3,3,2,2],
//     [2,2,2,0,0,0,0,3,3,3,3,2],
//     [4,2,2,0,0,0,0,0,0,0,4,4],
//     [4,4,3,3,3,3,0,0,0,0,4,4],
//     [4,4,3,3,3,3,0,0,0,0,4,4],
//     [0,1,1,1,3,3,0,0,0,0,0,0],
//     [0,1,1,1,1,2,2,2,2,0,0,0],
//     [0,1,1,1,1,4,4,4,4,0,0,0]
//   ];

//   constructor(id: number, code: string, name: string, x: number, y: number, width: number, height: number, sensorX: number, sensorY: number, sensorRadious: number, cuePosition: number, numGuestInCue: number, numGuestInGame: number, gameDuration: number,active: number) {
//     this.id = id;
//     this.code = code;
//     this.name = name;
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//     this.sensorX = sensorX;
//     this.sensorY = sensorY;
//     this.sensorRadious = sensorRadious;
//     this.cuePosition = cuePosition;
//     this.numGuestInCue = numGuestInCue;
//     this.numGuestInGame = numGuestInGame;
//     this.gameDuration = gameDuration;
//     this.active = active;
  

//     this.updateBoundingBox();
//   }

//   contains(px: number, py: number): boolean {
//     const safeMargin = 10;
//     return px >= this.x - safeMargin && px <= this.x + this.width + safeMargin &&
//           py >= this.y - safeMargin && py <= this.y + this.height + safeMargin;
//   }

 
//   collitionExit(px: number, py: number, guest: Guest): void {
//     let uC = this.getCuadrant({x: guest.x, y: guest.y}, this);
//     let tC = this.getCuadrant({x: guest.targetX, y: guest.targetY}, this);
//       // let secondPoint         = { x: 0, y: 0 };
//     if(uC<=11 && tC<=11 ) {
//       guest.secondPoint       = this.exitPoints[this.exits[uC][tC]]; 
//       guest.needSecondPoint   = true;
//     }
//   }

//   getCuadrant(o : any ,a : Attraction) : number {
//     let res = -1;
//     if(o.x < a.x && o.y < a.y )                                         res = 0;
//     if(o.x > a.x &&  o.x < a.center.x  && o.y < a.y )                   res = 1;
//     if(o.x > a.center.x &&  o.x < a.x + a.width && o.y < a.y )          res = 2;
//     if(o.x > a.x + a.width && o.y < a.y )                               res = 3;
//     if(o.x > a.x + a.width && o.y > a.y && o.y < a.center.y)            res = 4;
//     if(o.x > a.x + a.width && o.y >a.center.y && o.y < a.y + a.width)   res = 5;
//     if(o.x > a.x + a.width && o.y > a.y + a.height)                     res = 6;
//     if(o.x > a.center.x && o.x < a.x + a.width && o.y > a.y + a.height) res = 7;
//     if(o.x > a.x && o.x < a.center.x && o.y > a.y + a.height)           res = 8;
//     if(o.x < a.x && o.y > a.y + a.height)                               res = 9;
//     if(o.x < a.x && o.y > a.center.y && o.y < a.y + a.height)           res = 10;
//     if(o.x < a.x && o.y < a.center.y && o.y > a.y )                     res = 11;
//     return res;
//   }


//   updateBoundingBox() {

//       switch (this.cuePosition) {
//         case 0: // top
//           this.cueBoundingBox = { x: 0, y: 0, width: this.width - 2 , height: 20 };
//           break;
//         case 1: // right
//           this.cueBoundingBox = { x: this.width - 22, y: 0, width: 20, height: this.height -2};
//           break;
//         case 2: // bottom
//           this.cueBoundingBox = { x: 0, y: this.height - 20, width: this.width - 2, height: 20 };
//           break;
//         case 3: // left
//           this.cueBoundingBox = { x: 0, y: 0, width: 20, height: this.height };
//           break;
//         default:
//           this.cueBoundingBox = { x: this.x, y: this.y, width: 20, height: 20 };
//           break;
//     }
//     this.center = {
//       x: this.x + this.width / 2,
//       y: this.y + this.height / 2
//     };

//     let offset = 25; 
//     let e1 = {x : this.x - offset,y : this.y - offset};
//     let e2 = {x : this.x + this.width + offset,y : this.y - offset};
//     let e3 = {x : this.x + this.width + offset,y : this.y + this.height + offset};
//     let e4 = {x : this.x - offset,y : this.y + this.height + offset};

//     this.exitPoints = [
//       {x : 0,y :  0},  
//       {x : this.x - offset,y : this.y - offset},
//       {x : this.x + this.width + offset,y : this.y - offset},
//       {x : this.x + this.width + offset,y : this.y + this.height + offset},
//       {x : this.x - offset,y : this.y + this.height + offset}
//     ];
//   }
// }

// export class Guest {
  // id                : number;
  // tag_id            : string; 
  // gender            : string;
  // entry_time        : string;
  // exit_time         : string;
  // visit_date        : Date;
  // has_disability    : number;
  // disability_type   : string | null;
  // title             : string;
  // first_name        : string;
  // last_name         : string;
  // email             : string;
  // dob               : Date;
  // dob_age           : number;
  // registered_date   : Date;
  // registered_age    : number;
  // phone             : string;
  // cell              : string;
  // nat               : string;
  // uuid              : string;
  // username          : string;
  // password          : string;
  // sha1              : string;
  // picture_large     : string;
  // created_at        : Date;


  // // SIMULATOR DATA
  // x                   : number     = Math.floor(Math.random() * 1000); // Random x position within bounds
  // y                   : number     = Math.floor(Math.random() * 1000); // Random y position within bounds
  // targetX             : number     = Math.floor(Math.random() * 1000); // Target x position for movement
  // targetY             : number     = Math.floor(Math.random() * 1000); // Target y position for movement
  // status              : WalkStatus = WalkStatus.WalkingAround;
  // currentAttractionId : number     = -1; // Current attraction ID the guest is in

  // canWalkX            : boolean    = true; // Flag to indicate if the guest can walk
  // canWalkY            : boolean    = true; // Flag to indicate if the guest can walk
  // cueIndex            : number     = -1; // Index of the attraction queue the guest is in

  // guestReady         : boolean    = false; // Flag to indicate if the guest is ready to enter the attraction
  // stuckCounter       : number     = 0; // Counter to track if the guest is stuck
  // secondPoint        = { x: 0, y: 0 }; // Second point for movement
  // lastPoint        = { x: 0, y: 0 };
  // needSecondPoint    : boolean    = false; // Flag to indicate if a second point is needed
  // tagTimerCounter  : number     = 0; // Counter for tag timer
  // isStuck          : boolean    = false; // Flag to indicate if the guest is stuck
  // stuckRetryCounter: number     = 0; // Counter for stuck recovery

  // stcukOption:string = "";

  // constructor(id:number, tag_id:string, gender:string, entry_time:string, exit_time:string, visit_date:Date, has_disability:number, disability_type:string | null, title:string, first_name:string, last_name:string, email:string, dob:Date, dob_age:number, registered_date:Date, registered_age:number, phone:string, cell:string, nat:string, uuid:string, username:string, password:string, sha1:string, picture_large:string, created_at:Date) {
  //   this.id                = id;
  //   this.tag_id            = tag_id;
  //   this.gender            = gender;
  //   this.entry_time        = entry_time;
  //   this.exit_time         = exit_time;
  //   this.visit_date        = visit_date;
  //   this.has_disability    = has_disability;
  //   this.disability_type   = disability_type;
  //   this.title             = title;
  //   this.first_name        = first_name;
  //   this.last_name         = last_name;
  //   this.email             = email;
  //   this.dob               = dob;
  //   this.dob_age           = dob_age;
  //   this.registered_date   = registered_date;
  //   this.registered_age    = registered_age;
  //   this.phone             = phone;
  //   this.cell              = cell;
  //   this.nat               = nat;
  //   this.uuid              = uuid;
  //   this.username          = username;
  //   this.password          = password;
  //   this.sha1              = sha1;
  //   this.picture_large     = picture_large;
  //   this.created_at        = created_at;
  // }
// }



export class Site {
  uuid            = ""
  name            = ""
  useWebSockets   = true
  wsAddress       = ""
  wsPort          = 0
  floorPlan       = ""
  devices         : Array<Device> = new Array<Device>()

  constructor(uuid:string,name:string,useWebSockets:boolean,wsAddress:string,wsPort:number,floorPlan:string){
    this.uuid           = uuid
    this.name           = name
    this.useWebSockets  = useWebSockets
    this.wsAddress      = wsAddress
    this.wsPort         = wsPort
    this.floorPlan      = floorPlan
  }

}

export class Device {
  uuid            = ""
  name            = "Device Name"
  ipAddress       = "0.0.0.0"
  macAddress      = "00:00:00:00:00:00"
  icon            = ""
  status          = 0
  type            = 0
  comPortEnable   = false 
  comPort         = 0
  pjLinkEnable    = false
  port            = 0 
  pjLinkStatus    = 0
  wolEnable       = false 
  x               = 0 
  y               = 0 
  pjLinkData      = new PJLinkData()

  selected        = false

  constructor(uuid:string,name:string,ipAddress:string,macAddress:string,icon:string,status:any,type:any,comPortEnable:boolean,comPort:number,pjLinkEnable:boolean,port:number,pjLinkStatus:any,wolEnable:boolean,x:number,y:number){
    this.uuid           = uuid
    this.name           = name
    this.ipAddress      = ipAddress
    this.macAddress     = macAddress
    this.status         = status.rawValue
    this.type           = type.rawValue
    this.comPortEnable  = comPortEnable
    this.comPort        = comPort
    this.pjLinkEnable   = pjLinkEnable
    this.port           = port
    this.pjLinkStatus   = pjLinkStatus.rawValue
    this.wolEnable      = wolEnable
    this.x              = x
    this.y              = y

    switch(icon){
      case "videoprojector" : this.icon = "projector"; break;
      case "shareplay"      : this.icon = "podcast"; break;
      case "xserve"         : this.icon = "server"; break;
      case "display"        : this.icon = "monitor"; break;
      case "web.camera"     : this.icon = "webcam"; break;
      default : this.icon = icon; break;
    }
  }
}


export class DeviceData {
  // id              = 0 
  // idLocation      = 0
  // idAttraction    = 0
  // deviceType      = ""
  // name            = "Device Name"
  // ipAddress       = "0.0.0.0"
  // macAddress      = "00:00:00:00:00:00"
  // inPort          = 0
  // outPort         = 0
  // locationX       = 0
  // locationY       = 0
  // active          = false
  // connectionType  = "TCP"
  // status          = 0

  // selected        = false

  // icon            = ""


  id              = 0 
  idLocation      = 0
  idAttraction    = 0
  deviceIndex     = 0
  code            = ""
  deviceType      = ""
  name            = "Device Name"
  ipAddress       = "0.0.0.0"
  macAddress      = "00:00:00:00:00:00"
  inPort          = 0
  outPort         = 0
  locationX       = 0
  locationY       = 0
  active          = false
  protocol        = "TCP"

  status          = 0
  selected        = false
  icon            = ""




  constructor(id:number,idLocation:number,idAttraction:number,deviceType:string,name:string,ipAddress:string,macAddress:string,inPort:number,outPort:number,locationX:number,locationY:number,active:number,protocol:string){
    this.id              = id
    this.idLocation      = idLocation
    this.idAttraction    = idAttraction
    this.deviceType      = deviceType
    this.name            = name
    this.ipAddress       = ipAddress
    this.macAddress      = macAddress
    this.inPort          = inPort
    this.outPort         = outPort
    this.locationX       = locationX
    this.locationY       = locationY
    this.active          = active == 1 ? true : false;
    this.protocol        = protocol;
    this.status          = 0
    
    switch(this.deviceType){
      case "None"         : this.icon = "border-none-variant"; break;
      case "Server"       : this.icon = "server"; break;
      case "Tablet"       : this.icon = "tablet"; break;
      case "WebCam"       : this.icon = "webcam"; break;
      case "Audio"        : this.icon = "podcast"; break;
      case "Power"        : this.icon = "power"; break;
      case "Lighting"     : this.icon = "lightbulb-on-outline"; break;
      case "Control"      : this.icon = "remote"; break;
      case "AudioControl" : this.icon = "volume-high"; break;
      case "Projector"    : this.icon = "projector"; break;
      case "MediaPlayer"  : this.icon = "multimedia"; break;
      case "RFIDReader"   : this.icon = "tag-arrow-up-outline"; break;
      case "RFIDAntenna"  : this.icon = "antenna"; break;
      case "Computer"     : this.icon = "laptop"; break;
      case "VRGlasses"    : this.icon = "safety-goggles"; break;
      case "AccessDoor"   : this.icon = "door-closed-lock"; break;
      case "Switch"       : this.icon = "router-network"; break;
      case "Router"       : this.icon = "router-wireless"; break;
      default : this.icon = "laptop"; break;
    }
  }
}


export class LocationData {
  id              = 0
  name            = "Location Name"
  description     = "Location Description"
  active          = false

  selected        = false
  constructor(id:number,name:string,description:string,active:boolean){
    this.id              = id
    this.name            = name
    this.description     = description
    this.active          = active
  }
}

export class AttractionData {
  id              = 0
  idLocation      = 0
  code            = "Attraction Code"
  name            = "Attraction Name"
  active          = false
  selected        = false
  constructor(id:number,idLocation:number,code:string,name:string,active:boolean){
    this.id              = id
    this.idLocation      = idLocation
    this.code            = code
    this.name            = name
    this.active          = active
  }
}

export class PJLinkData {
  name        = ""
  statusLabel = "OFF"
  status      = 0
  lamp1       = 0
  lamp2       = 0
  lamp1Hours  = 0
  lamp2Hours  = 0

  updateData(data:any){
    this.name       = data.name
    this.status     = parseInt(data.status)
    this.lamp1      = parseInt(data.lamp1)
    this.lamp2      = parseInt(data.lamp2)
    this.lamp1Hours = parseInt(data.lamp1Hours)
    this.lamp2Hours = parseInt(data.lamp2Hours)

    switch(this.status){
      case 0 : this.statusLabel = "OFF"; break;
      case 1 : this.statusLabel = "ON"; break;
      case 2 : this.statusLabel = "COOLING DOWN"; break;
      case 3 : this.statusLabel = "WARMING"; break;
    }
   
  }

}


// export class Node {
//   id                  = 0
//   uuid                = ""
//   x                   = 0
//   y                   = 0
//   ipAddress           = "0.0.0.0"
//   type                = "NODE"
//   deviceName          = ""
//   properties          : Array<NodeProperty> = Array<NodeProperty>()
//   localNode           = false

//   constructor(id:number,uuid:string,ipAddress:string,type:string,deviceName:string,properties:any){
//     this.id                  = id         
//     this.uuid                = uuid      
//     this.x                   = 0         
//     this.y                   = 0         
//     this.ipAddress           = ipAddress 
//     this.type                = type      
//     this.deviceName          = deviceName
//     this.properties          = properties
//   } 
// }

// export class NodeProperty {
//   name               : string = ""
//   value              : string = ""
//   type               : string = ""
//   label              : string = ""
//   isToggleSwitch     = false
  
//   constructor(name:string,value:string){    
//     this.name                = name.split("_")[1].toUpperCase();
//     this.value               = value
//     var tempType             = name.split("_")[0]

//     switch(tempType){
//       case "p"    : this.type = "node-property";  break;
//       case "l"    : this.type = "node-label";     break;
//       case "s"    : this.type = "node-toggle-button";  this.isToggleSwitch = true;  break;
//     }

//     switch(this.name){
//       case "TEMP" :
//         this.label = this.value + "°C"
//         break;
//       case "HUM" :
//         this.label = this.value + "%"
//         break;
//       case "R0" :
//         this.label = (this.value == "1" ? "ON" : "OFF")
//         break;
//       case "R1" :
//         this.label = (this.value == "1" ? "ON" : "OFF")
//         break;
//       case "X" :
//         this.label = this.value + "px"
//         break;
//       case "Y" :
//         this.label = this.value + "px"
//         break;
//     }

//   }

// }


// @Injectable()
// export class TipoServicio {
//   id          = 0
//   name        = ""
// }

// @Injectable()
// export class Empleado {
//   id          = 0
//   idPuesto    = 0
//   paterno     = ""
//   materno     = ""
//   nombre      = ""
// }

// @Injectable()
// export class Positions {
//   idPuesto             = 0
//   codigoPuesto         = 0
//   Puesto               = ""
//   idPuestoSuperior     = ""
//   nombre               = ""
// }
// @Injectable()
// export class Cuadrillas {
//   idCuadrilla = 0;
//   idSupervisor = 0;
//   Fecha     ="";
//   HoraInicio =""
//   HoraFin = ""
//   Comentarios = "";
//   nombre = "";
//   Turno = "";
//   TurnoName = "";
//   apellidoPaterno = "";
//   apellidoMaterno = "";
// }

// export class PrinterObjetc {
//   uuid            = ""
//   name            = ""
//   ipAddress       = ""
//   port            = 0
// }



export class MenuItem {
  index    : number  = 0
  menuId   : string  = ""
  name     : string  = ""
  icon     : string  = ""
  tag      : string  = ""
  selected : boolean = false
  state    : number  = 0
  icons    : Array<MenuItem>  = new Array<MenuItem>

  constructor(index:number, name: string, icon: string,  tag: string, icons: Array<MenuItem>) {
       this.index = index
       this.name   = name
       this.icon   = icon
       this.tag    = tag
       this.icons  = icons
  }
}

export class MenuSection  {
   index        : number  = 0
   sectionId    : string  = ""
   name         : string  = ""
   icon         : string  = ""
   menuItems    : Array<MenuItem>  = new Array<MenuItem>
   isOpen       : boolean = false

   constructor(index : number, name: string, icon: string, isOpen : boolean ,  menuItems:  Array<MenuItem>) {
       this.index      = index
       this.name       = name
       this.icon       = icon
       this.menuItems  = menuItems
       this.isOpen     = isOpen
   }
}
 
export class SitesData {
   sites    : Array<SiteData>  = new Array<SiteData>
}

export class SiteData {
  uuid             : string        = ""
  name             : string        = ""
  useWebSockets    : boolean       = true
  wsAddress        : string        = ""
  wsPort           : number        = 0
  floorPlan        : string        = ""
  devices          : Array<SiteDevice>  = new Array<SiteDevice>
}
   
export class SiteDevice {
   uuid               : string        = ""
   name               : string        = "Device Name"
   ipAddress          : string        = "0.0.0.0"
   macAddress         : string        = "00:00:00:00:00:00"
   port               : number        = 0
   x                  : number        = 0
   y                  : number        = 0
   type               : RawValue      = new RawValue(0)
   status             : RawValue      = new RawValue(0)
   statusColor        : RawValue      = new RawValue(0)
   icon               : string        = ""
   update             : boolean       = false
   wolEnable          : boolean       = false
   pjLinkEnable       : boolean       = false
   comPortEnable      : boolean       = false
   comPort            : number        = 0
   pjLinkStatus       : RawValue      = new RawValue(0)

   px                 : number        = 0
   py                 : number        = 0
}

export class RawValue {
   rawValue : number = 0
   constructor(value:number) {
       this.rawValue = value
   }
}

export class AlertData {
   title   = "Alert Title"
   message = "Alert Message"
   sender  = ""
   confirm = "OK"
   cancel  = "Cancel"
   type    = 0
   show    = false
   showCancel = false
}


