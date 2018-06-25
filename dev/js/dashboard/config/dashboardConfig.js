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

    DATA_BASE_URL: "https://onlineconsultantwebapp.firebaseio.com",

    UPDATE_USERS_TIME: 5000,
    ONLINE_INTERVAL: 120000,

    ABOUT_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/dev/html/dashboard/about.html",
    LAUNCHER_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/dev/html/dashboard/chatLauncher.html",
    DASHBOARD_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/dev/html/dashboard/dashboard.html",
    CONTENT_CLASS: "content",

    NAVIGATION_ACTIVE_CSS: "navigation-active"
};