const memSave = document.getElementById("memSave");
const memLoad = document.getElementById("memLoad");
const memClear = document.getElementById("memClear");
const currentID = document.getElementById("memID");
const table = document.getElementById("memTable");

let storedValues = {};
let storedKeys = localStorage.getItem("memList") === null ? [] : localStorage.getItem("memList").split(";");

console.log(storedKeys);
for (let i = 0; i < storedKeys.length; i++) {
    if (storedKeys[i]) {
        let value = localStorage.getItem(storedKeys[i]);
        if (value) {
            storedValues[storedKeys[i]] = value;
            let newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${storedKeys[i]}</td>
                <td>${storedValues[storedKeys[i]]}</td>
            `;
            table.appendChild(newRow);
        }
    }
}

function cookies() {
    let cookies = document.cookie.split(";");
    let memID = null;
    for (let i = 0; i < cookies.length; i++) {
        let cookiePair = cookies[i].split("=");
        if (cookiePair[0].trim() === "memID") {
            memID = cookiePair[1]?.trim();
            break;
        }
    }
    return memID;
}
let memID = cookies()
currentID.value = memID;

function checkMemID() {
    if (memID === null) {
        memID = Math.random().toString(36).substring(2, 7);
        document.cookie = "memID=" + memID + ";path=/";
        currentID.value = memID;
    }
}

currentID.addEventListener("change", () => {
    memID = currentID.value;
    // console.log(memID);
});

// memSave.addEventListener("click", () => {
//     document.cookie = "memID=" + memID + ";path=/";
// });

// memLoad.addEventListener('click', () => {
//     checkMemID();
//     storedValues = getData(`https://render-app-1-let5.onrender.com/memData?memID=${memID}`);
// });

memClear.addEventListener('click', () => {
    for (let i = 0; i < storedKeys.length; i++) {
        localStorage.removeItem(storedKeys[i]);
    }
    localStorage.removeItem("memList");
    storedValues = {};
    storedKeys = [""];

    // checkMemID()
    // postData("https://render-app-1-let5.onrender.com/memData", {
    //     "clear": memID
    // });

    table.innerHTML = `
        <tr>
            <th>Input</th>
            <th>Result</th>
        </tr>
    `;
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains("mem")) {
        let id = event.target.id.match(/\d+/)[0];
        let input = document.getElementById(`input-${id}`).value;
        let output = document.getElementById(`ans-${id}`).textContent;

        localStorage.setItem(input, output);
        let currentList = localStorage.getItem("memList");
        currentList = currentList === null ? input : currentList + ";" + input;
        localStorage.setItem("memList", currentList);

        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${input}</td>
            <td>${output}</td>
        `;
        table.appendChild(newRow);

        storedKeys.push(input);
        storedValues[input] = output;
    }
});

async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("getData fetch did not return an ok response");
        }
        const data = await response.json();
        return JSON.parse(data);
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

async function postData(url, data) {
    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error sending data:', error);
    }
}