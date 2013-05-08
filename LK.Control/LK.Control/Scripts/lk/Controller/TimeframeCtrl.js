

var module = angular.module('myApp', ['ui.bootstrap']);

function SettingsController($scope) {
    var Filter = {};
    $scope.Filters = [];
    Filter.name = "docdate";
    Filter.isCollapsed = true;
    Filter.startdate = new Date("2012-09-01");
    Filter.enddate = new Date("2012-09-21");
    Filter.timeframes = ["this month", "Last 3 Month", "All Date", 'Period']

    $scope.Filters.push(Filter);

    $scope.done = function () {
        alert($scope.startdate + $scope.enddate);
    }

    $scope.addContact = function () {

        this.Filters.push({ timeframes: ['this month', 'Last 3 Month', 'All Date', 'Period'], startdate: "2012-09-01", isCollapsed: true });
 
    };

    $scope.addDate = function (tf, index) {
        if (tf == "Period") {
            this.Filters[index].isCollapsed = false;

        } else {
            this.Filters[index].isCollapsed = true;
        }

        console.log(index); console.log(this.Filters[index].isCollapsed);


    };
}



module.directive('datepicker', function () {
    var linker = function (scope, element, attrs) {
        element.datepicker();
    }

    return {
        restrict: 'A',
        link: linker
    }
});



