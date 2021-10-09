class Grid {
  constructor(n) {
    this.rows = n;
    this.size = width / this.rows;
    this.cols = floor(height / this.size);

    this.start = createVector(floor(this.rows / 4), floor(this.cols / 2));
    this.end = createVector(floor((3 * this.rows) / 4), floor(this.cols / 2));

    this.isFinding = false;

    this.nodes = [];

    for (let i = 0; i < this.rows; i++) {
      this.nodes[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j] = new Node(
          i,
          j,
          this.size,
          0,
          Math.abs(this.end.x - i) + Math.abs(this.end.y - j),
          dist(i, j, this.end.x, this.end.y)
        );
      }
    }

    this.nodes[this.start.x][this.start.y].isStart = true;
    this.nodes[this.end.x][this.end.y].isEnd = true;

    this.X = [0, 1, 0, -1];
    this.Y = [-1, 0, 1, 0];
  }

  dfsMaze = async function () {
    this.nodes[this.start.x][this.start.y].isStart = false;
    this.nodes[this.end.x][this.end.y].isEnd = false;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].isWall = true;
      }
    }

    this.nodes[this.start.x][this.start.y].setVisited(true, 1);
    var stack = [];

    stack.push(this.nodes[this.start.x][this.start.y]);

    while (stack.length > 0) {
      var curNode = stack.pop();

      curNode.isVisited = true;
      let n = [];
      for (let k = 0; k < 4; k++) {
        let dx = curNode.x + this.X[k] * 2;
        let dy = curNode.y + this.Y[k] * 2;
        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited
        )
          n.push(this.nodes[dx][dy]);
      }
      if (n.length > 0) {
        const rndInt = Math.floor(Math.random() * n.length);

        for (let i = 0; i < n.length; i++) {
          n[i].isVisited = true;
          n[i].setWall(false, 1);
          this.nodes[(curNode.x + n[i].x) / 2][
            (curNode.y + n[i].y) / 2
          ].isVisited = true;

          this.nodes[(curNode.x + n[i].x) / 2][
            (curNode.y + n[i].y) / 2
          ].setWall(false, 1);

          if (i != rndInt) stack.push(n[i]);
          await sleep(1);
        }

        stack.push(n[rndInt]);
      }
    }
    while (1) {
      let i = Math.floor(Math.random() * this.rows);
      let j = Math.floor(Math.random() * this.cols);
      if (!this.nodes[i][j].isWall) {
        this.nodes[i][j].isStart = true;
        this.start = createVector(i, j);
        break;
      }
    }
    while (1) {
      let i = Math.floor(Math.random() * this.rows);
      let j = Math.floor(Math.random() * this.cols);
      if (!this.nodes[i][j].isWall && !this.nodes[i][j].isEnd) {
        this.nodes[i][j].isEnd = true;
        this.end = createVector(i, j);
        break;
      }
    }
    this.updateDist();
    this.clr();
  };

  updateDist = function () {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].dist = dist(i, j, this.end.x, this.end.y);
        this.nodes[i][j].h =
          Math.abs(this.end.x - i) + Math.abs(this.end.y - j);
        this.nodes[i][j].g = 0;
        this.nodes[i][j].f = this.nodes[i][j].g + this.nodes[i][j].h;
      }
    }
  };

  display = function () {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].display();
      }
    }
  };

  getMode = function (x, y) {
    if (x < width && y < height && x > 0 && y > 0)
      return !(this.nodes[floor((x / width) * this.rows)][
        floor((y / height) * this.cols)
      ].isWall || this.nodes[floor((x / width) * this.rows)][
        floor((y / height) * this.cols)
      ].isWeight);
  };

  isStartEnd = function (x, y) {
    if (x < width && y < height && x > 0 && y > 0)
      return this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].isStart ?
        1 :
        this.nodes[floor((x / width) * this.rows)][
          floor((y / height) * this.cols)
        ].isEnd ?
        -1 :
        0;
  };

  moveNode = function (x, y, n) {
    if (
      x < width &&
      y < height &&
      x > 0 &&
      y > 0 &&
      this.nodes[floor((x / width) * this.rows)][
        floor((y / height) * this.cols)
      ].isWall == false
    ) {
      if (n == 1) {
        this.nodes[this.start.x][this.start.y].isStart = false;
        this.start = createVector(
          floor((x / width) * this.rows),
          floor((y / height) * this.cols)
        );
        this.nodes[this.start.x][this.start.y].isStart = true;
        this.updateDist();
        visualize(0);
      } else if (n == -1) {
        this.nodes[this.end.x][this.end.y].isEnd = false;
        this.end = createVector(
          floor((x / width) * this.rows),
          floor((y / height) * this.cols)
        );
        this.nodes[this.end.x][this.end.y].isEnd = true;
        this.updateDist();
        visualize(0);
      }
    }
  };

  setWall = function (x, y, mode) {
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
        ].setWall(mode, 1);
        visualize(0);
      }
  };

  setWeight = function (x, y, mode) {
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
        ].setWeight(mode, 1);
        visualize(0);
      }
  };

  reset = function () {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].parent = null;
        this.nodes[i][j].isVisited = false;
        this.nodes[i][j].isPath = false;
        this.nodes[i][j].isWeight = false;
        this.nodes[i][j].isWall = false;
      }
    }
  };

  clr = function () {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].parent = null;
        this.nodes[i][j].isVisited = false;
        this.nodes[i][j].isPath = false;
      }
    }
  };

  showPath = async function (delay) {
    var n = this.nodes[this.end.x][this.end.y];
    while (n && n.parent) {
      n.setPath(true);
      n = n.parent;
      if (delay > 0) await sleep(5);
    }
  };

  dfs = async function (delay) {
    this.nodes[this.start.x][this.start.y].setVisited(true, delay);
    var stack = [];

    stack.push(this.nodes[this.start.x][this.start.y]);

    while (stack.length > 0) {
      var curNode = stack.pop();

      curNode.setVisited(true, delay);

      if (curNode === this.nodes[this.end.x][this.end.y]) break;

      for (let k = 0; k < 4; k++) {
        let dx = curNode.x + this.X[k];
        let dy = curNode.y + this.Y[k];
        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited &&
          !this.nodes[dx][dy].isWall
        ) {
          // this.nodes[dx][dy].setVisited(true);
          this.nodes[dx][dy].parent = curNode;
          stack.push(this.nodes[dx][dy]);
        }
      }
      if (delay > 0) await sleep(delay);
    }
    await this.showPath(delay);
  };

  bfs = async function (delay) {
    this.nodes[this.start.x][this.start.y].setVisited(true, delay);
    var queue = [];

    queue.push(this.nodes[this.start.x][this.start.y]);

    while (queue.length > 0) {
      var curNode = queue.shift();

      if (curNode === this.nodes[this.end.x][this.end.y]) break;

      for (let k = 0; k < 4; k++) {
        let dx = curNode.x + this.X[k];
        let dy = curNode.y + this.Y[k];
        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited &&
          !this.nodes[dx][dy].isWall
        ) {
          this.nodes[dx][dy].setVisited(true, delay);
          this.nodes[dx][dy].parent = curNode;
          queue.push(this.nodes[dx][dy]);
        }
      }
      if (delay > 0) await sleep(delay);
    }

    await this.showPath(delay);
  };

  gbfs = async function (delay) {
    this.nodes[this.start.x][this.start.y].setVisited(true, delay);
    var queue = [];

    queue.push(this.nodes[this.start.x][this.start.y]);

    while (queue.length > 0) {
      queue.sort((a, b) => {
        return a.dist > b.dist ? 1 : b.dist > a.dist ? -1 : 0;
      });

      var curNode = queue.shift();

      if (curNode === this.nodes[this.end.x][this.end.y]) break;

      for (let k = 0; k < 4; k++) {
        let dx = curNode.x + this.X[k];
        let dy = curNode.y + this.Y[k];
        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited &&
          !this.nodes[dx][dy].isWall
        ) {
          this.nodes[dx][dy].setVisited(true, delay);
          this.nodes[dx][dy].parent = curNode;
          queue.push(this.nodes[dx][dy]);
        }
      }
      if (delay > 0) await sleep(delay);
    }
    await this.showPath(delay);
  };

  astar = async function (delay) {
    var queue = [];
    queue.push(this.nodes[this.start.x][this.start.y]);

    while (queue.length > 0) {
      queue.sort((a, b) => {
        return a.f > b.f ? 1 : b.f > a.f ? -1 : 0;
      });

      var curNode = queue.shift();

      if (curNode === this.nodes[this.end.x][this.end.y]) break;

      curNode.setVisited(true, delay);

      for (let k = 0; k < 4; k++) {
        let dx = curNode.x + this.X[k];
        let dy = curNode.y + this.Y[k];
        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited &&
          !this.nodes[dx][dy].isWall
        ) {
          this.nodes[dx][dy].g = curNode.g + this.nodes[dx][dy].cost;
          this.nodes[dx][dy].f = this.nodes[dx][dy].g + this.nodes[dx][dy].h;
          this.nodes[dx][dy].setVisited(true, delay);
          this.nodes[dx][dy].parent = curNode;
          queue.push(this.nodes[dx][dy]);
        }
      }
      if (delay > 0) await sleep(delay);
    }
    await this.showPath(delay);
  };

  dijkstra = async function (delay) {
    var queue = [];
    queue.push(this.nodes[this.start.x][this.start.y]);

    while (queue.length > 0) {
      queue.sort((a, b) => {
        return a.g > b.g ? 1 : b.g > a.g ? -1 : 0;
      });

      var curNode = queue.shift();

      if (curNode === this.nodes[this.end.x][this.end.y]) break;

      curNode.setVisited(true, delay);

      for (let k = 0; k < 4; k++) {
        let dx = curNode.x + this.X[k];
        let dy = curNode.y + this.Y[k];
        if (
          dx >= 0 &&
          dx < this.rows &&
          dy >= 0 &&
          dy < this.cols &&
          !this.nodes[dx][dy].isVisited &&
          !this.nodes[dx][dy].isWall
        ) {
          this.nodes[dx][dy].g = curNode.g + this.nodes[dx][dy].cost;
          this.nodes[dx][dy].setVisited(true, delay);
          this.nodes[dx][dy].parent = curNode;
          queue.push(this.nodes[dx][dy]);
        }
      }
      if (delay > 0) await sleep(delay);
    }
    await this.showPath(delay);
  };
}

