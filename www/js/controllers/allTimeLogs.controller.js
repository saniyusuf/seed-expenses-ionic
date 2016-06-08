/**
 * Created by Sani on 08/06/2016.
 */


(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('AllTimeLogsController', AllTimeLogsController);

    AllTimeLogsController.$inject = ['AllTimeLogs'];

    function AllTimeLogsController(AllTimeLogs) {
        var vm = this;

        vm.allTimeLogs = AllTimeLogs;
    }

})();
