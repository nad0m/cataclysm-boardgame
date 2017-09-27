
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
    game.load.image('map', 'assets/Board/Board2.png');
    game.load.image('status', 'assets/Board-62-height/Status.png');
    game.load.image('red_gem', 'assets/Board-62-height/RedGem.png');
    game.load.image('yellow_gem', 'assets/Board-62-height/YellowGem.png');
    game.load.image('green_gem', 'assets/Board-62-height/GreenGem.png');
    game.load.image('player_profile', 'assets/Board-62-height/Players.png');
    game.load.image('banner', 'assets/Board-62-height/Banner.png');
    game.load.image('sprite','assets/images/sprite-test.png');
    game.load.image('bullet','assets/images/bullet.png');
    game.load.image('roll-dice','assets/Buttons/ButtonRoll.png');
    game.load.image('end-turn','assets/Buttons/ButtonEnd.png');
    game.load.image('atk-btn', 'assets/Buttons/ButtonOff.png');
    game.load.image('warrior', 'assets/images/warrior.png');
    game.load.image('mage','assets/images/Mage.png');
    game.load.image('ranger','assets/images/Ranger.png');
    game.load.image('mat', 'assets/Board-62-height/temp-mat.png');
    game.load.image('card_sprite', 'assets/Board-62-height/temp-card.png');

};

var text;
var diceGroup;
var total;
var myHealthBar = [];
var myManaBar = [];
var cardChoices = [];
var statOverlay;
var cardDesc;
var group;
var trap = null;
var trapVictim = null;


Game.create = function(){
    game.warrior_btn = game.add.button(190, 300, 'warrior', Client.loadWarrior);
    game.mage_btn = game.add.button(300, 300, 'mage', Client.loadMage);
    game.ranger_btn = game.add.button(410, 300, 'ranger', Client.loadRanger);

    game.physics.startSystem(Phaser.Physics.ARCADE);

};

Game.update = function(){
    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.arcade.collide(trap, trapVictim, Game.collisionHandler, null, this);
};

Game.collisionHandler = function(){
    console.log("Trapped!!");
    trap = null;
    trapVictim = null;
};

Game.getCoordinates = function(layer,pointer){
    if (pointer.worldX > 500 && pointer.worldX < 1872 && pointer.worldY > 55 && pointer.worldY < 550)
    {
        Client.sendClick(pointer.worldX,pointer.worldY);
    }
};

Game.createOverlay = function(player){
    statOverlay = game.add.text(player.x, player.y, "Name: " + player.name + "\n" +
                                                    "Health: " + player.stats.hp + "\n" +
                                                    "Atk: " + player.stats.atk + "\n" +
                                                    "Def: " + player.stats.def + "\n" +
                                                    "Reduction: " + player.stats.mitigation + "\n" +
                                                    "Def bonus: " + player.stats.def_bonus + "\n" +
                                                    "Reach bonus: " + player.stats.reach_bonus,{ font: "12px Arial", fill: "#ffffff", align: "center" });
    statOverlay.anchor.setTo(0.5, 0.5);
};

Game.addNewPlayer = function(player,id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
    Game.playerMap[id].anchor.setTo(0.5, 0.5);
    Game.playerMap[id].player = player;
    Game.playerMap[id].inputEnabled = true;
    Game.playerMap[id].events.onInputOver.add(function(){
        Game.playerMap[id].tint = 0x0bef26;
        Game.createOverlay(Game.playerMap[id].player);
    }, game);
    Game.playerMap[id].events.onInputOut.add(function(){
        Game.playerMap[id].tint = 0xffffff;
        statOverlay.destroy();
    }, game);
};



