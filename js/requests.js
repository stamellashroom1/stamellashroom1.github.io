const dateButton = document.getElementById("getDate");
const printDate = document.getElementById("date");

const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");

dateButton.addEventListener('click', async () => {
    try {
        const response = await fetch("https://230169.xyz/test");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const timestamp = new Date(data.timestamp);

        const dateTimeString = timestamp.toLocaleString('en-GB', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        printDate.textContent = `${data.message} at ${dateTimeString}`;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
});

let ws = null;

let messageCounter = 0;

const settings = {
    css: true,
    messageIds: false
}

function addMessage(messageInput) {
    const messageDiv = document.createElement("div");
    const idSpan = document.createElement("span");
    idSpan.textContent = `#${messageCounter}: `;
    messageCounter++;
    idSpan.style = settings.messageIds ? "font-size: 1em" : "font-size: 0";
    messageDiv.appendChild(idSpan);

    idSpan.classList.add("msgId");

    let message = messageInput;
    if (messageInput === "/blank") {
        message = "\\color:white;|.";
    }
    if (messageInput === "/line-center") {
        const messageSpan = document.createElement("span");
        for (let i = 0; i < 256; i++) {
            messageSpan.textContent += "-";
        }
        messageDiv.style = "overflow-x:hidden; white-space:nowrap";
        messageDiv.appendChild(messageSpan);
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
        return;
    }

    let textBuffer = "";
    let cssBuffer = "";
    for (let i = 0; i < message.length; i++) {
        if (message[i] === "\\") {
            if (textBuffer) {
                const messageSpan = document.createElement("span");
                messageSpan.textContent = textBuffer;
                if (settings.css) {
                    cssBuffer = expandToCss(cssBuffer);
                    messageSpan.style = cssBuffer + "overflow-wrap: anywhere;"
                } else {
                    messageSpan.style = "overflow-wrap: anywhere;";
                    if (cssBuffer) {
                        messageSpan.setAttribute(
                            "style",
                            `/* ${cssBuffer} */`
                        );
                    }
                }
                messageDiv.appendChild(messageSpan);
                textBuffer = "";
            }
            i++;
            let cssBuff2 = "";
            while (message[i] && message[i] !== "|") {
                cssBuff2 += message[i];
                i++;
            }
            if (cssBuff2 === "clear;" || cssBuff2 === "clear") {
                cssBuffer = "";
            } else if (cssBuff2.slice(0, 3) === "rm:") {
                cssBuff2 = cssBuff2.slice(3);

                cssBuff2 = expandToCss(cssBuff2);

                let rmControls = cssBuff2.split(";");

                let pass = true;
                let controls = cssBuffer.split(";");

                cssBuffer = "";

                for (let i = 0; i < controls.length; i++) {
                    pass = true;
                    for (let j = 0; j < rmControls.length; j++) {
                        if (controls[i] && rmControls[j] && controls[i].indexOf(rmControls[j]) > -1) {
                            pass = false;
                            break;
                        }
                    }
                    if (pass && controls[i]) {
                        cssBuffer += controls[i] + ";";
                    }
                }

            } else {
                cssBuffer += cssBuff2;
            }
        } else {
            textBuffer += message[i];
        }
    }
    if (textBuffer) {
        const messageSpan = document.createElement("span");
        messageSpan.textContent = textBuffer;
        if (settings.css) {
            cssBuffer = expandToCss(cssBuffer);
            messageSpan.style = cssBuffer + "overflow-wrap: anywhere;"
        } else {
            messageSpan.style = "overflow-wrap: anywhere;";
            if (cssBuffer) {
                messageSpan.setAttribute(
                    "style",
                    `/* ${cssBuffer} */`
                );
            }
        }
        messageDiv.appendChild(messageSpan);
        textBuffer = "";
        cssBuffer = "";
    }

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function init() {
    if (ws !== null) {
        ws.close(1000, "close");
        ws = null;
    }
    ws = new WebSocket("wss://230169.xyz"); // wss://render-app-1-let5.onrender.com // wss://localhost:NNNN

    ws.onmessage = function onMessage(event) {
        addMessage(event.data);
    }
}

init()

sendMessage.addEventListener("click", () => {
    message()
});

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        message()
    }
});

