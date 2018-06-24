/* exported userListManager */
/* global getElement */
/* global sorter */
/* global userListManagerConfig */
// Модуль содержит объект списка юзеров и функции для работы с этим списком
// такие как фильтрация, сортировка и тд
var userListManager = (function createUserList (sortObject, configObject) {
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

    function UserListManager(sortObj, configObj) {
        this.config = configObj;
        this.uList = {};
        this.uDOM = {
            usersList: getElement(
                this.config.USER_LIST_CSS_CLASS
            )
        };
        this.sorter = sortObj;
    }

    function createUserListManager(sortObj, configObj) {
        return new UserListManager(sortObj, configObj);
    }

    // Очищает DOM содержащий элементы списка юзеров
    UserListManager.prototype.clearUsersListDOM = function clearUsersList() {
        while (this.uDOM.usersList.firstChild) {
            this.uDOM.usersList.removeChild(this.uDOM.usersList.firstChild);
        }
    };

    // Создает DOM елемент для отображения юзера в списке
    UserListManager.prototype.createUserElement = function createUserElement(
        userId,
        isOnline
    ) {
        var userDiv = document.createElement("div");
        var userIdDiv = document.createElement("div");
        var userIndicator = document.createElement("div");

        userDiv.classList.add(this.config.USER_ELEMENT_CSS_CLASS);

        userIdDiv.classList.add(this.config.USER_ID_ELEMENT_CSS_CLASS);
        userIdDiv.innerHTML = userId;

        if (isOnline) {
            userIndicator.classList.add(this.config.USER_INDICATOR_CSS_CLASS_ONLINE);
        } else {
            userIndicator.classList.add(this.config.USER_INDICATOR_CSS_CLASS_OFFLINE);
        }

        userDiv.appendChild(userIdDiv);
        userDiv.appendChild(userIndicator);

        return userDiv;
    };

    UserListManager.prototype.setUserList = function setUserList (userLustObject) {
        this.uList = userLustObject;
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
        return date.getTime() - lastUserOnlineTime <= this.config.ONLINE_INTERVAL;
    };

    // Делает невидимыми тех пользователей в списке, в именах которых нет переданной подстроки
    UserListManager.prototype.filterByName = function filterByName(str) {
        this.uList.forEach(function filterName (element) {
            element.visible = element.userId.indexOf(str) !== -1;
        });
    };

    // Сортирует список юзеров по полю
    UserListManager.prototype.sortUsersByField = function sortUsersByOnline(
        sortField
    ) {
        this.sorter.quickSort(this.uList, 0, this.uList.length - 1, sortField);
    };

    // Отобразить/ Обновить представление юзеров на странице
    UserListManager.prototype.displayUsers = function displayUsers() {
        var userManager = this;
        this.clearUsersListDOM();
        this.uList.forEach(function getElem (elem) {
            if (elem.visible) {
                userManager.uDOM.usersList.appendChild(elem.userElement);
            }
        });
    };

    return createUserListManager(sortObject, configObject);
})(sorter, userListManagerConfig);