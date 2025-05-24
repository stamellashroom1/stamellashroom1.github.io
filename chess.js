let colour = "w"
const castlingRights = {
    "w": {"k": true, "q": true},
    "b": {"k": true, "q": true}
}

const board = document.getElementById("board");

function setSquare(x, y, type) {
    if (type) {
        board.rows[y].cells[x].style.backgroundImage = `url("./chess_pieces/${type}.png")`;
        // console.log(`x: ${x}, y: ${y}, type: ${type}`)
    } else {
        board.rows[y].cells[x].style.backgroundImage = "none";
    }
}

const whiteStartPos = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
]
const blackStartPos = [
    ["wr", "wn", "wb", "wk", "wq", "wb", "wn", "wr"],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["br", "bn", "bb", "bk", "bq", "bb", "bn", "br"]
]

function readPosition(position) {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            setSquare(x, y, position[y][x]);
        }
    }
}

let test = {
    "w": whiteStartPos,
    "b": blackStartPos
}
readPosition(test[colour])

const cells = document.querySelectorAll("#board td");

let cellHighlighted = false;
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (cell.style.backgroundImage[20] == colour[0]) {
            let highlight = cell.classList.contains("highlight");
            cells.forEach(cell => {
                cell.classList.remove("highlight");
            })
            if (!highlight) {
                cell.classList.add("highlight");
            }
        } else {
            cell.classList.add("move");
            cells.forEach(cell => {
                if (cell.classList.contains("highlight")) {
                    attemptMove()
                    cell.classList.remove("highlight");
                }
            })
            cell.classList.remove("move");
        }
    });
});

const moves = [];

