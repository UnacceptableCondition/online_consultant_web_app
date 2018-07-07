/* exported viewFactory */
/* global getElement */
/* global dataSource */
var viewFactory = (function createViewFactory (dataSource) {

    function ViewFactory () {}

    ViewFactory.prototype.createView = function createChatView (htmlPath, cssPath, containerClass) {
        var that = this;
        return new Promise(function createViewPromise (resolve, reject) {
            if(htmlPath) {
                if(cssPath) {
                    that.includeViewCssToPage(that.createCSSLink(
                        cssPath,
                        "stylesheet",
                        "text/css",
                        "touch-soft-chat-css"
                    ));
                }
                resolve(that.includeViewHTMLToPage(htmlPath, containerClass));
            } else {
                reject(new Error("htmlPath is null. Please add htmlPath"));
            }
        });
    };

    ViewFactory.prototype.includeViewHTMLToPage = function includeChatHTMLToPage (htmlPath, containerClass) {
        var containerDiv = (containerClass) ? getElement(containerClass) : document.body;
        return dataSource.commonAPI.getHTML(htmlPath).then(function setHtml (html) {
            containerDiv.innerHTML = html;
        })
    };

    ViewFactory.prototype.includeViewCssToPage = function includeChatCssToPage (link) {
        document.head.appendChild(link);
    };

    ViewFactory.prototype.createCSSLink = function createCSSLink(
        filePath,
        rel,
        type,
        id
    ) {
        var link = document.createElement("link");
        if (id) {
            link.setAttribute("id", id);
        }
        if (rel) {
            link.setAttribute("rel", rel);
        }
        if (type) {
            link.setAttribute("type", type);
        }
        link.setAttribute("href", filePath);
        return link;
    };

    return new ViewFactory()

})(dataSource);