import templateHTML from "./src/templates/main.html!text"

export async function render() {
    // this function just has to return a string of HTML
    // you can generate this using js, e.g. using Mustache.js

    return `
    
    <h2 class='tide-title'>Along the Gulf Coast, the tide is up to six feet above normal levels</h2>
    <div class='tide-container'>
    
    <div class='tide-container-inner'></div>

    <span class='tide-source'>Source: NOAA</span>
    
    </div>
    `
}