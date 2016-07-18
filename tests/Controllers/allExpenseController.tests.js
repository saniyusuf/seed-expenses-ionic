/**
 * Created by Sani Yusuf on 07/07/2016.
 */


describe('All Expenses Controller Test', function () {
    var allExpenseStub,
        editExpenseOrTimeLogModalStub = {
            open: function (expense, type) {}
        },
        controllerDependencies;
    
    beforeEach(module('starter.controllers'));
    beforeEach(function () {
        allExpenseStub = [{
            id: '1',
            description: 'dummy test mock data'
        }];
        controllerDependencies = {
            AllExpenses: allExpenseStub,
            EditExpenseOrTimeLogModal: editExpenseOrTimeLogModalStub
        };
    });

    it('Should Be Defined', inject(function ($controller) {
        var allExpenseController = $controller('AllExpensesController', controllerDependencies);
        expect(allExpenseController).toBeDefined();
    }));

    it('Should Have An allExpenses Equal To AllExpenses Stub', inject(function ($controller) {
        var allExpenseController = $controller('AllExpensesController', controllerDependencies);
        expect(allExpenseController.allExpenses).toEqual(allExpenseStub);
    }));

    it('Should Edit Expense With Passed Expense', inject(function ($controller) {
        var expenseStub = {
            id: '1',
            description: 'dummy test mock data'
        };

        var allExpenseController = $controller('AllExpensesController', controllerDependencies);
        spyOn(editExpenseOrTimeLogModalStub, 'open');
        allExpenseController.openEditExpenseModal(expenseStub);

        expect(editExpenseOrTimeLogModalStub.open).toHaveBeenCalledWith(expenseStub, 'expense');
    }));

});
