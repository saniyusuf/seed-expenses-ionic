
angular.module('starter', ['ionic', 'ngIOS9UIWebViewPatch', 'starter.services', 'starter.controllers', 'ngCordova'])

    .constant('PROJECTS_TABLE_NAME', 'MC_Project__ap')
    .constant('PROJECT_EXPENSES_TABLE_NAME', 'MC_Time_Expense__ap')
    .constant('PROJECT_LOCATION_TABLE_NAME', 'MC_Project_Location__ap')
    .constant('FEEDBACK_TABLE_NAME', 'Mobile_Feedback__ap')

.run(['$ionicPlatform', 'NetworkService', 'AppRunStatusService', 'UserService', 'SyncService', 'PROJECTS_TABLE_NAME', 'PROJECT_EXPENSES_TABLE_NAME', 'PROJECT_LOCATION_TABLE_NAME' ,
  function($ionicPlatform, NetworkService, AppRunStatusService, UserService, SyncService, PROJECTS_TABLE_NAME, PROJECT_EXPENSES_TABLE_NAME, PROJECT_LOCATION_TABLE_NAME) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    document.addEventListener("resume", function() {
      AppRunStatusService.statusEvent('resume');
    }, false);
    // document.addEventListener("pause", function() {
    //   AppRunStatusService.statusEvent('pause');
    // }, false);
    document.addEventListener("online", function() {
      NetworkService.networkEvent('online');
    }, false);
    document.addEventListener("offline", function() {
      NetworkService.networkEvent('offline');
    }, false);


    // Local notifications plugin event handlers -  uncomment if you want them
    // and make sure you inject the service
    //
    // if (cordova && cordova.plugins && cordova.plugins.notification) {
    //   // Notification has reached its trigger time
    //   cordova.plugins.notification.local.on("trigger", function (notification, state) {
    //     LocalNotificationService.handleLocalNotification(notification.id, state);
    //   });
    //   // Event fired when user taps on notification
    //   cordova.plugins.notification.local.on("click", function (notification, state) {
    //     LocalNotificationService.handleLocalNotificationClick(notification.id, state);
    //   });
    // }


    // Example of locking the screen orientation to landscape
    // if (screen && screen.lockOrientation) {
    //   screen.lockOrientation('landscape');
    // }

  });

  // Check if the intialSync process has been run. This is the process that pulls
  // down the data on the first run up to ensure offline first capability
  //
  // In the below case we also do a coldStartSync if we are starting but not for
  // the first time
  UserService.hasDoneProcess("initialDataLoaded").then(function (result) {
    if (result) {
      // Ensure that the syncTables will run
      SyncService.setSyncLock("false");
      SyncService.setSyncState("Complete");
      SyncService.coldStartSync();
    } else {
      NetworkService.setNetworkStatus("online");
      // Initial install and load of data => initialSync lighter-weight sync call.
      SyncService.initialSync();
    }
  });

    /**
     * Keep Tables Synced On Resume
     */
    $ionicPlatform.on('resume', function () {
      SyncService.syncTables([PROJECTS_TABLE_NAME, PROJECT_EXPENSES_TABLE_NAME], true, 1000 * 60 * 60);
      SyncService.syncTables([PROJECT_LOCATION_TABLE_NAME], true, 4000 * 60 * 60);
    });

}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: RESOURCE_ROOT +  'templates/tabsMain.html'
    })

      .state('tab.all-expenses', {
        url: '/all-expenses/:projectID',
        views: {
          'projects-tab': {
            templateUrl: RESOURCE_ROOT + 'templates/allExpenses.html',
            controller: 'AllExpensesController',
            controllerAs: 'allExpensesVM',
            resolve: {
              AllExpenses: allExpenses
            }
          }
        }
      })

      .state('tab.all-time-logs', {
        url: '/all-time-logs/:projectID',
        views: {
          'projects-tab': {
            templateUrl: RESOURCE_ROOT + 'templates/allTimeLogs.html',
            controller: 'AllTimeLogsController',
            controllerAs: 'allTimeLogsVM',
            resolve: {
              AllTimeLogs: allTimeLogs
            }
          }
        }
      })

      .state('tab.projects', {
        url: '/projects',
        views: {
          'projects-tab': {
            templateUrl: RESOURCE_ROOT + 'templates/projects.html',
            controller: 'ProjectsController',
            controllerAs: 'projectsVM'
          }
        }
      })

      .state('tab.project-detail', {
        cache: false,
        url: '/project-detail/:projectID/:projectLocationID',
        views: {
          'projects-tab': {
            templateUrl: RESOURCE_ROOT + 'templates/projectDetail.html',
            controller: 'ProjectDetailController',
            controllerAs: 'projectDetailVM',
            resolve: {
              FullProjectDetails: fullProjectDetails
            }
          }
        }
      })

      .state('tab.outbox', {
        url: '/outbox',
        views: {
          'settings-tab': {
            templateUrl: RESOURCE_ROOT + 'templates/outbox.html',
            controller: 'OutboxCtrl',
            controllerAs: 'outboxControllerViewModel'
          }
        }
      })

      .state('tab.create-feedback', {
        url: '/create-feedback',
        views: {
          'settings-tab': {
            templateUrl: RESOURCE_ROOT + 'templates/createFeedback.html',
            controller: 'CreateFeedbackController',
            controllerAs: 'createFeedbackVM'
          }
        }
      })

    /*****************************************************
     * S E T T I N G S    &    D E V    T O O L S
     ****************************************************/

    .state('tab.settings', {
      url: '/settings',
      views: {
        'settings-tab': {
          templateUrl: RESOURCE_ROOT +  'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('tab.settings-devtools', {
      url: '/settings/devtools',
      views: {
        'settings-tab': {
          templateUrl: RESOURCE_ROOT +  'templates/settingsDevTools.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('tab.settings-mti', {
      url: '/settings/mti',
      views: {
        'settings-tab': {
          templateUrl: RESOURCE_ROOT +  'templates/settingsDevMTI.html',
          controller: 'MTICtrl'
        }
      }
    })

    .state('tab.mti-detail', {
      url: '/settings/mti/:tableName',
      views: {
        'settings-tab': {
          templateUrl: RESOURCE_ROOT +  'templates/settingsDevMTIDetail.html',
          controller: 'MTIDetailCtrl'
        }
      }
    })

    .state('tab.settings-testing', {
      url: '/settings/testing',
      views: {
        'settings-tab': {
          templateUrl: RESOURCE_ROOT +  'templates/settingsTesting.html',
          controller: 'TestingCtrl'
        }
      }
    })

    .state('tab.settings-deploy', {
      url: '/settings/deploy',
      views: {
        'settings-tab': {
          templateUrl: RESOURCE_ROOT +  'templates/settingsDeploy.html',
          controller: 'DeployCtrl'
        }
      }
    });

  // ! ! ! ! !  ! ! ! ! !  ! ! ! ! !  ! ! ! ! !  ! ! ! ! !  ! ! ! ! !
  //
  //    A H O Y     H O Y     ! ! !
  //
  //    Change this to call you home page/tab/etc
  //    At the moment it points to the MobileCaddy Settings tab
  //
  // ! ! ! ! !  ! ! ! ! !  ! ! ! ! !  ! ! ! ! !  ! ! ! ! !  ! ! ! ! !
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/projects');

}]);

// This is the function that get's called once the MobileCaddy libs are done
// checking the app install/health. Basically the point at which our client
// app can kick off. It's here we boot angular into action.
// runUpInfo : see http://developer.mobilecaddy.net/docs/api for details on
// object and codes.
function myapp_callback(runUpInfo) {
  if (typeof(runUpInfo) != "undefined" &&
     (typeof(runUpInfo.newVsn) != "undefined" && runUpInfo.newVsn != runUpInfo.curVsn)) {
    // Going to call a hardReset as an upgrade is available.
    console.debug('runUpInfo', runUpInfo);
    var vsnUtils= mobileCaddy.require('mobileCaddy/vsnUtils');
    vsnUtils.hardReset();
  } else {
    // carry on, nothing to see here
    angular.bootstrap(document, ['starter']);
  }
}

fullProjectDetails.$inject = ['$stateParams', 'logger', 'ProjectService', '$ionicLoading', '$q'];
function fullProjectDetails($stateParams, logger, ProjectService, $ionicLoading, $q) {
  $ionicLoading.show({
    template: "Getting Project's Details"
  });
  return ProjectService.getFullProjectDetails($stateParams.projectID, $stateParams.projectLocationID)
      .then(function (projectDetails) {
        logger.log('Full Project Details ->', projectDetails[0]);
        $ionicLoading.hide();
        return $q.resolve(projectDetails);

      }, function (projectDetailFailureResponse) {
        logger.log('Failed To Get Project Detail -> ', projectDetailFailureResponse);
        $ionicLoading.hide();
        return $q.reject(projectDetailFailureResponse);
      });
}

allExpenses.$inject = ['ProjectService', '$ionicLoading', '$stateParams'];
function allExpenses(ProjectService, $ionicLoading, $stateParams) {
  $ionicLoading.show({
    template: 'Getting Expenses ..'
  });

  return ProjectService.getAllExpenses($stateParams.projectID)
      .then(function (allExpenses) {
        $ionicLoading.hide();
        angular.forEach(allExpenses, function (expense) {
          expense.CreatedDate = new Date(expense.CreatedDate).getTime();
        });
        allExpenses.sort(function (a, b) {
          return b.CreatedDate - a.CreatedDate;
        });
        return allExpenses;

      }, function (allExpensesFailureResponse) {
        $ionicLoading.hide({
          template: "Couldn't Get Expenses. Please Try Again"
        });
        return $q.reject(allExpensesFailureResponse);
      });
}

allTimeLogs.$inject = ['ProjectService', '$ionicLoading', '$stateParams'];
function allTimeLogs(ProjectService, $ionicLoading, $stateParams) {
  $ionicLoading.show({
    template: 'Getting Time Logs ..'
  });

  return ProjectService.getAllTimeLogs($stateParams.projectID)
      .then(function (allTimeLogs) {
        $ionicLoading.hide();
        angular.forEach(allTimeLogs, function (timeLog) {
          timeLog.CreatedDate = new Date(timeLog.CreatedDate).getTime();
        });
        allTimeLogs.sort(function (a, b) {
          return b.CreatedDate - a.CreatedDate;
        });
        return allTimeLogs;

      }, function (allTimeLogsFailureResponse) {
        $ionicLoading.show({
          template: "Couldn't Get Time Logs. Please Try Again"
        });
        return $q.reject(allTimeLogsFailureResponse);
      });
}
