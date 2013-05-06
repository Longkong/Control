/// <reference path="../../angular.js" />

angular.module('TypeAndMore', ['lk.search.typeandmore']);

function SearchTypeAndMoreCtrl($scope,$http) {
    $scope.typeandmoremodel = undefined;
    $scope.filters = undefined;
    $scope.query = "";

    //Create Context for search
    $http({ method: 'GET', url: '/search/CreateSearchTypeAndMore' }).success(function (data, status) {
        $scope.typeandmoremodel = data;
        $scope.filters = data.filters;
    });

    $scope.onSelectmatch = function (selectitem) {
        console.log(selectitem);
    }

    $scope.onSelectfilter = function (selectfilter) {
        console.log(selectfilter);
    }
   
}