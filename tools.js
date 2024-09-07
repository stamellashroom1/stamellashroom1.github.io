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
    const docInput = document.getElementById("generalCalculatorInput");
    ANS.addEventListener("click", () => {
        document.getElementById("generalCalculatorInput").value = docInput.value + numbers[0];
    });
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(numbers[0]);
    });
    submit.addEventListener("click", () => {
        solveCalc();
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter")
            solveCalc();
    });
    function solveCalc() {
        let input = String(docInput.value);
        if (input) {
            // console.log(input);

            let signs = input.match(/[-\+\*\/^]/g);
            // console.log(`signs ${signs}`);
            if (signs !== null) { // test signs
                let regex = /(\d+\.?\d*)/g;
                numbers = input.match(regex);
                // console.log(`numbers ${numbers}`);
                if (numbers !== null && numbers.length !== 1) { // test numbers
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
                    answer.textContent = "Answer: " + numbers;
                    ANS.style.display = "inline-block";
                    copy.style.display = "inline-block";
                } else {
                    openModal("Please provide a valid input! (include multiple numbers to be operated on)");
                }
            } else {
                openModal("Please provide a valid input! (include operators)");
            }
        } else {
            openModal("Please provide an input!");
        }
    }
})();

// Line of best fit
(function () {
    const submit = document.getElementById("lineSubmit");
    const answer = document.getElementById("lineAnswer");
    const copy = document.getElementById("copyline");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution = "";
    const docInput = document.getElementById("lineInput");
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(solution);
    });
    submit.addEventListener("click", () => {
        solveLine();
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            solveLine();
        }
    });
    function solveLine() {
        let type = parseInt(document.getElementById("lineType").value);
        if (type !== 1) {
            openModal("Sorry, this is not working yet.");
            return;
        }
        let input = String(docInput.value);
        // console.log(input);
        if (input) {
            let allValues = input.match(/\d+\.?\d*/g);
            let xValues = [];
            let yValues = [];
            // separate x and y values
            for (let i = 0; i < allValues.length; i++) {
                if (i % 2 == 0) {
                    xValues.push(allValues[i]);
                } else {
                    yValues.push(allValues[i]);
                }
            }
            if (xValues.length > 1 && yValues.length > 1) {
                // sort
                let xSorted = [...xValues].sort((a, b) => a - b);
                let ySorted = [];
                let usedIndices = new Set();
                for (let i = 0; i < xSorted.length; i++) { 
                    let indexInOriginal = xValues.indexOf(xSorted[i]);
                    while (usedIndices.has(indexInOriginal)) {
                        indexInOriginal = xValues.indexOf(xSorted[i], indexInOriginal + 1);
                    }
                    ySorted.push(yValues[indexInOriginal]);
                    usedIndices.add(indexInOriginal);
                }
                xValues = [...xSorted];
                yValues = [...ySorted];

                // x values
                let xLowerMean = 0;
                let xUpperMean = 0;
                let xMean = 0;
                for (let i = 0; i < Math.floor(xValues.length / 2); i++) {
                    xLowerMean += parseFloat(xValues[i]);
                }
                xLowerMean /= Math.floor(xValues.length / 2);
                for (let i = Math.ceil(xValues.length / 2); i < xValues.length; i++) {
                    xUpperMean += parseFloat(xValues[i]);
                }
                xUpperMean /= Math.floor(xValues.length / 2);
                for (let i = 0; i < xValues.length; i++) {
                    xMean += parseFloat(xValues[i]);
                }
                xMean /= xValues.length;

                // y values
                let yLowerMean = 0;
                let yUpperMean = 0;
                let yMean = 0;
                for (let i = 0; i < Math.floor(yValues.length / 2); i++) {
                    yLowerMean += parseFloat(yValues[i]);
                }
                yLowerMean /= Math.floor(yValues.length / 2);
                for (let i = Math.ceil(yValues.length / 2); i < yValues.length; i++) {
                    yUpperMean += parseFloat(yValues[i]);
                }
                yUpperMean /= Math.floor(yValues.length / 2);
                for (let i = 0; i < yValues.length; i++) {
                    yMean += parseFloat(yValues[i]);
                }
                yMean /= yValues.length;

                let gradient = (yUpperMean - yLowerMean) / (xUpperMean - xLowerMean);
                if (gradient !== Infinity) {
                    let intercept = yMean - (xMean * gradient);
                    if (gradient == 1) {
                        gradient = "";
                    }
                    solution = "";
                    if (Math.abs(intercept) !== intercept) {
                        solution = "y = " + String(gradient) + "x - " + Math.abs(intercept);
                    } else if (intercept == 0) {
                        solution = "y = " + String(gradient) + "x";
                    } else {
                        solution = "y = " + String(gradient) + "x + " + intercept;
                    }
                    answer.style.display = "inline-block";
                    answer.textContent = "Equation of the line of best fit: " + solution;
                    copy.style.display = "inline-block";
                } else {
                    openModal("This data does not produce a valid line of best fit (gradient is infinity)");
                }
            } else {
                openModal("Please provide at least two datapoints!");
            }
        } else {
            openModal("Please provide an input!");
        }
    }
})();

