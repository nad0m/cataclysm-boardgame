
var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Roboto Slab', 'Asap Condensed', 'Revalia', 'Courier New']
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
    game.load.image('map', 'assets/Board/Board.png');
    game.load.image('status', 'assets/Board-62-height/Status.png');
    game.load.image('trap', 'assets/images/trap.png');
    game.load.image('yellow_gem', 'assets/Board-62-height/YellowGem.png');
    game.load.image('green_gem', 'assets/Board-62-height/GreenGem.png');
    game.load.image('player_profile', 'assets/Board-62-height/Players.png');
    game.load.image('banner', 'assets/Board-62-height/Banner.png');
    game.load.image('sprite','assets/images/sprite-test.png');
    game.load.image('remove','assets/images/remove.png');
    game.load.image('trash','assets/Buttons/ButtonTrash.png');
    game.load.image('exit','assets/images/x-button.png');
    game.load.image('roll-dice','assets/Buttons/ButtonRoll.png');
    game.load.image('end-turn','assets/Buttons/ButtonEnd.png');
    game.load.image('atk-btn', 'assets/Buttons/ButtonOff.png');
    game.load.image('warrior', 'assets/Attributes/Force.png');
    game.load.image('mage','assets/Attributes/Arcana.png');
    game.load.image('ranger','assets/Attributes/Clarity.png');
    game.load.image('warrior-btn', 'assets/Characters/Heroes/Selection/HeroSelectionWarrior.png');
    game.load.image('mage-btn','assets/Characters/Heroes/Selection/HeroSelectionWizard.png');
    game.load.image('ranger-btn','assets/Characters/Heroes/Selection/HeroSelectionRanger.png');
    game.load.image('mat', 'assets/Board/Selection.png');
    game.load.image('card_display', 'assets/Board/card_view.png');
    game.load.image('card_sprite', 'assets/Board-62-height/temp-card.png');

    game.load.atlasJSONHash('all_cards', 'assets/all_cards.png', 'assets/all_cards.json');
    game.load.atlasJSONHash('cards_hover', 'assets/all_cards_variantshover.png', 'assets/all_cards_variantshover.json');
    game.load.atlasJSONHash('cards_pressed', 'assets/all_cards_variantspressed.png', 'assets/all_cards_variantspressed.json');
    game.load.atlasJSONHash('sprites', 'assets/character_sprites.png', 'assets/character_sprites.json');
    game.load.atlasJSONHash('bullets', 'assets/bullets.png', 'assets/bullets.json');
    //game.load.atlas('all_cards', 'assets/all_cards.png', 'assets/all_cards.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

};

var text;
var diceGroup;
var total;
var myHealthBar = [];
var myManaBar = [];
var hp_text =[];
var mp_text = [];
var title = [];
var cardChoices = [];
var statOverlay;
var cardDesc;
var group;
var force;
var arcana;
var clarity;
var choiceGroup;
var mySpriteID;



Game.create = function(){
    game.map = game.add.image(game.world.centerX,game.world.centerY,'map');
    game.map.anchor.setTo(0.5,0.5);
    game.map.inputEnabled = true;
    game.map.events.onInputUp.add(Game.getCoordinates, this);
    game.heroSelection = game.add.image(1295, 295, 'mat');
    game.heroSelection.anchor.setTo(0.5, 0.5);
    game.heroSelection.scale.setTo(0.7, 0.7);
    game.choose = game.add.text(game.heroSelection.centerX, game.heroSelection.centerY-60, "Choose your class:", {
        font: "24px Arial",
        align: "center",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });
    game.choose.anchor.setTo(0.5, 0.5);
    game.warrior_btn = game.add.button(game.heroSelection.centerX-200, game.heroSelection.centerY, 'warrior-btn', Client.loadWarrior);
    game.mage_btn = game.add.button(game.heroSelection.centerX, game.heroSelection.centerY, 'mage-btn', Client.loadMage);
    game.ranger_btn = game.add.button(game.heroSelection.centerX+200, game.heroSelection.centerY, 'ranger-btn', Client.loadRanger);
    game.warrior_btn.anchor.setTo(0.5, 0.5);
    game.mage_btn.anchor.setTo(0.5, 0.5);
    game.ranger_btn.anchor.setTo(0.5, 0.5);

    game.physics.startSystem(Phaser.Physics.ARCADE);

};

