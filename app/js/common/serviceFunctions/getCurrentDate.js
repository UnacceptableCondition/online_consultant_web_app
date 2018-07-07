/* exported getCurrentDate */
function getCurrentDate() {
    var date = new Date();
    var minutes = (date.getMinutes().toString().length === 1) ? "0" + date.getMinutes() : date.getMinutes();
    return date
        .getHours()
        .toString()
        .concat(":", minutes);
}