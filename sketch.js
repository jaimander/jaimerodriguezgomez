/*let cv;
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
*/
// 1
const s1 = (sketch1) => {
  let ancho;
  let alto;
  let contenedor;
  let xcir, ycir;
  let objeto1;
  let objeto2;
  let cfondo;

  class Objeto {
    constructor(col) {
      this.x = sketch1.random(sketch1.width);
      this.y = sketch1.random(sketch1.height);
      this.dir = 1;
      this.vel = 8;
      this.col = col;
    }

    update() {
      sketch1.noStroke();
      sketch1.fill(this.col);
      sketch1.rectMode(sketch1.CENTER);
      sketch1.rect(this.x, this.y, 40, 40);

      this.x = this.x + this.vel * this.dir;

      if (this.x > sketch1.width) {
        this.dir = -1;
      }
      if (this.x < 0) {
        this.dir = 1;
      }
    }
  }

  sketch1.setup = () => {
    contenedor = document.getElementById('canvasp5-1');

    ancho = contenedor.offsetWidth;
    alto = ancho; // cuadrado

    sketch1.createCanvas(ancho, alto);

    xcir = sketch1.width / 2;
    ycir = sketch1.height / 2;
    objeto1 = new Objeto(sketch1.color(255, 255, 0));
    objeto2 = new Objeto(sketch1.color(0, 200, 255));
    cfondo = 80;
  };

  sketch1.draw = () => {
    sketch1.background(cfondo);
    sketch1.noStroke();

    // círculo
    sketch1.stroke(255);
    sketch1.noFill();
    sketch1.strokeWeight(3);
    sketch1.ellipse(sketch1.mouseX, sketch1.mouseY, 200, 200);

    objeto1.update();
    objeto2.update();

    let dist1 = sketch1.dist(objeto1.x, objeto1.y, sketch1.mouseX, sketch1.mouseY);
    let dist2 = sketch1.dist(objeto2.x, objeto2.y, sketch1.mouseX, sketch1.mouseY);

    if (dist1 < 100 && dist2 < 100) {
      cfondo = sketch1.color(0, 255, 100);
    } else {
      cfondo = sketch1.color(80);
    }
  };

  sketch1.windowResized = () => {
    ancho = contenedor.offsetWidth;
    alto = ancho; // mantener cuadrado
    sketch1.resizeCanvas(ancho, alto);
  };
};

let myp51 = new p5(s1, document.getElementById('canvasp5-1'));

// 2

const s2 = (sketch2) => {
  let ancho;
  let alto;
  let contenedor;

  let colorFondo;
  let xRojo;
  let yRojo;
  let d;
  let varRand;
  let tamRand;

  sketch2.setup = () => {
    contenedor = document.getElementById('canvasp5-2');

    ancho = contenedor.offsetWidth;
    alto = ancho; // cuadrado

    sketch2.createCanvas(ancho, alto);

    colorFondo = sketch2.color(40);

    xRojo = sketch2.width;
    yRojo = 0;
  };

  sketch2.draw = () => {
    sketch2.background(colorFondo);

    d = sketch2.dist(xRojo, yRojo, sketch2.mouseX, sketch2.mouseY);
    varRand = sketch2.map(d, 0, 1000, 30, 0);
    tamRand = sketch2.map(d, 0, 1000, 10, 100);

    if (d <= 80) {
      sketch2.noFill();
      sketch2.stroke(255);
      sketch2.ellipse(sketch2.mouseX, sketch2.mouseY, 200, 200);
    }

    if (d >= 80) {
      sketch2.noStroke();
      sketch2.fill(255, 0, 0);
      sketch2.ellipse(xRojo, yRojo, 300, 300);

      sketch2.noFill();
      sketch2.stroke(255);
      sketch2.ellipse(
        sketch2.mouseX + sketch2.random(varRand),
        sketch2.mouseY + sketch2.random(varRand),
        tamRand,
        tamRand
      );
    }
  };

  sketch2.windowResized = () => {
    ancho = contenedor.offsetWidth;
    alto = ancho; // mantener cuadrado
    sketch2.resizeCanvas(ancho, alto);
  };
};

let myp52 = new p5(s2, document.getElementById('canvasp5-2'));
