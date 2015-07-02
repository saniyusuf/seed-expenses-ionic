angular.module('starter.controllers', ['ionic'])

/*
===========================================================================
  ProjectIndexCtrl
===========================================================================
*/
.controller('ProjectIndexCtrl', ['$scope', '$rootScope', '$ionicLoading', '$interval', 'ProjectService', 'SyncService', 'devUtils', function($scope, $rootScope, $ionicLoading, $interval, ProjectService, SyncService, devUtils) {

  // This unhides the nav-bar. The navbar is hidden in the cases where we want a
  // splash screen, such as in this app
  e = document.getElementById('my-nav-bar');
  angular.element(e).removeClass( "mc-hide" );

  // Set height of list scrollable area
  var winHeight = window.innerHeight - 125;
  var projectsList = document.getElementById('project-list');
  projectsList.setAttribute("style","height:" + winHeight + "px");

  // Get reference to refresh/sync button (so we can change text, disable etc)
  var storesSyncButton = document.getElementById('projects-sync-button');

  // Adjust width of list refresh/sync button (cater for multiple buttons on different pages)
  var syncButtons = document.getElementsByClassName('sync-button');
  // If you need adjust the width of the refresh/sync button on the list then uncomment and amend following code.
  // Currently, the css on the button will set the width to 100%.
  /*  for (var i = syncButtons.length - 1; i >= 0; --i) {
    syncButtons[i].setAttribute("style","width:" + projectsList.offsetWidth + "px");
  }*/

  // Setup the loader and starting templates
  if (typeof($rootScope.child) == "undefined") {
    $ionicLoading.show({
      duration: 30000,
      delay : 400,
      maxWidth: 600,
      noBackdrop: true,
      template: '<h1>Loading...</h1><p id="app-progress-msg" class="item-icon-left">Fetching Projects...<ion-spinner/></p>'
    });
  }

  ProjectService.all($rootScope.refreshFlag).then(function(projects) {
    $rootScope.projects = projects;
    //console.log('ProjectIndexCtrl, got projects');
    $ionicLoading.hide();
    SyncButtonsClass("Remove", "ng-hide");
  }, function(reason) {
    //console.log('promise returned reason -> ' + reason);
  });
  $rootScope.refreshFlag = false;

  $scope.doRefreshFromPulldown = function() {
  	//console.log('doRefreshFromPulldown');
  	ProjectService.all(true).then(function(projects) {
      $rootScope.projects = projects;
    }, function(reason) {
      //console.log('promise returned reason -> ' + reason);
    });
  };

  $scope.doRefreshAndSync = function() {
    //console.log('doRefreshAndSync');
    ProjectService.all(false).then(function(projects) {
      $rootScope.projects = projects;
      if (SyncService.getSyncState() != "Syncing") {
        SyncService.syncTables(['MC_Project__ap', 'MC_Time_Expense__ap'], true);
      }
    }, function(reason) {
      //console.log('promise returned reason -> ' + reason);
    });
  };

  $scope.search = {};

  $scope.clearSearch = function() {
    $scope.search.query = "";
  };

  $scope.$on('handleSyncTables', function(event, args) {
    //console.log("handleSyncTables called args", args);
    switch (args.result.toString()) {
      case "Sync" :
        updateSyncButtonsText("Syncing...");
        SyncButtonsClass("Add", "disabled");
        break;
      case "Complete" :
        updateSyncButtonsText("Refresh and Sync");
        SyncButtonsClass("Remove", "disabled");
        break;
      case "100497" :
        updateSyncButtonsText("No device records to sync...");
        SyncButtonsClass("Remove", "disabled");
        $timeout( function() {
          updateSyncButtonsText("Refresh and Sync");
        },5000);
        break;
      case "100498" :
        updateSyncButtonsText("Sync already in progress...");
        SyncButtonsClass("Remove", "disabled");
        $timeout( function() {
          updateSyncButtonsText("Refresh and Sync");
        },5000);
        break;
      case "100402" :
        updateSyncButtonsText("Please connect before syncing");
        SyncButtonsClass("Remove", "disabled");
        break;
      default :
        if (args.result.toString().indexOf("Error") >= 0) {
          updateSyncButtonsText(args.result.toString());
          $timeout( function() {
            updateSyncButtonsText("Refresh and Sync");
          },5000);
        } else {
          updateSyncButtonsText("Refresh and Sync");
        }
        SyncButtonsClass("Remove", "disabled");
    }
  });

  function updateSyncButtonsText(newText) {
    for (var i = syncButtons.length - 1; i >= 0; --i) {
      angular.element(syncButtons[i]).html(newText);
    }
  }

  function SyncButtonsClass(action, className) {
    for (var i = syncButtons.length - 1; i >= 0; --i) {
      if (action == "Remove") {
        angular.element(syncButtons[i]).removeClass(className);
        if (className == "disabled") {
          SyncService.setSyncState("Complete");
        }
      } else {
        angular.element(syncButtons[i]).addClass(className);
        if (className == "disabled") {
          SyncService.setSyncState("Syncing");
        }
      }
    }
  }

  $interval(function() {
    $scope.checkIfSyncRequired();
  }, (1000 * 60 * 3));

  $scope.checkIfSyncRequired = function() {
    //console.log("checkIfSyncRequired");
    // Any dirty tables to sync?
    devUtils.dirtyTables().then(function(tables){
      if (tables && tables.length !== 0) {
        // Is the 'Refresh and Sync' enabled?
        if (!angular.element(storesSyncButton).hasClass("disabled")) {
          updateSyncButtonsText("Sync Required");
          SyncButtonsClass("Remove", "disabled");
        }
      }
    });
  };

}])

