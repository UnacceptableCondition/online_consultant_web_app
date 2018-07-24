var log = function (config) {

    //= ../common/serviceFunctions/clearElementContent.js

    function writeMessage (messages) {
        var messageElement;
        if(messages instanceof Array) {
            messages.forEach(function (message) {
                messageElement = createMessageElement(message);
                displayMessage(messageElement);
            })
        } else {
            messageElement = createMessageElement(messages);
            displayMessage(messageElement);
        }
    }

    function displayMessage(messageElement) {
        getElement(config.DOM.CSS_CONTROL_PANEL_LOG_CLASS).appendChild(messageElement);
    }

    function createMessageElement(messages) {
        var resultDiv = document.createElement("div");
        resultDiv.classList.add(config.DOM.CSS_CONTROL_PANEL_LOG_ELEMENT_CLASS);

        var callbackForMessagesDeploy = function addDataToResultDiv (data, dataName) {
            var innerDiv;
            innerDiv = document.createElement("div");
            innerDiv.innerHTML = dataName + ": " + data;
            resultDiv.appendChild(innerDiv);
        };

        deployObject(messages, callbackForMessagesDeploy);
        return resultDiv;
    }

    function deployObject (object, callback) {
        Object.keys(object).map(function (key) {
            if(object[key] instanceof Object) {
                deployObject(object[key], callback)
            } else {
                callback(object[key],key)
            }
        })
    }

    return {
        write: writeMessage,
        clear: clearElementContent.bind(null,
            config.DOM.CSS_CONTROL_PANEL_LOG_CLASS
        )
    }
}(mainConfig);