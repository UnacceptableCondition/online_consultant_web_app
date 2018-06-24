/* global getElement */
/* global chatManagerConfig */
/* exported chatManager */
// Модуль для работы со списком сообщений ОДНОГО пользователя
var chatManager = (function setupChatManager (configObject) {
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

    function ChatManager(configObj) {
        this.config = configObj;
        this.messageList = [];
        this.cDOM = {
            messagesBlock: getElement(
                this.config.CSS_CHAT_MESSAGES_CONTAINER
            )
        };
        this.newMessagesCounter = 0;
    }



    // Возвращает текущую дату
    ChatManager.prototype.getCurrentDate = function getCurrentDate() {
        var date = new Date();
        return date
            .getHours()
            .toString()
            .concat(":", date.getMinutes().toString());
    };

    // Создает DOM элемент сообщения для отображения на экране
    ChatManager.prototype.createMessageElement = function createMessageElement(
        message,
        messageDate,
        userName,
        isRead
    ) {
        var date = messageDate;
        var user = userName;
        var messageDiv = document.createElement("div");
        if (!isRead) {
            messageDiv.classList.add(this.config.CSS_USER_NOT_READ_MESSAGES);
        }
        messageDiv.innerHTML = date + " " + user + ": " + message;

        return messageDiv;
    };

    // Помечает сообщения как непрочитанные если флаг isRead = false;
    // идет по списку с конца и пока не встретит сообщение не Admin, ставит флаг read в false
    ChatManager.prototype.updateMessageList = function updateMessageList (newMessageList) {
        var i;
        var count = 0;
        this.messageList = newMessageList;
        for (i = this.messageList.length - 1; i >= 0; i--) {
            if (this.messageList[i].sender === this.config.DEFAULT_ADMIN_NAME) {
                if (count === this.newMessagesCounter) {
                    break;
                }
                this.messageList[i].read = false;
                count++;
            }
        }
    };

    ChatManager.prototype.createMessageObject = function createMessageObject (
        message,
        date,
        sender,
        isRead
    ) {
        return {
            sender: sender,
            message: message,
            read: isRead,
            date: date
        };
    };

    ChatManager.prototype.addMessageToMessageList = function addMessageToMessageList (newMessage) {
        this.messageList.push(newMessage);
    };

    // Перебирает список сообщений, создает соответсвующие им DOM элементы и вставляет их в чат
    ChatManager.prototype.displayMessages = function displayMessages() {
        var chatManagerRef = this;
        var element;
        this.clearChat();
        this.messageList.forEach(function createMessage (messageObject) {
            element = chatManagerRef.createMessageElement(
                messageObject.message,
                messageObject.date,
                messageObject.sender,
                messageObject.read
            );
            chatManagerRef.cDOM.messagesBlock.appendChild(element);
        });
    };

    // Очистить DOM элемент в котором отображаются сообщения (например чтобы вставить нвоый список сообщений)
    ChatManager.prototype.clearChat = function clearChat() {
        while (this.cDOM.messagesBlock.firstChild) {
            this.cDOM.messagesBlock.removeChild(this.cDOM.messagesBlock.firstChild);
        }
    };

    return new ChatManager(configObject);

})(chatManagerConfig);