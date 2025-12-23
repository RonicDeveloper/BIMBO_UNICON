require('dotenv').config();
const net               = require('net');
const WebSocket         = require('ws');
const fs                = require('fs');
const { createPool }    = require('mysql2/promise');
const TcpDoorClient = require('./TcpDoorClient');


class TagEvent{                                                         // OPTIONAL TagEvent class to represent a tag read event
    constructor(data){
        this.inst             = "TAG_EVENT";
        this.notificationType = data.notificationType || "entrance";    // "entrance" , "exit" or "tap"
        this.identifier       = data.identifier;                        // Tag identifier
        this.readTime         = data.readTime;                          // Read time in "YYYY-MM-DD HH:MM:SS" format
        this.readPointName    = data.readPointName;                     // Read point name (attractionCode)
    }
}

DOOR_NUMBER = 0;
const CONTROL_PORT  = 2357;
let remoteUUID      = "";
let localIpAddress  = "";
let ACCESS_ATTRACTION_CODE  = "TR-01-*";  
let DOOR_1_AATTRACTION_CODE = "TR-01-01";  
let DOOR_2_AATTRACTION_CODE = "TR-01-02";                                      
let testEndpoint    = "wss://bimbo-server.lan:3443/ws";        


const door1 = new TcpDoorClient({
  name: 'DOOR 1',
  host: '192.168.33.66',
  port: CONTROL_PORT,
  pingInterval: 60000,
  pingBuffer: Buffer.from([0x02,0x10,0x03]),
  onData: (data, door) => {
    console.log(`[${door.name}] RX:`, data.toString('hex'));
  }
});

const door2 = new TcpDoorClient({
  name: 'DOOR 2',
  host: '192.168.33.67',
  port: CONTROL_PORT,
  pingInterval: 60000,
  pingBuffer: Buffer.from([0x02,0x10,0x03]),
  onData: (data, door) => {
    console.log(`[${door.name}] RX:`, data.toString('hex'));
  }
});


const ws            = new WebSocket(testEndpoint, {                   
    ca: fs.readFileSync('rootCA.pem'), 
    rejectUnauthorized: true
}); 

const pool = createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASS, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  dateStrings: true ,
  connectionLimit: 100,
  maxIdle: 10,
  idleTimeout: 60_000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000
});

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

async function getAccess(tagEvent, doorNumber ){
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM tags WHERE identifier = ?   AND active = 1  AND DATE(validDate) >= CURDATE()  AND (expirationDate IS NULL OR DATE(expirationDate) >= CURDATE())', [tagEvent.identifier]);
        if (rows.length > 0) {
            // console.log('[QUERY RESULT]', rows[0]);
            // Update accessDateField
            await conn.query('UPDATE tags SET accessDate = NOW() WHERE id = ?', [rows[0].id]);
            processAccess({ grantAccess: true, userData: rows[0] }, doorNumber);
        } else {
            processAccess({ grantAccess: false }, doorNumber);
        }
    } catch (e) {
        console.error('[ACCESS ERROR]', e.message);
    } finally {
        conn.release();
    }
}

function processAccess(accessData, doorNumber){
    let BufferData = Buffer.from([0x02, 0x00, 0x03]);
    if(accessData.grantAccess){
        console.log('[ACCESS GRANTED]');
        BufferData = Buffer.from([0x02, 0x01, 0x03]);
    } else {
        console.log('[ACCESS DENIED]');
    }

    if(doorNumber === 1){
        door1.send(BufferData);
    } else if(doorNumber === 2){
        door2.send(BufferData);
    }
}

function processMessage(message) { 
    let data = JSON.parse(message);
    switch(data.inst) {

        case "CLIENT_WELCOME":                                          
            remoteUUID       = data.uuid;                               
            localIpAddress   = data.ipAddress,
            console.log('[CLIENT WELCOME]', data);                           
            ws.send(JSON.stringify({                                    
                inst: "REGISTER_CLIENT",                                
                ipAddress: localIpAddress,                      
                uuid: remoteUUID,                                       
                attractionCode: ACCESS_ATTRACTION_CODE
            }));
            break;

        case "CLIENT_REGISTERED":                                       
            console.log(data);
            break;

        case "TAG_EVENT":     
            console.log(data);                   
            let tagEvent = new TagEvent(data);
            console.log('[TAG EVENT]', tagEvent.identifier, tagEvent.readPointName);  
            if(data.readPointName == DOOR_1_AATTRACTION_CODE){
                DOOR_NUMBER = 1;
                getAccess(tagEvent,1);
            }
            if(data.readPointName == DOOR_2_AATTRACTION_CODE){
                DOOR_NUMBER = 2;
                getAccess(tagEvent,2);
            }
            
            break;
    }
}

door1.start();
door2.start();

setInterval(async () => {try { await pool.query('SELECT 1');console.log('[POOL OK]'); } catch (e) { console.warn('[POOL ERROR]:', e.message); }}, 60_000);