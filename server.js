var express =       require('express.io')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')

    , User =        require('./server/models/User.js')

   , passportSocketIo = require("passport.socketio")
    //, config = require('express-config')
    ,fs = require('fs')
    ;

//**********************************************\\
var app = express();
app.http().io();
//**********************************************\\
app.io.route('private', function(req) {
    console.log(req.handshake.user);
});


app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.set('view options', {
    layout:false
});
app.use(express.logger('dev'))
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));

//define session store
var MemStore = express.session.MemoryStore;
var mySessionStore = new express.session.MemoryStore({reapInterval: 60000 * 10});
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


var SITE_SECRET = 'orextkey';

//
//app.use(express.session({
//    key:    'express.sid',
//    secret:  'mysecret',
//    store:   mySessionStore
//}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);
require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8000);
console.log("1==========");
console.log("2==========Express server listening  \n"+app.get('port'));
    app.server.listen(app.get('port'),'127.0.0.1', function(err,success){
	console.log("2a ==========Express server listening  \n");
    console.log("2b Express server listening on port " + app.get('port'));
});

console.log("3==========");

var old_auth;
old_auth = app.io.get('authorization');
app.io.set("authorization", passportSocketIo.authorize({
    passport: passport,
    cookieParser: express.cookieParser,
    key:    'express.sid',
    secret:  'mysecret',
    store:   mySessionStore,
    success: function(data, accept) {
        return old_auth(data, accept);
    }
}));





console.log('4============ ==============================');
var socket = require('./server/socket.js')
app.io.sockets.on('connection',socket);
//socket2 = require('./server/socket2.js')
//app.io.sockets.on('connection',socket2);



//app.io.sockets.on('connection',socket2);

//app.io.sockets.on('connection',socket);
//require('./config/socketio')(app.listen(port),config)
//require('./server/socket.js')(app,app.server.listen(app.get('port')) );
//require('./server/socket.js')(app);

//console.log(socket.handshake.user.username);
// or sometimes it might be...
//console.log(app.io.sockets.handshake.user[0].username);
//console.log(app.io.sockets.handshake.username);// user.username);
//console.log('5==========================================');
// old code
// Socket.io Communication
////app.io.configure(function (){
//console.log('express.cookieParser ',express.cookieParser)
//console.log('sessionConfig ',sessionConfig)

//app.io.set( "authorization", passportSocketIo.authorize({
//    passport: passport,
//    cookieParser: express.cookieParser,
//    key: config.session.key,
//    secret: config.session.secret,
//    store: config.session.store,
//    success: (data, accept(old_auth, data, accept)
//    }));
//var old_auth;
//
//old_auth = app.io.get('authorization');
//
//app.io.set("authorization", passportSocketIo.authorize({
//    passport: passport,
//    cookieParser: express.cookieParser,
//    key:    'express.sid',
//    secret:  'mysecret',
//    store:   mySessionStore,
//    success: function(data, accept) {
//        return old_auth(data, accept);
//    }
//}));
//
////    success: function(old_auth, accept){
////    console.log("success socket.io auth");
////    }
//
//
////
////    app.io.set("authorization", passportSocketIo.authorize({
////        cookieParser:express.cookieParser,
////        key:    'express.sid',
////        secret: 'secret', //the session secret to parse the cookie
////        store:   mySessionStore,     //the session store that express uses
//////        fail: function(data, accept) {
//////            // console.log("failed");
//////            // console.log(data);// *optional* callbacks on success or fail
//////            accept(null, false);             // second param takes boolean on whether or not to allow handshake
//////        },
////        success: function(data, accept) {
//////            //  console.log("success socket.io auth");
//////            //   console.log(data);
////            accept(old_autg, true);
////        }
////    }));
//////});
//
//
//
//console.log('4==========================================');
//app.io.sockets.on('connection',socket);
//
//
//
//console.log('==========================================');
//app.io.sockets.on('connection',socket);// function(socket));{JCFG});//,JCFG);
////console.log('===============socket===========================',socket);
//
//// Socket.io Communication
//app.io.set('authorization', function (data, accept) {
//    if (!data.headers.cookie)
//        return accept('No cookie transmitted.  ', false);
//    data.cookie = require('cookie').parse(data.headers.cookie, SITE_SECRET);
//    data.sessionID = data.cookie['sid'].substring(2, 26);
//    console.log('data.cookie:', data.cookie);
//    console.log('data.sessionID: ', data.sessionID);
//    mySessionStore.get(data.sessionID, function (err, session) {
//        if (err) {
//            console.log('myStore.get return error: ', err);
//            accept(err.message, false)
//        } else if (!session) {
//            console.log('This Session not found. ');
//            return accept('Session not found.', false);
//        }
//        console.log('This session: ', session, data.sessionID);
//        data.session = session;
//        accept(null, true);
//    });
//});