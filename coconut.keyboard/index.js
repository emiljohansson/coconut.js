"use strict";

/**
 * The current list of keys that are pressed.
 * @type {Array}
 */
var pressedKeyCodes;

/**
 * Appends the keydown and keyup event to the document.
 */
exports.init = function() {
    if (Array.isArray(pressedKeyCodes)) {
        return;
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    pressedKeyCodes = [];
};

/**
 * Removes the keydown and keyup event from the document and
 * clears the list of pressed keys.
 */
exports.dispose = function() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    pressedKeyCodes = undefined;
};

/**
 * Checks if `char` is currently pressed by the user.
 *
 * @param  {string} char A keyboard character.
 * @return {boolean}
 * @example
 *
 * keyboard.charIsDown('e');
 * //=> true
 */
exports.charIsDown = function(char) {
    if (!Array.isArray(pressedKeyCodes)) {
        return false;
    }
    char = char.toUpperCase();
    var index = -1;
    var length = pressedKeyCodes.length;
    while (++index < length) {
        if (pressedKeyCodes[index].char === char) {
            return true;
        }
    }
    return false;
};

/**
 * Checks if any key is down.
 *
 * @return {boolean}
 * @example
 *
 * keyboard.keyIsDown();
 * //=> true
 */
exports.keyIsDown = function() {
    return Array.isArray(pressedKeyCodes) && pressedKeyCodes.length > 0;
};

/**
 * Use pressed a key.
 *
 * @param  {object} event
 */
function onKeyDown(event) {
    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);
    addKeyCode(key, keychar);
    event.preventDefault();
}

/**
 * Adds a key object to the list of pressed keys.
 *
 * @param {number} key
 * @param {string} keychar
 */
function addKeyCode(key, keychar) {
    pressedKeyCodes.push({
        key: key,
        char: keychar.toUpperCase()
    });
}

/**
 * User releases a key.
 *
 * @param  {object} event
 */
function onKeyUp(event) {
    var key = event.keyCode || event.which;
    removeKeyCode(key);
}

/**
 * Removes the key matching the list of pressed keys.
 *
 * @param  {number} key
 */
function removeKeyCode(key) {
    var index = pressedKeyCodes.length;
    while (index--) {
        if (pressedKeyCodes[index].key === key) {
            pressedKeyCodes.splice(index, 1);
        }
    }
}
