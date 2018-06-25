// config

var mainConfig = {
    DOM: {
        // Css класс DOM элемента в котором необходимо отображать список юзеров
        USER_LIST_CSS_CLASS: "root-touchsoft-dashboard_users-list",
        // Блок в который загружается чат
        CSS_CHAT_CONTAINS_BLOCK_STYLE: "root-touchsoft-dashboard_chat",
        // Класс DOM элемента для отправки сообщения пользователю по нажатию
        CSS_SEND_MESSAGE_BUTTON_CLASS: "root-touchsoft-dashboard_send-button",
        // Класс кнопки закрывающей чат
        CSS_CLOSE_CHAT_BUTTON_CLASS: "root-touchsoft-dashboard_close-chat",
        // ID DOM элемента дял ввода параметра фильтрации пользователей
        CSS_FILTER_INPUT_ID: "root-touchsoft-dashboard_filter-input",
        // ID DOM элемента дял ввода параметра сортировки пользователей
        CSS_SORT_SELECT_ID: "root-touchsoft-dashboard_sort"

    },

    launcher: {
        pattern: "touchsoft_chat-launcher_",
        after : [
            "chatTitle", "chatUrl", "chatClass", "chatPositionSelect",
            "allowMinimize", "allowDrag", "requireName", "showTime", "networkRadioXMR",
            "networkRadioFetch", "scriptCode"
        ],
        srcStart: "&ltscript src='https://rawgit.com/UnacceptableCondition/Homework_2/master/js/chat.js?title='",
        srcEnd:  "'&gt&lt/script&gt"
    },

    ADMIN_NAME: "Admin",

    // класс в котором будем отображать сообщения
    CSS_CHAT_MESSAGES_CONTAINER: "root-touchsoft-dashboard_chat-messages",

    // Css классы для работы с объектом списка юзеров
    USER_ELEMENT_CSS_CLASS: "root-touchsoft-dashboard_user",
    USER_ID_ELEMENT_CSS_CLASS: "root-touchsoft-dashboard_user-id",
    USER_INDICATOR_CSS_CLASS_OFFLINE: "root-touchsoft-dashboard_user-offline",
    USER_INDICATOR_CSS_CLASS_ONLINE: "root-touchsoft-dashboard_user-online",


    // ID DOM элемента дял ввода сообщения перед отправкой юзеру
    CSS_CURRENT_INPUT_CLASS: "root-touchsoft-dashboard_textarea-for-message",

    LOCAL_STORAGE_NAME: "currentCondition",

    // для новых сообщений от пользователей
    // Если юзер прислал соообщение, на юзера в списке вешается этот стиль
    CSS_HAVE_NEW_MESSAGE_STYLE: "root-touchsoft-dashboard_user-have-new-message",
    //

    chatSettings: {
        typeOfRequest: "fetch"
    },

    currentUserSettings: {
        userId: null,
        userName: null
    },

    currentDashboardCondition: {
        filterBy: null,
        sortBy: null
    },

    // класс переключатель отображения элемента
    INVISIBLE_CLASS: "root-touchsoft-dashboard_invisible-element",
    // Css класс для элеменат с сообщение, если юзер не прочитал сообщения
    CSS_USER_NOT_READ_MESSAGES: "root-touchsoft-dashboard_message-not-read",

    DATA_BASE_URL: "https://touchsoftchatproject.firebaseio.com",

    UPDATE_USERS_TIME: 5000,
    ONLINE_INTERVAL: 120000,


    ABOUT_HTML_PATH: "",
    LAUNCHER_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/dev/html/chatLauncher.html",
    DASHBOARD_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/dev/html/dashboard.html",
    CONTENT_CLASS: "content",

    NAVIGATION_ACTIVE_CSS: "navigation-active"
};
var dataBaseUrl = mainConfig.DATA_BASE_URL;

var getElement = function getElementFromDOM (selector, isAll, itIsId) {
    var selectorStart = (itIsId) ? "#" : ".";
    if(isAll) {
        return document.querySelectorAll(selectorStart + selector);
    }
    return document.querySelector(selectorStart + selector);
};


var dataConnectorConfig = {
    typeOfRequest: mainConfig.chatSettings.typeOfRequest
};

// service

