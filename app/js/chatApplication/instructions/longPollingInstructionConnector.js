function setupLongPollConnection () {
    connection = dataConnector.createLongPollConnection(
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
            executeAllInstruction.bind(null, true),
            null, true, true
        );
    } else if(itIsThisStream) {
        isPerformed = false;
    }

}