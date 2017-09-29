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
var checkForReset = 0;
var trapID = 0;
var currentTraps = [];
const LEVEL_UP_SCALE = 0.1;




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
            turn: false,
            cards: []
        };
        checkForReset++;
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
            checkForReset--;

            if (checkForReset == 0)
            {
                resetServer();
            }
        });
        socket.on('dice', function (frameValues, total) {
            var stats = socket.player.stats;

            io.emit('dice', frameValues, total);
            console.log(total + " + " + stats.move_bonus)
            total += stats.move_bonus;
            sockets[turn].emit('draw_circle',socket.player.x, socket.player.y, total, true); // clickable for designated player

            for (var i = 0; i < sockets.length; i++)
            {
                if (i != turn)
                {
                    sockets[i].emit('draw_circle',socket.player.x, socket.player.y, total, false);// UI change only for other players
                }
            }

            stats.move_bonus = 0;
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
        io.emit('end turn', socket.player.id);
        socket.player.stats.reach_bonus = 0; //reset
        socket.player.turn = false;
        next_turn();
    });

    socket.on('attack range', function (card, index) {
        socket.emit('attack range', getAllPlayers(), socket.player, card, trapID, index);
    });

    socket.on('self card', function (card, index) {
        socket.emit('self card', socket.player, card, index);
    });

    socket.on('spell card', function (card, index) {
        socket.emit('spell card', getAllPlayers(), socket.player, card, index);
    });

    socket.on('trap card', function (card, index) {
        socket.emit('trap card', getAllPlayers(), socket.player, card, index, trapID);
    });

    socket.on('update traps', function (id, card, player) {
        currentTraps.push(id);
        trapID++;
});

    socket.on('player info', function (card, button) {
        sockets[turn].emit('player info', socket.player, getAllPlayers(), card, button);
    });

    socket.on('after level up', function(choice) {
        var stats = socket.player.stats;
        stats.max_hp += Math.floor(stats.max_hp * LEVEL_UP_SCALE);
        stats.max_mp++;
        stats.level++; // level up

        switch (choice){
            case 0:
                stats.force++;
                break;
            case 1:
                stats.arcana++;
                break;
            case 2:
                stats.clarity++;
                break;
        }

        numberOfPlayers--;

        if (numberOfPlayers == 0)
        {
            your_turn();
        }
    });

    socket.on('attack', function(id, card){
        var stats = socket.player.stats;
        var ratio;
        switch (card.proficiency)
        {
            case ("Force"):
                ratio = stats.force;
                break;
            case ("Arcana"):
                ratio = stats.arcana;
                break;
            case ("Clarity"):
                ratio = stats.clarity;
                break;
        }

        var damage = card.natural + stats.damage_bonus + (card.scale * ratio);
        var reduction = sockets[id].player.stats.mitigation + sockets[id].player.stats.def_bonus;

        damage -= reduction;

        damage = Math.floor(damage);

        if (card.type != "TRAP")
        {
            stats.mp -= card.will;
        }

        if (damage < 0)
        {
            damage = 0;
        }

        sockets[id].player.stats.hp -= damage;
        stats.damage_bonus = 0; //reset if any bonus exists, e.g. "Bloodlust"
        sockets[id].player.stats.def_bonus = 0; //reset bonus
        io.emit('attack', getAllPlayers(), socket.player, sockets[id].player, card);
    });

    socket.on('apply self', function (id, card){
        var stats = socket.player.stats;
        stats.mp = stats.mp - card.will;
        console.log(socket.player.stats.mp + "-" + card.will);
        switch (card.title)
        {
            case "Stone Skin": // SHIELD: +1 and +1 for every 3 Arcana permanently (Does not scale with subsequent increase of Arcana. Must reuse card to update and reflect new Arcana levels.)
                stats.mitigation = 1 + stats.arcana/3;
                break;
            case "Bloodlust": //STEROID: Add 2 (+1 for every 4 Force) Power to your next attack.
                stats.damage_bonus += 2 + (stats.force/4);
                break;
            case "Adanai's Embrace": //HARDEN: Absorbs up to 2 (+1 for every 3 Force) damage. Expires after you get attacked.
                stats.def_bonus += 2 + (stats.force/4);
                break;
            case "Oros' Blessing": // SNIPE: For this turn, all abilities gain 1 (+1 for every 5 Clarity) Reach.
                stats.reach_bonus += stats.clarity/5;
                break;
            case "Lightning Step": // BLINK: +10 toward your next roll and +1 for every 1 Clarity
                stats.move_bonus += 10 + stats.clarity;
                break;
            case "Dauntless Advance": // CHARGE: +5 and +1 for every Force toward your next roll.
                stats.move_bonus += 5 + stats.force;
                break;

        }

        io.emit('update players', getAllPlayers());
    });

    socket.on('apply others', function (id, card){
        var target = sockets[id].player.stats;
        var source = socket.player.stats;
        source.mp -= card.will;

        switch (card.title)
        {
            case "Waterweave": // HEAL: Restores 2 (+2 for every 3 Arcana) of the target's health.
                target.hp += Math.floor(2 + (2*source.arcana/3));
                if (target.hp > target.max_hp)
                {
                    target.hp = target.max_hp;
                }
                break;
            case "First Aid": // HEAL: Restores 2 (+1 for every 3 Force) to the target's health. +20% hp recovery for one turn.
                target.hp += Math.floor(2 + (2*source.force/3));
                target.hp_recovery_bonus = 0.2;
                if (target.hp > target.max_hp)
                {
                    target.hp = target.max_hp;
                }
                break;
        }

        io.emit('apply others', getAllPlayers(), socket.player, sockets[id].player, card);
    });

    function next_turn(){
        turn = currentTurn++ % sockets.length;
        sockets[turn].player.turn = true;
        if (turn == 0)
        {
            numberOfPlayers = sockets.length;
            io.emit('level up');
        } else {
            your_turn();
        }
    }

    function your_turn(){
        var stats = sockets[turn].player.stats;

        var addHP = Math.floor(stats.max_hp * (stats.hp_recovery + stats.hp_recovery_bonus));
        var addMP = Math.floor(stats.max_mp * stats.mp_recovery);

        stats.hp += addHP;
        stats.mp += addMP;

        if (stats.hp > stats.max_hp)
        {
            stats.hp = stats.max_hp;
        }

        if (stats.mp > stats.max_mp)
        {
            stats.mp = stats.max_mp;
        }

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
