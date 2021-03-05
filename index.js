



function broadcastChannelCreator (name) {

    function lsBroadcastChannel (name) {
        this.name = name;
        this.init(this.name);
        this.createListener();
        this.onmessage = this.onmessage.bind(this);
        this.listener = this.listener.bind(this);
    }
    
    lsBroadcastChannel.prototype.init = function (connectionName) {
        localStorage.setItem(connectionName, '');
    }
    
    lsBroadcastChannel.prototype.postMessage = function (message) {
        localStorage.setItem(this.name, JSON.stringify(message));
    }
    
    lsBroadcastChannel.prototype.listener = function (event) {
        var _event = event;
        _event.data = _event.newValue;
        console.log(_event);
        this.onmessage(_event);
    }
    
    lsBroadcastChannel.prototype.createListener = function () {
        window.addEventListener('storage', this.listener);
    }
    
    lsBroadcastChannel.prototype.close = function () {
        window.removeEventListener('storage', this.listener);
        localStorage.deleteItem(this.name);
    }
    
    lsBroadcastChannel.prototype.onmessage = function () {};

    var station = window.BroadcastChannel ? BroadcastChannel : lsBroadcastChannel;

    var stationInstance = new station(name);

    var o = {
        on: function (callback) {
            !!callback && (stationInstance.onmessage = function (event) { callback(event) });
        },

        close: function () {
            stationInstance.close();
        },

        emit: function (message) {
            stationInstance.postMessage(message);
        }
    };

    return o;
}

var station = broadcastChannelCreator('tester');
var i = 1;

station.on(function (event) {
    console.log(event);
});

document.querySelector('.btn').addEventListener('click', function () {
    station.emit({a: i});
    i++;
});