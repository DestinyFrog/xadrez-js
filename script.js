
class Piece {
    static sprites = {}

    constructor(value) {
        this.numeric_value = value
        this.targetable = false
        this.moves = 0
    }

    static load_sprites() {
        for(let img of document.getElementById('pieces').children) {
            const id = img.getAttribute('id')
            Piece.sprites[id] = img
        }
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

    is_black() {
        return this.numeric_value < 0
    }

    is_empty() {
        return this.numeric_value == 0
    }

    is_same(piece) {
        return (this.numeric_value > 0 && piece.numeric_value > 0) ||
            (this.numeric_value < 0 && piece.numeric_value < 0)
    }

    mark_as_target() {
        this.targetable = true
    }

    reset_target() {
        this.targetable = false
    }
}

const piece = {
    numeric_value: 0,
    targetable: false,

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
    },

    get sprite() {
        return Piece.sprites[this.name]
    }
}

const board = {
    rows: 8,
    cols: 8,
    unit: 32,

    selected_pos: null,

    matrix: [],

    get width() {
        return this.unit * this.cols
    },

    get height() {
        return this.unit * this.rows
    },

    get selected() {
        if (!this.selected_pos)
            return null

        return this.matrix[this.selected_pos.x][this.selected_pos.y]
    },

    handle_matrix(matrix) {
        this.matrix = matrix.map(rows =>
            rows.map(cols => new Piece(cols)))
    },

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
    },

    click(pos) {
        if (this.selected) {
            if (this.matrix[pos.x][pos.y].targetable) {
                this.selected.moves++
                this.matrix[pos.x][pos.y].numeric_value = this.selected.numeric_value
                this.matrix[this.selected_pos.x][this.selected_pos.y].numeric_value = 0
            }
            
            this.selected_pos = null
            this.reset_odds()
        }
        else {
            this.selected_pos = pos
            this.calc();
        }
    },

    in_bounds(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows
    },

    reset_odds() {
        for (let x = 0; x < this.rows; x++)
            for (let y = 0; y < this.cols; y++)
                this.matrix[x][y].reset_target()
    },

    calc() {
        this.reset_odds()

        if (!this.selected)
            return

        switch (Math.abs(this.selected.numeric_value)) {
            case 1: this.tower(); break
            case 2: this.priest(); break
            case 3: this.horse(); break
            case 4: this.queen(); break
            case 5: this.king(); break
            case 6: this.pawn(); break
        }
    },

    tower() {
        const directions = [
            { x:  1, y :  0 },
            { x: -1, y :  0 },
            { x:  0, y :  1 },
            { x:  0, y : -1 },
        ]

        for (const dir of directions) {
            let sx = this.selected_pos.x + dir.x
            let sy = this.selected_pos.y + dir.y

            while (this.in_bounds(sx, sy)) {
                let target = this.matrix[sx][sy]

                if (!target.is_empty(target)) {
                    if (!target.is_same(this.selected))
                        target.mark_as_target()
                
                    break
                }

                target.mark_as_target()
                sx += dir.x
                sy += dir.y
            }
        }
    },

    priest() {
        const directions = [
            { x:  1, y :  1 },
            { x: -1, y : -1 },
            { x: -1, y :  1 },
            { x:  1, y : -1 },
        ]

        for (const dir of directions) {
            let sx = this.selected_pos.x + dir.x
            let sy = this.selected_pos.y + dir.y

            while (this.in_bounds(sx, sy)) {
                let target = this.matrix[sx][sy]

                if (!target.is_empty(target)) {
                    if (!target.is_same(this.selected))
                        target.mark_as_target()
                
                    break
                }

                target.mark_as_target()
                sx += dir.x
                sy += dir.y
            }
        }
    },

    horse() {
        const directions = [
            { x:  2, y :  1 },
            { x: -2, y :  1 },
            { x: -2, y : -1 },
            { x:  2, y : -1 },
            { x:  1, y :  2 },
            { x: -1, y :  2 },
            { x: -1, y : -2 },
            { x:  1, y : -2 },
        ]

        for (const dir of directions) {
            let sx = this.selected_pos.x + dir.x
            let sy = this.selected_pos.y + dir.y
            
            if (this.in_bounds(sx, sy)) {
                let target = this.matrix[sx][sy]
            
                if (!target.is_same(this.selected) || target.is_empty())
                    target.mark_as_target()
            }
        }
    },

    queen() {
        this.tower()
        this.priest()
    },

    king() {
        const directions = [
            { x:  1, y :  1 },
            { x: -1, y : -1 },
            { x: -1, y :  1 },
            { x:  1, y : -1 },
            { x:  1, y :  0 },
            { x: -1, y :  0 },
            { x:  0, y :  1 },
            { x:  0, y : -1 },
        ]

        for (const dir of directions) {
            let sx = this.selected_pos.x + dir.x
            let sy = this.selected_pos.y + dir.y

            if (this.in_bounds(sx, sy)) {
                let target = this.matrix[sx][sy]

                if (target.is_empty(target) || !target.is_same(this.selected, target))
                    target.mark_as_target()
            }
        }
    },

    pawn() {
        const piece = this.selected

        const dir = piece.is_black() ? -1 : 1

        let sx = this.selected_pos.x
        let sy = this.selected_pos.y

        sy += dir
        if (this.in_bounds(sx, sy)) {
            let target = this.matrix[sx][sy]
            
            if (target.is_empty())
                this.matrix[sx][sy].mark_as_target()
            else {
                sx = this.selected_pos.x + 1
                if (this.in_bounds(sx, sy) && !target.is_same(piece) && target.is_empty())
                    this.matrix[sx][sy].mark_as_target()

                sx = this.selected_pos.x - 1
                if (this.in_bounds(sx, sy) && !target.is_same(piece) && target.is_empty())
                    this.matrix[sx][sy].mark_as_target()

                return
            }
        }
        else return

        sy += dir
        if (this.in_bounds(sx, sy) && piece.moves == 0) {
            let target = this.matrix[sx][sy]

            if (target.is_empty())
                this.matrix[sx][sy].mark_as_target()
        }
    }
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function init() {
    canvas.width = board.width
    canvas.height = board.height

    canvas.addEventListener('click', onclick)

    Piece.load_sprites()

    board.handle_matrix([
        [ 1, 6, 0, 0, 0, 0,-6,-1 ], 
        [ 2, 6, 0, 0, 0, 0,-6,-2 ], 
        [ 3, 6, 0, 0, 0, 0,-6,-3 ], 
        [ 5, 6, 0, 0, 0, 0,-6,-4 ], 
        [ 4, 6, 0, 0, 0, 0,-6,-5 ], 
        [ 3, 6, 0, 0, 0, 0,-6,-3 ], 
        [ 2, 6, 0, 0, 0, 0,-6,-2 ], 
        [ 1, 6, 0, 0, 0, 0,-6,-1 ], 
    ])
}

function onclick(ev) {
    const x = ev.offsetX
    const y = ev.offsetY

    const grid = {
        x: Math.ceil(x / board.width * board.rows) - 1,
        y: Math.ceil(y / board.height * board.cols) - 1
    }

    board.click(grid)
}

function loop() {
    board.draw(ctx)
    setTimeout(() => requestAnimationFrame(loop), 10)
}

init()
loop()