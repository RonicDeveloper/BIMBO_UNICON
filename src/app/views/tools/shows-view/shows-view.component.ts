import { AfterViewInit, Component,  OnInit} from '@angular/core';
import { MainService } from '../../../services/MainService';

import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../../models/global-events';
import { Guest, Show, ShowData, ShowSchedule, ShowSlot } from '../../../models/Structs';

@Component({
  standalone: true,
  selector: 'app-shows-view',
  templateUrl: './shows-view.component.html',
  styleUrl: './shows-view.component.css',
  imports: [CommonModule , AppIconModuleModule, MatIconModule],
  providers:[MainService]
})


export class ShowsViewComponent  implements OnInit, AfterViewInit{

  autoSelect    = true;
  connected = false
  waitTimer     = null;

  shows             : Array<Show>         = [];
  showSlots         : Array<ShowSlot>        = [];
  schedules         : Array<ShowSchedule> = [];
  selectedSlot      : ShowSlot | null        = null;
  selectedSchedule  : ShowSchedule | null = null;
  selectedShow      : Show | null         = null;


   totalShowSlots         : Array<ShowSlot>        = [];


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
    this.getShows();
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

  clearSelection(){
      this.schedules = [];
      this.showSlots = [];
      this.selectedSchedule = null;
      this.selectedSlot = null;
  }


  getShows(){
    var params = {
      method:"getShows",
      active:1
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.shows = result.data;
        this.clearSelection();
        if(this.autoSelect){
          this.selectedShow = this.shows[0];
          this.selectShow(this.shows[0]);
        }
      }
    });
  }

  selectShow(show:Show){
    this.selectedShow = show;
    this.shows.forEach(s=>{
      s.selected = false;
    })
    show.selected = true;
    this.getSchedules();
  }

  getSchedules(){
    var params = {
      method:"getShowSchedules",
      idShow: this.selectedShow?.id,
      active:1
    };
    this.clearSelection();
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.schedules = result.data;
        this.updateTotalSlots();
        if(this.autoSelect){
          this.selectedSchedule = this.schedules[0];
          this.selectShowSchedule(this.schedules[0]);
        }
      }

    });
  }

  getGuests(){
    var params = {
      method:"getShowGuests",
      idShow: this.selectedShow?.id,
      idSchedule: this.selectedSchedule?.id,
      registerDate: new Date().toISOString().split('T')[0]
    };
    this.service.mainService(params,"AdminTools").subscribe((result: any) =>  {
      if(result.success){
        this.showSlots = result.data;
        if(this.autoSelect && this.showSlots.length>0){
          this.selectedSlot = this.showSlots[0];
          this.selectShowSlot(this.showSlots[0]);
        }
        this.updateTotalSlots();
      }
    });
  }

  updateTotalSlots(){
    this.totalShowSlots = [];
    for(let i=0;i<this.selectedShow?.maxGuests;i++){
      let slot = new ShowSlot();
      slot.id = i+1;
      this.totalShowSlots.push(slot);
    }
    let guetsIndex = 0;
    this.showSlots.forEach(slot => {
      slot.selected = false;
      this.totalShowSlots[guetsIndex].guest = slot.guest;  
      this.totalShowSlots[guetsIndex].status = slot.status;  
      guetsIndex++;
    });
  }

  selectShowSlot(slot:ShowSlot){
    this.selectedSlot = slot;
    this.showSlots.forEach(s=>{
      s.selected = false;
    })
    slot.selected = true;
    
  }

  selectShowCard(slot:ShowSlot){
    this.selectedSlot = slot;
    this.totalShowSlots.forEach(s=>{
      s.selected = false;
    })
    slot.selected = true;
  }

  selectShowSchedule(schedule:any){
    this.selectedSchedule = schedule;
    this.schedules.forEach(s=>{
      s.selected = false;
    })
    schedule.selected = true;
    this.getGuests();
  }


  }