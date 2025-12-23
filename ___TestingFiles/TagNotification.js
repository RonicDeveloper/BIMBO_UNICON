/*
Required npm package: http
To run: node TagNotification.js
This code sends a test TAG_EVENT notification to a testing HTTP endpoint.
Make sure to install the 'http' package using npm if you haven't already:
npm install http

The "YYYY-MM-DD HH:MM:SS" format is required by the server.
The ReadPointName should match an existing read point in the system. (attractionCode)
*/
const http = require('http');

let testEndpoint    = "bimbo-server.lan";                       // vps testing
let testPort        = 4334;                                     // vps testing port
let apiPath         = "/api/rfidnotifications";                 // API path
let attractionCode  = "ND-02-01-05";                               // Existing read point name

function timeStamp() {
  const pad2 = (n) => String(n).padStart(2, '0');
  const now  = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
}

const data = JSON.stringify({
  Inst               : "TAG_EVENT",                             // Instruction type
  NotificationType   : "entrance",                              // Type of notification (entrance, exit, tap)
  Identifier         : "15",                                    // Unique identifier for the tag
  ReadTime           : timeStamp(),                             // Time the tag was read in "YYYY-MM-DD HH:MM:SS" format
  ReadPointName      : attractionCode                           // Name of the read point (attractionCode)
});

const options = {
  hostname: testEndpoint,
  port: testPort,
  path: apiPath,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();



