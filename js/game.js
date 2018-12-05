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
 
    //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
  sky = game.add.sprite(0, 0, 'sky')
  
  tiles = game.add.group()
  
    //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group()

    //  We will enable physics for any object that is created in this group
  platforms.enableBody = true

    // Here we create the ground.
  let ground = platforms.create(0, game.world.height - 64, 'ground')

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2)

    //  This stops it from falling away when you jump on it
  ground.body.immovable = true

    //  Now let's create two ledges
  let ledge = platforms.create(400, 450, 'ground')
  ledge.body.immovable = true

  ledge = platforms.create(-75, 350, 'ground')
  ledge.body.immovable = true

  //barb = game.add.sprite(32, 150, 'barb')
  
  //barb.animations.add('left', [32,33, 34, 35, 36, 37, 38, 39], 10, true)
  //barb.animations.add('right', [96, 97, 98, 99, 100, 101, 102, 103], 10, true)
  
  // The player and its settings
  //player = game.add.sprite(32, game.world.height - 150, 'woof')

    //  We need to enable physics on the player
  //game.physics.arcade.enable(player)

    //  Player physics properties. Give the little guy a slight bounce.
  //player.body.bounce.y = 0.2
  //player.body.gravity.y = 800
 // player.body.collideWorldBounds = true

    //  Our two animations, walking left and right.
  //player.animations.add('left', [0, 1], 10, true)
 // player.animations.add('right', [2, 3], 10, true)

	
    //  And bootstrap our controls
    cursors = game.input.keyboard.createCursorKeys()
    
	//sky.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    //sky.events.onInputUp.add(Game.getCoordinates, this);
	  // Configure the controls!
	//sky.inputEnabled = true;
	//sky.events.onInputUp.add(Game.getCoordinates(woof));
	//if (player != null || player !== undefined) { 
	
	Client.askNewPlayer()
	
	 //getCoordinates(player, cursors)	
	
//	}
	
   
  }
  
  //Game.getCoordinates = function(layer,pointer){
 //   Client.sendClick(pointer.worldX,pointer.worldY);
//};

Game.getCoordinates = function(player, cursors){
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

	//  Setup collisions for the player, diamonds, and our platforms
	game.physics.arcade.collide(player, platforms)
	game.physics.arcade.collide(diamonds, platforms)
}


Game.movePlayer = function(id,x,y){
    var player = playerMap[id];
    var tween = game.add.tween(player);

    tween.to({x:x,y:y}, 1000);
   tween.start();
   //player.body.velocity.x = x;
  // player.body.velocity.y = y;
};

Game.update = function(){
		setTimeout(function(){
			player.body.velocity.x = 0

			//  Setup collisions for the player, diamonds, and our platforms
			game.physics.arcade.collide(player, platforms)
			game.physics.arcade.collide(diamonds, platforms)

			//  Call callectionDiamond() if player overlaps with a diamond
			//game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)
			
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
				//barb.animations.play('right')
				//barb.x+=2
			} else {
				// If no movement keys are pressed, stop the player
				player.animations.stop()
				//barb.animations.stop()
				//getCoordinates(player)
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

