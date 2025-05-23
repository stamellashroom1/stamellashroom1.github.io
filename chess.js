let colour = "w"

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
    }

    if (!moveValid) {
        return
    }

    // quick and dirty, no movement checks
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