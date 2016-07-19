/**
 * Created by Sani Yusuf on 19/07/2016.
 */


describe('Create Expense Modal Service', function () {

    window.RESOURCE_ROOT = '';
    var createTimeAndExpenseModal,
        $ionicModalMock,
        $cordovaLocalNotificationMock,
        $cordovaNetworkMock,
        $ionicLoadingMock,
        $ionicPopupMock,
        projectIDStub,
        fromTemplateUrlParams,
        $ionicModalInstanceStub;
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

        //$ionicPopup Mock
        $ionicPopupMock = jasmine.createSpyObj('$ionicPopupMock', ['show']);

        // $ionicModal Mock
        $ionicModalMock = {
            fromTemplateUrl: function (templateUrl, templateOptions) {
                fromTemplateUrlParams = {
                    templateUrl: templateUrl,
                    templateOptions: templateOptions
                }
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
            $provide.value('$ionicPopup', $ionicPopupMock);
        });

        projectIDStub = '1234';

    });

    beforeEach(inject(function (_CreateTimeAndExpenseModal_) {
        createTimeAndExpenseModal = _CreateTimeAndExpenseModal_;
        $ionicModalInstanceStub = {
            show: angular.noop
        }
    }));

    it('Should Have CreateTimeAndExpenseModal To Be Defined', function () {
        expect(createTimeAndExpenseModal).toBeDefined();
    });

    it('Should Create A Modal With .fromTemplateUrls() When Passed A Valid Project ID & Expense Type', inject(function ($q, $rootScope) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.returnValue($q.resolve({}));
        $rootScope.$apply();

        createTimeAndExpenseModal.open(projectIDStub, 'expense');
        expect($ionicModalMock.fromTemplateUrl).toHaveBeenCalled();
    }));

    it('Should Create A Time Modal Is Passed The [time] Template Type Parameter', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });

        createTimeAndExpenseModal.open(projectIDStub, 'time');

        var newExpenseStub = {
            description: '',
            duration: '',
            projectID: projectIDStub
        };


        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateOptions.scope.newExpense).toEqual(newExpenseStub);
        expect(fromTemplateUrlParams.templateUrl).toContain('createTimeLog');
    }));


    it('Should Create An Expense Modal Is Not Passed The [time] Template Type Parameter', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });

        createTimeAndExpenseModal.open(projectIDStub, 'expense');

        var newExpenseStub = {
            description: '',
            amount: '',
            receiptImage: '',
            projectID: projectIDStub,
            expenseType: ''
        };


        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateOptions.scope.newExpense).toEqual(newExpenseStub);
        expect(fromTemplateUrlParams.templateUrl).toContain('createExpense');
    }));


    it('Should Create An Expense Modal Is Not Passed Any Template Type Parameter', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });

        createTimeAndExpenseModal.open(projectIDStub);

        var newExpenseStub = {
            description: '',
            amount: '',
            receiptImage: '',
            projectID: projectIDStub,
            expenseType: ''
        };

        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateOptions.scope.newExpense).toEqual(newExpenseStub);
        expect(fromTemplateUrlParams.templateUrl).toContain('createExpense');
    }));


    it('Should Show Call .show() After Successfully Creating Modal', inject(function ($q, $rootScope) {
        spyOn($ionicModalInstanceStub, 'show');
        spyOn($ionicModalMock, 'fromTemplateUrl').and.returnValue($q.resolve($ionicModalInstanceStub));

        createTimeAndExpenseModal.open(projectIDStub);
        $rootScope.$digest();
        
        expect($ionicModalInstanceStub.show).toHaveBeenCalled();
    }));


});