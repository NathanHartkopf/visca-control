"use strict";
exports.__esModule = true;
var SerialPort = require("serialport");
var codes = {
    address: "81",
    type: "01",
    catagory: "06",
    absolute: "02",
    relative: "03"
};
function writeToPort(data, port) {
    var intArray = data.map(function (x) { return parseInt(x, 16); });
    var buf = Buffer.from(intArray, 16);
    port.write(buf);
    port.write(String.fromCharCode(255));
}
var degCalc = /** @class */ (function () {
    function degCalc() {
    }
    degCalc.prototype.calc = function (degrees, padding) {
        var value = 0;
        if (degrees < 0) {
            if (degrees > -360 && degrees < -1) {
                value = Math.floor(1048576 - (Math.abs(degrees) * (2083 / 10)));
            }
        }
        else {
            if (degrees <= 360 && degrees >= 1) {
                value = Math.floor(degrees * (2083 / 10));
            }
        }
        var hex = value.toString(16);
        return hex.padStart(padding, '0').split('').map(function (x) { return "0" + x; });
    };
    degCalc.prototype.pan = function (degrees) {
        return this.calc(degrees, 5);
    };
    degCalc.prototype.tilt = function (degrees) {
        return this.calc(degrees, 4);
    };
    return degCalc;
}());
var moveController = /** @class */ (function () {
    function moveController(mvType, port) {
        this.moveType = codes[mvType];
        this.speed = 18;
        this.port = port;
    }
    moveController.prototype.move = function (p, t) {
        var address = codes.address, type = codes.type, catagory = codes.catagory, absolute = codes.absolute, relative = codes.relative;
        var _a = this, moveType = _a.moveType, speed = _a.speed;
        var calc = new degCalc();
        var pan = calc.pan(p);
        var tilt = calc.tilt(t);
        writeToPort([address, type, catagory, moveType, speed].concat(pan, tilt), this.port);
    };
    return moveController;
}());
var Camera = /** @class */ (function () {
    function Camera(serialport) {
        var _this = this;
        this.panTiltAbsolute = function (panLocation, tiltLocation) {
            _this._absControl.move(panLocation, tiltLocation);
        };
        this.panTiltRelative = function (panDistance, tiltDistance) {
            _this._relControl.move(panDistance, tiltDistance);
        };
        this.online = false;
        this.port = new SerialPort(serialport, {
            baudRate: 9600
        });
        this._absControl = new moveController("absolute", this.port);
        this._relControl = new moveController("relative", this.port);
        this.online = true;
    }
    return Camera;
}());
exports["default"] = Camera;
