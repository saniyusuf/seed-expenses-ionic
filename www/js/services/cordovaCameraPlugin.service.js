/**
 * Created by Sani Yusuf on 13/06/2016.
 */

// install   :   cordova plugin add cordova-plugin-camera
// link      :   https://github.com/apache/cordova-plugin-camera

(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('$cordovaCamera', ['$q', function ($q) {

            return {
                getPicture: function (options) {
                    var q = $q.defer();

                    if (!navigator.camera) {
                        q.resolve(null);
                        return q.promise;
                    }

                    navigator.camera.getPicture(function (imageData) {
                        q.resolve(imageData);
                    }, function (err) {
                        q.reject(err);
                    }, options);

                    return q.promise;
                },

                cleanup: function () {
                    var q = $q.defer();

                    navigator.camera.cleanup(function () {
                        q.resolve();
                    }, function (err) {
                        q.reject(err);
                    });

                    return q.promise;
                }
            };
        }]);


})();