/*
===========================================================================
  ProjectDetailCtrl
===========================================================================
*/
.controller('ProjectDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$location', '$ionicLoading', 'ProjectService', function($scope, $rootScope, $stateParams, $location, $ionicLoading,  ProjectService) {

  // Listen for event broadcast when new Time/Expense created
  var unregisterEvent =  $rootScope.$on('handleRefreshProjectTotals', function(event) {
    getProjectTotals();
  });

  // Unregister the event listener when the current scope is destroyed
  $scope.$on('$destroy', function() {
    unregisterEvent();
  });

  $scope.project = ProjectService.get($stateParams.projectId);
  $scope.project.formDescription = $scope.project.mc_package_002__Description__c;

  getProjectTotals();

  function getProjectTotals() {
    // Calculate the total Time and Expense values displayed on the project details
    ProjectService.getProjectTotals($stateParams.projectId).then(function(retObject) {
      $scope.totalExpense = retObject.totalExpense;
      $scope.hours = Math.floor(retObject.totalTime / 60);
      $scope.minutes = retObject.totalTime % 60;
      $scope.$apply();
    }).catch(function(returnErr) {
      console.error('update,  returnErr ->' + angular.toJson(returnErr));
    });
  }

  var localProjCB = function(localProjects) {
    if (localProjects.length > 0) {
      $rootScope.projects = localProjects;
      $ionicLoading.hide();
      $location.path('/projects');
    }
  };

  /*
   * Handle submitForm : here we need to take any 'form fields', map them to
   * the MC object and call the update.
   */
  $scope.submitForm = function() {
    //console.log('submitForm');
    $ionicLoading.show({
      template: '<h1>Saving...</h1><p>Saving project...</p><i class="icon ion-loading-b" style="font-size: 32px"></i>',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 600,
      duration: 30000
    });
    var newProj = {};
    newProj.Id = $scope.project.Id;
    newProj.mc_package_002__Description__c  = $scope.project.formDescription;
    //console.log('update, project -> ' + angular.toJson(newProj));
    ProjectService.update(newProj).then(function(retObject) {
      //console.log('update, retObject -> ' + angular.toJson(retObject));
      // Call with local callback function so project list is displayed quickly while background sync continues
      return ProjectService.all(true, localProjCB);
    }).then(function(projects) {
        $rootScope.projects = projects;
        $ionicLoading.hide();
        $location.path('/projects');
    }).catch(function(returnErr) {
      console.error('update,  returnErr ->' + angular.toJson(returnErr));
      $ionicLoading.hide();
    });
  };

}])

