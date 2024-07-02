function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    midiController = createMidiController(debug = true);
}

function fabDraw() {
    fab.setERelative();
    fab.fanOff();
    fab.autoHome();
    fab.setTemps(205, 55); // wait for nozzle & bed to heat up

    // your artifact here!

}

function draw() {
    background(255);
    fab.render();
}

function midiSetup() {
    // map midi values!
}

function midiDraw(moveCommand) {
    // do things with your midi values

    return moveCommand;
}