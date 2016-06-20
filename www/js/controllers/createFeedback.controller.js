/**
 * Created by Sani Yusuf on 20/06/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('CreateFeedbackController', CreateFeedbackController);

    CreateFeedbackController.$inject = ['FeedbackService', '$ionicLoading', '$ionicHistory'];
    function CreateFeedbackController(FeedbackService, $ionicLoading, $ionicHistory) {
        var vm = this;

        vm.feedback = {
            mobilecaddy1__Comment__c: '',
            Name: 'TMP-' + Date.now()
        };
        vm.postFeedback = postFeedback;

        function postFeedback() {
            if(vm.feedback.mobilecaddy1__Comment__c === ''){
                $ionicLoading.show({
                    duration: 1200,
                    noBackdrop: true,
                    template: 'Please enter some text'
                });

                return false;
            }

            $ionicLoading.show({
                template: 'Posting Your Feedback ..'
            });
            FeedbackService.postFeedback(vm.feedback)
                .then(function () {
                    vm.feedback = {
                        mobilecaddy1__Comment__c: '',
                        Name: 'TMP-' + Date.now()
                    };
                    $ionicHistory.goBack();
                    $ionicLoading.show({
                        noBackdrop: true,
                        template: 'Thank You For Your Feedback',
                        duration: 1200
                    });
                    
                }, function () {
                    $ionicLoading.show({
                        noBackdrop: true,
                        template: 'Feedback Not Posted. Please Try Again Shortly',
                        duration: 1200
                    });
                });
        }
        
    }

})();