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
        vm.openCreateNewExpenseModal = function (expenseType) {
            CreateTimeAndExpenseModal.open($stateParams.projectID, expenseType);
        };
        vm.fullProjectDetails = {};

        vm.fullProjectDetails = FullProjectDetails;
    }

})();
