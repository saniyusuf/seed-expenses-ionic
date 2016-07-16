/**
 * Created by Sani Yusuf on 09/07/2016.
 */


describe('All Time Logs Controller Test', function () {
    beforeEach(module('starter.controllers'));
    beforeEach(function () {
        var allTimeLogsStub = [{
                id: '1',
                description: 'dummy test mock data'
            }];

        it('Should Be Defined', inject(function ($controller) {
            var allExpenseController = $controller('AllTimeLogsController', {
                AllTimeLogs: allTimeLogsStub
            });

            expect(allExpenseController).toBeDefined();

        }));

        it('Should Have An allTimeLogs Property Equal To AllTimeLogs Stub', inject(function ($controller) {
            var allExpenseController = $controller('AllTimeLogsController', {
                AllTimeLogs: allTimeLogsStub
            });

            expect(allExpenseController.allTimeLogs).toEqual(allTimeLogsStub);

        }));

    });


});
