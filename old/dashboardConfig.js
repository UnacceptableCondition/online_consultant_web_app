/* exported getElement */
/* exported dataBaseUrl */
/* exported dataSourceConfig */
/* exported userListManagerConfig */
/* exported chatManagerConfig */
/* exported dashboardControllerConfig */
var getElement = function getElementFromDOM (selector, isAll) {
    if(isAll) {
        return document.querySelectorAll("." + selector);
    }
    return document.querySelector("." + selector);
};
var dataBaseUrl = "https://touchsoftchatproject.firebaseio.com";
var dataSourceConfig = {
    typeOfRequest: "fetch"
};

var userListManagerConfig = {
    // Css классы для работы с объектом списка юзеров
    USER_ELEMENT_CSS_CLASS: "root-touchsoft-dashboard_user",
    USER_ID_ELEMENT_CSS_CLASS: "root-touchsoft-dashboard_user-id",
    USER_INDICATOR_CSS_CLASS_OFFLINE: "root-touchsoft-dashboard_user-offline",
    USER_INDICATOR_CSS_CLASS_ONLINE: "root-touchsoft-dashboard_user-online",
    // Css класс DOM элемента в котором необходимо отображать список юзеров
    USER_LIST_CSS_CLASS: "root-touchsoft-dashboard_users-list",
    // Интервал времени в течение которого юзер считается активным (online)
    ONLINE_INTERVAL: 120000
};

var chatManagerConfig = {
    // Css класс для элеменат с сообщение, если юзер не прочитал сообщения
    CSS_USER_NOT_READ_MESSAGES: "root-touchsoft-dashboard_message-not-read",
    // Css класс DOM элемента в котором будем отображать сообщения
    CSS_CHAT_MESSAGES_CONTAINER: "root-touchsoft-dashboard_chat-messages",
    DEFAULT_ADMIN_NAME: "ADMIN"
};

var dashboardControllerConfig = {
    // Интервал обновления users list
    UPDATE_USERS_TIME: 5000,
    // ID DOM элемента дял ввода параметра фильтрации пользователей
    CSS_FILTER_INPUT_ID: "root-touchsoft-dashboard_filter-input",
    // ID DOM элемента дял ввода параметра сортировки пользователей
    CSS_SORT_SELECT_ID: "root-touchsoft-dashboard_sort",
    // Класс кнопки закрывающей чат
    CSS_CLOSE_CHAT_BUTTON_CLASS: "root-touchsoft-dashboard_close-chat",
    // Если юзер прислал соообщение на юзера в списке вешается этот стиль
    CSS_HAVE_NEW_MESSAGE_STYLE: "root-touchsoft-dashboard_user-have-new-message",
    // Блок в который загружается чат
    CSS_CHAT_CONTAINS_BLOCK_STYLE: "root-touchsoft-dashboard_chat",
    // Стиль скрывающий элемент
    CSS_INVISIBLE_STYLE: "root-touchsoft-dashboard_invisible-element",
    // Класс DOM элемента для отправки сообщения пользователю по нажатию
    CSS_SEND_MESSAGE_BUTTON_CLASS: "root-touchsoft-dashboard_send-button",
    // ID DOM элемента дял ввода сообщения перед отправкой юзеру
    CSS_INPUT_MESSAGE_BLOCK_ID: "root-touchsoft-dashboard_textarea-for-message",
    // продолжительность сигнала о новом сообщении
    BLINK_NEW_MESSAGES_TIME: 1000
};