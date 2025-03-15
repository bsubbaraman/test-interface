import { GLOBAL_STATE } from "./state.js";
import { view } from "./views/view.js";
import { render } from "lit-html";
import { addEvents } from "./events/events.js";
import { evaluateJs, updatePreview } from "./repl";
import { setupMessages } from "./setupMessages.js";
import Split from "split.js";
import { initCodeMirror } from "./editor.js";
import { exampleSketch } from "../../examples/hollow-cube.js";
import { exampleFoam } from "../../examples/jerry-foam.js";
import { midiEx } from "../../examples/midi.js";

export function init() {
  render(view(GLOBAL_STATE), document.getElementById("root"));
  
  if (!navigator.serial) {
    alert(
      "🚨 Your browser doesn't seem to support the Web Serial API, which is required for p5.fab to be able to connect to machines. You can still use this editor to write code, but for full functionality, use Chrome or Edge version 89 or above."
    );
  }

  // Setup split panes
  var horizontalSplit = Split(['#left', '#right'], {
    sizes: [70, 30],
    minSize: 5,
    gutterSize: 15,
  });

  var leftVerticalSplit = Split(['.code-editor', '.machine-settings'], {
    direction: 'vertical',
    sizes: [93, 7],
    minSize: 5,
    gutterSize: 15,
    onDragStart: function () {
      addDragClass('.code-editor');
      addDragClass('.machine-settings');
    },
    onDragEnd: function () {
      removeDragClass('.code-editor');
      removeDragClass('.machine-settings');
     }
  });

  var rightVerticalSplit = Split(['.iframe-holder', '.video-settings', '.midi-content'], {
    direction: 'vertical',
    sizes: [100, 0, 0],
    minSize: 5,
    gutterSize: 15,
    onDragStart: function () {
      addDragClass('.iframe-holder');
      addDragClass('.midi-content');
      addDragClass('.video-settings');
    },
    onDragEnd: function () {
      removeDragClass('.iframe-holder');
      removeDragClass('.midi-content');
      removeDragClass('.video-settings');
     }
  });

  function addDragClass(elName) {
    var el = document.querySelector(elName);
    el.classList.add('dragged');
  }

  function removeDragClass(elName) {
    var el = document.querySelector(elName);
    el.classList.remove('dragged');
  }

  var paneManager = {
    'horizontalSplit': horizontalSplit,
    'leftVerticalSplit': leftVerticalSplit,
    'rightVerticalSplit': rightVerticalSplit,
  }


  GLOBAL_STATE.paneManager = paneManager;

  const codemirrorElement = document.querySelector(".code-editor");
  GLOBAL_STATE.codemirror = initCodeMirror(codemirrorElement);
  GLOBAL_STATE.sketchWindow = document.getElementById("preview").contentWindow;

  render(view(GLOBAL_STATE), document.getElementById("root"));

  setupMessages(GLOBAL_STATE);
  addEvents(GLOBAL_STATE);

  // TODO: local storage
  const saved = window.localStorage.getItem("p5.fab");
  GLOBAL_STATE.codemirror.view.dispatch({
    changes: { from: 0, insert: saved ?? exampleFoam} // change back to exampleSketch after Jerry/Jubilee tests
  });
}
