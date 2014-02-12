'use strict';

angular.module('application')
.directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var prevDisp = element.css('display');
            $rootScope.$watch('user.role', function(role) {
                if(!Auth.authorize(attrs.accessLevel))
                    element.css('display', 'none');
                else
                    element.css('display', prevDisp);
            });
        }
    };
}]);

angular.module('application').directive('activeNav', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}])
    .directive('ngBlur', function () {
        console.log('in blr')
        return function (scope, elem, attrs) {
            elem.bind('blur', function () {
                scope.$apply(attrs.ngBlur);
            });
        };
    })
//// disable backspace if not in control
//    .directive('keyCapture', [function() {
//        console.log('in keyCapture')
//        return {
//            link: function (scope, element, attrs, controller) {
//
//                element.on('keydown', function(e){
//                    scope.keyCode = e.keyCode;
//                    scope.keyCode ==8? console.log("Yes, in backspace"): console.log("No,not backspace");
//
//                    if (scope.keyCode==8){
//                        scope.preventDefault();
//                    } else {
//                        console.log('in key')
//                        scope.$apply();
//                    }
//                });
//
//            }
//        }
//    }])


//.directive('ngOnkeyup', function() {
//    return {
//        restrict: 'A',
//        scope: {
//            func: '&ngOnkeyup'
//        },
//        link: function( scope, elem, attrs ) {
//            elem.bind('keyup', scope.func);
//        }
//    };
//})
//




    .directive('layout', function() {
        console.log('in 1 la');
        return {

            link: function(scope, elm, attrs) {
                var layout = elm.layout({ applyDefaultStyles: true });

                scope.layout  = layout;
                console.log('in la');
                scope.$watch(attrs.state, function(state) {
                    if (state == true) {
                        scope.layout.sizePane('east', 120);
                        scope.layout.show('west');
                        scope.layout.show('south');
                    } else {
                        scope.layout.sizePane('east', 60);
                        scope.layout.hide('west');
                        scope.layout.hide('south');
                    }
                });
            }
        };
    })

    .directive('mwValidate', function($log) {
        var noop = function() {};

        var nullFormCtrl = {
            isNull: true,
            $addControl: noop,
            $removeControl: noop,
            $setValidity: noop,
            $setDirty: noop
        };

        $log.info('Initializing mw-validate');

        return {
            restrict: 'A',
            require: '^form', // Looks on parent also

            // The linking function will add behavior to the template
            // The fourth parameter is a NgModelController (http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController)
            link: function(scope, element, attrs, parentFormCtrl) {
                var modelCtrl = { $name: attrs.name || attrs.mwName },
                    nameExp = attrs.mwNameExp,
                    validateExpr = attrs.mwValidate;

                var $error = this.$error = {}; // keep invalid keys here

                parentFormCtrl = parentFormCtrl || nullFormCtrl ;

                $log.info('Creating controller for: ' + modelCtrl.$name );

                validateExpr = scope.$eval(validateExpr);

                if ( ! validateExpr) {
                    return;
                }

                if (angular.isFunction(validateExpr)) {
                    validateExpr = { validator: validateExpr };
                }

                // TODO Is necessary?
                parentFormCtrl.$addControl(modelCtrl);

                element.bind('$destroy', function() {
                    parentFormCtrl.$removeControl(modelCtrl);
                });

                if ( nameExp ) {
                    scope.$watch( nameExp, function( newValue ) {
                        modelCtrl.$name = newValue;
                    });
                }

                scope.xxxform = parentFormCtrl;
                // Register watches
                angular.forEach(validateExpr, function(validExp, validationErrorKey) {
                    // Check for change in "boolean" value (true or false)
                    scope.$watch( '(' + validExp + ') && true', function(newIsValid, oldIsValid) {
                        $log.info('validating ' + validExp + ' as ' + validationErrorKey + ' with value ' +  newIsValid + '? ' + $error[validationErrorKey]);
                        if ( ($error[validationErrorKey] || false) === newIsValid) {
                            $error[validationErrorKey] = ! newIsValid;

                            parentFormCtrl.$setValidity(validationErrorKey, newIsValid, modelCtrl);
                        }
                    });
                });

            }
        };
    })
