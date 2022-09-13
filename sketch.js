const s1 = (sketch1) => {
  let ancho;
  let alto;
  let f = 0.587;

  let myp5GlobalSketchVar;

  sketch1.setup = () => {
    myp5GlobalSketchVar = sketch1.createCanvas(sketch1.innerHeight * 0.57, 200);

    ancho = sketch1.windowWidth * f;
    alto = sketch1.windowHeight * f;
    sketch1.resizeCanvas(ancho, ancho);
  };

  //  sketch.draw = function() {  //
  sketch1.draw = () => {
    sketch1.background(211, 235, 250);
    sketch1.fill(40);
    sketch1.ellipse(
      ancho / 2,
      ancho / 2,
      sketch1.width - ancho / 10,
      sketch1.width - ancho / 10
    );
    sketch1.fill(255);
    sketch1.noStroke();
    //sketch1.rect(sketch1.mouseX, sketch1.mouseY, 50, 50);
    let centroX = sketch1.width / 2;
    let centroY = sketch1.height / 2;

    let x = sketch1.mouseX;
    let y = sketch1.mouseY;
    let d = sketch1.dist(x, y, centroX, centroY);
    let maxTam = sketch1.width / 3;
    let tam = sketch1.map(d, 0, ancho / 2, maxTam, 0);

    //console.log(d);

    if (d < ancho / 2) {
      sketch1.ellipse(x, y, tam, tam);
    }
  };

  sketch1.windowResized = () => {
    //console.log('resized');
    ancho = sketch1.windowWidth * f;
    alto = sketch1.windowHeight * f;
    sketch1.resizeCanvas(ancho, ancho);
  };
};

let myp51 = new p5(s1, document.getElementById('canvasp5-1'));

////////
const s2 = (sketch2) => {
  let ancho;
  let alto;
  let f = 0.587;

  sketch2.setup = () => {
    sketch2.createCanvas(sketch2.windowHeight * 0.57, 200);

    ancho = sketch2.windowWidth * f;
    alto = sketch2.windowHeight * f;
    sketch2.resizeCanvas(ancho, alto);

    sketch2.background(211, 235, 250);
    sketch2.mouseX = -100;
  };

  //  sketch.draw = function() {  //
  sketch2.draw = () => {
    sketch2.strokeWeight(4);
    sketch2.stroke(0);
    sketch2.noFill();
    sketch2.rect(0, 0, sketch2.width, sketch2.height);
    sketch2.noStroke();
    sketch2.colorMode(sketch2.HSB, 255);
    sketch2.fill(
      sketch2.noise(sketch2.frameCount * 0.001) * 255,
      255,
      255,
      200
    );

    sketch2.push();
    sketch2.translate(sketch2.mouseX, sketch2.mouseY);
    sketch2.angleMode(sketch2.DEGREES);
    sketch2.rotate(sketch2.frameCount);
    sketch2.rectMode(sketch2.CENTER);
    sketch2.rect(0, 0, 50, 50);
    sketch2.pop();
    //console.log(sketch2.mouseX);
  };

  sketch2.windowResized = () => {
    //console.log('resized');
    ancho = sketch2.windowWidth * f;
    alto = sketch2.windowHeight * f;
    sketch2.resizeCanvas(ancho, alto);
  };
};

let miP52 = new p5(s2, document.getElementById('canvasp5-2'));

//////////

/*let ancho;
let alto;
let f = 0.587;
let x = 0;

function setup() {
  cv = createCanvas(windowHeight * 0.57, 100);
  cv.parent('canvasp5--1');

  ancho = windowWidth * f;
  alto = windowHeight * f;
  resizeCanvas(ancho, alto);

  background(211, 235, 250);
  mouseX = -100;
}

function draw() {
  strokeWeight(3);
  stroke(0);
  noFill();
  rect(0, 0, width, height);
  noStroke();
  colorMode(HSB, 255);
  fill(noise(frameCount * 0.01) * 255, 255, 255, 200);

  push();
  translate(mouseX, mouseY);
  angleMode(DEGREES);
  rotate(frameCount);
  rectMode(CENTER);
  rect(0, 0, 50, 50);
  pop();
}

function windowResized() {
  ancho = windowWidth * f;
  alto = windowHeight * f;
  resizeCanvas(ancho, alto);
}
*/

/*

function draw() {
  background(211, 235, 250);
  //background(40);
  strokeWeight(random(5));
  stroke(random(100));
  let y1 = random(40);
  let y2 = random(height - 40, height);

  let rand = random(10);
  if (rand < 8) {
    line(x, y1, x + random(-10, 10), y2);
  }

  ancho = windowWidth * f;
  alto = windowHeight * f;

  x++;

  if (x > width) {
    x = 0;
  }
}

function windowResized() {
  ancho = windowWidth * f;
  alto = windowHeight * f;
  resizeCanvas(ancho, alto);
}

*/
