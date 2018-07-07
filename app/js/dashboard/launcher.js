/* exported launcher */
/* global getElement */
/* global mainConfig */
var launcher = (function createLauncher (config) {

    var DOMVariables = {};
    var keyOfValue = {
        chatTitle: {
            typeOfValue: "value"
        },
        chatUrl: {
            typeOfValue: "value"
        },
        chatClass: {
            typeOfValue: "value"
        },
        chatPositionSelect: {
            typeOfValue: "value"
        },

        allowMinimize: {
            typeOfValue: "checked"
        },
        allowDrag: {
            typeOfValue: "checked"
        },
        showTime: {
            typeOfValue: "checked"
        },
        requireName: {
            typeOfValue: "checked"
        },

        // radio button (last element, it's impotent)
        networkRadioXMR: {
            typeOfValue: "value",
            true: "XHR"
        },
        networkRadioLongPoll: {
            typeOfValue: "value",
            true: "longPoll"
        },
        networkRadioFetch: {
            typeOfValue: "value",
            true: "fetch"
        }
    };

    function Launcher() {}

    Launcher.prototype.getDataFromElement = function getDataFromElement (key) {
        var src = "";
        var that = this;
        var typeOfValue;
        Object.keys(DOMVariables).map(function setupData (elementName, index) {
            if(key[elementName]) {
                if(index > 0) {
                    typeOfValue = DOMVariables[elementName].getAttribute("type");
                    if(typeOfValue === "radio") {
                        if(DOMVariables[elementName].checked) {
                            src += "'&" + "typeOfRequest" + "='" + that.getElementValue(elementName, typeOfValue);
                        }
                    } else {
                        src += "'&" + elementName + "='" + that.getElementValue(elementName, typeOfValue);
                    }
                } else {
                    src += elementName + "='" + that.getElementValue(elementName);
                }
            }
            return true;
        });
        if(src.length < 1) {
            src = null;
        }
        return src;
    };

    Launcher.prototype.getElementValue = function getElementValue (name) {
        return DOMVariables[name][keyOfValue[name].typeOfValue];
    };

    function createScript () {
        var src = config.launcher.srcStart + this.getDataFromElement(keyOfValue);
        src += config.launcher.srcEnd;
        DOMVariables.scriptCode.innerHTML = src;
    }

    Launcher.prototype.startApp = function startApp () {
        var that = this;
        config.launcher.after.map((function createScriptPart (element) {
            DOMVariables[element] =  getElement(config.launcher.pattern + element, false, true);
            DOMVariables[element].addEventListener("input", createScript.bind(that));
            return true;
        }));
    };

    Launcher.prototype.closeApp = function closeApp () {
        DOMVariables = {};
    };

    return new Launcher();

})(mainConfig);
