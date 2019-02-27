class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.turn = CHESS_TYPE.BLACK;
        this.isPlaying = true;

        this.board = null;

        this.setup();
    }

    setup() {
        this.board = new Array(LINES_NUM);
        for (let i = 0; i < LINES_NUM; i++) {
            this.board[i] = new Array(LINES_NUM);
            for (let j = 0; j < LINES_NUM; j++) {
                this.board[i][j] = CHESS_TYPE.NONE;
            }
        }
        this.drawGrid();

        this.canvas.onmouseup = e => {
            e.preventDefault();
            if (!this.isPlaying) return;

            let pos = windowToCanvas(this.canvas, e.clientX, e.clientY);
            pos = getSmallPos(pos.x, pos.y);

            this.addChessman(pos.x, pos.y);
            this.reDraw();

            if (this.isGameOver(pos.x, pos.y)) {
                this.isPlaying = false;
                alert(this.turn === CHESS_TYPE.BLACK ? "黑方胜利！" : "白方胜利！");
            }
            this.turn = toggleType(this.turn);
        }
    }

    drawGrid() {
        this.ctx.fillStyle = "#c8c8c8";
        this.ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

        this.ctx.strokeStyle = "#111";
        for (let i = 1; i <= LINES_NUM; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(GRID_SIZE, i * GRID_SIZE);
            this.ctx.lineTo(GRID_SIZE * LINES_NUM, i * GRID_SIZE);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(i * GRID_SIZE, GRID_SIZE);
            this.ctx.lineTo(i * GRID_SIZE, GRID_SIZE * LINES_NUM);
            this.ctx.stroke();
        }
    }

    drawAllChessmen() {
        this.ctx.strokeStyle = "#bbb";

        for (let i = 0; i < LINES_NUM; i++) {
            for (let j = 0; j < LINES_NUM; j++) {
                if (this.board[i][j] === CHESS_TYPE.NONE) continue;

                this.ctx.fillStyle = (this.board[i][j] === CHESS_TYPE.BLACK) ? "#000" : "#fff";
                let pos = getAbsPos(i, j);

                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, CHESS_RADIUS, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }

    reDraw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawGrid();
        this.drawAllChessmen();
    }

    addChessman(x, y) {
        this.board[x][y] = this.turn;
    }

    isGameOver(x, y) {
        let type = this.board[x][y];
        // 横着的
        let count = 1;
        for (let i = x - 1; i >= 0 && this.board[i][y] === type; i--) count++;
        for (let i = x + 1; i < LINES_NUM && this.board[i][y] === type; i++) count++;
        if (count >= 5) return true;

        // 竖着的
        count = 1;
        for (let i = y - 1; i >= 0 && this.board[x][i] === type; i--) count++;
        for (let i = y + 1; i < LINES_NUM && this.board[x][i] === type; i++) count++;
        if (count >= 5) return true;

        // 左下斜
        count = 1;
        for (let i = x - 1, j = y + 1; i >= 0 && j < LINES_NUM && this.board[i][j] === type; i--, j++) count++;
        for (let i = x + 1, j = y - 1; i < LINES_NUM && j >= 0 && this.board[i][j] === type; i++, j--) count++;
        if (count >= 5) return true;

        // 右下斜
        count = 1;
        for (let i = x - 1, j = y - 1; i >= 0 && j >= 0 && this.board[i][j] === type; i--, j--) count++;
        for (let i = x + 1, j = y + 1; i < LINES_NUM && j < LINES_NUM && this.board[i][j] === type; i++, j++) count++;
        if (count >= 5) return true;

        return false;
    }

    play() {

    };
}


let game = new Game("board");
game.setup();
game.play();
