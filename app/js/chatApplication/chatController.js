/* global userDataManager */
/* global chatCustomizer */
/* global getHash */
/* global getElement */
/* global mainConfig */
/* global viewFactory */
/* global eventEmitter */
var chatController = (function createChatController (config, instructionPerformer, userDataManager) {

    var dataForGetUserNameCallback = [
        "authorization",
        "enter your name, please",
        ""
    ];

    var conditionManager = (function (config) {

        //= appLocalCondition/chatConditionManager.js

        return getAPI();

    })(mainConfig);

    //= ../common/serviceFunctions/getHash.js

    function ChatController() {
        this.createNewUser = userDataManager.createNewUserProfileToDataBase
    }

    ChatController.prototype.startApp = function startAppBasic () {
        var that = this;
        // localStorage.removeItem(config.LOCAL_STORAGE_NAME);
        return this.setupChatView().then(
            function startAuthorizationAndBasicListeners () {
                that.authorization(config.chatSettings.requireName);
                that.setupChatBasicListeners();
            }).then(
            function afterSetupViewConfiguration () {
                userDataManager.getUserData(
                    config.currentUserSettings.userId
                ).then(
                    function afterUserDataSetup () {
                        that.setupChatStyle();
                        that.setupChatSendListeners();
                        chatCustomizer.setupOuterChatSettings();
                        instructionPerformer.startApp(
                            config.chatSettings.typeOfRequest
                        );
                });
            })
    };

    // authorization block //

    ChatController.prototype.authorization = function authorization (userNameIsRequire) {
        userDataManager.setup();
        if(!conditionManager.setupCondition()) {
            config.currentUserSettings.userId = getHash(
                config.DEFAULT_USER_NAME
            );
            if(userNameIsRequire === "false") {
                config.currentUserSettings.userName = config.DEFAULT_USER_NAME;
                conditionManager.saveCondition();
                userDataManager.createNewUserProfileToDataBase(config.currentUserSettings.userId, config.currentUserSettings.userName);
                this.setupIntervalFunctions();
            }
            else {
                instructionPerformer.execute(
                    "askQuestion",
                    dataForGetUserNameCallback,
                    this.getUserNameFromInput,
                    this
                )
            }
        } else {
            conditionManager.setupCondition();
            this.setupIntervalFunctions();
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
        config.chatSettings.isMinimize = false;
        this.createNewUser(config.currentUserSettings.userId, config.currentUserSettings.userName);
        this.setupIntervalFunctions();
        conditionManager.saveCondition();
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
        conditionManager.saveCondition();
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

})(mainConfig, instructionPerformer, userDataManager);


chatController.startApp();