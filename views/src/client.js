
var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(msg){
    Client.socket.emit('newplayer', msg);
};

Client.sendClick = function(x,y){
    Client.socket.emit('click',{x:x,y:y});
};

Client.sendDice = function(msg, total){
    Client.socket.emit('dice', msg, total);
};

Client.sendGameState = function(msg){
    Client.socket.emit('state', msg);
};

Client.sendChoice = function(choice){
    Client.socket.emit('after level up', choice);
    Game.destroyLevelUpScreen();
};

Client.endTurn = function(){
    Game.disableAllSprites();
    Game.checkForTraps();
    Client.socket.emit('end turn');
};

Client.sendTrapID = function(id, index, card, player){
    Game.removeGraphics();
    Game.removeCardFromHand(index);
    Client.socket.emit('update traps', id, card, player);

};

Client.attackPhase = function(card, buttonIndex){
    if (card.type == "ATTACK")
    {
        Client.socket.emit('attack range', card, buttonIndex); // draw range circle to current client
        Client.getCurrentStats(card, buttonIndex);
    }

    else if (card.type == "SELF")
    {
        Client.socket.emit('self card', card, buttonIndex);
    }

    else if (card.type == "SPELL")
    {
        Client.socket.emit('spell card', card, buttonIndex);
    }

    else if (card.type == "TRAP")
    {
        Client.socket.emit('trap card', card, buttonIndex);
    }

};

Client.attack = function(id, card){
    Client.socket.emit('attack', id, card);
};

Client.applyCardToSelf = function (id, card){
    Client.socket.emit('apply self', id, card)
};

Client.applyCardToOthers = function (id, card){
    Client.socket.emit('apply others', id, card)
};

Client.getCurrentStats = function(card, button){
    Client.socket.emit('player info', card, button);
};

Client.loadWarrior = function() {
    Game.loadBoard(Warrior);
};
Client.loadMage = function() {
    Game.loadBoard(Mage);
};
Client.loadRanger = function() {
    Game.loadBoard(Ranger);
};


Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data, data.id, data.x, data.y);
    Game.createStatBars(data.name, data.stats, data.uiX, data.uiY, data.id)
});

Client.socket.on('attack range',function(players, player, card, trapID, slotIndex){
    Game.removeGraphics();
    Game.drawAttackRange(players, player, card, 0xf44242, false, trapID, slotIndex);

});

Client.socket.on('self card',function(player, card, index){
    Game.removeGraphics();
    if (player.turn && player.stats.mp >= card.will) {
        Game.enableSelfInput(player.id, card, index);
    }
});

Client.socket.on('spell card',function(players, player, card, index){
    Game.removeGraphics();
    Game.scanForFriendlies(players, player, card, index);
});

Client.socket.on('trap card',function(players, player, card, index, trapID){
    Game.removeGraphics();
    Game.drawAttackRange(players, player, card, 0xd6b5fc, true, trapID, index)
})

Client.socket.on('level up',function(){
    Game.levelUpScreen();
});

Client.socket.on('your_turn',function(){
    Game.pickCard();
    Game.enableRoll();
    Game.enableEnd();
});

Client.socket.on('end turn',function(playerID){
    Game.disableEnd();
    Game.removeGraphics();
    Game.checkForTraps(playerID);
});

Client.socket.on('draw_circle',function(x, y, total, isPlayerTurn){
    Game.drawRange(x, y, total, isPlayerTurn);
});

Client.socket.on('attack', function(players, attacker, defender, card){
    Game.removeGraphics();
    Game.moveBullet(players, attacker, defender, card);
});

Client.socket.on('apply others', function(players, source, recipient, card){
    Game.removeGraphics();
    Game.moveBullet(players, source, recipient, card);
});

Client.socket.on('player info',function(hero, enemies, card, button){
    Game.scanForEnemies(hero, enemies, card, button);
});

Client.socket.on('update players',function(players){
    Game.updateStats(players);
});

Client.socket.on('allplayers',function(data, player){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i], data[i].id,data[i].x,data[i].y);
        Game.createStatBars(data[i].name, data[i].stats, data[i].uiX, data[i].uiY, data[i].id);
    }

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });

    Client.socket.on('dice',function(frameValues, total){
        Game.updateDice(frameValues, total);
    });

    Game.createButtons(player.id);
});




