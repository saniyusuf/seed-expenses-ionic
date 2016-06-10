/**
 * Created by Sani Yusuf on 10/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('ProjectService', ProjectService);

    ProjectService.$inject = ['$q', 'devUtils', '_', 'logger', 'SyncService'];

    function ProjectService($q, devUtils, _, logger, SyncService) {
        var getAllProjectsFromSmartStorePromise = $q.defer(),
            getProjectDetailsFromSmartStorePromise = $q.defer(),
            getProjectSummaryFromSmartStorePromise = $q.defer(),
            getProjectLocationFromSmartStorePromise = $q.defer(),
            getAllProjectDetailsFromSmartStorePromise = $q.defer(),
            getProjectSqlQuery,
            getProjectExpensesSqlQuery,
            getProjectLocationSqlQuery,
            PROJECTS_TABLE_NAME = 'MC_Project__ap',
            PROJECT_EXPENSES_TABLE_NAME = "MC_Time_Expense__ap",
            PROJECT_LOCATION_TABLE_NAME = "MC_Project_Location__ap";

        var projectService = {
            getAllProjects: getAllProjects,
            getFullProjectDetails: getFullProjectDetails,
            createNewExpenseOrTimeLog: createNewExpenseOrTimeLog,
            getAllExpenses: getAllExpenses,
            getAllTimeLogs: getAllTimeLogs,
            updateProjectDetails: updateProjectDetails,
            updateExpenseOrTimeLog: updateExpenseOrTimeLog
        };

        return projectService;

        function getAllProjects() {
            return devUtils.readRecords(PROJECTS_TABLE_NAME, [])
                .then(function (projectsRecordsSuccessResponse) {
                    getAllProjectsFromSmartStorePromise.resolve(projectsRecordsSuccessResponse.records);
                    return getAllProjectsFromSmartStorePromise.promise;

                }, function (projectsRecordsFailureResponse) {
                    getAllProjectsFromSmartStorePromise.reject(projectsRecordsFailureResponse);
                    return getAllProjectsFromSmartStorePromise.promise;
                });
        }

        function getProjectSummary(projectID) {
            var projectTimeTotal = 0;
            var projectExpensesTotal = 0;
            var timeAndExpenseProjects;

            getProjectExpensesSqlQuery =
                "SELECT * FROM {" + PROJECT_EXPENSES_TABLE_NAME + "} " +
                "WHERE {" + PROJECT_EXPENSES_TABLE_NAME + ":mobilecaddy1__Project__c} = '" + projectID + "';";
            logger.log('Get Time & Expenses Total Smart SQL Query -> ', getProjectSqlQuery);

            return devUtils.smartSql(getProjectExpensesSqlQuery)
                .then(function (timeAndExpenseProjectsSuccessResponse) {
                    if(!timeAndExpenseProjectsSuccessResponse.records.length || timeAndExpenseProjectsSuccessResponse.records.length < 1){
                        getProjectSummaryFromSmartStorePromise.resolve({
                            projectTimeTotal: projectTimeTotal,
                            projectExpensesTotal: projectExpensesTotal
                        });

                        return getProjectSummaryFromSmartStorePromise.promise;
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

                    getProjectSummaryFromSmartStorePromise.resolve({
                        projectTimeTotal: projectTimeTotal,
                        projectExpensesTotal: projectExpensesTotal
                    });
                    return getProjectSummaryFromSmartStorePromise.promise;

                }, function (timeAndExpenseProjectsFailureResponse) {
                    getProjectSummaryFromSmartStorePromise.reject(timeAndExpenseProjectsFailureResponse);
                    return getProjectSummaryFromSmartStorePromise.promise;
                });

        }

        function getProjectDetail(projectID) {
            getProjectSqlQuery =
                "SELECT * FROM {" + PROJECTS_TABLE_NAME + "} " +
                "WHERE {" + PROJECTS_TABLE_NAME + ":Id} = '" + projectID + "';";
            logger.log('Get Projects Smart SQL Query -> ', getProjectSqlQuery);
            return devUtils.smartSql(getProjectSqlQuery)
                .then(function (projectSuccessResponse) {
                    logger.log('Successfully Got Project Detail -> ', projectSuccessResponse.records[0]);
                    getProjectDetailsFromSmartStorePromise.resolve(projectSuccessResponse.records[0]);
                    return getProjectDetailsFromSmartStorePromise.promise;

                }, function (projectFailureResponse) {
                    getProjectDetailsFromSmartStorePromise.reject(projectFailureResponse);
                    return getProjectDetailsFromSmartStorePromise.promise;
                });
        }

        function getProjectLocation(projectLocationID){
            getProjectLocationSqlQuery =
                "SELECT * FROM {" + PROJECT_LOCATION_TABLE_NAME + "} " +
                "WHERE {" + PROJECT_LOCATION_TABLE_NAME + ":Id} = '" + projectLocationID + "';";
            logger.log('Get Project Location SQL Query -> ', getProjectLocationSqlQuery);

            return devUtils.smartSql(getProjectLocationSqlQuery)
                .then(function (projectLocationSuccessResponse) {
                    logger.log('Project Location Successfully Gotten -> ', projectLocationSuccessResponse.records[0]);
                    getProjectLocationFromSmartStorePromise.resolve(projectLocationSuccessResponse.records[0]);
                    return getProjectLocationFromSmartStorePromise.promise;

                }, function (projectLocationFailureResponse) {
                    logger.log('Failed To Get Project Location -> ', projectLocationFailureResponse);
                    getProjectLocationFromSmartStorePromise.reject(projectLocationFailureResponse);
                    return getProjectLocationFromSmartStorePromise.promise;
                });
        }

        function getFullProjectDetails(projectID, projectLocationID) {
            var projectPromises = {
                projectDetailPromise: getProjectDetail(projectID),
                projectSummaryPromise: getProjectSummary(projectID),
                projectLocationPromise: getProjectLocation(projectLocationID)
            };
            return $q.all(projectPromises)
                .then(function (fullProjectDetailsSuccessResponse) {
                    var fullProjectDetails = {};
                    fullProjectDetails.projectDetails = fullProjectDetailsSuccessResponse.projectDetailPromise;
                    fullProjectDetails.projectSummary = fullProjectDetailsSuccessResponse.projectSummaryPromise;
                    fullProjectDetails.projectLocation = fullProjectDetailsSuccessResponse.projectLocationPromise;

                    logger.log('Got Full Project Details -> ', fullProjectDetails);
                    getAllProjectDetailsFromSmartStorePromise.resolve(fullProjectDetails);
                    return getAllProjectDetailsFromSmartStorePromise.promise;

                }, function () {
                    getAllProjectDetailsFromSmartStorePromise.reject('Failed To Get All Project Details');
                    return getAllProjectDetailsFromSmartStorePromise.promise;
                });
        }

        function isNullOrUndefined(variableToBeChecked) {
            return variableToBeChecked === null || typeof variableToBeChecked === 'undefined';
        }

        function createNewExpenseOrTimeLog(newExpense) {
            return devUtils.insertRecord(PROJECT_EXPENSES_TABLE_NAME, newExpense)
                .then(function (createNewExpenseSuccessResponse) {
                    SyncService.syncTables([PROJECT_EXPENSES_TABLE_NAME], true, 1000 * 60 * 60);
                    return $q.resolve(createNewExpenseSuccessResponse);

                }, function (createNewExpensesFailureResponse) {
                    return $q.reject(createNewExpensesFailureResponse);
                });
        }

        function getAllExpenses(projectID) {
            return devUtils.readRecords(PROJECT_EXPENSES_TABLE_NAME, [])
                .then(function (allExpensesSuccessResponse) {
                    var allExpenses = [];
                    angular.forEach(allExpensesSuccessResponse.records, function (expense) {
                        if(!isNullOrUndefined(expense.mobilecaddy1__Expense_Amount__c) && expense.mobilecaddy1__Project__c == projectID){
                            allExpenses.push(expense);
                        }
                    });
                    return $q.resolve(allExpenses);

                }, function (allExpensesFailureResponse) {
                    return $q.reject(allExpensesFailureResponse);
                });
        }

        function getAllTimeLogs(projectID) {
            return devUtils.readRecords(PROJECT_EXPENSES_TABLE_NAME, [])
                .then(function (allTimeLogsSuccessResponse) {
                    var allExpenses = [];
                    angular.forEach(allTimeLogsSuccessResponse.records, function (expense) {
                        if(!isNullOrUndefined(expense.mobilecaddy1__Duration_Minutes__c) && expense.mobilecaddy1__Project__c == projectID){
                            allExpenses.push(expense);
                        }
                    });
                    return $q.resolve(allExpenses);

                }, function (allTimeLogsFailureResponse) {
                    return $q.reject(allTimeLogsFailureResponse);
                });
        }

        function updateProjectDetails(projectDetails) {
            return devUtils.updateRecord(PROJECTS_TABLE_NAME, projectDetails, 'Id');
        }

        function updateExpenseOrTimeLog(expenseOrTimeLog) {
            return devUtils.updateRecord(PROJECT_EXPENSES_TABLE_NAME, expenseOrTimeLog, 'Id');
        }

    }

})();

