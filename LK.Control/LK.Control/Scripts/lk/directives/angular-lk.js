/// <reference path="../../angular.js" />


angular.module('lk.search.config', []).value('lk.search.config', {});
angular.module('lk.search', ["lk.search.tokenFilters",'lk.search.config']);

angular.module('lk.search.tokenFilters', [])

  .directive('lkTokenfilters', function ($compile,$http) {
      var HOT_KEYS = [9, 13, 27, 38, 40];
      return {
          requrie: 'ngModel',
          link: function (scope,element,attrs,modelCtrl) {

              //Dropdown search
              scope.doquery = function () {
                  if (scope.query) {
                      var i = 0;
                      scope.mapIndexes = [];
                      scope.maxIndex = 0;
                      angular.forEach(scope.filters, function (filter) {
                          var len = 0;
                          if (filter.uri) {
                              $http({ method: 'GET', url: filter.uri, params: { query: scope.query } })
                                  .success(function (data, status) {
                                      filter.matchs = data;
                                      len = filter.matchs.length;
                                      filter.status = status;
                                  });
                          }
                          scope.maxIndex = scope.maxIndex+ i+ len;
                          scope.mapIndexes.push(new mapIndex(i, len));
                          i++;
                      });
                      scope.showdropdown = true;
                  } else {
                      scope.showdropdown = false;
                  }
              }

              //Real Search
              scope.dosearch = function () {
                  $http({ method: 'GET', url: scope.searchmodel.uri, params: { req: scope.tokens } })
                      .success(function (data, status) {
                          scope.searchresults = data;
                          scope.status = status;
                      });
                  scope.showdropdown = false;
              }


              function inserttoken(token) {
                  var notfound = true;
                  angular.forEach(scope.tokens, function (tk) {
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

              var mapIndex = (function () {
                  function mapIndex(parIdx, len) {
                      this.filterIdx = parIdx;
                      this.matchlen = len;
                  }
                  return mapIndex;
              })();

              function setActiveIdx(activeIdx) {
                  if (scope.mapIndexes && scope.mapIndexes.length > 0 && activeIdx <= scope.maxIndex) {
                      var tmp = scope.mapIndexes.length;
                      var stIdx = 0;
                      angular.forEach(scope.mapIndexes, function (map) {
                          if (activeIdx >= stIdx && activeIdx < map.parIdx + map.matchlen + stIdx+1) {
                              scope.selectmatchActive(parIdx, activeIdx - (map.matchlen + stIdx+1));
                          } 
                          stIdx = map.parIdx + map.matchlen + stIdx + 1;
                      });
                  }
              }

              //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(9)
              element.bind('keydown', function (evt) {

                  //typeahead is open and an "interesting" key was pressed
                  if (scope.filters.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
                      return;
                  }

                  evt.preventDefault();

                  if (evt.which === 40) {
                      scope.activeIdx = (scope.activeIdx + 1) % scope.maxIndex;
                      setActiveIdx(scope.activeIdx);
                      scope.$digest();

                  } else if (evt.which === 38) {
                      scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.maxIndex) - 1;
                      setActiveIdx(scope.activeIdx);
                      scope.$digest();

                  } else if (evt.which === 13 || evt.which === 9) {
                      if (scope.matchactive =-1) {
                          scope.$apply(function () {
                              scope.selectfilter(scope.filteractive);
                          });
                      } else {
                          scope.$apply(function () {
                              scope.selectmatch(scope.filteractive,scope.matchactive);
                          });
                      }
                      

                  } else if (evt.which === 27) {
                      scope.activeIdx = -1;
                      scope.selectmatchActive(-1, -1);
                      scope.$digest();
                  }
              });

              // manage dropdown
              scope.dropdownevent = "not focus";
              //mouse event on dropdown
              var resetMatches = function () {
                  scope.activeIdx = -1;
              };

              resetMatches();

              scope.isActive = function (filterIdx, matchIdx) {
                  return scope.filteractive = filterIdx && scope.matchactive == matchIdx;
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
              }
              scope.selectmatch = function (parentIdx, activeIdx) {
                  var q = scope.filters[parentIdx].matchs[activeIdx].Name;
                  var tk = new token(scope.filters[parentIdx], q);
                  inserttoken(new token(scope.filters[parentIdx], q));
                  scope.matchactive = activeIdx;
                  scope.filteractive = parentIdx;
              }

              var tpltokenCompile = $compile('<ul>'
                        + '<li><ul ng-repeat="token in tokens">'
                        +'<li>{{token.name}}</li>'
                        +'<li><ul><li ng-repeat="tquery in token.queries">{{tquery}}</li></ul></li>'
                        +'<li ng-click="removetoken($index)">x</li>'
                        +'</ul></li>'
                        + '<li><input id="token" ng-model="query" ng-change=doquery() /></li>'
                    +'</ul>')(scope);
              var tplbuttonCompile = $compile('<button id="buttonsearch" ng-click="dosearch()" >Search</button>')(scope);
              var tpldropdownCompile = $compile('<div id="searchdropdown" ng-show="showdropdown">'
                        +'<ul ng-repeat="filter in filters">'
                            + '<li ng-class="{active: isActive($index,-1)}" ng-mouseover="selectfilterActive($index)"  ng-click="selectfilter($index)" >'
                            +'<span>[{{$index+1}}]{{filter.name}} : {{query}}</span></li>'
                            +'<li>'+
                                +'<ul>'
                                    + '<li ng-repeat="match in filter.matchs" ng-class="{active: isActive($parent.$index,$index) }" ng-mouseover="selectmatchActive($parent.$index,$index)" ng-click="selectmatch($parent.$index,$index)" >'
                                    + '<span>[{{$parent.$index+1}}][{{$index+1}}]{{match.Name}} <em>{{match.Description}}</em></span>'
                                    +'</li>'
                                +'</ul>'
                            +'</li>'
                        +'</ul>'
                    +'</div>')(scope);

              element.append(tpltokenCompile);
              element.append(tplbuttonCompile);
              element.after(tpldropdownCompile);
          }
      };
  });