import templateHTML from "./src/templates/main.html!text"

export async function render() {
    // this function just has to return a string of HTML
    // you can generate this using js, e.g. using Mustache.js

    return `
    
    <h2 class='tide-title'>The tide is up to six feet above normal levels along the Gulf Coast</h2>

    <iframe src='https://interactive.guim.co.uk/uploader/embed/2018/10/archive-zip/giv-3902g4I1pc3BGmLP/' class='tide-iframe'>
    </iframe>

    <div class='tide-container'>
    
    <div class='tide-container-inner'></div>

    <span class='tide-source'>Source: NOAA</span>
    
    </div>
    `
}