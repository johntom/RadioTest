'use strict';

angular.module('application' )

    .factory('Auth', function ($http, $rootScope, $cookieStore,$q) {


        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles;

        $rootScope.user = $cookieStore.get('user') || { username: '', role: userRoles.public, adjusterid: ''};
        $cookieStore.remove('user');

        $rootScope.accessLevels = accessLevels;
        $rootScope.userRoles = userRoles;

        return {
            authorize: function (accessLevel, role) {
                if (role === undefined)
                    role = $rootScope.user.role;
                return accessLevel & role;
            },
            isLoggedIn: function (user) {
                if (user === undefined)
                    user = $rootScope.user;
                return user.role === userRoles.user || user.role === userRoles.admin;
            },
            register: function (user, success, error) {
                $http.post('/register', user).success(success).error(error);
            },
            login: function (user, success, error) {
                $http.post('/login', user).success(function (user) {
                    $rootScope.user = user;
                    //console.log('user ' + user)
                    success(user);
                }).error(error);
            },
            logout: function (success, error) {
                $http.post('/logout').success(function () {
                    $rootScope.user.username = '';
                    $rootScope.user.role = userRoles.public;
                    success();
                }).error(error);
            },
            accessLevels: accessLevels,
            userRoles: userRoles
        };
    })


//    .factory( "user", function()
//    {
//        return {
//            email      : "ThomasBurleson@Gmail.com",
//            repository : "https://github.com/ThomasBurleson/angularjs-FlightDashboard"
//        };
//    })


    .factory('Users', function ($http) {
        return {
            getAll: function (success, error) {
                $http.get('/users').success(success).error(error);
            }
        };
    })
    .factory('Adjusters', function ($http) {
        //console.log('Adjusters')
        return {
            getAll: function (success, error) {
                $http.get('/adjusters').success(success).error(error);
            }
        };
    })

    .factory('Claims', ['$resource', '$q', function ($resource, $q) {
        return $resource(
            '/claimView/:action/:id',
            {action: '@action', id: '@id'},
            {
                findAll: {method: 'GET', isArray: true},   // same as query
                // find1: {method:'GET',params: {id:'@id'},isArray:true} ,
                find1: {method: 'GET', params: {id: '@id'}, isArray: false},
                update: {method: 'PUT', params: {id: '@id'} }
            }
        )
    }])


    .factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    })
//    .config( window.$QDecorator )
//    .factory( "user", function()
//    {
//        return {
//            email      : "ThomasBurleson@Gmail.com",
//            repository : "https://github.com/ThomasBurleson/angularjs-FlightDashboard"
//        };
//    })
//    .factory('travelService', ['user', '$q', function (user, $q)
//
//
//    {
//        // Flight API (each returns a promise)
//        console.log('travelService ',user)
//        return {
//            getDeparture : function( user )
//            {
//                var dfd = $q.defer();
//
//                // Mock departure information for the user's flight
//
//                dfd.resolve({
//                    userID   : user.email,
//                    flightID : "UA_343223",
//                    date     : "01/14/2014 8:00 AM"
//                });
//
//                return dfd.promise;
//
//            },
//            getFlight : function( flightID )
//            {
//
//                //return $q.resolve({
//                var dfdF = $q.defer();
//                    dfdF.resolve({
//                    id    : flightID,
//                    pilot : "Captain Morgan",
//                    plane : {
//                        make  : "Boeing 747 RC",
//                        model : "TA-889"
//                    },
//                    status: "onTime"
//                });
//                return dfdF.promise;
//            }
//        };
//    }])
//    .factory( "weatherService", function( $q )
//    {
//        // Weather API (each returns a promise)
//        return {
//            getForecast : function( date )
//            {
//               // return $q.resolve({
//
//                    var dfdW = $q.defer();
//                dfdW.resolve({
//                    date     : date,
//                    forecast : "rain"
//                });
//                return dfdW.promise;
//            }
//        };
//
//    })
//



