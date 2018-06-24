var dataBaseUrl = mainConfig.DATA_BASE_URL;

var getElement = function getElementFromDOM (selector, isAll) {
    if(isAll) {
        return document.querySelectorAll("." + selector);
    }
    return document.querySelector("." + selector);
};


var dataConnectorConfig = {
    typeOfRequest: mainConfig.chatSettings.typeOfRequest
};