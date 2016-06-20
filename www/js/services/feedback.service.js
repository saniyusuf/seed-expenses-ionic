/**
 * Created by Sani Yusuf on 20/06/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('FeedbackService', FeedbackService);

    FeedbackService.$inject = ['$q', 'devUtils', 'SyncService', 'FEEDBACK_TABLE_NAME'];

    function FeedbackService($q, devUtils, SyncService, FEEDBACK_TABLE_NAME) {
        var feedbackService = {
            postFeedback: postFeedback
        };
        
        return feedbackService;
        
        function postFeedback(feedBack) {
            return devUtils.insertRecord(FEEDBACK_TABLE_NAME, feedBack)
                .then(function (postFeedbackSuccessResponse) {
                    SyncService.syncTables([FEEDBACK_TABLE_NAME], true);
                    return $q.resolve(postFeedbackSuccessResponse);

                }, function (postFeedbackFailureResponse) {
                    return $q.reject(postFeedbackFailureResponse);
                });
        }

    }

})();