/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['$stateParams', 'logger', 'ProjectService'];

    function ProjectDetailController($stateParams, logger, ProjectService) {
        var vm = this;

        var projectID = $stateParams.projectID;

        console.log('Project ID -> ', projectID);
        ProjectService.getProjectDetail(projectID)
            .then(function (projectDetail) {
                logger.log('Project Detail Successfully Gotten-> ', projectDetail);
                vm.projectDetail = projectDetail[0];

            }, function (projectDetailFailureResponse) {
                logger.log('Failed To Get Project Detail -> ', projectDetailFailureResponse);
            });
    }

})();
