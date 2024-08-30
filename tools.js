// General Calculator
(function () {
    const submit = document.getElementById("generalCalculatorSubmit");
    const answer = document.getElementById("calcAnswer");
    const copy = document.getElementById("copyCalc");
    const ANS = document.getElementById("calcANS");
    copy.style.display = "none";
    ANS.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let numbers = [];
    ANS.addEventListener("click", () => {
        document.getElementById("generalCalculatorInput").value = document.getElementById("generalCalculatorInput").value + numbers[0];
    });
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(numbers[0]);
    });
    submit.addEventListener("click", () => {
        let input = String(document.getElementById("generalCalculatorInput").value);
        if (input) {
            // console.log(input);

            let signs = input.match(/[-\+\*\/^]/g);
            // console.log(`signs ${signs}`);
            if (signs !== null) { // test signs
                let regex = /(\d+\.?\d*)/g;
                numbers = input.match(regex);
                // console.log(`numbers ${numbers}`);
                if (numbers !== null) { // test numbers
                    let signIndex;
                    let signIndex1;
                    let signIndex2;
                    let completedOperation;

                    // handle powers
                    signIndex = 0;
                    while (signs.includes("^")) {
                        signIndex = signs.indexOf("^", signIndex);
                        completedOperation = parseFloat(numbers[signIndex]) ** parseFloat(numbers[signIndex + 1]);
                        numbers.splice(signIndex, 2, completedOperation);
                        signs.splice(signIndex, 1);
                    }
                    // handle multiplication and division
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
                    // handle addition and subtraction
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
                    // console.log(`Answer is ${numbers}`);

                    // display changes after answer had been found
                    answer.style.display = "inline-block";
                    answer.textContent = "Answer is " + numbers;
                    ANS.style.display = "inline-block";
                    copy.style.display = "inline-block";
                } else {
                    alert("Please provide a valid input! (include numbers to be operated on)");
                }
            } else {
                alert("Please provide a valid input! (include operators)");
            }
        } else {
            alert("Please provide an input!");
        }
    });
})();

// Line of best fit
(function () {
    const submit = document.getElementById("lineSubmit");
    const answer = document.getElementById("lineAnswer");
    const copy = document.getElementById("copyline");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution;
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(solution);
    });
    submit.addEventListener("click", () => {
        alert("This is not currently working!");
    });
})();

// Differentiation
(function () {
    const submit = document.getElementById("diffSubmit");
    const answer = document.getElementById("diffAnswer");
    const copy = document.getElementById("copyDiff");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution;
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(solution);
    });
    submit.addEventListener("click", () => {
        alert("This is not currently working!");
    });
})();