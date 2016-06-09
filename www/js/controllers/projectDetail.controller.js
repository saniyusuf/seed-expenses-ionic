/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['FullProjectDetails', 'CreateTimeAndExpenseModal', '$stateParams', 'EditProjectDetailsModal'];

    function ProjectDetailController(FullProjectDetails, CreateTimeAndExpenseModal, $stateParams, EditProjectDetailsModal) {
        var vm = this;

        vm.openCreateNewExpenseModal = function () {
            CreateTimeAndExpenseModal.open($stateParams.projectID, 'expense');
        };
        vm.openCreateNewTimeLogModal = function () {
            CreateTimeAndExpenseModal.open($stateParams.projectID, 'time');
        };

        vm.openEditProjectModal = function () {
            EditProjectDetailsModal.open(angular.copy(vm.fullProjectDetails.projectDetails));
        };

        vm.fullProjectDetails = {};
        vm.fullProjectDetails = FullProjectDetails;
    }

})();
