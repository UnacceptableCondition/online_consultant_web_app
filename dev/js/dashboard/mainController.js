var matchesHtmlPath = {
    dashboard: mainConfig.DASHBOARD_HTML_PATH,
    configuration: mainConfig.LAUNCHER_HTML_PATH,
    about: mainConfig.ABOUT_HTML_PATH
};


var closeFunctions = {
    dashboard: dashboard.closeApp.bind(dashboard),
    configuration: launcher.closeApp.bind(launcher),
    about: about.closeApp.bind(about)
};

var startFunctions = {
    dashboard: dashboard.startApp.bind(dashboard),
    configuration: launcher.startApp.bind(launcher),
    about: about.startApp.bind(about)
};

// Создать обработчик URL
function handleUrl(url) {
    var hash = null;
    if(url.indexOf("#") === -1){
        return
    }
    hash = url.split('#').pop();
    closePreviousPage(hash);


    document.querySelectorAll('a.' + mainConfig.NAVIGATION_ACTIVE_CSS).forEach(function (element) {
        element.classList.remove(mainConfig.NAVIGATION_ACTIVE_CSS)
    });
    document.querySelectorAll('a[href="#' + hash + '"]').forEach(function (element) {
        element.classList.add(mainConfig.NAVIGATION_ACTIVE_CSS);
    });

    clearElementContent(mainConfig.CONTENT_CLASS);
    viewFactory.createView(matchesHtmlPath[hash], null, mainConfig.CONTENT_CLASS).then(function () {
         startFunctions[hash]();
    });

}

function closePreviousPage(hash) {
     Object.keys(closeFunctions).map(function (key) {
         if(key !== hash) {
             closeFunctions[key]();
         }
     })
}

// Подписаться на изменения URL
window.addEventListener('hashchange', function (element) {
    handleUrl(element.newURL);
});

// При загрузке страницы - считать состояние и запустить обработчик
handleUrl(window.location.href + "#dashboard");