// this fixes date prob with chrome Version 24.0.1312.56 m
    .directive('input', function () {
        return {
            require: '?ngModel',
            restrict: 'E',
            link: function (scope, element, attrs, ngModel) {
                if ( attrs.type="date" && ngModel ) {
                    element.bind('change', function () {
                        scope.$apply(function() {
                            ngModel.$setViewValue(element.val());
                        });
                    });
                }
            }
        };
    })
    .directive('jlMarkdown', function ($http) {
        return {
            restrict:'E',
            require: 'ngModel',
            scope: {
                jlValue: '=ngModel',
                template: '='
            },
            template:
                '<textarea ng-show="isEditMode" ng-dblclick="switchToPreview()" rows="10" cols="10" ng-model="jlValue">'+
                    '</textarea>' +
                    '<div ng-hide="isEditMode" ng-dblclick="switchToEdit()" ng-bind-html-unsafe="jlValue | markdown">'+
                    '</div>',
            link: function(scope, elm, attrs) {
                $http.get(scope.template).success(function(data) {
                    scope.jlValue = data;
                });

                scope.isEditMode = false; //ture

                scope.switchToPreview = function () {
                    scope.isEditMode = false;
                };
                scope.switchToEdit = function () {
                    scope.isEditMode = false;//true;
                };
            }
        };
    }).filter('markdown',function() {
        var converter = new Showdown.converter();
        return function(value) {
            return converter.makeHtml(value || '');
        };
    })
    .value('ui.config' , {

        jq: {
            // The Tooltip namespace
            tooltip: {
                // Tooltip options. This object will be used as the defaults
                placement: 'right'
            },
            select2: {
                allowClear: true
            }
        }
    })

    .directive('fileButton', function() {
        return {
            link: function(scope, element, attributes) {

                var el = angular.element(element)
                var button = el.children()[0]

                el.css({
                    position: 'relative',
                    overflow: 'hidden',
                    width: button.offsetWidth,
                    height: button.offsetHeight
                })

                var fileInput = angular.element('<input id="uploadInput" type="file" multiple />')
                fileInput.css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    'z-index': '2',
                    width: '100%',
                    height: '100%',
                    opacity: '0',
                    cursor: 'pointer'
                })

                el.append(fileInput)
                //  scope.files=   fileInput;


            }
        }
    }).run()
    .directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }])
    .directive('myDirective', function() {
        return {
            templateUrl: 'partials/my-directive.html',
            replace: true,
            restrict: 'E',
            scope: {
                filename: '=ngModel'
            },

            link: function(scope, elm, attrs) {

                $(elm).fileupload({
                    dataType: 'json',
                    paramName: 'files[]',

                    progressall: function(e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        scope.$apply(function() {
                            scope.progress = progress;
                        });

                    },

                    done: function(e, data) {

                        $.each(data.result, function(index, file) {
                            scope.$apply(function() {
                                scope.filename = file.name;
                            });
                        })

                    }
                });
            }

        }
    })


    .directive('btnSwitch', function(){

        return {
            restrict : 'A',
            require :  'ngModel',
            templateUrl : 'switcher.html',
            replace : true,
            link : function(scope, element, attrs, ngModel){

                // Specify how UI should be updated
                ngModel.$render = function() {
                    render();
                };

                var render=function(){
                    var val = ngModel.$viewValue;

                    var open=angular.element(element.children()[0]);
                    open.removeClass(val ? 'hide' : 'show');
                    open.addClass(val ? 'show' : 'hide');

                    var closed=angular.element(element.children()[1]);
                    closed.removeClass(val ? 'show' : 'hide');
                    closed.addClass(val ? 'hide' : 'show');
                };

                // Listen for the button click event to enable binding
                element.bind('click', function() {
                    scope.$apply(toggle);
                });

                // Toggle the model value
                function toggle() {
                    var val = ngModel.$viewValue;
                    ngModel.$setViewValue(!val);
                    render();
                }

                if(!ngModel){
                    //TODO: Indicate that something is missing!
                    return;
                }  // do nothing if no ng-model

                // Initial render
                render();
            }
        };
    })


    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('redWhen', function() {
        return function(scope,elm,attrs) {
            //  console.log('scope,elm,attrs',scope,elm,attrs)
            scope.$watch(attrs.redWhen, function(newVal, oldVal) {
                //if (newVal) {
                if (newVal && elm[0].value=='') {
                    elm.css('background-color', 'yellowgreen');
                } else {
                    elm.css('background-color', 'white');
                }
            });
        };
    })
    .directive('ConfirmDirective', function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs, ctrls) {
                angular.element(elm).bind('click', function (event) {
                    alert("Sure?");
                    event.preventDefault();
                    return false; //or true, depends on you
                });
            }
        }});


/////////////////angular.module('application').directive('keyCapture', ['$location', '$routeParams','$window', function(location,$routeParams, window) {
// this will apply to entire application
//    angular.module('application').directive('keyCapture', ['$window', function( window) {
//
//    // console.log('in keyCapture')
//    return {
//        link: function (scope, element, attrs, controller) {
//           // console.log('scope, element, attrs, controller',scope, element, attrs, controller)
//
//            element.on('keydown', function(e){
//                scope.keyCode = e.keyCode;
//                scope.keyCode ==8? console.log("Yes, in backspace"): console.log("No,not backspace");
//                console.log('==========================================');
//                console.log('scope,',scope);
//                console.log(' element,',element);
//                console.log(' attrs', attrs);
//                console.log(' controller' ,controller);
//                console.log('==========================================');
//                if (scope.keyCode==8){
////                    console.log('a scope, ',scope)
////                    console.log('b element', element)
////                    console.log('c attrs', attrs)
////                    console.log('d controller', controller)
//                    if (!window.confirm('Are you sure you want to leave this view?' )){
//
//                        e.preventDefault();
//                    }
//                } else {
//                    console.log('in key')
//                    scope.$apply();
//                }
//            });
//
//        }
//    }
//}]);
