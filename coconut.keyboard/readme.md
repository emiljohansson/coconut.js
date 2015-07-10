# keyboard-handler [![Build Status](https://travis-ci.org/emiljohansson/keyboard-handler.svg?branch=master)](https://travis-ci.org/emiljohansson/keyboard-handler)

> Single keyboard handler for html5 game development.

## Install

```
$ npm install --save keyboard-handler
```

## Usage

```js
var keyboard = require('keyboard-handler');
keyboard.init(document);
keyboard.charIsDown('e');
keyboard.keyIsDown();
keyboard.dispose();
```

## API

### init(documentRef)

Appends the keydown and keyup event to the document.

#### documentRef

Type: `object`

Reference to the document object.

### dispose()

Removes key event listeners and clears the active pressed keys.

### charIsDown(char)

Checks if `char` is currently pressed by the user.

#### char

Type: `string`

A keyboard character.

### keyIsDown()

Checks if any key is down.

## License

MIT © [Emil Johansson](http://emiljohansson.se)
