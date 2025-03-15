import { GLOBAL_STATE } from "./state.js";
import { Parser } from "acorn";
import { render } from "lit-html";
import { view } from "./views/view";
import { highlightSelection } from "./editor.js";

export function evaluateJs(code) {
    try {
        document.getElementById("preview").contentWindow.eval(code);
    }
    catch (error) {
        console.error(error);
    }
}

export function updatePreview(state, rerunSetup = false) {
    // reset error
    state.error = "";
    render(view(state), document.getElementById("root"));

    const code = state.codemirror.view.state.doc.toString();

    // Save the sketch to download with in a log
    var saveSketch = `
    try {
      _fab.sketch = \`${code}\`
    }
    catch (e) {}` 
    evaluateJs(saveSketch);
    
    // is there a better way to do this...?
    // inject try/catch loops here by iterating through the ast
    try {
        try {
            var ast = Parser.parse(code, { ecmaVersion: 2020 });
        }
        catch (e) {
            window.parent.postMessage({ type: "error", body: e.toString() })
        }
        var codeToEval = ''
        var nodeBody = '';
        for (const n in ast['body']) {
            var nodeBody = code.slice(ast['body'][n]['start'], ast['body'][n]['end']);
            if (ast['body'][n]['type'] == 'FunctionDeclaration') {
                let functionDeclaration = code.slice(ast['body'][n]['start'], ast['body'][n]['body']['start'] + 1);
                let functionBody = code.slice(ast['body'][n]['body']['start'] + 1, ast['body'][n]['end'] - 1);

                // post errors to be handled in setupMessages.js
                nodeBody = functionDeclaration + '\ntry {\n' + functionBody + '\n}\ncatch (e){\nwindow.parent.postMessage({ type: "error", body: e.toString() });\n}\n}\n'
            }
            // else { // for code written outside of functions
            //     nodeBody = '\ntry {\n' + nodeBody + '\n}\ncatch (e){\nwindow.parent.postMessage({ type: "error", body: e.toString() });\n}\n'
            // }
            codeToEval += nodeBody
        }


        state.sketchWindow.eval(codeToEval);
        state.sketchWindow.eval("_once = false;"); // to run fabDraw again

        // new p5 instance on startup
        if (!state.fabInit) {
            var newp5 = `new p5()`;
            state.fabInit = true;

            // post log values to display most recent gcode sent in web interface
            var forwardLog = `const originalLog = console.log;
                console.log = (...args) => {
                parent.window.postMessage({ type: 'log', args: args }, '*')
                originalLog(...args)
            };`
            state.sketchWindow.eval(forwardLog);
        }
        else {
            var newp5 = '';
            if (rerunSetup) { state.sketchWindow.eval(`setup()`) };
        }
        state.sketchWindow.eval(`${newp5}`);

        // Can't post entire fab object 
        // Instead post the relevant info

        // state.sketchWindow.eval(`window.parent.postMessage({ type: "log", body: fabOfInterest });`)

        // flash code
        highlightSelection(state.codemirror.view);
    }
    catch (e) {
        console.log(e);
    }

}