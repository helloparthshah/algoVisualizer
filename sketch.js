// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)
p5.disableFriendlyErrors = true;

var grid;

var wallMode = true;

function setup() {
  // put setup code here
  createCanvas(800, 800);

  dfs = createButton("DFS");
  dfs.mousePressed(() => {
    grid.clr();
    grid.dfs();
  });

  bfs = createButton("BFS");
  bfs.mousePressed(() => {
    grid.clr();
    grid.bfs();
  });

  gbfs = createButton("Greedy BFS");
  gbfs.mousePressed(() => {
    grid.clr();
    grid.gbfs();
  });

  grid = new Grid(50, 50, 0, 0, 49, 49);
  pixelDensity(1);
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
  background(255);
  grid.display();
}
