var User
    , _ =               require('underscore')
    , firebird = require('../firebird.js')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/assets/js/routingConfig').userRoles
   // , fs = require('fs')
   // , fb = require('node-firebird')
  ;

// modified for Firebird by JRT
var users;
//users = getusers();
users = firebird.GetUsers();
console.log('users jul 4 ', users)
//
//var CFG = LoadConfig();
//console.log('users',users);
//fb.attachOrCreate(
//    {
//        host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
//    },
//    function (err, db) {
//        if (err) {
//            console.log(err.message);
//        } else {
//            database = db;
//            //   getusers();
//            users = getusers();
//            console.log("\n\r db connected ");
//        }
//    }
//);
//
//
//function LoadConfig() {
//    var cfg = {};
//    try {
//        fs.statSync(__dirname + '/cfg/cfg.json');
//        var sCfg = fs.readFileSync(__dirname + '/cfg/cfg.json', 'utf8');
//        cfg = JSON.parse(sCfg);
//        console.log('CFG ', __dirname);
//    }
//    catch (e) {
//        console.log("Error loading config " + e.message)
//    }
//    return cfg;
//};

//function getusers() {
//    var jsondata = new Array();
//    qrystr = 'select ID "id", "Staff Init" "username" ,"WebPassword" "password", "role" ,"AdjusterID" "adjusterid" from "Staff" where id >0';
//      firebird.database().execute(qrystr, function (err, results, fields) {
//      //    database.execute(qrystr, function (err, results, fields) {
//            console.log('database.query result "Staff"  ', results);
//
//            firebird.wrapJson(results, fields, jsondata);
//        },
//        logerror);
//    return jsondata;
//};
//function logerror(err) {
//    console.log(err.message);
//}

//var users = [
//    {
//        id:         1,
//        username:   "user",
//        password:   "123",
//        role:   userRoles.user
//    },
//    {
//        id:         2,
//        username:   "admin",
//        password:   "123",
//        role:   userRoles.admin
//    }
//];

module.exports = {
    addUser: function(username, password, role, callback) {
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");
        // Clean up when 500 users reached
        if(users.length > 500) {
            users = users.slice(0, 2);
        }
        var user = {
            id:         _.max(users, function(user) { return user.id; }).id + 1,
            username:   username,
            password:   password,
            role:       role,
            adjusterid:   adjusterid //"AdjusterID"
        };
        users.push(user);
        callback(null, user);
    },

    findOrCreateOauthUser: function(provider, providerId) {
        var user = module.exports.findByProviderId(provider, providerId);
        if(!user) {
            user = {
                id: _.max(users, function(user) { return user.id; }).id + 1,
                username: provider + '_user', // Should keep Oauth users anonymous on demo site
                role: userRoles.user,
                provider: provider
            };
            user[provider] = providerId;
            users.push(user);
        }

        return user;
    },

    findAll: function() {

        return _.map(users, function(user) { return _.clone(user); });
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    findByProviderId: function(provider, id) {
        return _.find(users, function(user) { return user[provider] === id; });
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {
            console.log('===========================================')
            var user = module.exports.findByUsername(username);
            console.log('===========================================',user)
            if(!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else if(user.password != password) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else {
                return done(null, user);
            }

        }
    ),

    twitterStrategy: function() {
        if(!process.env.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
        if(!process.env.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

        return new TwitterStrategy({
                consumerKey: process.env.TWITTER_CONSUMER_KEY,
                consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
                callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
            },
            function(token, tokenSecret, profile, done) {
                var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
                done(null, user);
            });
    },

    facebookStrategy: function() {
        if(!process.env.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
        if(!process.env.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');

        return new FacebookStrategy({
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:8000/auth/facebook/callback"
            },
            function(accessToken, refreshToken, profile, done) {
                var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
                done(null, user);
            });
    },

    googleStrategy: function() {

        return new GoogleStrategy({
                returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:8000/auth/google/return",
                realm: process.env.GOOGLE_REALM || "http://localhost:8000/"
            },
            function(identifier, profile, done) {
                var user = module.exports.findOrCreateOauthUser('google', identifier);
                done(null, user);
            });
    },

    serializeUser: function(user, done) {
        done(null, user.id);
    },

    deserializeUser: function(id, done) {
        var user = module.exports.findById(id);

        if(user)    { done(null, user); }
        else        { done(null, false); }
    }
};