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
    }

})();
