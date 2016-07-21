/**
 * Created by Sani on 08/06/2016.
 */


(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('AllTimeLogsController', AllTimeLogsController);

    AllTimeLogsController.$inject = ['AllTimeLogs', 'EditExpenseOrTimeLogModal'];

    function AllTimeLogsController(AllTimeLogs, EditExpenseOrTimeLogModal) {
        var vm = this;

        vm.allTimeLogs = AllTimeLogs;
        vm.openEditTimeLogModal = openEditTimeLogModal;

        function openEditTimeLogModal(timeLog) {
            EditExpenseOrTimeLogModal.open(timeLog, 'time');
        }

        var updateExpenseHandler = $scope.$on('timeLog:updateSuccess', function (e, data) {
            var updatedTimeLogIndex = _.findIndex(vm.allExpenses, function (expense) {
                return expense.Id == data.Id;
            });

            vm.allTimeLogs[updatedTimeLogIndex].mobilecaddy1__Short_Description__c = data.mobilecaddy1__Short_Description__c;
            vm.allTimeLogs[updatedTimeLogIndex].mobilecaddy1__Duration_Minutes__c = data.mobilecaddy1__Duration_Minutes__c;
        });

        $scope.$on('destroy', updateExpenseHandler);
    }

})();
