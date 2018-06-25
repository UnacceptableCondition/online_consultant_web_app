// Модуль для получения данных
// Все API функции возвращают промисы
var dataSource = (function createDataSource (dataConnector) {
    var dataSourceInstance;
    var dataSourceAPI;

    function DataSource() {
        dataConnector = dataConnector;
    }

    DataSource.prototype.createRequestPath = function createRequestPath(
        dataBaseURL,
        userId,
        requestPostfix
    ) {
        var path = dataBaseURL + "/users";
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

    // Работа с КОНКРЕТНЫМ юзером

    // Получить все сообщения и настройки пользователя
    DataSource.prototype.getUserData = function getUserData(userId) {
        var userData = {};
        var requestPath = this.createRequestPath(dataBaseUrl, userId, null);
        return dataConnector
            .request(requestPath, null, "GET", "application/json")
            .then(function setUserData(data) {
                if (data) {
                    Object.keys(data).map(function setData (key) {
                        userData[key] = data[key];
                        return true;
                    });
                }
            })
            .then(function returnUsersList() {
                return userData;
            });
    };

    // Получает опр поле настроек пользователя
    DataSource.prototype.getSettingField = function getAmountOfNoReadMessage(
        userId,
        fieldName
    ) {
        var requestPath = this.createRequestPath(dataBaseUrl, userId, fieldName);
        return dataConnector.request(
            requestPath,
            null,
            "GET",
            "application/json"
        );
    };

    // Устанавливает опр поле настроек пользователя
    DataSource.prototype.setSettingField = function getAmountOfNoReadMessage(
        userId,
        fieldName,
        value
    ) {
        var requestPath = this.createRequestPath(dataBaseUrl, userId, fieldName);
        return dataConnector.request(
            requestPath,
            JSON.stringify(value),
            "PUT",
            "application/json"
        );
    };

    // Отправить сообщение пользователю
    DataSource.prototype.sendMessage = function sendMessageToUser(
        userId,
        messageObject
    ) {
        var requestPath = this.createRequestPath(dataBaseUrl, userId, "messages");
        var jsonMessage = JSON.stringify(
            {
                date: messageObject.date,
                message: messageObject.message,
                title: "message",
                user: messageObject.sender,
                itIsRead: messageObject.read
            }
        );
        return dataConnector.request(
            requestPath,
            jsonMessage,
            "POST",
            "application/json"
        );
    };

    // Работа со ВСЕМИ юзерами

    // получить все данные, всех пользователей
    DataSource.prototype.getAllUsers = function getAllUsers() {
        var usersDataList = {};
        var requestPath = this.createRequestPath(dataBaseUrl, null, null);
        return dataConnector
            .request(requestPath, null, "GET", "application/json")
            .then(function setUsersList(data) {
                if (data) {
                    Object.keys(data).map(function setData(key) {
                        usersDataList[key] = data[key];
                        return true
                    });
                }
            })
            .then(function returnUsersList() {
                return usersDataList;
            });
    };

    // Создаем instance объекта, задаем API

    dataSourceInstance = new DataSource();
    dataSourceAPI = {
        usersAPI: {
            getUserData: dataSourceInstance.getUserData.bind(
                dataSourceInstance
            ),
            sendMessage: dataSourceInstance.sendMessage.bind(
                dataSourceInstance
            ),
            setField: dataSourceInstance.setSettingField.bind(
                dataSourceInstance
            ),
            getField: dataSourceInstance.getSettingField.bind(
                dataSourceInstance
            ),
            getAllUsers: dataSourceInstance.getAllUsers.bind(
                dataSourceInstance
            )
        },
        commonAPI: {
            getHTML: dataSourceInstance.getHTML.bind(dataSourceInstance)
        }
    };

    return dataSourceAPI;
})(dataConnector);
