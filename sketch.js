// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)
p5.disableFriendlyErrors = true;

var grid;

var wallMode = true;

function setup() {
  // put setup code here
  createCanvas(800, 800);

  dfs = createButton("dfs");
  dfs.mousePressed(() => {
    grid.clr();
    grid.dfs();
  });

  bfs = createButton("bfs");
  bfs.mousePressed(() => {
    grid.clr();
    grid.bfs();
  });

  grid = new Grid(20, 20, 0, 0, 19, 19);
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
