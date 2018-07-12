/* global userDataManager */
/* global chatCustomizer */
/* global getHash */
/* global getElement */
/* global mainConfig */
/* global viewFactory */
/* global eventEmitter */
var chatController = (function createChatController (config) {

    // INCLUDE //

    //= ../common/serviceFunctions/getHash.js

    // INCLUDE //

    function ChatController() {}

    ChatController.prototype.startApp = function startAppBasic () {
        var that = this;
        // localStorage.removeItem(config.LOCAL_STORAGE_NAME);
        return this.setupChatView().then( function startAuthorizationAndBasicListeners () {
            that.authorization(config.chatSettings.requireName);
            that.setupChatBasicListeners();
        }).then(function afterSetupViewConfiguration () {
            if(config.currentUserSettings.userId) {
                userDataManager.getUserData(config.currentUserSettings.userId).then(function afterUserDataSetup () {
                    that.setupChatStyle();
                    that.setupIntervalFunctions();
                    that.setupChatSendListeners();
                });
            } else {
                that.setupChatStyle();
            }
        }).then(function postChatSetup () {
            chatCustomizer.setupOuterChatSettings();
        })
    };

    // authorization block //

    ChatController.prototype.authorization = function authorization (userNameIsRequire) {
        userDataManager.setup();
        if(!this.getConditionFromLocalStorage()) {
            if(userNameIsRequire === "false") {
                config.currentUserSettings.userId = getHash(config.DEFAULT_USER_NAME);
                config.currentUserSettings.userName = config.DEFAULT_USER_NAME;
                this.saveConditionToLocalStorage();
                userDataManager.createNewUserProfileToDataBase(config.currentUserSettings.userId, config.currentUserSettings.userName);
            }
            else {
                this.toggleAuthorizationMenuVisible();
            }
        } else {
            this.setupChatCondition();
        }
    };

    ChatController.prototype.toggleAuthorizationMenuVisible = function toggleAuthorizationMenuVisible () {
        getElement(config.DOM.AUTHORIZATION_MENU_CLASS).classList.toggle(
            config.INVISIBLE_CLASS
        )
    };


    // Если требуется ввести имя, получаем его и заносим юзера в бд
    ChatController.prototype.getUserNameFromInput = function getUserNameFromInput () {
        config.currentUserSettings.userName = getElement(
            config.DOM.USER_NAME_INPUT_CLASS
        ).value;
        config.currentUserSettings.userId = getHash(
            config.currentUserSettings.userName
        );
        config.chatSettings.isMinimize = false;
        userDataManager.createNewUserProfileToDataBase(config.currentUserSettings.userId, config.currentUserSettings.userName);
        this.saveConditionToLocalStorage();
        this.toggleAuthorizationMenuVisible();
        this.setupIntervalFunctions();
        this.setupChatSendListeners();
        userDataManager.getUserData(config.currentUserSettings.userId);
    };

    // Setup Chat //

    ChatController.prototype.setupChatSendListeners = function setupChatSendListeners () {
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

    ChatController.prototype.setupChatBasicListeners = function setupChatBasicListeners () {
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
        this.changeInputAndSendButtonClass();
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
        this.saveConditionToLocalStorage();
    };

    ChatController.prototype.activityNotify = function activityNotify () {
        userDataManager.updateUserOnline(config.currentUserSettings.userId);
    };

    ChatController.prototype.changeInputAndSendButtonClass = function changeInputAndSendButtonClass () {
        if(config.currentUserSettings.isMinimize) {
            config.CSS_CURRENT_INPUT_CLASS = config.DOM.CSS_MIN_SIZE_INPUT_MESSAGE_BLOCK_CLASS
        } else {
            config.CSS_CURRENT_INPUT_CLASS = config.DOM.CSS_MAX_SIZE_INPUT_MESSAGE_BLOCK_CLASS
        }
    };

    // WORK WITH LOCAL STORAGE //

    ChatController.prototype.setupChatCondition = function setupChatCondition () {
        var condition = this.getConditionFromLocalStorage();
        config.currentUserSettings.userId = this.getConditionFromLocalStorage().userId;
        config.currentUserSettings.userName = this.getConditionFromLocalStorage().userName;
        config.currentUserSettings.isMinimize = condition.isMinimize;
    };

    ChatController.prototype.saveConditionToLocalStorage = function saveConditionToLocalStorage() {
        var data = JSON.stringify({
            userId: config.currentUserSettings.userId,
            isMinimize: config.currentUserSettings.isMinimize,
            userName: config.currentUserSettings.userName
        });
        localStorage.setItem(config.LOCAL_STORAGE_NAME, data);
    };

    ChatController.prototype.getConditionFromLocalStorage = function getConditionFromLocalStorage () {
        var condition = localStorage.getItem(config.LOCAL_STORAGE_NAME);
        if(condition) {
            return JSON.parse(condition);
        }
        return false;
    };

    // WORK WITH LOCAL STORAGE //

    ChatController.prototype.setupIntervalFunctions = function setupIntervalFunctions () {
        var that = this;
        setInterval( function intervalFunctions () {
            if(config.chatSettings.typeOfRequest !== "longPoll") {
                userDataManager.getUserData(config.currentUserSettings.userId);
            }
            that.activityNotify();
        }, config.UPDATE_USER_DATA_TIME)
    };

    return new ChatController();

})(mainConfig, eventEmitter);


chatController.startApp();