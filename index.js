var express = require("express");
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');
const dateFormat = require("dateformat");

var app = express();


app.use(express.static("webapp"));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/webapp/view/index.html"));
});


const server = http.createServer(app);
var wss = new WebSocket.Server({ server: server, port: 3001 });

var content = fs.readFileSync(path.join(__dirname + "/data/points.json"), "utf8");

wss.on('connection', function(ws, req){
    var self = this;
   console.log("Connection");

   ws.on('message', function(data){
       self.broadcast(data);
   });

    ws.on('error', function(err){
        console.log(err);
    });
});

wss.broadcast = function(data) {
    wss.clients.forEach(function(client){
       if (client.readyState === WebSocket.OPEN){
           client.send(data);
       }
    });
};

server.listen(3000, function listening() {
    console.log('Listening on %d', server.address().port);
});