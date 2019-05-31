import Camera from './index';
const PTZ = new Camera('/dev/ttyUSB0');
let count = 0

const timer = setInterval(() => {
    console.log("Move 10 left")
    PTZ.panTiltRelative(10, 0)
    count++
    if (count == 5) {
        clearInterval(timer)
        left()
    }
}, 500)

function left() {
    let count = 0
    const timer = setInterval(() => {
        console.log("Move 10 right")
        PTZ.panTiltRelative(-10, 0)
        count++
        if (count == 5) process.exit(0)
    }, 500)
}
