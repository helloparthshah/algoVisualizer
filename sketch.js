// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)
p5.disableFriendlyErrors = true;

var grid;

var wallMode = true;

function setup() {
  // put setup code here
  createCanvas(800, 800);
  grid = new Grid(20, 20, 0, 0, 19, 19);
  pixelDensity(1);
}

function vis(i) {
  if (!grid.isFinding) {
    if (i == 0) {
      grid.reset();
      return;
    }
    grid.isFinding = true;
    b = document.getElementsByTagName("button")[i];
    b.style.backgroundColor = "red";
    grid.clr();
    if (i == 1)
      grid.dfs().then(() => {
        b.style.backgroundColor = "";
        grid.isFinding = false;
      });
    else if (i == 2)
      grid.bfs().then(() => {
        b.style.backgroundColor = "";
        grid.isFinding = false;
      });
    else if (i == 3)
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
}

function mouseDragged() {
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
