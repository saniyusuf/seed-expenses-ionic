/**
 * Created by Sani Yusuf on 02/06/2016.
 */

(function () {
    'use strict';
    angular
        .module('starter.controllers')
        .factory('CreateExpenseModal', CreateExpenseModal);

    CreateExpenseModal.$inject = ['$ionicModal', '$rootScope'];

    function CreateExpenseModal($ionicModal, $rootScope) {
        var $scope = $rootScope.$new(),
            createExpenseModalInstance = {},
            createExpenseModalInstanceOptions = {
                scope: $scope,
                focusFirstInput: true
            },
            createExpenseModalTemplateUrl = RESOURCE_ROOT + 'templates/modals/createExpense.html';

        var createExpenseModal = {
            open: open,
            close: close
        };

        return createExpenseModal;

        function open() {
            $scope = {
                expenseDescription: '',
                expenseAmount: '',
                saveExpense: saveExpense
            };

            return $ionicModal.fromTemplateUrl(
                createExpenseModalTemplateUrl,
                createExpenseModalInstanceOptions

            ).then(function (modalInstance) {
                    createExpenseModal.close = close(modalInstance);
                    return modalInstance.show();
                });
        }

        function close(modalInstance) {
            return modalInstance.hide()
                .then(function (modalToBeRemoved) {
                    return modalToBeRemoved.remove();
                });
        }

        function saveExpense() {

        }

    }

})();
