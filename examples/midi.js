
export const midiEx = `function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fab = createFab();
  midiController = createMidiController(debug=true); // turn on midi mode!
  midiMode(); // enable midi mode!
}

function fabDraw() {
  // setup!
  fab.setAbsolutePosition(); // set all axes (x.y/z/extruder) to absolute
  fab.setERelative(); // put extruder in relative mode, independent of other axes
  fab.autoHome();
  // variables for our hollow cube!
  let sideLength = 20; //mm
  let x = fab.centerX - sideLength/2; 
  let y = fab.centerY - sideLength/2;
  let speed = 10; // mm/sec
  let layerHeight = 0.2; // mm

  // design our hollow cube!
  fab.moveRetract(x, y, layerHeight); // move to the start (x,y,z) position without extruding

  for (let z = layerHeight; z <= sideLength; z += layerHeight) { 
    if (z == layerHeight) { // if it's the first layer
    speed = 10; // slow print speeed down for the first layer
    }
    else {
      speed = 25;
    }
    fab.moveExtrude(x + sideLength, y, z, speed); // move along the bottom side while extruding filament
    fab.moveExtrude(x + sideLength, y + sideLength, z, speed); // right side
    fab.moveExtrude(x, y + sideLength, z, speed); // top side
    fab.moveExtrude(x, y, z, speed); //left side
  }

  fab.presentPart();
  fab.render();
}

function midiSetup(midiData) {
  // in midiSetup, we can specify the actions we want to happen on incoming note values
  // to figure out notes for your midi controller, use debug=true in createMidiController
  if (midiData.note == 1 && midiData.type == midiController.MidiTypes.NOTEON) { 
    fab.print();
  }

  if (midiData.note == 16) { 
    // for any incoming value, we can name the property we want to change in midiDraw
    midiController.speed = midiData.mapVelocity(600, 3000); // values in mm/min
  }

  if (midiData.note == 20) {
    midiController.extrusionMultiplier =  midiData.mapVelocity(0.5, 5);
  }

  if (midiData.note == 24) {
    midiController.zOff =  midiData.mapVelocity(0.5, 5);
  }
}

function midiDraw(moveCommand) {
  // in midiDraw, we can modify commands as they're sent to the printer
  // moveCommand has x, y, z, e, and f properties (f is speed)
  // we can modify them with any midiController property that we defined in midiSetup
  if (midiController.speed) {
    moveCommand.f = midiController.speed;
  }

  if (midiController.extrusionMultiplier) {
    moveCommand.e *= midiController.extrusionMultiplier;
  }

  if (midiController.zOff) {
    moveCommand.z += midiController.zOff;
  }

  return moveCommand; // be sure to return your modified moveCommand!
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  fab.render();
}
`