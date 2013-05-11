/// <reference path="../../angular.js" />

angular.module('TypeAndMore', ['lk.search.typeandmore']);

function SearchTypeAndMoreCtrl($scope,$http) {
    $scope.typeandmoremodel = undefined;
    $scope.filters = undefined;
    $scope.query = "";

    $scope.dropdownlimit = 3;

    $scope.onSelectmatch = function (selectitem) {
        console.log(selectitem);
    }

    $scope.onSelectfilter = function (selectfilter) {
        console.log(selectfilter);
    }
   
}