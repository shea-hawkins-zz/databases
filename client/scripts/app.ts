class App {
  constructor(id) {
    let messageService = new MessageService('https://api.parse.com/1/classes/messages'); ''
    $(`#${id}`).append($('<div id="menuBar"></div>'));
    $(`#${id}`).append($('<div id="messageList"></div>'));
    $(`#${id}`).append($('<div id="messageInput"></div>'));

    let messageList = new MessageList('messageList', messageService);
    let messageInput = new MessageInput('messageInput', messageService);
    let menuBar = new MenuBar('menuBar', messageService);

    menuBar.onRoomChange(function(room) {
      messageList.setRoom.call(messageList, room);
      messageInput.setRoom.call(messageInput, room);
    }); //possible location for observable.
    menuBar.onRoomAdd(function(room) {
      messageList.setRoom.call(messageList, room);
      messageInput.setRoom.call(messageInput, room);
  });
    // Create messageBar component
    // Messagebar dropdown that we are listening to the change inside the app. 
    // When changes, call messageList.displayMessages(filter);
    // MessageBar needs to bind to the messageService and retrieve the distinct list of rooms.
    
  }
}
var getUsername = function() {
  var search = window.location.search;
  var userIndex = search.lastIndexOf('=');
  return search.slice(userIndex + 1, search.length);
}
var app = new App('app');



