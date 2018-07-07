/* exported clearElementContent */
/* global getElement */
// Очищает DOM содержащий элементы списка юзеров
function clearElementContent(elementSelector) {
    var element = getElement(elementSelector);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}