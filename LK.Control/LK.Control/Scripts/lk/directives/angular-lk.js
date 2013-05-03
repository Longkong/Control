/// <reference path="../../angular.js" />


angular.module('lk.search.config', []).value('lk.search.config', {});
angular.module('lk.search', ["lk.search.tokenFilters", 'lk.search.config']);

angular.module('lk.search.tokenFilters', [])

  .directive('lkTokenfilters', function ($compile, $http) {
      var HOT_KEYS = [9, 13, 27, 38, 40];
      return {
          requrie: 'ngModel',
          link: function (scope, element, attrs, modelCtrl) {

              var tpltokenCompile = $compile('<ul>'
                           + '<li><ul ng-repeat="token in tokens">'
                           + '<li>{{token.name}}</li>'
                           + '<li><ul><li ng-repeat="tquery in token.queries">{{tquery}}</li></ul></li>'
                           + '<li ng-click="removetoken($index)">x</li>'
                           + '</ul></li>'
                           + '<li><input id="inputbox" ng-model="query" ng-change=doquery() /></li>'
                       + '</ul>')(scope);
              var tplbuttonCompile = $compile('<button id="buttonsearch" ng-click="dosearch()" >Search</button>')(scope);
              var tpldropdownCompile = $compile('<div id="searchdropdown" ng-show="showdropdown">'
                        + '<ul ng-repeat="filter in filters">'
                            + '<span  ng-class="{active: isActive($index,-1)}" ng-mouseover="selectfilterActive($index)"  ng-click="selectfilter($index)" >[{{$index+1}}]{{filter.name}} : {{query}}</span>'
                           + '<li><ul>'
                             + '<li ng-repeat="match in filter.matchs" ng-class="{active: isActive($parent.$index,$index) }" ng-mouseover="selectmatchActive($parent.$index,$index)" ng-click="selectmatch($parent.$index,$index)" >'
                             + '<span>[{{$parent.$index+1}}][{{$index+1}}]{{match.Name}} <em>{{match.Description}}</em></span>'
                             + '</li></ul>'
                     + '</li>'
                        + '</ul>'
                    + '</div>')(scope);



              element.append(tpltokenCompile);
              element.append(tplbuttonCompile);
              element.after(tpldropdownCompile);

              //ต้องอยู่หลัง element compile เพื่อ bind event
              var elm = angular.element("#inputbox");

              //Dropdown search
              scope.doquery = function () {
                  if (scope.query) {
                      scope.mapIndexes = [];
                      scope.maxIndex = 0;
                      angular.forEach(scope.filters, function (filter) {
                          if (filter.uri) {
                              $http({ method: 'GET', url: filter.uri, params: { query: scope.query } })
                                  .success(function (data, status) {
                                      filter.matchs = data;
                                      filter.status = status;
                                  });
                          } 
                      });
                      setActive()
                  } else {
                      resetActive();
                  }
              }

              
             

              //Real Search
              scope.dosearch = function () {
                  $http({ method: 'GET', url: scope.searchmodel.uri, params: { req: scope.tokens } })
                      .success(function (data, status) {
                          scope.searchresults = data;
                          scope.status = status;
                      });
                  resetActive();
              }


              function inserttoken(token) {
                  var notfoundtk = true;
                  angular.forEach(scope.tokens, function (tk) {
                      if (tk.name == token.name) {
                          var newquery = token.queries[0];
                          var i = 0;
                          var notfoundq = true;
                          angular.forEach(tk.queries, function (query) {
                              //ไม่ให้ query ซ้ำ
                              if (newquery.indexOf(query) >= 0) {
                                  notfoundq = false;
                              } else {
                                  notfoundq = true;
                              }
                              i++;
                          });
                          if (notfoundq) {
                              tk.queries.push(newquery);
                          }
                          notfoundtk = false;
                      }
                  });
                  if (notfoundtk) {
                      var newidx = scope.tokens.push(token) - 1;
                  }
              }

              var token = (function () {
                  function token(filter, query) {
                      this.name = filter.name;
                      this.queries = [query];
                  }
                  return token;
              })();



              scope.removetoken = function (tokenIdx) {
                  // Remove this token from the saved list
                  scope.tokens = scope.tokens.slice(0, tokenIdx).concat(scope.tokens.slice(tokenIdx + 1));
              }

              

              // manage dropdown
              //mouse event on dropdown

              function setActive() {
                  scope.filteractive = 0;
                  scope.showdropdown = true;
              }

              var resetActive = function () {
                  scope.query = "";
                  scope.matchactive = -1;
                  scope.filteractive = -1;
                  scope.showdropdown = false;
                  elm.focus();
              };
              resetActive();
              var c = 0;
              scope.isActive = function (filterIdx, matchIdx) {
                  if (scope.filteractive == filterIdx) {
                      if (scope.matchactive == matchIdx) {
                      console.log("active"+filterIdx.toString()+matchIdx.toString())
                      }
                  }

                  return scope.filteractive == filterIdx && scope.matchactive == matchIdx;
              };

              scope.selectfilterActive = function (filterIdx) {
                  scope.matchactive = -1;
                  scope.filteractive = filterIdx;
              }
              scope.selectmatchActive = function (filterIdx, matchIdx) {
                  scope.matchactive = matchIdx;
                  scope.filteractive = filterIdx;
              }

              scope.selectfilter = function (activeIdx) {
                  var tk = new token(scope.filters[activeIdx], scope.query);
                  inserttoken(new token(scope.filters[activeIdx], scope.query));
                  scope.filteractive = activeIdx;
                  scope.showdropdown = false;
                  resetActive();
              }
              scope.selectmatch = function (parentIdx, activeIdx) {
                  var q = scope.filters[parentIdx].matchs[activeIdx].Name;
                  var tk = new token(scope.filters[parentIdx], q);
                  inserttoken(new token(scope.filters[parentIdx], q));
                  scope.matchactive = activeIdx;
                  scope.filteractive = parentIdx;
                  scope.showdropdown = false;
                  resetActive();
              }

             

              
              //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
              elm.bind('keydown', function (evt) {

                  //typeahead is open and an "interesting" key was pressed
                  if (scope.filters.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
                      return;
                  }

                  evt.preventDefault();
                  var fa = scope.filteractive;
                  var ma = scope.matchactive;
                  var maxfa = scope.filters.length;
                  if (evt.which === 40) {
                      if (scope.filters[fa]) {
                          if (scope.filters[fa].matchs && scope.filters[fa].matchs.length-1 > ma) {
                              scope.matchactive = ma + 1;
                          } else {
                              scope.filteractive = (fa + 1) % maxfa;
                              scope.matchactive = -1;
                          }
                      } 
                      scope.$digest();

                  } else if (evt.which === 38) {
                      if (scope.filters[fa]) {
                          if (scope.filters[fa].matchs && -1 < ma) {
                              scope.matchactive = ma - 1;
                          } else {
                              var iff = (fa - 1) > -1;
                              scope.filteractive = (iff ? fa: maxfa)-1;
                              scope.matchactive = (scope.filters[scope.filteractive].matchs?scope.filters[scope.filteractive].matchs.length:0) - 1;
                          }
                      }
                      scope.$digest();

                  } else if (evt.which === 13 || evt.which === 9) {
                      if (scope.matchactive == -1) {
                          scope.$apply(function () {
                              scope.selectfilter(scope.filteractive);
                          });
                      } else {
                          scope.$apply(function () {
                              scope.selectmatch(scope.filteractive, scope.matchactive);
                          });
                      }
                      resetActive();
                  } else if (evt.which === 27) {
                      resetActive();
                      scope.$digest();
                  }
              });
          }
      };
  });