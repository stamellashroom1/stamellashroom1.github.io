let worldTime = 0;

const time = setInterval(() => {
    worldTime = Math.round((worldTime * 100 + 1)) / 100;
}, 10)

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pixelRatio = window.devicePixelRatio || 1;

let downSizing = 4;

const angleRot = Math.PI / 18; // 10 degrees
const twoPi = Math.PI * 2;
const piDiv180 = Math.PI / 180;

let playerX = 0; // forwards/backwards
let playerY = 0; // left/right
let playerZ = 2; //up/down

let camX = 0; // positive is right
let camY = 0; // positive is up

let planes = [
    {   
        x: 0,
        y: 0,
        z: 1,
        num: 0,
        colour: {
            r: 0,
            g: 0,
            b: 0,
            a: 255,
        },
    },
];

let cubes = [ // general 3d rectangular prisms. can be a plane if the width is 0
    {
        id: "red-Right-Movement",
        x: [1, 3],
        y: [1, 3],
        z: [0, 3],
        colour: {
            r: 255,
            g: 0,
            b: 0,
            a: 255,
        },
        movement: {
            type: "loop",
            axies: ["x", "y"], // multiples for different axies
            speeds: [2, 2], // per second
            times: [10, 10], // total time
            starts: [1, 1],
            offsets: [0, 0],
        },
        visible: true,
        wireframe: {
            colour: {
                r: 0,
                g: 255,
                b: 0,
                a: 255,
            },
        },
    },
    {
        id: "blue-Left",
        x: [1, 3],
        y: [-3, -1],
        z: [0, 3],
        colour: {
            r: 0,
            g: 0,
            b: 255,
            a: 255,
        },
        visible: true,
        wireframe: {
            colour: {
                r: 255,
                g: 0,
                b: 0,
                a: 255,
            },
        },
    },
];

let cosXLookup;
let sinXLookup;
let cosYLookup;
let sinYLookup;

let cosCamXLookup;
let cosCamYLookup;
let sinCamXLookup;
let sinCamYLookup;

let negSinYLookup;
let negCosYLookup;
let negSinCamYLookup;
let negCosCamYLookup;

function init() {
    canvas.width = Math.ceil((window.innerWidth * pixelRatio) / downSizing);
    canvas.height = Math.ceil((window.innerHeight * pixelRatio) / downSizing);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(Math.ceil(pixelRatio / downSizing), Math.ceil(pixelRatio / downSizing));

    cosXLookup = new Float32Array(canvas.width);
    sinXLookup = new Float32Array(canvas.width);
    cosYLookup = new Float32Array(canvas.height);
    sinYLookup = new Float32Array(canvas.height);

    cosCamXLookup = new Float32Array(360);
    cosCamYLookup = new Float32Array(360);
    sinCamXLookup = new Float32Array(360);
    sinCamYLookup = new Float32Array(360);

    negSinYLookup = new Float32Array(canvas.height);
    negCosYLookup = new Float32Array(canvas.height);
    negSinCamYLookup = new Float32Array(360);
    negCosCamYLookup = new Float32Array(360);

    let halfHeight = canvas.height / 2;
    let halfWidth = canvas.width / 2;

    for (let x = 0; x < canvas.width; x++) {
        let relativeX = x - halfWidth;
        let angleX = Math.atan2(relativeX, halfWidth);
        cosXLookup[x] = Math.cos(angleX);
        sinXLookup[x] = Math.sin(angleX);
    }

    for (let y = 0; y < canvas.height; y++) {
        let relativeY = y - halfHeight;
        let angleY = Math.atan2(relativeY, halfHeight);
        cosYLookup[y] = Math.cos(angleY);
        sinYLookup[y] = Math.sin(angleY);

        negCosYLookup[y] = Math.cos(-angleY);
        negSinYLookup[y] = Math.sin(-angleY);
    }

    for (let i = 0; i < 360; i++) {
        const radians = i * piDiv180;
        cosCamXLookup[i] = Math.cos(radians);
        sinCamXLookup[i] = Math.sin(radians);
        cosCamYLookup[i] = Math.cos(radians);
        sinCamYLookup[i] = Math.sin(radians);
    
        negCosCamYLookup[i] = Math.cos(-radians);
        negSinCamYLookup[i] = Math.sin(-radians);
    }
}

