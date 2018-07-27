/* global instructionQueueManager */
var instructionPerformer = (function (config, dataConnector, parser) {

    var instructions = {
        getIp: getUserIP,
        askQuestion: showQuestion
    };

    var questionListener = null;
    var isPerformed = false;

    //= instructions/instructionQueueManager.js

    function executeCommand (instructionName, data, typeOfCommand, callback, context, isNeedNotify, isSaveData) {
        var performerObject = instructions[instructionName].call(null, data, instructionName, callback, context, isNeedNotify, isSaveData);
        if(typeOfCommand === "async") {
            performerObject.then(function () {
                notify(instructionName).then(function () {
                    callback();
                });
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

    function showQuestion(data, instructionName, callback, context, isNeedNotify, isSaveData) {
        var fullCallback;
        fullCallback = function () {
            toggleQuestionMenuVisible();
            if(isNeedNotify) {
                notify(instructionName);
            }
            if(callback) {
                callback.call(context, data);
            }
            if(isSaveData) {
                basicQuestionCallback.call(context, instructionName, data)
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
                    instructionPerformer.execute(key, parameters, data[key].typeOfCommand, checkAvailabilityNewInstructions, null, true, true)
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
                    instructionQueueManager.add(data);
                    executeAllInstruction();
                }
            }
        };
        connection.send()
    }

    function executeAllInstruction (itIsThisStream) {
        var instruction;
        if(instructionQueueManager.length > 0 && (itIsThisStream || !isPerformed)) {
            instruction = instructionQueueManager.next();
            isPerformed = true;
            executeCommand(
                instruction.instuctionName,
                instruction.parameters,
                instruction.typeOfCommand,
                executeAllInstruction.bind(null, true),
                null, true, true
            );
        } else if(itIsThisStream) {
            isPerformed = false;
        }

    }

    return {
        execute: executeCommand,
        setup: checkAvailabilityNewInstructions,
        setupLongPollConnection: setupLongPollConnection
    };

})(mainConfig, dataConnector, longPollResponseParser);