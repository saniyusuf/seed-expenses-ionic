/**
 * Created by Sani Yusuf on 16/07/2016.
 */


describe('Create Feedback Controller', function () {
    beforeEach(module('starter.controllers'));
    beforeEach(function () {

        it('Should Be Defined', inject(function ($controller) {
            var createFeedbackController = $controller('CreateFeedbackController', {});

            expect(createFeedbackController).toBeDefined();
        }));

        it('Should Have feedback property', inject(function ($controller) {
            var createFeedbackController = $controller('CreateFeedbackController', {});

            expect(createFeedbackController.feedback).toBeDefined();
        }));


        it('Should Exit Function When FeedBack Text Is Empty ', inject(function ($controller) {
            var ionicLoadingStub = jasmine.createSpyObj('$ionicLoading', ['show']);
            var emptyFeedbackStub = {
                duration: 1200,
                noBackdrop: true,
                template: 'Please enter some text'
            };

            var createFeedbackController = $controller('CreateFeedbackController', {
                $ionicLoading: ionicLoadingStub
            });
            createFeedbackController.feedback = {
                mobilecaddy1__Comment__c: '',
                Name: 'TMP-' + Date.now()
            };

            expect($ionicLoading.show).toHaveBeenCalledWith(emptyFeedbackStub);
        }));

    });


});
