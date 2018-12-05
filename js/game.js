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
  
  game.load.spritesheet('woof', 'assets/woof.png', 32, 32)
  game.load.spritesheet('barb', 'assets/walk.png', 88, 99)
}

Game.create = function(){

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
  Client.askNewPlayer()
}
 

Game.getCoordinates = function(player){

    Client.sendClick(player.x, player.y);
	console.log(player.x + " / " + player.y)
};

Game.addNewPlayer = function(id,x,y){
	
	 playerMap[id] = game.add.sprite(x, y - 150, 'woof')
     player = playerMap[id]
     game.physics.arcade.enable(player)
	 
	 //player physics properties. Give the little guy a slight bounce.
	 player.body.bounce.y = 0.2
	 player.body.gravity.y = 800
	 player.body.collideWorldBounds = true

     //Our two animations, walking left and right.
	 player.animations.add('left', [0, 1], 10, true)
	 player.animations.add('right', [2, 3], 10, true)
	
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
    var player = playerMap[id];
    var tween = game.add.tween(player);

    tween.to({x:x,y:y}, 1000);
   tween.start();
};

Game.update = function(){
		setTimeout(function(){
			player.body.velocity.x = 0

			//  Setup collisions for the player, diamonds, and our platforms
			game.physics.arcade.collide(player, platforms)
			game.physics.arcade.collide(diamonds, platforms)
			
			// Configure the controls!
			if (cursors.left.isDown) {
				player.body.velocity.x = -150
			
				player.animations.play('left')
				getCoordinates(player)
				//barb.animations.play('left')
				//barb.x-=2
				
			} else if (cursors.right.isDown) {
				player.body.velocity.x = 150
			
				player.animations.play('right')
				getCoordinates(player)
			 
			} else {
				// If no movement keys are pressed, stop the player
				player.animations.stop()
			}
			
				//  This allows the player to jump!
			if (cursors.up.isDown && player.body.touching.down) {
				player.body.velocity.y = -400
				getCoordinates(player)
			}
				// Show an alert modal when score reaches 120
			if (score === 120) {
				alert('You win!')
				score = 0
			}
		}, 1000)
}

Game.removePlayer = function(id){
   console.log(playerMap[id]);
   playerMap[id].destroy();
   delete playerMap[id];
};

