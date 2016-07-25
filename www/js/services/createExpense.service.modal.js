/**
 * Created by Sani Yusuf on 02/06/2016.
 */

(function () {
    'use strict';
    angular
        .module('starter.services')
        .factory('CreateTimeAndExpenseModal', CreateTimeAndExpenseModal);

    CreateTimeAndExpenseModal.$inject = ['$ionicModal', '$rootScope', 'ProjectService', '$ionicLoading', 'logger', '$ionicPopup', '$cordovaCamera', '$timeout'];

    function CreateTimeAndExpenseModal($ionicModal, $rootScope, ProjectService, $ionicLoading, logger, $ionicPopup, $cordovaCamera, $timeout) {
        var $scope = $rootScope.$new(),
            imageSelectionPopupScope = $rootScope.$new(),
            createExpenseModalInstanceOptions = {
                scope: $scope,
                focusFirstInput: true
            },
            createExpenseModalTemplateUrl = RESOURCE_ROOT + 'templates/createExpense.html',
            createTimeLogModalTemplateUrl = RESOURCE_ROOT + 'templates/createTimeLog.html',
            imageSelectionPopupTemplateUrl = RESOURCE_ROOT + 'templates/imageSelectionPopup.html',
            imageSelectionPopup = '',
            imageSelectionPopupInstanceOptions = {
                templateUrl: imageSelectionPopupTemplateUrl,
                scope: imageSelectionPopupScope,
                buttons: [
                    {
                        text: 'Cancel' ,
                        type: 'button-positive'
                    }
                ]
            },
            receiptImageCameraPluginOptions = {
                quality: 50,
                destinationType: 0,
                encodingType: 1,
                targetHeight: 250,
                saveToPhotoAlbum: false,
                correctOrientation:true
            };

        $scope.newExpense = {
            description: '',
            amount: '',
            receiptImage: '',
            expenseType: ''
        };
        $scope.createNewExpense = createNewExpense;
        $scope.createNewTimeLog = createNewTimeLog;

        var createExpenseModal = {
            open: open
        };

        return createExpenseModal;

        function open(projectID, expenseType) {
            var templateUrl = '';
            if(expenseType === 'time'){
                $scope.newExpense = {
                    description: '',
                    duration: '',
                    projectID: projectID
                };
                templateUrl = createTimeLogModalTemplateUrl;

            } else {
                $scope.clearReceiptImage = clearReceiptImage;
                $scope.openImageSelectionPopup = openImageSelectionPopup;
                $scope.newExpense = {
                    description: '',
                    amount: '',
                    receiptImage: '',
                    projectID: projectID,
                    expenseType: ''
                };
                templateUrl = createExpenseModalTemplateUrl;
            }

            return $ionicModal.fromTemplateUrl(
                templateUrl,
                createExpenseModalInstanceOptions

            ).then(function (modalInstance) {

                $scope.close = function () {
                   closeAndRemove(modalInstance);
                };

                return modalInstance.show();
            });
        }

        function closeAndRemove(modalInstance) {
            return modalInstance.hide()
                .then(function () {
                    return modalInstance.remove();
                });
        }

        function createNewTimeLog() {
            createNewTimeLogOrExpense('time');
        }

        function createNewExpense() {
            createNewTimeLogOrExpense('expense');
        }

        function createNewTimeLogOrExpense(expenseType) {
            $ionicLoading.show({
                template: 'Submitting You New Expense ..'
            });

            var newExpense = {
                "mobilecaddy1__Short_Description__c": $scope.newExpense.description,
                "Name": 'TMP-' + Date.now(),
                "mobilecaddy1__Project__c": $scope.newExpense.projectID,
                "mobilecaddy1__Expense_Image__c": $scope.newExpense.receiptImage,
                "mobilecaddy1__Expense_Amount__c" : parseFloat($scope.newExpense.amount)
            };

            if(expenseType === 'time'){
                newExpense.mobilecaddy1__Duration_Minutes__c = parseFloat($scope.newExpense.duration);
            }

            ProjectService.createNewExpenseOrTimeLog(newExpense)
                .then(function (newExpenseSuccessResponse) {
                    logger.log('Successfully Created New Expense -> ', newExpenseSuccessResponse);

                    var projectSummaryUpdate = {};
                    if(expenseType === 'time'){
                        projectSummaryUpdate.newTime =  newExpense.mobilecaddy1__Duration_Minutes__c;
                        projectSummaryUpdate.expenseType =  'time';

                    } else {
                        projectSummaryUpdate.newAmount =  newExpense.mobilecaddy1__Expense_Amount__c;
                        projectSummaryUpdate.expenseType =  'expense';
                    }
                    $rootScope.$broadcast('projectSummaryUpdate:success', projectSummaryUpdate);

                    $scope.close();
                    $ionicLoading.show({
                        template: 'Log Successfully Created!',
                        duration: 1200
                    });

                }, function (newExpenseFailureResponse) {
                    logger.log('Failed To Create New Expense -> ', newExpenseFailureResponse);
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: 'Log Entry Not Created. Please Try Again',
                        duration: 1200
                    });
                });
        }

        function openImageSelectionPopup() {
            imageSelectionPopupScope.getReceiptImageFromGallery = getReceiptImageFromGallery;
            imageSelectionPopupScope.getReceiptImageFromCamera = getReceiptImageFromCamera;

            imageSelectionPopup = $ionicPopup.show(imageSelectionPopupInstanceOptions);
        }

        function getReceiptImageFromGallery() {
            receiptImageCameraPluginOptions.sourceType = 2;
            $cordovaCamera.getPicture(receiptImageCameraPluginOptions)
                .then(function (receiptImageBase64String) {
                    $timeout(function () {
                       $scope.receiptImage = receiptImageBase64String;
                    });

                }, function () {
                    $ionicLoading.show({
                        template: 'Unable To Get Your Image',
                        noBackdrop: true,
                        duration: 1200
                    });
                });
        }

        function getReceiptImageFromCamera() {
            receiptImageCameraPluginOptions.sourceType = 1;
            $cordovaCamera.getPicture(receiptImageCameraPluginOptions)
                .then(function (receiptImageBase64String) {
                    $timeout(function () {
                        $scope.receiptImage = receiptImageBase64String;
                    });

                }, function () {
                    $ionicLoading.show({
                        template: 'Unable To Get Your Image',
                        noBackdrop: true,
                        duration: 1200
                    });
                });
        }

        function clearReceiptImage() {
            $scope.receiptImage = '';
        }

    }

})();
