class Grid {
  constructor(rows, cols, x1, y1, x2, y2) {
    this.rows = rows;
    this.cols = cols;
    this.size = width / this.rows;

    this.start = createVector(x1, y1);
    this.end = createVector(x2, y2);

    this.isFinding = false;

    this.nodes = [];

    for (let i = 0; i < this.rows; i++) {
      this.nodes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j] = new Node(
          i,
          j,
          this.size,
          dist(i, j, this.end.x, this.end.y)
        );
      }
    }

    this.nodes[x1][y1].isStart = true;
    this.nodes[x2][y2].isEnd = true;

    this.updateDist = function () {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.nodes[i][j].dist = dist(i, j, this.end.x, this.end.y);
        }
      }
    };

    this.display = function () {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.nodes[i][j].display();
        }
      }
    };

    this.getMode = function (x, y) {
      if (x < width && y < height && x > 0 && y > 0)
        return !this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].isWall;
    };

    this.isStartEnd = function (x, y) {
      if (x < width && y < height && x > 0 && y > 0)
        return this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].isStart
          ? 1
          : this.nodes[floor((x / width) * this.rows)][
              floor((y / height) * this.cols)
            ].isEnd
          ? -1
          : 0;
    };

    this.moveNode = function (x, y, n) {
      if (x < width && y < height && x > 0 && y > 0) {
        if (n == 1) {
          this.nodes[this.start.x][this.start.y].isStart = false;
          this.start = createVector(
            floor((x / width) * this.rows),
            floor((y / height) * this.cols)
          );
          this.nodes[this.start.x][this.start.y].isStart = true;
        } else if (n == -1) {
          this.nodes[this.end.x][this.end.y].isEnd = false;
          this.end = createVector(
            floor((x / width) * this.rows),
            floor((y / height) * this.cols)
          );
          this.nodes[this.end.x][this.end.y].isEnd = true;
          this.updateDist();
        }
      }
    };

    this.onClick = function (x, y, wallMode) {
      if (x < width && y < height && x > 0 && y > 0)
        if (
          !this.nodes[floor((x / width) * this.rows)][
            floor((y / height) * this.cols)
          ].isStart &&
          !this.nodes[floor((x / width) * this.rows)][
            floor((y / height) * this.cols)
          ].isEnd
        ) {
          this.nodes[floor((x / width) * this.rows)][
            floor((y / height) * this.cols)
          ].setWall(wallMode);
        }
    };

    this.reset = function () {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.nodes[i][j].parent = null;
          this.nodes[i][j].isVisited = false;
          this.nodes[i][j].isPath = false;
          this.nodes[i][j].isWall = false;
        }
      }
    };

    this.clr = function () {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.nodes[i][j].parent = null;
          this.nodes[i][j].isVisited = false;
          this.nodes[i][j].isPath = false;
        }
      }
    };

    this.showPath = async function () {
      var n = this.nodes[this.end.x][this.end.y];
      while (n && n.parent) {
        n.setPath(true);
        n = n.parent;
        await sleep(5);
      }
    };

    let X = [0, 1, 0, -1];
    let Y = [-1, 0, 1, 0];

    this.dfs = async function () {
      this.nodes[this.start.x][this.start.y].setVisited(true);
      var stack = [];

      stack.push(this.nodes[this.start.x][this.start.y]);

      while (stack.length > 0) {
        var curNode = stack.pop();

        if (curNode === this.nodes[this.end.x][this.end.y]) break;

        for (let k = 0; k < 4; k++) {
          let dx = curNode.x + X[k];
          let dy = curNode.y + Y[k];
          if (
            dx >= 0 &&
            dx < this.rows &&
            dy >= 0 &&
            dy < this.cols &&
            !this.nodes[dx][dy].isVisited &&
            !this.nodes[dx][dy].isWall
          ) {
            this.nodes[dx][dy].setVisited(true);
            this.nodes[dx][dy].parent = curNode;
            stack.push(this.nodes[dx][dy]);
          }
        }
        await sleep(10);
      }
      await this.showPath();
    };

    this.bfs = async function () {
      this.nodes[this.start.x][this.start.y].setVisited(true);
      var queue = [];

      queue.push(this.nodes[this.start.x][this.start.y]);

      while (queue.length > 0) {
        var curNode = queue.shift();

        if (curNode === this.nodes[this.end.x][this.end.y]) break;

        for (let k = 0; k < 4; k++) {
          let dx = curNode.x + X[k];
          let dy = curNode.y + Y[k];
          if (
            dx >= 0 &&
            dx < this.rows &&
            dy >= 0 &&
            dy < this.cols &&
            !this.nodes[dx][dy].isVisited &&
            !this.nodes[dx][dy].isWall
          ) {
            this.nodes[dx][dy].setVisited(true);
            this.nodes[dx][dy].parent = curNode;
            queue.push(this.nodes[dx][dy]);
          }
        }
        await sleep(1);
      }

      await this.showPath();
    };

    this.gbfs = async function () {
      this.nodes[this.start.x][this.start.y].setVisited(true);
      var queue = [];

      queue.push(this.nodes[this.start.x][this.start.y]);

      while (queue.length > 0) {
        queue.sort((a, b) => {
          return a.dist > b.dist ? 1 : b.dist > a.dist ? -1 : 0;
        });

        var curNode = queue.shift();
        if (curNode === this.nodes[this.end.x][this.end.y]) break;

        for (let k = 0; k < 4; k++) {
          let dx = curNode.x + X[k];
          let dy = curNode.y + Y[k];
          if (
            dx >= 0 &&
            dx < this.rows &&
            dy >= 0 &&
            dy < this.cols &&
            !this.nodes[dx][dy].isVisited &&
            !this.nodes[dx][dy].isWall
          ) {
            this.nodes[dx][dy].setVisited(true);
            this.nodes[dx][dy].parent = curNode;
            queue.push(this.nodes[dx][dy]);
          }
        }
        await sleep(10);
      }
      await this.showPath();
    };
  }
}

class Node {
  constructor(x, y, size, dist) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.s = size;
    this.dist = dist;

    this.parent;
    this.isStart = false;
    this.isEnd = false;
    this.isPath = false;
    this.isVisited = false;
    this.isWall = false;

    this.setWall = async function (isWall) {
      if (this.isWall != isWall) {
        this.isWall = isWall;
        if (!this.isStart && !this.isEnd) {
          for (let i = this.size / 2; i <= this.size; i++) {
            this.s = i;
            await sleep(1);
          }
        }
      }
    };

    this.setVisited = async function (isVisited) {
      if (this.isVisited != isVisited) {
        this.isVisited = isVisited;
        if (!this.isStart && !this.isEnd) {
          for (let i = this.size / 2; i <= this.size; i++) {
            this.s = i;
            await sleep(1);
          }
        }
      }
    };

    this.setPath = async function (isPath) {
      if (this.isPath != isPath) {
        this.isPath = isPath;
        if (!this.isStart && !this.isEnd) {
          for (let i = this.size / 2; i <= this.size; i++) {
            this.s = i;
            await sleep(1);
          }
        }
      }
    };

    this.display = function () {
      rectMode(CENTER);
      if (this.isStart) fill(0, 255, 0);
      else if (this.isEnd) fill(255, 0, 0);
      else if (this.isWall) fill(12, 53, 71);
      else if (this.isPath) fill(255, 254, 106);
      else if (this.isVisited) fill(0, 190, 218);
      else noFill();
      stroke(175, 216, 248);
      square(
        this.x * this.size + this.size / 2,
        this.y * this.size + this.size / 2,
        this.s
      );
    };
  }
}
