function KeyPressCtrl($scope,$resource, $location, $routeParams,$filter, $http,Auth,$timeout) {
    $scope.preloadTags = function () {
        var newTag = $scope.newTag;
        if (newTag && newTag.trim()) {
            newTag = newTag.trim().toLowerCase();
            $http(
                {
                    method: 'GET',
                    url: 'api/tag/gettags',
                    dataType: 'json',
                    contentType: 'application/json',
                    mimeType: 'application/json',
                    params: {'term': newTag}
                }
            )
                .success(function (result) {
                    $scope.preloadedTags = result;
                    $scope.preloadedTagsIndex = -1;
                }
            )
                .error(function (data, status, headers, config) {
                }
            );
        } else {
            $scope.preloadedTags = {};
            $scope.preloadedTagsIndex = -1;
        }
    };

    function checkIndex(index) {
        if (index > $scope.preloadedTags.length - 1) {
            return 0;
        }
        if (index < 0) {
            return $scope.preloadedTags.length - 1;
        }
        return index;
    }

    function removeAllActiveTags() {
        for (var x = 0; x < $scope.preloadedTags.length; x++) {
            if ($scope.preloadedTags[x].activeTag) {
                $scope.preloadedTags[x].activeTag = false;
            }
        }
    }

    $scope.navigateTags = function ($event) {
        if (!$scope.newTag || $scope.preloadedTags.length == 0) {
            return;
        }
        if ($event.keyCode == 40) {  // down
            removeAllActiveTags();
            $scope.preloadedTagsIndex = checkIndex($scope.preloadedTagsIndex + 1);
            $scope.preloadedTags[$scope.preloadedTagsIndex].activeTag = true;
        } else if ($event.keyCode == 38) {  // up
            removeAllActiveTags();
            $scope.preloadedTagsIndex = checkIndex($scope.preloadedTagsIndex - 1);
            $scope.preloadedTags[$scope.preloadedTagsIndex].activeTag = true;
        } else if ($event.keyCode == 13) {  // enter
            removeAllActiveTags();
            $scope.selectTag($scope.preloadedTags[$scope.preloadedTagsIndex]);
        }
    };

    $scope.selectTag = function (preloadedTag) {
        $scope.addTag(preloadedTag.label);
    };
}
