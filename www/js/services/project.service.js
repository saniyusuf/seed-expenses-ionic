/**
 * Created by Sani Yusuf on 10/05/2016.
 */

(function () {
    'use strict';

    angular
        .module('starter.services')
        .factory('ProjectService', ProjectService);

    ProjectService.$inject = ['$q', 'devUtils', '_', 'logger', 'SyncService', 'PROJECTS_TABLE_NAME', 'PROJECT_EXPENSES_TABLE_NAME', 'PROJECT_LOCATION_TABLE_NAME' ];

    function ProjectService($q, devUtils, _, logger, SyncService, PROJECTS_TABLE_NAME, PROJECT_EXPENSES_TABLE_NAME, PROJECT_LOCATION_TABLE_NAME) {
        var getProjectSqlQuery,
            getProjectExpensesSqlQuery,
            getProjectLocationSqlQuery;

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
                    return $q.resolve(projectsRecordsSuccessResponse.records);

                }, function (projectsRecordsFailureResponse) {
                    return $q.reject(projectsRecordsFailureResponse);
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
                        return $q.resolve({
                            projectTimeTotal: projectTimeTotal,
                            projectExpensesTotal: projectExpensesTotal
                        });

                    }

                    timeAndExpenseProjects = _.where(
                        timeAndExpenseProjectsSuccessResponse.records,
                        {'mobilecaddy1__Project__c': projectID}
                    );

                    angular.forEach(timeAndExpenseProjects, function (timeAndExpenseProject) {
                        if (!isNullOrUndefined(timeAndExpenseProject.mobilecaddy1__Duration_Minutes__c)){
                            projectTimeTotal += parseFloat(timeAndExpenseProject.mobilecaddy1__Duration_Minutes__c);
                        }

                        if (!isNullOrUndefined(timeAndExpenseProject.mobilecaddy1__Expense_Amount__c)){
                            projectExpensesTotal += parseFloat(timeAndExpenseProject.mobilecaddy1__Expense_Amount__c);
                        }
                    });

                    return $q.resolve({
                        projectTimeTotal: projectTimeTotal,
                        projectExpensesTotal: projectExpensesTotal
                    });

                }, function (timeAndExpenseProjectsFailureResponse) {
                    return $q.reject(timeAndExpenseProjectsFailureResponse);
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
                    return $q.resolve(projectSuccessResponse.records[0]);

                }, function (projectFailureResponse) {
                    return  $q.reject(projectFailureResponse);
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
                    return $q.resolve(projectLocationSuccessResponse.records[0]);

                }, function (projectLocationFailureResponse) {
                    logger.log('Failed To Get Project Location -> ', projectLocationFailureResponse);
                    return $q.reject(projectLocationFailureResponse);
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

                    return $q.resolve(fullProjectDetails);

                }, function (fullProjectDetailFailureResponse) {
                    return $q.reject(fullProjectDetailFailureResponse);
                });
        }

        function isNullOrUndefined(variableToBeChecked) {
            return variableToBeChecked === null || typeof variableToBeChecked === 'undefined';
        }

        function createNewExpenseOrTimeLog(newExpense) {
            return devUtils.insertRecord(PROJECT_EXPENSES_TABLE_NAME, newExpense)
                .then(function (createNewExpenseSuccessResponse) {
                    SyncService.syncTables([{
                        Name : PROJECT_EXPENSES_TABLE_NAME,
                        syncWithoutLocalUpdates: true,
                        maxTableAge: 1000 * 60 * 60
                    }]);
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
            return devUtils.updateRecord(PROJECTS_TABLE_NAME, projectDetails, 'Id')
                .then(function (updateProjectDetailsSuccessResponse) {
                    SyncService.syncTables([{
                        Name : PROJECT_EXPENSES_TABLE_NAME,
                        syncWithoutLocalUpdates: true,
                        maxTableAge: 1000 * 60 * 60
                    }]);
                    return $q.resolve(updateProjectDetailsSuccessResponse);

                }, function (updateProjectDetailsFailureResponse) {
                    return $q.reject(updateProjectDetailsFailureResponse);
                });
        }

        function updateExpenseOrTimeLog(expenseOrTimeLog) {
            return devUtils.updateRecord(PROJECT_EXPENSES_TABLE_NAME, expenseOrTimeLog, 'Id')
                .then(function (updateExpenseOrTimeLogSuccessResponse) {
                    SyncService.syncTables([{
                        Name : PROJECT_EXPENSES_TABLE_NAME,
                        syncWithoutLocalUpdates: true,
                        maxTableAge: 1000 * 60 * 60
                    }]);
                    return $q.resolve(updateExpenseOrTimeLogSuccessResponse);

                }, function (updateExpenseOrTimeLogFailureResponse) {
                   return $q.reject(updateExpenseOrTimeLogFailureResponse);
                });
        }

    }

})();

