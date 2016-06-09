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
                scope: $scope
            },
        editProjectDetailsModalTemplateUrl = RESOURCE_ROOT + 'templates/editProjectDetail.html';

        var editProjectDetailsModal = {
            open: open,
            updateProjectDetails: updateProjectDetails
        };

        return editProjectDetailsModal;

        function open(projectDetails) {
            $scope.projectDetails = projectDetails;
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
            ProjectService.updateProjectDetails($scope.projectDetails)
                .then(function () {
                    $scope.close();
                    $ionicLoading.show({
                        template: 'Your Changes Have Been Saved!',
                        duration: 1200
                    });

                }, function () {
                    $ionicLoading.show({
                        template: "Couldn't Save Your Changes. Please Try Again Later",
                        duration: 1200
                    });
                });
        }

    }


})();
