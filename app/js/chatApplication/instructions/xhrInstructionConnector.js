function setupXHRConnection () {
    var keyOfCommands;
    var parameters;
    var key;
    if(isStartXHRConnection) {
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
                    instructionPerformer.execute(key, parameters, setupXHRConnection, null, true, true)
                } else {
                    setupXHRConnection();
                }
            })
        },config.UPDATE_USER_DATA_TIME)
    }
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