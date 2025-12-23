import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Optional, SkipSelf} from '@angular/core';
import { MenuItem, MenuSection, User } from './Structs';

@Injectable()
export class SystemGlobals {
    static CONFIG_READY     = false
   
    static SOCKET_SERVER    = "";
    
    static MAC_ADDRESS      = "";
    // static SERVICE          = "MainServices";
    // static SITE_URL         = ""; // http://localhost
    static SITE_UUID        = ""; // http://localhost
    static USER_LEVEL       = 0;
    static logginStatus     = false;
    static useSystemControl = false;
    static API_KEY         = "";
    static API_URL         = ""; // Media Server
    static JWT_TOKEN       = "";
    static JWT_EXPIRES     = 0;

    static CONTENT_SCALE    = 1.0
    static CONTENT_WIDTH    = 1920.0
    static CONTENT_HEIGHT   = 1080.0
    static IS_MOBILE        = false;


    // -------------- NEW GLOBAL VARS ----------------
    static CONTROL_SOCKET_HOST       = "";
    static CONTROL_SOCKET_SERVER     = "";
    static CONTROL_SOCKET_PORT       = 0;

    static USE_LOCAL_SERVER          = true;
    static PROTOCOL                  = "";
    static VPS_HOST                  = "";
    static HOST                      = "";
    static SERVICE                   = "";
    static SERVICE_FOLDER            = "";

    static WEBSOCKET_PORT            = 0;
    static WEBSOCKET_SECURE_PORT     = 0;

    static API_MEDIA_PORT            = 0;
    static API_MEDIA_SECURE_PORT     = 0;
    static API_MEDIA_GET_TOKEN       = "";
    static API_MEDIA_TEST_TOKEN      = "";
    static API_MEDIA_CREATE_ACTIVITY = "";
    static API_MEDIA_UPLOAD          = "";
    static API_MEDIA_LIST            = "";
    static API_MEDIA_SHARE           = "";
    static API_MEDIA_KEY             = "";

    static API_TAGS_PORT             = 0;
    static API_TAGS_SECURE_PORT      = 0;
    static API_TAGS_KEY              = "";
    static API_TAGS_NOTIFICATIONS    = "";

    static API_POS_PORT              = 0;
    static API_POS_SECURE_PORT       = 0;
    static API_POS_KEY               = "";
    static API_POS_SALE              = "";
    static API_POS_SALE_STATUS       = "";

    static API_MEDIA_ENDPOINT        = ""; 
    static API_POS_ENDPOINT          = ""; 
    static API_TAGS_ENDPOINT         = "";
    static SITE_URL                  = ""; 
    static SERVICE_URL               = ""; 














    static selectedMenuIndex             = 0
    static selectedSubMenuIndex          = 0
    static selectedSecctionName     : String      = ""
    static selectedMenu             : MenuSection;
    static selectedSubMenu          : MenuItem;
    static USER:User;

    static user:any         = {
        IdUser:0,
        IdEmployee:0,
        IdPlant:0,
        Name:"Carlos",
        FamilyName:"Marquez",
        LastName:"",
        FullName:"",
        Mail:"",
        Level:1,
        UserImage:""
    };

    static getUniqueId(parts: number): string {
        const stringArr = [];
        for(let i = 0; i< parts; i++){
            const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            stringArr.push(S4);
        }
        return stringArr.join('-');
    }
}