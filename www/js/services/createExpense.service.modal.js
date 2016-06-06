/**
 * Created by Sani Yusuf on 02/06/2016.
 */

(function () {
    'use strict';
    angular
        .module('starter.services')
        .factory('CreateTimeAndExpenseModal', CreateTimeAndExpenseModal);

    CreateTimeAndExpenseModal.$inject = ['$ionicModal', '$rootScope', 'ProjectService', '$ionicLoading'];

    function CreateTimeAndExpenseModal($ionicModal, $rootScope, ProjectService, $ionicLoading) {
        var $scope = $rootScope.$new(),
            createExpenseModalInstanceOptions = {
                scope: $scope,
                focusFirstInput: true
            },
            createExpenseModalTemplateUrl = RESOURCE_ROOT + 'templates/createExpense.html',
            createTimeLogModalTemplateUrl = RESOURCE_ROOT + 'templates/createTimeLog.html';
        $scope.newExpense = {
            description: '',
            amount: '',
            receiptImage: ''
        };
        $scope.createNewExpense = createNewExpense;

        var createExpenseModal = {
            open: open
        };

        return createExpenseModal;

        function open(templateType) {
            var templateUrl = '';
            if(templateType === 'time'){
                $scope.newExpense = {
                    description: '',
                    duration: ''
                };
                templateUrl = createTimeLogModalTemplateUrl;

            } else {
                $scope.newExpense = {
                    description: '',
                    amount: '',
                    receiptImage: ''
                };
                templateUrl = createExpenseModalTemplateUrl;
            }

            return $ionicModal.fromTemplateUrl(
                templateUrl,
                createExpenseModalInstanceOptions

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

        function createNewExpense() {
            $ionicLoading.show({
                template: 'Submitting You New Expense ..'
            });

            ProjectService.createNewExpense($scope.newExpense)
                .then(function (newExpenseSuccessResponse) {
                    logger.log('Successfully Created New Expense -> ', newExpenseSuccessResponse);
                    $ionicLoading.hide();
                    $scope.close();

                }, function (newExpenseFailureResponse) {
                    logger.log('Successfully Created New Expense -> ', newExpenseFailureResponse);
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: 'Expense Entry Not Created. Please Try Again',
                        duration: 800
                    });
                });
        }

    }

})();
