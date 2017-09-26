
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

Client.endTurn = function(){
    Client.socket.emit('end turn');
};

Client.attackPhase = function(card, buttonIndex){
    if (card.type == "ATTACK")
    {
        Client.socket.emit('attack range', card); // draw range circle to current client
        Client.getCurrentStats(card, buttonIndex);
    }

    else if (card.type == "SELF")
    {
        Client.socket.emit('self card', card, buttonIndex);
    }

};

Client.attack = function(id, card){
    Client.socket.emit('attack', id, card);
};

Client.applyCardToSelf = function (id, card){
    Client.socket.emit('apply self', id, card)
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
    Game.addNewPlayer(data, data.id,data.x,data.y);
    Game.createStatBars(data.name, data.stats, data.uiX, data.uiY, data.id)
});

Client.socket.on('attack range',function(player, card){
    Game.removeGraphics();
    Game.drawAttackRange(player.x, player.y, card.reach*10);

});

Client.socket.on('self card',function(player, card, index){
    Game.disableAttack();
    Game.removeGraphics();
    Game.enableSelfInput(player.id, card, index);

});

Client.socket.on('your_turn',function(){
    Game.pickCard();
    Game.enableRoll();
    Game.enableAttack();
    Game.enableEnd();
});

Client.socket.on('end turn',function(){
    Game.disableEnd();
    Game.removeGraphics();
});

Client.socket.on('draw_circle',function(x, y, total, isPlayerTurn){
    Game.drawRange(x, y, total, isPlayerTurn);
});

Client.socket.on('attack', function(players, attacker, defender, card){
    Game.removeGraphics();
    Game.moveBullet(players, attacker, defender, card);
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