Game.createButtons = function(id){
    game.roll_btn = game.add.button(this.world.centerX,this.world.centerY,'roll-dice', function(){
        console.log(Game.playerMap[id].player.name);
        Game.rollDice();
    });
    game.roll_btn.anchor.setTo(0.5,0.5);

    game.atk_btn = game.add.button(this.world.centerX+50,this.world.centerY,'atk-btn', function(){
        if (Game.playerMap[id].player.stats.mp >= Fireball.will) {
            Client.attackPhase(Fireball);
        } else {
            console.log("Not enough mana.");
        }
    });
    game.atk_btn.anchor.setTo(0.5,0.5);

    game.end_btn = game.add.button(this.world.centerX+100,this.world.centerY,'end-turn', Client.endTurn);
    game.end_btn.anchor.setTo(0.5,0.5);

    Game.disableInput();
};

Game.disableAllSprites = function(){
    for(var i in Game.playerMap)
    {
        if (Game.playerMap.hasOwnProperty(i))
        {
            Game.disableAllSpriteInput(i);
        }
    }
};


Game.enableSpriteInput = function(id, card, index){
    //  Enables all kind of input actions on this image (click, etc)
    var card = card;
    var index = index;

    Game.playerMap[id].events.onInputOver.add(function () {
            Game.playerMap[id].tint = 0xf44242;
        }, game);
        Game.playerMap[id].events.onInputOut.add(function () {
            Game.playerMap[id].tint = 0xffffff;
        }, game);
        Game.playerMap[id].events.onInputDown.add(function () {
            Game.playerMap[id].tint = 0xffffff;
            Client.attack(id, card); //id of person being attacked
            myCards[index].card = null;
            myCards[index].button.destroy();
            myCards[index].button = null;
            cardDesc.destroy();
            for(var i in Game.playerMap)
            {
                if (Game.playerMap.hasOwnProperty(i))
                {
                    Game.disableAllSpriteInput(i);
                }
            }

        }, game);

};

Game.disableAllSpriteInput = function(id){
    Game.playerMap[id].events.destroy();

    Game.playerMap[id].inputEnabled = true;
    Game.playerMap[id].events.onInputOver.add(function () {
        Game.playerMap[id].tint = 0x0bef26;
        Game.createOverlay(Game.playerMap[id].player);
    }, game);
    Game.playerMap[id].events.onInputOut.add(function () {
        Game.playerMap[id].tint = 0xffffff;
        statOverlay.destroy();
    }, game);

};

Game.enableSelfInput = function(id, card, index){
    var card = card;

    Game.playerMap[id].tint = 0x4289f4;

    Game.playerMap[id].events.onInputOver.add(function () {
        Game.playerMap[id].tint = 0x4289f4;
    }, game);

    Game.playerMap[id].events.onInputDown.add(function () {
        Game.playerMap[id].tint = 0xffffff;
        Client.applyCardToSelf(id, card);
        myCards[index].card = null;
        myCards[index].button.destroy();
        myCards[index].button = null;
        for(var i in Game.playerMap)
        {
            if (Game.playerMap.hasOwnProperty(i))
            {
                Game.disableAllSpriteInput(i);
            }
        }

    }, game);
};

Game.enableFriendlyInput = function(id, card, index){
    var card = card;

    Game.playerMap[id].tint = 0xebf442;

    Game.playerMap[id].events.onInputOver.add(function () {
        Game.playerMap[id].tint = 0xebf442;
    }, game);
    Game.playerMap[id].events.onInputDown.add(function () {
        Game.playerMap[id].tint = 0xffffff;
        Client.applyCardToOthers(id, card);
        myCards[index].card = null;
        myCards[index].button.destroy();
        myCards[index].button = null;
        for(var i in Game.playerMap)
        {
            if (Game.playerMap.hasOwnProperty(i))
            {
                Game.disableAllSpriteInput(i);
            }
        }

    }, game);
};

