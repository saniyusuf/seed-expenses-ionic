/**
 * Created by Sani Yusuf on 09/07/2016.
 */

describe('All Time Logs Controller', function () {
    var allTimeLogStub,
        editExpenseOrTimeLogModalStub = {
            open: function (time, type) {}
        },
        controllerDependencies;

    beforeEach(module('starter.controllers'));
    beforeEach(inject(function ($rootScope) {
        allTimeLogStub = [{
            id: '1',
            duration: 1234
        }];
        controllerDependencies = {
            AllTimeLogs: allTimeLogStub,
            EditExpenseOrTimeLogModal: editExpenseOrTimeLogModalStub,
            $scope: $rootScope.$new()
        };
    }));

    it('Should Be Defined', inject(function ($controller) {
        var allTimeLogsController = $controller('AllTimeLogsController', controllerDependencies);
        expect(allTimeLogsController).toBeDefined();
    }));

    it('Should Have An allExpenses Equal To AllTimeLogs Stub', inject(function ($controller) {
        var allTimeLogsController = $controller('AllTimeLogsController', controllerDependencies);
        expect(allTimeLogsController.allTimeLogs).toEqual(allTimeLogStub);
    }));

    it('Should Edit Expense With Passed Expense', inject(function ($controller) {
        var timeStub = {
            id: '1',
            duration: 1234
        };

        var allTimeLogsController = $controller('AllTimeLogsController', controllerDependencies);
        spyOn(editExpenseOrTimeLogModalStub, 'open');
        allTimeLogsController.openEditTimeLogModal(timeStub);

        expect(editExpenseOrTimeLogModalStub.open).toHaveBeenCalledWith(timeStub, 'time');
    }));

});

