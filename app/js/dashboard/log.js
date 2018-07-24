var log = function () {

    var logTemplates = {
        getIp: {

        },
        askQuestion: {

        }
    };

    function saveMessage (message, templateName) {
        var messageElement = createMessageElement(validMessage, templateName);
    }

    function displayMessage(message) {
        return message;
    }

    function createMessageElement(message) {
        console.log(message);
    }



    return {
        write: saveMessage
    }
}();