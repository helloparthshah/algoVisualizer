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
      )
        this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].isWall = wallMode;
  };

  this.clr = function () {
    for (i = 0; i < rows; i++) {
      for (j = 0; j < cols; j++) {
        this.nodes[i][j].isVisited = false;
        this.nodes[i][j].isPath = false;
      }
    }
  };
  this.showPath = async function () {
    while (this.nodes[this.end.x][this.end.y].parent) {
      await sleep(100);
      print(this.nodes[this.end.x][this.end.y].parent);

      this.nodes[this.end.x][this.end.y].parent.isPath = true;
      this.nodes[this.end.x][this.end.y].parent =
        this.nodes[this.end.x][this.end.y].parent.parent;
    }
  };

  let X = [0, 1, 0, -1];
  let Y = [-1, 0, 1, 0];

  this.dfs = async function (i, j) {
    await sleep(50);

    if (this.nodes[this.end.x][this.end.y].isVisited) {
      this.showPath();
      return false;
    }

    print(i, j);

    if (this.nodes[i][j].isVisited || this.nodes[i][j].isWall) return;

    this.nodes[i][j].isVisited = true;

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

var queue = [];
this.bfs = async function (i, j) {
  queue.push(this.node[i][j]);
  while (queue.length != 0) {
    var v = queue[0];
    queue.pop();
    for (k = 0; k < 4; k++) {}
  }
};

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
