/**
 * Created by Sani Yusuf on 04/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['$scope', '$rootScope', '$ionicLoading', '$interval', '$timeout', 'ProjectService', 'SyncService', 'devUtils', '$log', 'logger'];

    function ProjectsController($scope, $rootScope, $ionicLoading, $interval, $timeout, ProjectService, SyncService, devUtils, $log, logger) {
        var vm = this;

        // This unhides the nav-bar. The navbar is hidden in the cases where we want a
        // splash screen, such as in this app
        var e = document.getElementById('my-nav-bar');
        angular.element(e).removeClass( "mc-hide" );

        // Set height of list scrollable area
        var winHeight = window.innerHeight - 125;
        var projectsList = document.getElementById('project-list');
        projectsList.setAttribute("style","height:" + winHeight + "px");

        // Get reference to refresh/sync button (so we can change text, disable etc)
        var storesSyncButton = document.getElementById('projects-sync-button');

        // Adjust width of list refresh/sync button (cater for multiple buttons on different pages)
        var syncButtons = document.getElementsByClassName('sync-button');

        vm.projectSearch = {
            searchTerm: ''
        };
        vm.refreshAndSyncProjects = refreshAndSyncProjects;
        vm.pullDownToRefreshProjects = pullDownToRefreshProjects;
        vm.checkIfSyncIsRequired = checkIfSyncIsRequired;

        if(SyncService.getSyncState() == 'Complete'){
            getAllProjectsAfterInitialSync();
        }else {
            $scope.$on('syncTables', function (event, args) {
                if(args.result == 'InitialLoadComplete'){
                    getAllProjectsAfterInitialSync();
                }
            });
        }

        function getAllProjectsAfterInitialSync() {
            $ionicLoading.show({
                duration: 30000,
                delay : 400,
                maxWidth: 600,
                noBackdrop: true,
                template: '<h1>Loading...</h1><p id="app-progress-msg" class="item-icon-left">Fetching Projects...<ion-spinner/></p>'
            });

            ProjectService.getAllProjects()
                .then(function(projects) {
                    vm.projects = projects;
                    $ionicLoading.hide();

                }, function(reason) {
                    logger.log('Failed To Get All projects : ', reason);
                    $ionicLoading.hide();
                });
        }

        var isSyncRequiredInterval = $interval(function() {
            vm.checkIfSyncIsRequired();
        }, (1000 * 60 * 3));

        function refreshAndSyncProjects() {
            $log.log('refreshAndSyncProjects');
            ProjectService.all(false)
                .then(function(projects) {
                    vm.projects = projects;
                    if (SyncService.getSyncState() != "Syncing") {
                        SyncService.syncTables(['MC_Project__ap', 'MC_Time_Expense__ap'], true);
                    }

                }, function(reason) {
                    $log.log('Failed To Refresh & Sync Projects: reason -> ' + reason);
                });
        }

        function pullDownToRefreshProjects() {
            $log.log('pullDownToRefreshProjects');
            ProjectService.all(true)
                .then(function(projects) {
                    vm.projects = projects;

                }, function(reason) {
                    $log.log('Failed To Refresh Projects After Pull Down: reason -> ' + reason);
            });
        }

        function checkIfSyncIsRequired() {
            $log.log("checkIfSyncRequired");
            // Any dirty tables to sync?
            devUtils.dirtyTables()
                .then(function(tables){
                    if (tables && tables.length !== 0) {
                        // Is the 'Refresh and Sync' enabled?
                        if (!angular.element(storesSyncButton).hasClass("disabled")) {
                            updateSyncButtonsText("Sync Required");
                            syncButtonsClass("Remove", "disabled");
                        }
                    }
            });
        }

        function updateSyncButtonsText(newText) {
            for (var i = syncButtons.length - 1; i >= 0; --i) {
                angular.element(syncButtons[i]).html(newText);
            }
        }

        function syncButtonsClass(action, className) {
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

        $scope.$on('destroy', onScopeDestroyed);

        $rootScope.$on('handleSyncTables', handleSyncTables);

        function onScopeDestroyed() {
            $interval.cancel(isSyncRequiredInterval);
            isSyncRequiredInterval = undefined;
        }

        function handleSyncTables(event, args) {
            $log.log("handleSyncTables called args", args);
            switch (args.result.toString()) {
                case "Sync" :
                    updateSyncButtonsText("Syncing...");
                    syncButtonsClass("Add", "disabled");
                    break;
                case "Complete" :
                    updateSyncButtonsText("Refresh and Sync");
                    syncButtonsClass("Remove", "disabled");
                    break;
                case "100497" :
                    updateSyncButtonsText("No device records to sync...");
                    syncButtonsClass("Remove", "disabled");
                    $timeout( function() {
                        updateSyncButtonsText("Refresh and Sync");
                    },5000);
                    break;
                case "100498" :
                    updateSyncButtonsText("Sync already in progress...");
                    syncButtonsClass("Remove", "disabled");
                    $timeout( function() {
                        updateSyncButtonsText("Refresh and Sync");
                    },5000);
                    break;
                case "100402" :
                    updateSyncButtonsText("Please connect before syncing");
                    syncButtonsClass("Remove", "disabled");
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
                    syncButtonsClass("Remove", "disabled");
            }
        }
    }

})();
