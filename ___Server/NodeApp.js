const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const WebSocketServer   = require('ws');
const wss               = new WebSocketServer.Server({ port: 6500 })



wss.on("connection", ws => {


    let ipAddress = ws._socket.remoteAddress.split(":")[3];
    let uuid = uuidv4();

    console.log("[NEW CLIENT] "+ ipAddress);
    
    let dataObject = {
        inst:"CLIENT_WELCOME",
        uuid:uuid,
        ipAddress:ipAddress
    }
    
    let nodesObject = {
        inst:"UPDATE",
        nodes:nodes
    }

    ws.send(JSON.stringify(nodesObject));
    ws.send(JSON.stringify(dataObject));
    
    ws.on("message", data => {
        processMessage(data);
    });

    nodes.push(new NodeItem(nodes.length,uuid,Math.random() * 900,Math.random() * 600,ws,ipAddress))

    // ws.on("close", () => {
    //     console.log("[CLIENT DISCONNECTED] "+ws._socket.remoteAddress.split(":")[3]);
    // });
    // ws.onerror = function () {
    //     console.log("[ERROR]")
    // }
});

var nodes               = [];


class NodeItem {
    constructor(id,uuid,x,y,ws,ipAddress){
        this.id                  = id
        this.uuid                = uuid
        this.x                   = x
        this.y                   = y
        this.tx                  = x
        this.ty                  = y
        this.ready               = false
        this.speed               = 0.01
        this.ipAddress           = ipAddress
        this.color               = "#"+((1<<24)*Math.random()|0).toString(16)
        this.type                = "NODE"
        this.ws                  = ws
        this.deviceName          = "Node "+id
        this.properties          = {}

        ws.on("close", () => {
            console.log("[CLIENT DISCONNECTED] "+this.ipAddress);
            removeNode(this.uuid)
        });
        ws.onerror = function () {
            console.log("[ERROR]")
            removeNode(this.uuid)
        }

        
        
    }
  
    update() {
        if (!this.ready) {
            this.ready = true
            this.x     = this.tx;
            this.y     = this.ty;
        }

        this.x     = (this.x * (1.0-this.speed)) + (this.tx * this.speed);
        this.y     = (this.y * (1.0-this.speed)) + (this.ty * this.speed);
        if(Math.abs(this.tx-this.x)<10){
            this.tx                  = Math.random() * 900
        }
        if(Math.abs(this.ty-this.y)<10){
            this.ty                  = Math.random() * 600
        }
    }
};


function sendNodes(){
    let dataObject = {
        inst:"UPDATE",
        nodes:nodes
    }
    wss.broadcast(JSON.stringify(dataObject));
}

function getNode(uuid){
    let resultNode = null
    nodes.forEach(node => {
        if(node.uuid == uuid){
            resultNode = node
        }
    });
    
    return resultNode
}

function removeNode(uuid){
    nodes.forEach(node => {
        if(node.uuid == uuid){
            wss.broadcast(JSON.stringify(   
                {
                    inst:"CLIENT_DISCONNECTED",
                    node:node
                }
            ));
            nodes.splice(nodes.indexOf(node),1);
        }
    });
}

function processMessage(data){

    if(data == null || data == undefined){
        return
    }

    var dataObject  = {}

    try {
        dataObject = JSON.parse(data);
    } catch (error) {
        console.log("[ERROR] "+error);    
        return
    }

    var inst        = dataObject.inst;
    var nodeData    = dataObject.node;
    var node        = getNode(nodeData.uuid)

    // console.log(nodeData)  ; 
    switch(inst){
       
        case "CLIENT_DISCONNECTED" :
            break;
        case "UPDATE" :
            sendNodes();
            break;
        case "UPDATE_NODE" :
            // let node = getNode(nodeData.uuid)
            if(node == null || node == undefined){
                return
            }
            node.x = nodeData.x
            node.y = nodeData.y
            
            if(node.type == "EMBEDED"){
                var props = Object.keys(nodeData.properties).map(key => ({type: key, value: nodeData.properties[key]}));
                props.forEach((prop) => {
                    node.properties[prop.type] = prop.value;
                });
                console.log(node.properties);
            }
            let dataObject = {
                inst:"UPDATE_NODE",
                node:node
            }
            wss.broadcast(JSON.stringify(dataObject));
            break;
        case "UPDATE_OUTPUTS":
            if(node == null || node == undefined){
                return
            }       
            if(node.type == "EMBEDED"){
                var props = Object.keys(nodeData.properties).map(key => ({type: key, value: nodeData.properties[key]}));
                props.forEach((prop) => {
                    node.properties[prop.type] = prop.value;
                });
            }
            // console.log(node);
            let outputObject = {
                inst:"UPDATE_NODE",
                node:node
            }
            wss.broadcast(JSON.stringify(outputObject));
            break;
        case "SET_RELAY" :
            // let relayNode = getNode(nodeData.uuid)
            // if(relayNode == null || relayNode == undefined){
            //     return
            // }
            if(node == null || node == undefined){
                return
            }
            
            wss.broadcast(JSON.stringify(
                {
                    inst: "SET_OUTPUT",
                    index: nodeData.index,
                    isOn: nodeData.isOn
                }
            ));
            break; 

        case "TOGGLE_RELAY" :
            // let relayNode = getNode(nodeData.uuid)
            // if(relayNode == null || relayNode == undefined){
            //     return
            // }
            if(node == null || node == undefined){
                return
            }
            
            // wss.broadcast(JSON.stringify(
            //     {
            //         inst: "TOGGLE_OUTPUT",
            //         index: nodeData.index
            //     }
            // ));
            node.ws.send(JSON.stringify({
                    inst: "TOGGLE_OUTPUT",
                    index: nodeData.index
                }
            ));

            
            break;    

        case "CLIENT_CONNECTED" :
            // let newNode  = getNode(nodeData.uuid);

            if(nodeData.type){
                console.log("[NEW NODE] "+nodeData.type);
                node.type       = nodeData.type;
                if(nodeData.deviceName != null){
                    node.deviceName = nodeData.deviceName;
                }
            }

            let replay = {
                inst:"NEW_CLIENT",
                node:node
            }
           
            wss.broadcast(JSON.stringify(replay));
            break;
    }

}

wss.broadcast = function broadcast(msg,all=false) {
    if(all){
        wss.clients.forEach(function each(client) {
            client.send(msg);
        });
    } else {
        for (let i = 0; i < nodes.length; i++) {
            if(nodes[i].type == "NODE"){
                nodes[i].ws.send(msg);
            }
        }
    }   
};

function updateNodes(){
    wss.broadcast('',true);
    nodes.forEach(node => {
        if(!node.ws.OPEN){
            console.log("[CLIENT DISCONNECTED] "+node.ipAddress);
            nodes.splice(nodes.indexOf(node),1);
            wss.broadcast(JSON.stringify({inst:"UPDATE",nodes}));
        }
    });
}


// setInterval(updateNodes,1000);
console.log("[SERVER STARTED]");