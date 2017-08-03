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
io.sockets.on('connection', function (socket) {
    console.log("a user connected");

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('new user', function(msg){
        io.emit('new user', msg);
    });
});

io.sockets.on('disconnection', function (socket) {
    console.log("a user disconnected");

    socket.on('user exit', function(msg){
        io.emit('user exit', msg);
    });

});
