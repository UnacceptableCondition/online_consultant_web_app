module("dataSource tests");
dataSource = dataSource.commonAPI.getDataSourceAPI("XHR");
var testUser = {
    id: "Ivan1529913706139",
    name: "Ivan"
};
tests("addNewUserToDataSource method must create new user to data base",
    function test(assert) {
        var done = assert.async();
        dataSource.usersAPI.addNewUserToDataSource(
            testUser.id, testUser,name
        );
        setTimeout(function getNewUser () {
            dataConnector.request(
                "https://onlineconsultantwebapp.firebaseio.com/userList/Ivan1529913706139.json",
                null,
                "GET",
                "application/json"
            ).then(function (data) {
                assert.ok(data.lastOnline, "it has lastOnline field");
                assert.ok(data.sendNewMessage === false, "it has sendNewMessage field");
                done();
            });
        }, 5000);
    });
tests("getUserList method must returns valid data",
    function test(assert) {
        var done = assert.async();
        dataSource.usersAPI.getUserList(null)().then(function (userList) {
            assert.ok(userList["Ivan1529913706139"].lastOnline, "it has lastOnline field");
            assert.ok(userList["Ivan1529913706139"].sendNewMessage === false, "it has sendNewMessage field");
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
        dataSource.usersAPI.sendMessage(null, "Ivan1529913706139", value).then(function () {
            dataConnector.request(
                "https://onlineconsultantwebapp.firebaseio.com/usersMessages/Ivan1529913706139.json",
                null,
                "GET",
                "application/json"
            ).then(function (data) {
                Object.keys(data).map(function (key) {
                    assert.ok(data[key].date === "testDate", "it has valid date field");
                    assert.ok(data[key].sender === "testSender", "it has valid sender field");
                    assert.ok(data[key].message === "testMessage", "it has valid message field");
                    assert.ok(data[key].read === true, "it has valid read field");
                });
                done();
            });
        });
    });
tests("getUserMessages method must returns messages data",
    function test(assert) {
        var done = assert.async();
        dataSource.usersAPI.getUserMessages("Ivan1529913706139")().then(function (data) {
            Object.keys(data).map(function (key) {
                assert.ok(data[key].date === "testDate", "it has valid date field");
                assert.ok(data[key].sender === "testSender", "it has valid sender field");
                assert.ok(data[key].message === "testMessage", "it has valid message field");
                assert.ok(data[key].read === true, "it has valid read field");
            });
            done();

        });
    });