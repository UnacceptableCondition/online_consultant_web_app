/* global chatManager */
/* global getElement */
/* global userListManager */
/* global dashboardController */
/* global dashboardDataSource */
/* global dashboardControllerConfig */
var dashboardController = (function createController(
    userListManagerObject,
    chatManagerObject,
    dashboardDataSourceObject,
    configObject
) {
    var dashboardControllerInstance;
    // id юзера с которым открыт чат
    var currentUserId = null;
    // параметр фильтрации юзеров
    var filterBy = null;
    // параметр сортировки юзеров
    var sortBy = null;

    function DashboardController(
        userListManagerObj,
        chatManagerObj,
        dashboardDataSourceObj,
        configObj
    ) {
        this.config = configObj;
        this.chatModule = chatManagerObj;
        this.usersModule = userListManagerObj;
        this.dataSourceModule = dashboardDataSourceObj;
        this.DOMVariables = {
            users: [],
            chat: getElement(
                this.config.CSS_CHAT_CONTAINS_BLOCK_STYLE
            ),
            sendMessageButton: getElement(
                this.config.CSS_SEND_MESSAGE_BUTTON_CLASS
            ),
            messageInput: getElement(
                this.config.CSS_INPUT_MESSAGE_BLOCK_ID
            ),
            closeButton: getElement(
                this.config.CSS_CLOSE_CHAT_BUTTON_CLASS
            ),
            filterInput: getElement(this.config.CSS_FILTER_INPUT_ID),
            sortSelect: getElement(this.config.CSS_SORT_SELECT_ID)
        };
    }

    DashboardController.prototype.startApp = function startApp() {
        this.setupUsersListBlock(null);
        this.setupCommonListenerFunctions();
        this.setupIntervalFunctions();
    };

    // DashboardController.prototype.setupCommonListenerFunctions = function setupCommonListenerFunctions() {
    //     this.DOMVariables.sendMessageButton.addEventListener(
    //         "click",
    //         this.sendMessageToUser.bind(this)
    //     );
    //     this.DOMVariables.closeButton.addEventListener(
    //         "click",
    //         this.closeConversation.bind(this)
    //     );
    //     this.DOMVariables.filterInput.addEventListener(
    //         "input",
    //         this.filter.bind(this)
    //     );
    //     this.DOMVariables.sortSelect.addEventListener(
    //         "input",
    //         this.sort.bind(this)
    //     );
    // };
    //
    // DashboardController.prototype.saveCurrentConditionToLocalStorage = function saveCurrentConditionToLocalStorage() {
    //     var serialCondition = JSON.stringify({
    //         filter: filterBy,
    //         sort: sortBy,
    //         currentUserId: currentUserId
    //     });
    //     localStorage.setItem("currentCondition", serialCondition);
    // };
    //
    // DashboardController.prototype.getCurrentUserIdFromLocalStorage = function getCurrentUserIdFromLocalStorage() {
    //     var serialCondition = localStorage.getItem("currentCondition");
    //     var condition = null;
    //     if (serialCondition) {
    //         condition = JSON.parse(serialCondition);
    //         filterBy = condition.filter;
    //         sortBy = condition.sort;
    //         currentUserId = condition.currentUserId;
    //     }
    //     return condition;
    // };
    //
    // DashboardController.prototype.localSettingsSetup = function localSettingsSetup(condition) {
    //     if (condition) {
    //         if (condition.filter) {
    //             this.DOMVariables.filterInput.value = condition.filter;
    //             this.filter();
    //         }
    //         if (condition.sort) {
    //             this.DOMVariables.sortSelect.value = condition.sort;
    //             this.sort();
    //         }
    //         if (condition.currentUserId) {
    //             currentUserId = condition.currentUserId;
    //             this.startConversationWithUser(currentUserId);
    //         }
    //     }
    // };
    //
    // // /////// WORK WITH USERS_MODULE // ///////
    //
    // DashboardController.prototype.getUsersListFromDataSource = function getUsersListFromDataSource () {
    //     var usersList = [];
    //     var controllerRef = this;
    //     return this.dataSourceModule.allUsersAPI
    //         .getAllUsers()
    //         .then(function setUserData (userData) {
    //             Object.keys(userData).map(function setUserSetting (userId) {
    //                 controllerRef.addUserToUsersArray(
    //                     userData[userId],
    //                     userId,
    //                     usersList
    //                 );
    //                 return true;
    //             });
    //         })
    //         .then(function returnUsersList () {
    //             return usersList;
    //         });
    // };



    // // фильтрация списка юзеров
    // DashboardController.prototype.filter = function filter() {
    //     filterBy = this.DOMVariables.filterInput.value;
    //     this.saveCurrentConditionToLocalStorage();
    //     this.usersModule.filterByName(filterBy);
    //     this.usersModule.displayUsers();
    // };
    //
    // // сортировка списка юзеров
    // DashboardController.prototype.sort = function sort() {
    //     sortBy = this.DOMVariables.sortSelect.value;
    //     this.saveCurrentConditionToLocalStorage();
    //     this.usersModule.sortUsersByField(sortBy);
    //     this.usersModule.displayUsers();
    // };
    //
    // DashboardController.prototype.addUserToUsersArray = function addUserToUsersList(
    //     user,
    //     userId,
    //     usersList
    // ) {
    //     var userIsOnline = this.usersModule.userIsOnline(user.lastOnline);
    //     usersList.push({
    //         userId: userId,
    //         userElement: this.usersModule.createUserElement(userId, userIsOnline),
    //         online: userIsOnline,
    //         visible: true,
    //         sendNewMessage: user.sendNewMessage,
    //         readLastMessage: user.readLastMessage,
    //         lastOnline: user.lastOnline,
    //         userName: user.userName
    //     });
    // };
    //
    // // Помечает канал юзера как прочитанный (если там есть непрочитанные сообщения)
    // DashboardController.prototype.markMessageFromUserAsRead = function markMessageFromUserAsRead (userId) {
    //     var userIndex = this.usersModule.getUserFromUserListById(userId);
    //     this.usersModule.uList[userIndex].sendNewMessage = false;
    //     this.dataSourceModule.oneUserAPI.setField(
    //         userId,
    //         "sendNewMessage",
    //         this.usersModule.uList[userIndex].sendNewMessage
    //     );
    // };
    //
    // // Инициализация usersModule - цепочка промисов обновляющая usersList и его представление на экране
    // DashboardController.prototype.setupUsersListBlock = function setupUsersListBlock (newUserList) {
    //     this.setupUsersListeners(newUserList);
    // };
    //
    // // Добавляет юзер лист в юзер лист модуль. Важно: если передан как параметр новый юзер лист
    // // (нужно для обновления), то добавляется он, иначе данные берутся с сервера
    // // объект Promise создается для совместимости
    // DashboardController.prototype.setUsersListToUsersModule = function setUsersListToUsersModule(
    //     newUserList
    // ) {
    //     var controllerRef = this;
    //     if (!newUserList) {
    //         return this.getUsersListFromDataSource()
    //             .then(function getUserListObj (usersListObject) {
    //                 controllerRef.usersModule.setUserList(usersListObject);
    //             })
    //             .then(function localSettingsSetup() {
    //                 var condition = controllerRef.getCurrentUserIdFromLocalStorage();
    //                 controllerRef.localSettingsSetup(condition);
    //             });
    //     }
    //     return new Promise(function elseResolve (resolve) {
    //         resolve(controllerRef.usersModule.setUserList(newUserList));
    //     });
    // };
    //
    //
    // // отобразить список юзеров
    // DashboardController.prototype.displayUsersList = function displayUsersList(newUserList) {
    //     var controllerRef = this;
    //     return this.setUsersListToUsersModule(newUserList).then(function displayUList () {
    //         controllerRef.usersModule.displayUsers();
    //     }).then(function () {
    //         controllerRef.toggleNewMessageIndicatorToUser();
    //     });
    // };
    //
    // DashboardController.prototype.getAcessToUsersList = function accessToUsersDOM(
    //     newUserList
    // ) {
    //     var controllerRef = this;
    //     return this.displayUsersList(newUserList).then(function setDOM () {
    //         controllerRef.DOMVariables.users = getElement(
    //             controllerRef.usersModule.config.USER_ELEMENT_CSS_CLASS, true
    //         );
    //     });
    // };
    //
    // // добавляет новый елемент-индикатор в
    // DashboardController.prototype.toggleNewMessageIndicatorToUser = function toggleNewMessageIndicatorToUser() {
    //     var controllerRef = this;
    //     var newMessageDiv;
    //     Object.keys(controllerRef.usersModule.uList).map(function blink(key) {
    //         newMessageDiv = controllerRef.usersModule.uList[key].userElement.getElementsByClassName(
    //             controllerRef.config.CSS_HAVE_NEW_MESSAGE_STYLE
    //         )[0];
    //         if (controllerRef.usersModule.uList[key].sendNewMessage && !newMessageDiv) {
    //             newMessageDiv = document.createElement("div");
    //             newMessageDiv.classList.add(controllerRef.config.CSS_HAVE_NEW_MESSAGE_STYLE);
    //             controllerRef.usersModule.uList[key].userElement.appendChild(newMessageDiv);
    //         }
    //         if(!controllerRef.usersModule.uList[key].sendNewMessage && newMessageDiv) {
    //             controllerRef.usersModule.uList[key].userElement.removeChild(newMessageDiv);
    //         }
    //         return true;
    //     });
    // };
    //
    //
    // DashboardController.prototype.setupUsersListeners = function setupUsersListeners(
    //     newUserList
    // ) {
    //     var controllerRef = this;
    //     return this.getAcessToUsersList(newUserList).then(function getAcess () {
    //         Array.from(controllerRef.DOMVariables.users).forEach(function addListeners (element) {
    //             element.addEventListener(
    //                 "click",
    //                 controllerRef.userListener.bind(
    //                     controllerRef,
    //                     element.firstChild.innerText
    //                 )
    //             );
    //         });
    //     });
    // };
    //
    // DashboardController.prototype.userListener = function userListener(userId) {
    //     this.startConversationWithUser(userId);
    //     this.markMessageFromUserAsRead(userId);
    // };

    // Обновляет данные пользователей - добавляет новые регистрации + обновляет онлайн статус + если
    // установлен флаг isConversation - обновляет сообщения пользователей
    DashboardController.prototype.updateUsers = function updateUsers() {
        var controllerRef = this;
        var uModuleRef = this.usersModule;
        var intermediateList = [];
        controllerRef.dataSourceModule.allUsersAPI
            .getAllUsers()
            .then(function update (userList) {
                Object.keys(userList).map(function addUsers(userId) {
                    console.log(userList);
                    controllerRef.addUserToUsersArray(
                        userList[userId],
                        userId,
                        intermediateList
                    );
                    if (currentUserId) {
                        controllerRef.updateUserMessagesAndDisplayIt(
                            userList[currentUserId]
                        );
                    }
                    return true;
                });
            })
            .then(function setNemList () {
                uModuleRef.uList = intermediateList;
                if (filterBy) {
                    controllerRef.filter();
                }
                if (sortBy) {
                    controllerRef.sort();
                }
                controllerRef.setupUsersListeners(intermediateList);
            });
    };

    // /////// WORK CHAT_MODULE /////////

    // // Открывает чат с юзером, загружает мессаджи юзера и отображает их
    // DashboardController.prototype.startConversationWithUser = function startConversationWithUser(
    //     userId
    // ) {
    //     var controllerRef = this;
    //     controllerRef.dataSourceModule.oneUserAPI
    //         .getAmountOfNoReadMessage()
    //         .then(function getNoRead (count) {
    //             controllerRef.chatModule.newMessagesCounter = count;
    //             currentUserId = userId;
    //             controllerRef.saveCurrentConditionToLocalStorage();
    //         })
    //         .then(function getData() {
    //             controllerRef.dataSourceModule.oneUserAPI
    //                 .getUserData(userId)
    //                 .then(function displayData (data) {
    //                     controllerRef.updateUserMessagesAndDisplayIt(data);
    //                 });
    //         });
    // };

    // Обновлет массив сообщений в модуле чата и выводит их на экран
    DashboardController.prototype.updateUserMessagesAndDisplayIt = function updateUserMessagesAndDisplayIt(
        userList
    ) {
        var newMessageList = [];
        this.addMessageToMessageArray(userList, newMessageList);
        this.setNewMessagesCounter(userList);
        this.chatModule.updateMessageList(newMessageList);
        this.DOMVariables.chat.classList.remove(this.config.CSS_INVISIBLE_STYLE);
        this.chatModule.displayMessages();
        this.markMessageFromUserAsRead(currentUserId);
    };

    // // data - объект данных пользователя на сервере
    // DashboardController.prototype.addMessageToMessageArray = function addUserToUsersArray(
    //     userData,
    //     messageArray
    // ) {
    //     var controllerRef = this;
    //     if(userData.messages) {
    //         Object.keys(userData.messages).map(function addToMessageArray (key) {
    //             var messageObject;
    //             var message = userData.messages[key].message;
    //             var date = userData.messages[key].date;
    //             var sender = userData.messages[key].user;
    //             var isRead = true;
    //             messageObject = controllerRef.chatModule.createMessageObject(
    //                 message,
    //                 date,
    //                 sender,
    //                 isRead
    //             );
    //             messageArray.push(messageObject);
    //             return true;
    //         });
    //     }
    // };
    //
    // // data - объект данных пользователя на сервере
    // DashboardController.prototype.setNewMessagesCounter = function setNewMessagesCounter (userData) {
    //     if (!userData.readLastMessage && userData.noReadMessage) {
    //         this.chatModule.newMessagesCounter = userData.noReadMessage.count;
    //     } else {
    //         this.chatModule.newMessagesCounter = 0;
    //         this.dataSourceModule.oneUserAPI.setField(
    //             currentUserId,
    //             "noReadMessage/count",
    //             0
    //         );
    //     }
    // };
    //
    // DashboardController.prototype.sendMessageToUser = function sendMessageToUser () {
    //     var controllerRef = this;
    //     var value = controllerRef.getMessageFromInputElement();
    //     var messageDate = controllerRef.chatModule.getCurrentDate();
    //     var adminName = controllerRef.chatModule.config.DEFAULT_ADMIN_NAME;
    //     var messageObject = controllerRef.chatModule.createMessageObject(
    //         value,
    //         messageDate,
    //         adminName,
    //         false
    //     );
    //
    //     controllerRef.chatModule.addMessageToMessageList(messageObject);
    //     controllerRef.chatModule.newMessagesCounter++;
    //
    //     controllerRef.dataSourceModule.oneUserAPI.setAmountOfNoReadMessage(
    //         currentUserId,
    //         controllerRef.chatModule.newMessagesCounter
    //     );
    //     controllerRef.dataSourceModule.oneUserAPI.sendMessageToUser(
    //         currentUserId,
    //         messageObject
    //     );
    //     controllerRef.dataSourceModule.oneUserAPI.setField(
    //         currentUserId,
    //         "readLastMessage",
    //         false
    //     );
    //
    //     controllerRef.chatModule.displayMessages();
    // };
    //
    // DashboardController.prototype.getMessageFromInputElement = function getMessageFromInputElement () {
    //     var value = this.DOMVariables.messageInput.value;
    //     this.DOMVariables.messageInput.value = "";
    //     return value;
    // };

    // // Закрывает канал общения с юзером и чат
    // DashboardController.prototype.closeConversation = function closeConversation () {
    //     this.DOMVariables.chat.classList.add(this.config.CSS_INVISIBLE_STYLE);
    //     currentUserId = null;
    //     this.saveCurrentConditionToLocalStorage();
    // };

    //  /////// WORK WITH INTERVAL /////////

    DashboardController.prototype.setupIntervalFunctions = function setupIntervalFunctions () {
        var controllerRef = this;
        setInterval(function setIntervalUpdateUsers () {
            controllerRef.updateUsers();
        }, controllerRef.config.UPDATE_USERS_TIME);
        setInterval(function setIntervalBlink () {
            controllerRef.toggleNewMessageIndicatorToUser();
        }, controllerRef.config.BLINK_NEW_MESSAGES_TIME);
    };

    dashboardControllerInstance = new DashboardController(
        userListManagerObject,
        chatManagerObject,
        dashboardDataSourceObject,
        configObject
    );
    return dashboardControllerInstance;
})(
    userListManager,
    chatManager,
    dashboardDataSource,
    dashboardControllerConfig
);

dashboardController.startApp();