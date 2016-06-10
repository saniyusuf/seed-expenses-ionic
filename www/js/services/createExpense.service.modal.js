/**
 * Created by Sani Yusuf on 02/06/2016.
 */

(function () {
    'use strict';
    angular
        .module('starter.services')
        .factory('CreateTimeAndExpenseModal', CreateTimeAndExpenseModal);

    CreateTimeAndExpenseModal.$inject = ['$ionicModal', '$rootScope', 'ProjectService', '$ionicLoading', 'logger'];

    function CreateTimeAndExpenseModal($ionicModal, $rootScope, ProjectService, $ionicLoading, logger) {
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
                "mobilecaddy1__Project__c": $scope.newExpense.projectID,
                "mobilecaddy1__Expense_Image__c": $scope.newExpense.receiptImage,
                "mobilecaddy1__Expense_Amount__c" : parseFloat($scope.newExpense.amount)
            };

            if(expenseType === 'time'){
                newExpense.mobilecaddy1__Duration_Minutes__c = $scope.newExpense.duration;
            } else {
                newExpense.mobilecaddy1__Expense_Amount__c = $scope.newExpense.amount;
            }
            
            ProjectService.createNewExpenseOrTimeLog(newExpense)
                .then(function (newExpenseSuccessResponse) {
                    logger.log('Successfully Created New Expense -> ', newExpenseSuccessResponse);
                    $scope.close();
                    $ionicLoading.show({
                        template: 'Expense Successfully Created!',
                        duration: 1200
                    });

                }, function (newExpenseFailureResponse) {
                    logger.log('Failed To Create New Expense -> ', newExpenseFailureResponse);
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: 'Expense Entry Not Created. Please Try Again',
                        duration: 1200
                    });
                });
        }

    }

})();
