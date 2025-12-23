/*
Required npm package: ws
To run: node WebSocket.js
This code connects to a WebSocket server, registers the client with an attraction code, and processes incoming TAG_EVENT messages.
It includes an optional TagEvent class to structure the tag read event data.
You can customize the attractionCode variable to filter events for a specific attraction or use "*" to accept all events.
Make sure to install the 'ws' package using npm if you haven't already:
npm install ws

Example of incoming TAG_EVENT message:
{
  "inst": "TAG_EVENT",
  "notificationType": "entrance",
  "identifier": "1AD40DD0132F374F54",
  "readTime": "2025-09-23 13:43:07",
  "readPointName": "NM-01-01",
  "guest": {
    "id": 4,
    "identifier": "1AD40DD0132F374F54",
    "gender": "female",
    "firstName": "Linda",
    "familyName": "Colón",
    "lastName": "Colón",
    "age": 0,
    "mail": "linda.colon@example.com",
    "hasDisability": 1,
    "disability": "wheelchair",
    "phone": "(623) 429 1904",
    "creationDate": "2025-09-12 17:51:58",
    "picture": "https://randomuser.me/api/portraits/women/35.jpg",packe
    "zipCode": "45050",
    "language": "SP"
  }
}  
*/  
    
const WebSocket     = require('ws');
const fs = require('fs');
const { match } = require('assert');
let remoteUUID      = "";
let localIpAddress  = "";
let attractionCode  = "ND-02-01-*";                                              // "*" to accept all attraction notifications
let testEndpoint    = "wss://bimbo-server.lan:3443/ws";                 // vps testing

const ws            = new WebSocket(testEndpoint, {                     // WebSocket client
    ca: fs.readFileSync('rootCA.pem'), 
    rejectUnauthorized: true
});                    

class Guest {                                                           // OPTIONAL Guest class to represent a user
    constructor(data){
        this.id            = data.id || 0;
        this.identifier    = data.identifier || "";                     // Tag identifier
        this.gender        = data.gender || "";                         // User gender
        this.firstName     = data.firstName || "";                      // User first name
        this.familyName    = data.familyName || "";                     // User family name
        this.lastName      = data.lastName || "";                       // User last name
        this.age           = data.age || 0;                             // User age
        this.mail          = data.mail || "";                           // User email
        this.hasDisability = data.hasDisability || 0;                   // 0 = no, 1 = yes
        this.disability    = data.disability || "";                     // Disability type
        this.phone         = data.phone || "";                          // Phone number
        this.creationDate  = data.creationDate || "";                   // Creation date in "YYYY-MM-DD HH:MM:SS" format
        this.picture       = data.picture || "";                        // Picture URL
        this.zipCode       = data.zipCode || "";                        // Zip code
        this.language      = data.language || "EN";                     // Language (EN, SP, etc.)
        this.activities    = data.activities || [];                       // Array of user activities
    }
}

class TagEvent{                                                         // OPTIONAL TagEvent class to represent a tag read event
    constructor(data){
        this.inst             = "TAG_EVENT";
        this.notificationType = data.notificationType || "entrance";    // "entrance" , "exit" or "tap"
        this.identifier       = data.identifier;                        // Tag identifier
        this.readTime         = data.readTime;                          // Read time in "YYYY-MM-DD HH:MM:SS" format
        this.readPointName    = data.readPointName;                     // Read point name (attractionCode)
    }
}

function matchAttraction(subscription, attractionCode) {
  if (subscription === '*') return true;

  const subParts  = subscription.split('-');
  const codeParts = attractionCode.split('-');

  if (subParts.length !== codeParts.length) return false;

  for (let i = 0; i < subParts.length; i++) {
    if (subParts[i] === '*') continue;
    if (subParts[i] !== codeParts[i]) return false;
  }

  return true;
}


ws.onopen = () => {                                                     // Connection opened
    console.log('[CLIENT CONNECTED]');
};

ws.onmessage = (event) => {                                             // Message received
    processMessage(event.data);
};

ws.onclose = () => {                                                    // Connection closed                 
    console.log('[CLIENT CLOSED]');
};

ws.onerror = (error) => {                                               // Connection error
    console.error('[CLIENT ERROR]', error);
};

function processMessage(message) {                                      // Process incoming messages
    let data = JSON.parse(message);
    switch(data.inst) {

        case "CLIENT_WELCOME":                                          // First message after connection
            remoteUUID       = data.uuid;                               // Unique client ID
            localIpAddress   = data.localIp;                            // Local IP address of this client
            ws.send(JSON.stringify({                                    // Register this client
                inst: "REGISTER_CLIENT",                                // Instruction
                ipAddress: localIpAddress,                              // Local IP address
                uuid: remoteUUID,                                       // Unique client ID
                attractionCode: attractionCode,                         // Attraction code or "*" to accept all
            }));
            break;

        case "CLIENT_REGISTERED":                                       // Confirmation of client registration
            console.log(data);
            break;

        case "TAG_EVENT":                                               // Notification of a tag read event
            const tagEvent = new TagEvent(data);                        // (Handle TAG_EVENT) Create TagEvent object
            const tagUser  = new Guest(data.guest || {});               // (Handle TAG_EVENT) Create Guest object
            console.log(tagEvent);                                      // (Handle TAG_EVENT) Process the tag event and user data
            console.log(tagUser);                                       // (Handle TAG_EVENT) Process the user data
            break;

    }
}