/**
 * Created by Sani Yusuf on 07/07/2016.
 */


describe('All Expenses Controller Test', function () {
    beforeEach(module('starter.controllers'));
    beforeEach(function () {
        var allExpenseStub = [{
            id: '1',
            description: 'dummy test mock data'
        }];

        it('Should Be Defined', inject(function ($controller) {
            var allExpenseController = $controller('AllExpensesController', {
                AllExpenses: allExpenseStub
            });

            expect(allExpenseController).toBeDefined();

        }));

        it('Should Have An allExpenses Equal To AllExpenses Stub', inject(function ($controller) {
            var allExpenseController = $controller('AllExpensesController', {
                AllExpenses: allExpenseStub
            });

            expect(allExpenseController.allExpenses).toEqual(allExpenseStub);

        }));

    });


});
