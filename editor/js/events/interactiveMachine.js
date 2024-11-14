import { evaluateJs } from "../repl";

export function homeMachine() {
    evaluateJs("_fab.runGCodeCommand('G28')");
}