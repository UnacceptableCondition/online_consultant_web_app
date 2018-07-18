/* exported eventEmitter */
var eventEmitter = (function createEventEmitter () {
    function EventEmitter() {
        this.events = {};
    }

    EventEmitter.prototype.addSubscribe = function addSubscribe(eventName, callback ) {
        var that = this;
        if( !this.events[eventName] ) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);

        function removeSubscribe () {
            that.events[eventName] = that.events[eventName].filter(function remove (elementCallback) {
                return elementCallback !== callback
            })
        }

        return removeSubscribe
    };

    EventEmitter.prototype.emit = function emit (eventName, data) {
        var event = this.events[eventName];
        if( event ) {
            event.forEach(function invoke (callback) {
                callback.call(null, data);
            });
        }
    };

    return new EventEmitter();
})();