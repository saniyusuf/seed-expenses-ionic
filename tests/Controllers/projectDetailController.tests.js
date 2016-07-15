/**
 * Created by sani on 07/07/2016.
 */


describe('Project Detail Controller', function () {
    beforeEach(module('starter.controllers'));
    beforeEach(function () {
        var fullProjectDetailsStub = {
                id: '1',
                description: 'dummy test mock data'
            };

        it('Should Be Defined', inject(function ($controller) {
            var projectDetail = $controller('ProjectDetailController', {
                FullProjectDetails: fullProjectDetailsStub
            });

            expect(projectDetail).toBeDefined();

            it('Should Have An fullProjectDetails Property Equal To FullProjectDetails Stub', function () {
                expect(projectDetail.fullProjectDetails).toEqual(fullProjectDetailsStub);
            })

        }))

    });


});