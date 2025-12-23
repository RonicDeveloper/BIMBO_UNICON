import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpHandler, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { SystemGlobals } from '../models/SystemGlobals';
import { catchError, throwError } from 'rxjs';
import { EventService } from '../models/global-events';


@Injectable()
export class MainService{
    public headers:HttpHeaders;
    public  postHeaders:HttpHeaders;
    ready   = false
    counter = 0
    public  errorMessage : {
        message:string,
        status:number,
        statusText:string
     } | null = null;   

    constructor(public _http:HttpClient){
        this.headers    =  new HttpHeaders({
            'Content-Type':'application/x-www-form-urlencoded'
        });

         this.postHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        });
    }

    mainService(request:object,service:string){
        let params = 'params='+JSON.stringify(request)
        return this._http.post(SystemGlobals.SERVICE_URL+service+'.php',params,{headers:this.headers});
    }


    // updateService(request:object){
    //     let params = 'params='+JSON.stringify(request)
    //     return this._http.post(SystemGlobals.SITE_URL+"/___Services/Updater.php",params,{headers:this.headers});
    // } 

    tagNotification(params:object){
        let body = JSON.stringify(params)
        let response =  this._http.post(SystemGlobals.API_TAGS_ENDPOINT+SystemGlobals.API_TAGS_NOTIFICATIONS ,body,{headers:this.postHeaders}).pipe(
            catchError(this.handleError.bind(this))
        );
        return response;
    }
   

    POSService(params:object,auth:boolean=true,token:string=""){
        let body = JSON.stringify(params)
        if(auth){ // BEARER TOKEN
            if(token){
                this.postHeaders = this.postHeaders.set('Authorization','Bearer '+token);
            }
        } else {
            this.postHeaders = this.postHeaders.delete('Authorization');
        }
        let response = this._http.post(SystemGlobals.API_POS_ENDPOINT,body,{headers:this.postHeaders}).pipe(
            catchError(this.handleError.bind(this))
        );
        return response;
    }

    handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.log(error);
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
        }
        EventService.sendEvent("SHOW_ALERT","main_Service",{title:`Error ${error.status}`,message:`${error.statusText} : ${JSON.stringify(error.error)}`,confirm:"OK",cancel:"Cancel",sender:"main_Service",showCancel:false})
        return ;   
    }

}