var questionListener = null;

function getIP() {
    return dataConnector.request(
        "https://geoip-db.com/json/",
        null,
        "GET",
        "multipart/form-data"
    );
}

function saveResult(data, dataName) {
    var user = config.currentUserSettings.userId;
    return dataConnector.request(
        "https://onlineconsultantwebapp.firebaseio.com/usersSettings/" +
        user +
        "/" +
        dataName +
        ".json",
        data,
        "PUT",
        "application/json"
    );
}

function getUserIP(instructionName, callback) {
    return getIP().then(function(data) {
        return saveResult(data, "commandsResponse/getIp").then(function() {
            return notify(instructionName).then(function() {
                callback();
            });
        });
    });
}

function notify(pathOfNotify) {
    return dataConnector.request(
        config.COMMAND_PATH_PREFIX +
        config.currentUserSettings.userId +
        "/commands/" +
        pathOfNotify +
        "/isExecute.json",
        true,
        "PUT",
        "application/json"
    );
}

function basicQuestionCallback(instructionName, data) {
    var inputValue = getElement(config.DOM.USER_NAME_INPUT_CLASS).value;
    var inputData = JSON.stringify(inputValue);
    saveResult(inputData, "commandsResponse/" + instructionName + "/" + data[1]);
}

function toggleQuestionMenuVisible() {
    getElement(config.DOM.AUTHORIZATION_MENU_CLASS).classList.toggle(
        config.INVISIBLE_CLASS
    );
}

function showQuestion(
    instructionName,
    callback,
    data,
    context,
    isNeedNotify,
    isSaveData
) {
    var fullCallback;
    fullCallback = function() {
        toggleQuestionMenuVisible();
        if (isNeedNotify) {
            notify(instructionName);
        }
        if (callback) {
            callback.call(context, data);
        }
        if (isSaveData) {
            basicQuestionCallback.call(context, instructionName, data);
        }
    };
    setupQuestionMenu(data);
    if (questionListener) {
        removePreviousQuestionListener();
    }
    questionListener = getAnswerOnQuestion.bind(null, fullCallback);
    setupNewQuestionListener();
    toggleQuestionMenuVisible();
}

function setupQuestionMenu(data) {
    getElement(config.DOM.CHAT_QUESTION_CSS).innerHTML = data[1];
    getElement(config.DOM.USER_NAME_INPUT_CLASS).value = "";
    getElement(config.DOM.USER_NAME_INPUT_CLASS).placeholder = data[0];
}

function setupNewQuestionListener() {
    getElement(config.DOM.SEND_USER_NAME_BUTTON).addEventListener(
        "click",
        questionListener
    );
}

function removePreviousQuestionListener() {
    getElement(config.DOM.SEND_USER_NAME_BUTTON).removeEventListener(
        "click",
        questionListener
    );
}

function getAnswerOnQuestion(callback) {
    callback();
}


function getAPI () {
    return {
        getIp: getUserIP,
        askQuestion: showQuestion
    };
}