const actualBoard = document.getElementById("board");
const moveTable = document.getElementById("moveTable");

const key = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h"
};

const board = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false]
];

const newBoard = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false]
];
/**
 * current move
 */
let currentColour = "w";
const moves = [];
const boards = [];
const castlingRights = {
    b: {k: true, q: true},
    w: {k: true, q: true}
};

const startPos = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
];

/**
 * not dependent on colour: server side
 */
function loadPosition(position) {
    moves.length = 0;
    boards.length = 0;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            board[y][x] = position[y][x];
            newBoard[y][x] = position[y][x];
        }
    }
}

/**
 * dependent on colour: client side
 */
function updateBoard(colour) {
    let a = colour === "w" ? -1 : 1; // inversion for black
    let b = colour === "w" ? 0 : 7;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x]) {
                actualBoard.rows[a*(b-y)].cells[a*(b-x)].style.backgroundImage =
                `url("./chess_pieces/${board[y][x]}.png")`;
            } else {
                actualBoard.rows[a*(b-y)].cells[a*(b-x)].style.backgroundImage = "none";
            }
        }
    }
}

const cells = document.querySelectorAll("#board td");
let cellHighlighted = false;
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (cell.style.backgroundImage[20] === currentColour[0]) {
            let from = cell.classList.contains("from");
            cells.forEach(cell => {
                cell.classList.remove("from");
            })
            if (!from) {
                cell.classList.add("from");
            }
        } else {
            cell.classList.add("to");
            cells.forEach(cell => {
                if (cell.classList.contains("from")) {
                    attemptMove()
                    cell.classList.remove("from");
                }
            })
            cell.classList.remove("to");
        }
    })
})

loadPosition(startPos)
updateBoard(currentColour)

function attemptMove() {
    let fx, fy, tx, ty;
    let a = currentColour === "w" ? -1 : 1; // reinvert board from client to server
    let b = currentColour === "w" ? 0 : 7;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (actualBoard.rows[y].cells[x].classList.contains("to")) {
                tx = a*(b-x);
                ty = a*(b-y);

                // console.log("to", currentColour, tx, ty, x, y)
            } else if (actualBoard.rows[y].cells[x].classList.contains("from")) {
                fx = a*(b-x);
                fy = a*(b-y);

                // console.log("from", currentColour, fx, fy, x, y)
            }
        }
    }

    if (fx !== undefined && fy !== undefined && tx !== undefined && ty !== undefined) {
        validateMove(fx, fy, tx, ty)
    }
}

