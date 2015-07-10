"use strict";

var test = require('tape');
var keyboard = require('./');

//http://stackoverflow.com/questions/22574431/testing-keydown-events-in-jasmine-with-specific-keycode
function dispatchKeyEvent(type, code) {
    if (typeof window !== 'object' || typeof document !== 'object') {
        doc.dispatchEvent(type, code);
        return;
    }
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack: filter this otherwise Safari will complain
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        Object.defineProperty(oEvent, 'keyCode', {
            get: function() {
                return this.keyCodeVal;
            }
        });
        Object.defineProperty(oEvent, 'which', {
            get: function() {
                return this.keyCodeVal;
            }
        });
    }

    if (oEvent.initKeyboardEvent) {
        oEvent.initKeyboardEvent(type, true, true, document.defaultView, false, false, false, false, code, code);
    } else {
        oEvent.initKeyEvent(type, true, true, document.defaultView, false, false, false, false, code, 0);
    }

    oEvent.keyCodeVal = code;

    if (oEvent.keyCode !== code) {
        console.log("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ") -> " + code);
    }

    document.dispatchEvent(oEvent);
}

var doc = {
    listeners: {},
    addEventListener: function(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [listener];
            return;
        }
        this.listeners[type].push(listener);
    },
    removeEventListener: function(type, listener) {
        if (!this.listeners[type]) {
            return;
        }
        var i = this.listeners[type].length;
        while(i--) {
            if (this.listeners[type][i] === listener) {
                this.listeners[type].splice(i, 1);
            }
        }
    },
    dispatchEvent: function(type, keyCode) {
        if (!this.listeners[type]) {
            return;
        }
        var i = this.listeners[type].length;
        while(i--) {
            this.listeners[type][i]({
                preventDefault: function() {},
                keyCode: keyCode
            });
        }
    }
};

if (typeof window === 'object' && typeof document === 'object') {
    doc = document;
}

test('should exist', function(t) {
    t.equal(typeof keyboard, 'object');
    t.end();
});

test('should have functions', function(t) {
    t.equal(typeof keyboard.init, 'function');
    t.equal(typeof keyboard.dispose, 'function');
    t.equal(typeof keyboard.charIsDown, 'function');
    t.equal(typeof keyboard.keyIsDown, 'function');
    t.end();
});

test('init', function(t) {
    t.test('should require passing the document', function(t) {
        var caught = false;
        try {
            keyboard.init();
        }
        catch(e) {
            caught = true;
        }
        t.equal(caught, true);
        t.end();
    });

    t.test('should should only initialize once', function(t) {
        t.equal(keyboard.init(doc), undefined);
        t.equal(keyboard.init(doc), undefined);
        t.end();
    });

    t.end();
});

test('charIsDown() & keyIsDown()', function(t) {
    t.test('should return false', function(t) {
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.keyIsDown(), false);
        t.end();
    });

    t.test('should listen to keydown event', function(t) {
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.keyIsDown(), false);
        dispatchKeyEvent("keydown", 69);
        t.equal(keyboard.charIsDown('e'), true);
        t.equal(keyboard.charIsDown('E'), true);
        t.equal(keyboard.charIsDown('f'), false);
        t.equal(keyboard.keyIsDown(), true);
        t.end();
    });

    t.test('should stop listen to keydown event', function(t) {
        t.equal(keyboard.charIsDown('e'), true);
        t.equal(keyboard.keyIsDown(), true);
        dispatchKeyEvent("keyup", 69);
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.charIsDown('E'), false);
        t.equal(keyboard.charIsDown('f'), false);
        t.equal(keyboard.keyIsDown(), false);
        t.end();
    });
    t.end();
});

test('dispose()', function(t) {
    t.test('should stop listening to key events', function(t) {
        keyboard.dispose();
        dispatchKeyEvent("keydown", 69);
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.keyIsDown(), false);
        t.end();
    });

    t.test('should clear list of pressed keys', function(t) {
        keyboard.init(doc);
        dispatchKeyEvent("keydown", 69);
        t.equal(keyboard.charIsDown('e'), true);
        t.equal(keyboard.keyIsDown(), true);
        keyboard.dispose();
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.keyIsDown(), false);
        t.end();
    });
    t.end();
});
