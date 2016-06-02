/**
 * Created by Sani Yusuf on 02/06/2016.
 */

(function () {
    'use strict';
    angular
        .module('starter.services')
        .factory('CreateExpenseModal', CreateExpenseModal);

    CreateExpenseModal.$inject = ['$ionicModal', '$rootScope'];

    function CreateExpenseModal($ionicModal, $rootScope) {
        var $scope = $rootScope.$new(),
            createExpenseModalInstanceOptions = {
                scope: $scope,
                focusFirstInput: true
            },
            createExpenseModalTemplateUrl = RESOURCE_ROOT + 'templates/createExpense.html';

        var createExpenseModal = {
            open: open
        };

        return createExpenseModal;

        function open() {
            $scope.newExpense = {
                description: '',
                amount: ''
            };

            return $ionicModal.fromTemplateUrl(
                createExpenseModalTemplateUrl,
                createExpenseModalInstanceOptions

            ).then(function (modalInstance) {

                $scope.close = function () {
                   closeAndRemove(modalInstance)
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

        function saveExpense() {

        }

    }

})();
