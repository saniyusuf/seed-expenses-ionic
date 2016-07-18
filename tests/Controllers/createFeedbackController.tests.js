/**
 * Created by Sani Yusuf on 16/07/2016.
 */


describe('Create Feedback Controller', function () {
    var feedbackServiceStub,
        ionicHistoryStub = {
            goBack: angular.noop
        },
        ionicLoadingStub,
        controllerDependencies;

    beforeEach(module('starter.controllers'));
    beforeEach(function () {
        feedbackServiceStub = {
            postFeedback: function (feedback) {}
        };
        ionicLoadingStub = {
            show: function (options) {}
        };
        controllerDependencies = {
            FeedbackService: feedbackServiceStub,
            $ionicHistory: ionicHistoryStub,
            $ionicLoading: ionicLoadingStub
        };
    });

    it('Should Be Defined', inject(function ($controller) {
        var createFeedbackController = $controller('CreateFeedbackController', controllerDependencies);
        expect(createFeedbackController).toBeDefined();
    }));

    it('Should Have feedback property', inject(function ($controller) {
        var createFeedbackController = $controller('CreateFeedbackController', controllerDependencies);
        expect(createFeedbackController.feedback).toBeDefined();
    }));


    it('Should Exit Function When FeedBack Text Is Empty ', inject(function ($controller) {
        var emptyFeedbackStub = {
            duration: 1200,
            noBackdrop: true,
            template: 'Please enter some text'
        };

        var createFeedbackController = $controller('CreateFeedbackController', controllerDependencies);
        createFeedbackController.feedback = {
            mobilecaddy1__Comment__c: '',
            Name: 'TMP-' + Date.now()
        };

        spyOn(ionicLoadingStub, 'show');
        createFeedbackController.postFeedback();
        expect(ionicLoadingStub.show).toHaveBeenCalledWith(emptyFeedbackStub);
    }));

    it('Should Show Loader Message When Posting Valid Feedback', inject(function ($controller, $q) {
        var emptyFeedbackStub = {
            template: 'Posting Your Feedback ..'
        };
        var postFeedbackPromise = $q.defer();

        var createFeedbackController = $controller('CreateFeedbackController', controllerDependencies);
        createFeedbackController.feedback = {
            mobilecaddy1__Comment__c: 'Fake Comment Feedback',
            Name: 'TMP-' + Date.now()
        };

        spyOn(feedbackServiceStub, 'postFeedback').and.returnValue(postFeedbackPromise.promise);
        spyOn(ionicLoadingStub, 'show');

        createFeedbackController.postFeedback();
        expect(ionicLoadingStub.show).toHaveBeenCalledWith(emptyFeedbackStub);
    }));

    it('Should Call Feedback.postFeedback When Feedback Is Valid', inject(function ($controller, $q, $rootScope) {

        var $scope = $rootScope.$new();
        var postFeedbackPromise = $q.defer();

        var createFeedbackController = $controller('CreateFeedbackController', controllerDependencies);
        createFeedbackController.feedback = {
            mobilecaddy1__Comment__c: 'Fake Comment Feedback',
            Name: 'TMP-' + Date.now()
        };

        spyOn(feedbackServiceStub, 'postFeedback').and.returnValue(postFeedbackPromise.promise);
        spyOn(ionicLoadingStub, 'show');

        postFeedbackPromise.resolve({});
        $scope.$apply();

        createFeedbackController.postFeedback();
        expect(feedbackServiceStub.postFeedback).toHaveBeenCalledWith(createFeedbackController.feedback);
    }));


    it('Should Empty Feedback After Successful Post', inject(function ($controller, $q, $rootScope) {

        var $scope = $rootScope.$new();
        var postFeedbackPromise = $q.defer();

        var createFeedbackController = $controller('CreateFeedbackController', controllerDependencies);
        createFeedbackController.feedback = {
            mobilecaddy1__Comment__c: 'Fake Comment Feedback',
            Name: 'TMP-' + Date.now()
        };

        spyOn(feedbackServiceStub, 'postFeedback').and.returnValue(postFeedbackPromise.promise);
        spyOn(ionicLoadingStub, 'show');

        postFeedbackPromise.resolve({});
        $scope.$apply();

        createFeedbackController.postFeedback();
        $scope.$apply();

        expect(createFeedbackController.feedback.mobilecaddy1__Comment__c).toBe('');
    }));

    it('Should Call Backward Navigation After Successful Post Of Feedback', inject(function ($controller, $q, $rootScope) {

        var $scope = $rootScope.$new();
        var postFeedbackPromise = $q.defer();

        var createFeedbackController = $controller('CreateFeedbackController', controllerDependencies);
        createFeedbackController.feedback = {
            mobilecaddy1__Comment__c: 'Fake Comment Feedback',
            Name: 'TMP-' + Date.now()
        };

        spyOn(feedbackServiceStub, 'postFeedback').and.returnValue(postFeedbackPromise.promise);
        spyOn(ionicLoadingStub, 'show');
        spyOn(ionicHistoryStub, 'goBack');

        postFeedbackPromise.resolve({});
        $scope.$apply();

        createFeedbackController.postFeedback();
        $scope.$apply();

        expect(ionicHistoryStub.goBack).toHaveBeenCalled();
    }));


});
