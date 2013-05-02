/// <reference path="../../angular.js" />
/// <reference path="../../angular-ui.js" />

// Install angular-ui
angular.module('demoApp', ['ui'], function ($locationProvider) {
    $locationProvider.hashPrefix('');
})


//Tokens is query to search
//tokens: {[
//    token:{
//            name:'name',
//            queries:['a','b']
//    }
//    ]
//}


// Search Controller
function SearchUICtrl($scope, $http,$compile) {
    $scope.status = "";
    $scope.query = "";
    $scope.showdropdown = false;
    $scope.filters = undefined;
    $scope.tokens = [];

    //Create Context for search
    $http({ method: 'GET', url: 'Search/CreateSearch' }).success(function (data, status) {
        $scope.SearchUI = data;
        $scope.filters = data.filters;
        $scope.dosearch();
    });


    //Dropdown search
    $scope.doquery = function () {
        if ($scope.query) {
            angular.forEach($scope.filters, function (filter) {
                if (filter.uri) {
                    $http({ method: 'GET', url: filter.uri, params: { query: $scope.query } })
                        .success(function (data, status) {
                            filter.matchs = data;
                            filter.status = status;
                        });
                }
            });
            $scope.showdropdown = true;
        } else {
            $scope.showdropdown = false;
        }
    }

    //Real Search
    $scope.dosearch = function () {
        //var reqtoken = $scope.tokens;
        //if (!$scope.tokens) {
        //    reqtoken = "a";
        //} 
        $http({ method: 'GET', url: $scope.SearchUI.uri, params: { req: $scope.tokens } })
            .success(function (data, status) {
                $scope.searchresults = data;
                $scope.status = status;
            });
        $scope.showdropdown = false;
    }

    $scope.blurCallback = function () {
        //$scope.showdropdown = false;
    }

    // Do Token
    // insert token
    function insertQueries() {

    }
    function inserttoken(token) {
        var notfound = true;
        angular.forEach($scope.tokens, function (tk) {
            if (tk.name == token.name) {
                var newquery = token.queries[0];
                var i = 0;
                angular.forEach(tk.queries, function (query) {
                    //ไม่ให้ query ซ้ำ
                    if (newquery.indexOf(query) >= 0) {
                        tk.queries = tk.queries.slice(0, i).concat(tk.queries.slice(i + 1));
                        tk.queries.push(newquery);
                    } else {
                        tk.queries.push(newquery);
                    }
                    i++;
                });
                notfound = false;
            }
        });
        if (notfound) {
            var newidx = $scope.tokens.push(token) - 1;
        }
    }

    var token = (function () {
        function token(filter, query) {
            this.name = filter.name;
            this.queries = [query];
        }
        return token;
    })();

    $scope.removetoken = function (tokenIdx) {
        // Remove this token from the saved list
        $scope.tokens = $scope.tokens.slice(0, tokenIdx).concat($scope.tokens.slice(tokenIdx + 1));
    }

    // manage dropdown
    $scope.dropdownevent = "not focus";
    //mouse event on dropdown
    $scope.filterMouseOver = function (matchIdx) {
        var idx = matchIdx;
        $scope.dropdownevent = "over on " + idx.toString();
    }
    $scope.matchMouseOver = function (parentIdx, matchIdx) {
        var idx = matchIdx;
        var parIdx = parentIdx;
        $scope.dropdownevent = "over on " + parIdx.toString() + '.' + idx.toString();
    }

    $scope.filterClick = function (activeIdx) {
        var tk = new token($scope.filters[activeIdx], $scope.query);
        inserttoken(new token($scope.filters[activeIdx], $scope.query));
        var idx = activeIdx;
        $scope.dropdownevent = "result click on " + idx.toString();
    }
    $scope.matchClick = function (parentIdx, activeIdx) {
        var q = $scope.filters[parentIdx].matchs[activeIdx].Name;
        var tk = new token($scope.filters[parentIdx], q);
        inserttoken(new token($scope.filters[parentIdx], q));
        var idx = activeIdx;
        var parIdx = parentIdx;
        $scope.dropdownevent = "result click on " + parIdx.toString() + '.' + idx.toString();
    }



    $scope.renderPartial = function () {
        $http({ method: 'GET', url: "search/part" })
                            .success(function (data) {
                                console.log(data);
                                var a = angular.element("#part");
                                console.log(a);
                                var c = $compile(data)($scope);
                                a.append(c);
                                filter.status = status;
                            });

    }
}



