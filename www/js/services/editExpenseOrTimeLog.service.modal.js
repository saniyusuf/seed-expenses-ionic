/**
 * Created by Sani Yusuf on 10/06/2016.
 */


(function () {
    'use strict';
    angular
        .module('starter.services')
        .factory('EditExpenseOrTimeLogModal', EditExpenseOrTimeLogModal);

    EditExpenseOrTimeLogModal.$inject = ['$ionicModal', '$rootScope', 'ProjectService', '$ionicLoading'];

    function EditExpenseOrTimeLogModal($ionicModal, $rootScope, ProjectService, $ionicLoading) {
        var $scope = $rootScope.$new(),
            editExpenseOrTimeLogModalInstanceOptions = {
                scope: $scope,
                focusFirstInput: true
            },
            editExpenseModalTemplateUrl = RESOURCE_ROOT + 'templates/editTimeLogModal.html',
            editTimeLogModalTemplateUrl = RESOURCE_ROOT + 'templates/editExpenseModal.html';

        var editExpenseOrTimeLogModal = {
            open: open
        };

        return editExpenseOrTimeLogModal;

        function open(expenseOrTimeLog, expenseType) {
            var templateUrl = '';
            $scope.updateExpenseOrTimeLog = updateExpenseOrTimeLog;

            if(expenseType === 'time'){
                $scope.expenseOrTimeLog = {
                    Id: expenseOrTimeLog.Id,
                    mobilecaddy1__Short_Description__c: expenseOrTimeLog.mobilecaddy1__Short_Description__c,
                    mobilecaddy1__Duration_Minutes__c: expenseOrTimeLog.mobilecaddy1__Duration_Minutes__c
                };
                templateUrl = editTimeLogModalTemplateUrl;

            } else {
                $scope.expenseOrTimeLog = {
                    Id: expenseOrTimeLog.Id,
                    mobilecaddy1__Short_Description__c: expenseOrTimeLog.mobilecaddy1__Short_Description__c,
                    mobilecaddy1__Expense_Amount__c: expenseOrTimeLog.mobilecaddy1__Expense_Amount__c,
                    mobilecaddy1__Expense_Image__c: expenseOrTimeLog.mobilecaddy1__Expense_Image__c
                };
                templateUrl = editExpenseModalTemplateUrl;
            }

            $ionicModal.fromTemplateUrl(
                templateUrl,
                editExpenseOrTimeLogModalInstanceOptions

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

        function updateExpenseOrTimeLog() {
            ProjectService.updateExpenseOrTimeLog($scope.expenseOrTimeLog)
        }
    }

})();
