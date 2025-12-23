import { Component, OnInit , AfterViewInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainService } from '../../services/MainService';
import { SystemGlobals } from '../../models/SystemGlobals';
import { EventService } from '../../models/global-events';
import { User } from '../../models/Structs';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css',
  providers:[MainService]
})
export class LoginViewComponent  implements OnInit,AfterViewInit  {
  
  username = "MarkX" 
  password = "cmm2kcmm2k"

  constructor(private service : MainService){
  }

  ngOnInit() {
      this.username = ""
      this.password = ""
      SystemGlobals.USER        = new User(0,"","","","",0,0,"",false);
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.checkLoginStatus()
      // this.login();
    },100)
  }

  checkLoginStatus(){
    var params = {
      method:"checkLoginStatus"
    };
    this.service.mainService(params,"Login").subscribe((result: any) =>  {
      if(result.success){
        if(result.user.logged){
          this.updateUserData(result.user)
          EventService.sendEvent("LOGIN","LOGIN_MODULE",result.user)
        }
      }
    });
  }

  login(){
    var params = {
      method:"loginUser",
      userName:this.username,
      password:this.password
    };
    this.service.mainService(params,"Login").subscribe((result: any) =>  {
      if(result.success){
        console.log("LOGIN RESULT", result)
        if(result.user.logged){
          this.updateUserData(result.user)
          EventService.sendEvent("LOGIN", "LOGIN_MODULE",result.user)
        } 
      }else {
        EventService.sendEvent("SHOW_ALERT","left_menu",{title:"Alert",message:result.errorMsg,confirm:"OK",cancel:"Cancel",sender:"left_menu",showCancel:false})
      }
    });
  }

  updateUserData(user:any){
    SystemGlobals.USER        = new User(
      user.id,
      user.name,
      user.familyName,
      user.lastName,
      user.mail,
      user.level,
      user.active,
      user.adminName,
      user.logged
    )
  }
}
