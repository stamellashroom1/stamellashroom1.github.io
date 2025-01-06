// General Calculator
(function () {
    const submit = document.getElementById("generalCalculatorSubmit");
    const answer = document.getElementById("ans-1");
    const copy = document.getElementById("copyCalc");
    const ANS = document.getElementById("calcANS");
    copy.style.display = "none";
    ANS.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let ans;
    const docInput = document.getElementById("input-1");
    ANS.addEventListener("click", () => {
        document.getElementById("input-1").value = docInput.value + ans;
    });
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(ans);
    });
    submit.addEventListener("click", () => {
        ans = solveCalc(docInput.value); // call function, recursive
        if (ans !== "err") {
            answer.style.display = "inline-block"; // display changes after answer had been found
            answer.textContent = "Answer: " + ans;
            ANS.style.display = "inline-block";
            copy.style.display = "inline-block";
            document.getElementById("mem-1").style.display = "inline-block";
        }
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            let ans = solveCalc(docInput.value); // same as above
            if (ans !== "err") {
                answer.style.display = "inline-block";
                answer.textContent = "Answer: " + ans;
                ANS.style.display = "inline-block";
                copy.style.display = "inline-block";
                document.getElementById("mem-1").style.display = "inline-block";
            }
        }
    });
    function solveCalc(str) {
        let input = String(str);

        input = input.replaceAll("{", "("); // clean code so brackets are the same
        input = input.replaceAll("[", "(");
        input = input.replaceAll("}", ")");
        input = input.replaceAll("]", ")");
        
        if (input) {

            if (input[0] === "-") {
                input = "0" + input;
            }

            input = input.replaceAll(/(?<=\d)-/g, "+-"); // matching \d before -, then replacing the - with "+-"
            input = input.replaceAll(/(?<=\d)\(/g, "*("); // insert * if there is a digit then immediately a (
            input = input.replaceAll(/(?=\d)\)/g, ")*"); // same as above but for end of brackets
            input = input.replaceAll(")(", ")*(");
            
            let signs = []; // this block: fill signs and numbers, splits around brackets
            let numbers = [];
            let current = "";
            let brackets = 0;
            for (let i = 0; i < input.length; i++) {
                if (brackets > 0) { // if the current part is still in a bracket
                    current += input[i];

                } else if (brackets === 0) {
                    if (input[i] === "+" || input[i] === "*" || input[i] === "/" || input[i] === "^") { // check if the term has ended, hence needs to be pushed
                        signs.push(input[i]); // make sure to update signs
                        numbers.push(current);
                        current = "";

                    } else {
                        current += input[i]; // otherwise add to current
                    }
                } else {
                    openModal("Input error: wrong number of opening + closing brackets (1)"); // error check
                    return "err";
                }

                if (input[i] === ")") { // update brackets
                    brackets--;
                } else if (input[i] === "(") {
                    brackets++;
                }
            }
            numbers.push(current);

            if (brackets !== 0) { // error check
                openModal(`Input error: wrong number of opening + closing brackets (2) - ${input}, ${numbers}, ${current}`);
                return "err";
            }

            if (signs === null) { // essentially if there is only one number
                if (input.includes("(")) {
                    return input.slice(1, input.length - 1);
                } else {
                    return input;
                }
            }

            for (let i = 0; i < numbers.length; i++) {
                if (numbers[i].includes("(")) {
                    // console.log(numbers[i]);
                    numbers[i] = solveCalc(numbers[i].slice(1, numbers[i].length - 1)); // recursion
                    // console.log(numbers[i]);
                }
            }

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

                    numbers.splice(signIndex, 2, String(completedOperation)); // edit arrays
                    signs.splice(signIndex, 1);
                }

                // handle multiplication and division
                signIndex = 0;
                while (signs.includes("*") || signs.includes("/")) {
                    signIndex1 = signs.indexOf("*") === -1 ? Infinity : signs.indexOf("*");
                    signIndex2 = signs.indexOf("/") === -1 ? Infinity : signs.indexOf("/");
                    signIndex = Math.min(signIndex1, signIndex2); // do whatever ones first

                    completedOperation = signIndex === signIndex1
                        ? parseFloat(numbers[signIndex]) * parseFloat(numbers[signIndex + 1])
                        : parseFloat(numbers[signIndex]) / parseFloat(numbers[signIndex + 1]);

                    numbers.splice(signIndex, 2, String(completedOperation));
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

                    numbers.splice(signIndex, 2, String(completedOperation));
                    signs.splice(signIndex, 1);
                }
                return numbers[0];

            } else {
                openModal("Input error: no operands");
                return "err";
            }
        } else {
            openModal("Input error: no valid input");
            return "err";
        }
    }
})();

