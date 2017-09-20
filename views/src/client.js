
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
    Game.addNewPlayer(data.id,data.x,data.y);
    Game.createStatBars(data.name, data.stats, data.uiX, data.uiY)
});

Client.socket.on('your_turn',function(){
    Game.enableInput();
});

Client.socket.on('end turn',function(){
    Game.disableInput();
    Game.removeGraphics();
});

Client.socket.on('draw_circle',function(x, y, total, isPlayerTurn){
    Game.drawRange(x, y, total, isPlayerTurn);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
        Game.createStatBars(data[i].name, data[i].stats, data[i].uiX, data[i].uiY);
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
});




