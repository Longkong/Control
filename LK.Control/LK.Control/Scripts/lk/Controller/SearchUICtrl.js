/// <reference path="../../angular.js" />

function SearchUICtrl($scope, $http) {
    $http({method:'GET',url:'Search/CreateSearch'}).success(function(data,status) {
        $scope.SearchUI = data;
        $scope.status = status;
        $scope.dosearch();
    });
    $scope.status = "";
    $scope.query = "";
    $scope.doquery = function () {
        if ($scope.query) {
            angular.forEach($scope.SearchUI.filters, function (filter) {
                if (filter.uri) {
                    $http({ method: 'GET', url: filter.uri, params: { query: $scope.query } })
                        .success(function (data, status) {
                        filter.results = data;
                        filter.status = status;
                    });
                }
            });
        }
    }
    //var SResults = [{Code:'code',DocDate:'date',master1:'mas'}];
    $scope.dosearch = function () {
        $http({ method: 'GET', url: $scope.SearchUI.uri, params: { req: $scope.query }})
            .success(function (data, status) {
            $scope.sresults = data;
            $scope.status = status;
        });
    }
}