class Node {
  constructor(x, y, size, g, h, dist) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.s = size;
    this.dist = dist;
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.cost = 1;

    this.parent;
    this.isStart = false;
    this.isEnd = false;
    this.isPath = false;
    this.isVisited = false;
    this.isWall = false;
    this.isWeight = false;
  }

  setWeight = async function (isWeight, delay) {
    if (this.isWeight != isWeight) {
      this.isWeight = isWeight;
      this.isWall = false;
      this.cost = 10;
      if (!this.isStart && !this.isEnd) {
        for (let i = this.size / 2; i <= this.size; i += 2) {
          this.s = i;
          if (delay > 0) await sleep(delay);
        }
      }
    }
  };

  setWall = async function (isWall, delay) {
    if (this.isWall != isWall) {
      this.isWall = isWall;
      this.isWeight = false;
      if (!this.isStart && !this.isEnd) {
        for (let i = this.size / 2; i <= this.size; i += 2) {
          this.s = i;
          if (delay > 0) await sleep(delay);
        }
      }
    }
  };

  setVisited = async function (isVisited, delay) {
    if (this.isVisited != isVisited) {
      this.isVisited = isVisited;
      if (!this.isStart && !this.isEnd) {
        for (let i = this.size / 2; i <= this.size; i += 2) {
          this.s = i;
          if (delay > 0) await sleep(delay);
        }
      }
    }
  };

  setPath = async function (isPath, delay) {
    if (this.isPath != isPath) {
      this.isPath = isPath;
      if (!this.isStart && !this.isEnd) {
        for (let i = this.size / 2; i <= this.size; i += 2) {
          this.s = i;
          if (delay > 0) await sleep(delay);
        }
      }
    }
  };

  display = function () {
    rectMode(CENTER);
    if (this.isStart) fill(0, 255, 0);
    else if (this.isEnd) fill(255, 0, 0);
    else if (this.isWall) fill(12, 53, 71);
    else if (this.isPath) fill(255, 254, 106);
    else if (this.isWeight) fill(76, 175, 80);
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