import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EventService } from '../../models/global-events';
import { MainAppComponent } from '../main-app/main-app.component';
import { WebSocketsComponent } from '../web-sockets/web-sockets.component';
import { MainViewComponent } from '../main-view/main-view.component';
import { DmxViewComponent } from '../dmx-view/dmx-view.component';
import { SystemViewComponent } from '../system-view/system-view.component';
// import { Attraction, Guest } from '../../models/Structs';
import { MainService } from '../../services/MainService';
import { TemplateViewComponent } from '../template-view/template-view.component';
import { AdminViewComponent } from '../admin-view/admin-view.component';
import { SalesViewComponent } from '../tools/sales-view/sales-view.component';
import { AutomationViewComponent } from '../automation-view/automation-view.component';
import { TagsViewComponent } from '../tools/tags-view/tags-view.component';
import { RegisterViewComponent } from '../tools/register-view/register-view.component';
import { ShowsViewComponent } from '../tools/shows-view/shows-view.component';
import { AccessControlViewComponent } from '../access-control-view/access-control-view.component';


@Component({
    selector: 'app-main-content',
    standalone: true,
    templateUrl: './main-content.component.html',
    styleUrl: './main-content.component.css',
    providers: [MainService]
})
export class MainContentComponent {

  @ViewChild('MainComponent', { read: ViewContainerRef }) MainComponentRef!: ViewContainerRef;





  constructor(private service : MainService){
    EventService.emmiter.subscribe((data)=>{
      this.eventHandler(data)
    })
    
  }

  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
    this.MainComponentRef.createComponent(AccessControlViewComponent)    //AutomationViewComponent
  }

  eventHandler(data:any){
   
    switch(data.type){
      case "SUB_MENU_EVENT":
        
        switch(data.sender){
          case "left_menu":
            switch(data.payload.selectedSubMenu){
              case "shows_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(ShowsViewComponent)
                break;
              case "registration_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(RegisterViewComponent)
                break;
              case "tags_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(TagsViewComponent)
                break;
              case "automation_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(AutomationViewComponent)
                break
              case "system_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(SystemViewComponent)
                break 
              case "sales_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(SalesViewComponent)
                break
              case "server_admin_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(AdminViewComponent)
                break
              case "web_sockets_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(WebSocketsComponent)
                break
              case "dmx_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(DmxViewComponent)
                break
              case "template_view":
                this.unloadComponet()
                this.MainComponentRef.createComponent(TemplateViewComponent)
                break 
              case "system_logout":
                EventService.sendEvent("SHOW_ALERT","left_menu",{title:"Alert",message:"End this session?",confirm:"OK",cancel:"Cancel",sender:"logout_user",showCancel:false})
                break
            }

            break
          case "right_menu":
        
            break
        }
       
    }
  }


  unloadComponet(){
    while(this.MainComponentRef.length != 0 ) {
      this.MainComponentRef.remove(0)
    }
  }

}
