/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['FullProjectDetails', 'CreateTimeAndExpenseModal'];

    function ProjectDetailController(FullProjectDetails, CreateTimeAndExpenseModal) {

        var vm = this;
        vm.openCreateNewExpenseModal = CreateTimeAndExpenseModal.open;
        vm.fullProjectDetails = {};

        vm.fullProjectDetails = FullProjectDetails;
    }

})();
