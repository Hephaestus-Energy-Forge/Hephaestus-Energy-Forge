function initThebelab() {
    let activateButton = document.getElementById("thebelab-activate-button");
    if (activateButton.classList.contains('thebelab-active')) {
        return;
    }
    thebelab.bootstrap();
    // Run all thebelab cells marked as initialization code
    setTimeout(function() {
        let initDivs = document.getElementsByClassName("thebelab-init-code");
        for(var i = 0; i < initDivs.length; i++) {
            // div.thebelab-init-code > div.thebelab-cell > button.thebelab-run-button
            let runButton = initDivs[i].firstElementChild.childNodes[1]
            runButton.click();
        }
    }, 500)
    activateButton.classList.add('thebelab-active')
}