/*
===========================================================================
  ProjectExpenseCtrl - list of Times or Expenses
===========================================================================
*/
.controller('ProjectExpenseCtrl', ['$scope', '$stateParams', 'ProjectService', function($scope, $stateParams, ProjectService) {

  //console.log('Angular : ProjectExpenseCtrl, projectId ->' + $stateParams.projectId);
  switch ($stateParams.type) {
      case 'time' : $scope.paramType = "Timesheets";
        break;
      default :  $scope.paramType = 'Expenses';
    }

  ProjectService.expenses($stateParams.type, $stateParams.projectId).then(function(timesheets) {
    $scope.expenses = timesheets;
    //console.log('ProjectExpenseCtrl -> ' + angular.toJson($scope.expenses ));
  }, function(reason) {
    console.error('promise returned error, reason -> ' + reason);
  });

}])

/*
===========================================================================
  ProjectExpNewCtrl - New Time or Expense
===========================================================================
*/
.controller('ProjectExpNewCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicModal', '$location', 'ProjectService', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicPopup, $ionicModal, $location, ProjectService) {

  switch ($stateParams.type) {
      case 'time' :
        $scope.paramType = "Timesheet";
        break;
      default :
        $scope.paramType = 'Expense';
    }
  $scope.projectId = $stateParams.projectId;
  $scope.description = "";

  /*
   * Handle submitForm
   */
  $scope.submitForm = function() {
    varNewExp = {
      "mc_package_002__Short_Description__c": $scope.expenseForm.description.$modelValue,
      "Name": 'TMP-' + Date.now(),
      "mc_package_002__Project__c": $stateParams.projectId
    };
    switch ($stateParams.type) {
      case 'time' :
        varNewExp.mc_package_002__Duration_Minutes__c = $scope.expenseForm.expenseValue.$modelValue;
        break;
      default :
        varNewExp.mc_package_002__Expense_Amount__c = $scope.expenseForm.expenseValue.$modelValue;
    }
    //console.log('ProjectExpNewCtrl, varNewExp -> ' + angular.toJson(varNewExp));
    $ionicLoading.show({
      duration: 30000,
      delay : 400,
      maxWidth: 600,
      noBackdrop: true,
      template: '<h1>Saving...</h1><p id="app-progress-msg" class="item-icon-left">Saving ' + $stateParams.type + ' record...<ion-spinner/></p>'
    });
    ProjectService.newExpense(varNewExp,
      function(){
        $ionicLoading.hide();
        $rootScope.$broadcast('refreshProjectTotals');
        $location.path("/tab/project/" + $stateParams.projectId);
      },
      function(e) {
        console.error('ProjectExpNewCtrl, error', e);
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Insert failed!',
          template: '<p>Sorry, something went wrong.</p><p class="error_details">Error: ' + e.status + ' - ' + e.mc_add_status + '</p>'
        });
      });
  };

}])

 /*
  ===========================================================================
    M O B I L C A D D Y     S E T T I N G S
  ===========================================================================
  */

.controller('SettingsHBCtrl', ['$scope', '$rootScope', 'DevService', 'NetworkService', function($scope, $rootScope, DevService, NetworkService) {

  if (localStorage.connection) {
    $scope.heartbeatStatus = localStorage.connection;
  } else {
    $scope.heartbeatStatus = 100100;
  }

  $scope.hbUpdate = function() {
    localStorage.connection = $scope.heartbeatStatus;
    if ($scope.heartbeatStatus == 100100) NetworkService.networkEvent('online');
    if ($scope.heartbeatStatus == 100103) NetworkService.networkEvent('offline');
  };

}])