Game.scanForEnemies = function(hero, enemies, card, button){
    var x = hero.x;
    var y = hero.y;

    for (var i = 0; i < enemies.length; i++)
    {
        if (hero.turn && hero.id != enemies[i].id && Phaser.Math.distance(enemies[i].x,enemies[i].y,x,y) < (card.reach*10*6 + hero.stats.reach_bonus)/2+6)
        {
            Game.enableSpriteInput(enemies[i].id, card, button);
        }
    }
};

Game.scanForFriendlies = function (players, player, card, buttonIndex) {
    var spriteID = player.id;
    var currentSprite = Game.playerMap[spriteID];

    Game.drawAttackRange(player.x, player.y, (card.reach + player.stats.reach_bonus)*10, 0xebf442);

    for (var id in Game.playerMap)
    {
        if (player.turn == true && Game.playerMap.hasOwnProperty(id))
        {
            if (game.physics.arcade.distanceBetween(currentSprite, Game.playerMap[id]) < (card.reach*10*6 + player.stats.reach_bonus)/2+6){
                Game.enableFriendlyInput(id, card, buttonIndex);
            }
        }
    }

};

Game.updateStats = function(players){
    for (var i = 0; i < players.length; i++)
    {
        var id = players[i].id;
        var healthOffset = players[i].stats.hp/players[i].stats.max_hp * 100;
        myHealthBar[id].setPercent(healthOffset);
        var manaOffset = players[i].stats.mp/players[i].stats.max_mp * 100;
        myManaBar[id].setPercent(manaOffset);

        if (Game.playerMap.hasOwnProperty(id)){
            Game.playerMap[id].player = players[i];
            console.log(Game.playerMap[id].player.stats.hp + "/" + Game.playerMap[id].player.stats.max_hp);
        }
    }
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.moveBullet = function(players, attacker, defender, card){
    var bullet = game.add.sprite(attacker.x, attacker.y, 'bullet');
    bullet.anchor.setTo(0.5, 0.5);
    var distance = Phaser.Math.distance(attacker.x,attacker.y,defender.x,defender.y);
    var tween = game.add.tween(bullet);
    var duration = distance*5;
    tween.to({x:defender.x,y:defender.y}, duration);
    tween.start();

    tween.onComplete.add(function(){
        bullet.destroy();
        Game.updateStats(players);
    }, game);

};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};


Game.rollDice = function() {
    for(var i in Game.playerMap)
    {
        if (Game.playerMap.hasOwnProperty(i))
        {
            Game.disableAllSpriteInput(i);
        }
    }

    var frameValues = [];
    total = 0;
    diceGroup.forEach(function(item) {
        item.frame = game.rnd.pick([0,1,2,4,5,6]);
        total += item.value();
        frameValues.push(item.frame);
    });

    text.setText("Total: " + total);

    Client.sendDice(frameValues, total);

    Game.removeGraphics();
    Game.turnSlotsOn();

    Game.disableRoll();

};

Game.updateDice = function (frameValues, newTotal) {
    var i = 0;
    diceGroup.forEach(function(item) {
        item.frame = frameValues[i];
        i++;
    });
    text.setText("Total: " + newTotal);
};

Game.enableRoll = function (){
    game.roll_btn.inputEnabled = true;
    game.roll_btn.input.useHandCursor = true;
};

Game.enableAttack = function (){
    game.atk_btn.inputEnabled = true;
    game.atk_btn.input.useHandCursor = true;
};

Game.enableEnd = function (){
    game.end_btn.inputEnabled = true;
    game.end_btn.input.useHandCursor = true;
};

Game.disableRoll = function (){
    game.roll_btn.inputEnabled = false;
    game.roll_btn.input.useHandCursor = false;
};

Game.disableAttack = function (){
    Game.disableRoll();
    game.atk_btn.inputEnabled = false;
    game.atk_btn.input.useHandCursor = false;
};

Game.disableEnd = function (){
    Game.disableRoll();
    Game.disableAttack();
    game.end_btn.inputEnabled = false;
    game.end_btn.input.useHandCursor = false;
};


