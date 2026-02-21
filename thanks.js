"use strict";
const button = document.getElementById("button");
const link = document.getElementById("link");
document.addEventListener("DOMContentLoaded", () => {
    button.addEventListener("click", () => {
        window.open("https://parliament.hcgov.uk", "_self");
    });
    link.addEventListener("click", () => {
        window.open("https://hackclub.enterprise.slack.com/archives/C08FA68NV2T", "_self");
    });
});
