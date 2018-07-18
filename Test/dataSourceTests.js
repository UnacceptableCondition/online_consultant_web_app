/* global module */
/* global tests */
/* global dataSource */
/* global dataConnector */
var testUser = {
    id: "Ivan1529913706139",
    name: "Ivan"
};
var source = dataSource.commonAPI.getDataSourceAPI("XHR");
module("dataSource tests");
tests("addNewUserToDataSource method must create new user to data base",
    function test(assert) {
        var done = assert.async();
        source.usersAPI.addNewUserToDataSource(
            testUser.id, testUser.name
        );
        setTimeout(function getNewUser () {
            dataConnector.request(
                "https://onlineconsultantwebapp.firebaseio.com/userList/Ivan1529913706139.json",
                null,
                "GET",
                "application/json"
            ).then(function assertData (data) {
                assert.ok(data.lastOnline, "it has lastOnline field");
                assert.ok(data.sendNewMessage === false, "it has sendNewMessage field");
                done();
            });
        }, 5000);
    });
tests("getUserList method must returns valid data",
    function test(assert) {
        var done = assert.async();
        source.usersAPI.getUserList(null)().then(function assertData (userList) {
            assert.ok(userList[testUser.id].lastOnline, "it has lastOnline field");
            assert.ok(userList[testUser.id].sendNewMessage === false, "it has sendNewMessage field");
            done();
        });

    });
tests("sendMessage method must sets message data to data base",
    function test(assert) {
        var done = assert.async();
        var value = {
            date: "testDate",
            sender: "testSender",
            message: "testMessage",
            read: true
        };
        source.usersAPI.sendMessage(null, "Ivan1529913706139", value).then(function setRequest () {
            dataConnector.request(
                "https://onlineconsultantwebapp.firebaseio.com/usersMessages/Ivan1529913706139.json",
                null,
                "GET",
                "application/json"
            ).then(function afterGetData (data) {
                Object.keys(data).map(function assertData (key) {
                    assert.ok(data[key].date === "testDate", "it has valid date field");
                    assert.ok(data[key].sender === "testSender", "it has valid sender field");
                    assert.ok(data[key].message === "testMessage", "it has valid message field");
                    assert.ok(data[key].read === true, "it has valid read field");
                    return true;
                });
                done();
            });
        });
    });
tests("getUserMessages method must returns messages data",
    function test(assert) {
        var done = assert.async();
        source.usersAPI.getUserMessages("Ivan1529913706139")().then(function setRequest  (data) {
            Object.keys(data).map(function assertData (key) {
                assert.ok(data[key].date === "testDate", "it has valid date field");
                assert.ok(data[key].sender === "testSender", "it has valid sender field");
                assert.ok(data[key].message === "testMessage", "it has valid message field");
                assert.ok(data[key].read === true, "it has valid read field");
                return true;
            });
            done();

        });
    });