"use strict";

function manageCtrl($scope, statsServices, advDetailsService) {
    
    init();
    function createBubble() {
  var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 / 4,
    //outerRadius: => use @default
    radiusMin: 600/8,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectDelta: use @default
      intersectDelta: 20,
    //intersectInc: use @default
    //circleColor: use @default
    data: {
      items: [
        {text: "Screen with most ads", count: $scope.recommendedScreen},
        {text: "Amount of templates", count: $scope.templatesLen},
        {text: "Average show time", count: $scope.avgShowTime},
        {text: "Amount of messages", count: $scope.msgAmount},
        {text: "D", count: "12"},
        {text: "Python", count: "170"},
        {text: "C/C++", count: "382"},
        {text: "Pascal", count: "10"},
        {text: "Something", count: "170"},
      ],
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: {
          text: "(See more detail)",
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          centralClick: function() {
            alert("Here is more details!!");
          }
        }
      },
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "28px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "14px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
}
    function init() {
        statsServices.getViewsHistory()
          .then(function (value) {
            var screensHistory = value.data[0].screens;
             screensHistory.sort(function (a,b) {
                return b.count- a.count;
            })
            $scope.recommendedScreen = screensHistory[0].id;
        }).then(statsServices.getGroupByTemplate)
          .then(function (value) {
            var data = value.data;
            $scope.templatesLen = data.length;
            var series = d3v4.stack()
                .keys(["count"])
                .offset(d3v4.stackOffsetDiverging)
                (data);

            var svg = d3v4.select("#groupByTemplate"),
                margin = {top: 20, right: 30, bottom: 30, left: 60},
                width = +svg.attr("width"),
                height = +svg.attr("height");

            var x = d3v4.scaleBand()
                .domain(data.map(function (d) {
                    return d._id;
                }))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            var y = d3v4.scaleLinear()
                .domain([d3v4.min(series, stackMin), d3v4.max(series, stackMax)])
                .rangeRound([height - margin.bottom, margin.top]);

            var z = d3v4.scaleOrdinal(d3v4.schemeCategory10);

            svg.append("g")
                .selectAll("g")
                .data(series)
                .enter().append("g")
                .attr("fill", function (d) {
                    return z(d.key);
                })
                .selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
                .attr("width", x.bandwidth)
                .attr("x", function (d) {
                    return x(d.data._id);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return y(d[0]) - y(d[1]);
                })

            svg.append("g")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(d3v4.axisBottom(x));

            svg.append("g")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(d3v4.axisLeft(y));

            function stackMin(serie) {
                return d3v4.min(serie, function (d) {
                    return d[0];
                });
            }

            function stackMax(serie) {
                return d3v4.max(serie, function (d) {
                    return d[1];
                });
            }
        }).then(statsServices.getAvgByShowtime)
          .then(function (value) {
            $scope.avgShowTime=value.data[0].avg;
            //var avg = value.data[0].avg
            //var gauge1 = loadLiquidFillGauge("fillgauge5", avg);
        }).then(advDetailsService.getAllAdvert)
          .then(function (value) {
            $scope.msgAmount = value.data.length;})
          .then(createBubble);

        initMap();

    }

    function initMap() {

        statsServices.getLocation().then(function (value) {
            var data = value.data[0]
            var locations = [];
            for (var i = 0; i < data.locations.length; i++) {
                var row = data.locations[i];

                var latitude = row.lat;
                var longitude = row.lng;
                locations[i] = new google.maps.LatLng(latitude, longitude);
            }

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 11,
                center: locations[0]
            });

            for (var i = 0; i < locations.length; i++) {
                var markerLatLng = locations[i];
                var marker = new google.maps.Marker({
                    position: markerLatLng,
                    label: {text: '' + (i + 1) + ''},
                    map: map
                });


            }
        })

    }

}


angular.module('manageAdv').controller('manageCtrl', ['$scope', 'statsServices','advDetailsService', manageCtrl]);
