const button:HTMLButtonElement = document.getElementById("button") as HTMLButtonElement;
const link:HTMLButtonElement = document.getElementById("link") as HTMLButtonElement;

document.addEventListener("DOMContentLoaded", ()=>{
    button.addEventListener("click", ()=>{
        window.open("https://parliament.hcgov.uk", "_self");
    });

    link.addEventListener("click", ()=>{
        window.open("https://hackclub.enterprise.slack.com/archives/C08FA68NV2T", "_self");
    });
})