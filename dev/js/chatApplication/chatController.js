var chatController = (function () {

    function ChatController() {}

    ChatController.prototype.setup = function setup (chatControllerConfig) {
        this.config = chatControllerConfig;
    };

    ChatController.prototype.startApp = function () {
        var that = this;
        // localStorage.removeItem(this.config.LOCAL_STORAGE_NAME);
        return this.setupChatView().then( function () {
            that.authorization(that.config.chatSettings.requireName);
            that.setupChatBasicListeners();
        }).then(function () {
            if(that.config.currentUserSettings.userId) {
                userDataManager.getUserData(that.config.currentUserSettings.userId).then(function () {
                    that.setupChatStyle();
                    that.setupIntervalFunctions();
                    that.setupChatSendListeners();
                });
            } else {
                that.setupChatStyle();
            }
        }).then(function () {
            chatCustomizer.setup(that.config);
            chatCustomizer.setupOuterChatSettings();

        })
    };

    // authorization block //

    ChatController.prototype.authorization = function authorization (userNameIsRequire) {
        userDataManager.setup(this.config);
        this.config.currentUserSettings.userId = this.getUserIdFromLocalStorage();
        if(!this.config.currentUserSettings.userId) {
            if(userNameIsRequire === "false") {
                this.config.currentUserSettings.userId = this.getHash(this.config.DEFAULT_USER_NAME);
                this.config.currentUserSettings.userName = this.config.DEFAULT_USER_NAME;
                this.saveUserIdToLocalStorage(this.config.currentUserSettings.userId);
                userDataManager.createNewUserProfileToDataBase();
            }
            else {
                this.toggleAuthorizationMenuVisible();
            }
        }
    };

    ChatController.prototype.toggleAuthorizationMenuVisible = function () {
        getElement(this.config.DOM.AUTHORIZATION_MENU_CLASS).classList.toggle(
            this.config.INVISIBLE_CLASS
        )
    };

    ChatController.prototype.getHash = function getHash(str) {
        var date = new Date();
        return str + date.getTime();
    };

    // Если требуется ввести имя, получаем его и заносим юзера в бд
    ChatController.prototype.getUserNameFromInput = function () {
        this.config.currentUserSettings.userName = getElement(
            this.config.DOM.USER_NAME_INPUT_CLASS
        ).value;
        this.config.currentUserSettings.userId = this.getHash(
            this.config.currentUserSettings.userName
        );
        userDataManager.setup(this.config);
        userDataManager.createNewUserProfileToDataBase();
        this.saveUserIdToLocalStorage(this.config.currentUserSettings.userId);
        this.toggleAuthorizationMenuVisible();
        this.setupIntervalFunctions();
        this.setupChatSendListeners();
    };

    // Setup Chat //

    ChatController.prototype.setupChatSendListeners = function () {
        // setup chat listeners
        var that = this;
        getElement(that.config.DOM.SEND_MESSAGE_FULL_SIZE_BUTTON).addEventListener(
            'click',
            userDataManager.sendMessage.bind(userDataManager,
                that.config.currentUserSettings.userName
            )
        );

        getElement(that.config.DOM.SEND_MESSAGE_MIN_SIZE_BUTTON).addEventListener(
            'click',
            userDataManager.sendMessage.bind(userDataManager,
                that.config.currentUserSettings.userName
            )
        );
        document.addEventListener("mousemove", userDataManager.setMessageAsRead.bind(userDataManager));
    };

    ChatController.prototype.setupChatBasicListeners = function () {
        var that = this;
        getElement(that.config.DOM.SEND_USER_NAME_BUTTON).addEventListener(
            "click",
            that.getUserNameFromInput.bind(that)
        );
        getElement(that.config.DOM.SET_MAX_STYLE_BUTTON).addEventListener(
            'click',
            that.minMaxStyleToggle.bind(that)
        );
        getElement(that.config.DOM.SET_MIN_STYLE_BUTTON).addEventListener(
            'click',
            that.minMaxStyleToggle.bind(that)
        );
    };


    ChatController.prototype.setupChatView = function setupChatView () {
        return viewFactory.createView(this.config.HTML_FILE_PATH, this.config.CSS_FILE_PATH, null);
    };

    ChatController.prototype.setupChatStyle = function setupChatStyle() {
        if (!this.config.currentUserSettings.isMinimize) {
            getElement(this.config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
                this.config.INVISIBLE_CLASS
            );
        } else {
            getElement(this.config.DOM.MINIMIZE_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
                this.config.INVISIBLE_CLASS
            );
        }
    };

    ChatController.prototype.minMaxStyleToggle = function minMaxStyleToggle() {
        getElement(this.config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
            this.config.INVISIBLE_CLASS
        );
        getElement(this.config.DOM.MINIMIZE_STYLE_CHAT_BLOCK_CLASS).classList.toggle(
            this.config.INVISIBLE_CLASS
        );
        this.config.currentUserSettings.isMinimize = this.config.currentUserSettings.isMinimize === false;
        this.changeInputAndSendButtonClass();
        userDataManager.saveSettingField("isMinimize");
    };

    ChatController.prototype.activityNotify = function activityNotify () {
        var date = new Date();
        this.config.currentUserSettings.lastOnline = date.getTime();
        userDataManager.saveSettingField("lastOnline");
    };

    ChatController.prototype.changeInputAndSendButtonClass = function () {
        if(this.config.currentUserSettings.isMinimize) {
            this.config.CSS_CURRENT_INPUT_CLASS = this.config.DOM.CSS_MIN_SIZE_INPUT_MESSAGE_BLOCK_CLASS
        } else {
            this.config.CSS_CURRENT_INPUT_CLASS = this.config.DOM.CSS_MAX_SIZE_INPUT_MESSAGE_BLOCK_CLASS
        }
    };

    // WORK WITH LOCAL STORAGE //

    ChatController.prototype.saveUserIdToLocalStorage = function saveUserIdToLocalStorage(userId) {
        localStorage.setItem(this.config.LOCAL_STORAGE_NAME, userId);
    };

    ChatController.prototype.getUserIdFromLocalStorage = function getUserIdFromLocalStorage () {
        return localStorage.getItem(this.config.LOCAL_STORAGE_NAME);
    };

    // WORK WITH LOCAL STORAGE //

    ChatController.prototype.setupIntervalFunctions = function () {
        var that = this;
        setInterval( function () {
            userDataManager.getUserData(that.config.currentUserSettings.userId);
            that.activityNotify();
        }, that.config.UPDATE_USER_DATA_TIME)
    };

    return new ChatController();

})();

chatController.setup(mainConfig);
chatController.startApp();