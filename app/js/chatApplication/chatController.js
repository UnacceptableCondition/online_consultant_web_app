var chatController = (function (config) {

    // INCLUDE //

    //= ../common/serviceFunctions/getHash.js

    // INCLUDE //

    function ChatController() {}

    ChatController.prototype.startApp = function () {
        var that = this;
        // localStorage.removeItem(config.LOCAL_STORAGE_NAME);
        return this.setupChatView().then( function () {
            that.authorization(config.chatSettings.requireName);
            that.setupChatBasicListeners();
        }).then(function () {
            if(config.currentUserSettings.userId) {
                userDataManager.getUserData(config.currentUserSettings.userId).then(function () {
                    that.setupChatStyle();
                    that.setupIntervalFunctions();
                    that.setupChatSendListeners();
                });
            } else {
                that.setupChatStyle();
            }
        }).then(function () {
            chatCustomizer.setupOuterChatSettings();
        })
    };

    // authorization block //

    ChatController.prototype.authorization = function authorization (userNameIsRequire) {
        userDataManager.setup(config);
        config.currentUserSettings.userId = this.getUserIdFromLocalStorage();
        if(!config.currentUserSettings.userId) {
            if(userNameIsRequire === "false") {
                config.currentUserSettings.userId = getHash(config.DEFAULT_USER_NAME);
                config.currentUserSettings.userName = config.DEFAULT_USER_NAME;
                this.saveUserIdToLocalStorage(config.currentUserSettings.userId);
                userDataManager.createNewUserProfileToDataBase();
            }
            else {
                this.toggleAuthorizationMenuVisible();
            }
        }
    };

    ChatController.prototype.toggleAuthorizationMenuVisible = function () {
        getElement(config.DOM.AUTHORIZATION_MENU_CLASS).classList.toggle(
            config.INVISIBLE_CLASS
        )
    };

    // Если требуется ввести имя, получаем его и заносим юзера в бд
    ChatController.prototype.getUserNameFromInput = function () {
        config.currentUserSettings.userName = getElement(
            config.DOM.USER_NAME_INPUT_CLASS
        ).value;
        config.currentUserSettings.userId = getHash(
            config.currentUserSettings.userName
        );
        userDataManager.setup(config);
        userDataManager.createNewUserProfileToDataBase();
        this.saveUserIdToLocalStorage(config.currentUserSettings.userId);
        this.toggleAuthorizationMenuVisible();
        this.setupIntervalFunctions();
        this.setupChatSendListeners();
    };

    // Setup Chat //

    ChatController.prototype.setupChatSendListeners = function () {
        // setup chat listeners
        getElement(config.DOM.SEND_MESSAGE_FULL_SIZE_BUTTON).addEventListener(
            'click',
            userDataManager.sendMessage.bind(userDataManager,
                config.currentUserSettings.userName
            )
        );

        getElement(config.DOM.SEND_MESSAGE_MIN_SIZE_BUTTON).addEventListener(
            'click',
            userDataManager.sendMessage.bind(userDataManager,
                config.currentUserSettings.userName
            )
        );
        document.addEventListener("mousemove", userDataManager.setMessageAsRead.bind(userDataManager));
    };

    ChatController.prototype.setupChatBasicListeners = function () {
        var that = this;
        getElement(config.DOM.SEND_USER_NAME_BUTTON).addEventListener(
            "click",
            that.getUserNameFromInput.bind(that)
        );
        getElement(config.DOM.SET_MAX_STYLE_BUTTON).addEventListener(
            'click',
            that.minMaxStyleToggle.bind(that)
        );
        getElement(config.DOM.SET_MIN_STYLE_BUTTON).addEventListener(
            'click',
            that.minMaxStyleToggle.bind(that)
        );
    };


    ChatController.prototype.setupChatView = function setupChatView () {
        return viewFactory.createView(config.HTML_FILE_PATH, config.CSS_FILE_PATH, null);
    };

    ChatController.prototype.setupChatStyle = function setupChatStyle() {
        if (!config.currentUserSettings.isMinimize) {
            getElement(config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
                config.INVISIBLE_CLASS
            );
        } else {
            getElement(config.DOM.MINIMIZE_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
                config.INVISIBLE_CLASS
            );
        }
    };

    ChatController.prototype.minMaxStyleToggle = function minMaxStyleToggle() {
        getElement(config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
            config.INVISIBLE_CLASS
        );
        getElement(config.DOM.MINIMIZE_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
            config.INVISIBLE_CLASS
        );
        config.currentUserSettings.isMinimize = config.currentUserSettings.isMinimize === false;
        this.changeInputAndSendButtonClass();
        userDataManager.saveSettingField("isMinimize");
    };

    ChatController.prototype.activityNotify = function activityNotify () {
        var date = new Date();
        config.currentUserSettings.lastOnline = date.getTime();
        userDataManager.saveSettingField("lastOnline");
    };

    ChatController.prototype.changeInputAndSendButtonClass = function () {
        if(config.currentUserSettings.isMinimize) {
            config.CSS_CURRENT_INPUT_CLASS = config.DOM.CSS_MIN_SIZE_INPUT_MESSAGE_BLOCK_CLASS
        } else {
            config.CSS_CURRENT_INPUT_CLASS = config.DOM.CSS_MAX_SIZE_INPUT_MESSAGE_BLOCK_CLASS
        }
    };

    // WORK WITH LOCAL STORAGE //

    ChatController.prototype.saveUserIdToLocalStorage = function saveUserIdToLocalStorage(userId) {
        localStorage.setItem(config.LOCAL_STORAGE_NAME, userId);
    };

    ChatController.prototype.getUserIdFromLocalStorage = function getUserIdFromLocalStorage () {
        return localStorage.getItem(config.LOCAL_STORAGE_NAME);
    };

    // WORK WITH LOCAL STORAGE //

    ChatController.prototype.setupIntervalFunctions = function () {
        var that = this;
        setInterval( function () {
            userDataManager.getUserData(config.currentUserSettings.userId);
            that.activityNotify();
        }, config.UPDATE_USER_DATA_TIME)
    };

    return new ChatController();

})(mainConfig);

chatController.startApp();