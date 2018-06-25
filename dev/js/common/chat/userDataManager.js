var userDataManager =  (function () {
    function UserDataManager () {
    }

    // INCLUDE

    //= ../serviceFunctions/getCurrentDate.js
    //= ../serviceFunctions/createMessageObject.js

    // INCLUDE

    UserDataManager.prototype.setup = function setup (configObj) {
        this.config = configObj;
        messageListManager.setup(configObj);
    };

    UserDataManager.prototype.getUserData = function getUserData (userId) {
        var that = this;
        return dataSource.usersAPI.getUserData(userId).then(function (data) {
            that.config.currentUserSettings.userName = data.userName;
            that.config.currentUserSettings.isMinimize = data.isMinimize;
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

    // include
    UserDataManager.prototype.createNewUserProfileToDataBase = function () {
        var that = this;
        Object.keys(this.config.currentUserSettings).map(function (key) {
            that.saveSettingField(key);
        });
    };
    // include

    UserDataManager.prototype.saveSettingField = function setField (fieldName) {
        var that = this;
        this.saveUserSettingsToDataSource(
            [
                {
                    userId: that.config.currentUserSettings.userId,
                    fieldName: fieldName,
                    fieldValue: that.config.currentUserSettings[fieldName]
                }
            ]
        )
    };

    UserDataManager.prototype.sendMessage = function sendMessage (senderName) {
        var message = this.getMessageFromInputElement();
        var date = getCurrentDate();
        var messageObject = createMessageObject(message, date, senderName, false);
        messageListManager.addMessageToMessageList(messageObject);
        this.saveMessageToDataSource(messageObject);
    };

    UserDataManager.prototype.getMessageFromInputElement = function () {
        var element = getElement(this.config.CSS_CURRENT_INPUT_CLASS);
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
        if(messageObject.sender === this.config.currentUserSettings.userName) {
            console.log(messageObject.sender);
            var userSettings = [{
                userId: this.config.currentUserSettings.userId,
                fieldName: "sendNewMessage",
                fieldValue: true
            }];
            this.saveUserSettingsToDataSource(
                userSettings
            );
        }
        dataSource.usersAPI.sendMessage(
            this.config.currentUserSettings.userId,
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

})();