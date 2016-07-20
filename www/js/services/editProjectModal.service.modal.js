/**
 * Created by Sani Yusuf on 09/06/2016.
 */


(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('EditProjectDetailsModal', EditProjectDetailsModal);

    EditProjectDetailsModal.$inject = ['$ionicModal', '$rootScope', 'ProjectService', '$ionicLoading'];

    function EditProjectDetailsModal($ionicModal, $rootScope, ProjectService, $ionicLoading) {
        var $scope = $rootScope.$new(),
            editProjectDetailsModalInstanceOptions = {
                scope: $scope,
                focusFirstInput: true
            },
            editProjectDetailsModalTemplateUrl = RESOURCE_ROOT + 'templates/editProjectDetail.html';

        var editProjectDetailsModal = {
            open: open
        };

        return editProjectDetailsModal;

        function open(projectDetails) {
            $scope.projectDetails = projectDetails;
            $scope.updateProjectDetails = updateProjectDetails;

            $ionicModal.fromTemplateUrl(
                editProjectDetailsModalTemplateUrl,
                editProjectDetailsModalInstanceOptions

            ).then(function (modalInstance) {
                $scope.close = function () {
                    closeAndRemove(modalInstance);
                };
                return modalInstance.show();
            });
        }

        function closeAndRemove(modalInstance) {
            return modalInstance.hide()
                .then(function () {
                    return modalInstance.remove();
                });
        }

        function updateProjectDetails() {
            $ionicLoading.show({
                template: 'Saving Your Latest Changes ..'
            });
            var projectDetails = {
                Id: $scope.projectDetails.Id,
                mobilecaddy1__Description__c: $scope.projectDetails.mobilecaddy1__Description__c,
                Name: $scope.projectDetails.Name
            };

            ProjectService.updateProjectDetails(projectDetails)
                .then(function () {
                    $scope.close();
                    $rootScope.$broadcast('updateProject:success',{
                        mobilecaddy1__Description__c: projectDetails.mobilecaddy1__Description__c,
                        Name: projectDetails.Name
                    });
                    $ionicLoading.show({
                        template: 'Changes Saved!',
                        duration: 1200,
                        noBackdrop: true
                    });

                }, function () {
                    $ionicLoading.show({
                        template: "Couldn't Save Your Changes. Please Try Again Later",
                        duration: 1200,
                        noBackdrop: true
                    });
                });
        }

    }


})();
