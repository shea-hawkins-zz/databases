var MessageService = (function () {
    function MessageService(url) {
        this.url = url;
        this.getUrl = url + '?order=-createdAt';
        this.ajaxOptions = {
            url: url,
            contentType: 'application/jsonp',
            jsonp: true
        };
        this.messages = [];
        this.rooms = [];
        this.observable = this._createObserver();
        this._setScheduler();
    }
    MessageService.prototype._isDuplicate = function (message) {
        for (var _i = 0, _a = this.messages; _i < _a.length; _i++) {
            var oldMessage = _a[_i];
            if (oldMessage.objectId === message.objectId) {
                return true;
            }
        }
        return false;
    };
    MessageService.prototype._parseMessages = function (data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var message = data_1[_i];
            if (!this._isDuplicate(message)) {
                this.messages.push(message);
                // Observer only exists when the object is currenstly being subscribed to.
                this.observer.next(message);
            }
            if (this.rooms.indexOf(message.roomname) < 0) {
                this.rooms.push(message.roomname);
            }
        }
    };
    MessageService.prototype._setScheduler = function () {
        this.getMessages();
        this.scheduler = Rx.Scheduler.default.schedulePeriodic(null, 1000, this.getMessages.bind(this));
    };
    MessageService.prototype._createObserver = function () {
        var _this = this;
        return Rx.Observable.create(function (observer) {
            _this.observer = observer;
        });
    };
    MessageService.prototype.getMessages = function () {
        var _this = this;
        $.ajax({
            url: this.getUrl,
            type: 'GET',
            contentType: 'application/jsonp',
            jsonp: true,
            success: function (data) {
                _this._parseMessages(data.results);
            }
        });
        return this.messages;
    };
    MessageService.prototype.postMessage = function (message) {
        $.ajax({
            url: this.url,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(message),
            success: function () {
                console.log('Message delivered');
            }
        });
    };
    return MessageService;
}());
