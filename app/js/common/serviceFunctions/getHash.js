/* exported getHash */
function getHash(str) {
    var date = new Date();
    return str + date.getTime();
}