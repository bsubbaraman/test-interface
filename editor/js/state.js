export const GLOBAL_STATE = {
  // Editor
  codemirror: undefined,
  sketchWindow: undefined,
  paneManager: undefined,
  connected: false,
  fabInit: false,
  initialized: false,
  error: "",
  cameraConnected: false,
  // Check if a MIDI device is both plugged in & has established connection 
  midiDeviceAvailable: undefined,
  midiConnectionEstablished: undefined,
  midiData: "",
  fabDeviceConnected: false,
  fabConfig: undefined,
  mediaRecorder: null,
  mediaRecorderBlobs: [],
  mappedMidiData: {},
}