var chatViewFactory = (function () {

    function ChatViewFactory () {
        this.db = dataSource;
        this.config = null;
    }

    ChatViewFactory.prototype.createChatView = function createChatView () {
        var that = this;
        return new Promise(function(resolve, reject) {
            if(that.config) {
                that.includeChatCssToPage(that.createCSSLink(
                    that.config.CSS_FILE_PATH,
                    "stylesheet",
                    "text/css",
                    "touch-soft-chat-css"
                ));
                resolve(that.includeChatHTMLToPage(that.config.HTML_FILE_PATH));
            } else {
                reject(new Error("config is null. Please use setChatViewConfig to add new config"));
            }
        });
    };

    ChatViewFactory.prototype.setup = function setup (configObj) {
        this.config = configObj
    };

    ChatViewFactory.prototype.includeChatHTMLToPage = function includeChatHTMLToPage (htmlPath) {
        return this.db.commonAPI.getHTML(htmlPath).then(function (html) {
            document.body.innerHTML = html;
        })
    };

    ChatViewFactory.prototype.includeChatCssToPage = function includeChatCssToPage (link) {
        document.head.appendChild(link);
    };

    ChatViewFactory.prototype.createCSSLink = function createCSSLink(
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

    return new ChatViewFactory()

})(dataSource);