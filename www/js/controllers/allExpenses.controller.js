/**
 * Created by Sani Yusuf on 08/06/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('AllExpensesController', AllExpensesController);

    AllExpensesController.$inject = ['AllExpenses', 'EditExpenseOrTimeLogModal'];

    function AllExpensesController(AllExpenses, EditExpenseOrTimeLogModal) {
        var vm = this;

        vm.allExpenses = AllExpenses;
        vm.openEditExpenseModal = openEditExpenseModal;

        function openEditExpenseModal(expense) {
            EditExpenseOrTimeLogModal.open(expense, 'expense');
        }
    }

})();
