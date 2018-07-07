/* global dashboard */
/* global launcher */
/* global about */
/* global clearElementContent */
/* global viewFactory */
/* global mainConfig */
var mainController = (function createMainController (config) {

    var matchesHtmlPath = {
        dashboard: config.router.DASHBOARD_HTML_PATH,
        configuration: config.router.LAUNCHER_HTML_PATH,
        about: config.router.ABOUT_HTML_PATH
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

    function MainController () {

    }

    MainController.prototype.startApp = function startApp () {
        var that = this;
        window.addEventListener('hashchange', function hasChangeEventAdd (element) {
            that.handleUrl(element.newURL);
        });

        // При загрузке страницы - считать состояние и запустить обработчик
        that.handleUrl(window.location.href + "#dashboard");
    };

    // Создать обработчик URL
    MainController.prototype.handleUrl = function handleUrl(url) {
        var hash = null;
        if(url.indexOf("#") === -1){
            return
        }
        hash = url.split('#').pop();
        this.closePreviousPage(hash);


        document.querySelectorAll('a.' + config.router.NAVIGATION_ACTIVE_CSS).forEach(function removeClassActive (element) {
            element.classList.remove(config.router.NAVIGATION_ACTIVE_CSS)
        });
        document.querySelectorAll('a[href="#' + hash + '"]').forEach(function addClassActive (element) {
            element.classList.add(config.router.NAVIGATION_ACTIVE_CSS);
        });

        clearElementContent(config.router.CONTENT_CLASS);
        viewFactory.createView(matchesHtmlPath[hash], null, config.router.CONTENT_CLASS).then(function invokeStartFunction () {
            startFunctions[hash]();
        });

    };

    MainController.prototype.closePreviousPage = function closePreviousPage(hash) {
        Object.keys(closeFunctions).map(function invokeCloseFunction (key) {
            if(key !== hash) {
                closeFunctions[key]();
            }
            return true;
        })
    };

    return new MainController();

})(mainConfig);

mainController.startApp();

