'use strict';
var Application = Application || {};
////console.log('assets/js');
Application.Services = angular.module('application.services', []);
Application.Controllers = angular.module('application.controllers', []);
Application.Filters = angular.module('application.filters', []);
Application.Directives = angular.module('application.directives', []);

// 1.2.11
//angular.module('application', ['application.filters', 'application.services', 'application.directives', 'application.controllers', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ngCookies'  ])
    //1.1.15
angular.module('application', ['ngCookies','application.filters' ,'application.services', 'application.directives', 'application.controllers', 'ui.bootstrap'])

    .run(function ($rootScope, $location) {
        $rootScope.user = {};

    })
    .factory('masHelper', function ($rootScope) {

        var buildIndex = function (source, property) {
            var tempArray = [];
            for (var i = 0, len = source.length; i < len; ++i) {
                tempArray[source[i][property]] = source[i];
            }
            return tempArray;
        };
        return {
            buildIndex: buildIndex
        };
    })
    //
    .factory('masModel', function ($rootScope) {
        var getStatuses = function () {
            var tempArray = [
                {name: 'Back Log'},
                {name: 'To Do'},
                {name: 'In Progress'},
                {name: 'Code Review'},
                {name: 'QA Review'},
                {name: 'Verified'},
                {name: 'Done'}
            ];
            return tempArray;
        };
        var getOpenClaims = function () {
            var tempArray = [
                {CLAIM_NO: '0', title: 'Claim 00', description: 'Description pending.', criteria: 'Criteria pending.', status: 'To Do', type: '1', LEGAL_NAME: 'Jonas Smith', assignee: 'Brian Ford'},
                {CLAIM_NO: '1', title: 'Claim 01', description: 'Description pending.', criteria: 'Criteria pending.', status: 'Back Log', type: '1', LEGAL_NAME: 'Tye Markel', assignee: 'Brian Ford'},
                {CLAIM_NO: '2', title: 'Claim 02', description: 'Description pending.', criteria: 'Criteria pending.', status: 'Code Review', type: '2', LEGAL_NAME: 'Lukas Ruebbelke', assignee: 'Brian Ford'},
                {CLAIM_NO: '3', title: 'Claim 03', description: 'Description pending.', criteria: 'Criteria pending.', status: 'Done', type: '2', LEGAL_NAME: 'Kevin Keene', assignee: 'Brian Ford'},
                {CLAIM_NO: '4', title: 'Claim 04', description: 'Description pending.', criteria: 'Criteria pending.', status: 'Verified', type: '3', LEGAL_NAME: 'Ted Romano', assignee: 'Brian Ford'},
                {CLAIM_NO: '5', title: 'Claim 05', description: 'Description pending.', criteria: 'Criteria pending.', status: 'To Do', type: '4', LEGAL_NAME: 'Thom Thomas', assignee: 'Brian Ford'}
            ];

            return tempArray;
        };
        return {
            getStatuses: getStatuses,

            getClaims: getOpenClaims
        };
    }


)

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

        var access = routingConfig.accessLevels;

        $routeProvider

            .when('/', {templateUrl: '/partials/login', controller: 'LoginCtrl', access: access.public }) //user
            .when('/login', {templateUrl: '/partials/login', controller: 'LoginCtrl', access: access.anon })


            .when('/logout', {templateUrl: '/partials/login', controller: 'LogoutCtrl', access: access.anon})
            .when('/claim', {templateUrl: '/partials/claim', controller: 'ClaimCtrl', access: access.anon})
            .when('/claim/:id', {templateUrl: '/partials/claimedit', controller: 'ClaimEditCtrl', access: access.anon})

            .when('/404', {templateUrl: '/partials/404', access: access.public  })
            .otherwise({redirectTo: '/404'});

        $locationProvider.html5Mode(true);

        var interceptor = ['$location', '$q', function ($location, $q) {
            function success(response) {
                return response;
            }

            function error(response) {

                if (response.status === 401) {
                    $location.path('/login');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }

            return function (promise) {
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
                if (Auth.isLoggedIn()) $location.path('/');
                else                  $location.path('/login');
            }
        });
        $rootScope.appInitialized = true;
    }]);