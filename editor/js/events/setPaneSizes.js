import { GLOBAL_STATE } from "../state";

export function setPaneSizes(e) {
    const elId = e.srcElement.id.trim();
    console.log(elId);
    var pm;
    var idxToChange = 0;
    switch (elId) {
        case "machine-settings":
            pm = GLOBAL_STATE.paneManager['leftVerticalSplit'];
            break;
        case "video-content":
            pm = GLOBAL_STATE.paneManager['rightVerticalSplit'];
            idxToChange = 1;
            break;
        case "midi-content":
            pm = GLOBAL_STATE.paneManager['rightVerticalSplit'];
            idxToChange = 2;
            break;
        default:
            console.log('Unknown');
    }

    const sizes = pm.getSizes();
    var closedThreshold = 10;

    switch (idxToChange) {
        // Open if closed, close if open
        case 0:
            // machine settings clicked
            if (sizes[1] < closedThreshold) {
                pm.setSizes([75, 25]);
            }
            else {
                pm.setSizes([93, 7]);
            }
            break
        case 1:
            // video clicked
            if (sizes[1] < closedThreshold && sizes[2] > closedThreshold) {
                pm.setSizes([40, 30, 30]);
            }
            else if (sizes[1] < closedThreshold && sizes[2] < closedThreshold) {
                pm.setSizes([70, 30, 0]);
            }
            else if (sizes[1] > closedThreshold && sizes[2] < closedThreshold) {
                pm.setSizes([100, 0, 0]);
            }
            else if (sizes[1] > closedThreshold && sizes[2] > closedThreshold) {
                pm.setSizes([60, 0, 40]);
            }
            console.log(pm.getSizes());
            break
        case 2:
            // midi clicked
            if (sizes[2] < closedThreshold && sizes[1] > closedThreshold ) {
                pm.setSizes([40, 30, 30]);
            }
            else if (sizes[2] < closedThreshold && sizes[1] < closedThreshold){
                pm.setSizes([60, 0, 40]);
            }
            else if (sizes[2] > closedThreshold && sizes[1] < closedThreshold) {
                pm.setSizes([100, 0, 0]);
            }
            else if (sizes[2] > closedThreshold && sizes[1] > closedThreshold) {
                pm.setSizes([100-sizes[1], sizes[1], 0]);
            }
            console.log(pm.getSizes());
            break
    }
    // if (leftSideFlag) {
        
    // }
    // else {
    //     // Right side has 3 panes

    // }
    


}