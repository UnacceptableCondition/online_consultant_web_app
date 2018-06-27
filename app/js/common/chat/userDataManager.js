var userDataManager =  (function (config) {
    function UserDataManager () {
    }

    // INCLUDE

    //= ../serviceFunctions/getCurrentDate.js
    //= ../serviceFunctions/createMessageObject.js

    // INCLUDE

    UserDataManager.prototype.setup = function setup () {
        messageListManager.setup();
    };

    UserDataManager.prototype.getUserData = function getUserData (userId) {
        return dataSource.usersAPI.getUserData(userId).then(function (data) {
            config.currentUserSettings.userName = data.userName;
            config.currentUserSettings.isMinimize = data.isMinimize;
            if(data.messages) {
                var newMessageList;
                var messagesObject = [];
                Object.keys(data.messages).map(function (message) {
                    messagesObject.push(createMessageObject(
                        data.messages[message].message,
                        data.messages[message].date,
                        data.messages[message].user,
                        data.messages[message].itIsRead,
                        message
                    ));
                });
                newMessageList = messageListManager.createMessageList(messagesObject);
                messageListManager.updateMessageList(newMessageList);
            }
        });
    };

    UserDataManager.prototype.createNewUserProfileToDataBase = function () {
        var that = this;
        Object.keys(config.currentUserSettings).map(function (key) {
            that.saveSettingField(key);
        });
    };

    UserDataManager.prototype.saveSettingField = function setField (fieldName) {
        this.saveUserSettingsToDataSource(
            [
                {
                    userId: config.currentUserSettings.userId,
                    fieldName: fieldName,
                    fieldValue: config.currentUserSettings[fieldName]
                }
            ]
        )
    };

    UserDataManager.prototype.sendMessage = function sendMessage (senderName) {
        var message = this.getMessageFromInputElement();
        var date = getCurrentDate();
        var messageObject = createMessageObject(message, date, senderName, false);
        messageListManager.addMessageToMessageList(messageObject);
        messageListManager.displayMessages();
        this.saveMessageToDataSource(messageObject);
    };

    UserDataManager.prototype.getMessageFromInputElement = function () {
        var element = getElement(config.CSS_CURRENT_INPUT_CLASS);
        var value = element.value;
        element.value = "";
        return value;
    };

    UserDataManager.prototype.setMessageAsRead = function setMessageAsRead () {
        var messageObjects = messageListManager.getMessageObjectsForMarkAsRead();
        if(messageObjects.length > 0) {
            this.saveUserSettingsToDataSource(messageObjects);
        }
    };



    UserDataManager.prototype.saveMessageToDataSource = function saveMessageToDataSource (messageObject) {
        if(messageObject.sender === config.currentUserSettings.userName) {
            var userSettings = [{
                userId: config.currentUserSettings.userId,
                fieldName: "sendNewMessage",
                fieldValue: true
            }];
            this.saveUserSettingsToDataSource(
                userSettings
            );
        }
        dataSource.usersAPI.sendMessage(
            config.currentUserSettings.userId,
            messageObject
        );
    };

    // Settings = [{userId, fieldName, fieldValue},{}...]
    UserDataManager.prototype.saveUserSettingsToDataSource = function (settings) {
        settings.forEach(function (newFieldSetting) {
            dataSource.usersAPI.setField(
                newFieldSetting.userId,
                newFieldSetting.fieldName,
                newFieldSetting.fieldValue
            );
        });
    };


    return new UserDataManager();

})(mainConfig);