/**
 * Created by Sani Yusuf on 08/06/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('AllExpensesController', AllExpensesController);

    AllExpensesController.$inject = ['AllExpenses'];

    function AllExpensesController(AllExpenses) {
        var vm = this;

        vm.allExpenses = AllExpenses;
    }

})();
