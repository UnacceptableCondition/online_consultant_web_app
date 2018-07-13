/* global longPollResponseParser */
/* global QUnit */
var tests = QUnit.test;
var module = QUnit.module;
var testUser = {
    id: "Ivan1529913706139",
    name: "Ivan"
};
var testMessages =
    "event: put\n" +
    'data: {"path":"/","data":{"-LGnyE2qtOY5mhlILvkY":{"date":"12:00","message":"1","read":true,"sender":"Test121212212121"}}}';
var testNewMessage =
    "event: put\n" +
    'data: {"path":"/-LH8Qv-7P4sXPrb-uqUq","data":{"date":"16:02","message":"3","read":false,"sender":"Test121212212121"}}';
var testUserList =
    "event: put\n" +
    'data: {"path":"/","data":{"Ivan1529913706139":{"lastOnline":1531314276077,"sendNewMessage":false}}}';
var testLastOnlineUpdate =
    "event: put\n" +
    'data: {"path":"/Test1212122121211530882419518/lastOnline","data":1531315098909}';
module("longPollResponseParser tests");

tests("parse method must returns valid messages data", function test(assert) {
    var messageData = longPollResponseParser.parse(testMessages).object[
        "-LGnyE2qtOY5mhlILvkY"
        ];
    assert.equal(messageData.date, "12:00", "it has valid date field");
    assert.equal(messageData.message, "1", "it has valid message field");
    assert.equal(messageData.read, true, "it has valid read field");
    assert.equal(
        messageData.sender,
        "Test121212212121",
        "it has valid sender field"
    );
});
tests("parse method must returns valid new message data", function test(
    assert
) {
    var messageData = longPollResponseParser.parse(testNewMessage).object[
        "-LH8Qv-7P4sXPrb-uqUq"
        ];
    assert.equal(messageData.date, "16:02", "it has valid date field");
    assert.equal(messageData.message, "3", "it has valid message field");
    assert.equal(messageData.read, false, "it has valid read field");
    assert.equal(
        messageData.sender,
        "Test121212212121",
        "it has valid sender field"
    );
});
tests("parse method must returns valid user list data", function test(assert) {
    var user = longPollResponseParser.parse(testUserList).object[
        testUser.id
        ];
    assert.equal(user.lastOnline, 1531314276077, "it has valid lastOnline field");
    assert.equal(user.sendNewMessage, false, "it has valid sendNewMessage field");
});
tests("parse method must returns valid user list data", function test(assert) {
    var onlineUpdate = longPollResponseParser.parse(testLastOnlineUpdate);
    assert.equal(onlineUpdate.type, "lastOnline", "it has valid type field");
    assert.equal(
        onlineUpdate.object[0],
        "Test1212122121211530882419518",
        "it has valid id field"
    );
    assert.equal(
        onlineUpdate.object[1],
        1531315098909,
        "it has valid lastOnline field"
    );
});
