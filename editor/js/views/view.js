// import { dispatch } from "./dispatch.js";
import { html } from "lit-html";
import { GLOBAL_STATE } from "../state";
import { setExample } from "../events/setExample";
import { saveSketch } from "../events/saveSketch";
import { setPaneSizes } from "../events/setPaneSizes";
import { connectToMachine } from "../events/connectToMachine";
import { connectToMidi } from "../events/connectToMidi";
import { connectToCamera } from "../events/connectToCamera";
import { startPrint } from "../events/startPrint";
import { stopPrint } from "../events/stopPrint";
import { evaluateJs, updatePreview } from "../repl";
import { setPrinter } from "../events/setPrinter";
// import { _midiController } from "../../../lib/midi";


export function view(state) {
  return html`
    ${topMenu(state)}

    <div class="outer">
      <div id="left" class="split-horizontal">
        <div class="code-editor">
          ${state.error !== "" ? html`<div id="error-log">${state.error}</div>` : ""}
        </div>
        ${machineSettings(state)}
      </div>

      <div id="right" class="split-horizontal">
        <div class="iframe-holder">
          <iframe id="preview" src="./examples/preview.html"></iframe>
        </div>
       ${videoSettings(state)}
       ${midiSettings(state)}
      </div
    </div>
    `
}

// Dividing up into smaller chunks of html
const topMenu = state => html`
    <div class="top-menu">
          <div class="left">
            <span class="logo">p5.fab</span>
            <div class="menu-item-icon" @click="${() => setExample('new')}"><i class="fa-solid fa-file"></i></div>
            <div class="menu-item-icon" @click="${saveSketch}"><i class="fa-solid fa-download"></i></div>
            <label for="file-upload" class="menu-item-icon"><i class="fa-solid fa-upload"></i></label>
            <input id="file-upload" type="file" />
            <div class="menu-item-icon"><i class="fa-solid fa-book"></i>
              <div class="menu-item-dropdown-content">
                <i @click="${() => setExample('cube')}">cube</i>
                <i @click="${() => setExample('2point5D-sketching')}">2.5D sketching</i>
                <i @click="${() => setExample('line-vase')}">line vase</i>
                <i @click="${() => setExample('midiEx')}">interactive cube</i>
                <i @click="${() => setExample('etch-a-sketch')}">etch-a-sketch</i>
                <i @click="${() => setExample('ripple')}">ripple texture</i>
                <i @click="${() => setExample('nonplanar')}">non-planar vase</i>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="menu-item-icon" @click="${() => updatePreview(state)}"><i class="fa-solid fa-play"></i></div>
            <div class="menu-item-icon" id="run-sketch" @click="${() => updatePreview(state, true)}"><i class="fa-solid fa-rotate-right"></i></div> 
            <div class="menu-item-icon" @click="${setPaneSizes}"><i id="machine-settings" class="fa-solid fa-gear"></i></div> 
            <div class="menu-item-icon" @click="${setPaneSizes}"><i id="midi-content" class="fa-solid fa-music"></i></div>
            <div class="menu-item-icon" @click="${setPaneSizes}"><i id="video-content" class="fa-solid fa-video"></i></div>
            <a href="https://github.com/machineagency/p5.fab" target="_blank" rel="noopener noreferrer"
              class="menu-item-icon"><i class="fa-brands fa-github"></i></a>
            <!-- <div class="menu-item" onclick="showInfoModal()">info</div> -->
            <!-- <div class="menu-item">tweet artifact</div> -->
          </div>
    </div>
`;

const machineSettings = state => html`
    <div class="machine-settings">
    <h3 class="panel-header"> Machine </h3>
      <div class="menu-item" id="button" @click="${connectToMachine}">connect</div>
      <div class="menu-item" id="button" @click="${startPrint}">start print</div>
      <div class="menu-item" id="button" @click="${stopPrint}">stop print</div>
      <div class="menu-item" id="button">set printer
              <div class="menu-item-dropdown-content">
                <i @click="${() => setPrinter(state, 'ender3-pro')}">Ender3-Pro</i>
                <i @click="${() => setPrinter(state, 'jubilee')}">Jubilee</i>
                <i @click="${() => setPrinter(state, 'q5')}">FLSun Q5</i>
              </div>
            </div>
      <p>Connection Status: <span id="connection-status">${state.fabDeviceConnected ? "Connected" : "Not Connected"}</span> </p>
      ${state.fabConfig ? html`
        <!-- <details>
        <summary>Printer details</summary>
        <ul>
          <li> maxX: ${state.fabConfig.maxX} </li>
          <li> maxY: ${state.fabConfig.maxY} </li>
          <li> maxZ: ${state.fabConfig.maxZ} </li>
          <li> nozzle diameter: ${state.fabConfig.nozzleDiameter} </li>
          <li> filament diameter: ${state.fabConfig.filamentDiameter} </li>
        </ul>
        </details> -->`
    : ""}
     
    </div>
`;

const midiSettings = state => html`
    <div class="midi-content">
      <h3 class="panel-header"> MIDI </h3>
      <div class="menu-item" id="button" @click="${connectToMidi}">connect</div>
      <p id="midi-connection-status">
        ${state.midiDeviceAvailable && state.midiConnectionEstablished ? "Status: Connected" : "Status: Not Connected"}
      </p>
 <p id="midi-data">
        ${state.midiData !== "" && state.midiDeviceAvailable && state.midiConnectionEstablished ? html`<div id="midi-incoming-data">
            Note:  ${state.midiData.note} <br>
            Value: ${state.midiData.value} <br>
            Type: ${state.midiData.type} <br>
            ${Object.keys(state.mappedMidiData).map(propt => html`
              ${propt}: ${state.mappedMidiData[propt]} <br>
            `)}
        </div>` : ""}        
      </p>
    </div>
`;

const videoSettings = state => html`
    <div class="video-settings">
    <h3 class="panel-header"> Video </h3>
      <div class="menu-item" id="button" @click="${connectToCamera}">connect</div>
      <br><br>
  ${!state.cameraConnected ? "" : 
  html`<div class="select">
    <label for="video-source">Video source: </label>
    <br>
    <select id="video-source"></select>
    </div>
`}

      <video id="camera-stream" autoplay></video>
    </div>
`;


