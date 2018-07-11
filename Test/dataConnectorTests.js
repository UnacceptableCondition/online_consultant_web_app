/* global QUnit */
/* global dataSource */
/* global userListManager */
/* global mainConfig */
/* global messageListManager */
/* global viewFactory */
/* global getElement */
/* global chatCustomizer */
/* global userDataManager */

module("dataConnector tests");
    dataConnector = dataConnector.getNewConnectorAPI("fetch");
    tests("fetch request method must returns Promise object",
        function test(assert) {
            var returnedObject = dataConnector.request(
                "https://geoip-db.com/json/",
                null,
                "GET",
                "multipart/form-data"
            );
            assert.ok(returnedObject instanceof Promise, "it's promise");
        });
    tests("fetch request method must returns valid data",
        function test(assert) {
            var jsonData;
            var done = assert.async();
            dataConnector.request(
                "https://geoip-db.com/json/",
                null,
                "GET",
                "multipart/form-data"
            ).then(function (data) {
                jsonData = JSON.parse(data);
                assert.ok(jsonData.city, "it has city field");
                assert.ok(jsonData.country_code, "it has country_code field");
                assert.ok(jsonData.latitude, "it has latitude field");
                assert.ok(jsonData.postal, "it has postal field");
                done();
            });
        });
    dataConnector = dataConnector.getNewConnectorAPI("XHR");
    tests("XHR request method must returns Promise object",
        function test(assert) {
            var returnedObject = dataConnector.request(
                "https://geoip-db.com/json/",
                null,
                "GET",
                "multipart/form-data"
            );
            assert.ok(returnedObject instanceof Promise, "it's promise");
        });
    tests("XHR request method must returns valid data",
        function test(assert) {
            var jsonData;
            var done = assert.async();
            dataConnector.request(
                "https://geoip-db.com/json/",
                null,
                "GET",
                "multipart/form-data"
            ).then(function (data) {
                jsonData = JSON.parse(data);
                assert.ok(jsonData.city, "it has city field");
                assert.ok(jsonData.country_code, "it has country_code field");
                assert.ok(jsonData.latitude, "it has latitude field");
                assert.ok(jsonData.postal, "it has postal field");
                done();
            });
        });
    dataConnector = dataConnector.getNewConnectorAPI("longPoll");
    tests("createLongPollConnection method must returns xhr object",
        function test(assert) {
            var longPollConnection = dataConnector.createLongPollConnection();
            assert.ok(longPollConnection instanceof XMLHttpRequest, "it's xhr");
        });