// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 80;
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

io.sockets.on('connection', function (socket) {


    socket.on('newplayer',function(msg){
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(100,400),
            y: randomInt(100,400),
            name: msg[0],
            stats: msg[2],
            uiX: statBarsX,
            uiY: statBarsY,
            cards: []
        };
        statBarsY += 100;

        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);


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
        if (sockets.length == 2)
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
        io.emit('attack range', socket.player, card);
    });

    socket.on('player info', function () {
        sockets[turn].emit('player info', socket.player, getAllPlayers());
    });

    socket.on('attack', function(id, card){
        var damage = card.natural + (card.scale * socket.player.stats.atk);
        socket.player.stats.mp -= (card.will * 5);
        sockets[id].player.stats.hp -= damage;
        io.emit('attack', getAllPlayers(), socket.player, sockets[id].player, card);
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
