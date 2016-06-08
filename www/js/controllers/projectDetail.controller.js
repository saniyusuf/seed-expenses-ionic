/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['FullProjectDetails', 'CreateTimeAndExpenseModal', '$stateParams'];

    function ProjectDetailController(FullProjectDetails, CreateTimeAndExpenseModal, $stateParams) {
        var vm = this;

        vm.openCreateNewExpenseModal = function () {
            CreateTimeAndExpenseModal.open($stateParams.projectID, 'expense');
        };
        vm.openCreateNewTimeLogModal = function () {
            CreateTimeAndExpenseModal.open($stateParams.projectID, 'time');
        };

        vm.fullProjectDetails = {};
        vm.fullProjectDetails = FullProjectDetails;
    }

})();
