/* exported dashboard */
/* global getElement */
/* global userDataManager */
/* global mainConfig */
/* global userListManager */
/* global dataSource */
/* global eventEmitter */
/* global sorter */
/* global longPollResponseParser */
var dashboard = (function createDashboardController(config, dataSource, uDataManager, uListManager, sorter, eventEmitter){

    var intervalId = [];

    function DashboardController() {
        this.setupEventEmitter();
    }

    DashboardController.prototype.startApp = function startApp () {
        uDataManager.setup(config);
        this.getUserList();
        this.setupCommonListenerFunctions();
        this.setupIntervalFunctions();
    };

    DashboardController.prototype.setupEventEmitter = function setupEventEmitter () {
        var that = this;
        var condition;
        eventEmitter.addSubscribe("userList", function  setupData (data) {
            var usersList = [];
            var newData;
            if(data instanceof Array) {
                newData = data[1];
            }
            Object.keys(newData).map(function setUserSetting(userId) {
                uListManager.addUserToUsersArray(
                    newData[userId],
                    userId,
                    usersList
                );
                return true;
            });
            uListManager.uList = uListManager.uList.concat(usersList);
            condition = that.getCurrentUserIdFromLocalStorage();
            that.localSettingsSetup(condition);
            that.setupUserListDOM();
        });
        eventEmitter.addSubscribe("lastOnline", function lastOnlineSub (data) {
            var userId = data[0];
            var lastOnline = data[1];
            uListManager.updateUserOnlineStatus(userId, lastOnline)
        });
        eventEmitter.addSubscribe("sendNewMessage", function sendNewMessageSub (data) {
            var userIndex = uListManager.getUserFromUserListById(data[0]);
            uListManager.uList[userIndex].sendNewMessage = data[1];
            that.toggleNewMessageIndicatorToUser();
        });
    };


    // DASHBOARD_CONDITION
    DashboardController.prototype.saveCurrentConditionToLocalStorage = function saveCurrentConditionToLocalStorage() {
        var serialCondition = JSON.stringify({
            filter: config.currentDashboardCondition.filterBy,
            sort: config.currentDashboardCondition.sortBy,
            currentUserId: config.currentUserSettings.userId
        });
        localStorage.setItem(config.LOCAL_STORAGE_NAME, serialCondition);
    };

    DashboardController.prototype.getCurrentUserIdFromLocalStorage = function getCurrentUserIdFromLocalStorage() {
        var serialCondition = localStorage.getItem(config.LOCAL_STORAGE_NAME);
        var condition = null;
        if (serialCondition) {
            condition = JSON.parse(serialCondition);
            config.currentDashboardCondition.filterBy = condition.filter;
            config.currentDashboardCondition.sortBy = condition.sort;
            config.currentUserSettings.userId = condition.currentUserId;
        }
        return condition;
    };

    DashboardController.prototype.localSettingsSetup = function localSettingsSetup(condition) {
        if (condition) {
            if (condition.filter) {
                getElement(config.DOM.CSS_FILTER_INPUT_ID).value = condition.filter;
                this.filter();
            }
            if (condition.sort) {
                getElement(config.DOM.CSS_SORT_SELECT_ID).value = condition.sort;
                this.sort();
            }
            if (condition.currentUserId) {
                config.currentUserSettings.userId = condition.currentUserId;
                this.startConversationWithUser(config.currentUserSettings.userId);
            }
        }
    };
    // DASHBOARD_CONDITION

    // фильтрация списка юзеров
    DashboardController.prototype.filter = function filter() {
        config.currentDashboardCondition.filterBy = getElement(config.DOM.CSS_FILTER_INPUT_ID).value;
        this.saveCurrentConditionToLocalStorage();
        uListManager.filterByName(config.currentDashboardCondition.filterBy);
        uListManager.displayUsers();
    };

    // // сортировка списка юзеров
    DashboardController.prototype.sort = function sort() {
        config.currentDashboardCondition.sortBy = getElement(config.DOM.CSS_SORT_SELECT_ID).value;
        this.saveCurrentConditionToLocalStorage();
        uListManager.sortUsersByField();
        uListManager.displayUsers();
    };

    DashboardController.prototype.setupUsersListeners = function setupUsersListeners() {
        var that = this;
        Array.from(config.users).forEach(function addListeners (element) {
                element.addEventListener(
                    "click",
                    that.userListener.bind(
                        that,
                        element.firstChild.innerText
                    )
                );
            });
    };

    DashboardController.prototype.setupUserListDOM = function setupUserListDOM () {
        uListManager.displayUsers();
        this.getAcessToUsersList();
        this.toggleNewMessageIndicatorToUser();
        this.setupUsersListeners();
    };

    DashboardController.prototype.getAcessToUsersList = function accessToUsersDOM() {
        config.users = getElement(
            config.userList.USER_ELEMENT_CSS_CLASS, true
        );
    };

    DashboardController.prototype.getUserList = function getUserList () {
        var data;
        var longPollUserListConnector = dataSource.usersAPI.getUserList(null);
        longPollUserListConnector.onreadystatechange = function getConnectionFromData () {
            if (this.status) {
                data = longPollResponseParser.parse(this.responseText);
                if(data) {
                    eventEmitter.emit(data.type, data.object);
                }
            }
        };
        longPollUserListConnector.send();
        config.currentUserListConnection = longPollUserListConnector;
    };


    DashboardController.prototype.userListener = function userListener(userId) {
        this.startConversationWithUser(userId);
        this.markMessageFromUserAsRead(userId);

    };

    // Открывает чат с юзером, загружает мессаджи юзера и отображает их
    DashboardController.prototype.startConversationWithUser = function startConversationWithUser(
        userId
    ) {
        var that = this;
        config.currentUserSettings.userId = userId;
        uDataManager.clearMessageList();
        uDataManager.getUserData(userId)
            .then(function saveLocalData () {
                getElement(config.DOM.CSS_CHAT_CONTAINS_BLOCK_STYLE).classList.remove(config.INVISIBLE_CLASS);
                that.saveCurrentConditionToLocalStorage();
            });
        dataSource.usersAPI.updateSendNewMessageFlag(userId, false);
    };


    // Обновлет массив сообщений в модуле чата и выводит их на экран
    DashboardController.prototype.updateUserMessagesAndDisplayIt = function updateUserMessagesAndDisplayIt(
    ) {
        uDataManager.getUserData(config.currentUserSettings.userId);
        this.markMessageFromUserAsRead(config.currentUserSettings.userId);
    };


    DashboardController.prototype.setupCommonListenerFunctions = function setupCommonListenerFunctions() {
        var that = this;
        getElement(config.DOM.CSS_SEND_MESSAGE_BUTTON_CLASS).addEventListener(
            "click",
            userDataManager.sendMessage.bind(userDataManager, config.ADMIN_NAME)
        );
        getElement(config.DOM.CSS_CLOSE_CHAT_BUTTON_CLASS).addEventListener(
            "click",
            that.closeConversation.bind(that)
        );
        getElement(config.DOM.CSS_FILTER_INPUT_ID).addEventListener(
            "input",
            that.filter.bind(that)
        );
        getElement(config.DOM.CSS_SORT_SELECT_ID).addEventListener(
            "input",
            that.sort.bind(that)
        );
        document.addEventListener("mousemove", userDataManager.setMessageAsRead.bind(userDataManager));
    };

    // Помечает канал юзера как прочитанный (если там есть непрочитанные сообщения)
    DashboardController.prototype.markMessageFromUserAsRead = function markMessageFromUserAsRead (userId) {
        var userIndex = uListManager.getUserFromUserListById(userId);
        uListManager.uList[userIndex].sendNewMessage = false;
        uDataManager.saveUserSettingsToDataSource([{
            userId: userId,
            fieldName: "sendNewMessage",
            fieldValue: false
        }]);
        this.toggleNewMessageIndicatorToUser();
    };

    // Закрывает канал общения с юзером и чат
    DashboardController.prototype.closeConversation = function closeConversation () {
        getElement(config.DOM.CSS_CHAT_CONTAINS_BLOCK_STYLE).classList.add(config.INVISIBLE_CLASS);
        config.currentUserSettings.userId = null;
        config.currentMessageConnection.abort();
        this.saveCurrentConditionToLocalStorage();
    };

    // добавляет новый елемент-индикатор в
    DashboardController.prototype.toggleNewMessageIndicatorToUser = function toggleNewMessageIndicatorToUser() {
        var newMessageDiv;
        Object.keys(uListManager.uList).map(function blink(key) {
            newMessageDiv = uListManager.uList[key].userElement.getElementsByClassName(
                config.CSS_HAVE_NEW_MESSAGE_STYLE
            )[0];
            if (uListManager.uList[key].sendNewMessage && !newMessageDiv) {
                newMessageDiv = document.createElement("div");
                newMessageDiv.classList.add(config.CSS_HAVE_NEW_MESSAGE_STYLE);
                uListManager.uList[key].userElement.appendChild(newMessageDiv);
            }
            if(!uListManager.uList[key].sendNewMessage && newMessageDiv) {
                uListManager.uList[key].userElement.removeChild(newMessageDiv);
            }
            return true;
        });
    };

    DashboardController.prototype.setupIntervalFunctions = function setupIntervalFunctions () {
        var that = this;
        intervalId.push = setInterval(function interval () {
            Object.keys(uListManager.uList).map(function userListUpdate (viewId) {
                uListManager.updateUserOnlineStatus(
                    uListManager.uList[viewId].userId,
                    uListManager.uList[viewId].lastOnline
                );
                return true;
            });
            that.setupUserListDOM();
        },config.interval.UPDATE_USERS_TIME)
    };

    DashboardController.prototype.closeApp = function closeApp () {
        intervalId.forEach(function clear (id) {
            clearInterval(id)
        });
        userDataManager.clearMessageList();
        uListManager.clearUserList();
        if(config.currentMessageConnection) {
            config.currentMessageConnection.abort();
        }
        config.currentUserListConnection.abort()
    };

    return new DashboardController();

})(mainConfig, dataSource, userDataManager, userListManager, sorter, eventEmitter);
