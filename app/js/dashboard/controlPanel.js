var controlPanel = (function (config, dataConnector, eventEmitter) {

    config.currentUserSettings.userId = "IVAN";

    var logElement;
    var selectCommand;
    var sendButton;
    var parameterElements;

    var connection;
    var moduleInit;
    var currentCommand;
    var pathForCurrentCommandRequest;

    var commands = {
        getIp: {
            parametersNumber: 0,
            type: "async"
        },
        askQuestion: {
            parametersNumber: 3,
            type: "pending"
        }
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
        connection = dataConnector.createLongPollConnection(
            config.COMMAND_PATH_PREFIX + user + "/commandsResponse/.json"
        );
        connection.onreadystatechange = function commandChangeCallback () {
            if (this.readyState === 3 && this.status === 200) {
                // // data = longPollResponseParser.parse(this.responseText);
                // // if (data) {
                //     eventEmitter.emit(data.type, data.object);
                // }
                var firstIpDataRegular = /data: {"path":"\/","data":{"getIp":/;
                var hasNullData = /data: null/;
                var data = this.responseText.split(/event: put/).pop();
                if(!hasNullData.test(data)) {
                    if(firstIpDataRegular.test(data)) {
                        data = JSON.parse(data.split(firstIpDataRegular).pop().trim().slice(0,-2));
                    } else {
                        data = JSON.parse(data.split(/event: put/).pop().split("data: {\"path\":\"/getIp\",\"data\":").pop().trim().slice(0,-1));
                    }
                }
                logElement.innerHTML = JSON.stringify(data);

            }
        };
        connection.send()
    }

    function closeLongPollConnection () {
        connection.abort();
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
            isExecute: false,
            typeOfCommand: commands[selectCommand.value].type
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


    function setupListeners () {
        selectCommand.addEventListener("change", function () {
            alert(selectCommand.value);
        });
        sendButton.addEventListener("click", sendButtonListener);
    }

    moduleInit = {
        firstInit: [
            getAccessToDOM,
            setupListeners
        ],
        setup: [
            setupLongPollConnection
        ],
        close: [
            closeLongPollConnection
        ]
    };

    function ControlPanel() {

    }

    ControlPanel.prototype.setup = moduleController.bind(null, "setup");
    ControlPanel.prototype.close = moduleController.bind(null, "close");
    ControlPanel.prototype.firstInit = moduleController.bind(null, "firstInit");

    return new ControlPanel();

})(mainConfig, dataConnector, eventEmitter);

controlPanel.firstInit();
controlPanel.setup();