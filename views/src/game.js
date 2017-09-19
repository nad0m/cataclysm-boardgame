
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
    game.load.image('warrior', 'assets/images/warrior.png');
    game.load.image('mage','assets/images/Mage.png');
    game.load.image('ranger','assets/images/Ranger.png');

};

var text;
var diceGroup;
var total;
Game.create = function(){
    game.warrior_btn = game.add.button(190, 300, 'warrior', Client.loadWarrior);
    game.mage_btn = game.add.button(300, 300, 'mage', Client.loadMage);
    game.ranger_btn = game.add.button(410, 300, 'ranger', Client.loadRanger);
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
    Game.playerMap[id].anchor.setTo(0.5, 0.5);
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


Game.rollDice = function() {
    var frameValues = [];
    total = 0;
    diceGroup.forEach(function(item) {
        item.frame = game.rnd.pick([0,1,2,4,5,6]);
        total += item.value();
        frameValues.push(item.frame);
    });

    text.setText("Total: " + total);

    Client.sendDice(frameValues, total);

    Game.disableInput();
};

Game.updateDice = function (frameValues, newTotal) {
    var i = 0;
    diceGroup.forEach(function(item) {
        item.frame = frameValues[i];
        i++;
    });
    text.setText("Total: " + newTotal);
};

Game.enableInput = function (){
    game.map.inputEnabled = true;
    game.roll_btn.inputEnabled = true;
};

Game.disableInput = function (){
    game.map.inputEnabled = false;
    game.roll_btn.inputEnabled = false;
};

Game.drawRange = function (x, y, diameter){
    var graphics = game.add.graphics(x, y);

    graphics.lineStyle(0);
    graphics.beginFill(0xFFFF0B, 0.25);
    graphics.drawCircle(0, 0, total*5);
    graphics.endFill();


    game.graphics = graphics;
};

Game.loadBoard = function(hero) {
    game.warrior_btn.destroy();
    game.mage_btn.destroy();
    game.ranger_btn.destroy();

    Game.playerMap = {};


    game.map = game.add.image(game.world.centerX,game.world.centerY,'map');
    game.map.anchor.setTo(0.5,0.5);
    game.map.inputEnabled = true;
    game.map.events.onInputUp.add(Game.getCoordinates, this);
    game.roll_btn = game.add.button(this.world.centerX,this.world.centerY,'roll-dice', Game.rollDice);

    Client.askNewPlayer([fname + " " + lname, fname + " " +lname + " has joined the room.", hero]);

    diceGroup = game.add.group();
    var i;
    for (i=0; i < 5; i++) {
        var d = new Dice(game, i*100+190, 100);
        diceGroup.add(d);
    }

    Game.disableInput();

    text = game.add.text(190,10, "Total: ");
    text.font = "Roboto Slab";
    text.fontSize = 30;
    text.fill = "#f44242";
};