Game.disableInput = function (){
    game.map.inputEnabled = false;
    game.roll_btn.inputEnabled = false;
    game.roll_btn.input.useHandCursor = false;
    game.atk_btn.inputEnabled = false;
    game.atk_btn.input.useHandCursor = false;
    game.end_btn.inputEnabled = false;
    game.end_btn.input.useHandCursor = false;
};

Game.drawRange = function (x, y, diameter, isPlayerTurn){
    var graphics = game.add.graphics(x, y);

    graphics.lineStyle(1);
    graphics.beginFill(0x00ff00, 0.15);
    graphics.drawCircle(0, 0, diameter*15);
    graphics.endFill();

    if (isPlayerTurn)
    {
        graphics.inputEnabled = true;
        graphics.input.useHandCursor = true;
        graphics.events.onInputDown.add(Game.getCoordinates, this);
    }

    game.graphics = graphics;

};

Game.drawAttackRange = function (players, x, y, diameter, color, isTrap){
    var graphics = game.add.graphics(x, y);

    graphics.lineStyle(1);
    graphics.beginFill(color, 0.15);
    graphics.drawCircle(0, 0, diameter*6);
    graphics.endFill();

    if (isTrap)
    {
        var allPlayers = players;
        graphics.inputEnabled = true;
        graphics.input.useHandCursor = true;
        graphics.events.onInputDown.add(function(){
            Game.setTrap(allPlayers);
        }, this);
    }

    game.graphics = graphics;
};

Game.setTrap = function(allPlayers){
    var x = game.input.mousePointer.x;
    var y = game.input.mousePointer.y;

    trap = game.add.sprite(x, y, 'red_gem');
    trap.anchor.setTo(0.5,0.5);

    for (var i = 0; i < allPlayers.length; i++)
    {
        var id = allPlayers[i].id;
        trapVictim = Game.playerMap[id];
    }
     
    game.physics.enable( [ trap, trapVictim ], Phaser.Physics.ARCADE);
    game.graphics.destroy();
};


Game.removeGraphics = function(){

    if (game.graphics != null)
    {
        game.graphics.destroy();
    }

};

Game.createStatBars = function (name, hero, x, y, id){

    var name = game.add.text(x, y, hero.title + ": " + name);
    name.font = "Roboto Slab";
    name.fontSize = 20;
    name.fill = "#f44242";
    name.anchor.setTo(0.5, 0.5);

    y += 30;

    var healthConfig = {
        width: 150,
        height: 15,
        x: x,
        y: y,
        bg: {
            color: '#bab4b2'
        },
        bar: {
            color: '#f70000'
        },
        animationDuration: 200,
        flipped: false
    };

    y += 20;

    var manaConfig = {
        width: 150,
        height: 15,
        x: x,
        y: y,
        bg: {
            color: '#bab4b2'
        },
        bar: {
            color: '#205aea'
        },
        animationDuration: 200,
        flipped: false
    };

    myHealthBar[id] = new HealthBar(this.game, healthConfig);
    myManaBar[id] = new HealthBar(this.game, manaConfig);

};

Game.pickRandomProperty = function (arr) {
    var card = arr[Math.floor(Math.random()*arr.length)];
    return card;
};

Game.getRandomCards = function() {
    var randomArr = [];
    for (var i = 0; i < 6; i++)
    {
        var card = Game.pickRandomProperty(CardAbilities);
        if (randomArr.indexOf(card) != -1)
        {
            i--;
        } else {
            randomArr.push(card);
        }
    }
    return randomArr;
}

