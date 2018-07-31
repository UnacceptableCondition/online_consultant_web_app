//= ../../common/localStorage/localStorageManager.js

function saveCurrentConditionToLocalStorage() {
    localStorageManager.write(
        {
            userId: config.currentUserSettings.userId,
            isMinimize: config.currentUserSettings.isMinimize,
            userName: config.currentUserSettings.userName
        },
        config.LOCAL_STORAGE_NAME
    );
}

function getCurrentConditionFromLocalStorage(callback) {
    var condition = localStorageManager.get(config.LOCAL_STORAGE_NAME);
    if (condition) {
        config.currentUserSettings.userId = condition.userId;
        config.currentUserSettings.userName = condition.userName;
        config.currentUserSettings.isMinimize = condition.isMinimize;
    }
    if (callback instanceof Function) {
        callback(condition);
    }
    return condition;
}

function getAPI() {
    return {
        saveCondition: saveCurrentConditionToLocalStorage,
        setupCondition: getCurrentConditionFromLocalStorage
    };
}
