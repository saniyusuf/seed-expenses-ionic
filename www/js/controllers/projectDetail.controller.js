/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['$scope', 'FullProjectDetails', 'CreateTimeAndExpenseModal', '$stateParams', 'EditProjectDetailsModal'];

    function ProjectDetailController($scope, FullProjectDetails, CreateTimeAndExpenseModal, $stateParams, EditProjectDetailsModal) {
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

        $scope.$on('updateProject:success', function (e, data) {
            vm.fullProjectDetails.projectDetails.Name = data.Name;
            vm.fullProjectDetails.projectDetails.mobilecaddy1__Description__c = data.mobilecaddy1__Description__c;
        });
    }

})();