Game.getCoordinates = function(layer,pointer){
    if (pointer.worldX > 680 && pointer.worldX < 1912 && pointer.worldY > 5 && pointer.worldY < 585)
    {
        Client.sendClick(pointer.worldX,pointer.worldY);
    }
};

Game.createOverlay = function(player){
    statOverlay = game.add.text(player.x, player.y, "Name: " + player.name + "\n" +
                                                    "Health: " + player.stats.hp + "/" + player.stats.max_hp + "\n" +
                                                    "Will: " + player.stats.mp + "/" + player.stats.max_mp + "\n" +
                                                    "Force: " + player.stats.force + "\n" +
                                                    "Arcana: " + player.stats.arcana + "\n" +
                                                    "Clarity: " + player.stats.clarity + "\n" +
                                                    "Reduction: " + player.stats.mitigation + "\n" +
                                                    "Def bonus: " + player.stats.def_bonus + "\n" +
                                                    "Reach bonus: " + player.stats.reach_bonus,{
        font: "12px Arial",
        align: "left",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });
    statOverlay.anchor.setTo(0.5, 0.5);
};

Game.addNewPlayer = function(player,id,x,y){

    var sprite_type = "";

    switch(id)
    {
        case 0: 
            sprite_type = player.stats.red;
            break;
        case 1: 
            sprite_type = player.stats.blue;
            break;
        case 2: 
            sprite_type = player.stats.green;
            break;
        case 3: 
            sprite_type = player.stats.yellow;
            break;

    };

    Game.playerMap[id] = game.add.sprite(x,y,'sprites', sprite_type);
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



Game.createButtons = function(player){
    game.roll_btn = game.add.button(408, 100,'roll-dice', Game.rollDice);
    game.roll_btn.anchor.setTo(0.5,0.5);

    game.end_btn = game.add.button(408, 200,'end-turn', Client.endTurn);
    game.end_btn.anchor.setTo(0.5,0.5);

    Game.disableInput();

    mySpriteID = player.id;

    console.log("my id is: " + mySpriteID);

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
            Game.removeCardFromHand(index);
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
        Game.removeCardFromHand(index);
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
        Game.removeCardFromHand(index);
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

    console.log("hero turn: " + hero.turn);
    for (var i = 0; i < enemies.length; i++)
    {
        if (hero.stats.mp >= card.will && hero.turn && hero.id != enemies[i].id && Phaser.Math.distance(enemies[i].x,enemies[i].y,x,y) < (card.reach*7*6 + hero.stats.reach_bonus)/2+6)
        {
            Game.enableSpriteInput(enemies[i].id, card, button);
        }
    }
};

Game.scanForFriendlies = function (players, player, card, buttonIndex) {
    var spriteID = player.id;
    var currentSprite = Game.playerMap[spriteID];

    Game.drawAttackRange(players, player, card, 0xebf442, null, null, buttonIndex);

    for (var id in Game.playerMap)
    {
        if (player.turn == true && Game.playerMap.hasOwnProperty(id))
        {
            if (player.stats.mp >= card.will && game.physics.arcade.distanceBetween(currentSprite, Game.playerMap[id]) < (card.reach*7*6 + player.stats.reach_bonus)/2+6){
                Game.enableFriendlyInput(id, card, buttonIndex);
            }
        }
    }

};

Game.updateStats = function(players){
    for (var i = 0; i < players.length; i++)
    {
        var id = players[i].id;

        var healthOffset = players[id].stats.hp/players[id].stats.max_hp * 100;
        myHealthBar[id].setPercent(healthOffset);
        hp_text[id].setText("HP: " + players[id].stats.hp + "/" + players[id].stats.max_hp);


        var manaOffset = players[id].stats.mp/players[id].stats.max_mp * 100;
        myManaBar[id].setPercent(manaOffset);
        mp_text[id].setText("MP: " + players[id].stats.mp + "/" + players[id].stats.max_mp);


        if (Game.playerMap.hasOwnProperty(id)){
            Game.playerMap[id].player = players[i];
            console.log(Game.playerMap[id].player.stats.hp + "/" + Game.playerMap[id].player.stats.max_hp + Game.playerMap[id].player.turn);
        }
    }

};

Game.updateBoard = function(player){
    Game.gameText.setText("-- " + player + "'s turn --");
};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.moveBullet = function(players, attacker, defender, card, damage, color){
    var bullet = game.add.sprite(attacker.x, attacker.y, 'bullets', card.bullet);
    bullet.anchor.setTo(0.5, 0.5);
    bullet.rotation = game.physics.arcade.angleBetween(attacker, defender);


    var distance = Phaser.Math.distance(attacker.x,attacker.y,defender.x,defender.y);
    var tween = game.add.tween(bullet);
    var duration = distance*5;
    tween.to({x:defender.x,y:defender.y}, duration);
    tween.start();


    tween.onComplete.add(function(){
        bullet.destroy();
        Game.updateStats(players);
        game.number = game.add.text(defender.x, defender.y-5, damage, {
        font: "20px Revalia",
        align: "center",
        fill: color,
        stroke: '#000000',
        strokeThickness: 4
    });
        var textTween = game.add.tween(game.number);
        textTween.to({x: defender.x, y: defender.y-80}, 700);
        textTween.start();

        textTween.onComplete.add(function(){
            game.number.destroy();
        });
        
    }, game);



};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};


