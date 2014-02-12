'use strict';
angular.module('application')
    .controller('AppCtrl',
        ['$rootScope', '$scope', '$location', 'Auth', function ($rootScope, $scope, $location, Auth) {

            $scope.keyup = function(keyEvent) {
                alert('Voila!');
                //console.log('keyup', keyEvent);
            };
            $scope.backspace = function(keyEvent) {
                alert('Backspace Voila!');
                //console.log('backspace', keyEvent);
            };

//            $scope.keypressCallback = function ($event) {
//                alert('Voila!');
//                $event.preventDefault();
//            };
            $scope.getUserRoleText = function (role) {
                return _.invert(Auth.userRoles)[role];
            };

            $scope.logout = function () {
                Auth.logout(function () {
                    //console.log('auth logout ')

                    window.location.reload();//Full page reload FIXES problem with socket io cookie
                }, function () {
                    $rootScope.error = "Failed to logout";
                });
            };
        }]);