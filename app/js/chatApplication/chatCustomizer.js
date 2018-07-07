/* exported chatCustomizer */
/* global chatCustomizer */
/* global getElement */
/* global mainConfig */
var chatCustomizer = (function createChatCustomizer (config) {

    function ChatCustomizer() {}

    ChatCustomizer.prototype.setupOuterChatSettings = function setupOuterChatSettings() {
        this.allowMinimize();
        this.setPositionOfMainBlock();
        this.setTitle();
        this.setMainCssClass();
        this.allowDragNDrop();
    };

    ChatCustomizer.prototype.allowDragNDrop = function allowDragNDrop() {
        var clickBlock = getElement(config.DOM.TITLE_BLOCK_CLASS);
        var dragBlock = getElement(config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS);
        if (config.chatSettings.allowDrag === "false") {
            return;
        }
        clickBlock.addEventListener("mousedown", function dragAndDrop(e) {
            var cords;
            var shiftX;
            var shiftY;
            var moveObj;
            var setNull;
            var endDrag;

            function getCoords(elem) {
                var box = elem.getBoundingClientRect();
                return {
                    top: box.top + window.pageYOffset,
                    left: box.left + window.pageXOffset
                };
            }

            cords = getCoords(dragBlock);
            shiftX = e.pageX - cords.left;
            shiftY = e.pageY - cords.top;

            function moveAt(elem) {
                dragBlock.style.left = elem.pageX - shiftX + "px";
                dragBlock.style.top = elem.pageY - shiftY + "px";
            }

            moveObj = function moveObjDragAndDrop(elem) {
                moveAt(elem);
            };

            setNull = function setNullDragAndDrop () {
                document.removeEventListener("mousemove",moveObj );
                document.removeEventListener("mouseup",setNull );
            };

            endDrag = function endDragAndDrop() {
                return false;
            };

            moveAt(e);
            dragBlock.style.zIndex = 1000;

            document.addEventListener("mousemove", moveObj);
            document.addEventListener("mouseup", setNull);
            dragBlock.addEventListener("dragstart", endDrag);

        });
    };

    ChatCustomizer.prototype.setPositionOfMainBlock = function setPositionOfMainBlock() {
        if (config.chatSettings.position === "right") {
            getElement(config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.add(
                config.CHAT_POSITION_RIGHT
            );
        } else {
            getElement(config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.add(
                config.CHAT_POSITION_LEFT
            );
        }
    };

    ChatCustomizer.prototype.setTitle = function setTitle() {
        if(config.chatSettings.chatTitle.length < 1) {
            config.chatSettings.chatTitle = config.DEFAULT_CHAT_TITLE;
        }
        getElement(config.DOM.TITLE_BLOCK_CLASS).innerHTML = config.chatSettings.chatTitle;
    };

    ChatCustomizer.prototype.allowMinimize = function allowMinimize() {
        if (config.chatSettings.allowMinimize === "false") {
            getElement(config.DOM.CHANGE_STYLE_BUTTON_MAX_SIZE).classList.add(
                config.INVISIBLE_CLASS
            );
        }
    };

    ChatCustomizer.prototype.setMainCssClass = function setMainCssClass() {
        if(config.chatSettings.outerCssClass.length < 1) {
            config.chatSettings.outerCssClass = config.DEFAULT_CSS_CLASS_FOR_CHAT;
        }
        getElement(config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).parentNode.classList.add(
            config.chatSettings.outerCssClass
        );
    };

    return new ChatCustomizer();
})(mainConfig);