Game.rollDice = function() {
    Game.disableTrashInput();

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

Game.enableTrashInput = function (index){
    game.trash = game.add.button(595, 490,'trash', function(){
        Game.removeCardFromHand(index);
    });
    game.trash.anchor.setTo(0.5,0.5);
};

Game.disableTrashInput = function (){
    if (typeof game.trash != 'undefined')
    {
        game.trash.destroy();
    }
};

Game.enableRoll = function (){
    game.roll_btn.inputEnabled = true;
    game.roll_btn.input.useHandCursor = true;
};


Game.enableEnd = function (){
    game.end_btn.inputEnabled = true;
    game.end_btn.input.useHandCursor = true;
};

Game.disableRoll = function (){
    game.roll_btn.inputEnabled = false;
    game.roll_btn.input.useHandCursor = false;
};


Game.disableEnd = function (){
    Game.disableRoll();
    game.end_btn.inputEnabled = false;
    game.end_btn.input.useHandCursor = false;
};


Game.disableInput = function (){
    game.map.inputEnabled = false;
    game.roll_btn.inputEnabled = false;
    game.roll_btn.input.useHandCursor = false;
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

Game.drawAttackRange = function (players, player, card, color, isTrap, trapID, slotIndex){
    var graphics = game.add.graphics(player.x, player.y);
    var diameter = (card.reach + player.stats.reach_bonus)*7;

    graphics.lineStyle(1);
    graphics.beginFill(color, 0.15);
    graphics.drawCircle(0, 0, diameter*6);
    graphics.endFill();

    if (isTrap && player.stats.mp >= card.will)
    {
        var allPlayers = players;
        var index = slotIndex
        graphics.inputEnabled = true;
        graphics.input.useHandCursor = true;
        graphics.events.onInputDown.add(function(){
            Game.setTrap(allPlayers, player, trapID, index, card);
        }, this);
    }

    game.graphics = graphics;
};

Game.setTrap = function(allPlayers, player, id, index, card){
    var x = game.input.mousePointer.x;
    var y = game.input.mousePointer.y;

    Game.traps[id] = game.add.sprite(x, y, 'trap');
    Game.traps[id].anchor.setTo(0.5,0.5);
    Game.traps[id].alpha = 0.5;


    for(var i in Game.playerMap)
    {
        if (Game.playerMap.hasOwnProperty(i))
        {
            game.physics.enable( [ Game.traps[id], Game.playerMap[i] ], Phaser.Physics.ARCADE);
        }
    }

    Game.trapCard[id] = card;
    Client.sendTrapID(id, index, card, player);
};

Game.checkForTraps = function(id){

    for(var i in Game.traps)
    {
        if (Game.traps.hasOwnProperty(i))
        {
            game.physics.arcade.collide(Game.traps[i], Game.playerMap[id], function(){
                Client.attack(id, Game.trapCard[i]);
                Game.traps[i].destroy();
            }, null, this);
        }
    }

};


Game.removeGraphics = function(){

    if (typeof game.graphics != 'undefined')
    {
        game.graphics.destroy();
    }

};

Game.createStatBars = function (name, hero, x, y, id){

    title[id] = game.add.text(x-150, y+10, name, {
        font: "11px Arial",
        align: "left",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    
    });
    title[id].anchor.setTo(0.5, 0.5);
    title[id].setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);

    hp_text[id] = game.add.text(x-88, y+4, "HP: " + hero.hp + "/" + hero.max_hp, {
        font: "11px Arial",
        align: "right",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });
    hp_text[id].anchor.setTo(0.5, 0.5);
    hp_text[id].setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);

    var healthConfig = {
        width: 103,
        height: 4,
        x: x,
        y: y,
        bar: {
            color: '#f70000'
        },
        animationDuration: 300,
        flipped: false
    };

    y += 21;

    mp_text[id] = game.add.text(x-88, y-1, "MP: " + hero.mp + "/" + hero.max_mp, {
        font: "11px Arial",
        align: "right",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });
    mp_text[id].anchor.setTo(0.5, 0.5);
    mp_text[id].setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);


    var manaConfig = {
        width: 104,
        height: 4,
        x: x,
        y: y,
        bar: {
            color: '#00eaea'
        },
        animationDuration: 300,
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
    choiceGroup = game.add.group();
    game.card_mat = game.add.image(1295, 295, 'mat');
    game.card_mat.anchor.setTo(0.5, 0.5);
    //game.card_mat.alpha = 0;
    choiceGroup.add(game.card_mat);
    Game.createCardChoices(game.card0, game.card_mat.centerX - 420, game.card_mat.centerY, cards[0]);
    Game.createCardChoices(game.card1, game.card_mat.centerX - 250, game.card_mat.centerY, cards[1]);
    Game.createCardChoices(game.card2, game.card_mat.centerX - 80, game.card_mat.centerY, cards[2]);
    Game.createCardChoices(game.card3, game.card_mat.centerX + 90, game.card_mat.centerY, cards[3]);
    Game.createCardChoices(game.card4, game.card_mat.centerX + 260, game.card_mat.centerY, cards[4]);
    Game.createCardChoices(game.card5, game.card_mat.centerX + 430, game.card_mat.centerY, cards[5]);

    var exit = game.add.button(game.card_mat.centerX + 530, game.card_mat.centerY - 160, 'exit', Game.removeCardChoiceMat);
    exit.anchor.setTo(0.5, 0.5);

    choiceGroup.add(exit);

};

