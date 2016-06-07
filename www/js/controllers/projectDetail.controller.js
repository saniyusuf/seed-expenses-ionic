/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['FullProjectDetails', 'CreateTimeAndExpenseModal', '$stateParams', 'ProjectService'];

    function ProjectDetailController(FullProjectDetails, CreateTimeAndExpenseModal, $stateParams, ProjectService) {
        var vm = this;

        vm.openCreateNewExpenseModal = function () {
            CreateTimeAndExpenseModal.open($stateParams.projectID, 'expense');
        };
        vm.openCreateNewTimeLogModal = function () {
            CreateTimeAndExpenseModal.open($stateParams.projectID, 'time');
        };

        vm.getAllExpenses = function () {
            ProjectService.getAllExpenses($stateParams.projectID);
        };
        vm.getAllTimeLogs = function () {
            ProjectService.getAllTimeLogs($stateParams.projectID);
        };

        vm.fullProjectDetails = {};
        vm.fullProjectDetails = FullProjectDetails;
    }

})();
