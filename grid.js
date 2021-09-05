function Grid(rows, cols, x1, y1, x2, y2) {
  this.rows = rows;
  this.cols = cols;
  this.size = width / this.rows;

  this.start = createVector(x1, y1);
  this.end = createVector(x2, y2);

  this.nodes = [];

  for (i = 0; i < rows; i++) {
    this.nodes[i] = [];
    for (j = 0; j < cols; j++) {
      this.nodes[i][j] = new Node(i, j, this.size);
    }
  }

  this.nodes[x1][y1].isStart = true;
  this.nodes[x2][y2].isEnd = true;

  this.display = function () {
    for (i = 0; i < rows; i++) {
      for (j = 0; j < cols; j++) {
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
        print(wallMode);
        this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].isWall = wallMode;
      }
  };

  this.clr = function () {
    for (i = 0; i < rows; i++) {
      for (j = 0; j < cols; j++) {
        this.nodes[i][j].parent = null;
        this.nodes[i][j].isVisited = false;
        this.nodes[i][j].isPath = false;
      }
    }
  };

  this.showPath = async function () {
    var n = this.nodes[this.end.x][this.end.y];
    while (n && n.parent) {
      await sleep(5).then(() => {
        n.isPath = true;
        n = n.parent;
      });
    }
  };

  let X = [0, 1, 0, -1];
  let Y = [-1, 0, 1, 0];

  this.dfs = async function () {
    this.nodes[this.start.x][this.start.y].isVisited = true;
    var stack = [];

    stack.push(this.nodes[this.start.x][this.start.y]);

    while (stack.length > 0) {
      var curNode = stack.pop();

      if (curNode === this.nodes[this.end.x][this.end.y]) break;

      await sleep(10);
      for (k = 0; k < 4; k++) {
        dx = curNode.x + X[k];
        dy = curNode.y + Y[k];

        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited &&
          !this.nodes[dx][dy].isWall
        ) {
          this.nodes[dx][dy].isVisited = true;
          this.nodes[dx][dy].parent = curNode;
          stack.push(this.nodes[dx][dy]);
        }
      }
    }
    await this.showPath();
  };

  /*  this.dfs = async function (i, j) {
    if (this.nodes[i][j] === this.nodes[this.end.x][this.end.y]) {
      await this.showPath();
      return true;
    }

    this.nodes[i][j].isVisited = true;
    await sleep(1);
    for (k = 0; k < 4; k++) {
      dx = i + X[k];
      dy = j + Y[k];

      if (
        dx >= 0 &&
        dx < this.rows &&
        dy >= 0 &&
        dy < this.cols &&
        !this.nodes[dx][dy].isVisited &&
        !this.nodes[dx][dy].isWall
      ) {
        this.nodes[dx][dy].parent = this.nodes[i][j];
        if (this.dfs(dx, dy)) return true;
      }
    }

    return false;
  }; */

  this.bfs = async function () {
    this.nodes[this.start.x][this.start.y].isVisited = true;
    var queue = [];

    queue.push(this.nodes[this.start.x][this.start.y]);

    while (queue.length > 0) {
      var curNode = queue.shift();

      if (curNode === this.nodes[this.end.x][this.end.y]) break;

      await sleep(1);
      for (k = 0; k < 4; k++) {
        dx = curNode.x + X[k];
        dy = curNode.y + Y[k];

        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited &&
          !this.nodes[dx][dy].isWall
        ) {
          this.nodes[dx][dy].isVisited = true;
          this.nodes[dx][dy].parent = curNode;
          queue.push(this.nodes[dx][dy]);
        }
      }
    }

    await this.showPath();
  };
}

function Node(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;

  this.parent;
  this.isStart = false;
  this.isEnd = false;
  this.isPath = false;
  this.isVisited = false;
  this.isWall = false;

  this.display = function () {
    if (this.isStart) fill(0, 255, 0);
    else if (this.isEnd) fill(255, 0, 0);
    else if (this.isWall) fill(100);
    else if (this.isPath) fill(0, 0, 255);
    else if (this.isVisited) fill(255, 255, 0);
    else noFill();
    stroke(0);
    rect(this.x * this.size, this.y * this.size, this.size, this.size);
  };
}
