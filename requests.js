const dateButton = document.getElementById("getDate");
const printDate = document.getElementById("date");

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