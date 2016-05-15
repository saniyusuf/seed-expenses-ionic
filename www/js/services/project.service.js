/**
 * Created by Sani Yusuf on 10/05/2016.
 */

angular
    .module('starter.services')
    .factory('ProjectService', ProjectService);

ProjectService.$inject = ['$q', 'devUtils'];

function ProjectService($q, devUtils) {
    var getProjectsFromSmartStorePromise = $q.defer(), getProjectFromSmartSqlPromise = $q.defer(),
        getProjectSqlQuery,
        projectsTableName = 'MC_Project__ap';

    var projectService = {
        getAllProjects: getAllProjects,
        getProjectDetail: getProjectDetail
    };

    return projectService;

    function getAllProjects() {
        return devUtils.readRecords(projectsTableName, [])
            .then(function (projectsRecordsSuccessResponse) {
                getProjectsFromSmartStorePromise.resolve(projectsRecordsSuccessResponse.records);
                return getProjectsFromSmartStorePromise.promise;

            }, function (projectsRecordsFailureResponse) {
                getProjectsFromSmartStorePromise.reject(projectsRecordsFailureResponse);
                return getProjectsFromSmartStorePromise.promise;
            });
    }

    function getProjectDetail(projectID) {
        getProjectSqlQuery =
            "SELECT * FROM {" + projectsTableName + "} " +
            "WHERE {" + projectsTableName + ":Id} = '" + projectID + "';";
        console.log('Query -> ', getProjectSqlQuery);
        return devUtils.smartSql(getProjectSqlQuery)
            .then(function (projectSuccessResponse) {
                getProjectFromSmartSqlPromise.resolve(projectSuccessResponse.records);
                return getProjectFromSmartSqlPromise.promise;

            }, function (projectFailureResponse) {
                getProjectFromSmartSqlPromise.reject(projectFailureResponse);
                return getProjectFromSmartSqlPromise.promise;
            });
    }

}

