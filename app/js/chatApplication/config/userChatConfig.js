var mainConfig = {
    DOM: {
        MAIN_STYLE_CHAT_BLOCK_CLASS: "root_chat_for_touchsoft",
        AUTHORIZATION_MENU_CLASS: "root_chat_for_touchsoft_input-name-block",
        USER_NAME_INPUT_CLASS: "root_chat_for_touchsoft_input-name",
        SEND_USER_NAME_BUTTON: "root_chat_for_touchsoft_input-name-button",

        SEND_MESSAGE_MIN_SIZE_BUTTON: "root_chat_for_touchsoft_minimize-style__send-button",

        SEND_MESSAGE_FULL_SIZE_BUTTON: "root_chat_for_touchsoft__bottom_send-button",
        // Элемент для ввода сообщения
        CSS_MAX_SIZE_INPUT_MESSAGE_BLOCK_CLASS: "root_chat_for_touchsoft__textarea",
        CSS_MIN_SIZE_INPUT_MESSAGE_BLOCK_CLASS: "root_chat_for_touchsoft_minimize-style__message-input",
        // Элемент title
        TITLE_BLOCK_CLASS: "root_chat_for_touchsoft-title",
        CHANGE_STYLE_BUTTON_MAX_SIZE: "root_chat_for_touchsoft__top_minimize-button",
        // чат в стиле min
        MINIMIZE_STYLE_CHAT_BLOCK_CLASS: "root_chat_for_touchsoft_minimize-style",
        SET_MIN_STYLE_BUTTON: "root_chat_for_touchsoft_minimize-style__max-button",
        SET_MAX_STYLE_BUTTON: "root_chat_for_touchsoft__top_minimize-button"

    },

    // dataSource
    DATA_BASE_URL: "https://onlineconsultantwebapp.firebaseio.com",


    // userDataManager
    CSS_CURRENT_INPUT_CLASS: "root_chat_for_touchsoft__textarea",

    // настройки текущего пользователь
    currentUserSettings: {
        userId: null,
        userName: null,
        isMinimize: false,
        readLastMessage: false,
        sendNewMessage: false,
        lastOnline: new Date().getTime()
    },

    chatSettings: {
        allowDrag: false,
        position: "right",
        chatTitle: "TouchSoft Chat",
        allowMinimize: true,
        outerCssClass: 'touchsoft-chat_main-block',
        typeOfRequest: "fetch",
        requireName: true
    },

    // класс переключатель отображения элемента
    INVISIBLE_CLASS: "invisible",
    CHAT_POSITION_RIGHT: "root_chat_for_touchsoft_right-position",
    CHAT_POSITION_LEFT: "root_chat_for_touchsoft_left-position",


    LOCAL_STORAGE_NAME: "userID_touchsoft_chat",
    DEFAULT_USER_NAME: "guest",

    DEFAULT_CSS_CLASS_FOR_CHAT: 'touchsoft-chat_main-block',
    DEFAULT_CHAT_TITLE: "TouchSoft Chat",

    // chatViewConfig
    // откуда загружает html и css чата
    HTML_FILE_PATH:
        "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/app/html/chatApplication/chat.html",
    CSS_FILE_PATH:
        "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/app/css/chat.css",

    // Классы для работы с объектами сообщений для их отображения в чате
    messages: {
        // Css класс для элеменат с сообщение, если юзер не прочитал сообщения
        CSS_USER_NOT_READ_MESSAGES: "root-touchsoft-dashboard_message-not-read",
        // Css класс DOM элемента в котором будем отображать сообщения
        CSS_CHAT_MESSAGES_CONTAINER: "root_chat_for_touchsoft__top_messages",

        // message
        // Css класс элемента в котором находится сообщения,дата и имя отправителя
        CSS_MESSAGE_CONTAINER: "root-touchsoft-dashboard_chat-message-elements",
        // Css класс DOM элемента в котором будем отображать имя отправителя
        CSS_CHAT_MESSAGE_SENDER_NAME: "root-touchsoft-dashboard_chat-message-sender",
        // Css класс DOM элемента в котором будем отображать дату сообщения
        CSS_CHAT_MESSAGE_DATE: "root-touchsoft-dashboard_chat-message-date",
        // Css класс DOM элемента в котором будем отображать сообщение
        CSS_CHAT_MESSAGE: "root-touchsoft-dashboard_chat-message"

    },

    DISPLAY_MESSAGE_DATE: true,
    DISPLAY_SENDER_NAME: true,
    DISPLAY_MESSAGE: true,

    UPDATE_USER_DATA_TIME: 5000
};

// INCLUDE
function parseSrcForParameters(
    src
) {
    var userConfigObject = {};
    var arrParam = src.substr(src.indexOf("?") + 1).split("&");
    arrParam.forEach(function createConfigObj (element) {
        var paramObj = element.split("=");
        paramObj[1] = paramObj[1].replace(/'/g, "");
        userConfigObject[paramObj[0]] = paramObj[1];
    });
    return userConfigObject;
}

function setOuterChatSettingToConfig (outerConfigObject, config) {
    Object.keys(outerConfigObject).map(function getOuterSettings (key) {
        config.chatSettings[key] = outerConfigObject[key];
        return true;
    })
}

// INCLUDE

setOuterChatSettingToConfig(parseSrcForParameters(document.currentScript.getAttribute("src")), mainConfig);
