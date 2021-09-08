// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)
p5.disableFriendlyErrors = true;

var grid;

var wallMode = true;

var move = 0;

function setup() {
  // put setup code here
  createCanvas(800, 800);
  grid = new Grid(30, 30);

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

function visualize() {
  let option = document.querySelector('input[name="item"]:checked').id;
  if (!grid.isFinding && option != "default") {
    grid.isFinding = true;
    b = document.getElementById("start");
    b.style.backgroundColor = "red";
    grid.clr();
    if (option == "dfs")
      grid.dfs().then(() => {
        b.style.backgroundColor = "";
        grid.isFinding = false;
      });
    else if (option == "bfs")
      grid.bfs().then(() => {
        b.style.backgroundColor = "";
        grid.isFinding = false;
      });
    else if (option == "gbfs")
      grid.gbfs().then(() => {
        b.style.backgroundColor = "";
        grid.isFinding = false;
      });
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mouseClicked() {
  wallMode = grid.getMode(mouseX, mouseY);
  grid.onClick(mouseX, mouseY, wallMode);
}

function mousePressed() {
  wallMode = grid.getMode(mouseX, mouseY);
  move = grid.isStartEnd(mouseX, mouseY);
}

function mouseDragged() {
  if (move != 0) {
    grid.moveNode(mouseX, mouseY, move);
    return;
  }
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    grid.onClick(mouseX, mouseY, wallMode);
  }
}

function draw() {
  // put drawing code here
  // background(255);
  clear();
  grid.display();
}
