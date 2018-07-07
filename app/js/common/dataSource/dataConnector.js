/* exported dataConnector */
/* global dataConnectorConfig */
// Модуль предоставляет способ отправки запроса к источнику данных
// Для реквеста необходим путь, тело запроса, тип запроса
// request возвращает Promise
var dataConnector = (function getDataSourceAPI(dataConnectorConfigObj) {
    var dataBaseConnector;
    var dataBaseAPI;

    function DataBaseConnector() {}

    DataBaseConnector.prototype.requestFetch = function requestFetch(
        requestPath,
        requestBody,
        requestType,
        contentType
    ) {
        return fetch(requestPath, {
            headers: {
                Accept: contentType,
                "Content-Type": contentType
            },
            method: requestType,
            body: requestBody
        }).then(function getResponseJSON(response) {
            if(contentType === "application/json") {
                return response.json();
            }
            return response.text();
        });
    };

    DataBaseConnector.prototype.requestXMR = function requestXMR(
        requestPath,
        requestBody,
        requestType,
        contentType
    ) {
        return new Promise(function request(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(requestType, requestPath, true);
            xhr.setRequestHeader("Content-Type", contentType);
            xhr.onload = function loadCase() {
                if(contentType === "application/json") {
                    resolve(JSON.parse(xhr.response));
                } else {
                    resolve(xhr.response);
                }
            };
            xhr.onerror = function errorCase() {
                reject(xhr.statusText);
            };
            if (requestBody) {
                xhr.send(requestBody);
            } else {
                xhr.send();
            }
        });
    };

    DataBaseConnector.prototype.longPoll = function longPoll (targetUrl) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', targetUrl, true);
        xhttp.setRequestHeader('Accept', 'text/event-stream');
        return xhttp;
        // xhttp.send();
    };

    dataBaseConnector = new DataBaseConnector();
    if (dataConnectorConfigObj.typeOfRequest === "fetch") {
        dataBaseAPI = {
            request: dataBaseConnector.requestFetch
        };
    } else if (dataConnectorConfigObj.typeOfRequest === "XHR") {
        dataBaseAPI = {
            request: dataBaseConnector.requestXMR
        };
    } else {
        dataBaseAPI = {
            request: dataBaseConnector.requestXMR,
            createLongPollConnection: dataBaseConnector.longPoll
        };
    }

    return dataBaseAPI;
})(dataConnectorConfig);
