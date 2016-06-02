/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['FullProjectDetails', 'CreateExpenseModal'];

    function ProjectDetailController(FullProjectDetails, CreateExpenseModal) {
        console.log(FullProjectDetails);

        var vm = this;
        vm.openCreateNewExpenseModal = CreateExpenseModal.open;
        vm.fullProjectDetails = {};

        vm.fullProjectDetails = FullProjectDetails;
    }

})();