.controller('SettingsCtrl', ['$scope', '$rootScope', '$ionicPopup', '$ionicLoading', '$location', 'devUtils', 'vsnUtils', 'DevService', 'ProjectService', function($scope, $rootScope, $ionicPopup, $ionicLoading, $location, devUtils, vsnUtils, DevService, ProjectService) {

  /*
  ---------------------------------------------------------------------------
    Main settings page
  ---------------------------------------------------------------------------
  */
  $scope.logoutAllowedClass = 'disabled';
  $scope.recsToSyncCount = 0;

  $scope.codeflow = LOCAL_DEV;

  $scope.upgradeAvailable = false;
  vsnUtils.upgradeAvailable().then(function(res){
    if (res)  return devUtils.dirtyTables();
  }).then(function(tables){
    if (tables && tables.length === 0) {
      $scope.upgradeAvailable = true;
      $scope.$apply();
    }
  });

  DevService.allRecords('recsToSync', false)
    .then(function(recsToSyncRecs) {
    $scope.recsToSyncCount = tableRecs.length;
    if ($scope.recsToSyncCount === 0) {
      $scope.logoutAllowedClass = '';
    } else {
      $scope.recsToSyncCount  = 0;
    }
  }, function(reason) {
    console.error('promise returned reason -> ' + reason);
  });


  DevService.allRecords('appSoup', false)
    .then(function(appSoupRecs) {
    $scope.settingsRecs = extractSettingsValues(appSoupRecs);
  }, function(reason) {
    console.error('promise returned reason -> ' + reason);
  });

  function extractSettingsValues(appSoupRecs) {
    var settingRecs = {};
    $j.each(appSoupRecs, function(i,records) {
      var tableRec = {};
      $j.each(records, function(i,record) {
        switch (record.Name) {
          case "Name" :
            tableRec.Name = record.Value;
            break;
          case "CurrentValue" :
            tableRec.Value = record.Value;
            break;
        }
      }); // end loop through the object fields
      settingRecs[tableRec.Name] = tableRec.Value;
    });
    return settingRecs;
  }


  /*
  ---------------------------------------------------------------------------
    Utility Functions
  ---------------------------------------------------------------------------
  */
  function validateAdminPassword(pword) {
    return (pword == "123") ?  true : false;
  }

  $scope.upgradeIfAvailable = function() {
    devUtils.dirtyTables().then(function(tables){
      if (tables && tables.length === 0) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Upgrade',
          template: 'Are you sure you want to upgrade now?'
        });
        confirmPopup.then(function(res) {
          if(res) {
            $ionicLoading.show({
              duration: 30000,
              delay : 400,
              maxWidth: 600,
              noBackdrop: true,
              template: '<h1>Upgrade app...</h1><p id="app-upgrade-msg" class="item-icon-left">Upgrading...<ion-spinner/></p>'
            });
            vsnUtils.upgradeIfAvailable().then(function(res){
              //console.log('upgradeIfAvailable', res);
            }).catch(function(e){
              console.error(e);
              $ionicLoading.hide();
            });
          }
        });
      } else {
        $scope.data = {};
        $ionicPopup.show({
          title: 'Upgrade',
          subTitle: 'Unable to upgrade. A sync is required - please try later.',
          scope: $scope,
          buttons: [
            {
              text: 'OK',
              type: 'button-positive',
              onTap: function(e) {
                return true;
              }
            }
          ]
        });
      }
    });
  };

  /*
  ---------------------------------------------------------------------------
    Log in/out
  ---------------------------------------------------------------------------
  */
  $scope.showAdminPasswordPopup = function() {
    var adminTimeout = (1000 * 60 * 5); // 5 minutes
    if ($rootScope.adminLoggedIn > Date.now() - adminTimeout) {
      $location.path('tab/settings/devtools');
      $rootScope.adminLoggedIn = Date.now();
      $scope.$apply();
    } else {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.admin">',
        title: 'Enter Admin Password',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          { text: '<b>Continue</b>',
            type: 'button-positive',
            onTap: function(e) {
            if (validateAdminPassword($scope.data.admin)) {
                $location.path('tab/settings/devtools');
                $rootScope.adminLoggedIn = Date.now();
              } else {
                //console.log("Password incorrect");
              }
            }
          },
        ]
      });
    }
  };

  $scope.showConfirmLogout = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Logout',
     template: 'Are you sure you want to logout?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $rootScope.adminLoggedIn = null;
     }
   });
  };


  $scope.showConfirmReset = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Reset App Data',
      template: 'Are you sure you want to reset ALL application data?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        //console.log("Resetting app");
        var vsnUtils = mobileCaddy.require('mobileCaddy/vsnUtils');
        var i;
        var name;
        $ionicLoading.show({
          duration: 30000,
          delay : 400,
          maxWidth: 600,
          noBackdrop: true,
          template: '<h1>Resetting app...</h1><p id="app-progress-msg" class="item-icon-left">Clearing data...<ion-spinner/></p>'
        });
        vsnUtils.hardReset().then(function(res){
          //$ionicLoading.hide();
        }).catch(function(e){
          console.error(e);
          $ionicLoading.hide();
        });
      }
    });
  };

}])


