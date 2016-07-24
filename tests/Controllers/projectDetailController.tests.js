/**
 * Created by sani on 07/07/2016.
 */


describe('Project Detail Controller', function () {
    var fullProjectDetailsStub,
        createTimeAndExpenseModalStub,
        editProjectDetailsModalStub,
        controllerDependencies;
    beforeEach(module('starter.controllers'));
    beforeEach(inject(function ($rootScope) {
        fullProjectDetailsStub = {
            projectDetails: {
                id: '1',
                description: 'dummy test mock data'
            }
        };
        createTimeAndExpenseModalStub = {
            open: function (projectID, timeOrExpense) {}
        };
        editProjectDetailsModalStub = {
            open: function (projectDetails) {}
        };
        controllerDependencies = {
            FullProjectDetails: fullProjectDetailsStub,
            CreateTimeAndExpenseModal: createTimeAndExpenseModalStub,
            EditProjectDetailsModal: editProjectDetailsModalStub,
            $scope: $rootScope.$new()
        };

    }));

    it('Should Be Defined', inject(function ($controller) {
        var projectDetailController = $controller('ProjectDetailController', controllerDependencies);
        expect(projectDetailController).toBeDefined();
    }));

    it('Should Have A fullProjectDetails Property Equal To FullProjectDetails Stub', inject(function ($controller) {
        var projectDetailController = $controller('ProjectDetailController', controllerDependencies);
        expect(projectDetailController.fullProjectDetails).toEqual(fullProjectDetailsStub);
    }));

    it('Should Create A New Expense Modal With Passed [projectID] & [expense] String', inject(function ($controller) {

        controllerDependencies.$stateParams = {
            projectID: '1234'
        };
        var projectDetailController = $controller('ProjectDetailController', controllerDependencies);

        spyOn(createTimeAndExpenseModalStub, 'open');

        projectDetailController.openCreateNewExpenseModal();

        expect(createTimeAndExpenseModalStub.open)
            .toHaveBeenCalledWith(controllerDependencies.$stateParams.projectID, 'expense');

    }));

    it('Should Create A New Time Modal With Passed [projectID] & [expense] String', inject(function ($controller) {

        controllerDependencies.$stateParams = {
            projectID: '1234'
        };
        var projectDetailController = $controller('ProjectDetailController', controllerDependencies);

        spyOn(createTimeAndExpenseModalStub, 'open');

        projectDetailController.openCreateNewTimeLogModal();

        expect(createTimeAndExpenseModalStub.open)
            .toHaveBeenCalledWith(controllerDependencies.$stateParams.projectID, 'time');

    }));

    it('Should Edit Project With A Cloned Copy From Resolved Data', inject(function ($controller) {
        var projectDetailController = $controller('ProjectDetailController', controllerDependencies);

        spyOn(editProjectDetailsModalStub, 'open');

        projectDetailController.openEditProjectModal();

        expect(editProjectDetailsModalStub.open)
            .toHaveBeenCalledWith(fullProjectDetailsStub.projectDetails);

    }));

    it('Should Change Project Details With Event Sent From Modal', inject(function ($controller, $rootScope) {
        var projectDetailController = $controller('ProjectDetailController', controllerDependencies);
        var updatedProjectDataStub = {
            mobilecaddy1__Description__c: 'New Description',
            Name: 'New Name'
        };

        $rootScope.$broadcast('updateProject:success', updatedProjectDataStub);

        expect(projectDetailController.fullProjectDetails.projectDetails.Name).toEqual(updatedProjectDataStub.Name);
        expect(projectDetailController.fullProjectDetails.projectDetails.mobilecaddy1__Description__c).toEqual(updatedProjectDataStub.mobilecaddy1__Description__c);

    }));


});
