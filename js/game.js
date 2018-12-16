// Declare shared variables at the top so all methods can access them
let player

var Game = {};
var playerMap = {};
var tweens = {};

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

Game.preload = function () {
    // Load & Define our game assets
    game.load.image('sky', 'assets/sky.png')
    game.load.spritesheet('barb', 'assets/walk.png', 88, 99)
}

Game.create = function () {

    game.physics.startSystem(Phaser.Physics.ARCADE)

    sky = game.add.sprite(0, 0, 'sky')
    sky.inputEnabled = true;
    sky.events.onInputDown.add(Game.getCoordinates, this);
    Client.askNewPlayer();
    console.log("Retrieved player -> " + player)
}

Game.getCoordinates = function (layer, pointer) {
    console.log("getCoordinates executed")

    Client.sendClick(pointer.worldX, pointer.worldY);
};

Game.addNewPlayer = function (id, x, y) {

    playerMap[id] = game.add.sprite(game.world.randomX, game.world.randomY, 'barb')

    player = playerMap[id];
    tweens[id] = game.add.tween(player);

    player.pivot.x = 44;
    player.pivot.y = 49;

    for (i = 0; i < 15; i++) {
        key = 'walk' + i;
        console.log(key)
        frames = Array.from(new Array(7), (x, j) => j + i * 8);
        player.animations.add(key, frames, 16, true)
    }
    console.log(player);
};

Game.movePlayer = function (id, x, y, rotation) {
    var player = playerMap[id];
    var tween = tweens[id];

    angleInRads = rotation + Math.PI;
    normalised = angleInRads / (2 * Math.PI);
    animationIndex = (Math.round(normalised * 16) + 4) % 16;

    console.log('rads: ' + angleInRads + 'norm: ' + normalised + 'key: ' + animationIndex)

    key = 'walk' + animationIndex.toString();

    player.animations.play(key);


    if (tween.isRunning) {
        tween.pause();
        console.log('tween stopped')
        tween = game.add.tween(player);

        var distance = Phaser.Math.distance(player.x, player.y, x, y);
        var duration = distance * 5;
    
        tween.to({
            x: x,
            y: y
        }, duration);
        tween.start();
        console.log('and renewed')
    }
    else{
        var distance = Phaser.Math.distance(player.x, player.y, x, y);
        var duration = distance * 5;
    
        tween.to({
            x: x,
            y: y
        }, duration);
        tween.start();
        console.log('tween started')
    }


};

Game.removePlayer = function (id) {
    console.log(playerMap[id]);
    playerMap[id].destroy();
    delete playerMap[id];
};