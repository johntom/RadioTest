'use strict';

// angular.module('application', ['ngCookies','angular-client-side-auth.filters'])
//'angular-client-side-auth.directives',  'angular-client-side-auth.services', 'angular-client-side-auth.filters',  added from...
//angular.module('angular-client-side-auth', ['ngCookies', 'ui' , 'ngGrid' ,'ui.bootstrap', 'ui.compat','ExperimentsModule'])
//, 'ui.compat','angular-table'
angular.module('Application', ['ngCookies','Application.filters' ,'ui' ,
        'ngGrid','ui.bootstrap','ExperimentsModule','angular-table', 'ui.compat'])


    .factory('masHelper', function($rootScope) {

        var buildIndex = function(source, property) {
            var tempArray = [];

            for(var i = 0, len = source.length; i < len; ++i) {
                tempArray[source[i][property]] = source[i];
            }

            return tempArray;
        };

        return {
            buildIndex: buildIndex
        };
    })
    .factory('masModel', function($rootScope,socket) {
        var getStatuses = function() {
            var tempArray = [
                {name:'Back Log'},
                {name:'To Do'},
                {name:'In Progress'},
                {name:'Code Review'},
                {name:'QA Review'},
                {name:'Verified'},
                {name:'Done'}
            ];
            return tempArray;
        };
        var getOpenClaims = function() {
            var tempArray = [
                {title:'Claim 00', description:'Description pending.', criteria:'Criteria pending.', status:'To Do', type:'1', reporter:'Lukas Ruebbelke', assignee:'Brian Ford'},
                {title:'Claim 01', description:'Description pending.', criteria:'Criteria pending.', status:'Back Log', type:'1', reporter:'Lukas Ruebbelke', assignee:'Brian Ford'},
                {title:'Claim 02', description:'Description pending.', criteria:'Criteria pending.', status:'Code Review', type:'2', reporter:'Lukas Ruebbelke', assignee:'Brian Ford'},
                {title:'Claim 03', description:'Description pending.', criteria:'Criteria pending.', status:'Done', type:'2', reporter:'Lukas Ruebbelke', assignee:'Brian Ford'},
                {title:'Claim 04', description:'Description pending.', criteria:'Criteria pending.', status:'Verified', type:'3', reporter:'Lukas Ruebbelke', assignee:'Brian Ford'},
                {title:'Claim 05', description:'Description pending.', criteria:'Criteria pending.', status:'To Do', type:'4', reporter:'Lukas Ruebbelke', assignee:'Brian Ford'}
            ];

            return tempArray;
        };
        return {
            getStatuses: getStatuses,
            //getTypes: getClaimTypes,
            getClaims: getOpenClaims
        };
    }


)

    //   .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
//    .config(['$stateProvider', '$routeProvider', '$locationProvider', '$httpProvider', function ($stateProvider,$routeProvider, $locationProvider, $httpProvider) {
    .config([ '$stateProvider', '$routeProvider', '$urlRouterProvider',
        function ($stateProvider, $routeProvider, $urlRouterProvider) {
            $urlRouterProvider
                .when('/c?id', '/contacts/:id')
                .otherwise('/');
            // console.log('in state 0');
            $routeProvider
                .when('/user/:id', {
                    redirectTo: '/contacts/:id'
                });
            var access = routingConfig.accessLevels;

            $stateProvider.when('/',
                {
                    url: '/',
                    templateUrl:    'partials/home',
                    controller:     'HomeCtrl',
                    access:         access.user
                });
            $stateProvider.when('login',
                {
                    url: '/login',
                    templateUrl:    'partials/login',
                    controller:     'LoginCtrl',
                    access:         access.anon
                });
            $stateProvider.when('register',
                {
                    url: '/register',
                    templateUrl:    'partials/register',
                    controller:     'RegisterCtrl',
                    access:         access.anon
                });
            $stateProvider.when('/auth/twitter',
                {
                    templateUrl:    '/partials/register',
                    controller:     'RegisterCtrl',
                    access:         access.anon
                });
            $stateProvider.when('/private',
                {
                    templateUrl:    '/partials/private',
                    controller:     'PrivateCtrl',
                    access:         access.user
                });
            $stateProvider.when('/claim',
                {
                    templateUrl:    '/partials/claim',
                    controller:     'ClaimCtrl',
                    access:         access.user //admin
                });
            $stateProvider.when('/claimhold',
                {
                    templateUrl:    '/partials/claimhold',
                    controller:     'ClaimCtrl',
                    access:         access.user //admin
                });
            $stateProvider.when('/claimbydate',
                {
                    templateUrl:    '/partials/claimbydate',
                    controller:     'ClaimByDateCtrl',
                    access:         access.user //admin
                });
            $stateProvider.when('/code',
                {
                    templateUrl:    '/partials/code',
                    controller:     'CodeCtrl',
                    access:         access.admin
                });

            $stateProvider.when('/admin',
                {
                    templateUrl:    '/partials/admin',
                    controller:     'AdminCtrl',
                    access:         access.admin
                });
            $stateProvider.when('/404',
                {
                    templateUrl:    '/partials/404',
                    access:         access.public
                });
            //         $stateProvider.otherwise({redirectTo:'/404'});
            $stateProvider.run(
                [        '$state',
                    function ( $state) {
                        $rootScope.$state = $state;
                        $state.transitionTo('home')
                        //  $rootScope.$stateParams = $stateParams;
                        // console.log('in state 2 ',  $rootScope.$state, $rootScope.$stateParams);
                    }])

            $locationProvider.html5Mode(true);

            var interceptor = ['$location', '$q', function($location, $q) {
                function success(response) {
                    return response;
                }

                function error(response) {

                    if(response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }

                return function(promise) {
                    return promise.then(success, error);
                }
            }];

            $httpProvider.responseInterceptors.push(interceptor);

        }])
    .run(function ($rootScope) {
        $rootScope.hello = function () {
            console.log('hello');
        }
    })
    .run(function ($rootScope) {
        $rootScope.weAreHere = function (isThisIt) {
            var locationString = new String(location.pathname);// hash OR pathname;
            return lcocationString == isThisIt;
        }
    })
    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                if(Auth.isLoggedIn()) $location.path('/');
                else                  $location.path('/login');
            }
        });

        $rootScope.appInitialized = true;
    }]);