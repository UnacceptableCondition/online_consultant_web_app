function executeCommand (instructionName, data, callback, context, isNeedNotify, isSaveData) {
    if(instructions[instructionName]) {
        instructions[instructionName].call(null, instructionName, callback, data, context, isNeedNotify, isSaveData);
    } else {
        throw new Error("required command is not found")
    }
}

function startApplication (typeOfConnection) {
    if(typeOfConnection === "longPoll") {
        setupLongPollConnection();
    } else {
        isStartXHRConnection = true;
        setupXHRConnection()
    }
}

function closeApplication() {
    if(connection) {
        connection.abort();
    }
    if(isStartXHRConnection) {
        isStartXHRConnection = false;
    }
}
