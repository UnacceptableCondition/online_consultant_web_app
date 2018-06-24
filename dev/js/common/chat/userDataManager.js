var userDataManager =  (function () {
    function UserDataManager () {
    }

    // INCLUDE
    function getCurrentDate() {
        var date = new Date();
        var minutes = (date.getMinutes().toString().length === 1) ? "0" + date.getMinutes() : date.getMinutes();
        return date
            .getHours()
            .toString()
            .concat(":", minutes);
    }

    function createMessageObject (
        message,
        date,
        sender,
        isRead,
        id
    ) {
        return {
            sender: sender,
            message: message,
            read: isRead,
            date: date,
            id: id
        };
    }
    // INCLUDE

    UserDataManager.prototype.setup = function setup (configObj) {
        this.config = configObj;
        messageListManager.setup(configObj);
    };


    UserDataManager.prototype.getUserData = function getUserData () {
        var that = this;
        return dataSource.usersAPI.getUserData(this.config.currentUserSettings.userId).then(function (data) {
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

    UserDataManager.prototype.sendMessage = function sendMessage (senderName, senderId) {
        var message = this.getMessageFromInputElement();
        var date = getCurrentDate();
        var userName = senderName || this.config.currentUserSettings.userName;
        var userId = senderId || this.config.currentUserSettings.userId;
        var messageObject = createMessageObject(message, date, userName, false);
        messageListManager.addMessageToMessageList(messageObject);
        this.saveMessageToDataSource(userId, messageObject);
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


    UserDataManager.prototype.saveMessageToDataSource = function saveMessageToDataSource (senderId, messageObject) {
        var userSettings = [{
            userId: senderId,
            fieldName: "sendNewMessage",
            fieldValue: true
        }];

        dataSource.usersAPI.sendMessage(
            senderId,
            messageObject
        );

        this.saveUserSettingsToDataSource(
            userSettings
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