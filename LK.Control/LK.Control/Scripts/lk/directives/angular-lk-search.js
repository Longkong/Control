/// <reference path="../../angular.js" />


angular.module('lk.search.config', []).value('lk.search.config', {});
angular.module('lk.search', ["lk.search.tokenFilters", 'lk.search.typeandmore', 'lk.search.typeahead',"template/lktypeahead/typeahead.html", 'lk.search.config']);

angular.module('lk.search.tokenFilters', [])

  .directive('lkTokenfilters', function ($compile, $http, $parse, $filter) {
      var HOT_KEYS = [9, 13, 27, 38, 40];
      return {
          requrie: 'ngModel',
          link: function (scope, element, attrs, modelCtrl) {

              //Create Context for search
              //รับค่า attribute มาใช้ ส่ง link ไปสร้าง model
              var getter = $parse(attrs.lkTokenfilters), setter = getter.assign, value = getter(scope), options = {};

              $http({ method: 'GET', url: value }).success(function (data, status) {
                  scope.searchmodel = data;
                  scope.filters = data.filters;
                  scope.placeholder = "type search for " + data.name;
                  scope.dosearch();
              });

              var tpltokenCompile = $compile('<ul class="input-fake">'
                           + '<li><ul ng-repeat="token in tokens" class="token-item">'
                           + '<li>{{token.name}}</li>'
                           + '<li><ul><li ng-repeat="tquery in token.queries">{{tquery}}</li></ul></li>'
                           + '<li ng-click="removetoken($index)">x</li>'
                           + '</ul></li>'
                           + '<li><input class="tokeninput" ng-model="query" placeholder="{{placeholder}}" /></li>'
                       + '</ul>')(scope);
              var tplbuttonCompile = $compile('<button class="buttonsearch" ng-click="dosearch()" >Search</button>')(scope);
              var tpldropdownCompile = $compile('<div class="searchdropdown" ng-show="showdropdown">'
                        + '<ul ng-repeat="filter in filters">'
                            + '<li  ng-class="{active: isActive($index,-1)}" ng-mouseover="selectfilterActive($index)"  ng-click="selectfilter($index)" >{{filter.name}} : {{query}}</li>'
                           + '<li><ul>'
                             + '<li ng-repeat="match in filter.matchs" ng-class="{active: isActive($parent.$index,$index) }" ng-mouseover="selectmatchActive($parent.$index,$index)" ng-click="selectmatch($parent.$index,$index)" >'
                             + '<span>{{match.Name}} <em>{{match.Description}}</em></span>'
                             + '</li></ul>'
                     + '</li>'
                        + '</ul>'
                    + '</div>')(scope);



              element.append(tpltokenCompile);
              element.append(tplbuttonCompile);
              element.after(tpldropdownCompile);
              //ต้องอยู่หลัง element compile เพื่อ bind event
              var inputelm = element.find('input');

              var tokenlimit = scope.tokenlimit;
              var dropdownlimit = scope.dropdownlimit;

              scope.$watch('query', function (newValue, oldValue) {
                  if (!newValue || newValue.length == 0) {
                      resetActive();
                  } else if (newValue.length == 1 && oldValue.length < 1) {
                      scope.doquery();
                  } else {
                      angular.forEach(scope.filters, function (filter) {
                          if (filter.allmatchs) {
                              filterMatch(filter);
                          }
                      });
                  }
              });

              function filterMatch(filter) {
                  filter.allmatchnum = $filter('filter')(filter.allmatchs, scope.query).length;
                  if (dropdownlimit && dropdownlimit > 0) {
                      filter.matchs = $filter('filter')(filter.allmatchs, scope.query).slice(0, dropdownlimit);
                  } else {
                      filter.matchs = $filter('filter')(filter.allmatchs, scope.query);
                  }
              }

              //Dropdown search
              scope.doquery = function () {
                  if (scope.query) {
                      angular.forEach(scope.filters, function (filter) {
                          if (filter.uri) {
                              $http({ method: 'GET', url: filter.uri, params: { query: scope.query } })
                                  .success(function (data, status) {
                                      filter.allmatchs = data;
                                      filterMatch(filter);
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
                  if (angular.isFunction(scope.clickSearch)) {
                      scope.clickSearch();
                  } else {
                      $http({ method: 'GET', url: scope.searchmodel.uri, params: { req: scope.tokens } })
                          .success(function (data, status) {
                              scope.searchresults = data;
                              scope.status = status;
                          });
                  }
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
                                  tk.queries.splice(i,1,newquery);
                              } else {
                                  notfoundq = true;
                              }
                              i++;
                          });
                          if (notfoundq && (!tokenlimit || tokenlimit == 0 || tk.queries.length <= tokenlimit)) {
                              tk.queries.push(newquery);
                          }
                          notfoundtk = false;
                      }
                  });
                  if (notfoundtk && (!tokenlimit || tokenlimit == 0 || scope.tokens.length <= tokenlimit)) {
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

              var resetActive = function (notclearquery) {
                  if (!notclearquery) {
                      scope.query = "";
                  }
                  scope.matchactive = -1;
                  scope.filteractive = -1;
                  scope.showdropdown = false;
              };
              resetActive();


              scope.isActive = function (filterIdx, matchIdx) {
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
                  inputelm.focus();
              }
              scope.selectmatch = function (parentIdx, activeIdx) {
                  var q = scope.filters[parentIdx].matchs[activeIdx].Name;
                  var tk = new token(scope.filters[parentIdx], q);
                  inserttoken(new token(scope.filters[parentIdx], q));
                  scope.matchactive = activeIdx;
                  scope.filteractive = parentIdx;
                  scope.showdropdown = false;
                  resetActive();
                  inputelm.focus();
              }


              inputelm.bind('blur', function (evt) {
                  resetActive(true);
              });

              //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
              inputelm.bind('keydown', function (evt) {

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
                          if (scope.filters[fa].matchs && scope.filters[fa].matchs.length - 1 > ma) {
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
                              scope.filteractive = (iff ? fa : maxfa) - 1;
                              scope.matchactive = (scope.filters[scope.filteractive].matchs ? scope.filters[scope.filteractive].matchs.length : 0) - 1;
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

angular.module('lk.search.typeandmore', [])

.directive('lkTypeandmore', function ($compile, $http, $parse, $filter) {
    var HOT_KEYS = [9, 13, 27, 38, 40];
    return {
        require: 'ngModel',
        link: function (scope, element, attrs) {

            //Create Context for search
            //รับค่า attribute มาใช้ ส่ง link ไปสร้าง model
            var getter = $parse(attrs.lkTypeandmore), setter = getter.assign, value = getter(scope), options = {};
            var maxfa = 0;
            //Create Context for search
            $http({ method: 'GET', url: value }).success(function (data, status) {
                scope.typeandmoremodel = data;
                scope.filters = data.filters;
                var add = 0
                if (data.moreuri) {
                    compilemore();
                    add++;
                    scope.moreidx = scope.filters.length + add-1;
                }
                if (data.createuri) {
                    compilecreate();
                    add++;
                    scope.createidx = scope.filters.length + add-1;
                }
                maxfa = scope.filters.length + add;
            });


            var tpldropdownCompile = $compile('<div class="searchdropdown" ng-show="showdropdown">'
                            + '<ul  ng-repeat="filter in filters">'
                                + '<li  ng-class="{active: isActive($index,-1)}" ng-mouseover="selectfilterActive($index)"  ng-click="selectfilter($index)" >{{filter.name}}</li>'
                                 + '<li ng-repeat="match in filter.matchs" ng-class="{active: isActive($parent.$index,$index) }" ng-mouseover="selectmatchActive($parent.$index,$index)" ng-click="selectmatch($parent.$index,$index)" >'
                                 + '<span>{{match.Name}} <em>{{match.Description}}</em></span>'
                                 + '</li>'
                            + '</ul>'
                        + '</div>')(scope);
            element.after(tpldropdownCompile);
            var tplmore = '<ul><li ng-click="doSearchMore()" ng-class="{active: isActive(moreidx,-1)}" ng-mouseover="selectfilterActive(moreidx)">Search More..{{query}}</li></ul>';
            var tplcreate = '<ul><li ng-click="doCreate()" ng-class="{active: isActive(createidx,-1)}" ng-mouseover="selectfilterActive(createidx)">Create..{{query}}</li></ul>';

            function compilemore() {
                element.next().append($compile(tplmore)(scope));
            }

            function compilecreate() {
                element.next().append($compile(tplcreate)(scope));
            }

            var dropdownlimit = scope.dropdownlimit;

            scope.$watch('query', function (newValue, oldValue) {
                if (!newValue || newValue.length == 0) {
                    resetActive();
                } else if (newValue.length == 1 && (!oldValue || oldValue.length < 1)) {
                    scope.doquerymore();
                } else {
                    angular.forEach(scope.filters, function (filter) {
                        if (filter.allmatchs) {
                            filterMatch(filter);
                        }
                    });
                }
            });

            function filterMatch(filter) {
                filter.allmatchnum = $filter('filter')(filter.allmatchs, scope.query).length;
                if (dropdownlimit && dropdownlimit > 0) {
                    filter.matchs = $filter('filter')(filter.allmatchs, scope.query).slice(0, dropdownlimit);
                } else {
                    filter.matchs = $filter('filter')(filter.allmatchs, scope.query);
                }
            }

            //Dropdown search
            scope.doquerymore = function () {
                if (scope.query) {
                    angular.forEach(scope.filters, function (filter) {
                        if (filter.uri) {
                            $http({ method: 'GET', url: filter.uri, params: { query: scope.query } })
                                .success(function (data, status) {
                                    filter.allmatchs = data;
                                    filterMatch(filter);
                                    filter.status = status;
                                });
                        }
                    });
                    setActive()
                } else {
                    resetActive();
                }
            }

            scope.doSearchMore = function () {
                if (scope.typeandmoremodel.moreuri) {
                    $http({ method: 'GET', url: scope.typeandmoremodel.moreuri, params: { filters: scope.filters } })
                        .success(function (data, status) {
                            filter.matchs = data;
                            filter.status = status;
                        });
                }
                resetActive();
            }

            scope.doCreate = function () {
                if (scope.typeandmoremodel.createuri) {
                    $http({ method: 'GET', url: scope.typeandmoremodel.createuri, params: { filters: scope.filters } })
                        .success(function (data, status) {
                            filter.matchs = data;
                            filter.status = status;
                        });
                }
                resetActive();
            }

            // manage dropdown
            //mouse event on dropdown

            function setActive() {
                scope.filteractive = 0;
                scope.showdropdown = true;
            }

            var resetActive = function () {
                scope.matchactive = -1;
                scope.filteractive = -1;
                scope.showdropdown = false;
            };
            resetActive();


            scope.isActive = function (filterIdx, matchIdx) {
                if (scope.filteractive == filterIdx) {
                    if (scope.matchactive == matchIdx) {
                        //console.log(filterIdx, matchIdx);
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
                var fil = scope.filters[parentIdx];
                if (angular.isFunction(scope.onSelectfilter)) {
                    scope.onSelectfilter(fil);
                }
                scope.showdropdown = false;
                resetActive();
            }

            scope.selectmatch = function (parentIdx, activeIdx) {
                var match = scope.filters[parentIdx].matchs[activeIdx];
                if (angular.isFunction(scope.onSelectmatch)) {
                    scope.onSelectmatch(match);
                }
                scope.showdropdown = false;
                resetActive();
            }

            element.bind('blur', function (evt) {
                resetActive();
            });

            //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
            element.bind('keydown', function (evt) {

                //typeahead is open and an "interesting" key was pressed
                if (scope.filters.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
                    return;
                }

                evt.preventDefault();
                var fa = scope.filteractive;
                var ma = scope.matchactive;
                if (evt.which === 40) {
                    if (scope.filters[fa] && scope.filters[fa].matchs && scope.filters[fa].matchs.length - 1 > ma) {
                        scope.matchactive = ma + 1;
                    } else {
                        scope.filteractive = (fa + 1) % maxfa;
                        scope.matchactive = -1;
                    }
                    scope.$digest();

                } else if (evt.which === 38) {
                    if (scope.filters[fa] &&  scope.filters[fa].matchs && -1 < ma) {
                        scope.matchactive = ma - 1;
                    } else {
                        var iff = (fa - 1) > -1;
                        scope.filteractive = (iff ? fa : maxfa) - 1;
                        if (scope.filters[scope.filteractive]) {
                            scope.matchactive = (scope.filters[scope.filteractive].matchs ? scope.filters[scope.filteractive].matchs.length : 0) - 1;
                        } else {
                            scope.matchactive = - 1;
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
    }
});


angular.module('lk.search.typeahead', ['ui.bootstrap.position'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('lktypeaheadParser', ['$parse', function ($parse) {

      //                      00000111000000000000022200000000000000003333333333333330000000000044000
      var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

      return {
          parse: function (input) {

              var match = input.match(TYPEAHEAD_REGEXP), modelMapper, viewMapper, source;
              if (!match) {
                  throw new Error(
                    "Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_'" +
                      " but got '" + input + "'.");
              }

              return {
                  itemName: match[3],
                  source: $parse(match[4]),
                  viewMapper: $parse(match[2] || match[1]),
                  modelMapper: $parse(match[1])
              };
          }
      };
  }])

  .directive('lkTypeahead', ['$compile', '$parse', '$q', '$document', '$position', 'lktypeaheadParser', function ($compile, $parse, $q, $document, $position, lktypeaheadParser) {

      var HOT_KEYS = [9, 13, 27, 38, 40];

      return {
          require: 'ngModel',
          link: function (originalScope, element, attrs, modelCtrl) {

              var selected;

              //minimal no of characters that needs to be entered before typeahead kicks-in
              var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

              //expressions used by typeahead
              var parserResult = lktypeaheadParser.parse(attrs.typeahead);

              //should it restrict model values to the ones selected from the popup only?
              var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

              var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

              //pop-up element used to display matches
              var popUpEl = angular.element(
                "<lktypeahead-popup " +
                  "matches='matches' " +
                  "active='activeIdx' " +
                  "select='select(activeIdx)' " +
                  "query='query' " +
                  "position='position'>" +
                "</lktypeahead-popup>");

              //create a child scope for the typeahead directive so we are not polluting original scope
              //with typeahead-specific data (matches, query etc.)
              var scope = originalScope.$new();
              originalScope.$on('$destroy', function () {
                  scope.$destroy();
              });

              var resetMatches = function () {
                  scope.matches = [];
                  scope.activeIdx = -1;
              };

              var getMatchesAsync = function (inputValue) {

                  var locals = { $viewValue: inputValue };
                  isLoadingSetter(originalScope, true);
                  $q.when(parserResult.source(scope, locals)).then(function (matches) {

                      //it might happen that several async queries were in progress if a user were typing fast
                      //but we are interested only in responses that correspond to the current view value
                      if (inputValue === modelCtrl.$viewValue) {
                          if (matches.length > 0) {

                              scope.activeIdx = 0;
                              scope.matches.length = 0;

                              //transform labels
                              for (var i = 0; i < matches.length; i++) {
                                  locals[parserResult.itemName] = matches[i];
                                  scope.matches.push({
                                      label: parserResult.viewMapper(scope, locals),
                                      model: matches[i]
                                  });
                              }

                              scope.query = inputValue;
                              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
                              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
                              //due to other elements being rendered
                              scope.position = $position.position(element);
                              scope.position.top = scope.position.top + element.prop('offsetHeight');

                          } else {
                              resetMatches();
                          }
                          isLoadingSetter(originalScope, false);
                      }
                  }, function () {
                      resetMatches();
                      isLoadingSetter(originalScope, false);
                  });
              };

              resetMatches();

              //we need to propagate user's query so we can higlight matches
              scope.query = undefined;

              //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
              //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
              modelCtrl.$parsers.push(function (inputValue) {

                  resetMatches();
                  if (selected) {
                      return inputValue;
                  } else {
                      if (inputValue && inputValue.length >= minSearch) {
                          getMatchesAsync(inputValue);
                      }
                  }

                  return isEditable ? inputValue : undefined;
              });

              modelCtrl.$render = function () {
                  var locals = {};
                  locals[parserResult.itemName] = selected || modelCtrl.$viewValue;
                  element.val(parserResult.viewMapper(scope, locals) || modelCtrl.$viewValue);
                  selected = undefined;
              };

              scope.select = function (activeIdx) {
                  //called from within the $digest() cycle
                  var locals = {};
                  locals[parserResult.itemName] = selected = scope.matches[activeIdx].model;

                  modelCtrl.$setViewValue(parserResult.modelMapper(scope, locals));
                  modelCtrl.$render();
              };

              //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
              element.bind('keydown', function (evt) {

                  //typeahead is open and an "interesting" key was pressed
                  if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
                      return;
                  }

                  evt.preventDefault();

                  if (evt.which === 40) {
                      scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
                      scope.$digest();

                  } else if (evt.which === 38) {
                      scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
                      scope.$digest();

                  } else if (evt.which === 13 || evt.which === 9) {
                      scope.$apply(function () {
                          scope.select(scope.activeIdx);
                      });

                  } else if (evt.which === 27) {
                      evt.stopPropagation();

                      resetMatches();
                      scope.$digest();
                  }
              });

              $document.bind('click', function () {
                  resetMatches();
                  scope.$digest();
              });

              element.after($compile(popUpEl)(scope));
          }
      };

  }])

  .directive('lktypeaheadPopup', function () {
      return {
          restrict: 'E',
          scope: {
              matches: '=',
              query: '=',
              active: '=',
              position: '=',
              select: '&'
          },
          replace: true,
          templateUrl: 'template/lktypeahead/typeahead.html',
          link: function (scope, element, attrs) {

              scope.isOpen = function () {
                  return scope.matches.length > 0;
              };

              scope.isActive = function (matchIdx) {
                  return scope.active == matchIdx;
              };

              scope.selectActive = function (matchIdx) {
                  scope.active = matchIdx;
              };

              scope.selectMatch = function (activeIdx) {
                  scope.select({ activeIdx: activeIdx });
              };
          }
      };
  })

  .filter('lktypeaheadHighlight', function () {

      function escapeRegexp(queryToEscape) {
          return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      }

      return function (matchItem, query) {
          return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : query;
      };
  });

angular.module("template/lktypeahead/match.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/typeahead/match.html",
      "<a tabindex=\"-1\" ng-bind-html-unsafe=\"match.label | lktypeaheadHighlight:query\"></a>");
}]);

angular.module("template/lktypeahead/typeahead.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/lktypeahead/typeahead.html",
      "<ul class=\"typeahead dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
      "    <li ng-repeat=\"match in matches\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\">\n" +
      "        <a tabindex=\"-1\" ng-click=\"selectMatch($index)\" ng-bind-html-unsafe=\"match.label | lktypeaheadHighlight:query\"></a>\n" +
      "    </li>\n" +
      "</ul>");
}]);