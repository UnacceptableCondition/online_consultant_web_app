/* exported dataConnectorConfig */
/* exported dataBaseUrl */
/* exported getElement */
/* global mainConfig */
var dataBaseUrl = mainConfig.DATA_BASE_URL;

var getElement = function getElementFromDOM (selector, isAll, itIsId) {
    var selectorStart = (itIsId) ? "#" : ".";
    if(isAll) {
        return document.querySelectorAll(selectorStart + selector);
    }
    return document.querySelector(selectorStart + selector);
};


var dataConnectorConfig = {
    typeOfRequest: mainConfig.chatSettings.typeOfRequest
};