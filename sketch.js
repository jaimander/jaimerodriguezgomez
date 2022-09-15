let cv;
let colorFondo = 0;

function setup() {
  cv = createCanvas(windowWidth, 100);
  cv.parent('canvasp5-1');
}

function draw() {
  background(colorFondo);
}

function windowResized() {
  resizeCanvas(windowWidth, 100);
}

function mousePressed() {
  colorFondo = color(int(random(255)));
}
