
var module = angular.module('myApp', ['ui.bootstrap']);
var filtertext = [];
function TimeFrameFilterCtrl($scope, $http) {
    //$scope.showdetail = [{ name: '1', b: '2' }, { name: '5', b: '2' }];
    $scope.Filters = [];
    var indextimeframe;
    var Filtername = [];
    var Filtersum = [];
    var Filtercount = 0;
    var datenow = new Date();
    var datestring = datenow.getDate() + '/' + datenow.getMonth() + '/' + datenow.getFullYear();
    console.log($scope.showdetail);
    //Get values by cotrl
    $http({ method: 'GET', url: '/search/CreateSearch' }).success(function (data, status) {

        for (var i = 0; i < data.filters.length; i++) {

            if (data.filters[i].timeframes != null) {
                // Filtername to dropdown Add
                Filtername[Filtercount] = data.filters[i];
                Filtername[Filtercount].indexline = Filtercount;
                if (Filtercount != 0) {Filtername[Filtercount].selected = false;
                }
                else {Filtername[Filtercount].selected = true;  }

                // Filtersum to detail
                Filtersum[Filtercount] = data.filters[i];
                Filtersum[Filtercount].isCollapsed = true;
                Filtersum[Filtercount].startdate = datestring;
                Filtersum[Filtercount].enddate = datestring;
                Filtersum[Filtercount].typedate = "All Date ";
                Filtercount += 1;
            }

        }
        $scope.Filters.push(Filtersum[0]);
     
    });


    $scope.Adddropdowns = Filtername;
 
    ////Change date
    //$scope.change = function (startdate) {
    //    console.log(startdate);
    //};
  

    //Click Period collapsed show date
    $scope.addDate = function (tf, index) {
        this.Filters[index].typedate = tf;
        if (tf == "Period") {
            this.Filters[index].isCollapsed = false;

        } else {
            this.Filters[index].isCollapsed = true;
        }
    };

    //Click | X ]
    $scope.removeContact = function (FilterIndex) {
        var namedel = this.Filters[FilterIndex].name;
        this.Filters.splice(FilterIndex, 1);

        this.Adddropdowns.forEach(function ShowResults(value, index, ar) {
            if (value.name == namedel) {

                indextimeframe = index;
            }
        });
        this.Adddropdowns[indextimeframe].selected = false;
    };
      
    //Select Add
    $scope.addContact = function (indexline, selected, name) {
        if (selected) {
            this.Filters.push(Filtersum[indexline]);
        } else {
            this.Filters.forEach(function ShowResults(value, index, ar) {
                if (value.name == name) { indextimeframe = index; }
            }
                );
            this.Filters.splice(indextimeframe, 1);
        }
    };
    
   
    //$scope.getSelectedItemsOnly = function (item) {
    //    return item.selected;
    //};

    $scope.done = function () {
     
        var Filtershow = [];
        this.Filters.forEach(
            function ShowResults(value, index, ar) {
                Filtershow[index] = value;
        }
                );
        filtertext = Filtershow;
        TimeFrameFilterCtrl2($scope, $http);
    
    }
  

    $('.multiple-select-wrapper .list').bind('click', function (e) {
       
        e.stopPropagation();
    });


    $('.selected-items-box').bind('click', function (e) {
        console.log(e);
        e.stopPropagation();
        $('.multiple-select-wrapper .list').toggle('slideDown');
    });

  

    $(document).bind('click', function () {

        $('.multiple-select-wrapper .list').slideUp();
    });

  
}
module.directive('datepicker', function () {
 
  
    return {
        //restrict: 'A',
        //require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            $(function () {
                element.datepicker({
                    dateFormat: 'dd/mm/yy',
                    onSelect: function (date) {
                        console.log("aaa");
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    }
});









//angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
//    $templateCache.put("template/popover/popover.html",
//      "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
//      "  <div class=\"arrow\"></div>\n" +
//      "\n" +
//      "  <div class=\"popover-inner\">\n" +
//      "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3><p>custome<\p>\n" +
//      "      <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
//      "  </div>\n" +
//      "</div>\n" +
//      "");
//}]);


//var module = angular.module('myApp', ['ui.bootstrap', '$strap.directives']);
