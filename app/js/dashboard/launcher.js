var launcher = (function createLauncher (config) {

    var DOMVariables = {};

    function Launcher() {}

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
            typeOfValue: "checked",
            true: "XHR",
            false: "fetch"
        }
    };

    Launcher.prototype.getDataFromElement = function (keyOfValue) {
        var src = "";
        var that = this;
        var typeOfValue;
        Object.keys(DOMVariables).map(function (elementName, index) {
            if(keyOfValue[elementName]) {
                if(index > 0) {
                    typeOfValue = DOMVariables[elementName].getAttribute("type");
                    src += "'&" + elementName + "='" + that.getElementValue(elementName, typeOfValue);
                } else {
                    src += elementName + "='" + that.getElementValue(elementName);
                }
            }
        });
        if(src.length < 1) {
            src = null;
        }
        return src;
    };

    Launcher.prototype.getElementValue = function (name, type) {
        var value = DOMVariables[name][keyOfValue[name].typeOfValue];
        if(type === "radio") {
            return keyOfValue[name][value];
        }
        return value;
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
        }));
    };

    Launcher.prototype.closeApp = function closeApp () {
        DOMVariables = {};
    };

    return new Launcher();

})(mainConfig);