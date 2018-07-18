/* exported dataSource */
/* global mainConfig */
/* global dataBaseUrl */
/* global dataConnector */
// Модуль для получения данных
// Все API функции возвращают промисы
var dataSource = (function createDataSource (dataConnector, config) {
    var dataSourceInstance;
    var USER_LIST = "userList";
    var USER_MESSAGES = "usersMessages";
    var USERS_SETTINGS = "usersSettings";
    var newUserData = {
        isMinimize: false,
        readLastMessage: true
    };

    function DataSource() {}

    function longPollConnect (dataType, userId) {
        var requestPath = this.createRequestPath(dataBaseUrl, userId, null, dataType);
        return dataConnector.createLongPollConnection(requestPath);
    }

    function basicConnect (dataType, userId) {
        var requestPath = this.createRequestPath(dataBaseUrl, userId, null, dataType);
        return dataConnector.request.bind(null, requestPath, null, "GET", "application/json")
    }

    DataSource.prototype.createRequestPath = function createRequestPath(
        dataBaseURL,
        userId,
        requestPostfix,
        requestPrefix
    ) {
        var path = dataBaseURL;
        if(requestPrefix !== null) {
            path += "/" + requestPrefix
        }
        if (userId !== null) {
            path += "/" + userId;
        }
        if (requestPostfix !== null) {
            path += "/" + requestPostfix;
        }
        path += ".json";
        return path;
    };

    DataSource.prototype.getHTML = function getHTML (requestPath) {
        return dataConnector.request(
            requestPath,
            null,
            "GET", 'application/x-www-form-urlencoded; charset=UTF-8'
        );
    };


    DataSource.prototype.setData = function setData (dataType, requestType, fieldName, userId, value) {
        var requestPath;
        if(requestType === "PUT") {
            requestPath = this.createRequestPath(dataBaseUrl, userId, fieldName, dataType);
        } else {
            requestPath = this.createRequestPath(dataBaseUrl, userId, null, dataType);
        }
        return dataConnector.request(
            requestPath,
            JSON.stringify(value),
            requestType,
            "application/json"
        );
    };

    DataSource.prototype.addNewUserToDataSource = function addNewUserToDataSource (userId, userName) {
        var date = new Date;
        var that = this;
        newUserData.userName = userName;
        Object.keys(newUserData).map(function addNewSettings (settingName) {
            that.setData(USERS_SETTINGS, "PUT", settingName, userId, newUserData[settingName]);
            return true;
        });
        this.setData(USER_LIST, "PUT", null, userId, {"lastOnline": date.getTime(), "sendNewMessage": false});
    };

    DataSource.prototype.getDataSourceAPI = function getDataSourceAPI (typeOfRequest) {
        if(typeOfRequest) {
            config.chatSettings.typeOfRequest = typeOfRequest;
        }
        if(config.chatSettings.typeOfRequest === "longPoll") {
            DataSource.prototype.getData = longPollConnect
        } else {
            DataSource.prototype.getData = basicConnect
        }
        return {
            usersAPI: {
                getUserList: dataSourceInstance.getData.bind(
                    dataSourceInstance,
                    USER_LIST
                ),
                getUserSettings: dataSourceInstance.getData.bind(
                    dataSourceInstance,
                    USERS_SETTINGS
                ),
                getUserMessages: dataSourceInstance.getData.bind(
                    dataSourceInstance,
                    USER_MESSAGES
                ),
                getSettingField: dataSourceInstance.getData.bind(
                    dataSourceInstance,
                    USERS_SETTINGS
                ),
                sendMessage: dataSourceInstance.setData.bind(
                    dataSourceInstance,
                    USER_MESSAGES,
                    "POST"

                ),
                setSettingField: dataSourceInstance.setData.bind(
                    dataSourceInstance,
                    USERS_SETTINGS,
                    "PUT"
                ),
                addNewUserToDataSource: dataSourceInstance.addNewUserToDataSource.bind(
                    dataSourceInstance
                ),
                updateLastOnline: dataSourceInstance.setData.bind(
                    dataSourceInstance,
                    USER_LIST,
                    "PUT",
                    "lastOnline"
                ),
                updateSendNewMessageFlag: dataSourceInstance.setData.bind(
                    dataSourceInstance,
                    USER_LIST,
                    "PUT",
                    "sendNewMessage"
                ),
                updateMessageIsReadField: dataSourceInstance.setData.bind(
                    dataSourceInstance,
                    USER_MESSAGES,
                    "PUT"
                )
            },
            commonAPI: {
                getHTML: dataSourceInstance.getHTML.bind(dataSourceInstance),
                getDataSourceAPI: dataSourceInstance.getDataSourceAPI.bind(dataSourceInstance)
            }
        };
    };

    // Создаем instance объекта, задаем API
    dataSourceInstance = new DataSource();



    return dataSourceInstance.getDataSourceAPI();
})(dataConnector, mainConfig);
