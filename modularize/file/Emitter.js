// a complementation of event emitter
var Emitter = function() {
        // JH-bug: create 'event' listener
        var _events = {};
        this.addEvent = this.on = function( eventType,listener ) {
            if (!_events[ eventType ]) {
                _events[eventType] = [];
                _events[eventType].push( listener );
            }
            else {
                var list = _events[eventType];
                var alreadyIn = false;
                _.each(list, function(fn) {
                    if (listener === fn) { alreadyIn = true; }
                });

                if (! alreadyIn ) {
                    list.push(listener);
                }
            }
        };
        this.trigger = function( eventType,msg ) {
            var list = _events[ eventType ];
            if (!list || list.length === 0) { return false; }
            _.each(list, function(fn) {
                fn( msg );
            });
        };
        this.removeEvent = this.off = function( eventType,listener ) {
            var list = _events[ eventType ];
            if (!list || list.length === 0) { return false; }

            if (listener === undefined) { _events[ eventType ] = []; return false;}
            _events[ eventType ] = _.filter(list,
                function(fn) {
                    if (fn !== listener) { return true; }
                });

            };
        return this;
    };

module.exports = Emitter;
