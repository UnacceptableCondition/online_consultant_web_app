var chatCustomizer = (function () {

    function ChatCustomizer() {}

    ChatCustomizer.prototype.setup = function setup (configObject) {
        this.config = configObject;
    };

    ChatCustomizer.prototype.setupOuterChatSettings = function setupOuterChatSettings() {
        this.allowMinimize();
        this.setPositionOfMainBlock();
        this.setTitle();
        //this.setMainCssClass();
        this.allowDragNDrop();
    };

    ChatCustomizer.prototype.allowDragNDrop = function allowDragNDrop() {
        var clickBlock = getElement(this.config.DOM.TITLE_BLOCK_CLASS);
        var dragBlock = getElement(this.config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS);
        if (this.config.chatSettings.allowDrag === "false") {
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
        if (this.config.chatSettings.position === "right") {
            getElement(this.config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.add(
                this.config.CHAT_POSITION_RIGHT
            );
        } else {
            getElement(this.config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.add(
                this.config.CHAT_POSITION_LEFT
            );
        }
    };

    ChatCustomizer.prototype.setTitle = function setTitle() {
        if(this.config.chatSettings.title.length < 1) {
            this.config.chatSettings.title = this.config.DEFAULT_CHAT_TITLE;
        }
        getElement(this.config.DOM.TITLE_BLOCK_CLASS).innerHTML = this.config.chatSettings.title;
    };

    ChatCustomizer.prototype.allowMinimize = function allowMinimize() {
        if (this.config.chatSettings.allowMinimize === "false") {
            getElement(this.config.DOM.CHANGE_STYLE_BUTTON_MAX_SIZE).classList.add(
                this.config.INVISIBLE_CLASS
            );
        }
    };

    ChatCustomizer.prototype.setMainCssClass = function setMainCssClass() {
        console.log(this.config.chatSettings.outerCssClass);
        if(this.config.chatSettings.outerCssClass.length < 1) {
            this.config.chatSettings.outerCssClass = this.config.DEFAULT_CSS_CLASS_FOR_CHAT;
        }
        getElement(this.config.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS.parentNode).classList.add(
            this.config.chatSettings.outerCssClass
        );
    };

    return new ChatCustomizer();
})();