/* exported sorter */
var sorter = (function createNewSorter () {
    function Sorter() {}

    function createSorter() {
        return new Sorter();
    }

    function swap(items, firstIndex, secondIndex) {
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    function partition(items, left, right, sortField) {
        var pivot = items[Math.floor((right + left) / 2)][sortField];
        var i = left;
        var j = right;

        while (i <= j) {
            while (items[i][sortField] > pivot) {
                i++;
            }
            while (items[j][sortField] < pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    Sorter.prototype.quickSort = function quickSort(
        items,
        left,
        right,
        sortField
    ) {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right, sortField);
            if (left < index - 1) {
                this.quickSort(items, left, index - 1, sortField);
            }
            if (index < right) {
                this.quickSort(items, index, right, sortField);
            }
        }
        return items;
    };

    return createSorter();
})();
// Очищает DOM содержащий элементы списка юзеров
function clearElementContent(elementSelector) {
    var element = getElement(elementSelector);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// database

// Модуль предоставляет способ отправки запроса к источнику данных
// Для реквеста необходим путь, тело запроса, тип запроса
// request возвращает Promise
var dataConnector = (function getDataSourceAPI(dataConnectorConfigObj) {
    var dataBaseConnector;
    var dataBaseAPI;

    function DataBaseConnector() {}

    DataBaseConnector.prototype.requestFetch = function requestFetch(
        requestPath,
        requestBody,
        requestType,
        contentType
    ) {
        return fetch(requestPath, {
            headers: {
                Accept: contentType,
                "Content-Type": contentType
            },
            method: requestType,
            body: requestBody
        }).then(function getResponseJSON(response) {
            if(contentType === "application/json") {
                return response.json();
            }
            return response.text();
        });
    };

    DataBaseConnector.prototype.requestXMR = function requestXMR(
        requestPath,
        requestBody,
        requestType,
        contentType
    ) {
        return new Promise(function request(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(requestType, requestPath, true);
            xhr.setRequestHeader("Content-Type", contentType);
            xhr.onload = function loadCase() {
                if(contentType === "application/json") {
                    resolve(JSON.parse(xhr.response));
                } else {
                    resolve(xhr.response);
                }
            };
            xhr.onerror = function errorCase() {
                reject(xhr.statusText);
            };
            if (requestBody) {
                xhr.send(requestBody);
            } else {
                xhr.send();
            }
        });
    };

    dataBaseConnector = new DataBaseConnector();
    if (dataConnectorConfigObj.typeOfRequest === "fetch") {
        dataBaseAPI = {
            request: dataBaseConnector.requestFetch
        };
    } else {
        dataBaseAPI = {
            request: dataBaseConnector.requestXMR
        };
    }

    return dataBaseAPI;
})(dataConnectorConfig);
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

// view

var viewFactory = (function (dataSource) {

    function ViewFactory () {}

    ViewFactory.prototype.createView = function createChatView (htmlPath, cssPath, containerClass) {
        var that = this;
        return new Promise(function(resolve, reject) {
            if(htmlPath) {
                if(cssPath) {
                    that.includeViewCssToPage(that.createCSSLink(
                        cssPath,
                        "stylesheet",
                        "text/css",
                        "touch-soft-chat-css"
                    ));
                }
                resolve(that.includeViewHTMLToPage(htmlPath, containerClass));
            } else {
                reject(new Error("htmlPath is null. Please add htmlPath"));
            }
        });
    };

    ViewFactory.prototype.includeViewHTMLToPage = function includeChatHTMLToPage (htmlPath, containerClass) {
        var containerDiv = (containerClass) ? getElement(containerClass) : document.body;
        return dataSource.commonAPI.getHTML(htmlPath).then(function (html) {
            containerDiv.innerHTML = html;
        })
    };

    ViewFactory.prototype.includeViewCssToPage = function includeChatCssToPage (link) {
        document.head.appendChild(link);
    };

    ViewFactory.prototype.createCSSLink = function createCSSLink(
        filePath,
        rel,
        type,
        id
    ) {
        var link = document.createElement("link");
        if (id) {
            link.setAttribute("id", id);
        }
        if (rel) {
            link.setAttribute("rel", rel);
        }
        if (type) {
            link.setAttribute("type", type);
        }
        link.setAttribute("href", filePath);
        return link;
    };

    return new ViewFactory()

})(dataSource);

// chat manager

/* global getElement */
/* global chatManagerConfig */
/* exported chatManager */
// Модуль для работы со списком сообщений ОДНОГО пользователя
var messageListManager = (function setupMessageListManager () {
    //  //////////////////////////////////
    // Формат  messageList = [
    //    {
    //       sender: sender
    //       message: message,
    //       read: true/false
    //       date: date
    //    },
    // ]
    // read - было ли прочитано сообщение
    //  ///////////////////////////////////
    function MessageListManager() {}

    MessageListManager.prototype.setup = function (configObj) {
        this.config = configObj;
        this.messageList = [];
        this.cDOM = {
            messagesBlock: getElement(
                this.config.CSS_CHAT_MESSAGES_CONTAINER
            )
        };
    };

    // WORK WITH MESSAGE ELEMENT //

    // Создает DOM элемент сообщения для отображения на экране
    MessageListManager.prototype.createMessageElement = function createMessageElement(
        message,
        messageDate,
        sender,
        isRead
    ) {
        var messageContainerDiv = this.createMessageContainerDiv(isRead, sender);
        var messageDateDiv = this.createDivForMessageBlock(
            messageDate,
            this.config.DISPLAY_MESSAGE_DATE,
            [this.config.CSS_CHAT_MESSAGE_DATE]
        );

        var messageSenderDiv = this.createDivForMessageBlock(
            sender,
            this.config.DISPLAY_SENDER_NAME,
            [this.config.CSS_CHAT_MESSAGE_SENDER_NAME]
        );

        var messageDiv = this.createDivForMessageBlock(
            message,
            this.config.DISPLAY_MESSAGE,
            [this.config.CSS_CHAT_MESSAGE]
        );

        messageContainerDiv.appendChild(messageDateDiv);
        messageContainerDiv.appendChild(messageSenderDiv);
        messageContainerDiv.appendChild(messageDiv);

        return messageContainerDiv;
    };

    MessageListManager.prototype.getMessageObjectsForMarkAsRead = function  getMessageObjectsForMarkAsRead (relativeUserName, relativeUserId) {
        var i;
        var messagesIsRead = [];
        var userName = relativeUserName || this.config.currentUserSettings.userName;
        var userId = relativeUserId || this.config.currentUserSettings.userId;
        for(i = this.messageList.length - 1; i >= 0; i--) {
            if(this.messageList[i].sender !== userName)
            {
                if(!this.messageList[i].read) {
                    messagesIsRead.push(
                        {
                            userId: userId,
                            fieldName:"messages/" + this.messageList[i].id + "/itIsRead",
                            fieldValue: true
                        }
                    );
                } else {
                    break;
                }
            }
        }

        return messagesIsRead;
    };

    MessageListManager.prototype.createMessageContainerDiv = function createMessageContainerDiv (isRead, sender) {
        var messageContainerDiv = document.createElement("div");
        if (!isRead && this.config.currentUserSettings.userName !== sender) {
            messageContainerDiv.classList.add(this.config.CSS_USER_NOT_READ_MESSAGES);
        }
        return messageContainerDiv;
    };

    MessageListManager.prototype.createDivForMessageBlock = function (text, isDisplay, styleClasses) {
        var div = document.createElement("div");
        styleClasses.forEach(function (style) {
            div.classList.add(style);
        });
        div.innerHTML = text;
        return div;
    };

    // WORK WITH MESSAGE ELEMENT //

    MessageListManager.prototype.createMessageList = function createMessageList (messageObjects)  {
        var newMessageList = [];
        if(messageObjects) {
            messageObjects.forEach(function addElementToMessageList (element) {
                newMessageList.push(element);
            });
        }
        return newMessageList;
    };

    MessageListManager.prototype.updateMessageList = function updateMessageList (newMessageList) {
        this.messageList = newMessageList;
        this.displayMessages();
    };

    MessageListManager.prototype.addMessageToMessageList = function addMessageToMessageList (
        messageObj
    ) {
        this.messageList.push(messageObj);
        this.displayMessages();
    };

    // Перебирает список сообщений, создает соответсвующие им DOM элементы и вставляет их в чат
    MessageListManager.prototype.displayMessages = function displayMessages() {
        var that = this;
        var element;
        this.clearChat();
        this.messageList.forEach(function createMessage (messageObject) {
            element = that.createMessageElement(
                messageObject.message,
                messageObject.date,
                messageObject.sender,
                messageObject.read
            );
            that.cDOM.messagesBlock.appendChild(element);
        });
    };

    // Очистить DOM элемент в котором отображаются сообщения (например чтобы вставить нвоый список сообщений)
    MessageListManager.prototype.clearChat = function clearChat() {
        while (this.cDOM.messagesBlock.firstChild) {
            this.cDOM.messagesBlock.removeChild(this.cDOM.messagesBlock.firstChild);
        }
    };

    return new MessageListManager();

})();
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

// dashboard

var userListManager = (function createUserList (config, sorter) {
    //  ////////////////////////////////////////////////////////////////////////
    /* Формат объекта в списке юзера
      * userId: "Ivan300000",
      * userElement: UserListManager.createUserElement(userId, userIsOnline),
      * online: userIsOnline,
      * visible: true,
      * sendNewMessage: userSettings.sendNewMessage,
      * readLastMessage: userSettings.readLastMessage,
      * lastOnline: userSettings.lastOnline,
      * isMinimize: userSettings.isMinimize,
      * userName: userSettings.userName
      *
      * visible - отображать ли юзера на странице
      */
    //  ////////////////////////////////////////////////////////////////////////
    function UserListManager() {
        this.uList = {};
    }

    UserListManager.prototype.setup = function () {};

    // Создает DOM елемент для отображения юзера в списке
    UserListManager.prototype.createUserElement = function createUserElement(
        userId,
        isOnline
    ) {
        var userDiv = document.createElement("div");
        var userIdDiv = document.createElement("div");
        var userIndicator = document.createElement("div");

        userDiv.classList.add(config.USER_ELEMENT_CSS_CLASS);

        userIdDiv.classList.add(config.USER_ID_ELEMENT_CSS_CLASS);
        userIdDiv.innerHTML = userId;

        if (isOnline) {
            userIndicator.classList.add(config.USER_INDICATOR_CSS_CLASS_ONLINE);
        } else {
            userIndicator.classList.add(config.USER_INDICATOR_CSS_CLASS_OFFLINE);
        }

        userDiv.appendChild(userIdDiv);
        userDiv.appendChild(userIndicator);

        return userDiv;
    };

    UserListManager.prototype.setUserList = function setUserList (userLustObject) {
        this.uList = userLustObject;
    };

    UserListManager.prototype.addUserToUsersArray = function addUserToUsersList(
        user,
        userId,
        usersList
    ) {
        var userIsOnline = this.userIsOnline(user.lastOnline);
        usersList.push({
            userId: userId,
            userElement: this.createUserElement(userId, userIsOnline),
            online: userIsOnline,
            visible: true,
            sendNewMessage: user.sendNewMessage,
            readLastMessage: user.readLastMessage,
            lastOnline: user.lastOnline,
            userName: user.userName
        });
    };

    // Возвращает index юзера в списке юзера если он там находится. В противно случае возвращает null
    UserListManager.prototype.getUserFromUserListById = function getUserFromUserListById(userId) {
        var userManager = this;
        var userIndex = null;
        Object.keys(userManager.uList).map(function getKey (key) {
            if (userManager.uList[key].userId === userId) {
                userIndex = key;
            }
            return true;
        });
        return userIndex;
    };


    // Определяет онлайн юзера находя разницу между датой последнего конекта юзера с бд и текущим временем
    // возвращает true если юзер онлайн, false - оффлайн
    UserListManager.prototype.userIsOnline = function userIsOnline (lastUserOnlineTime) {
        var date = new Date();
        return date.getTime() - lastUserOnlineTime <= config.ONLINE_INTERVAL;
    };

    // Делает невидимыми тех пользователей в списке, в именах которых нет переданной подстроки
    UserListManager.prototype.filterByName = function filterByName() {
        this.uList.forEach(function filterName (element) {
            element.visible = element.userId.indexOf(config.currentDashboardCondition.filterBy) !== -1;
        });
    };

    // Сортирует список юзеров по полю
    UserListManager.prototype.sortUsersByField = function sortUsersByOnline() {
        sorter.quickSort(this.uList, 0, this.uList.length - 1, config.currentDashboardCondition.sortBy);
    };

    // Отобразить/ Обновить представление юзеров на странице
    UserListManager.prototype.displayUsers = function displayUsers() {
        clearElementContent(config.DOM.USER_LIST_CSS_CLASS);
        this.uList.forEach(function getElem (elem) {
            if (elem.visible) {
                getElement(config.DOM.USER_LIST_CSS_CLASS).appendChild(elem.userElement);
            }
        });
    };



    // include

    // Очищает DOM содержащий элементы списка юзеров
    function clearElementContent(elementSelector) {
        var element = getElement(elementSelector);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    return new UserListManager()

})(mainConfig, sorter);
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
var launcher = (function createLauncher (config) {

    var DOMVariables = {};

    function Launcher() {

    }

    function createScript () {
        var src = mainConfig.launcher.srcStart +
        DOMVariables.chatTitle.value + "'&chatUrl='" +
        DOMVariables.chatUrl.value + "'&cssClass='" +
        DOMVariables.chatClass.value + "'&position='" +
        DOMVariables.chatPositionSelect.value + "'&allowMinimize='" +
        DOMVariables.allowMinimize.checked + "'&allowDrag='" +
        DOMVariables.allowDrag.checked + "'&showDateTime='" +
        DOMVariables.showTime.checked + "'&requireName='" +
        DOMVariables.requireName.checked + "'&requests='";
        if(DOMVariables.networkRadioXMR.checked) {
            src += "XHR'";
        } else {
            src += "fetch'";
        }
        src += mainConfig.launcher.srcEnd;
        DOMVariables.scriptCode.innerHTML = src;
    }

    Launcher.prototype.startApp = function startApp () {
        mainConfig.launcher.after.map((function createScriptPart (element) {
            DOMVariables[element] =  getElement(mainConfig.launcher.pattern + element, false, true);
            DOMVariables[element].addEventListener("input", createScript);
        }));
    };

    Launcher.prototype.closeApp = function closeApp () {
        DOMVariables = {};
    };

    return new Launcher();

})(mainConfig);
// STUB //
var about = (function () {
    function About() {

    }


    About.prototype.startApp = function startApp () {

    };

    About.prototype.closeApp = function closeApp () {

    };

    return new About();

})();
var matchesHtmlPath = {
    dashboard: mainConfig.DASHBOARD_HTML_PATH,
    configuration: mainConfig.LAUNCHER_HTML_PATH,
    about: mainConfig.ABOUT_HTML_PATH
};


var closeFunctions = {
    dashboard: dashboard.closeApp.bind(dashboard),
    configuration: launcher.closeApp.bind(launcher),
    about: about.closeApp.bind(about)
};

var startFunctions = {
    dashboard: dashboard.startApp.bind(dashboard),
    configuration: launcher.startApp.bind(launcher),
    about: about.startApp.bind(about)
};

// Создать обработчик URL
function handleUrl(url) {
    var hash = null;
    if(url.indexOf("#") === -1){
        return
    }
    hash = url.split('#').pop();
    closePreviousPage(hash);


    getElement('a.' + mainConfig.NAVIGATION_ACTIVE_CSS, true).forEach(function (element) {
        element.classList.remove(mainConfig.NAVIGATION_ACTIVE_CSS)
    });
    getElement('a[href="' + hash + '"]', true).forEach(function (element) {
        element.classList.add(mainConfig.NAVIGATION_ACTIVE_CSS);
    });

    clearElementContent(mainConfig.CONTENT_CLASS);
    viewFactory.createView(matchesHtmlPath[hash], null, mainConfig.CONTENT_CLASS).then(function () {
         startFunctions[hash]();
    });

}

function closePreviousPage(hash) {
     Object.keys(closeFunctions).map(function (key) {
         if(key !== hash) {
             closeFunctions[key]();
         }
     })
}

// Подписаться на изменения URL
window.addEventListener('hashchange', function (element) {
    handleUrl(element.newURL);
});

// При загрузке страницы - считать состояние и запустить обработчик
handleUrl(window.location.href + "#dashboard");