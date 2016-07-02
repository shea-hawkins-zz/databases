var MessageList = (function () {
    function MessageList(id, messageService) {
        //messageService.getObservable().subscribe();
        this.node = $("#" + id);
        this.subscribeToService(messageService);
        this.messages = [];
        this.friends = [];
        this.filter = function (message) {
            return true;
        };
    }
    MessageList.prototype.subscribeToService = function (messageService) {
        var _this = this;
        messageService.observable.subscribe(function (message) {
            if (_this.filter(message)) {
                _this.displayMessage(message);
            }
            _this.messages.push(message);
        });
    };
    MessageList.prototype.displayMessage = function (message) {
        var _this = this;
        // do cross scripting through username
        if (this.friends.indexOf(message.username) >= 0) {
            var friend = "friend " + message.username;
        }
        else {
            var friend = "" + message.username;
        }
        this.node.append($('<div class="card"></div>'));
        this.node.last().append($("<div class=\"card-header user " + friend + "\">" + _.escape(message.username) + "</div>").hide().fadeIn(2000)
            .on('click', function (event) {
            if (_this.friends.indexOf(event.target.textContent) < 0) {
                _this.friends.push(event.target.textContent);
                console.log($("." + event.target.textContent).addClass('friend'));
            }
        })).append($("<div class=\"card-block message\">" + _.escape(message.text) + "</div>").hide().fadeIn(2000));
    };
    MessageList.prototype.setFilter = function (key, value) {
        // Display Messages
        // do cross scripting through username
        // First blast currently existing messages
        this.node.html('');
        // Filter preexisting messages
        this.filter = function (message) {
            return message[key] === value;
        };
        _(this.messages).filter(this.filter).forEach(this.displayMessage.bind(this));
    };
    MessageList.prototype.setRoom = function (room) {
        this.setFilter('roomname', room);
    };
    return MessageList;
}());
