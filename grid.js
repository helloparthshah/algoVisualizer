function Grid(rows, cols, x1, y1, x2, y2) {
  this.rows = rows;
  this.cols = cols;
  this.size = width / this.rows;

  this.start = createVector(x1, y1);
  this.end = createVector(x2, y2);

  this.isFinding = false;

  this.nodes = [];

  for (i = 0; i < rows; i++) {
    this.nodes[i] = [];
    for (j = 0; j < cols; j++) {
      this.nodes[i][j] = new Node(i, j, this.size, dist(i, j, x2, y2));
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
        this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].setWall(wallMode);
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
        n.setPath(true);
        n = n.parent;
      });
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
          this.nodes[dx][dy].setVisited(true);
          this.nodes[dx][dy].parent = curNode;
          stack.push(this.nodes[dx][dy]);
        }
      }
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
          this.nodes[dx][dy].setVisited(true);
          this.nodes[dx][dy].parent = curNode;
          queue.push(this.nodes[dx][dy]);
        }
      }
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
          this.nodes[dx][dy].setVisited(true);
          this.nodes[dx][dy].parent = curNode;
          queue.push(this.nodes[dx][dy]);
        }
      }
    }
    await this.showPath();
  };
}

function Node(x, y, size, dist) {
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
      if (!this.isStart && !this.isEnd)
        for (let i = 0; i <= this.size; i++) {
          await sleep(1).then(() => {
            this.s = i;
          });
        }
    }
  };

  this.setVisited = async function (isVisited) {
    if (this.isVisited != isVisited) {
      this.isVisited = isVisited;
      if (!this.isStart && !this.isEnd)
        for (let i = 0; i <= this.size; i++) {
          await sleep(1).then(() => {
            this.s = i;
          });
        }
    }
  };

  this.setPath = async function (isPath) {
    if (this.isPath != isPath) {
      this.isPath = isPath;
      if (!this.isStart && !this.isEnd)
        for (let i = 0; i <= this.size; i++) {
          await sleep(1).then(() => {
            this.s = i;
          });
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
