
// db.commonAPI.getHTML("https://rawgit.com/UnacceptableCondition/Homework_2/master/html/chat.html").then(function (data) {
//     document.body.innerHTML = data;
// // });
// db.oneUserAPI.getUserData("Eleonora1528544281208").then(function (data) {
//     var newMessageList = messagesManager.createMessageList(data);
//     messagesManager.updateMessageList(newMessageList);
//     messagesManager.displayMessages();
//     // document.body.innerHTML = data;
// });

chatController.setup(mainConfig);
chatController.startApp();

