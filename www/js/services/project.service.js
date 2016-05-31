/**
 * Created by Sani Yusuf on 10/05/2016.
 */

angular
    .module('starter.services')
    .factory('ProjectService', ProjectService);

ProjectService.$inject = ['$q', 'devUtils', '_', 'logger'];

function ProjectService($q, devUtils, _, logger) {
    var getProjectsFromSmartStorePromise = $q.defer(),
        getProjectFromSmartSqlPromise = $q.defer(),
        getProjectSummaryPromise = $q.defer(),
        getProjectSqlQuery, getProjectExpensesQuery,
        projectsTableName = 'MC_Project__ap', projectExpensesTableName = "MC_Time_Expense__ap";

    var projectService = {
        getAllProjects: getAllProjects,
        getProjectDetail: getProjectDetail,
        getProjectSummary: getProjectSummary
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

    function getProjectSummary(projectID) {
        var projectTimeTotal = 0;
        var projectExpensesTotal = 0;
        var timeAndExpenseProjects;

        getProjectExpensesQuery =
            "SELECT * FROM {" + projectExpensesTableName + "} " +
            "WHERE {" + projectExpensesTableName + ":mobilecaddy1__Project__c} = '" + projectID + "';";
        logger.log('Get Time & Expenses Total Smart SQL Query -> ', getProjectSqlQuery);

        return devUtils.smartSql(getProjectExpensesQuery)
            .then(function (timeAndExpenseProjectsSuccessResponse) {
                if(!timeAndExpenseProjectsSuccessResponse.records.length || timeAndExpenseProjectsSuccessResponse.records.length < 1){
                    getProjectSummaryPromise.resolve({
                        projectTimeTotal: projectTimeTotal,
                        projectExpensesTotal: projectExpensesTotal
                    });

                    return getProjectSummaryPromise.promise;
                }

                timeAndExpenseProjects = _.where(
                    timeAndExpenseProjectsSuccessResponse.records,
                    {'mobilecaddy1__Project__c': projectId}
                );

                angular.forEach(function (timeAndExpenseProject) {
                    if (!isNullOrUndefined(timeAndExpenseProject.mobilecaddy1__Duration_Minutes__c)){
                        projectTimeTotal += timeAndExpenseProject.mobilecaddy1__Duration_Minutes__c;
                    }

                    if (!isNullOrUndefined(timeAndExpenseProject.mobilecaddy1__Expense_Amount__c)){
                        projectExpensesTotal += timeAndExpenseProject.mobilecaddy1__Expense_Amount__c;
                    }
                });

                getProjectSummaryPromise.resolve({
                    projectTimeTotal: projectTimeTotal,
                    projectExpensesTotal: projectExpensesTotal
                });
                return getProjectSummaryPromise.promise;

            }, function (timeAndExpenseProjectsFailureResponse) {
                getProjectSummaryPromise.reject(timeAndExpenseProjectsFailureResponse);
                return getProjectSummaryPromise.promise;
            });

    }

    function getProjectDetail(projectID) {
        getProjectSqlQuery =
            "SELECT * FROM {" + projectsTableName + "} " +
            "WHERE {" + projectsTableName + ":Id} = '" + projectID + "';";
        logger.log('Get Projects Smart SQL Query -> ', getProjectSqlQuery);
        return devUtils.smartSql(getProjectSqlQuery)
            .then(function (projectSuccessResponse) {
                return getProjectSummary(projectID)
                    .then(function (projectSummary) {
                        projectSuccessResponse.records[0].projectTotals = projectSummary;
                        getProjectFromSmartSqlPromise.resolve(projectSuccessResponse.records[0]);
                        return getProjectFromSmartSqlPromise.promise;

                    }, function (projectSummaryFailureResponse) {
                        getProjectFromSmartSqlPromise.reject(projectSummaryFailureResponse);
                        return getProjectFromSmartSqlPromise.promise;
                    });

            }, function (projectFailureResponse) {
                getProjectFromSmartSqlPromise.reject(projectFailureResponse);
                return getProjectFromSmartSqlPromise.promise;
            });
    }

    function isNullOrUndefined(variableToBeChecked) {
        return variableToBeChecked === null || typeof variableToBeChecked === 'undefined';
    }

}

