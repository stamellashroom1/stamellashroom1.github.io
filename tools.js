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
const docInput = document.getElementById("diffInput");
const diffAnswer = document.getElementById("diffAnswer");
const diffCopy = document.getElementById("copyDiff");
let diffSolution;
(function () {
    const submit = document.getElementById("diffSubmit");
    diffCopy.style.display = "none";
    diffAnswer.textContent = "";
    diffAnswer.style.display = "none";
    diffCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(diffSolution);
    });
    submit.addEventListener("click", () => {
        openConfirm("This feature is experimental!", "Ok", "Cancel", "diff");
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            openConfirm("This feature is experimental!", "Ok", "Cancel", "diff");
        }
    });
})();
function solveDiff() {
    diffSolution = "";
    // openModal("This is not currently working!");
    let input = String(docInput.value);
    if (input) {
        if (input.includes("x")) {
            input = input.replace("--", "+");
            if (input.substring(0, 1) === "+") {
                input = input.substring(1);
            }

            console.log("start testing");
            console.log(input);
            if (input === "4x-1") {
                console.log("all good");
            }
            let allValues = input.match(/\d*\.?\d*x|\d+\.?\d*/g);
            console.log(allValues);
            if (allValues[0] == "0") {
                allValues.shift();
                console.log("shifted");
            }
            console.log(allValues);
            console.log(allValues[0]);
            let allValuesCopy = [...allValues];
            console.log(allValuesCopy);
            let signs = input.match(/[-\+\*\/^]/g);
            if (signs !== null && signs[0] === "-") {
                allValues.unshift("0");
            }
            allValues = [...allValuesCopy];
            console.log(allValues);
            console.log("end testing");

            console.log(signs);
            if (allValues !== null) {
                if (signs == null) {
                    diffSolution = diff(allValues[0]);
                    diffSolution = cleanInput(diffSolution);
                    diffAnswer.style.display = "inline-block";
                    diffAnswer.textContent = "f'(x) = " + diffSolution;
                    diffCopy.style.display = "inline-block";
                } else {
                    let outputTerms = [];
                    for (let i = 0; i < allValues.length; i++) {
                        if (signs[i] === "^") {
                            let pushToDiff = String(allValues[i]) + "^" + String(allValues[i + 1]);
                            outputTerms.push(diff(pushToDiff));
                            console.log(outputTerms);
                            signs.splice(i);
                            i++;
                        } else {
                            outputTerms.push(diff(allValues[i]));
                            console.log(allValues[i]);
                            console.log(outputTerms);
                        }
                    }
                    for (let i = 0; i < outputTerms.length; i++) {
                        diffSolution += outputTerms[i];
                        if (i < signs.length) {
                            diffSolution += signs[i];
                        }
                    }
                    diffSolution = cleanInput(diffSolution);
                    diffAnswer.style.display = "inline-block";
                    diffAnswer.textContent = "f'(x) = " + diffSolution;
                    diffCopy.style.display = "inline-block";
                }
            } else {
                openModal("Please provide a valid input!");
            }            
        } else {
            diffAnswer.style.display = "inline-block";
            diffAnswer.textContent = "f'(x) = 0";
            diffCopy.style.display = "inline-block";
        }
    } else {
        openModal("Please provide an input!");
    }
}
function diff(term) {
    console.log(term);
    let returnTerm;
    if (term.includes("x")) {
        if (term === "x") {
            return 1;
        } else {
            if (term.includes("^")) {
                let diffTest = term.match(/\^/g);
                if (diffTest.length === 1) {
                    let diffTerm = term.match(/-?\d+\.?\d*/g);
                    if (diffTerm.length === 2) {
                        returnTerm = (parseFloat(diffTerm[0]) * parseFloat(diffTerm[1])) === 1 ? "" : parseFloat(diffTerm[0]) * parseFloat(diffTerm[1]);
                        if (parseFloat(diffTerm[1]) === 1) {
                            return returnTerm;
                        } else {
                            returnTerm = String(parseFloat(diffTerm[1]) - 1) === "1" ? returnTerm + "x" : returnTerm + "x^" + String(parseFloat(diffTerm[1]) - 1);
                            // returnTerm = returnTerm + "x" + "^" + String(parseFloat(diffTerm[1]) - 1);
                            return returnTerm;
                        }
                    } else {
                        if (term === String(diffTerm[0]) + "x^") {
                            return "error - incorrect format";
                        } else {
                            if (parseFloat(diffTerm[0]) - 1 === 0) {
                                returnTerm = diffTerm[0];
                                return returnTerm;
                            } else {
                                returnTerm = String(parseFloat(diffTerm[0]) - 1) === "1" ? diffTerm[0] + "x" : diffTerm[0] + "x^" + String(parseFloat(diffTerm[0]) - 1);
                                return returnTerm;
                            }
                        }
                    }
                } else {
                    return "error - too many exponents";
                }
            } else {
                returnTerm = term.match(/-?\d+\.?\d*/g);
                if (returnTerm.length === 1) {
                    return returnTerm[0];                    
                } else {
                    return "error - no exponent but two numbers";
                }
            }
        }
    } else {
        returnTerm = 0;
        return returnTerm;
    }
}
function cleanInput(input) {
    if (input.length > 1) {
        if (input.substring(0, 2) === "0-") {
            input = input.substring(1)
        }
        input = input.replace("--", "+");
    }
    return input;
}

// Modal
const modal = document.getElementById("testModal");
const modalClose = document.getElementById("closeModal");
const modalText = document.getElementById("modalText");
function openModal(content) {
    modalText.textContent = String(content);
    modal.style.display = "block";
}
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Confirm
const confirmObj = document.getElementById("testConfirm");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmText = document.getElementById("confirmText");
const confirmCheckbox = document.getElementById("confirmRepeatCheck");
let dontShowAgain = [];
let allContent = "";
let confirmResult = "";
let trigger = "";
function openConfirm(content, yes, no, triggerIfTrue) {
    if (!yes && !no) {
        console.log("error - not enough parameters. try openModal(text).")
        return;
    }
    let test = 1;
    allContent = content + yes + no + triggerIfTrue;
    for (let i = 0; i < dontShowAgain.length; i++) {
        if (dontShowAgain[i] === allContent) {
            test = 0;
            break;
        }
    }
    if (test === 1) {
        trigger = triggerIfTrue;
        confirmText.textContent = String(content);
        if (yes) {
            confirmYes.textContent = String(yes);
        } else {
            confirmYes.style.display = "none";
        }
        if (no) {
            confirmNo.textContent = String(no);
        } else {
            confirmNo.style.display = "none";
        }
        confirmObj.style.display = "block";
    } else {
        if (triggerIfTrue === "diff") {
            solveDiff();
        }
    }
}
confirmYes.addEventListener("click", () => {
    if (confirmCheckbox.checked === true) {
        dontShowAgain.push(allContent);
    }
    confirmObj.style.display = "none";
    if (trigger === "diff") {
        solveDiff();
    } else {
        console.log("trigger not found");
    }
});
confirmNo.addEventListener("click", () => {
    confirmObj.style.display = "none";
});
document.getElementById("checkLabel").addEventListener("click", () => {
    confirmCheckbox.checked = !confirmCheckbox.checked;
});