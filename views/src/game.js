
var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Roboto Slab']
    }

};

Game.preload = function() {
    var path;
    if (typeof window.path === "undefined") {
        path = "";
    }
    else {
        path = window.path;
    }

    //centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();

    game.load.spritesheet("dice", path + "assets/Layout/diceRed.png", 64, 64);
    game.load.script("BlurX", path + "assets/Layout/BlurX.js");
    game.load.script("BlurY", path + "assets/Layout/BlurY.js");
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    game.load.image('map', 'assets/Maps/Map-1.png');
    game.load.image('sprite','assets/images/sprite-test.png');
    game.load.image('roll-dice','assets/Layout/Profile.png');

};

var text;
var diceGroup;
Game.create = function(){
    Game.playerMap = {};
    var map = game.add.image(game.world.centerX,game.world.centerY,'map');
    map.anchor.setTo(0.5,0.5);
    map.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    map.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer([fname + " " + lname, fname + " " +lname + " has joined the room.", Warrior]);

    diceGroup = game.add.group();

    var i;
    for (i=0; i < 5; i++) {
        var d = new Dice(game, i*100+190, 100);
        diceGroup.add(d);
    }

    text = game.add.text(190,10, "Total: ");
    text.font = "Roboto Slab";
    text.fontSize = 30;
    text.fill = "#d3d3d3";

    game.roll_btn = game.add.button(this.world.centerX,this.world.centerY,'roll-dice', Game.rollDice);
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.update = function() {
    // I don't like having the foreach code run so often.
    // Ideally it would only be run when the dice have finished
    // rolling, but I haven't worked out how to do that yet.
    var total = 0;
    diceGroup.forEach(function(item) { total += item.value(); });
    text.setText("Total: " + total);
};

Game.rollDice = function() {
    var total = 0;
    diceGroup.callAll("roll", null);
};

