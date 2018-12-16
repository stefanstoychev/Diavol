var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8088,function(){
    console.log('Listening on '+server.address().port);
});

var movements = {};

io.on('connection',function(socket){

    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayderID++,
			x:  150,
            y: 150
        };

        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('click',function(data){
            console.log('click to '+data.x+', '+data.y);
            socket.player.rotation = Math.atan2(data.y - socket.player.y, data.x - socket.player.x);
            
            var dx = Math.cos(socket.player.rotation) * 50;
            var dy = Math.sin(socket.player.rotation) * 50;

            var start = {"x" : socket.player["x"], "y" : socket.player["y"] };

            movements[socket.player.id] = { "socket": socket, "start" : start, "end" : data, "dx" : dx, "dy" : dy };
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

var movementesTimer = setInterval(myTimer, 500);

function myTimer() {
    
    Object.keys(movements).forEach(function(key) {
        var value = movements[key];
        var socket = value["socket"];

        console.log(value);
        var a = value["end"].x - value["start"].x;
        var b = value["end"].y - value["start"].y;
        var distance = Math.sqrt(a*a + b*b);
            
        console.log(distance);

        if(distance < 30){
            delete movements[key];
        } else {

        var x = value["start"].x + value["dx"];
        var y = value["start"].y + value["dy"];
            
        value["start"].x = x;
        value["start"].y = y;

        socket.player.x = x;
        socket.player.y = y;
            

        io.emit('move',socket.player);
        console.log(value);
        }
    });
}