.controller('TestingCtrl', ['$scope', 'AppRunStatusService', function($scope, AppRunStatusService) {

  $scope.resumeEvent = function() {
    //console.log("resumeEvent");
    AppRunStatusService.statusEvent('resume');
  };

}])

/*
---------------------------------------------------------------------------
  MTI (Mobile Table Inspector)
---------------------------------------------------------------------------
*/
.controller('MTICtrl', ['$scope', '$rootScope', '$location', '$ionicPopup', 'DevService', function($scope, $rootScope, $location, $ionicPopup, DevService) {

  var adminTimeout = (1000 * 60 *5 ); // 5 minutes
  if ( $rootScope.adminLoggedIn > Date.now() - adminTimeout) {
  } else {
    $location.url('tab/settings');
    var alertPopup = $ionicPopup.alert({
      title: 'Access Denied'
    });
    alertPopup.then(function(res) {
      //$location.url('tab/settings');
      $scope.$apply();
    });
  }

  DevService.allTables().then(function(tables) {
    $scope.tables = tables;
  }, function(reason) {
    console.error('promise returned reason -> ' + reason);
  });

}])

.controller('MTIDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicLoading', 'DevService', function($scope, $rootScope,$stateParams, $ionicLoading, DevService) {
  $ionicLoading.show({
    duration: 30000,
    delay : 400,
    noBackdrop: true,
    template: '<p id="app-progress-msg" class="item-icon-left">Fetching records...<ion-spinner/></p>'
  });
  $scope.table = {'Name': $stateParams.tableName};
  DevService.allRecords($stateParams.tableName, false)
    .then(function(tableRecs) {
    $scope.tableRecs = tableRecs;
    $ionicLoading.hide();
  }, function(reason) {
    console.error('promise returned error -> ' + reason);
  });

  $scope.getItemHeight = function(item, index) {
    return (typeof(item) != "undefined")  ? 100 + item.length*55 : 0;
  };
}])


/*
---------------------------------------------------------------------------
  Deploy Control
---------------------------------------------------------------------------
*/
.controller('DeployCtrl', ['$scope', '$rootScope', 'DeployService', function($scope, $rootScope, DeployService) {

  function iconForErr(errType) {
    switch(errType) {
        case 'info':
            return 'ion-information-circled';
        default:
            return 'ion-close-round';
    }
  }

  var messages = [{message : 'Uploading bundle...', type : ''}];
  var appConfig = {};

  $scope.messages = messages;

  DeployService.getDetails().then(function(data){
    //console.log('data', data);
    appConfig = data;
    return DeployService.deployBunlde(appConfig);
  }).then(function(res){
    console.dir(res);
    var msg = {message : res, type : 'ok', icon : "ion-checkmark-round"};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      msg = {message : 'Uploading cache manifest...', type : ''};
      $scope.messages.push(msg);
    });
    return DeployService.uploadCachePage(appConfig);
  }).then(function(res){
    console.dir(res);
    var msg = {message : res, type : 'ok', icon : "ion-checkmark-round"};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      msg = {message : 'Uploading start page...', type : ''};
      $scope.messages.push(msg);
    });
    return DeployService.uploadStartPage(appConfig);
  }).then(function(res){
    console.dir(res);
    var msg = {message : res, type : 'ok', icon : "ion-checkmark-round"};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      msg = {message : 'Deploy Completed successfully.', type : 'final'};
      $scope.messages.push(msg);
    });
  }).catch(function(err){
    var msg = {message : err.message, type : err.type,  icon : iconForErr(err.type)};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      if (err.type != 'error') {
         msg = {message : 'Deploy Completed successfully.', type : 'final'};
        $scope.messages.push(msg);
      }
    });
    //console.log(err);
  });
}])

/*
===========================================================================
  D I R E C T I V E S
===========================================================================
*/

// hide-tabs
// Usage: add hide-tabs to ion-view on page you want to hide tabs.
// (tabsMain.html references $rootScope.hideTabs)
.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function($scope, $el) {
          $rootScope.hideTabs = 'tabs-item-hide';
          $scope.$on('$destroy', function() {
            $rootScope.hideTabs = '';
          });
      }
  };
})
;