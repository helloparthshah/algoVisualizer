function Grid(rows, cols, x1, y1, x2, y2) {
  this.rows = rows;
  this.cols = cols;
  this.size = width / this.rows;

  this.start = createVector(x1, y1);
  this.end = createVector(x2, y2);

  this.pathFound = false;

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
      )
        this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].isWall = wallMode;
  };

  this.clr = function () {
    this.pathFound = false;
    for (i = 0; i < rows; i++) {
      for (j = 0; j < cols; j++) {
        this.nodes[i][j].isVisited = false;
        this.nodes[i][j].isPath = false;
      }
    }
  };

  this.showPath = async function () {
    var n = this.nodes[this.end.x][this.end.y];
    while (n && n.parent) {
      await sleep(50);

      n.isPath = true;
      n = n.parent;
    }
  };

  let X = [0, 1, 0, -1];
  let Y = [-1, 0, 1, 0];

  this.dfs = async function (i, j) {
    if (this.pathFound) return;
    if (this.nodes[i][j].isVisited || this.nodes[i][j].isWall) return;

    if (this.nodes[i][j] === this.nodes[this.end.x][this.end.y]) {
      this.pathFound = true;
      this.showPath();
      return;
    }

    this.nodes[i][j].isVisited = true;
    await sleep(20);

    for (k = 0; k < 4; k++) {
      dx = i + X[k];
      dy = j + Y[k];

      if (
        dx >= 0 &&
        dx < this.rows &&
        dy >= 0 &&
        dy < this.cols &&
        !this.nodes[dx][dy].isVisited
      ) {
        this.nodes[dx][dy].parent = this.nodes[i][j];
        this.dfs(dx, dy);
      }
    }
  };
}

function Node(x, y, size) {
  this.x = x * size;
  this.y = y * size;
  this.size = size;

  this.parent;
  this.isPath = false;
  this.isStart = false;
  this.isEnd = false;
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
    rect(this.x, this.y, this.size, this.size);
  };
}
