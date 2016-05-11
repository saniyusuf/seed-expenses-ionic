/**
 * Created by Sani Yusuf on 10/05/2016.
 */

angular
    .module('starter.services')
    .factory('ProjectService', ProjectService);

ProjectService.$inject = ['$q', '_', 'devUtils', 'logger'];

function ProjectService($q, _, devUtils, logger) {
    var getProjectsFromSmartStorePromise = $q.defer(), getProjectFromSmartSqlPromise = $q.defer(),
        getProjectSqlQuery,
        projectsTableName = 'MC_Project__ap';

    var projectService = {
        getAllProjects: getAllProjects,
        getProject: getProject
    };

    return projectService;

    function getAllProjects() {
        return devUtils.readRecords(projectsTableName, [])
            .then(function (projectsRecordsSuccessResponse) {
                logger.log('Successfully Got All Projects From Smart Store: -> ', projectsRecordsSuccessResponse.records);
                getProjectsFromSmartStorePromise.resolve(projectsRecordsSuccessResponse.records);
                return getProjectsFromSmartStorePromise.promise;

            }, function (projectsRecordsFailureResponse) {
                logger.log('Failed To Get All Projects From Smart Store: Reason -> ', projectsRecordsFailureResponse);
                getProjectsFromSmartStorePromise.reject(projectsRecordsFailureResponse);
                return getProjectsFromSmartStorePromise.promise;
            });
    }

    function getProject(projectID) {
        getProjectSqlQuery =
            'SELECT * FROM {' + projectsTableName + '} as project ' +
            'WHERE project.{' + projectsTableName +':Id} = ' + projectID + ';';
        return devUtils.smartSql(getProjectSqlQuery)
            .then(function (projectSuccessResponse) {
                logger.log('Successfully Got Project With Smart Sql: ', projectSuccessResponse.records);
                getProjectFromSmartSqlPromise.resolve(projectSuccessResponse.records);
                return getProjectFromSmartSqlPromise.promise;

            }, function (projectFailureResponse) {
                logger.log('Failed To Get Project With Smart SQL: Reason -> ', projectFailureResponse);
                getProjectFromSmartSqlPromise.reject(projectFailureResponse);
                return getProjectFromSmartSqlPromise.promise;
            });
    }

}

