var conditionManager = (function (config) {

    //= ../../common/localStorage/localStorageManager.js

    function saveCurrentConditionToLocalStorage() {
        localStorageManager.write({
            filter: config.currentDashboardCondition.filterBy,
            sort: config.currentDashboardCondition.sortBy,
            currentUserId: config.currentUserSettings.userId
        }, config.LOCAL_STORAGE_NAME)
    }

    function getCurrentConditionFromLocalStorage(callback) {
        var condition = localStorageManager.get(config.LOCAL_STORAGE_NAME);
        if (condition) {
            config.currentDashboardCondition.filterBy = condition.filter;
            config.currentDashboardCondition.sortBy = condition.sort;
            config.currentUserSettings.userId = condition.currentUserId;
        }
        if(callback instanceof Function) {
            callback(condition);
        }
        return condition;
    }


    return {
        saveCondition: saveCurrentConditionToLocalStorage,
        setupCondition: getCurrentConditionFromLocalStorage
    }

})(mainConfig);