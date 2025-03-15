// based on Hannah Twigg-Smith's playground https://github.com/branchwelder/playground
import { evaluateJs, updatePreview } from "./repl";
import { checkMidiDevices } from "./events/checkMidiDevices";
import { GLOBAL_STATE } from "./state";
import { render } from "lit-html";
import { view } from "./views/view";

export function setupMessages(state) {
    window.addEventListener("message", function (e) {
        var message = e.data;
        var messageType = message.type;
        var messageBody = message.body;

        // handle info from the p5 friendly error system
        function handleFES() {
            if (messageBody.includes('p5 says:')) { // this is how all p5 FES messages start
                // store this info somewhere
            }
        }

        switch (messageType) {
            case 'log':
                // Routing some custom messages from the iframe here
                var messageLabel = message.args[0];
                var messageData = message.args[1];
                switch (messageLabel) {
                    case "MIDI_PORT_CHANGE":            // when midi devices plugged into/out of usb port
                        state.midiDeviceAvailable = messageData.connected;
                        break;
                    case "MIDI_CONNECTION_CHANGE":      // when connecting to a webmidi device
                        state.midiConnectionEstablished = messageData.connected;
                        break;
                    case "MIDI_DATA":                   // when midi data arrives
                        state.midiData = messageData.midiData;
                        break;
                    case "MAPPED_MIDI_DATA":          // mapped values
                        state.mappedMidiData = messageData.test;
                        break;
                    case "FAB_CONNECTION_CHANGE":       // when connect/disconnect to webserial device
                        state.fabDeviceConnected = messageData.connected;
                        break;
                    case "FAB_CONFIG":                  // when a new fab device configuration is set
                        state.fabConfig = messageData;
                        break;
                    case "FAB_CONFIG_CHANGE":           // when an individual fab property is updated
                        state.fabConfig[messageData.property] = messageData.value;
                        break;
                    default:
                        // console.log(message);
                        break;
                }
                render(view(state), document.getElementById("root"));
                break;
            case 'error':
                GLOBAL_STATE.error = e.data.body;
                console.log(e);
                render(view(GLOBAL_STATE), document.getElementById("root"));
                break;
            case 'ready':
                if (state.initialized) return;
                if (
                    document.readyState === "complete" ||
                    document.readyState === "loaded"
                ) {
                    GLOBAL_STATE.initialized = true;
                    console.log("Sketch frame is ready");
                    checkMidiDevices();
                    updatePreview(state);
                } else {
                    console.log('adding event listener');
                    window.addEventListener("DOMContentLoaded", init, { once: true });
                }
        }
    });
}