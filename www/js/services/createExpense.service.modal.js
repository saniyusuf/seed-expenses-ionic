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
            projectID = '',
            createExpenseModalInstanceOptions = {
                scope: $scope,
                focusFirstInput: true
            },
            createExpenseModalTemplateUrl = RESOURCE_ROOT + 'templates/createExpense.html',
            createTimeLogModalTemplateUrl = RESOURCE_ROOT + 'templates/createTimeLog.html';
        $scope.newExpense = {
            description: '',
            amount: '',
            receiptImage: '',
            expenseType: ''
        };
        $scope.createNewExpense = createNewExpense;
        $scope.createNewTimeLog = createNewTimeLog;

        var createExpenseModal = {
            open: open
        };

        return createExpenseModal;

        function open(projectID, expenseType) {
            var templateUrl = '';
            if(expenseType === 'time'){
                $scope.newExpense = {
                    description: '',
                    duration: '',
                    projectID: projectID
                };
                templateUrl = createTimeLogModalTemplateUrl;

            } else {
                $scope.newExpense = {
                    description: '',
                    amount: '',
                    receiptImage: '',
                    projectID: projectID,
                    expenseType: ''
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

        function createNewTimeLog() {
            createNewTimeLogOrExpense('time');
        }

        function createNewExpense() {
            createNewTimeLogOrExpense('expense');
        }

        function createNewTimeLogOrExpense(expenseType) {
            $ionicLoading.show({
                template: 'Submitting You New Expense ..'
            });

            var newExpense = {
                "mobilecaddy1__Short_Description__c": $scope.newExpense.description,
                "Name": 'TMP-' + Date.now(),
                "mobilecaddy1__Project__c": $scope.projectID
            };

            if(expenseType === 'time'){
                newExpense.mobilecaddy1__Duration_Minutes__c = $scope.newExpense.duration.$modelValue;
            } else {
                newExpense.mobilecaddy1__Expense_Amount__c = $scope.newExpense.amount.$modelValue;
                newExpense.mobilecaddy1__Expense_Type__c = $scope.newExpense.expenseType;
            }

            ProjectService.createNewTimeLogOrExpense(newExpense)
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
