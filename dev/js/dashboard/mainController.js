var matches = {
    dashboard: mainConfig.DASHBOARD_HTML_PATH,
    configuration: mainConfig.LAUNCHER_HTML_PATH
};

var closeFunctions = {
    dashboard: dashboardController.closeApp
};


// Создать обработчик URL
function handleUrl(url) {
    var hash = null;
    if(url.indexOf("#") === -1){
        return
    }
    hash = url.split('#').pop();
    closePreviosPage(hash);


    getElement('a.active', true).forEach(function (element) {
        element.classList.remove('active')
    });
    getElement('a[href="' + hash + '"]', true).forEach(function (element) {
        element.classList.add('active');
    });

    clearElementContent(mainConfig.CONTENT_CLASS);
    viewFactory.createView(matches[hash], null, mainConfig.CONTENT_CLASS).then(function () {
        dashboardController.startApp();
    });

}

function closePreviosPage(hash) {
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
handleUrl(window.location.href);