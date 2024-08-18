const scratchInfo = document.getElementById("scratchInfo");
let scratch = document.getElementById("scratch");
let visible = false;
scratch.style.display = "none";
scratchInfo.addEventListener("click", () => {
    visible = !visible;
    if (visible) {
        scratch.style.display = "inline";
    } else {
        scratch.style.display = "none";
    }
});