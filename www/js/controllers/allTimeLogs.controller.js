/**
 * Created by Sani on 08/06/2016.
 */


(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('AllTimeLogsController', AllTimeLogsController);

    AllTimeLogsController.$inject = ['$scope', 'AllTimeLogs', 'EditExpenseOrTimeLogModal'];

    function AllTimeLogsController($scope, AllTimeLogs, EditExpenseOrTimeLogModal) {
        var vm = this;

        vm.allTimeLogs = AllTimeLogs;
        vm.openEditTimeLogModal = openEditTimeLogModal;

        function openEditTimeLogModal(timeLog) {
            EditExpenseOrTimeLogModal.open(timeLog, 'time');
        }

        var updateExpenseHandler = $scope.$on('timeLog:updateSuccess', function (e, data) {
            var updatedTimeLogIndex;
            for(var i = 0; i < vm.allTimeLogs.length; i++){
                if(vm.allTimeLogs[i].Id == data.Id){
                    updatedTimeLogIndex = i;
                    break;
                }
            }

            vm.allTimeLogs[updatedTimeLogIndex].mobilecaddy1__Short_Description__c = data.mobilecaddy1__Short_Description__c;
            vm.allTimeLogs[updatedTimeLogIndex].mobilecaddy1__Duration_Minutes__c = data.mobilecaddy1__Duration_Minutes__c;
        });

        $scope.$on('destroy', updateExpenseHandler);
    }

})();
