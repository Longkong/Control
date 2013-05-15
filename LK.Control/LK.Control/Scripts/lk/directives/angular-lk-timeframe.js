/// <reference path="../../angular.js" />


angular.module('lk.timeframe', ['lk.timeframe.tokenFilters']);





angular.module('lk.timeframe.tokenFilters', ['ui']).directive("lkTimeframefilters", function ($compile, $document, $parse, $http) {
    return {
        //restrict: 'A',
        requrie: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {

            scope.showhide = "  Show Date line  ";

            scope.Filters = [];
            var Filtername = [];
            var Filtersum = [];
            var Filtercount = 0;
            var datenow = new Date();
            var datestring = datenow.getDate() + '/' + datenow.getMonth() + '/' + datenow.getFullYear();
            $http({ method: 'GET', url: '/search/CreateSearch' }).success(function (data, status) {
           

                for (var i = 0; i < data.filters.length; i++) {

                    if (data.filters[i].timeframes != null) {
                        // Filtername to dropdown Add
                        Filtername[Filtercount] = data.filters[i];
                        Filtername[Filtercount].indexline = Filtercount;
                        if (Filtercount != 0) {
                            Filtername[Filtercount].selected = false;
                        }
                        else { Filtername[Filtercount].selected = true; }

                        // Filtersum to detail
                        Filtersum[Filtercount] = data.filters[i];
                        Filtersum[Filtercount].isCollapsed = true;
                        Filtersum[Filtercount].startdate = datestring;
                        Filtersum[Filtercount].enddate = datestring;
                        Filtersum[Filtercount].typedate = "All Date ";
                        Filtercount += 1;
                    }

                }
                scope.countline = "("+Filtercount+")";
                scope.Filters.push(Filtersum[0]);
            });
        
            scope.Adddropdowns = Filtername;

            scope.addDate = function (tf, index) {
                this.Filters[index].typedate = tf;
                if (tf == "Period") {
                    this.Filters[index].isCollapsed = false;

                } else {
                    this.Filters[index].isCollapsed = true;
                }
            };
            //Click | X ]
            scope.removeContact = function (FilterIndex) {
                console.log(FilterIndex);
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
            scope.addContact = function (indexline, selected, name) {
         
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
            //Show Line
            scope.showline = function (showline) {
                console.log(showline);
                if (showline) {
                    this.showhide = "  Hide Date line  ";
                } else {
                    this.showhide = "  Show Date line  ";
                }
            };
            $(document).on('click', '.multiple-select-wrapper .list', function (e) {
       
                e.stopPropagation();
            });
   

            $(document).on('click', '.selected-items-box', function (e) {
 
                e.stopPropagation();
       
                $('.multiple-select-wrapper .list').toggle('slideDown');

            });

            $(document).bind('click', function () {

                $('.multiple-select-wrapper .list').slideUp();
            });
      
            var tpltokenCompile = $compile('<input type="checkbox" ng-model="checked" ng-click="showline(checked)">{{showhide}}{{countline}}<div ng-show="checked"><div >'
                             + '<div ng-repeat="Filter in Filters" >'
                             + '<ul>{{Filter.name}}| <a href="" ng-click="removeContact($index)">X</a> ]'
                             + '<li ng-repeat="tf in Filter.timeframes" ng-click="addDate(tf,$parent.$index)" >{{tf}}</li></ul>'
                             + '<div collapse="Filter.isCollapsed" ng-model="Filter.isCollapsed">'
                             + '<li ng-hide="Filter.isCollapsed"> StartDate : </li>'
                             + '<input type="text"  ng-hide="Filter.isCollapsed" ng-model="Filter.startdate"  datepicker> EndDate:'
                             + '<input type="text"  ng-hide="Filter.isCollapsed" ng-model="Filter.enddate" datepicker>'
                             + '</div>'
                             + '</div>'
                             + '</div>'
                             + '<div class="multiple-select-wrapper"> <div class="selected-items-box">'
                             + '<span class="dropdown-icon"></span>'
                             + '<span  title="{{Adddropdown.name}}">Add</span></div>'
                             + '<div class="list"><ul class="items-list">'
                             + '<li ng-repeat="Adddropdown in Adddropdowns">'
                             + '<input type="checkbox" ng-model="Adddropdown.selected" ng-click="addContact(Adddropdown.indexline,Adddropdown.selected,Adddropdown.name)" />'
                             + '<span>{{Adddropdown.name}}</span></li></ul></div></div>'
                             + '<button>Cancel</button><button ng-click="done(Filter)">Done</button></div>'
                


                      )(scope);


            var buttonId, html, title;

            buttonId = Math.floor(Math.random() * 10000000000);

            attrs.buttonId = buttonId;

            //element.append(tplbuttonCompile);


            element.datepicker({
                dateFormat: 'dd/mm/yy',
                onSelect: function (date) {
                    ngModelCtrl.$setViewValue(date);
                    scope.$apply();
                }
            });

            element.popover({
                content: tpltokenCompile,
                html: true,
                trigger: "manual",
                title: title
                , placement: "bottom"
            });

            var chkshow=true;
            return element.bind('click', function (e) {
                var dontBubble, pop;
                dontBubble = true;
          element.popover('show'); 
                //e.stopPropagation();
                //if (chkshow) {
                //    console.log(chkshow);
                //   chkshow = false;
                //}
                //else {
                //    element.popover('hide'); chkshow = true;
                //}
            

                //pop = $("#button-" + buttonId);




                //pop.closest(".popover").click(function (e) {
                  
                //    if (dontBubble) {
                //        e.stopPropagation();
                //    }
                //});

                //$document.on('click.confirmbutton.' + buttonId, ":not(.popover-content)", function () {
                //    console.log("sasa");
                //    //$document.off('click.confirmbutton.' + buttonId);
                //    //element.popover('hide');
                //});
                //$document.on('click.confirmbutton.' + buttonId, ":not(.popover, .popover *)", function() {
                //    $document.off('click.confirmbutton.' + buttonId);
                //    element.popover('hide');
                //});
            });
        }
    };
});



