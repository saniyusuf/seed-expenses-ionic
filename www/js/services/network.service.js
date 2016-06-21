/**
 * Network Factory
 *
 * @description Handles network events (online/offline) and kicks off tasks if needed
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('NetworkService', NetworkService);

  NetworkService.$inject = ['$rootScope', 'SyncService', 'logger', 'devUtils', 'PROJECTS_TABLE_NAME', 'PROJECT_EXPENSES_TABLE_NAME', 'PROJECT_LOCATION_TABLE_NAME', 'FEEDBACK_TABLE_NAME'];

  function NetworkService($rootScope, SyncService, logger, devUtils, PROJECTS_TABLE_NAME, PROJECT_EXPENSES_TABLE_NAME, PROJECT_LOCATION_TABLE_NAME, FEEDBACK_TABLE_NAME) {

  	return {
	    networkEvent: networkEvent,

      getNetworkStatus: getNetworkStatus,

      setNetworkStatus: setNetworkStatus
	  };

	  function networkEvent(status){
      var pastStatus = localStorage.getItem('networkStatus');
      if (status == "online" && pastStatus != status) {
        // You could put some actions in here that you want to take place when
        // your app regains connectivity. For example see the Mobile Seed Apps
        // If you don't need this then you can ignore this. e.g.
        // SyncService.syncTables(['Table_x__ap', 'Table_y__ap'], true);
        //
        // TODO (TH) Are we doing this, I've not looked at the flows at the time of writing?

          devUtils.dirtyTables()
              .then(function (dirtyTableNames) {
                  if(dirtyTableNames.length > 0){
                      var dirtyTablesToBeSynced = [];
                      angular.forEach(dirtyTableNames, function (dirtyTableName) {
                          switch (dirtyTableName){
                              case PROJECTS_TABLE_NAME:
                                  dirtyTablesToBeSynced.push({
                                      Name: PROJECTS_TABLE_NAME,
                                      syncWithoutLocalUpdates: true,
                                      maxTableAge: 1000 * 60 * 60
                                  });
                                  break;

                              case PROJECT_EXPENSES_TABLE_NAME:
                                  dirtyTablesToBeSynced.push({
                                      Name: PROJECT_EXPENSES_TABLE_NAME,
                                      syncWithoutLocalUpdates: true,
                                      maxTableAge: 1000 * 60 * 60
                                  });
                                  break;

                              case PROJECT_LOCATION_TABLE_NAME:
                                  dirtyTablesToBeSynced.push({
                                      Name: PROJECT_EXPENSES_TABLE_NAME,
                                      syncWithoutLocalUpdates: true,
                                      maxTableAge: 4 * 1000 * 60 * 60
                                  });
                                  break;

                              default:
                                  dirtyTablesToBeSynced.push({
                                      Name: dirtyTableName,
                                      syncWithoutLocalUpdates: true,
                                      maxTableAge: 1000 * 60 * 60
                                  });
                                  break;

                          }
                      });

                      SyncService.syncTables(dirtyTablesToBeSynced);
                  }
              });
      }

      if (pastStatus != status) {
        $rootScope.$emit('networkState', {state : status});
      }
      localStorage.setItem('networkStatus', status);
      logger.log("NetworkService " + status);
      return true;
    }

   	function getNetworkStatus() {
      return localStorage.getItem('networkStatus');
    }

    function setNetworkStatus(status) {
	      localStorage.setItem('networkStatus', status);
     }

  }

})();