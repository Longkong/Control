/// <reference path="../../angular.js" />

angular.module('searchToken', ['lk.search']);


function SearchTokenFilterCtrl($scope, $http) {
    $scope.searchmodel = undefined;
    $scope.filters = undefined;
    $scope.searchresults = undefined;
    $scope.tokens = [];
    $scope.query = "";

    //Create Context for search
    $http({ method: 'GET', url: '/search/CreateSearch' }).success(function (data, status) {
        $scope.searchmodel = data;
        $scope.filters = data.filters;
        $scope.dosearch();
    });

 
}
