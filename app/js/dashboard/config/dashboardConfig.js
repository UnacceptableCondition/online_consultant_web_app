/* exported mainConfig */
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
        CSS_SORT_SELECT_ID: "root-touchsoft-dashboard_sort",

        // CONTROL PANEL
        // Класс control panel елемент
        CSS_CONTROL_PANEL_LOG_CLASS: "root-touchsoft-dashboard_control-log",
        CSS_CONTROL_PANEL_SELECT_CLASS: "root-touchsoft-dashboard_control_select_command",
        CSS_CONTROL_SEND_COMMAND_BUTTON_CLASS: "root-touchsoft-dashboard_control_send-command-button",
        CSS_CONTROL_PARAMETERS_CLASS: "root-touchsoft-dashboard_control_parameter-input"

    },
    launcher: {
        pattern: "touchsoft_chat-launcher_",
        after : [
            "chatTitle", "chatUrl", "chatClass", "chatPositionSelect",
            "allowMinimize", "allowDrag", "requireName", "showTime", "networkRadioXMR",
            "networkRadioFetch","networkRadioLongPoll", "scriptCode"
        ],
        srcStart: "&ltscript src='https://rawgit.com/UnacceptableCondition/Homework_2/master/js/chat.js?",
        srcEnd:  "'&gt&lt/script&gt"
    },
    userList: {
        // Css классы для работы с объектом списка юзеров
        // Элемент для отображения пользователя
        USER_ELEMENT_CSS_CLASS: "root-touchsoft-dashboard_user",
        // Элемент для отображения id пользователя
        USER_ID_ELEMENT_CSS_CLASS: "root-touchsoft-dashboard_user-id",
        // Элементы для отображения статуса пользователя
        USER_INDICATOR_CSS_CLASS_OFFLINE: "root-touchsoft-dashboard_user-offline",
        USER_INDICATOR_CSS_CLASS_ONLINE: "root-touchsoft-dashboard_user-online"
    },
    chatSettings: {
        typeOfRequest: "longPoll"
    },
    currentUserSettings: {
        userId: null,
        userName: null
    },

    currentDashboardCondition: {
        filterBy: null,
        sortBy: null
    },


    interval: {
        UPDATE_USERS_TIME: 5000,
        ONLINE_INTERVAL: 12000
    },
    router: {
        // URL загрузки страницы about
        ABOUT_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/app/html/dashboard/about.html",
        // URL загрузки страницы configuration
        LAUNCHER_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/app/html/dashboard/chatLauncher.html",
        // URL загрузки страницы dashboard
        DASHBOARD_HTML_PATH: "https://rawgit.com/UnacceptableCondition/online_consultant_web_app/master/app/html/dashboard/dashboard.html",
        // Css класс элемента, в который загружается необходимая часть страницы
        CONTENT_CLASS: "content",
        // Css класс, отмечающий активную страницу в панели навигации
        NAVIGATION_ACTIVE_CSS: "navigation-active"
    },
    messages: {
        // Css класс для элеменат с сообщение, если юзер не прочитал сообщения
        CSS_USER_NOT_READ_MESSAGES: "root-touchsoft-dashboard_message-not-read",
        // Css класс DOM элемента в котором будем отображать сообщения
        CSS_CHAT_MESSAGES_CONTAINER: "root-touchsoft-dashboard_chat-messages",

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


    // класс переключатель отображения элемента
    INVISIBLE_CLASS: "root-touchsoft-dashboard_invisible-element",

    DATA_BASE_URL: "https://onlineconsultantwebapp.firebaseio.com",


    ADMIN_NAME: "Admin",

    // ID DOM элемента дял ввода сообщения перед отправкой юзеру
    CSS_CURRENT_INPUT_CLASS: "root-touchsoft-dashboard_textarea-for-message",

    LOCAL_STORAGE_NAME: "currentCondition",

    // для новых сообщений от пользователей
    // Если юзер прислал соообщение, на юзера в списке вешается этот стиль
    CSS_HAVE_NEW_MESSAGE_STYLE: "root-touchsoft-dashboard_user-have-new-message",

    COMMAND_PATH_PREFIX: "https://onlineconsultantwebapp.firebaseio.com/usersSettings/"




};