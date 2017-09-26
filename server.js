// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8080;
var path = require("path");
var passport = require('passport');
var flash    = require('connect-flash');
var server = require('http').Server(app);

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'huyandlawrence',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
var io = require('socket.io').listen(app.listen(port));
console.log('The magic happens on port ' + port);

// chat ======================================================================
server.lastPlayerID = 0;
var sockets = [];
var currentTurn = 0;
var turn = 0;
var statBarsX = 100;
var statBarsY = 200;
var numberOfPlayers = 0;

io.sockets.on('connection', function (socket) {


    socket.on('newplayer',function(msg){
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(550,750),
            y: randomInt(55,400),
            name: msg[0],
            stats: msg[2],
            uiX: statBarsX,
            uiY: statBarsY,
            cards: []
        };
        numberOfPlayers++;
        statBarsY += 100;

        socket.emit('allplayers', getAllPlayers(), socket.player);
        socket.broadcast.emit('newplayer', socket.player);


        io.emit('new user', msg);
        console.log(socket.player.stats.atk);

        socket.on('click',function(data){
            console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });
        socket.on('disconnect', function (msg) {
            io.emit('disconnect', socket.player.name + " has left the room.");
            io.emit('remove',socket.player.id);
            numberOfPlayers--;

            if (numberOfPlayers == 0)
            {
                resetServer();
            }
        });
        socket.on('dice', function (frameValues, total) {
            io.emit('dice', frameValues, total);
            console.log(frameValues);
            sockets[turn].emit('draw_circle',socket.player.x, socket.player.y, total, true); // clickable for designated player

            for (var i = 0; i < sockets.length; i++)
            {
                if (i != turn)
                {
                    sockets[i].emit('draw_circle',socket.player.x, socket.player.y, total, false);// UI change only for other players
                }
            }
        });
        sockets.push(socket);
        if (sockets.length == 1)
        {
            next_turn();
        }
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('end turn', function(){
        io.emit('end turn');
        next_turn();
    });

    socket.on('attack range', function (card) {
        socket.emit('attack range', socket.player, card);
    });

    socket.on('self card', function (card, index) {
        io.emit('self card', socket.player, card, index);
    });



    socket.on('player info', function (card, button) {
        sockets[turn].emit('player info', socket.player, getAllPlayers(), card, button);
    });

    socket.on('attack', function(id, card){
        var damage = card.natural + (card.scale * socket.player.stats.atk) - sockets[id].player.stats.mitigation;
        socket.player.stats.mp -= (card.will * 5);
        if (damage < 0)
        {
            damage = 0;
        }
        sockets[id].player.stats.hp -= damage;
        io.emit('attack', getAllPlayers(), socket.player, sockets[id].player, card);
    });

    socket.on('apply self', function (id, card){
        var stats = socket.player.stats;
        stats.mp -= card.will;
        switch (card.title)
        {
            case "Stone Skin": // SHIELD: +1 for every 3 Arcana (Does not scale. Must reuse card to update and reflect new Arcana levels.)
                stats.mitigation = stats.mp/3; //TODO change to Arcana instead of mp
                break;
        }

        io.emit('update players', getAllPlayers());
    });

    function next_turn(){
        turn = currentTurn++ % sockets.length;
        io.emit('update players', getAllPlayers());
        sockets[turn].emit('your_turn');
        console.log(sockets[turn].player.name + "'s turn.");

    }

});


function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function resetServer(){
    server.lastPlayerID = 0;
    sockets = [];
    currentTurn = 0;
    turn = 0;
    statBarsX = 100;
    statBarsY = 200;
}
