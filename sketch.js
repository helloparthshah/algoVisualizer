// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)
p5.disableFriendlyErrors = true;

var grid;

var mode = true;

var move = 0;

var h, w;

var prevSearch = false;

function preload() {
  e = document.getElementById("canvas");
  h = e.clientHeight;
  w = e.clientWidth;
}

function setup() {
  // put setup code here
  canvas = createCanvas(w, h);
  canvas.parent("canvas");

  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  grid = new Grid(50);

  pixelDensity(1);
}

function reset() {
  if (!grid.isFinding) {
    grid.reset();
  }
}

function genMaze() {
  if (!grid.isFinding) {
    reset();
    grid.isFinding = true;
    b = document.getElementById("start");
    b.style.backgroundColor = "red";
    grid.dfsMaze().then(() => {
      b.style.backgroundColor = "";
      grid.isFinding = false;
    });
  }
}

function visualize(delay) {
  if (delay > 0) prevSearch = true;
  if (prevSearch) {
    let option = document.querySelector('input[name="item"]:checked').id;
    if (!grid.isFinding && option != "default") {
      grid.isFinding = true;
      b = document.getElementById("start");
      b.style.backgroundColor = "red";
      grid.clr();
      if (option == "dfs")
        grid.dfs(delay).then(() => {
          b.style.backgroundColor = "";
          grid.isFinding = false;
        });
      else if (option == "bfs")
        grid.bfs(delay).then(() => {
          b.style.backgroundColor = "";
          grid.isFinding = false;
        });
      else if (option == "gbfs")
        grid.gbfs(delay).then(() => {
          b.style.backgroundColor = "";
          grid.isFinding = false;
        });
      else if (option == "astar")
        grid.astar(delay).then(() => {
          b.style.backgroundColor = "";
          grid.isFinding = false;
        });
      else if (option == "dijkstra")
        grid.dijkstra(delay).then(() => {
          b.style.backgroundColor = "";
          grid.isFinding = false;
        });
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mouseClicked() {
  mode = grid.getMode(mouseX, mouseY);
  if (mouseButton == LEFT)
    grid.setWall(mouseX, mouseY, mode);
  if (mouseButton == RIGHT)
    grid.setWeight(mouseX, mouseY, mode);
}

function mousePressed() {
  mode = grid.getMode(mouseX, mouseY);
  move = grid.isStartEnd(mouseX, mouseY);
}

function mouseDragged() {
  if (move != 0) {
    grid.moveNode(mouseX, mouseY, move);
    return;
  }
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (mouseButton == LEFT)
      grid.setWall(mouseX, mouseY, mode);
    if (mouseButton == RIGHT)
      grid.setWeight(mouseX, mouseY, mode);
  }
}

function draw() {
  clear();
  grid.display();
}