Game.removeCardChoiceMat = function(){
    game.card_mat.destroy();
    for (var i = 0; i < cardChoices.length; i++) {
        setTimeout(cardChoices[i].button.destroy.bind(cardChoices[i].button), 10); // what the hell, phaser?
        cardChoices[i].desc.destroy();
    }
    game.world.remove(choiceGroup);
    choiceGroup = null;
    cardChoices = [];
};

Game.createCardChoices = function(context, x, y, card) {
    context = game.add.button(x, y, 'all_cards', function(){
        if (numOfCards < 5) {
            Game.createCardButton(card);
            Game.removeCardChoiceMat();
        }
    }, game, card.sprite, card.sprite, card.sprite);
    context.anchor.setTo(0.5, 0.5);

    var cardText = "";

    if (card.type == "ATTACK")
    {
        cardText = "Type:  " + card.type + "\n" +
                                    "Will:  " + card.will + "\n" +
                                    "Reach:  " + card.reach + "\n" +
                                    "Power:\n" + card.natural + " + (" + card.proficiency + " x " + card.scale + ")";
    }

    else
    {
        cardText = "Type:  " + card.type + "\n" +
                                    "Will required:  " + card.will + "\n" +
                                    "Reach:  " + card.reach + "\n" +
                                    "Effect:  " + card.effect;
    }



    cardDesc = game.add.text(x,y, cardText);
                                    
    cardDesc.anchor.setTo(0.5, 0.5);
    cardDesc.font = "Asap Condensed";
    cardDesc.fontSize = 14;
        //cardDesc.fill = "#f44242";

    var grd = cardDesc.context.createLinearGradient(0, 0, 0, cardDesc.canvas.height);
    grd.addColorStop(0, '#70eaff');   
    grd.addColorStop(1, '#70eaff');
    cardDesc.fill = grd;

    cardDesc.align = 'left';
    cardDesc.stroke = '#000000';
    cardDesc.strokeThickness = 2;
    cardDesc.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    //var testText = game.add.text(context.centerX, context.centerY, "test" + "\n" + "hello");
    //testText.anchor.setTo(0.5, 0.5);

    cardChoices.push({button: context, desc: cardDesc});
};

