var instructionPerformer = (function (config, dataConnector, parser) {

    var instructions = {
        getIp: getUserIP,
        askQuestion: showQuestion
    };

    var questionListener = null;
    var instructionsQueue = [];

    function executeCommand (instructionName, data, typeOfCommand, callback, context, isNeedNotify) {
        var performerObject = instructions[instructionName].call(null, data, instructionName, callback, context, isNeedNotify);
        if(typeOfCommand === "async") {
            performerObject.then(function () {
                instructionsCallback(instructionName);
            })
        }
    }

    function getIP () {
        return dataConnector.request(
            "https://geoip-db.com/json/",
            null,
            "GET",
            "multipart/form-data"
        )
    }

    function saveResult(data, dataName) {
        var user = config.currentUserSettings.userId;
        return dataConnector.request(
            "https://onlineconsultantwebapp.firebaseio.com/usersSettings/" + user + "/" + dataName + ".json",
            data,
            "PUT",
            "application/json"
        )
    }

    function getUserIP() {
        return getIP().then(function (data) {
            return saveResult(data, "commandsResponse/getIp")
        })
    }

    function basicQuestionCallback (instructionName, data) {
        var inputValue =  getElement(
            config.DOM.USER_NAME_INPUT_CLASS
        ).value;
        var inputData = JSON.stringify(inputValue);
        saveResult(inputData, "commandsResponse/" + instructionName + "/" + data[1])
    }


    function toggleQuestionMenuVisible () {
        getElement(config.DOM.AUTHORIZATION_MENU_CLASS).classList.toggle(
            config.INVISIBLE_CLASS
        )
    }

    function showQuestion(data, instructionName, callback, context, isNeedNotify) {
        var bindCallback;
        var fullCallback;
        if(callback) {
            bindCallback = callback.bind(context, instructionName, data);
        } else {
            bindCallback = basicQuestionCallback.bind(context, instructionName, data)
        }
        fullCallback = function () {
            bindCallback();
            toggleQuestionMenuVisible();
            if(isNeedNotify) {
                instructionsCallback(instructionName);
            }
        };
        setupQuestionMenu(data);
        if(questionListener) {
            removePreviousQuestionListener();
        }
        questionListener = getAnswerOnQuestion.bind(null, fullCallback);
        setupNewQuestionListener();
        toggleQuestionMenuVisible();
    }

    function setupQuestionMenu(data) {
        getElement(config.DOM.CHAT_QUESTION_CSS).innerHTML = data[1];
    }

    function setupNewQuestionListener() {
        getElement(config.DOM.SEND_USER_NAME_BUTTON).addEventListener("click", questionListener)
    }

    function removePreviousQuestionListener() {
        getElement(config.DOM.SEND_USER_NAME_BUTTON).removeEventListener("click", questionListener)
    }

    function getAnswerOnQuestion (callback) {
        callback()
    }

    function instructionsCallback(key) {
        notify(key).then(function () {
            checkAvailabilityNewInstructions();
        })
    }

    function checkAvailabilityNewInstructions () {
        var keyOfCommands;
        var parameters;
        var key;
        setTimeout(function () {
            dataConnector.request(
                config.COMMAND_PATH_PREFIX + config.currentUserSettings.userId + "/commands.json",
                null,
                "GET",
                "application/json"
            ).then(function (data) {
                keyOfCommands = hasInstructionKey(data);
                if(keyOfCommands.length > 0) {
                    key = keyOfCommands.pop();
                    parameters = getParameters(data[key]);
                    instructionPerformer.execute(key, parameters, data[key].typeOfCommand, null, null, true)
                } else {
                    checkAvailabilityNewInstructions();
                }
            })
        },config.UPDATE_USER_DATA_TIME)
    }

    function getParameters(commandData) {
        var parameters = [];
        var i;
        for(i = 0; i < commandData.parametersNumber; i++) {
            parameters.push(commandData["parameter" + i])
        }
        return parameters;
    }

    function hasInstructionKey(commands) {
        if(!commands) {
            return [];
        }
        return Object.keys(commands).filter(function (commandObject) {
            return !commands[commandObject].isExecute;
        })
    }

    function notify (pathOfNotify) {
        return dataConnector.request(
            config.COMMAND_PATH_PREFIX + config.currentUserSettings.userId + "/commands/" + pathOfNotify + "/isExecute.json",
            true,
            "PUT",
            "application/json"
        );
    }

    function setupLongPollConnection () {
        var connection = dataConnector.createLongPollConnection(
            config.COMMAND_PATH_PREFIX + config.currentUserSettings.userId + "/commands.json"
        );
        connection.onreadystatechange = function commandChangeCallback () {
            var data;
            if (this.readyState === 3 && this.status === 200) {
                data = parser.parse(this.responseText).object;
                if(data) {
                    if(data instanceof Array) {
                        data.forEach(function (instructions) {
                            Object.keys(instructions).map(function (instructionName) {
                                if(!instructions[instructionName].isExecute) {
                                    instructionsQueue.push(instructions[instructionName]);
                                }
                            })
                        });
                    } else {
                        instructionsQueue.push(data);
                    }
                    console.log(instructionsQueue);
                    // keyOfCommands = hasInstructionKey(data);
                    // if(keyOfCommands.length > 0) {
                    //     key = keyOfCommands.pop();
                    //     parameters = getParameters(data[key]);
                    //     instructionPerformer.execute(key, parameters, data[key].typeOfCommand, null, null, true)
                    // logElement.innerHTML = JSON.stringify(data.object);

                    // console.log(getParameters(data));
                    // console.log(keyOfCommands);
                }
            }
        };
        connection.send()
    }

    return {
        execute: executeCommand,
        setup: checkAvailabilityNewInstructions,
        setupLongPollConnection: setupLongPollConnection
    };

})(mainConfig, dataConnector, longPollResponseParser);