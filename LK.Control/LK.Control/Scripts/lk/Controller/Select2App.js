/// <reference path="../../angular.js" />
var app = angular.module('myApp', ['ui']);

app.controller('MainCtrl', function ($scope, $http) {
    var items;

    $http({ method: 'GET', url: '/api/master1', params: { req: '' } })
                                 .success(function (data, status) {
                                     $scope.master1s = data;
                                 });

    // Built-in support for ajax
    $scope.version4 = {
        query: function (query) {
            var data = { results: [] };
            //for (i = 1; i < 5; i++) {
            //    s = "";
            //    for (j = 0; j < i; j++) { s = s + query.term; }
            //    data.results.push({ id: query.term + i, text: s });
            //}
            angular.forEach($scope.master1s, function (master) {
                    data.results.push({ id: master.Id , text: master.Name ,obj:master});
            });
            query.callback(data);
        }
    }


    $scope.addmore = function () {
        console.log($scope.version4model);
    }

    $scope.version4model = "";

    $scope.options = {
        tags: ['red', 'yellow', 'blue']
    };

    $scope.selectedOptions = ['yellow'];
});


