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
			x: 150,
            y: 150,
            speed: 50
        };

        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('click',function(data){
            console.log('click to '+ data.x + ', ' + data.y);
            socket.player.rotation = Math.atan2(data.y - socket.player.y, data.x - socket.player.x);

            movements[socket.player.id] = { player: socket.player, destination : data };
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

function getDistance(pointA, pointB) {
    var x = pointA.x - pointB.x;
    var y = pointA.y - pointB.y;
    var distance = Math.sqrt(x*x + y*y);

    return distance;
}

function myTimer() {
    
    Object.keys(movements).forEach(function(key) {
        var movement = movements[key];
        var player = movement.player;
        
        var distance = getDistance(player , movement.destination)

        if(distance < 30){
            delete movements[key];
        } else {

            var dx = Math.cos(player.rotation) * player.speed;
            var dy = Math.sin(player.rotation) * player.speed;

            player.x += dx;
            player.y += dy;

            io.emit('move', player);
        }
    });
}