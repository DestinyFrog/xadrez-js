
class Piece {
    static sprites = {}

    constructor(value) {
        this.numeric_value = value
        this.targetable = false
    }

    static load_sprites() {
        for(let img of document.getElementById('pieces').children) {
            const id = img.getAttribute('id')
            Piece.sprites[id] = img
        }
    }

    is_black() {
        return this.numeric_value < 0
    }

    is_white() {
        return this.numeric_value > 0
    }

    is_empty() {
        return this.numeric_value == 0
    }

    is_same(piece) {
        return (piece.numeric_value > 0 && this.numeric_value > 0)
            || (piece.numeric_value < 0 && this.numeric_value < 0)
    }

    get name() {
        switch (this.numeric_value) {
            case -6: return 'black_pawn'
            case -5: return 'black_king'
            case -4: return 'black_queen'
            case -3: return 'black_horse'
            case -2: return 'black_priest'
            case -1: return 'black_tower'
            default: return null
            case  1: return 'white_tower'
            case  2: return 'white_priest'
            case  3: return 'white_horse'
            case  4: return 'white_queen'
            case  5: return 'white_king'
            case  6: return 'white_pawn'
        }
    }

    get sprite() {
        return Piece.sprites[this.name]
    }
}

class Tower extends Piece {
    directions = [
        { x:  1, y :  0 },
        { x: -1, y :  0 },
        { x:  0, y :  1 },
        { x:  0, y : -1 },
    ]

    move(board, x, y) {
        for (const dir of this.directions) {
            let sx = x + dir.x
            let sy = y + dir.y

            while (board.in_bounds(sx, sy)) {
                let target = board[sx][sy]

                if (!target.is_empty()) {
                    if (!this.is_same(target))
                        this.targetable = true
                
                    break
                }

                this.targetable = true
                sx += dir.x
                sy += dir.y
            }
        }
    }
}

class Priest extends Piece {
    directions = [
        { x: 1, y : 1 },
        { x: -1, y : -1 },
        { x: -1, y : 1 },
        { x: 1, y : -1 },
    ]

    move(board, x, y) {
        for (const dir of directions) {
            let sx = x + dir.x
            let sy = y + dir.y

            while (in_bounds(sx, sy)) {
                let target = board[sx][sy]

                if (!is_empty(target)) {
                    if (!is_same(board[x][y], target))
                        board_odd[sx][sy] = true
                
                    break
                }

                board_odd[sx][sy] = true
                sx += dir.x
                sy += dir.y
            }
        }
    }
}

class Board {
    rows = 8
    cols = 8
    unit = 32

    constructor(matrix) {
        this.matrix = this.handle_matrix(matrix)
        this.selected = null
    }

    get width() {
        return this.unit * this.cols
    }

    get height() {
        return this.unit * this.rows
    }

    in_bounds(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows
    }

    handle_matrix(matrix) {
        const new_matrix = []

        for (let x = 0; x < this.rows; x++) {
            new_matrix.push([])
            for (let y = 0; y < this.rows; y++) {
                let piece = new Piece(matrix[x][y])
                new_matrix[x].push(piece)
            }
        }

        return new_matrix
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height)
        let is_black =  true

        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++)  {
                const piece = this.matrix[x][y]

                ctx.fillStyle = is_black
                    ? "rgb(137, 80, 49)"
                    : "rgb(248, 222, 157)"

                if (this.selected && this.selected.x == x && this.selected.y == y)
                    ctx.fillStyle = 'red'

                if (piece.targetable)
                    ctx.fillStyle = 'green'

                ctx.fillRect(x * this.unit, y * this.unit, this.unit, this.unit)

                if (piece.sprite)
                    ctx.drawImage(piece.sprite, x * this.unit, y * this.unit)

                is_black = !is_black
            }
            is_black = !is_black
        }
    }

    reset_targets() {
        for (let x = 0; x < this.cols; x++)
        for (let y = 0; y < this.rows; y++)
            this.board[x][y].targetable = false
    }

    static create_matrix() {
        const initial_matrix = [
            [ 1, 6, 0, 0, 0, 0,-6,-1 ], 
            [ 2, 6, 0, 0, 0, 0,-6,-2 ], 
            [ 3, 6, 0, 0, 0, 0,-6,-3 ], 
            [ 5, 6, 0, 0, 0, 0,-6,-4 ], 
            [ 4, 6, 0, 0, 0, 0,-6,-5 ], 
            [ 3, 6, 0, 0, 0, 0,-6,-3 ], 
            [ 2, 6, 0, 0, 0, 0,-6,-2 ], 
            [ 1, 6, 0, 0, 0, 0,-6,-1 ], 
        ]

        return new Board(initial_matrix)
    }
}

