var localStorageManager = (function () {

    function saveData (data, storageName) {
        var serialData = JSON.stringify(data);
        localStorage.setItem(storageName, serialData);
    }

    function getData (storageName) {
        var serialData = localStorage.getItem(storageName);
        var data = null;
        if (serialData) {
            data = JSON.parse(serialData);
        }
        return data;
    }

    return {
        write: saveData,
        get: getData
    }

})();