function render() {
    // movement
    for (let i = 0; i < cubes.length; i++) {
        let cube = cubes[i];
        if (cube.movement) {
            if (cube.movement.type === "loop") {
                for (let j = 0; j < cube.movement.axies.length; j++) {
                    let loopTime = cube.movement.times[j];
                    let relTime = (worldTime + cube.movement.offsets[j]) % loopTime;
                    let dimension = cube[cube.movement.axies[j]][1] - cube[cube.movement.axies[j]][0];
                    if (relTime > loopTime / 2) {
                        relTime = loopTime - relTime;
                    }
                    cube[cube.movement.axies[j]][0] = cube.movement.starts[j] + relTime * cube.movement.speeds[j];
                    cube[cube.movement.axies[j]][1] = cube[cube.movement.axies[j]][0] + dimension;
                }
            }
        }
    }

    let pixelX = 0;
    let pixelY = 0;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    while (pixelY < canvas.height) {
        pixelX = 0;

        while (pixelX < canvas.width) {

            // let cosAngleY = cosYLookup[pixelY] * cosCamYLookup[camY] - sinYLookup[pixelY] * sinCamYLookup[camY];
            // let cosAngleX = cosXLookup[pixelX] * cosCamXLookup[camX] - sinXLookup[pixelX] * sinCamXLookup[camX];
            // let sinAngleX = sinXLookup[pixelX] * cosCamXLookup[camX] + cosXLookup[pixelX] * sinCamXLookup[camX];
            // let sinNegAngleY = negSinYLookup[pixelY] * negCosCamYLookup[camY] + negCosYLookup[pixelY] * negSinCamYLookup[camY];
            // let vector = {
            //     x: cosAngleX * cosAngleY,
            //     y: sinAngleX * cosAngleY,
            //     z: sinNegAngleY,
            // };

            const cosCamX = cosCamXLookup[camX];
            const sinCamX = sinCamXLookup[camX];
            const sinX = sinXLookup[pixelX];
            const cosX = cosXLookup[pixelX];
        
            const cosAngleY = cosYLookup[pixelY] * cosCamYLookup[camY] - sinYLookup[pixelY] * sinCamYLookup[camY];
            const cosAngleX = cosX * cosCamX - sinX * sinCamX;
            const sinAngleX = sinX * cosCamX + cosX * sinCamX;
            const sinNegAngleY = negSinYLookup[pixelY] * negCosCamYLookup[camY] + negCosYLookup[pixelY] * negSinCamYLookup[camY];
        
            let vector = {
                x: cosAngleX * cosAngleY,
                y: sinAngleX * cosAngleY,
                z: sinNegAngleY,
            }

            let currentLowest = {
                tValue: Infinity,
                colour: {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 255,
                },
            };
            for (let i = 0; i < planes.length; i++) {
                let plane = planes[i];
                let equalTo = plane.num - plane.x * playerX - plane.y * playerY - plane.z * playerZ;
                let coefficient = plane.x * vector.x + plane.y * vector.y + plane.z * vector.z;

                if (coefficient !== 0) {
                    let t = equalTo / coefficient;
                    if (t > 0 && t < currentLowest.tValue) {
                        currentLowest.tValue = t;
                        currentLowest.colour.r = plane.colour.r;
                        currentLowest.colour.g = plane.colour.g;
                        currentLowest.colour.b = plane.colour.b;
                        currentLowest.colour.a = plane.colour.a;
                    }
                } else {
                    // console.log(`div by 0 error: ${equalTo}, ${coefficient}`);
                }
            }

            for (let i = 0; i < cubes.length; i++) {
                let cube = cubes[i];

                if (!cube.visible) {
                    break;
                }

                let computed = {
                    xt: {
                        min: -Infinity,
                        max: Infinity,
                    },
                    yt: {
                        min: -Infinity,
                        max: Infinity,
                    },
                    zt: {
                        min: -Infinity,
                        max: Infinity,
                    },
                };
                if (vector.x !== 0) {
                    let values = [(cube.x[0] - playerX) / vector.x, (cube.x[1] - playerX) / vector.x]
                    computed.xt.min = Math.min(values[0], values[1]);
                    computed.xt.max = Math.max(values[0], values[1]);
                } else if (playerX > cube.x[1] || playerX < cube.x[0]) {
                    break;
                }
                if (vector.y !== 0) {
                    let values = [(cube.y[0] - playerY) / vector.y, (cube.y[1] - playerY) / vector.y]
                    computed.yt.min = Math.min(values[0], values[1]);
                    computed.yt.max = Math.max(values[0], values[1]);
                } else if (playerY > cube.y[1] || playerY < cube.y[0]) {
                    break;
                }
                if (vector.z !== 0) {
                    let values = [(cube.z[0] - playerZ) / vector.z, (cube.z[1] - playerZ) / vector.z]
                    computed.zt.min = Math.min(values[0], values[1]);
                    computed.zt.max = Math.max(values[0], values[1]);
                } else if (playerZ > cube.z[1] || playerZ < cube.z[0]) {
                    break;
                }
                let overlap1 = Math.max(computed.xt.min, computed.yt.min, computed.zt.min);
                let overlap2 = Math.min(computed.xt.max, computed.yt.max, computed.zt.max);
                if (overlap1 <= overlap2 && overlap2 > 0 && overlap1 < currentLowest.tValue && overlap1 !== -Infinity && overlap2 !== Infinity) {
                    currentLowest.tValue = overlap1;
                    currentLowest.colour.r = cube.colour.r;
                    currentLowest.colour.g = cube.colour.g;
                    currentLowest.colour.b = cube.colour.b;
                    currentLowest.colour.a = cube.colour.a;
                }
            }

            let index = (pixelY * canvas.width + pixelX) * 4;
            data[index] = currentLowest.colour.r;
            data[index + 1] = currentLowest.colour.g;
            data[index + 2] = currentLowest.colour.b;
            data[index + 3] = currentLowest.colour.a;

            pixelX++;
        }
        pixelY++;
    }
    ctx.putImageData(imageData, 0, 0);
}

