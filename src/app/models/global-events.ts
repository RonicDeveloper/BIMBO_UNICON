import { Injectable } from "@angular/core";
import { EventEmitter } from '@angular/core';



export class EventService {
    
    static emmiter = new EventEmitter()

    constructor() {
        
    }

    static sendEvent(type:String, sender:String, payload:any){

        var dataObject = {
            type : type,
            sender: sender,
            payload : payload
        }
        console.log("Event sent:", dataObject);
        EventService.emmiter.emit(dataObject)
    }
}