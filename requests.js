const dateButton = document.getElementById("getDate");
const printDate = document.getElementById("date");

const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");

dateButton.addEventListener('click', async () => {
    try {
        const response = await fetch("https://render-app-1-let5.onrender.com/test");
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

function addMessage(message, css) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    if (css) {
        messageDiv.style = css;
    }
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

let nextCSS;

function init() {
    if (ws !== null) {
        ws.close(1000, "close");
        ws = null;
    }
    ws = new WebSocket("ws://render-app-1-let5.onrender.com");

    ws.onmessage = function onMessage(event) {
        const text = event.data;
        if (text[0] === "?") {
            nextCSS = text.slice(1, text.length);
            console.log(nextCSS);
        } else {
            addMessage(text, nextCSS);
            nextCSS = "";
        }
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
    if (messageInput.value) {
        switch (messageInput.value) {
            case "/help":
                addMessage(".", "color:white");
                addMessage("/close: closes connection");
                addMessage("/reset: resets connection");
                addMessage("/open: opens connection if not already");
                addMessage("/clear: clears messages on YOUR end");
                addMessage("/help: displays this menu");
                addMessage(".", "color:white");
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
                if (ws !== null) {
                    addMessage("Connection already open.");
                } else {
                    init();
                }
                break;
            default:
                try {
                    ws.send(messageInput.value);
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