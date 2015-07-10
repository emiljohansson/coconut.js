"use strict";

var fs = require('fs');
var cp = require('child_process');

function runTests(event, filename) {
    if (filename && filename.indexOf('test/') > -1) {
        return;
    }
    cp.spawn('npm', ['run', 'test'], {
            stdio: 'inherit'
        })
        .on('exit', function(error) {});
}

function init() {
    var dir = './';
    fs.watch(dir, {
        persistent: true,
        recursive: true
    }, runTests);
    runTests();
}

init();
