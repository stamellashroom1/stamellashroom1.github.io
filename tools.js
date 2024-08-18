// General Calculator
(function () {
    const submit = document.getElementById("generalCalculatorSubmit");
    submit.addEventListener("click", () => {
        let input = document.getElementById("generalCalculatorInput").value;
        console.log(input);
    });
})();