'use strict';

angular.module('application')

// google pie chart
    .directive('qnPiechart', [
        function() {
            return {
                require: '?ngModel',
                link: function(scope, element, attr, controller) {
                    var settings = {
                        is3D: true
                    };

                    var getOptions = function() {
                        return angular.extend({ }, settings, scope.$eval(attr.qnPiechart));
                    };

                    // creates instance of datatable and adds columns from settings
                    var getDataTable = function() {
                        var columns = scope.$eval(attr.qnColumns);
                        var data = new google.visualization.DataTable();
                        angular.forEach(columns, function(column) {
                            data.addColumn(column.type, column.name);
                        });
                        return data;
                    };

                    var init = function() {
                        var options = getOptions();
                        if (controller) {

                            var drawChart = function() {
                                var data = getDataTable();
                                // set model
                                data.addRows(controller.$viewValue);

                                // Instantiate and draw our chart, passing in some options.
                                var pie = new google.visualization.PieChart(element[0]);
                                pie.draw(data, options);
                                //http://www.netmagazine.com/tutorials/create-beautiful-data-visualisations-svg-google-charts-api
                                $(window).smartresize(function () {
                                    pie.draw(data, options);
                                });
                            };


                            controller.$render = function() {
                                drawChart();
                            };
                        }

                        if (controller) {
                            // Force a render to override
                            controller.$render();
                        }
                    };

                    // Watch for changes to the directives options
                    scope.$watch(getOptions, init, true);
                    scope.$watch(getDataTable, init, true);
                }
            };
        }
    ])

    .directive('hcPie', function () {
        return {
            restrict: 'C',
            replace: true,
            scope: {
                items: '='
            },
            controller: function ($scope, $element, $attrs) {
                //      console.log(2, $scope.$root.highchartTitle);//.highchartTitle);//.highchartTitle);

            },
            template: '<div id="container" style="margin: 0 auto">not working</div>',
            link: function (scope, element, attrs) {
//                console.log(3,scope);//,element,attrs);
//                console.log('3a',scope.$parent,scope.$parent.chartTitle);//.scope.$id,scope.$root,scope.$root.highchartTitle);//.items);// scope.this.highchartTitle);
//                console.log('3b',scope.$parent.chartTitle);
//                console.log('3c',scope.$root.highchartTitle);
//                console.log('3d',scope.$parent.highchartTitle2);
                //  var b = scope.$root.highchartTitle;
                //      var a = scope.$eval(attr);
                //      console.log('imurls',a,b);

                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        // text: 'Workers Comp '
                        text:scope.$root.highchartTitle
                        //scope.title
                    },
                    tooltip: {

                        pointFormat: '{series.name}: <b>{point.percentage}% - {point.y}/{point.total}  </b>',
                        percentageDecimals: 1
                    },
                    exporting: {
                        enabled: true
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                percentageDecimals:1,
                                formatter: function () {
                                    //return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                                    //return '<b>' + this.point.name + '</b>: '  +Math.round(this.percentage)+ ' %';
                                    return '<b>' + this.point.name + '</b>: '  +  this.percentage.toFixed(1)+ ' %';

                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'workers comp',
                        data: scope.items
                    }]
                });
//                scope.$watch("title", function (newValue) {
//                   // chart.title.text.setData(newValue, true);
//                    console.log('nv ',scope.$root.highchartTitle,newValue)
//                   //chart.title.text.setTitle({text: newValue});
//                    chart.setTitle({text: 'test '+scope.$root.highchartTitle});
//                }, true);
                scope.$watch("items", function (newValue) {
                    chart.series[0].setData(newValue, true);
                    chart.setTitle({text: scope.$root.highchartTitle});

                }, true);

            }
        }
    });