Game.pickCard = function() {
    var cards = Game.getRandomCards();
    game.card_mat = game.add.image(game.world.centerX, game.world.centerY, 'mat');
    game.card_mat.anchor.setTo(0.5, 0.5);

    Game.createCardChoices(game.card0, game.card_mat.centerX, game.card_mat.centerY, 'card_sprite', cards[0]);
    Game.createCardChoices(game.card1, game.card_mat.centerX + 70, game.card_mat.centerY, 'card_sprite', cards[1]);
    Game.createCardChoices(game.card2, game.card_mat.centerX + 140, game.card_mat.centerY, 'card_sprite', cards[2]);
    Game.createCardChoices(game.card3, game.card_mat.centerX + 210, game.card_mat.centerY, 'card_sprite', cards[3]);
    Game.createCardChoices(game.card4, game.card_mat.centerX + 280, game.card_mat.centerY, 'card_sprite', cards[4]);
    Game.createCardChoices(game.card5, game.card_mat.centerX + 350, game.card_mat.centerY, 'card_sprite', cards[5]);
};

Game.createCardChoices = function(context, x, y, image, card) {
    context = game.add.button(x + 0, y, image, function(){
        Game.createCardButton(card);
        game.card_mat.destroy();
        cardDesc.destroy();
        //Destroy all cards upon choice
        for (var i = 0; i < cardChoices.length; i++)
        {
            cardChoices[i].destroy();
        }
        cardChoices = [];
    });

    context.onInputOver.add(function(){
        cardDesc = game.add.text(x,y, card.title + "\n" +
                                      card.proficiency + "\n" +
                                      "Will required: " + card.will);
        cardDesc.font = "Roboto Slab";
        cardDesc.fontSize = 12;
        cardDesc.fill = "#f44242";
    }, game);

    context.onInputOut.add(function(){
        cardDesc.destroy();
    }, game);

    cardChoices.push(context);
};

Game.createCardButton = function (card){
    for (var i = 0; i < myCards.length; i++)
    {
        var card = card;
        var index = i;

        if (myCards[i].card == null)
        {
            myCards[i].card = card;
            var button = game.add.button(myCards[i].x, myCards[i].y, 'card_sprite', function(){
                /* myCards[index].card = null;
                 button.destroy();*/
                cardDesc.destroy();
                Game.turnSlotOff(index);
                Client.attackPhase(card, index);

          }, game);

            button.onInputOver.add(function(){
                cardDesc = game.add.text(myCards[i].x, myCards[i].y, card.title + "\n" +
                    card.proficiency + "\n" +
                    "Will required: " + card.will);
                cardDesc.font = "Roboto Slab";
                cardDesc.fontSize = 12;
                cardDesc.fill = "#f44242";
            }, game);

            button.onInputOut.add(function(){
                cardDesc.destroy();
            }, game);
            myCards[i].button = button;
            break;
        }
    }

};

Game.turnSlotOff = function(index){
    for(var i in Game.playerMap)
    {
        if (Game.playerMap.hasOwnProperty(i))
        {
            Game.disableAllSpriteInput(i);
        }
    }

    for (var i = 0; i < myCards.length; i++)
    {
        if (myCards[i].button != null && i == index)
        {
            myCards[i].button.inputEnabled = false;
        }

        else if (myCards[i].button != null && i != index)
        {
            myCards[i].button.inputEnabled = true;
        }
    }
};

Game.turnSlotsOn = function(){
    for (var i = 0; i < myCards.length; i++)
    {
        if (myCards[i].button != null)
        {
            myCards[i].button.inputEnabled = true;
        }
    }
};

Game.destroyCard = function(index){
    myCards[index].card = null;
    myCards[index].button.destroy();
    myCards[index].button = null;
};


Game.removeCardFromHand = function(index){
    myCards.splice(index, 1);
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


    Client.askNewPlayer([fname + " " + lname, fname + " " +lname + " has joined the room.", hero]);

    diceGroup = game.add.group();
    var i;
    for (i=0; i < 3; i++) {
        var d = new Dice(game, i*100+190, 100);
        diceGroup.add(d);
    }

    text = game.add.text(190,10, "Total: ");
    text.font = "Roboto Slab";
    text.fontSize = 30;
    text.fill = "#f44242";
};

