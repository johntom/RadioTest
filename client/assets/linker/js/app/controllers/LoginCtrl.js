angular.module('application')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth', function ($rootScope, $scope, $location, $window, Auth) {
       $scope.color = 'red';//'blue';
        $scope.specialValue = {
            "id": "12345",
            "value": "green"
        };
        $scope.setcolorx = function(colorx){
           // alert(colorx.value)

        }


    }]);


angular.module('application')
    .controller('LogoutCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth', function ($rootScope, $scope, $location, $window, Auth) {

        console.log('LogoutCtrl')
//        Auth.logout(function () {
//        }, function () {
//        });// fake out sucess fail
//        $scope.rememberme = false;// true;
//        $scope.username = '';//'JRT';
//        $scope.password = '',//brm901';//123';
//            $location.path('/');// fixes menu

    }]);