Game.createCardButton = function (card){
    for (var i = 0; i < myCards.length; i++)
    {
        var card = card;
        var index = i;

        if (myCards[i].card == null)
        {
            numOfCards++;
            myCards[index].card = card;
            myCards[index].button = game.add.button(myCards[i].x, myCards[i].y, 'all_cards', function(){
                /* myCards[index].card = null;
                 button.destroy();*/
                console.log(Game.playerMap[mySpriteID].player.turn);
                if (myCards[index].isPressed == false)
                {
                   // myCards[index].cardDesc.destroy();
                    Game.turnSlotOff(index);
                    Client.attackPhase(card, index);
                }

          }, game, card.sprite, card.sprite, card.sprite);

            myCards[index].button.scale.setTo(0.6, 0.6);


            var style = {
                font: "14px Asap Condensed",
                align: "left",
                fill: "#ffffff",
                stroke: '#000000',
                strokeThickness: 2
            };

            var str = card.proficiency + "\n" +
                    "Type: " + card.type + "\n" +
                    "Will: " + card.will + "\n" +
                    "Reach: " + card.reach + "\n" +
                    "Natural: " + card.natural + "\n" +
                    "Scale: " + card.scale + "\n";

            if (card.type != "ATTACK")
            {
                str = str + "Effect: " + card.effect;
            }
                                    
            myCards[index].button.onInputOver.add(function(){

                myCards[index].cardView = game.add.image(myCards[i].x, myCards[i].y-220, 'card_display');
                myCards[index].cardDesc = game.add.text(myCards[i].cardView.centerX, myCards[i].cardView.centerY, str, style);
                myCards[index].cardDesc.anchor.setTo(0.5, 0.5);

            }, game);

            myCards[index].button.onInputOut.add(function(){
                myCards[index].cardView.destroy();
                myCards[index].cardDesc.destroy();
            }, game);

            myCards[index].button.anchor.setTo(0.5, 0.5);
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
            myCards[i].isPressed = true;
        }

        else if (myCards[i].button != null && i != index)
        {
            myCards[i].button.inputEnabled = true;
            myCards[i].isPressed = false;
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
        myCards[i].isPressed = false;
    }
};

Game.removeCardFromHand = function(index){
    myCards[index].card = null;
    myCards[index].button.destroy();
    myCards[index].button = null;
    myCards[index].cardDesc.destroy();
    myCards[index].cardDesc = null;

    numOfCards--;

    Game.disableTrashInput();
    Game.disableAllSprites();
    Game.removeGraphics();
    Game.turnSlotsOn();
};

Game.levelUpScreen = function(){
    game.card_mat = game.add.image(1295, 295, 'mat');
    game.card_mat.anchor.setTo(0.5, 0.5);
    game.card_mat.scale.setTo(0.5, 0.5);


    game.prompt = game.add.text(game.card_mat.centerX, game.card_mat.centerY-50, "Pick a skill to level up", {
        font: "18px Arial",
        align: "right",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });
    force = game.add.button(game.card_mat.centerX-100, game.card_mat.centerY, 'warrior', function(){
        Client.sendChoice(0);
    });
    arcana = game.add.button(game.card_mat.centerX, game.card_mat.centerY, 'mage', function(){
        Client.sendChoice(1);
    });
    clarity = game.add.button(game.card_mat.centerX+100, game.card_mat.centerY, 'ranger', function(){
        Client.sendChoice(2);
    });

    game.forceLabel = game.add.text(game.card_mat.centerX-100, game.card_mat.centerY+30, "Force", {
        font: "14px Arial",
        align: "right",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });
    game.arcanaLabel = game.add.text(game.card_mat.centerX, game.card_mat.centerY+30, "Arcana", {
        font: "14px Arial",
        align: "right",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });
    game.clarityLabel = game.add.text(game.card_mat.centerX+100, game.card_mat.centerY+30, "Clarity", {
        font: "14px Arial",
        align: "right",
        fill: "#ffffff",
        stroke: '#000000',
        strokeThickness: 2
    });

    game.prompt.anchor.setTo(0.5, 0.5);
    game.forceLabel.anchor.setTo(0.5, 0.5);
    game.arcanaLabel.anchor.setTo(0.5, 0.5);
    game.clarityLabel.anchor.setTo(0.5, 0.5);
    force.anchor.setTo(0.5, 0.5);
    arcana.anchor.setTo(0.5, 0.5);
    clarity.anchor.setTo(0.5, 0.5);

};

Game.destroyLevelUpScreen = function(){
    force.destroy();
    arcana.destroy();
    clarity.destroy();
    game.card_mat.destroy();
    game.prompt.destroy();
    game.forceLabel.destroy();
    game.arcanaLabel.destroy();
    game.clarityLabel.destroy();
};

Game.loadBoard = function(hero) {
    game.warrior_btn.destroy();
    game.mage_btn.destroy();
    game.ranger_btn.destroy();
    game.heroSelection.destroy();
    game.choose.destroy();

    var style = {
        font: "14px Courier New",
        align: "center",
        fill: "#000000",
        stroke: '#00ea5a',
        strokeThickness: 2,
    };

    Game.playerMap = {};
    Game.traps = {};
    Game.trapCard ={};
    Game.gameText = game.add.text(570, 20, "Welcome to Cataclysm", style);
    Game.gameText.anchor.set(0.5);

    Client.askNewPlayer([fname, fname + " " +lname + " has joined the room.", hero]);

    diceGroup = game.add.group();
    var i;
    var x = 90;
    for (i=0; i < 5; i++) {
        var d = new Dice(game, x, 344);
        x += 70;
        diceGroup.add(d);
    }

    text = game.add.text(x+50,344, "Total: ");
    text.font = "Revalia";
    text.fontSize = 30;
    text.fill = "#29aff4";
    text.anchor.setTo(0.5, 0.5);
};