//    .factory('masCrud', ['socket', '$q', function (socket, $q) {
//        //  var masCrud = {};
//        return {
//            postDaily: function (currentDaily) {
//                //  return name.split("").reverse().join("");
//
//                currentDaily.DAILY_ID = 0;
//                console.log('dds ', currentDaily.DAILY_DETAIL_ID);
//                socket.emit('senddaily', currentDaily);
//                socket.on('responsedaily', function (obj) {
//
//                    if (currentDaily.DAILY_DETAIL_ID === 'new') {
//                        currentDaily.DAILY_DETAIL_ID = obj.result;
//                    }
//                    return    currentDaily;
//                });
//            }
//
//            }
//        }])
//
    .factory('masCrud', ['socket', '$q', function (socket, $q) {
        var masCrud = {};
        var deferred1 = null;
        var deferred2 = null;
        var dfdd = null;

//
//
//        masCrud.postDaily = function  (currentDaily) {
//            var dfdd = $q.defer();
//            //console.log('service postDaily  currentDaily:: ', currentDaily);
//            setTimeout(function () {
//                socket.emit('senddaily', currentDaily);
//                socket.on('responsedaily', function (obj) {
//                    if (currentDaily.DAILY_DETAIL_ID === 'new') {
//                        currentDaily.DAILY_DETAIL_ID = obj.result;
//                        //console.log('service in new ', obj.result)
//                    }
//                    masCrud.postdaily = obj.result;
//                    //console.log('service promise 1 ', masCrud.postdaily);
//
//                    dfdd.resolve(masCrud.postdaily);
//                });
//            }, 1000);
//            return dfdd.promise;
//        }
//
//
//
//        masCrud.getClaims = function () {
//            if (deferred1 === null) {
//                masCrud.initClaims();
//            }
//            return deferred1.promise;
//        }
//        masCrud.resetClaims = function () {
//            // when login as dif user
//            // alert('in reset');
//            deferred1 = null;
//        }
//        masCrud.initClaims = function () {
//            //console.log('in 22 init');
//            masCrud.claims = {};
//            deferred1 = $q.defer();
//            setTimeout(function () {
//                socket.emit('getclaims', {});
//                socket.on('initclaims', function (obj) {
//                    masCrud.claims = obj.Claims;
//                    //   console.log()
//                    deferred1.resolve(masCrud.claims);
//                });
//            }, 1000);
//            return deferred1.promise;
//        }
//        return masCrud;
    }])


    .factory('serviceCodes', ['socket', '$q', function (socket, $q) {
//        var serviceCodes = {};
//        var deferred1 = null;
//        var deferred2 = null;
//        var deferred3 = null;
//
//        serviceCodes.getCode1 = function () {
//            if (deferred1 === null) {
//                serviceCodes.init();
//            }
//            return deferred1.promise;
//        }
//        serviceCodes.getCode2 = function () {
//            if (deferred2 === null) {
//                serviceCodes.init();
//            }
//            return deferred2.promise;
//        }
//        serviceCodes.getCode3 = function () {
//            if (deferred3 === null) {
//                serviceCodes.init();
//            }
//            return deferred3.promise;
//        }
//
//
//        serviceCodes.init = function () {
//            serviceCodes.Code1 = {};
//            deferred1 = $q.defer();
//            deferred2 = $q.defer();
//            deferred3 = $q.defer();
//            setTimeout(function () {
//                // since this fn executes async in a future turn of the event loop, we need to wrap
//                // our code into an $apply call so that the model changes are properly observed.
//                //console.log('in init');
//                socket.emit('getcodeTypes', {});
//                socket.on('initcode1', function (obj) {
//                    serviceCodes.Code1 = obj.Code1;
//                    deferred1.resolve(serviceCodes.Code1);
//
//                });
//
//                socket.emit('getcodeService', {});
//                socket.on('initcode2', function (obj) {
//                    serviceCodes.Code2 = obj.Code2;
//                    deferred2.resolve(serviceCodes.Code2);
//
//                });
//
//                socket.emit('getcodeExpense', {});
//                socket.on('initcode3', function (obj) {
//                    serviceCodes.Code3 = obj.Code3;
//                    deferred3.resolve(serviceCodes.Code3);
//
//                });
//            }, 1000);
//            //   return deferred.promise;
//        }
//
//        return serviceCodes;
    }]);
