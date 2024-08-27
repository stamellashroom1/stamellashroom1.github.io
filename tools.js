// General Calculator
(function () {
    const submit = document.getElementById("generalCalculatorSubmit");
    const answer = document.getElementById("calcAnswer");
    answer.textContent = "";
    submit.addEventListener("click", () => {
        let input = String(document.getElementById("generalCalculatorInput").value);
        if (input) {
            /*
            let pattern = "(\d+\.?\d*)[-\+\*\/^]"
            for (let i = 0; i < signs.length - 1; i++) {
                pattern = pattern + "(\d+\.?\d*)[-\+\*\/^]";
            }
            pattern = pattern + "(\d+\.?\d*)";
            let regex = new RegExp(pattern, "g");
            console.log(regex);
            */
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
            /*
            for (let i = 0; i <= 2; i++) {
                signIndex = 0;
                while (signIndex > -1) {
                    signIndex = -1;
                    if (i === 0 && signs.includes("^")) {
                        // start ternary operators. signIndex = signs.indexOf("*", signIndex) === -1 ? Infinity : signs.indexOf("*", signIndex);
                        signIndex = signs.indexOf("^", signIndex);
                        if (signIndex !== -1) {
                            completedOperation = parseFloat(numbers[signIndex]) ** parseFloat(numbers[signIndex + 1]);
                        } else {
                            break;
                        }                        
                    } else if (i === 1 && (signs.includes("*") || signs.includes("/"))) {
                        signIndex1 = signs.indexOf("*", signIndex) === -1 ? Infinity : signs.indexOf("*", signIndex);
                        signIndex2 = signs.indexOf("/", signIndex) === -1 ? Infinity : signs.indexOf("/", signIndex);
                        signIndex = Math.min(signIndex1, signIndex2);
                        if (signIndex !== Infinity) {
                            completedOperation = signs[signIndex] === "*" ? parseFloat(numbers[signIndex]) * parseFloat(numbers[signIndex + 1]) : parseFloat(numbers[signIndex]) / parseFloat(numbers[signIndex + 1]);
                        } else {
                            signIndex = -1;
                            break;
                        }
                    } else if (i === 2 && (signs.includes("+") || signs.includes("-"))) {
                        signIndex1 = signs.indexOf("+", signIndex) === -1 ? Infinity : signs.indexOf("+", signIndex);
                        signIndex2 = signs.indexOf("-", signIndex) === -1 ? Infinity : signs.indexOf("-", signIndex);
                        signIndex = Math.min(signIndex1, signIndex2);
                        if (signIndex !== Infinity) {
                            completedOperation = signs[signIndex] === "+" ? parseFloat(numbers[signIndex]) + parseFloat(numbers[signIndex + 1]) : parseFloat(numbers[signIndex]) - parseFloat(numbers[signIndex + 1]);
                        } else {
                            signIndex = -1;
                            break;
                        }
                    }
                    if (signIndex !== -1) {
                        if (Array.isArray(numbers)) {
                            numbers.splice(signIndex, 1, String(completedOperation));
                            numbers.splice(signIndex + 1, 1);
                            signs.splice(signIndex);
                            console.log(`numbers: ${numbers}`);
                            console.log(`signs: ${signs}`);
                            i = 0;
                            if (numbers.length == 1) {
                                break;
                            }
                        } else {
                            console.log(`numbers is not an array: ${numbers}`);
                        }
                    }
                }
                if (numbers.length == 1) {
                    i = 3;
                    break;
                }
                console.log(numbers);
            }
            if (numbers.length == 1) {
                console.log(`numbers final: ${numbers}`);
            } else {
                console.log(`The operation was not completed sucessfully: numbers: ${numbers}`);
            }
            */
            
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