import * as load from "./load.js"

document.addEventListener("DOMContentLoaded", () => {

    getPsalter().then(psalter => {

        // Set Psalter as global
        window.psalter = psalter;

        // Set reset state for elements as global
        window.reset = {
            navLeft: document.querySelector(".nav-left").innerHTML,
            navRight: document.querySelector(".nav-right").innerHTML,
            splitNavTop: document.querySelector(".split-nav-top .split-nav-drop").innerHTML,
            splitNavBottom: document.querySelector(".split-nav-bottom .split-nav-drop").innerHTML,
            title: document.querySelector(".title-box").innerHTML,
            psalm: document.querySelector(".psalm-box").innerHTML
        };

        // Load page
        load.initial();
    })
})

async function getPsalter() {
    const psalter = await fetch("./src/data/psalter.json");
    return psalter.json()
}