// Mean
(function () {
    const submit = document.getElementById("meanSubmit");
    const answer = document.getElementById("meanAnswer");
    const copy = document.getElementById("copyMean");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution;
    const docInput = document.getElementById("meanInput");
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(solution);
    });
    submit.addEventListener("click", () => {
        solveMean();
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            solveMean();
        }
    });
    function solveMean() {
        let input = String(docInput.value);
        if (input) {
            let allValues = input.match(/\d+\.?\d*/g);
            if (allValues !== null && allValues.length !== 1) {
                let mean = 0;
                for (let i = 0; i < allValues.length; i++) {
                    mean += parseFloat(allValues[i]);
                }
                mean /= allValues.length;
                solution = mean;
                answer.style.display = "inline-block";
                answer.textContent = "Mean: " + solution;
                copy.style.display = "inline-block";                
            } else {
                openModal("Please provide a valid input! (two or more numbers)");
            }
        } else {
            openModal("Please provide an input!");
        }
    }
})();

// Median
(function () {
    const submit = document.getElementById("medianSubmit");
    const answer = document.getElementById("medianAnswer");
    const copy = document.getElementById("copyMedian");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution;
    const docInput = document.getElementById("medianInput");
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(solution);
    });
    submit.addEventListener("click", () => {
        solveMedian();
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            solveMedian();
        }
    });
    function solveMedian() {
        let input = String(docInput.value);
        if (input) {
            let allValues = input.match(/\d+\.?\d*/g);
            if (allValues !== null && allValues.length > 1) {
                allValues.sort((a, b) => a - b);
                if (allValues.length % 2 == 0) {
                    solution = (parseFloat(allValues[(allValues.length / 2) - 1]) + parseFloat(allValues[allValues.length / 2])) / 2;
                } else {
                    solution = allValues[Math.floor(allValues.length / 2)];
                }
                answer.style.display = "inline-block";
                answer.textContent = "Median: " + solution;
                copy.style.display = "inline-block";
            } else {
                openModal("Please provide a valid input (at least two numbers)");
            }
        } else {
            openModal("Please provide an input!");
        }
    }
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
    const docInput = document.getElementById("diffInput");
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(solution);
    });
    submit.addEventListener("click", () => {
        solveDiff();
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            solveDiff();
        }
    });
    function solveDiff() {
        openModal("This is not currently working!");
    }
})();

// Modal
const modal = document.getElementById("testModal");
const close = document.getElementById("closeModal");
const text = document.getElementById("modalText");
function openModal(content) {
    text.textContent = String(content);
    modal.style.display = "block";
}
close.addEventListener("click", () => {
    modal.style.display = "none";
});
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}