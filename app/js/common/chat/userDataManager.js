/* exported userDataManager */
/* global dataSource */
/* global messageListManager */
/* global createMessageObject */
/* global getCurrentDate */
/* global getElement */
/* global eventEmitter */
/* global mainConfig */
/* global longPollResponseParser */
var userDataManager =  (function createUserDataManager (config, eventEmitter, longPollResponseParser) {

    // INCLUDE

    //= ../serviceFunctions/getCurrentDate.js
    //= ../serviceFunctions/createMessageObject.js

    // INCLUDE

    // basic
    function getUserDataBasic (userId) {
        var that = this;
        return new Promise(function getCorrespondence (resolve) {
            return that.getUserCorrespondence(userId).then( function getResolve () {
                resolve()
            });
        })
    }

    function updateMessageListBasic (data) {
        var newMessageList;
        var messagesObject = [];
        if(data) {
            Object.keys(data).map(function pushData (key) {
                data[key].id = key;
                messagesObject.push(data[key]);
                return true;
            });
        }
        messageListManager.displayMessages();
        newMessageList = messageListManager.createMessageList(messagesObject);
        messageListManager.updateMessageList(newMessageList);
    }

    function getUserCorrespondenceBasic (userId) {
        var that = this;
        return dataSource.usersAPI.getUserMessages(userId)().then(function updateMessagesList (data) {
            that.updateMessageList(data);
        })
    }

    function getUserDataFromLongPollConnection(userId) {
        var that = this;
        return new Promise(function getLongPollCorrespondence(resolve) {
            that.getUserCorrespondence(userId);
            resolve();
        });
    }

    function getUserCorrespondenceFromLongPollConnection(userId) {
        var data;
        if(config.currentMessageConnection) {
            config.currentMessageConnection.abort();
        }
        config.currentMessageConnection = dataSource.usersAPI.getUserMessages(userId);
        config.currentMessageConnection.onreadystatechange = function setupConnection () {
            if (this.readyState === 3 && this.status === 200) {
                data = longPollResponseParser.parse(this.responseText);
                if (data) {
                    eventEmitter.emit(data.type, data.object);
                }
            }
        };
        config.currentMessageConnection.send();
    }

    function updateMessageListAfterLongPoll (data) {
        if(data) {
            Object.keys(data).map(function addToMessageListLongPoll (key) {
                data[key].id = key;
                messageListManager.addMessageToMessageList(data[key]);
                return true;
            });
        }
        messageListManager.displayMessages();
    }

    function UserDataManager () {
        var that = this;
        if(config.chatSettings.typeOfRequest === "longPoll") {
            UserDataManager.prototype.getUserData = getUserDataFromLongPollConnection.bind(this);
            UserDataManager.prototype.getUserCorrespondence = getUserCorrespondenceFromLongPollConnection.bind(this);
            UserDataManager.prototype.updateMessageList = updateMessageListAfterLongPoll.bind(this);
            eventEmitter.addSubscribe("message", function subscribeMessage (data) {
                that.updateMessageList(data);
            });
            eventEmitter.addSubscribe("read", function subscribeRead (data) {
                if(data) {
                    messageListManager.messageList.forEach(function displayMessages (message) {
                        if(message.id === data.id){
                            message.read = data.value;
                            messageListManager.displayMessages();
                        }
                    })
                }
            });
        } else {
            UserDataManager.prototype.getUserData = getUserDataBasic.bind(this);
            UserDataManager.prototype.getUserCorrespondence = getUserCorrespondenceBasic.bind(this);
            UserDataManager.prototype.updateMessageList = updateMessageListBasic.bind(this);
        }
    }

    UserDataManager.prototype.setup = function setup () {
        messageListManager.setup();
    };

    UserDataManager.prototype.clearMessageList = function clearMessageList () {
        messageListManager.messageList = [];
    };

    UserDataManager.prototype.createNewUserProfileToDataBase = function createNewUserProfileToDataBase (userId, userName) {
        dataSource.usersAPI.addNewUserToDataSource(userId, userName);
    };

    UserDataManager.prototype.saveSettingField = function setField (fieldName) {
        dataSource.usersAPI.setSettingField(
            fieldName,
            config.currentUserSettings.userId,
            config.currentUserSettings[fieldName]
        );
    };

    UserDataManager.prototype.updateUserOnline = function updateUserOnline (userId) {
        var date = new Date;
        dataSource.usersAPI.updateLastOnline(userId, date.getTime())
    };

    UserDataManager.prototype.sendMessage = function sendMessage (senderName) {
        var message = this.getMessageFromInputElement();
        var date = getCurrentDate();
        var messageObject = createMessageObject(message, date, senderName, false);
        if(config.chatSettings.typeOfRequest !== "longPoll") {
            messageListManager.addMessageToMessageList(messageObject);
            messageListManager.displayMessages();
        }
        this.saveMessageToDataSource(messageObject);
    };

    UserDataManager.prototype.getMessageFromInputElement = function getMessageFromInputElement () {
        var element = getElement(config.CSS_CURRENT_INPUT_CLASS);
        var value = element.value;
        element.value = "";
        return value;
    };

    UserDataManager.prototype.setMessageAsRead = function setMessageAsRead () {
        var messageObjects = messageListManager.getMessageObjectsForMarkAsRead();
        if(messageObjects.length > 0) {
            messageObjects.forEach(function setRead (element) {
                dataSource.usersAPI.updateMessageIsReadField(
                    element.fieldName,
                    element.userId,
                    element.fieldValue
                );
            });
            config.currentUserSettings.readLastMessage = true;
        }
        messageListManager.displayMessages();
    };

    UserDataManager.prototype.saveMessageToDataSource = function saveMessageToDataSource (messageObject) {
        if(messageObject.sender === config.currentUserSettings.userName) {
            dataSource.usersAPI.updateSendNewMessageFlag(config.currentUserSettings.userId,true);
        }
        dataSource.usersAPI.sendMessage(
            null,
            config.currentUserSettings.userId,
            messageObject
        );
    };

    // Settings = [{userId, fieldName, fieldValue},{}...]
    UserDataManager.prototype.saveUserSettingsToDataSource = function saveUserSettingsToDataSource (settings) {
        settings.forEach(function saveSetting (newFieldSetting) {
            dataSource.usersAPI.setSettingField(
                newFieldSetting.fieldName,
                newFieldSetting.userId,
                newFieldSetting.fieldValue
            );
        });
    };


    return new UserDataManager();

})(mainConfig, eventEmitter, longPollResponseParser);