/* global instructionQueueManager */
/* global instructionList */
/* global dataConnector */
/* global longPollResponseParser */
/* global mainConfig */
var instructionPerformer = (function (config, dataConnector, parser) {

    var isPerformed = false;
    var connection = null;
    var isStartXHRConnection = false;

    var instructionQueueManager = (function () {

        //= instructions/instructionQueueManagerBody.js

        return getAPI();

    })();

    var instructions = (function (config) {

        //= instructions/instructionListBody.js

        return getAPI();

    })(mainConfig);

    //= instructions/xhrInstructionConnector.js
    //= instructions/longPollingInstructionConnector.js

    //= instructions/instructionPerformerBody.js

    return {
        execute: executeCommand,
        startApp: startApplication,
        closeApp: closeApplication
    };

})(mainConfig, dataConnector, longPollResponseParser);