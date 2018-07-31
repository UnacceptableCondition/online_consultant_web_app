var controlPanel = (function (config, dataConnector, log, parser) {

    var logElement;
    var selectCommand;
    var sendButton;
    var parameterElements;

    var connection;
    var moduleInit;
    var currentCommand;
    var pathForCurrentCommandRequest;
    var COMMAND_INPUT_AMOUNT = 3;
    var DEFAULT_COMMAND_NAME = "getIp";

    var commands = {
        getIp: {
            parametersNumber: 0
        },
        askQuestion: {
            parametersNumber: 3
        }
    };

    var commandsView = {
        getIp: [],
        askQuestion:  ["placeholder", "текст вопроса"]
    };

    function moduleController (action) {
        moduleInit[action].forEach(function invokeControlFunctions (controlFunction) {
            controlFunction();
        })
    }

    function getAccessToDOM () {
        logElement = getElement(config.DOM.CSS_CONTROL_PANEL_LOG_CLASS);
        selectCommand = getElement(config.DOM.CSS_CONTROL_PANEL_SELECT_CLASS);
        sendButton =  getElement(config.DOM.CSS_CONTROL_SEND_COMMAND_BUTTON_CLASS);
        parameterElements =  getElement(config.DOM.CSS_CONTROL_PARAMETERS_CLASS, true);
    }


    function setupLongPollConnection (userId) {
        var user = (userId) ? userId : config.currentUserSettings.userId;
        if(connection) {
            connection.abort();
        }
        connection = dataConnector.createLongPollConnection(
            config.COMMAND_PATH_PREFIX + user + "/commandsResponse/.json"
        );
        log.clear();
        connection.onreadystatechange = function commandChangeCallback () {
            if (this.readyState === 3 && this.status === 200) {
                var data  = parser.parse(this.responseText);
                if(data) {
                    log.write(data.object);
                }
            }
        };
        connection.send()
    }

    function closeLongPollConnection () {
        if(connection) {
            connection.abort();
        }
    }

    function requestCommand (commandObject, requestPath) {
        var jsonData = JSON.stringify(commandObject);
        dataConnector.request(
            requestPath,
            jsonData,
            "PUT",
            "application/json"
        )
    }


    function createCommand () {
        var parameterPrefix = "parameter";
        currentCommand = {
            commandName: selectCommand.value,
            parametersNumber: commands[selectCommand.value].parametersNumber,
            isExecute: false
        };
        parameterElements.forEach(function (element, index) {
            if(index < currentCommand.parametersNumber) {
                currentCommand[parameterPrefix + index] = element.value;
            }
        });
    }

    function createPathForCommandRequest (userId, commandName) {
        var user = (userId) ? userId : config.currentUserSettings.userId;
        pathForCurrentCommandRequest = config.COMMAND_PATH_PREFIX + user + "/commands/" + commandName + ".json";
    }

    function sendButtonListener () {
        createCommand();
        createPathForCommandRequest(null, selectCommand.value);
        requestCommand(currentCommand, pathForCurrentCommandRequest);
    }

    function displayCommandView (commandName) {
        var numberOfCommandInputs =  commandsView[commandName].length;
        for(var i = COMMAND_INPUT_AMOUNT - 1; i >= 0; i--) {
            if(i < numberOfCommandInputs) {
                parameterElements[i].classList.remove(config.INVISIBLE_CLASS);
                parameterElements[i].placeholder = commandsView[commandName][i];
            } else {
                parameterElements[i].classList.add(config.INVISIBLE_CLASS);
                parameterElements[i].value = "";
            }
        }
    }

    function setupListeners () {
        selectCommand.addEventListener("change", function () {
            displayCommandView(selectCommand.value);
        });
        sendButton.addEventListener("click", sendButtonListener);
    }

    moduleInit = {
        firstInit: [
            getAccessToDOM,
            setupListeners,
            displayCommandView.bind(null, DEFAULT_COMMAND_NAME)
        ],
        setup: [
            setupLongPollConnection
        ],
        close: [
            closeLongPollConnection
        ]
    };

    function ControlPanel() {}

    ControlPanel.prototype.setup = moduleController.bind(null, "setup");
    ControlPanel.prototype.close = moduleController.bind(null, "close");
    ControlPanel.prototype.firstInit = moduleController.bind(null, "firstInit");

    return new ControlPanel();

})(mainConfig, dataConnector, log, longPollResponseParser);
