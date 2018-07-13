
/* global module */
/* global tests */
/* global dataConnector */
module("dataConnector tests");
    tests("fetch request method must returns Promise object",
        function test(assert) {
            var connect = dataConnector.getNewConnectorAPI("fetch");
            var returnedObject = connect.request(
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
            var connect = dataConnector.getNewConnectorAPI("fetch");
            connect.request(
                "https://geoip-db.com/json/",
                null,
                "GET",
                "multipart/form-data"
            ).then(function assertData (data) {
                jsonData = JSON.parse(data);
                assert.ok(jsonData.city, "it has city field");
                assert.ok(jsonData.country_code, "it has country_code field");
                assert.ok(jsonData.latitude, "it has latitude field");
                assert.ok(jsonData.postal, "it has postal field");
                done();
            });
        });
    tests("XHR request method must returns Promise object",
        function test(assert) {
            var connect = dataConnector.getNewConnectorAPI("XHR");
            var returnedObject = connect.request(
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
            var connect = dataConnector.getNewConnectorAPI("XHR");
            connect.request(
                "https://geoip-db.com/json/",
                null,
                "GET",
                "multipart/form-data"
            ).then(function assertData (data) {
                jsonData = JSON.parse(data);
                assert.ok(jsonData.city, "it has city field");
                assert.ok(jsonData.country_code, "it has country_code field");
                assert.ok(jsonData.latitude, "it has latitude field");
                assert.ok(jsonData.postal, "it has postal field");
                done();
            });
        });

    tests("createLongPollConnection method must returns xhr object",
        function test(assert) {
            var connect = dataConnector.getNewConnectorAPI("longPoll");
            var longPollConnection = connect.createLongPollConnection();
            assert.ok(longPollConnection instanceof XMLHttpRequest, "it's xhr");
        });