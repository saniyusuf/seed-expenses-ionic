/**
 * Created by Sani Yusuf on 19/07/2016.
 */


window.RESOURCE_ROOT = '';

describe('Edit Project Modal Service', function () {

    var $cordovaNetworkMock,
        $cordovaLocalNotificationMock,
        $ionicModalMock,
        $ionicLoadingMock,
        fromTemplateUrlParams,
        $ionicModalInstanceStub,
        editProjectDetailsModal,
        projectServiceMock;

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

        //ProjectService Mock
        projectServiceMock = {
            updateProjectDetails: angular.noop
        };

        module(function ($provide) {
            $provide.value('$ionicModal', $ionicModalMock);
            $provide.value('$cordovaLocalNotification', $cordovaLocalNotificationMock);
            $provide.value('$cordovaNetwork', $cordovaNetworkMock);
            $provide.value('$ionicLoading', $ionicLoadingMock);
            $provide.value('PROJECTS_TABLE_NAME', '');
            $provide.value('PROJECT_EXPENSES_TABLE_NAME', '');
            $provide.value('PROJECT_LOCATION_TABLE_NAME', '');
            $provide.value('ProjectService', projectServiceMock);
        });
        
    });

    beforeEach(inject(function (_EditProjectDetailsModal_) {
        editProjectDetailsModal = _EditProjectDetailsModal_;
        $ionicModalInstanceStub = {
            show: angular.noop,
            remove: angular.noop,
            hide: angular.noop
        };
    }));


    it('Should Be Defined', function () {
        expect(editProjectDetailsModal).toBeDefined();
    });


    it('Should Create An Edit Project Modal With Correct Template', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });

        editProjectDetailsModal.open();

        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateUrl).toContain('editProjectDetail');
    }));

    it('Should Create An Edit Projects Modal With projectDetails Param Passed', inject(function ($q) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });

        var projectDetailsStub = {
            test: 'Test'
        };

        editProjectDetailsModal.open(projectDetailsStub);

        expect(fromTemplateUrlParams).toBeDefined();
        expect(fromTemplateUrlParams.templateOptions.scope.projectDetails).toEqual(projectDetailsStub);
    }));


    it('Should Call Remove A Modal From Memory When Close', inject(function ($q, $rootScope) {
        spyOn($ionicModalMock, 'fromTemplateUrl').and.callFake(function (templateUrl, templateOptions) {
            fromTemplateUrlParams = {
                templateUrl: templateUrl,
                templateOptions: templateOptions
            };

            return $q.resolve($ionicModalInstanceStub);
        });
        spyOn($ionicModalInstanceStub, 'remove');
        spyOn($ionicModalInstanceStub, 'hide').and.callFake(function () {
            return $q.resolve($ionicModalInstanceStub);
        });

        editProjectDetailsModal.open();
        $rootScope.$digest();

        fromTemplateUrlParams.templateOptions.scope.close();
        $rootScope.$digest();

        expect($ionicModalInstanceStub.remove).toHaveBeenCalled();
    }));


});