// Declare shared variables at the top so all methods can access them
let player

var Game = {};
var playerMap = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
  // Load & Define our game assets
  game.load.image('sky', 'assets/sky.png')
  game.load.spritesheet('barb', 'assets/walk.png', 88, 99)
}

Game.create = function(){

  game.physics.startSystem(Phaser.Physics.ARCADE)
  sky = game.add.sprite(0, 0, 'sky')
  sky.inputEnabled = true;
  sky.events.onInputDown.add(Game.getCoordinates, this);
  Client.askNewPlayer()

  console.log("Retrieved player -> " + player)
}

Game.getCoordinates = function(layer, pointer){
    console.log("getCoordinates executed")

    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){

     playerMap[id] = game.add.sprite(x, y, 'barb')

     player = playerMap[id];

     player.pivot.x= 44;
     player.pivot.y= 49;

     for(i = 0 ;i < 15; i++){
        key = 'walk' + i;
        console.log(key)
        frames = Array.from(new Array(7), (x,j) => j + i*8);
        player.animations.add(key, frames, 16, true)
     }

	 console.log(playerMap[id])
};

Game.movePlayer = function(id ,x ,y, rotation){
    var player = playerMap[id];

    angleInRads = rotation+Math.PI;
    normalised = angleInRads/(2*Math.PI);
    animationIndex =(Math.round(normalised*16)+4)%16;

    var tween = game.add.tween(player);
    tween.to({ "x": x, "y": y }, 1000);
    tween.start();

    console.log('rads: ' + angleInRads + 'norm: ' + normalised + 'key: ' + animationIndex)

    key = 'walk' +  animationIndex.toString();

    player.animations.play(key);
};


Game.removePlayer = function(id){
   console.log(playerMap[id]);
   playerMap[id].destroy();
   delete playerMap[id];
};
