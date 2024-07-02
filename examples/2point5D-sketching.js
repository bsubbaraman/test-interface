function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  midiController = createMidiController(debug=true);
}

function fabDraw() {
  // setup!
  fab.setAbsolutePosition();
  fab.setERelative();
  fab.autoHome();
  fab.setTemps(205, 60); // (nozzle, bed)

  // make a spiral!
  let r = 80; // outer radius
  let numSpirals = 8; // how many concentric spirals to make
  let center = createVector(fab.centerX, fab.centerY); // center the spiral on the print bed
  let z = 0.2;
  let step = TWO_PI / 100;
  let speed = 20; // move slowly for adhesion

  for (let angle = 0; angle <= numSpirals * TWO_PI; angle += step) {
    let x = r * cos(angle);
    let y = r * sin(angle);

    if (angle == 0) {
      fab.moveRetract(center.x + x, center.y + y, z, speed);
    } else {
      fab.moveExtrude(center.x + x, center.y + y, z, speed);
    }
    r -= 0.1;
  }
  fab.presentPart();
}

function midiSetup() {
  // map midi values!
}

function midiDraw(moveCommand) {
  // do things with your midi values

  return moveCommand;
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  fab.render();
}
