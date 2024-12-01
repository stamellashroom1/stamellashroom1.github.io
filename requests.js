const dateButton = document.getElementById("getDate");
const printDate = document.getElementById("date");

dateButton.addEventListener('click', async () => {
    try {
        const response = await fetch("https://render-app-1-let5.onrender.com/test");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        printDate.textContent = `${data.message} at ${data.timestamp.toLocaleDateString('en-AU',
            {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }
        )}`;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
});