function onclick(ev) {
    const x = ev.offsetX
    const y = ev.offsetY

    const grid = {
        x: Math.ceil(x / width * rows) - 1,
        y: Math.ceil(y / height * cols) - 1
    }

    // reset_odds()
    // selected = grid
    // calculate_odds(grid.x, grid.y)
}

// function reset_odds() {
//     for (let x = 0; x < cols; x++)
//         for (let y = 0; y < rows; y++)
//             board_odd[x][y] = false
// }

// function calculate_odds(x, y) {
//     switch (Math.abs(board[x][y])) {
//         case 1: calc_tower(x, y); break
//         case 2: calc_priest(x, y); break
//         case 3: calc_horse(x, y); break
//         case 4: calc_queen(x, y); break
//         case 5: calc_king(x, y); break
//         case 6: calc_pawn(x, y); break
//     }
// }

// function calc_priest(x, y) {
//     const piece = board[x][y]

//     const directions = [
//         { x: 1, y : 1 },
//         { x: -1, y : -1 },
//         { x: -1, y : 1 },
//         { x: 1, y : -1 },
//     ]

//     for (const dir of directions) {
//         let sx = x + dir.x
//         let sy = y + dir.y

//         while (in_bounds(sx, sy)) {
//             let target = board[sx][sy]

//             if (!is_empty(target)) {
//                 if (!is_same(piece, target))
//                     board_odd[sx][sy] = true
            
//                 break
//             }

//             board_odd[sx][sy] = true
//             sx += dir.x
//             sy += dir.y
//         }
//     }
// }

// function calc_horse(x, y) {
//     const directions = [
//         { x:  2, y :  1 },
//         { x: -2, y :  1 },
//         { x: -2, y : -1 },
//         { x:  2, y : -1 },
//         { x:  1, y :  2 },
//         { x: -1, y :  2 },
//         { x: -1, y : -2 },
//         { x:  1, y : -2 },
//     ]

//     for (const dir of directions) {
//         let sx = x + dir.x
//         let sy = y + dir.y
        
//         if (in_bounds(sx, sy)) {
//             let target = board[sx][sy]
         
//             if (is_same(target) || is_empty(target))
//                 board_odd[sx][sy] = true
//         }
//     }
// }

// function calc_queen(x, y) {
//     calc_priest(x, y)
//     calc_tower(x, y)
// }

// function calc_king(x, y) {
//     const piece = board[x][y]

//     const directions = [
//         { x:  1, y :  1 },
//         { x: -1, y : -1 },
//         { x: -1, y :  1 },
//         { x:  1, y : -1 },
//         { x:  1, y :  0 },
//         { x: -1, y :  0 },
//         { x:  0, y :  1 },
//         { x:  0, y : -1 },
//     ]

//     for (const dir of directions) {
//         let sx = x + dir.x
//         let sy = y + dir.y

//         if (in_bounds(sx, sy)) {
//             let target = board[sx][sy]

//             if (is_empty(target) || !is_same(piece, target))
//                 board_odd[sx][sy] = true
//         }
//     }
// }

// function calc_pawn(x, y) {
//     const piece = board[x][y]

//     const dir = is_black(piece) ? -1 : 1

//     let sx = x
//     let sy = y

//     sy += dir
//     if (in_bounds(sx, sy)) {
//         if (is_empty(board[sx][sy]))
//             board_odd[sx][sy] = true
//         else {
//             sx = x + 1
//             if (in_bounds(sx, sy) && !is_same(board[sx][sy]) && !is_empty(board[sx][sy]))
//                 board_odd[sx][sy] = true

//             sx = x - 1
//             if (in_bounds(sx, sy) && !is_same(board[sx][sy]) && !is_empty(board[sx][sy]))
//                 board_odd[sx][sy] = true

//             return
//         }
//     }
//     else return

//     sy += dir
//     if (in_bounds(sx, sy) && is_empty(sx, sy))
//         board_odd[sx][sy] = true
// }

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

Piece.load_sprites()
const board = Board.create_matrix()

canvas.width = board.width
canvas.height = board.height

function loop() {
    board.draw(ctx)
    setTimeout(() => requestAnimationFrame(loop), 10)
}
requestAnimationFrame(loop)