function validateMove(fx, fy, tx, ty) {
    // check that the piece is the right colour
    if (board[fy][fx][0] !== currentColour) {
        return false;
    }
    // and that they're not taking their own piece
    if (board[ty][tx][0] === currentColour) {
        return false;
    }

    // verify movement
    const pieceMoved = board[fy][fx][1];
        switch (pieceMoved) {
        case "p":
            if (!pawnMove(fx, fy, tx, ty, currentColour)) {
                return false;
            }
            break;
        case "n":
            if (!knightMove(fx, fy, tx, ty)) {
                return false;
            }
            break;
        case "b":
            if (!bishopMove(fx, fy, tx, ty)) {
                return false;
            }
            break;
        case "r":
            if (!rookMove(fx, fy, tx, ty)) {
                return false;
            }
            break;
        case "q":
            if (!queenMove(fx, fy, tx, ty)) {
                return false;
            }
            break;
        case "k":
            if (!kingMove(fx, fy, tx, ty, currentColour)) {
                return false;
            }
            break;
        default:
            return false;
    }

    // verify check
    newBoard[fy][fx] = false;
    newBoard[ty][tx] = `${currentColour}${pieceMoved}`;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (newBoard[y][x] === `${currentColour}k`) {
                if (inCheck(x, y, currentColour)) {
                    newBoard[fy][fx] = `${currentColour}${pieceMoved}`;
                    newBoard[ty][tx] = board[ty][tx];
                    return false;
                }
            }
        }
    }

    let check = false;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x][0] !== currentColour && board[y][x][1] === "k") {
                check = inCheck(x, y, currentColour === "w" ? "b" : "w")
            }
        }
    }

    let move = pieceMoved !== "p" ? pieceMoved.toUpperCase() : "";
    if (board[ty][tx]) {
        move += "x";
    }
    move += key[tx]
    move += 8 - ty;

    if (pieceMoved === "k" && Math.abs(tx - fx) === 2) {
        if (tx - fx < 0) {
            move = "O-O-O";
        } else {
            move = "O-O"
        }
    }

    if (check) {
        move += "+";
    }

    // check for en passant and remove other pawn if applicable
    if (
        pieceMoved === "p" &&
        Math.abs(tx - fx) === 1 &&
        board[ty][tx] === false
    ) {
        if (currentColour === "w") {
            board[3][tx] = false;
        } else {
            board[4][tx] = false;
        }
    }

    moves.push(move);
    board[fy][fx] = false;
    board[ty][tx] = `${currentColour}${pieceMoved}`;
    boards.push(JSON.parse(JSON.stringify(board)));

    if (currentColour === "w") {
        let row = moveTable.insertRow();
        let c1 = row.insertCell()
        c1.innerHTML = `${Math.ceil(moves.length / 2)}.`;
        let c2 = row.insertCell()
        c2.innerHTML = `${move}`;
        let c3 = row.insertCell()
        if (moves.length === 1) {
            c1.style.borderTop = 0;
            c2.style.borderTop = 0;
            c3.style.borderTop = 0;
            document.getElementById("moves").style.display = "block";
        }
    } else {
        let row = moveTable.rows[moveTable.rows.length - 1];
        row.cells[2].innerHTML = `${move}`;
    }

    currentColour = currentColour === "w" ? "b" : "w";

    // disable castling if applicable
    if (
        (fx === 0 && fy === 0) || (tx === 0 && ty === 0)
    ) {
        castlingRights.b.q = false;
    } else if (
        (fx === 7 && fy === 0) || (tx === 7 && ty === 0)
    ) {
        castlingRights.b.k = false;
    } else if (
        (fx === 0 && fy === 7) || (tx === 0 && ty === 7)
    ) {
        castlingRights.w.q = false;
    } else if (
        (fx === 7 && fy === 7) || (tx === 7 && ty === 7)
    ) {
        castlingRights.w.k = false;
    }

    updateBoard(currentColour)
    return true;
}

function pawnMove(fx, fy, tx, ty, colour) {

    const direction = colour === "w" ? -1 : 1;

    const opp = colour = "w" ? "b" : "w";

    if (
        Math.abs(tx - fx) === 1 &&
        fy + direction === ty
    ) {
        if (
            boards[boards.length - 2][ty + direction][tx] === `${opp}p` &&
            !boards[boards.length - 2][ty][tx] &&
            board[ty - direction][tx] === `${opp}p` &&
            !board[ty + direction][tx] &&
            board[ty][tx] === false
        ) {
            return true;
        }
    }

    // 2 squares
    if (
        ty === 3.5 - direction * 0.5 &&
        ty - fy === 2 * direction &&
        tx === fx &&
        !board[ty][tx] &&
        !board[fy + direction][fx]
    ) {
        return true;
    }

    // takes
    if (
        Math.abs(tx - fx) === 1 &&
        ty - fy === direction &&
        board[ty][tx]
    ) {
        return true;
    }

    // normal move
    if (
        tx === fx &&
        ty - fy === direction &&
        !board[ty][tx]
    ) {
        return true;
    }
    return false;
}

function knightMove(fx, fy, tx, ty) {
    if (
        Math.abs(ty - fy) === 2 &&
        Math.abs(tx - fx) === 1
    ) {
        return true;
    }

    if (
        Math.abs(ty - fy) === 1 &&
        Math.abs(tx - fx) === 2
    ) {
        return true;
    }
        return false;
}

