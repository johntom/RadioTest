'use strict';
//socket
function ClaimCtrl($scope, $rootScope, masModel,  $q,  $location)
{
    $scope.color = 'red';//'blue';
    $scope.specialValue = {
        "id": "12345",
        "value": "green"
    };
    $scope.setcolorx = function(colorx){
        alert(colorx.value)

    }

   // alert( $scope.color)
    $scope.getClaims = function () {
        // fake claims for test
        $scope.claims =   masModel.getClaims();
         console.log(' $scope.claims ', $scope.claims )
    }
    $scope.getClaims();



//CLAIM_NO RECEIVED LAST_NAME DESCRIPTION LEGAL_NAME

    $scope.columns = [
        {
            'title': 'claim',
            'cols': '1',
            'dataField': 'CLAIM_NO'
        },
        {
            'title': 'RECEIVED',
            'cols': '1',
            'dataField': 'RECEIVED'
        },
        {
            'title': 'LAST_NAME',
            'cols': '2',
            'dataField': 'LAST_NAME'
        },
        {
            'title': 'LEGAL_NAME',
            'cols': '1',
            'dataField': 'LEGAL_NAME'
        }
    ];


    $scope.setCurrentClaim = function (claim) {

        $rootScope.claim = claim;
       // $location.path('/claim/' + claim.CLAIM_NO);

    };
    $scope.setCurrentClaimTest = function (claim) {

     //   $location.path('/claimView/' + claim.CLAIM_NO);

    };

};
