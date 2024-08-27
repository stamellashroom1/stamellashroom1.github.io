// General Calculator
(function () {
    const submit = document.getElementById("generalCalculatorSubmit");
    const answer = document.getElementById("calcAnswer");
    answer.textContent = "";
    submit.addEventListener("click", () => {
        let input = String(document.getElementById("generalCalculatorInput").value);
        if (input) {
            console.log(input);

            let signs = input.match(/[-\+\*\/^]/g);
            console.log(`signs ${signs}`);

            let regex = /(\d+\.?\d*)/g;
            let numbers = [];
            numbers = input.match(regex);
            console.log(`numbers ${numbers}`);

            let signIndex;
            let signIndex1;
            let signIndex2;
            let completedOperation;

            signIndex = 0;
            while (signs.includes("^")) {
                signIndex = signs.indexOf("^", signIndex);
                completedOperation = parseFloat(numbers[signIndex]) ** parseFloat(numbers[signIndex + 1]);
                numbers.splice(signIndex, 2, completedOperation);
                signs.splice(signIndex, 1);
            }
            signIndex = 0;
            while (signs.includes("*") || signs.includes("/")) {
                signIndex1 = signs.indexOf("*") === -1 ? Infinity : signs.indexOf("*");
                signIndex2 = signs.indexOf("/") === -1 ? Infinity : signs.indexOf("/");
                signIndex = Math.min(signIndex1, signIndex2);
                completedOperation = signIndex === signIndex1
                    ? parseFloat(numbers[signIndex]) * parseFloat(numbers[signIndex + 1])
                    : parseFloat(numbers[signIndex]) / parseFloat(numbers[signIndex + 1]);
                numbers.splice(signIndex, 2, completedOperation);
                signs.splice(signIndex, 1);
            }
            signIndex = 0;
            while (signs.includes("+") || signs.includes("-")) {
                signIndex1 = signs.indexOf("+") === -1 ? Infinity : signs.indexOf("+");
                signIndex2 = signs.indexOf("-") === -1 ? Infinity : signs.indexOf("-");
                signIndex = Math.min(signIndex1, signIndex2);
                completedOperation = signIndex === signIndex1
                    ? parseFloat(numbers[signIndex]) + parseFloat(numbers[signIndex + 1])
                    : parseFloat(numbers[signIndex]) - parseFloat(numbers[signIndex + 1]);
                numbers.splice(signIndex, 2, completedOperation);
                signs.splice(signIndex, 1);
            }
            console.log(`Answer is ${numbers}`);
            answer.textContent = "Answer is " + numbers;
        }
    });
})();