function bishopMove(fx, fy, tx, ty) {
    // check that its a diagonal
    if (
        Math.abs((ty - fy) / (tx - fx)) === 1
    ) {
        const xDirect = tx - fx < 0 ? -1 : 1;
        const yDirect = ty - fy < 0 ? -1 : 1;

        for (let i = 1; i < Math.abs(ty - fy); i++) {
            if (board[fy + yDirect * i][fx + xDirect * i]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function rookMove(fx, fy, tx, ty) {
    // check for orthogonal movement
    if (fy === ty) {
        const direct = tx - fx < 0 ? -1 : 1;
        for (let i = 1; i < Math.abs(tx - fx); i++) {
            if (board[ty][fx + direct * i]) {
                return false;
            }
        }
        return true;
    }
    
    if (fx === tx) {
        const direct = ty - fy < 0 ? -1 : 1;
        for (let i = 1; i < Math.abs(ty - fy); i++) {
            if (board[fy + direct * i][fx]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function queenMove(fx, fy, tx, ty) {
    return bishopMove(fx, fy, tx, ty) || rookMove(fx, fy, tx, ty);
}

function kingMove(fx, fy, tx, ty, colour) {
    if (
        Math.abs(ty - fy) < 2 &&
        Math.abs(tx - fx) < 2
    ) {
        if (colour === "w") {
            castlingRights.w.k = false;
            castlingRights.w.q = false;
        } else {
            castlingRights.b.k = false;
            castlingRights.b.q = false;
        }
        return true;
    }

    // castling
    if (colour === "w") {
        if (
            castlingRights.w.k &&
            tx === 6 &&
            ty === 7 &&
            !inCheck(4, 7, currentColour) &&
            !inCheck(5, 7, currentColour) &&
            !inCheck(6, 7, currentColour)
        ) {
            board[7][7] = false;
            newBoard[7][7] = false;
            board[7][5] = "wr";
            newBoard[7][5] = "wr";
            return true;
        } else if (
            castlingRights.w.q &&
            tx === 2 &&
            ty === 7 &&
            !inCheck(4, 7, currentColour) &&
            !inCheck(3, 7, currentColour) &&
            !inCheck(2, 7, currentColour)
        ) {
            board[7][0] = false;
            newBoard[7][0] = false;
            board[7][3] = "wr";
            newBoard[7][3] = "wr";
            return true;
        }
    } else {
        if (
            castlingRights.b.k &&
            tx === 6 &&
            ty === 0 &&
            !inCheck(4, 0, currentColour) &&
            !inCheck(5, 0, currentColour) &&
            !inCheck(6, 0, currentColour)
        ) {
            board[0][7] = false;
            newBoard[0][7] = false;
            board[0][5] = "br";
            newBoard[0][5] = "br";
            return true;
        } else if (
            castlingRights.b.q &&
            tx === 2 &&
            ty === 0 &&
            !inCheck(4, 0, currentColour) &&
            !inCheck(3, 0, currentColour) &&
            !inCheck(2, 0, currentColour)
        ) {
            board[0][0] = false;
            newBoard[0][0] = false;
            board[0][3] = "br";
            newBoard[0][3] = "br";
            return true;
        }
    }

    return false;
}

function inCheck(x, y, colour) {
    let oppColour = colour === "w" ? "b" : "w";
    // pawns
    if (colour === "w") {
        if (
            square(x + 1, y - 1) === `${oppColour}p` ||
            square(x - 1, y - 1) === `${oppColour}p`
        ) {
            return true;
        }
    } else {
        if (
            square(x + 1, y + 1) === `${oppColour}p` ||
            square(x - 1, y + 1) === `${oppColour}p`
        ) {
            return true;
        }
    }

    // knights
    const knightSquares = [
        [-1, -2],
        [1, -2],
        [-1, 2],
        [1, 2],
        [-2, -1],
        [2, -1],
        [-2, 1],
        [2, 1]
    ];
    for (let i = 0; i < 8; i++) {
        if (square(x + knightSquares[i][0], y + knightSquares[i][1]) === `${oppColour}n`) {
            return true;
        }
    }

    // king
    const kingList = [-1, 0, 1];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (square(x + kingList[i], y + kingList[j]) === `${oppColour}k`) {
                return true;
            }
        }
    }

    // orthogonal + diagonal
    const directions = [
        [-1, 0, "r"],
        [0, -1, "r"],
        [1, 0, "r"],
        [0, 1, "r"],
        [-1, -1, "b"],
        [1, -1, "b"],
        [1, 1, "b"],
        [-1, 1, "b"]
    ];
    for (let l = 0; l < 8; l++) {
        for (let lx = x + directions[l][0], ly = y + directions[l][1];
            lx < 8 && lx > -1 && ly < 8 && ly > -1;
            lx += directions[l][0], ly += directions[l][1]
        ) {
            let loc = square(lx, ly);
            if (loc[0] === colour) {
                break;
            }
            if (loc[1] === directions[l][2] ||
                loc[1] === "q"
            ) {
                return true;
            }
        }
    }

    return false;
}

function square(x, y) {
    if (x < 0 || x > 7 || y < 0 || y > 7) {
        return false;
    }
    return newBoard[y][x];
}