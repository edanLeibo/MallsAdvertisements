"use strict";

function twitterCtrl($scope) {
    $scope.tweetMsg = function () {
        var url = "https://twitter.com/intent/tweet"
        var text = document.getElementById("tweet-msg").value;
        window.open(url + "?text=" + text);
    }

}


angular.module('manageAdv').controller('twitterCtrl', ['$scope', twitterCtrl]);
