const SerialPort = require('serialport')

const codes: {
    [index: string]: string
} = {
    "address": "81",
    "type": "01",
    "catagory": "06",
    "absolute": "02",
    "relative": "03"
}

function writeToPort(data: any, port: any) {
    const intArray = data.map((x: string) => parseInt(x, 16))
    const buf = Buffer.from(intArray, 16)
    port.write(buf)
    port.write(String.fromCharCode(255))
}

class degCalc {
    static calc(degrees: number, padding: number) {
        let value: number = 0
        if (degrees < 0) {
            if (degrees > -360 && degrees < -1) {
                value = Math.floor(1048576 - (Math.abs(degrees) * (2083 / 10)))
            }
        } else {
            if (degrees <= 360 && degrees >= 1) {
                value = Math.floor(degrees * (2083 / 10))
            }
        }
        let hex = value.toString(16)
        return hex.padStart(padding, '0').split('').map(x => `0${x}`)
    }
    static pan(degrees: number): Array < any > {
        return this.calc(degrees, 5)
    }
    static tilt(degrees: number): Array < any > {
        return this.calc(degrees, 4)
    }
}

class moveController {
    moveType: string
    speed: number
    port: any
    constructor(mvType: string, port: any) {
        this.moveType = codes[mvType];
        this.speed = 18
        this.port = port
    }
    move(p: number, t: number) {
        const {
            address,
            type,
            catagory,
            absolute,
            relative
        } = codes
        const {
            moveType,
            speed
        } = this
        let pan: Array < string > = degCalc.pan(p)
        let tilt: Array < string > = degCalc.tilt(t)
        writeToPort([address, type, catagory, moveType, speed, ...pan, ...tilt], this.port)
    }
}

class Camera {
    online: boolean
    port: any
    _absControl: any
    _relControl: any
    constructor(serialport: string) {
        this.online = false
        this.port = new SerialPort(serialport, {
            baudRate: 9600
        })
        this._absControl = new moveController("absolute", this.port)
        this._relControl = new moveController("relative", this.port)
        this.online = true
    }

    panTiltAbsolute = (panLocation: number, tiltLocation: number) => {
        this._absControl.move(panLocation, tiltLocation)
    }

    panTiltRelative = (panDistance: number, tiltDistance: number) => {
        this._relControl.move(panDistance, tiltDistance)
    }
}

export default Camera;