function message() {
    let message = messageInput.value;
    if (message) {
        let sliced = "";
        if (message.indexOf(" ") === -1) {
            sliced = message;
        } else {
            sliced = message.slice(0, message.indexOf(" "));
        }
        switch (sliced) {
            case "/help":
                addMessage("/line-center");
                addMessage("/close: \\i;|closes connection");
                addMessage("/reset: \\i;|resets connection");
                addMessage("/open: \\i;|opens connection if not already");
                addMessage("/clear: \\i;|clears messages on YOUR end");
                addMessage("/settings [<key>=<value>]: \\i;|view/change session settings");
                addMessage("/help: \\i;|displays this menu");
                addMessage("/line-center");
                break;
            case "/clear":
                clear()
                break;
            case "/reset":
                init()
                break;
            case "/close":
                close();
                break;
            case "/open":
                if (ws !== null && ws.readyState === ws.OPEN) {
                    addMessage("Connection already open.");
                } else {
                    init();
                }
                break;
            case "/settings":
                if (message === "/settings") {
                    printSettings();
                    break;
                }
                changeSettings(message.slice(message.indexOf(" ") + 1));
                break;
            default:
                if (message[0] === "/") {
                    addMessage("\\b|Not a valid command, type \\i|\\rm:b|/help \\rm:i|\\b| to see options.");
                    break;
                }
                try {
                    ws.send(message);
                } catch (error) {
                    console.log(`ws.send() failed: ${error}`);
                }
        }
        messageInput.value = "";
    }
}

function close() {
    ws.close(1000, "exit");
    ws = null;

    addMessage("Connection closed.");
}

function clear() {
    messages.textContent = "";
}

function changeSettings(str) {
    if (str === "reset") {
        Object.entries(settings).forEach(([key, value]) => {
            delete settings[key];
        });

        settings.css = true;
        printSettings();
        updateSettings();
        return;
    }

    let setting = str.slice(0, str.indexOf("="));

    let value = str.slice(str.indexOf("=") + 1);


    if (value === "false") {
        settings[setting] = false;
    } else if (value === "true") {
        settings[setting] = true;
    } else if (parseInt(value)) {
        settings[setting] = parseFloat(value);
    } else {
        settings[setting] = value;
    }

    printSettings();
    updateSettings();
}

function printSettings() {
    addMessage("/line-center");
    addMessage("\\b;font-size:1.05em;|Current settings:");
    Object.entries(settings).forEach(([key, value]) => {
        addMessage(`${key}: \\i;|${String(value)}`);
    });
    addMessage("/line-center");
}

function expandToCss(compactCss) {
    const lookup = [
        ["i", "font-style:italic"],
        ["b", "font-weight:bold"],
        ["u", "text-decoration:underline"],
        ["s", "text-decoration: line-through"],
        ["c", "font-family:monospace;background:#f3f3f3;padding:2px4px;border-radius:3px;"]
    ]
    let finalItems = [];
    let items = compactCss.split(";");

    nextItem: for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item) {
            for (let j = 0; j < lookup.length; j++) {
                if (item === lookup[j][0]) {
                    finalItems.push(lookup[j][1]);
                    continue nextItem;
                }
            }
            finalItems.push(item);
        }
    }

    let finalCss = finalItems.join(";") + ";";
    return finalCss;
}

function updateSettings() {
    if (settings.messageIds) {
        document.querySelectorAll(".msgId").forEach((element) => {element.style = "font-size: 1em"});
    } else {
        document.querySelectorAll(".msgId").forEach((element) => {element.style = "font-size: 0"});
    }
}