function attemptMove() {
    let piece = "";
    let from = [];
    let to = [];
    let takes = false;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const cell = board.rows[y].cells[x];
            if (cell.classList.contains("highlight")) {
                from = [x, y];
                piece = cell.style.backgroundImage[21];
            } else if (cell.classList.contains("move")) {
                to = [x, y];
                if (cell.style.backgroundImage !== "none") {
                    takes = cell.style.backgroundImage[21];
                } else {
                    takes = "none";
                }
            }
        }
    }

    let moveValid = false;

    // pawn
    if (piece === "p") {
        const move = moves[moves.length - 1];
        if (colour === "w") {
            if (from[1] <= to[1]) { // moving to the side or backwards
                return
            } else if ( // moving 2x forwards on 1st move
                from[1] === 6 &&
                to[1] === 4 &&
                takes === "none" &&
                board.rows[5].cells[from[0]].style.backgroundImage === "none" &&
                from[0] === to[0]
            ) {
                moveValid = !checkTest()
            } else if ( // en passant
                from[1] === 3 &&
                to[1] === 2 &&
                Math.abs(from[0] - to[0]) === 1 &&
                move.piece === "p" &&
                move.to[1] - move.from[1] === 2 &&
                move.from[0] === to[0]
            ) {
                moveValid = !checkTest()
                if (moveValid) {
                    takes = "p";
                    board.rows[move.to[1]].cells[move.to[0]].style.backgroundImage = "none";
                }
            } else if ( // normal takes
                takes !== "none" &&
                to[1] + 1 === from[1] &&
                Math.abs(to[0] - from[0]) === 1
            ) {
                moveValid = !checkTest()
            } else if ( // normal move
                to[0] === from[0] &&
                to[1] + 1 === from[1] &&
                takes === "none"
            ) {
                moveValid = !checkTest()
            }
        } else {
            if (to[1] <= from[1]) { // moving sideways or backwards
                console.log("test")
                return
            } else if ( // 2x move
                from[1] === 1 &&
                to[1] === 3 &&
                takes === "none" &&
                board.rows[2].cells[from[0]].style.backgroundImage === "none" &&
                from[0] === to[0]
            ) {
                moveValid = !checkTest()
            } else if ( // en passant
                from[1] === 4 &&
                to[1] === 5 &&
                Math.abs(from[0] - to[0]) === 1 &&
                move.piece === "p" &&
                move.from[1] - move.to[1] === 2 &&
                move.from[0] === to[0] &&
                takes === "none"
            ) {
                moveValid = !checkTest()
                if (moveValid) {
                    takes = "p";
                    board.rows[move[to[1]]].cells[move[to[0]]].style.backgroundImage = "none";
                }
            } else if ( // normal takes
                takes !== "none" &&
                from[1] + 1 === to[1] &&
                Math.abs(to[0] - from[0]) === 1
            ) {
                moveValid = !checkTest()
            } else if ( // normal move
                to[0] === from[0] &&
                from[1] + 1 === to[1] &&
                takes === "none"
            ) {
                moveValid = !checkTest()
            }
        }

    } else if (piece === "n") {
        if (
            (Math.abs(to[1] - from[1]) === 2 &&
            Math.abs(to[0] - from[0]) === 1) ||
            (Math.abs(to[1] - from[1]) === 1 &&
            Math.abs(to[0] - from[0]) === 2)
        ) {
            moveValid = !checkTest()
        }

    } else if (piece === "r") {
        if (from[1] === to[1]) {
            if (from[0] < to[0]) {
                for (let i = from[0] + 1; i < to[0]; i++) {
                    if (board.rows[from[1]].cells[i].style.backgroundImage !== "none") {
                        return
                    }
                }
            } else {
                for (let i = to[0] + 1; i < from[0]; i++) {
                    if (board.rows[from[1]].cells[i].style.backgroundImage !== "none") {
                        return
                    }
                }
            }
        } else if (from[0] === to[0]) {
            if (from[1] < to[1]) {
                for (let i = from[1] + 1; i < to[1]; i++) {
                    if (board.rows[i].cells[from[0]].style.backgroundImage !== "none") {
                        return
                    }
                }
            } else {
                for (let i = to[1] + 1; i < from[1]; i++) {
                    if (board.rows[i].cells[from[0]].style.backgroundImage !== "none") {
                        return
                    }
                }
            }
        }
        moveValid = !checkTest()
        if (moveValid) {
            if (from[0] === 0 && from[1] === 0) {
                castlingRights.b.q = false;
            } else if (from[7] === 0 && from[1] === 0) {
                castlingRights.b.k = false;
            } else if (from[0] === 0 && from[1] === 7) {
                castlingRights.w.q = false;
            } else if (from[0] === 7 && from[1] === 7) {
                castlingRights.w.k = false;
            }
        }

    } else if (piece === "b") {
        // check that its a diagonal
        if (Math.abs((to[0] - from[0]) / (to[1] - from[1])) === 1) {
            for (let i = 1; i < Math.abs(to[0] - from[0]); i++) {
                let y = to[1] - from[1] < 0 ? -1 : 1;
                let x = to[0] - from[0] < 0 ? -1 : 1;
                if (board.rows[from[1] + y * i].cells[from[0] + x * i].style.backgroundImage !== "none") {
                    return
                }
            }
            moveValid = !checkTest()
        }

    } else if (piece === "q") {
        if (from[1] === to[1]) {
            if (from[0] < to[0]) {
                for (let i = from[0] + 1; i < to[0]; i++) {
                    if (board.rows[from[1]].cells[i].style.backgroundImage !== "none") {
                        return
                    }
                }
            } else {
                for (let i = to[0] + 1; i < from[0]; i++) {
                    if (board.rows[from[1]].cells[i].style.backgroundImage !== "none") {
                        return
                    }
                }
            }
            moveValid = !checkTest()
        } else if (from[0] === to[0]) {
            if (from[1] < to[1]) {
                for (let i = from[1] + 1; i < to[1]; i++) {
                    if (board.rows[i].cells[from[0]].style.backgroundImage !== "none") {
                        return
                    }
                }
            } else {
                for (let i = to[1] + 1; i < from[1]; i++) {
                    if (board.rows[i].cells[from[0]].style.backgroundImage !== "none") {
                        return
                    }
                }
            }
            moveValid = !checkTest()
        } else if (Math.abs((to[0] - from[0]) / (to[1] - from[1])) === 1) {
            for (let i = 1; i < Math.abs(to[0] - from[0]); i++) {
                let y = to[1] - from[1] < 0 ? -1 : 1;
                let x = to[0] - from[0] < 0 ? -1 : 1;
                if (board.rows[from[1] + y * i].cells[from[0] + x * i].style.backgroundImage !== "none") {
                    return
                }
            }
            moveValid = !checkTest()
        }

    } else if (piece === "k") {
        if (!checkTest()) { // no castling in check
            if (colour === "w") {
                if (
                    to[0] === 2 &&
                    castlingRights.w.q &&
                    board.rows[7].cells[3].style.backgroundImage === "none" &&
                    board.rows[7].cells[2].style.backgroundImage === "none" &&
                    board.rows[7].cells[1].style.backgroundImage === "none" &&
                    !checkSquare(3, 7, "w") &&
                    !checkSquare(2, 7, "w") &&
                    !checkSquare(1, 7, "w")
                ) {
                    board.rows[7].cells[0].style.backgroundImage = "none";
                    setSquare(3, 7, "wr")
                    moveValid = true;
                } else if (
                    to[0] === 6 &&
                    castlingRights.w.k &&
                    board.rows[7].cells[5].style.backgroundImage === "none" &&
                    board.rows[7].cells[6].style.backgroundImage === "none" &&
                    !checkSquare(5, 7, "w") &&
                    !checkSquare(6, 7, "w")
                ) {
                    board.rows[7].cells[7].style.backgroundImage = "none";
                    setSquare(5, 7, "wr")
                    moveValid = true;
                }
            } else {
                if (
                    to[0] === 2 &&
                    castlingRights.b.q &&
                    board.rows[0].cells[3].style.backgroundImage === "none" &&
                    board.rows[0].cells[2].style.backgroundImage === "none" &&
                    board.rows[0].cells[1].style.backgroundImage === "none" &&
                    !checkSquare(3, 0, "b") &&
                    !checkSquare(2, 0, "b") &&
                    !checkSquare(1, 0, "b")
                ) {
                    board.rows[0].cells[0].style.backgroundImage = "none";
                    setSquare(3, 0, "br")
                    moveValid = true;
                } else if (
                    to[0] === 6 &&
                    castlingRights.b.k &&
                    board.rows[0].cells[5].style.backgroundImage === "none" &&
                    board.rows[0].cells[6].style.backgroundImage === "none" &&
                    !checkSquare(5, 0, "w") &&
                    !checkSquare(6, 0, "w")
                ) {
                    board.rows[0].cells[7].style.backgroundImage = "none";
                    setSquare(5, 0, "br")
                    moveValid = true;
                }
            }
        }
        if (
            Math.abs(to[0] - from[0]) < 2 &&
            Math.abs(to[1] - from[1]) < 2
        ) {
            moveValid = !checkTest()
            if (moveValid) {
                castlingRights[colour].q = false;
                castlingRights[colour].k = false;
            }
        }
    }

    if (!moveValid) {
        return
    }

    board.rows[from[1]].cells[from[0]].style.backgroundImage = "none";
    board.rows[to[1]].cells[to[0]].style.backgroundImage = `url("./chess_pieces/${colour}${piece}.png")`;
    moves.push({
        "from": from,
        "to": to,
        "piece": piece,
        "takes": takes
    });

    if (colour === "w") {
        colour = "b";
    } else {
        colour = "w";
    }
}

function checkTest() {
    // return true if in check
    return false
}

function checkSquare(x, y, colour) {
    return false
}