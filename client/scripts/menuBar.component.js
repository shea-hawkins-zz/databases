var MenuBar = (function () {
    function MenuBar(id, messageService) {
        this.node = $("#" + id);
        this.messageService = messageService;
        this.rooms = [];
        this.tabs = [];
        this.node.html("\n      <ul class=\"nav nav-tabs tabsBar\" role=\"tablist\">\n          <li class=\"dropdown nav-item\">\n            <button class=\"btn btn-primary dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" id=\"roomsButton\">Rooms</button>\n            <ul class=\"dropdown-menu\" id=\"rooms\" aria-labelledby=\"roomsButton\">\n              <li><div class=\"form-group\"><input type=\"text\" class=\"form-control dropdownInput\" id=\"newRoom\"></input><button id=\"newRoomButton\" class=\"btn btn-primary\">New Room</button></div></li>\n            </ul>\n          </li>\n      </ul>\n    ");
        this.getRooms();
        this.room = this.rooms[0] || '';
        this.node.append("<div id=\"currentRoom\">" + this.room + "</div>");
        this.onRoomAdd(this.addRoom.bind(this));
        setInterval(this.getRooms.bind(this), 1000);
    }
    MenuBar.prototype.getRooms = function () {
        // array of rooms
        this.updateRooms(this.messageService.rooms);
    };
    MenuBar.prototype.addRoom = function (roomname) {
        var message = {
            text: " has created a new room " + roomname,
            roomname: roomname,
            username: getUsername()
        };
        this.messageService.postMessage(message);
    };
    MenuBar.prototype.onRoomAdd = function (callback) {
        $('#newRoomButton').on('click', function (event) {
            $('#currentRoom').text($('#newRoom').val());
            callback($('#newRoom').val());
        });
    };
    MenuBar.prototype.onRoomChange = function (callback) {
        var _this = this;
        $('#rooms').on('click', function (event) {
            if (event.target.id === 'newRoomButton') {
                return;
            }
            _this.room = _.escape(event.target.textContent);
            $('#currentRoom').text(_this.room);
            callback(_this.room);
            console.log('roomClicked');
            if (_this.tabs.indexOf(_this.room) < 0) {
                _this.tabs.push(_this.room);
                $('.tabsBar').append($("<li class=\"nav-item\"><a class=\"nav-link active\" data-toggle=\"tab\" role=\"tab\">" + _this.room + "</a></li>")
                    .on('click', function (event) {
                    event.target.textContent;
                    $("#" + event.target.textContent).trigger('click');
                }));
            }
        });
    };
    MenuBar.prototype.changeRoom = function (room) {
    };
    MenuBar.prototype.updateRooms = function (newRooms) {
        var _this = this;
        newRooms.forEach(function (room) {
            room = _.escape(room);
            if (_this.rooms.indexOf(room) < 0) {
                $('#rooms').append($("<li id=\"" + room + "\">" + room + "</li>"));
                _this.rooms.push(room);
            }
        });
    };
    return MenuBar;
}());
