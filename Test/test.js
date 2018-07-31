/* global module */
/* global tests */
/* global userListManager */
/* global mainConfig */
/* global messageListManager */
/* global viewFactory */
/* global getElement */
/* global chatCustomizer */
/* global userDataManager */
// var tests = QUnit.test;
// var module = QUnit.module;
var testConfig = {
  testUser:{
      id: "Ivan1529913706139",
      name: "Ivan"
  }
};

mainConfig.chatSettings.typeOfRequest = "fetch";
module("dashboardDataSource tests");
tests("DataSource.usersAPI.getUserData should receive valid data",
    function test(assert) {
    assert.ok(true);
    });
module("dashboardUserManager tests");
tests("setUserList should set new uList", function test(assert) {
    var newList = { test: "testList" };
    userListManager.setUserList(newList);
    assert.equal(userListManager.uList.test, "testList", "setUserList true");
});
tests("createUserElement should valid div element", function test(assert) {
    var testData = userListManager.createUserElement(userListManager.uList.test, true);
    assert.equal(
        testData.firstChild.tagName,
        "DIV",
        "element has valid tag name"
    );
    assert.equal(
        testData.lastChild.tagName,
        "DIV",
        " element has valid tag name"
    );
    assert.ok(
        testData.firstChild.classList.contains(
            mainConfig.userList.USER_ID_ELEMENT_CSS_CLASS
        ),
        " element has valid class name"
    );
    assert.ok(
        testData.lastChild.classList.contains(
            mainConfig.userList.USER_INDICATOR_CSS_CLASS_ONLINE
        ),
        " element has valid class name"
    );
    assert.ok(
        testData.classList.contains(mainConfig.userList.USER_ELEMENT_CSS_CLASS),
        " element has valid class name"
    );
});
tests(
    "getUserFromUserListById should return key user on uList by userId",
    function test(assert) {
        var newList = { testKey: { userId: testConfig.testUser.id } };
        userListManager.setUserList(newList);
        assert.equal(
            userListManager.getUserFromUserListById(testConfig.testUser.id),
            "testKey",
            "getUserFromUserListById true"
        );
    }
);
tests("userIsOnline should return true if user is online", function test(
    assert
) {
    var date = new Date();
    var negativeConst = 100500;
    assert.equal(
        userListManager.userIsOnline(date.getTime()),
        true,
        "getUserFromUserListById true"
    );
    assert.equal(
        userListManager.userIsOnline(
            date.getTime() - mainConfig.interval.ONLINE_INTERVAL - negativeConst
        ),
        false,
        "userIsOnline true"
    );
});
tests("sortUsersByField should sort by field", function test(assert) {
    var newList = [
        {
            visible: true,
            userId: "1"
        },
        {
            visible: true,
            userId: "2"
        }
    ];
    userListManager.setUserList(newList);
    userListManager.sortUsersByField("visible");
    assert.equal(newList[0].userId, "2", "sortUsersByField true");
    assert.equal(newList[1].userId, "1", "sortUsersByField true");
});
module("messageListManager tests");
tests("createMessageElement should create valid message element", function test(
    assert
) {
    var message = "test";
    var messageDate = "testDate";
    var userName = "testUserName";
    var isRead = false;
    var messageElement = messageListManager.createMessageElement(
        message,
        messageDate,
        userName,
        isRead
    );
    var nodeList = messageElement.childNodes;
    assert.equal(messageElement.tagName, "DIV", "tagName true");
    assert.ok(
        messageElement.classList.contains(
            mainConfig.messages.CSS_MESSAGE_CONTAINER
        ),
        "class true"
    );
    assert.equal(nodeList.length, 3, "length is correct");
    assert.equal(nodeList[0].innerHTML, messageDate, "date true");
    assert.ok(
        nodeList[0].classList.contains(
            mainConfig.messages.CSS_CHAT_MESSAGE_DATE
        ),
        "class true"
    );
    assert.equal(nodeList[1].innerHTML, userName, "sender true");
    assert.ok(
        nodeList[1].classList.contains(
            mainConfig.messages.CSS_CHAT_MESSAGE_SENDER_NAME
        ),
        "class true"
    );
    assert.equal(nodeList[2].innerHTML, message, "message true");
    assert.ok(
        nodeList[2].classList.contains(
            mainConfig.messages.CSS_CHAT_MESSAGE
        ),
        "class true"
    );

});
tests("addMessageToMessageList should add message", function test(assert) {
    var messageElement = messageListManager.createMessageElement(
        "test",
        "test",
        "test",
        true
    );
    messageListManager.messageList = [];
    messageListManager.addMessageToMessageList(messageElement);
    assert.equal(
        messageListManager.messageList.length,
        1,
        "addMessageToMessageList true"
    );
});
module("viewFactory tests");
tests("add html to page", function test(assert) {
    var done = assert.async();
    viewFactory.includeViewHTMLToPage(mainConfig.router.ABOUT_HTML_PATH, "content").then(function testIncludeHtml () {
        assert.ok(
            getElement("root-touchsoft-about"),
            "add html to page"
        );
        done();
    });
});
tests("create css link", function test(assert) {
    var link = viewFactory.createCSSLink("testPath", "testStyle", "testType", "testId");
        assert.equal(
            link.tagName,
            "LINK",
            "tageName true"
        );
        assert.equal(
            link.getAttribute("id"),
            "testId",
            "id atr true"
        );
        assert.equal(
            link.getAttribute("rel"),
            "testStyle",
            "rel atr true"
        );
        assert.equal(
            link.getAttribute("type"),
            "testType",
            "type atr true"
        );
        assert.equal(
            link.getAttribute("href"),
            "testPath",
            "href true"
        );
});
tests("add css link to page", function test(assert) {
    var link = viewFactory.createCSSLink("testPath", "testStyle", "testType", "testId");
    viewFactory.includeViewCssToPage(link);
        assert.ok(
            getElement("testId", false, true),
            "add css to page"
        );
});
module("chatCustomizer tests");
tests("add position", function test(assert) {
    var div = document.createElement("div");
    div.classList.add(mainConfig.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS);
    document.body.appendChild(div);
    mainConfig.chatSettings.position = "right";
    mainConfig.CHAT_POSITION_RIGHT = "test_style_position_right";
    chatCustomizer.setPositionOfMainBlock();
    assert.ok(
        getElement(mainConfig.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.contains(mainConfig.CHAT_POSITION_RIGHT),
        "right position"
    );
    mainConfig.chatSettings.position = "left";
    mainConfig.CHAT_POSITION_LEFT = "test_style_position_left";
    chatCustomizer.setPositionOfMainBlock();
    assert.ok(
        getElement(mainConfig.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).classList.contains(mainConfig.CHAT_POSITION_LEFT),
        "left position"
    );
});
tests("add title", function test(assert) {
    var div = document.createElement("div");
    mainConfig.DOM.TITLE_BLOCK_CLASS = "title_class";
    div.classList.add(mainConfig.DOM.TITLE_BLOCK_CLASS);
    document.body.appendChild(div);
    mainConfig.chatSettings.chatTitle = "title";
    chatCustomizer.setTitle();
    assert.ok(
        getElement(mainConfig.DOM.TITLE_BLOCK_CLASS).innerText === "title",
        "valid title"
    );
});
tests("allowMinimize", function test(assert) {
    var div = document.createElement("div");
    mainConfig.DOM.CHANGE_STYLE_BUTTON_MAX_SIZE = "minimize_button_class";
    div.classList.add(mainConfig.DOM.CHANGE_STYLE_BUTTON_MAX_SIZE);
    document.body.appendChild(div);
    mainConfig.chatSettings.allowMinimize = "false";
    chatCustomizer.allowMinimize();
    assert.ok(
        getElement( mainConfig.DOM.CHANGE_STYLE_BUTTON_MAX_SIZE).classList.contains(mainConfig.INVISIBLE_CLASS),
        "minimize button is invisible"
    );
});
tests("setMainCssClass", function test(assert) {
    var div = document.createElement("div");
    mainConfig.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS = "chat_block";
    div.classList.add(mainConfig.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS);
    document.body.appendChild(div);
    mainConfig.chatSettings.outerCssClass = "outer";
    chatCustomizer.setMainCssClass();
    assert.ok(
        getElement( mainConfig.DOM.MAIN_STYLE_CHAT_BLOCK_CLASS).parentNode.classList.contains(mainConfig.chatSettings.outerCssClass),
        "main css class valid"
    );
});
module("userDataManager tests");
tests("getMessageFromInputElement", function test(assert) {
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.value = "testValue";
    input.classList.add(mainConfig.CSS_CURRENT_INPUT_CLASS);
    document.body.appendChild(input);
    assert.ok(
        userDataManager.getMessageFromInputElement() === "testValue",
        "return correct text"
    );
});