// Line of best fit
(function () {
    const submit = document.getElementById("lineSubmit");
    const answer = document.getElementById("ans-2");
    const copy = document.getElementById("copyline");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution;
    const docInput = document.getElementById("input-2");
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
            return "err";
        }
        let input = String(docInput.value);
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
                    document.getElementById("mem-2").style.display = "inline-block";
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
    const answer = document.getElementById("ans-3");
    const copy = document.getElementById("copyMean");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution;
    const docInput = document.getElementById("input-3");
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
                document.getElementById("mem-3").style.display = "inline-block";
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
    const answer = document.getElementById("ans-4");
    const copy = document.getElementById("copyMedian");
    copy.style.display = "none";
    answer.textContent = "";
    answer.style.display = "none";
    let solution;
    const docInput = document.getElementById("input-4");
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
                document.getElementById("mem-4").style.display = "inline-block";
            } else {
                openModal("Please provide a valid input (at least two numbers)");
            }
        } else {
            openModal("Please provide an input!");
        }
    }
})();

// Differentiation
const docInput = document.getElementById("input-5");
const diffAnswer = document.getElementById("ans-5");
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
        // openConfirm("This feature is experimental!", "Ok", "Cancel", "diff");
        solveDiff();
    });
    docInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            // openConfirm("This feature is experimental!", "Ok", "Cancel", "diff");
            solveDiff();
        }
    });
})();
function solveDiff() {
    diffSolution = "";
    // openModal("This is not currently working!");
    let input = String(docInput.value);
    if (input) {
        if (input.includes("x")) {
            input = input.replaceAll("--", "+");
            if (input[0] === "+") {
                input = input.substring(1);
            }
            input = input.replaceAll(/(?<!\d)x/g, "1x");

            simplify(input);
            let allValues = input.match(/-?\d*\.?\d*x\^-?\d*\.?\d*|-?\d*\.?\d+x|-?\d*\.?\d*\^-?\d+\.?\d*|-?\d+\.?\d*/g);
            // +-number x ^ +-number | +-number x | +-number ^ +-number | +-number

            let signs = input.match(/\+/g);
            if (allValues !== null) {
                if (signs == null) {
                    diffSolution = diff(allValues[0]);
                    diffSolution = cleanInput(diffSolution);
                    diffAnswer.style.display = "inline-block";
                    diffSolution = "f'(x) = " + diffSolution;
                    diffAnswer.textContent = diffSolution;
                    diffCopy.style.display = "inline-block";
                    document.getElementById("mem-5").style.display = "inline-block";
                } else {
                    let outputTerms = [];
                    for (let i = 0; i < allValues.length; i++) {
                        outputTerms.push(diff(allValues[i]));
                    }
                    diffSolution = outputTerms[0];
                    for (let i = 1; i < outputTerms.length; i++) {
                        diffSolution += "+";
                        diffSolution += outputTerms[i];
                    }
                    diffSolution = cleanInput(diffSolution);
                    diffSolution = "f'(x) = " + diffSolution;
                    diffAnswer.style.display = "inline-block";
                    diffAnswer.textContent = diffSolution;
                    diffCopy.style.display = "inline-block";
                    document.getElementById("mem-5").style.display = "inline-block";
                }
            } else {
                openModal("Please provide a valid input!");
            }            
        } else {
            diffSolution = "f'(x) = 0";
            diffAnswer.style.display = "inline-block";
            diffAnswer.textContent = diffSolution;
            diffCopy.style.display = "inline-block";
        }
    } else {
        openModal("Please provide an input!");
    }
}
function diff(term) {
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
        input = input.replace(/\-\-/g, "+");
        input = input.replace(/(?<=\d)x\^0/g, "");
        input = input.replace(/x\^0/g, "1");
        input = input.replace(/x\^1/g, "x");
        input = input.replace(/\+\-/g, "-");
        input = input.replace(/(?:\+0)$/, "");
    }
    return input;
}
function simplify(input) {
    // sort out multiplication and division
    let signs = input.match(/[+\/\*]/g);
    let terms = input.match(/-?\d*\.?\d*x\^-?\d*\.?\d*|-?\d*\.?\d+x|-?\d*\.?\d*\^-?\d+\.?\d*|-?\d+\.?\d*/g);

    for (let i = 0; i < terms.length; i++) {
        if (terms[i].includes("^") && !terms[i].includes("x")) {
            let num1 = parseFloat(terms[i].match(/-?\d+\.?\d*/g)[0]);
            let num2 = parseFloat(terms[i].match(/-?\d+\.?\d*/g)[1]);
            terms[i] = String(num1 ** num2);
        }
    }

    if (!signs) {
        return terms.join("");
    }
    let i = 0;
    while (i < signs.length) {
        if (signs[i] === "*" || signs[i] === "/") {
            let num1 = parseFloat(terms[i].match(/(?<!x\^)-?\d+.?\d*/)[0]);
            let num2 = parseFloat(terms[i + 1].match(/(?<!x\^)-?\d+.?\d*/)[0]);
            let exp1 = terms[i].match(/(?<=\^)-?\d+\.?\d*/);
            let exp2 = terms[i + 1].match(/(?<=\^)-?\d+\.?\d*/);
            exp1 = exp1 ? parseFloat(exp1[0]) : (terms[i].includes('x') ? 1 : 0);
            exp2 = exp2 ? parseFloat(exp2[0]) : (terms[i + 1].includes('x') ? 1 : 0);
            let num3 = signs[i] === "*" ? num1 * num2 : num1 / num2;
            let exp3 = signs[i] === "*" ? exp1 + exp2 : exp1 - exp2;

            if (num3 === 0) {
                terms.splice(i, 2);
            } else if (exp3 === 0) {
                terms.splice(i, 2, String(num3));
            } else  {
                terms.splice(i, 2, String(num3) + "x^" + String(exp3));
            }
            signs.splice(i, 1);
        } else {
            i++;
        }
    }

    let hash = {};
    let hash2 = [];
    for (let i = 0; i < terms.length; i++) {
        let pro = terms[i].match(/x\^-?\d+.?\d*/);
        pro = pro ? pro[0] : (terms[i].includes("x") ? "x^1" : "x^0");
        let co = parseFloat(terms[i].match(/(?!x\^)-?\d+\.?\d*/)[0]);
        if (Object.hasOwn(hash, pro)) {
            hash[pro].push(co);
        } else {
            hash[pro] = [co];
            hash2.push(pro);
        }
    }

    let sums = [];
    for (let i = 0; i < hash2.length; i++) {
        let runningSum = 0;
        for (let j = 0; j < hash[hash2[i]].length; j++) {
            runningSum += hash[hash2[i]][j];
        }
        sums.push(String(runningSum) + hash2[i]);
    }
    let final = sums[0];
    for (let i = 1; i < sums.length; i++) {
        final += "+";
        final += sums[i];
    }
    return final;
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
let allContent = "";
let confirmResult = "";
let trigger = "";
function openConfirm(content, yes, no, triggerIfTrue) {
    if (!yes && !no) {
        console.log("error - not enough parameters. try openModal(text).")
        return "err";
    }
    let test = 1;
    allContent = content + yes + no + triggerIfTrue;
    let cookies = document.cookie;
    cookies = cookies.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookiePair = cookies[i].split("=");
        if (cookiePair[0].trim() === allContent) {
            test = 0;
        }
    }
    if (test === 1) {
        trigger = triggerIfTrue;
        confirmText.textContent = content;
        if (yes) {
            confirmYes.textContent = yes;
        } else {
            confirmYes.style.display = "none";
        }
        if (no) {
            confirmNo.textContent = no;
        } else {
            confirmNo.style.display = "none";
        }
        confirmObj.style.display = "block";
    } else {
        if (triggerIfTrue === "diff") {
            solveDiff();
        } else {
            console.log("trigger not found");
        }
    }
}
confirmYes.addEventListener("click", () => {
    if (confirmCheckbox.checked === true) {
        setCookie(allContent, "true", "365");
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
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = ";expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
    // console.log(name + "=" + value + expires + "; path=/");
}