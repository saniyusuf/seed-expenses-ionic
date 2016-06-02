/**
 * Created by Sani Yusuf on 13/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['FullProjectDetails'];

    function ProjectDetailController(FullProjectDetails) {
        console.log(FullProjectDetails);

        var vm = this;
        vm.fullProjectDetails = {};

        vm.fullProjectDetails = FullProjectDetails;
    }

})();
