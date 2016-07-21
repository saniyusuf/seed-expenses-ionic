/**
 * Created by Sani Yusuf on 08/06/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('AllExpensesController', AllExpensesController);

    AllExpensesController.$inject = ['$scope', 'AllExpenses', 'EditExpenseOrTimeLogModal', '_'];

    function AllExpensesController($scope, AllExpenses, EditExpenseOrTimeLogModal, _) {
        var vm = this;

        vm.allExpenses = AllExpenses;
        vm.openEditExpenseModal = openEditExpenseModal;

        function openEditExpenseModal(expense) {
            EditExpenseOrTimeLogModal.open(expense, 'expense');
        }

        var updateTimeLogHandler = $scope.$on('expense:updateSuccess', function (e, data) {
            var updatedExpenseIndex;
            for(var i = 0; i < vm.allExpenses.length; i++){
                if(vm.allExpenses[i].Id == data.Id){
                    updatedExpenseIndex = i;
                    break;
                }
            }

            vm.allExpenses[updatedExpenseIndex].mobilecaddy1__Short_Description__c = data.mobilecaddy1__Short_Description__c;
            vm.allExpenses[updatedExpenseIndex].mobilecaddy1__Expense_Amount__c = data.mobilecaddy1__Expense_Amount__c;
            vm.allExpenses[updatedExpenseIndex].mobilecaddy1__Expense_Amount__c = data.mobilecaddy1__Expense_Amount__c;
        });

        $scope.$on('destroy', updateTimeLogHandler);
    }

})();
