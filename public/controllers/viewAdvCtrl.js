
"use strict";
function viewAdvCtrl($scope,$rootScope,$location,advDetailsService ) {
var adv = new Array();
$scope.count = 1
    advDetailsService.getAllAdvert().then(function (value) {
            $scope.msgs = value.data;
            $scope.msgEdit = {};

        });

    $scope.delete = function (_id) {
        swal({
            title: 'Do you want to delete the message?',
            text: "Once you delete you can't go back",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#531212',
            cancelButtonColor: '#531212',
            confirmButtonText: 'Yes'
        }).then(function (result) {
            if(result.value)
            {
                swal(
                    'Deleted!',
                    'Message was removed',
                    'success'
                );
                advDetailsService.deleteAdvert(_id).then(function () {
                    $location.path('');
                    $scope.$apply();

                });
            }

        });
    };

}
angular.module('manageAdv').controller('viewAdvCtrl',[ '$scope','$rootScope','$location','advDetailsService',viewAdvCtrl]);



