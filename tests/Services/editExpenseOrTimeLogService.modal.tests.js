/**
 * Created by Sani Yusuf on 19/07/2016.
 */

window.RESOURCE_ROOT = '';

describe('Edit Expense Or Time Log Service Modal', function () {

    var $cordovaNetworkMock,
        $cordovaLocalNotificationMock,
        $ionicModalMock,
        $ionicLoadingMock,
        fromTemplateUrlParams,
        $ionicModalInstanceStub,
        editExpenseOrTimeLogModal;
    
    beforeEach(module('starter.services'));

    beforeEach(function () {


        //CordovaLocalNotification Mock
        $cordovaLocalNotificationMock = jasmine.createSpyObj('$cordovaLocalNotification', ['cancel', 'isScheduled', 'schedule', 'update']);
        $cordovaLocalNotificationMock.cancel.and.callFake(function(){
            return new Promise(function(resolve, reject) {
                resolve('ok');
            });
        });
        $cordovaLocalNotificationMock.isScheduled.and.callFake(function(id){
            return new Promise(function(resolve, reject) {
                resolve(false);
            });
        });
        $cordovaLocalNotificationMock.schedule.and.callFake(function(obj){
            return new Promise(function(resolve, reject) {
                resolve('ok');
            });
        });
        $cordovaLocalNotificationMock.update.and.callFake(function(obj){
            return new Promise(function(resolve, reject) {
                resolve('ok');
            });
        });

        //$cordovaNetwork Mock
        $cordovaNetworkMock = jasmine.createSpyObj('$cordovaNetwork', ['isOnline']);
        $cordovaNetworkMock.isOnline.and.callFake(function(){
            return true;
        });

        //$ionicLoading Mock
        $ionicLoadingMock = jasmine.createSpyObj('$ionicLoading', ['show', 'hide']);

        // $ionicModal Mock
        $ionicModalMock = {
            fromTemplateUrl: function (templateUrl, templateOptions) {
                fromTemplateUrlParams = {
                    templateUrl: templateUrl,
                    templateOptions: templateOptions
                };
            }
        };

        module(function ($provide) {
            $provide.value('$ionicModal', $ionicModalMock);
            $provide.value('$cordovaLocalNotification', $cordovaLocalNotificationMock);
            $provide.value('$cordovaNetwork', $cordovaNetworkMock);
            $provide.value('PROJECTS_TABLE_NAME', '');
            $provide.value('PROJECT_EXPENSES_TABLE_NAME', '');
            $provide.value('PROJECT_LOCATION_TABLE_NAME', '');
            $provide.value('$ionicLoading', $ionicLoadingMock);
        });

    });

    beforeEach(inject(function (_EditExpenseOrTimeLogModal_) {
        editExpenseOrTimeLogModal = _EditExpenseOrTimeLogModal_;
        $ionicModalInstanceStub = {
            show: angular.noop
        };
    }));


    it('Should Be Defined', function () {
        expect(editExpenseOrTimeLogModal).toBeDefined();
    });


    it('Should Create An Edit Time Log Modal If Passed The [time] Template Type Parameter', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });
        var timeLogStub = {
            Id: '12',
            mobilecaddy1__Short_Description__c: 'Test',
            mobilecaddy1__Duration_Minutes__c: '12345'
        };

        editExpenseOrTimeLogModal.open(timeLogStub, 'time');


        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateOptions.scope.expenseOrTimeLog).toEqual(timeLogStub);
        expect(fromTemplateUrlParams.templateUrl).toContain('editTimeLogModal');
    }));


    it('Should Create An Edit Expense Modal If Passed The [expense] Template Type Parameter', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });
        var expenseStub = {
            Id: '',
            mobilecaddy1__Short_Description__c: '',
            mobilecaddy1__Expense_Amount__c: '',
            mobilecaddy1__Expense_Image__c: ''
        };

        editExpenseOrTimeLogModal.open(expenseStub, 'expense');

        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateOptions.scope.expenseOrTimeLog).toEqual(expenseStub);
        expect(fromTemplateUrlParams.templateUrl).toContain('editExpenseModal');
    }));


    it('Should Create An Edit Expense Modal Not Passed Any Template Type Parameter', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });
        var expenseStub = {
            Id: '',
            mobilecaddy1__Short_Description__c: '',
            mobilecaddy1__Expense_Amount__c: '',
            mobilecaddy1__Expense_Image__c: ''
        };

        editExpenseOrTimeLogModal.open(expenseStub);

        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateOptions.scope.expenseOrTimeLog).toEqual(expenseStub);
        expect(fromTemplateUrlParams.templateUrl).toContain('editExpenseModal');
    }));


    it('Should Show Call .show() After Successfully Creating Modal', inject(function ($q, $rootScope) {
        spyOn($ionicModalInstanceStub, 'show');
        spyOn($ionicModalMock, 'fromTemplateUrl').and.returnValue($q.resolve($ionicModalInstanceStub));

        var expenseStub = {
            Id: '',
            mobilecaddy1__Short_Description__c: '',
            mobilecaddy1__Expense_Amount__c: '',
            mobilecaddy1__Expense_Image__c: ''
        };

        editExpenseOrTimeLogModal.open(expenseStub);
        $rootScope.$digest();

        expect($ionicModalInstanceStub.show).toHaveBeenCalled();
    }));

});