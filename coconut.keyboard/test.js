"use strict";

var test = require('tape');
var jQuery = require('jQuery');
var keyboard = require('./');

//http://stackoverflow.com/questions/22574431/testing-keydown-events-in-jasmine-with-specific-keycode
function jsKeydown(type, code) {
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

test('should should only initialize once', function(t) {
    t.equal(keyboard.init(), undefined);
    t.equal(keyboard.init(), undefined);
    t.end();
});

test('charIsDown()', function(t) {
    t.test('should return false', function(t) {
        t.equal(keyboard.charIsDown('e'), false);
        t.end();
    });

    t.test('should listen to keydown event', function(t) {
        t.equal(keyboard.charIsDown('e'), false);
        jsKeydown("keydown", 69);
        t.equal(keyboard.charIsDown('e'), true);
        t.equal(keyboard.charIsDown('E'), true);
        t.equal(keyboard.charIsDown('f'), false);
        t.end();
    });

    t.test('should stop listen to keydown event', function(t) {
        t.equal(keyboard.charIsDown('e'), true);
        jsKeydown("keyup", 69);
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.charIsDown('E'), false);
        t.equal(keyboard.charIsDown('f'), false);
        t.end();
    });
    t.end();
});

test('dispose()', function(t) {
    t.test('should stop listening to key events', function(t) {
        keyboard.dispose();
        jsKeydown("keydown", 69);
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.keyIsDown(), false);
        t.end();
    });

    t.test('should clear list of pressed keys', function(t) {
        keyboard.init();
        jsKeydown("keydown", 69);
        t.equal(keyboard.charIsDown('e'), true);
        t.equal(keyboard.keyIsDown(), true);
        keyboard.dispose();
        t.equal(keyboard.charIsDown('e'), false);
        t.equal(keyboard.keyIsDown(), false);
        t.end();
    });
    t.end();
});
