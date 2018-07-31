/* exported longPollResponseParser */
var longPollResponseParser = (function createLongPollResponseParser() {
    var typesOfChange = {
        message: /message/,
        userList: /lastOnline.{1,}sendNewMessage/,
        lastOnline: /"path":"\/\w{1,}\/lastOnline/,
        sendNewMessage: /"path":"\/\w{1,}\/sendNewMessage/,
        setting: /readLastMessage/,
        read: /read/,
        getIp: /getIp/,
        askQuestion: /askQuestion/
    };

    var eventRegular = /event: put/;
    var hasNullData = /data: null/;
    var getDataRegular = /","data":/;
    var itIsNewMessageRegular = /"path":"\/-/;
    var itIsNewUserListRegular = /"data":{"lastOnline":\d+,"sendNewMessage":/;
    var itIsFirstIpDataRegular = /data: {"path":"\/","data":{"getIp":/;
    var itIsFirstQuestionsData = /data: {"path":"\/","data":{"askQuestion":/;
    var itIsNewQuestionsCommand = /data: {"path":"\/askQuestion","data":/;
    var itIsFirstUserListConnection = true;

    function LongPollResponseParser() {}

    LongPollResponseParser.prototype.getTypeOfChanges = function getTypeOfChanges(
        answerData
    ) {
        var type = Object.keys(typesOfChange).filter(
            function getCurrentTypeOfChange(typeName) {
                if (typesOfChange[typeName].test(answerData)) {
                    return typeName;
                }
                return false;

            }
        );
        return type[0];
    };

    LongPollResponseParser.prototype.prepareDataBeforeJsonParse = function prepareDataBeforeJsonParse(
        response
    ) {
        return response[response.length - 1]
            .split(getDataRegular)[1]
            .trim()
            .slice(0, -1);
    };

    LongPollResponseParser.prototype.parseUsersMessages = function parseUsersMessages(
        response,
        changeType
    ) {
        var data = {};
        var messageId;
        var resultObject = {};
        if (changeType === "read") {
            data.id = response[response.length - 1]
                .split('data: {"path":"/')
                .pop()
                .split('/read","')
                .shift();
            data.value = response[response.length - 1]
                .split('/read","data":')
                .pop()
                .trim()
                .slice(0, -1);
            return data;
        }
        if (!itIsNewMessageRegular.test(response[response.length - 1])) {
            return this.getFirstData(response);
        }
        messageId = response[response.length - 1]
            .split('data: {"path":"/')
            .pop()
            .split(getDataRegular)
            .shift();
        data = JSON.parse(this.prepareDataBeforeJsonParse(response));
        resultObject[messageId] = data;
        return resultObject;
    };

    LongPollResponseParser.prototype.hasNewData = function hasNewData(response) {
        return (
            !hasNullData.test(response[response.length - 1]) && response.length > 1
        );
    };

    LongPollResponseParser.prototype.parseUserList = function parseUserList(
        response,
        changeType
    ) {
        var data = {};
        var userId;
        if (itIsFirstUserListConnection) {
            itIsFirstUserListConnection = false;
            return this.getFirstData(response);
        }
        if (itIsNewUserListRegular.test(response[response.length - 1])) {
            userId = this.getUserId(response[response.length - 1], null);
            data[userId] = this.getFirstData(response);
            return data;
        }
        data = JSON.parse(
            response[response.length - 1]
                .split(getDataRegular)[1]
                .trim()
                .slice(0, -1)
        );
        userId = this.getUserId(response[response.length - 1], changeType);
        return [userId, data];
    };

    LongPollResponseParser.prototype.getFirstData = function getFirstData(
        response
    ) {
        var jsonData;
        try {
            jsonData = JSON.parse(this.prepareDataBeforeJsonParse(response));
            return jsonData;
        } catch (exception) {
            return null;
        }
    };

    LongPollResponseParser.prototype.getUserId = function getUserId(
        response,
        changeType
    ) {
        if (changeType) {
            return response
                .split(changeType)
                .shift()
                .split('data: {"path":"/')
                .pop()
                .slice(0, -1);
        }
            return response
                .split('data: {"path":"/')
                .pop()
                .split(",")[0]
                .trim()
                .slice(0, -1);

    };

    LongPollResponseParser.prototype.parseCommandAnswer = function parseCommandAnswer(
        response
    ) {
        var data;
        var ipData;
        var askQuestionData;
        var itIsIPInformation = /getIp/.test(response[response.length - 1]);
        var itIsQuestionsInformation = /askQuestion/.test(response[response.length - 1]);

        if(itIsIPInformation && itIsQuestionsInformation) {
            data = response[response.length - 1].split(/data: {"path":"\/","data":/).pop().split("},");
            askQuestionData = JSON.parse(data[0]+ "}}");
            ipData = JSON.parse("{" + data[1].trim().slice(0,-1));
            return [
                askQuestionData,
                ipData
            ]
        } else if (itIsIPInformation) {
            return this.parseUserIpData(response);
        } else if (itIsQuestionsInformation) {
            return this.parseQuestionsData(response);
        }
    };

    LongPollResponseParser.prototype.parseUserIpData = function parseUserIpData(
        response
    ) {
        var data;
        if(itIsFirstIpDataRegular.test(response)) {
            data = JSON.parse("{\"getIp\":" + response[response.length - 1].split(itIsFirstIpDataRegular).pop().trim().slice(0,-1));
        } else {
            data = JSON.parse(response[response.length - 1].split(eventRegular).pop().split("data: {\"path\":\"/getIp\",\"data\":").pop().trim().slice(0,-1));
        }
        return data;
    };

    LongPollResponseParser.prototype.parseQuestionsData = function parseQuestionsData(
        response
    ) {
        var data;
        if(itIsFirstQuestionsData.test(response[response.length - 1])) {
            data = JSON.parse("{\"askQuestion\":" + response[response.length - 1].split(itIsFirstQuestionsData).pop().trim().slice(0,-1));
        } else if (itIsNewQuestionsCommand.test(response[response.length - 1])) {
            data = JSON.parse(response[response.length - 1].split(itIsNewQuestionsCommand).pop().trim().slice(0,-1));
        } else {
            data = JSON.parse("{\"askQuestion\":{\"" + response[response.length - 1].split("data: {\"path\":\"/askQuestion/").pop().replace("\",\"data\"", "\"") + "}");
        }
        return data;
    };

    LongPollResponseParser.prototype.parse = function parse(text) {
        var result = text.split(eventRegular);
        var changeType = this.getTypeOfChanges(result[result.length - 1]);
        var resultOfParse = { type: changeType };
        if (this.hasNewData(result)) {
            if (changeType === "message" || changeType === "read") {
                resultOfParse.object = this.parseUsersMessages(result, changeType);
                return resultOfParse;
            } else if (
                changeType === "sendNewMessage" ||
                changeType === "lastOnline" ||
                changeType === "userList"
            ) {
                resultOfParse.object = this.parseUserList(result, changeType);
                return resultOfParse;
            } else if (changeType === "getIp" || changeType === "askQuestion") {
               resultOfParse.object = this.parseCommandAnswer(result, changeType);
                return resultOfParse;
            }
            return false;
        }
        return false;

    };

    return new LongPollResponseParser();
})();
