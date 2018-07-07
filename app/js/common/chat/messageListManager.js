/* global getElement */
/* global mainConfig */
/* exported messageListManager */
// Модуль для работы со списком сообщений ОДНОГО пользователя
var messageListManager = (function setupMessageListManager (config) {
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
    function MessageListManager() {}

    MessageListManager.prototype.setup = function setup () {
        this.messageList = [];
        this.cDOM = {
            messagesBlock: getElement(
                config.messages.CSS_CHAT_MESSAGES_CONTAINER
            )
        };

    };

    // WORK WITH MESSAGE ELEMENT //

    // Создает DOM элемент сообщения для отображения на экране
    MessageListManager.prototype.createMessageElement = function createMessageElement(
        message,
        messageDate,
        sender,
        isRead
    ) {
        var messageContainerDiv = this.createMessageContainerDiv(isRead, sender);
        var messageDateDiv = this.createDivForMessageBlock(
            messageDate,
            config.DISPLAY_MESSAGE_DATE,
            [config.messages.CSS_CHAT_MESSAGE_DATE]
        );

        var messageSenderDiv = this.createDivForMessageBlock(
            sender,
            config.DISPLAY_SENDER_NAME,
            [config.messages.CSS_CHAT_MESSAGE_SENDER_NAME]
        );

        var messageDiv = this.createDivForMessageBlock(
            message,
            config.DISPLAY_MESSAGE,
            [config.messages.CSS_CHAT_MESSAGE]
        );

        messageContainerDiv.appendChild(messageDateDiv);
        messageContainerDiv.appendChild(messageSenderDiv);
        messageContainerDiv.appendChild(messageDiv);

        return messageContainerDiv;
    };

    MessageListManager.prototype.getMessageObjectsForMarkAsRead = function  getMessageObjectsForMarkAsRead () {
        var i;
        var messagesIsRead = [];
        var userName = config.ADMIN_NAME || config.currentUserSettings.userName;
        var userId = config.currentUserSettings.userId;
        for(i = this.messageList.length - 1; i >= 0; i--) {
            if(this.messageList[i].sender !== userName)
            {
                if(!this.messageList[i].read) {
                    messagesIsRead.push(
                        {
                            userId: userId,
                            fieldName: this.messageList[i].id + "/read",
                            fieldValue: true
                        }
                    );
                    this.messageList[i].read = true;
                } else {
                    break;
                }
            }
        }
        return messagesIsRead;
    };



    MessageListManager.prototype.createMessageContainerDiv = function createMessageContainerDiv (isRead, sender) {
        var messageContainerDiv = document.createElement("div");
        messageContainerDiv.classList.add(config.messages.CSS_MESSAGE_CONTAINER);
        if (!isRead && config.currentUserSettings.userName !== sender) {
            messageContainerDiv.classList.add(config.messages.CSS_USER_NOT_READ_MESSAGES);
        }
        return messageContainerDiv;
    };

    MessageListManager.prototype.createDivForMessageBlock = function createDivForMessageBlock (text, isDisplay, styleClasses) {
        var div = document.createElement("div");
        styleClasses.forEach(function classAdd (style) {
            div.classList.add(style);
        });
        div.innerHTML = text;
        return div;
    };

    // WORK WITH MESSAGE ELEMENT //

    MessageListManager.prototype.createMessageList = function createMessageList (messageObjects)  {
        var newMessageList = [];
        if(messageObjects) {
            messageObjects.forEach(function addElementToMessageList (element) {
                newMessageList.push(element);
            });
        }
        return newMessageList;
    };

    MessageListManager.prototype.updateMessageList = function updateMessageList (newMessageList) {
        if(this.getMessageObjectsForMarkAsRead().length > 0) {
            config.currentUserSettings.readLastMessage = false;
        }
        this.messageList = newMessageList;
        this.displayMessages();
    };

    MessageListManager.prototype.addMessageToMessageList = function addMessageToMessageList (
        messageObj
    ) {
        this.messageList.push(messageObj);
    };

    // Перебирает список сообщений, создает соответсвующие им DOM элементы и вставляет их в чат
    MessageListManager.prototype.displayMessages = function displayMessages() {
        var that = this;
        var element;
        this.clearChat();
        this.messageList.forEach(function createMessage (messageObject) {
            element = that.createMessageElement(
                messageObject.message,
                messageObject.date,
                messageObject.sender,
                messageObject.read
            );
            that.cDOM.messagesBlock.appendChild(element);
        });
    };

    // Очистить DOM элемент в котором отображаются сообщения (например чтобы вставить нвоый список сообщений)
    MessageListManager.prototype.clearChat = function clearChat() {
        while (this.cDOM.messagesBlock.firstChild) {
            this.cDOM.messagesBlock.removeChild(this.cDOM.messagesBlock.firstChild);
        }
    };

    return new MessageListManager();

})(mainConfig);