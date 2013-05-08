/// <reference path="../../angular.js" />

var myApp = angular.module('myApp', ['infinite-scroll']); //[]

myApp.controller('testinfinitescrollCtrl', function ($scope, $http) {
    $scope.busy = false;
    $scope.searchresults = [];

    $scope.addMore = function () {

        if ($scope.busy) return;
        $scope.busy = true;
        var last = $scope.searchresults.length;
        $http({ method: 'GET', url: "/api/DemoTransaction", params: { skip: last, take: 70 } })
                          .success(function (results, status) {
                              console.log(last);
                              angular.forEach(results, function (result) {
                                  $scope.searchresults.push(result);
                              });
                              $scope.status = status;
                              $scope.busy = false;
                          });
    }

  
});