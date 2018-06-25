var dashboard = (function createController(config, dataSource, uDataManager, uListManager, sorter){

    var intervalId = [];

    function DashboardController() {}

    DashboardController.prototype.startApp = function () {
        uListManager.setup(config, sorter);
        uDataManager.setup(config);
        this.setupUsersListBlock();
        this.setupCommonListenerFunctions();
        this.setupIntervalFunctions();
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

    // Инициализация usersModule - цепочка промисов обновляющая usersList и его представление на экране
    DashboardController.prototype.setupUsersListBlock = function setupUsersListBlock (newUserList) {
        this.setupUsersListeners(newUserList);
    };

    DashboardController.prototype.setupUsersListeners = function setupUsersListeners(
        newUserList
    ) {
        var that = this;
        return this.getAcessToUsersList(newUserList).then(function getAccess () {
            Array.from(config.users).forEach(function addListeners (element) {
                element.addEventListener(
                    "click",
                    that.userListener.bind(
                        that,
                        element.firstChild.innerText
                    )
                );
            });
        });
    };

    DashboardController.prototype.getAcessToUsersList = function accessToUsersDOM(
        newUserList
    ) {
        var that = this;
        return this.displayUsersList(newUserList).then(function setDOM () {
            config.users = getElement(
                config.USER_ELEMENT_CSS_CLASS, true
            );
        });
    };

    // отобразить список юзеров
    DashboardController.prototype.displayUsersList = function displayUsersList(newUserList) {
        var that = this;
        return this.setUsersListToUsersModule(newUserList).then(function displayUList () {
            uListManager.displayUsers();
        }).then(function () {
            that.toggleNewMessageIndicatorToUser();
        });
    };


    // Добавляет юзер лист в юзер лист модуль. Важно: если передан как параметр новый юзер лист
    // (нужно для обновления), то добавляется он, иначе данные берутся с сервера
    // объект Promise создается для совместимости
    DashboardController.prototype.setUsersListToUsersModule = function setUsersListToUsersModule(
        newUserList
    ) {
        var that = this;
        if (!newUserList) {
            return this.getUserList()
                .then(function getUserListObj (usersListObject) {
                    uListManager.setUserList(usersListObject);
                })
                .then(function localSettingsSetup() {
                    var condition = that.getCurrentUserIdFromLocalStorage();
                    that.localSettingsSetup(condition);
                });
        }
        return new Promise(function elseResolve (resolve) {
            resolve(uListManager.setUserList(newUserList));
        });
    };

    DashboardController.prototype.getUserList = function () {
        var usersList = [];
        return dataSource.usersAPI.getAllUsers().then(function setUserData(userData) {
            Object.keys(userData).map(function setUserSetting(userId) {
                uListManager.addUserToUsersArray(
                    userData[userId],
                    userId,
                    usersList
                );
                return true;
            });
        }).then(function returnUsersList () {
            return usersList;
        });
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
        uDataManager.getUserData(userId)
            .then(function  () {
                getElement(config.DOM.CSS_CHAT_CONTAINS_BLOCK_STYLE).classList.remove(config.INVISIBLE_CLASS);
                that.saveCurrentConditionToLocalStorage();
            })
    };


    // Обновляет данные пользователей - добавляет новые регистрации + обновляет онлайн статус + если
    // установлен флаг isConversation - обновляет сообщения пользователей
    DashboardController.prototype.updateUsers = function updateUsers() {
        var that = this;
        var intermediateList = [];
        dataSource.usersAPI
            .getAllUsers()
            .then(function update (userList) {
                Object.keys(userList).map(function addUsers(userId) {
                    uListManager.addUserToUsersArray(
                        userList[userId],
                        userId,
                        intermediateList
                    );
                    if (config.currentUserSettings.userId) {
                        that.updateUserMessagesAndDisplayIt();
                    }
                    return true;
                });
            })
            .then(function setNewList () {
                uListManager.uList = intermediateList;
                if (config.currentDashboardCondition.filterBy) {
                    that.filter();
                }
                if (config.currentDashboardCondition.sortBy) {
                    that.sort();
                }
                that.setupUsersListeners(intermediateList);
            });
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
        intervalId.push(setInterval(function setIntervalUpdateUsers () {
            that.updateUsers();
        }, config.UPDATE_USERS_TIME))
    };

    DashboardController.prototype.closeApp = function () {
        intervalId.forEach(function (id) {
            clearInterval(id)
        })
    };

    return new DashboardController();

})(mainConfig, dataSource, userDataManager, userListManager, sorter);
