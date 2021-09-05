// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)
var grid;

var wallMode = false;

function setup() {
  // put setup code here
  createCanvas(800, 800);

  button = createButton("start");
  button.mousePressed(() => {
    grid.clr();
    grid.dfs(0, 0);
  });

  grid = new Grid(50, 50, 0, 0, 49, 49);
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function mouseClicked() {
  wallMode = grid.getMode(mouseX, mouseY);
}

function draw() {
  // put drawing code here
  if (mouseIsPressed) {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      // grid.clr();
      // grid.dfs(0, 0);
      grid.onClick(mouseX, mouseY, wallMode);
    }
  }
  background(220);
  grid.display();
}
