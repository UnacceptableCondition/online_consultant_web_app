var instructionsQueue = [];

function addInstructions(instructions) {
    var instructionObject;
    if (instructions instanceof Array) {
        instructions.forEach(function(instruction) {
            if (!itWasExecuted(instruction)) {
                instructionsQueue.push(instruction);
            }
        });
    } else if (!itWasExecuted(instructions)) {
        instructionObject = Object.create(null);
        instructionObject[instructions.commandName] = instructions;
        instructionsQueue.push(instructionObject);
    }
}

function prepareInstructionBeforeExecute(instruction) {
    var instructionData = {};
    Object.keys(instruction).map(function(key) {
        instructionData.parameters = getParameters(instruction[key]);
        instructionData.instuctionName = key;
        instructionData.typeOfCommand = instruction[key].typeOfCommand;
    });
    return instructionData;
}

function getParameters(commandData) {
    var parameters = [];
    var i;
    for (i = 0; i < commandData.parametersNumber; i++) {
        parameters.push(commandData["parameter" + i]);
    }
    return parameters;
}

function itWasExecuted(instruction) {
    var isExecute = true;
    Object.keys(instruction).map(function(key) {
        isExecute = instruction[key].isExecute;
    });
    return isExecute;
}

function getNextInstruction() {
    var currentInstruction;
    if (instructionsQueue.length > 0) {
        currentInstruction = instructionsQueue.shift();
        return prepareInstructionBeforeExecute(currentInstruction);
    }
}

function getAPI() {
    var instructionsQueueAPI = {};

    instructionsQueueAPI.next = getNextInstruction;
    instructionsQueueAPI.add = addInstructions;

    Object.defineProperty(instructionsQueueAPI, "length", {
        get: function() {
            return instructionsQueue.length;
        },
        set: function(newValue) {
            instructionsQueue.length = newValue;
        },
        enumerable: true,
        configurable: true
    });

    return instructionsQueueAPI;
}
