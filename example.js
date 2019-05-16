"use strict";
exports.__esModule = true;
var index_1 = require("./index");
//Camera connected to VISCA serial link via USB-to-Serial adapter on ttyUSB0
var PTZ = new index_1["default"]('/dev/ttyUSB0');
var count = 0;
var timer = setInterval(function () {
    console.log("Move 10 left");
    PTZ.panTiltRelative(10, 0);
    count++;
    if (count == 5) {
        clearInterval(timer);
        left();
    }
}, 500);
function left() {
    var count = 0;
    var timer = setInterval(function () {
        console.log("Move 10 right");
        PTZ.panTiltRelative(-10, 0);
        count++;
        if (count == 5)
            process.exit(0);
    }, 500);
}
