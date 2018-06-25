var launcher = (function createLauncher (config) {

    var DOMVariables = {};

    function Launcher() {

    }

    function createScript () {
        var src = mainConfig.launcher.srcStart +
        DOMVariables.chatTitle.value + "'&chatUrl='" +
        DOMVariables.chatUrl.value + "'&cssClass='" +
        DOMVariables.chatClass.value + "'&position='" +
        DOMVariables.chatPositionSelect.value + "'&allowMinimize='" +
        DOMVariables.allowMinimize.checked + "'&allowDrag='" +
        DOMVariables.allowDrag.checked + "'&showDateTime='" +
        DOMVariables.showTime.checked + "'&requireName='" +
        DOMVariables.requireName.checked + "'&requests='";
        if(DOMVariables.networkRadioXMR.checked) {
            src += "XHR'";
        } else {
            src += "fetch'";
        }
        src += mainConfig.launcher.srcEnd;
        DOMVariables.scriptCode.innerHTML = src;
    }

    Launcher.prototype.startApp = function startApp () {
        mainConfig.launcher.after.map((function createScriptPart (element) {
            DOMVariables[element] =  getElement(mainConfig.launcher.pattern + element, false, true);
            DOMVariables[element].addEventListener("input", createScript);
        }));
    };

    Launcher.prototype.closeApp = function closeApp () {
        DOMVariables = {};
    };

    return new Launcher();

})(mainConfig);