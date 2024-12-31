const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

let cubes = [
    {
        x: [1, 2],
        y: [1, 2],
        z: [0, 2],
        colour: {
            r: 255,
            g: 0,
            b: 0,
            a: 255,
        },
    },
];

let angleXLookup = [];
let angleYLookup = [];
let cosXLookup = [];
let sinXLookup = [];
let cosYLookup = [];
let sinYLookup = [];

let cosCamXLookup = [];
let cosCamYLookup = [];
let sinCamXLookup = [];
let sinCamYLookup = [];

let negSinYLookup = [];
let negCosYLookup = [];
let negSinCamYLookup = [];
let negCosCamYLookup = [];

function init() {
    let halfHeight = canvas.height / 2;
    let halfWidth = canvas.width / 2;

    for (let x = 0; x < canvas.width; x++) {
        let relativeX = x - halfWidth;
        let angleX = Math.atan2(relativeX, halfWidth);
        angleXLookup[x] = angleX;
        cosXLookup[x] = Math.cos(angleX);
        sinXLookup[x] = Math.sin(angleX);
    }

    for (let y = 0; y < canvas.height; y++) {
        let relativeY = y - halfHeight;
        let angleY = Math.atan2(relativeY, halfHeight);
        angleYLookup[y] = angleY;
        cosYLookup[y] = Math.cos(angleY);
        sinYLookup[y] = Math.sin(angleY);

        negCosYLookup[y] = Math.cos(-angleY);
        negSinYLookup[y] = Math.sin(-angleY);
    }

    for (let i = 0; i < 360; i += 1) {
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
    let pixelX = 0;
    let pixelY = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    while (pixelY < canvas.height) {
        pixelX = 0;

        while (pixelX < canvas.width) {

            // vector
            // let vector = {
            //     x: Math.cos(angleX) * Math.cos(angleY),
            //     y: Math.sin(angleX) * Math.cos(angleY),
            //     z: Math.sin(-angleY),
            // };

            let cosAngleY = cosYLookup[pixelY] * cosCamYLookup[camY] - sinYLookup[pixelY] * sinCamYLookup[camY];
            let cosAngleX = cosXLookup[pixelX] * cosCamXLookup[camX] - sinXLookup[pixelX] * sinCamXLookup[camX];
            let sinAngleX = sinXLookup[pixelX] * cosCamXLookup[camX] + cosXLookup[pixelX] * sinCamXLookup[camX];
            let sinNegAngleY = negSinYLookup[pixelY] * negCosCamYLookup[camY] + negCosYLookup[pixelY] * negSinCamYLookup[camY];
            let vector = {
                x: cosAngleX * cosAngleY,
                y: sinAngleX * cosAngleY,
                z: sinNegAngleY,
            };

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
                    // console.log(vector);
                    // console.log(computed);
                    // console.log(overlap1, overlap2);
                    // console.log(pixelX, pixelY);
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
    // console.log(imageData);
    // console.log(data);
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
}

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (Object.hasOwn(keyStates, key)) {
        keyStates[key] = true;
    }
});

document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (Object.hasOwn(keyStates, key)) {
        keyStates[key] = false;
    }
});

function gameLoop() {
    let check = false;
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
    };
    for (const key in actions) {
        if (keyStates[key]) {
            actions[key]();
            check = true;
        }
    }
    if (check) {
        render();
        // console.log("rendered");
    }

    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

document.addEventListener("resize", () => {
    init();
    render();
});