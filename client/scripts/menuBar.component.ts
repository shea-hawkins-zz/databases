class MenuBar {
  constructor (id, messageService) {
    this.node = $(`#${id}`);
    this.messageService = messageService;
    this.rooms = [];
    this.tabs = [];
    this.node.html(`
      <ul class="nav nav-tabs tabsBar" role="tablist">
          <li class="dropdown nav-item">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" id="roomsButton">Rooms</button>
            <ul class="dropdown-menu" id="rooms" aria-labelledby="roomsButton">
              <li><div class="form-group"><input type="text" class="form-control dropdownInput" id="newRoom"></input><button id="newRoomButton" class="btn btn-primary">New Room</button></div></li>
            </ul>
          </li>
      </ul>
    `);
    
    this.getRooms();
    this.room = this.rooms[0] || '';
    this.node.append(`<div id="currentRoom">${this.room}</div>`);
    this.onRoomAdd(this.addRoom.bind(this));
    setInterval(this.getRooms.bind(this), 1000);
  }
  
  getRooms() {
    // array of rooms
    this.updateRooms(this.messageService.rooms);
  }

  addRoom(roomname) {
    var message = {
      text: ` has created a new room ${roomname}`,
      roomname: roomname,
      username: getUsername()
    };
    this.messageService.postMessage(message);
  }

  onRoomAdd(callback) {
    $('#newRoomButton').on('click', (event) => {
      $('#currentRoom').text($('#newRoom').val());
      callback($('#newRoom').val());
    });
  }

  onRoomChange(callback) {
    $('#rooms').on('click', (event) => {
      if (event.target.id === 'newRoomButton') { return; }
      this.room = _.escape(event.target.textContent);
      $('#currentRoom').text(this.room);
      callback(this.room);
      console.log('roomClicked');
      if (this.tabs.indexOf(this.room) < 0) {

        this.tabs.push(this.room);

        $('.tabsBar').append($(`<li class="nav-item"><a class="nav-link active" data-toggle="tab" role="tab">${this.room}</a></li>`)
          .on('click', (event) => {
            event.target.textContent;
            $(`#${event.target.textContent}`).trigger('click');
          }));
      }

    });
  }

  changeRoom(room) {

  }

  updateRooms(newRooms) {
    newRooms.forEach(room => {
      room = _.escape(room);
      if (this.rooms.indexOf(room) < 0) {
        $('#rooms').append($(`<li id="${room}">${room}</li>`));
        this.rooms.push(room);
      }
    });
  }

  


}