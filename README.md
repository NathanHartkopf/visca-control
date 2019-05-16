# visca-control
A simple class for open-loop control of Tenveo Brand VISCA protocol cameras.

Features:
* Absolute and Relative Pan/Tilt Control

USAGE:
```javascript
const Camera = require('visca-control')

const tenveo = new Camera('/dev/ttyUSB0')

tenveo.panTiltAbsolute(10,0)
```

WIP:
* Closed-Loop Control
* Inquery Commands (pan/tilt location, camera state, etc)
* Pan/tilt Location Presets
