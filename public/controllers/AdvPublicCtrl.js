"use strict";
function publicCtrl($scope,$routeParams,publicServices){

    init();

    function init() {
        publicServices.getNews().then(function (value) {
            $scope.news = value.data;
        });
    }




}
angular.module('showAdv').controller('publicCtrl',['$scope','$routeParams','publicServices',publicCtrl]);
