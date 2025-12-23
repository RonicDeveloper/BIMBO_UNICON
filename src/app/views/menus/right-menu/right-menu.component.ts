import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MenuItem, MenuSection } from '../../../models/Structs';
import { SystemGlobals } from '../../../models/SystemGlobals';
import { EventService } from '../../../models/global-events';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-right-menu',
    standalone: true,
    imports: [CommonModule, AppIconModuleModule, MatIconModule],
    templateUrl: './right-menu.component.html',
    styleUrl: './right-menu.component.css'
})
export class RightMenuComponent {
  isOpen = false;

  DEVICE_CONFIG = false
  DEVICE_POWER = false
  MOBILE_VIEW = false 

  
   ngOnInit(): void {
       EventService.emmiter.subscribe((data)=>{
        this.eventHandler(data)
      })
      this.MOBILE_VIEW = SystemGlobals.IS_MOBILE
  }


  toggleMenu(){
    this.isOpen = !this.isOpen  
    EventService.sendEvent("MENU_EVENT","right_menu",{isOpen:this.isOpen})
  }

  eventHandler(data:any){
    switch(data.type){
      case "":
       
        break;
    }
  }

  selectedTool = ""

  resetTools(){
 
  }

  setTool(tool:string){
    this.resetTools()
    this.selectedTool = tool
    switch(tool){
      case "" : 
      
        break
    }
    
  }

}