init();
render();

const keyStates = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
    Space: false,
    Shift: false,
};

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (Object.hasOwn(keyStates, key)) {
        keyStates[key] = true;
    }
    if (Object.hasOwn(keyStates, key.toLowerCase())) {
        keyStates[key.toLowerCase()] = true;
    }
    if (key === " ") {
        keyStates.Space = true;
    }
});

document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (Object.hasOwn(keyStates, key)) {
        keyStates[key] = false;
    }
    if (Object.hasOwn(keyStates, key.toLowerCase())) {
        keyStates[key.toLowerCase()] = false;
    }
    if (key === " ") {
        keyStates.Space = false;
    }
});

function gameLoop() {
    const actions = {
        w: () => {
            playerX += Math.cos(camX * piDiv180) * 0.05;
            playerY += Math.sin(camX * piDiv180) * 0.05;
        },
        a: () => {
            playerX += Math.sin(camX * piDiv180) * 0.05;
            playerY -= Math.cos(camX * piDiv180) * 0.05;
        },
        s: () => {
            playerX -= Math.cos(camX * piDiv180) * 0.05;
            playerY -= Math.sin(camX * piDiv180) * 0.05;
        },
        d: () => {
            playerX -= Math.sin(camX * piDiv180) * 0.05;
            playerY += Math.cos(camX * piDiv180) * 0.05;
        },
        ArrowUp: () => {
            camY -= 1;
            camY = (camY + 360) % 360;
        },
        ArrowLeft: () => {
            camX -= 1;
            camX = (camX + 360) % 360;
        },
        ArrowDown: () => {
            camY += 1;
            camY = (camY + 360) % 360;
        },
        ArrowRight: () => {
            camX += 1;
            camX = (camX + 360) % 360;
        },
        Space: () => {
            playerZ += 0.1;
        },
        Shift: () => {
            playerZ -= 0.1;
        },
    };
    for (const key in actions) {
        if (keyStates[key]) {
            actions[key]();
        }
    }
    render();

    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

window.addEventListener("resize", () => {
    init();
    render();
});

document.addEventListener("keypress", (event) => {
    if (event.key === "[") {
        downSizing += 0.5;
        init()
        render()
    } else if (event.key === "]") {
        if (downSizing >= 1.5) {
            downSizing -= 0.5;
            init()
            render()
        }
    }
});