// Initialize the Phaser Game object and set default game window size
//const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
//  preload: preload,
//  create: create,
//  update: update })

// Declare shared variables at the top so all methods can access them
let score = 0
let scoreText
let platforms
let diamonds
let cursors
let player
let barb

var Game = {};
var playerMap = {}; 

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
  // Load & Define our game assets
  game.load.image('sky', 'assets/sky.png')
  game.load.image('ground', 'assets/platform.png')
  game.load.image('diamond', 'assets/diamond.png')
  game.load.spritesheet('tiles', 'assets/RuinGroundTiles.png', 160, 80)
  
  game.load.spritesheet('barb', 'assets/walk.png', 88, 99)
}

Game.create = function(){
console.log("Create this happened")

  game.physics.startSystem(Phaser.Physics.ARCADE)
  sky = game.add.sprite(0, 0, 'sky')
  
  tiles = game.add.group()
  platforms = game.add.group()
  
  platforms.enableBody = true
  let ground = platforms.create(0, game.world.height - 64, 'ground')
  
  ground.scale.setTo(2, 2)
  ground.body.immovable = true
  
  let ledge = platforms.create(400, 450, 'ground')
  ledge.body.immovable = true

  ledge = platforms.create(-75, 350, 'ground')
  ledge.body.immovable = true
  cursors = game.input.keyboard.createCursorKeys() 
  
  sky.inputEnabled = true;
  sky.events.onInputDown.add(Game.getCoordinates, this);
  Client.askNewPlayer()
  
  console.log("Retrieved player -> " + player)
}
 

Game.getCoordinates = function(layer,pointer){
	console.log("Create this happened")
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
	
	 playerMap[id] = game.add.sprite(x, y, 'barb')
	 console.log(playerMap[id])
};

Game.createTerain = function() {
	 console.log('crazy' + player)

	 player.body.velocity.x = 0

	//Setup collisions for the player, diamonds, and our platforms
	game.physics.arcade.collide(player, platforms)
	game.physics.arcade.collide(diamonds, platforms)
}

Game.movePlayer = function(id,x,y){
	player = playerMap[id];
    var player = playerMap[id];
    player.x = x;
	player.y = y;
};


Game.removePlayer = function(id){
   console.log(playerMap[id]);
   playerMap[id].destroy();
   delete playerMap[id];
};

