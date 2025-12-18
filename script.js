const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const unit = 32
const rows = 8
const cols = 8
const width = unit * rows
const height = unit * cols

const sprites = {}
const board = [
    [ 1,  2,  3,  5,  4,  3,  2,  1 ],
    [ 6,  6,  6,  6,  6,  6,  6,  6 ],
    [ 0,  0,  0,  0,  0,  0,  0,  0 ],
    [ 0,  0,  0,  0,  0,  0,  0,  0 ],
    [ 0,  0,  0,  0,  0,  0,  0,  0 ],
    [ 0,  0,  0,  0,  0,  0,  0,  0 ],
    [-6, -6, -6, -6, -6, -6, -6, -6 ],
    [-1, -2, -3, -4, -5, -3, -2, -1 ],
]

const board_odd = []

let selected = null
let target = null

function number_to_piece(num) {
    switch (num) {
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

function init() {
    canvas.width = width
    canvas.height = height

    const div_sprites = document.getElementById('sprites')
    for(img of div_sprites.children) {
        const id = img.getAttribute('id')
        sprites[id] = img
    }

    for (let x = 0; x < rows; x++) {
        board_odd.push([])
        for (let y = 0; y < cols; y++)
            board_odd[x].push(false)
    }

    console.log(board_odd)

    canvas.addEventListener('click', onclick)
}

function draw() {
    ctx.clearRect(0, 0, width, height)
    let is_black =  true
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++)  {

            ctx.fillStyle = is_black
                ? "rgb(137, 80, 49)"
                : "rgb(248, 222, 157)"

            if (selected && selected.x == x && selected.y == y)
                ctx.fillStyle = 'red'

            if (board_odd[x][y] == true)
                ctx.fillStyle = 'green'

            ctx.fillRect(x * unit, y * unit, unit, unit)

            const piece_name = number_to_piece(board[x][y])
            if (piece_name)
                ctx.drawImage(sprites[piece_name], x * unit, y * unit)

            is_black = !is_black
        }
        is_black = !is_black
    }
}

function onclick(ev) {
    const x = ev.offsetX
    const y = ev.offsetY

    const grid = {
        x: Math.ceil(x / width * rows) - 1,
        y: Math.ceil(y / height * cols) - 1
    }

    if (selected === null) {
        selected = grid
        calculate_odds(grid.x, grid.y)
    }
    else if (grid.x == selected.x && grid.y == selected.y) {
        selected = null
    }
    else if (board_odd[grid.x][grid.y]) {
        board[grid.x][grid.y] = board[selected.x][selected.y]
        board[selected.x][selected.y] = 0
        selected = null
    }
}

function calculate_odds(x, y) {
    const piece = board[x][y]

    if (Math.abs(piece) == 1) {
        // tower

        for (let tx = x; tx > 0 || board[tx][y] == 0; tx--)
            board_odd[tx][y] = true
    }
}

function loop() {
    draw()
    setTimeout(() => requestAnimationFrame(loop), 10)
}

init()
requestAnimationFrame(loop)