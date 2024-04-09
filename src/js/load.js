import * as ui from "./ui.js"
import * as prefs from "./prefs.js"
import {addTransitions, scrollTop} from "./ui.js";

export function newNav(n) {

    window.navListeners = new AbortController();
    document.querySelectorAll(".nav-left").forEach(element => {
        if (n > 0) {
            element.classList.remove("hidden")
            element.addEventListener("click", () => {
                navigatePsalm(n - 1, window.navListeners)
            }, {signal: window.navListeners.signal})
        } else {
            element.classList.add("hidden")
        }
    })
    document.querySelectorAll(".nav-right").forEach(element => {
        if (n < 149) {
            element.classList.remove("hidden")
            element.addEventListener("click", () => {
                navigatePsalm(n + 1, window.navListeners)
            }, {signal: window.navListeners.signal})
        } else {
            element.classList.add("hidden")
        }
    })
}

export function newColors() {
    let root = document.documentElement;
    let colors = ["purple", "teal", "coral"];
    let select = Math.floor(Math.random() * 3);
    root.style.setProperty("--color-main", `var(--${colors[select]})`);
    root.style.setProperty("--color-soft", `var(--${colors[select]}-soft)`);
    root.style.setProperty("--color-dark", `var(--${colors[select]}-dark)`);
    root.style.setProperty("--color-clear", `var(--${colors[select]}-clear)`);
    
    let secondarySelect = select === 0 ? 2 : select - 1;
    root.style.setProperty("--color-secondary-main", `var(--${colors[secondarySelect]})`);
    root.style.setProperty("--color-secondary-soft", `var(--${colors[secondarySelect]}-soft)`);

    let tertiarySelect = select === 2 ? 0 : select + 1;
    root.style.setProperty("--color-tertiary-main", `var(--${colors[tertiarySelect]})`);
    root.style.setProperty("--color-tertiary-soft", `var(--${colors[tertiarySelect]}-soft)`);
}

export function newPsalm(n, s) {

    let text = window.psalter[n];

    // If psalm has sections, set s
    if (Array.isArray(text)) {
        if (!s) {
            s = 0;
        }
        // Get section from psalm
        text = text[s];
        // Add data to split nav header and show
        newSplitNav(n, s);
    }

    // If refrain, add
    let refrain = text.refrain ? text.refrain : null;
    if (refrain) {
        newContent("refrain", refrain)
    }

    // If 119, add parts and verses
    if (text.parts) {
        let parts = text.parts;
        for (let i in parts) {
            // Add heading
            newContent("heading", parts[i].heading)
            // Add verses
            let verses = newVerses(parts[i].verses)
            verses.forEach(verse => {
                newContent("verse", verse)
            })
        }
    } else {
        // Else add verses
        let verses = newVerses(text.verses)
        verses.forEach(verse => {
            newContent("verse", verse)
        })
    }

    // After psalm loaded, replace preferences
    prefs.setPrefs()
}

export function newSplitNav(n, s) {
    
    let psalmContainer = document.querySelector(".psalm");
    let splitNavDrop = document.querySelectorAll(".split-nav-drop *");
    let splitNavTop = document.querySelector(".split-nav-top");
    let splitNavBottom = document.querySelector(".split-nav-bottom");
    
    let sectionRefs = newSectionRefs(window.psalter[n])

    // Check if split nav already exists
    if (psalmContainer.classList.contains("split")) {
        // Get active
        let active = String(sectionRefs[s].replace(/&hairsp;–&hairsp;/g, ""));
        // Change active
        splitNavDrop.forEach(element => {
            for (let i = 0; i < sectionRefs.length; i++) {
                let current = String(element.innerHTML.replace(" – ", ""));
                if (current === active) {
                    element.classList.add("active")
                } else {
                    element.classList.remove("active")
                }
            }
        })
        return
    }

    // Add reference text
    document.querySelectorAll(".split-nav .expanding-block-text").forEach(element => {
        element.innerHTML = sectionRefs[s]
    })

    // Show and position elements
    psalmContainer.classList.add("split")

    splitNavTop.addEventListener("click", () => {
        psalmContainer.classList.add("top-open")
        ui.addTransitions()
        document.querySelector(".psalter").addEventListener("scroll", () => {
            psalmContainer.classList.remove("top-open")
        }, {once: true})
    })

    splitNavBottom.addEventListener("click", () => {
        psalmContainer.classList.add("bottom-open")
        ui.addTransitions()
        document.querySelector(".psalter").addEventListener("scroll", () => {
            psalmContainer.classList.remove("bottom-open")
        }, {once: true})
    })

    document.querySelectorAll(".split-nav-drop").forEach(element => {
        for (let i = 0; i < sectionRefs.length; i++) {
            window[`section${i}`] = newElement("span", `section-${i + 1}`, element);
            if (Number(i) === Number(s)) {
                window[`section${i}`].classList.add("active")
            }
            window[`section${i}`].innerHTML = `${sectionRefs[i]}`;
            window[`section${i}`].addEventListener("click", () => {
                document.querySelector(".psalm-box").innerHTML = window.reset.psalm;
                newPsalm(n, i);
                scrollTop("smooth")
            })
        }
    })
}

export function newVerses(items, startValue, endValue) {
    let start = startValue !== undefined ? startValue : Number(items[0].n);
    let end = Number.isInteger(endValue) ? endValue : Number(items[0].n) + items.length - 1;

    let verses = []
    for (let item of items) {
        let n = Number(item.n);
        if (n >= start && n <= end) {
            verses.push(Object.values(item))
        }
    }
    return verses;
}

export function newSectionRefs(psalm) {
    let refs = []
    for (let i = 0; i < psalm.length; i++) {
        if (psalm[i].verses) {
            refs.push(`${psalm[i].verses[0]["n"]}&hairsp;–&hairsp;${psalm[i].verses[psalm[i].verses.length - 1]["n"]}`)
        } else {
            refs.push(`${psalm[i].parts[0].verses[0]["n"]}&hairsp;–&hairsp;${psalm[i].parts[psalm[i].parts.length - 1].verses[psalm[i].parts[psalm[i].parts.length - 1].verses.length - 1]["n"]}`)
        }
    }
    return refs
}

export function newElement(elementType, className, parentNode, addBefore) {
    let element = document.createElement(elementType)
    element.classList.add(className)
    if (addBefore) {
        parentNode.insertBefore(element, addBefore)
    } else {
        parentNode.appendChild(element)
    }
    return element
}

export function newContent(category, content) {

    // Locate elements
    const psalmBox = document.querySelector(".psalm-box")
    const psalmSec = document.querySelector(".psalm-text")

    /* REFRAIN */

    if (category === "refrain") {
        const headingBox = document.querySelector(".heading")

        // Create refrain sections around psalm section
        let topRefrainSec;
        if (headingBox) {
            topRefrainSec = newElement("section", "top-refrain", psalmBox, headingBox)
        } else {
            topRefrainSec = newElement("section", "top-refrain", psalmBox, psalmSec)
        }
        const bottomRefrainSec = newElement("section", "bottom-refrain", psalmBox)

        // Create elements and add content
        const refrainHeading = newElement("h2", "refrain-heading", topRefrainSec)
        refrainHeading.innerHTML = "Refrain"
        const topRefrain = newElement("h3", "refrain", topRefrainSec)
        if (Array.isArray(content)) {
            topRefrain.innerHTML = content.join("<br/>")
        } else {
            topRefrain.innerHTML = content;
        }
        const bottomRefrain = newElement("h3", "refrain", bottomRefrainSec)
        bottomRefrain.innerHTML = topRefrain.innerHTML;

        /* HEADING */

    } else if (category === "heading") {

        // Create heading element and add content
        const psalmHeading = newElement("h2", "part-heading", psalmSec)
        psalmHeading.innerHTML = content;

        /* VERSE */

    } else if (category === "verse") {

        // Create verse number
        const verseDiv = newElement("div", "verse", psalmSec);
        const vnPara = newElement("p", "vn", verseDiv);
        vnPara.innerHTML = content[0];

        // Create verse element
        const vsDiv = newElement("div", "vs", verseDiv);

        // Create first half of verse
        if (Array.isArray(content[1])) {
            let line0 = newElement("p", "vi-1", vsDiv);
            line0.innerHTML = content[1][0];
            let i = 1;
            while (i < content[1].length) {
                let newLine = newElement("p", "vi-3", vsDiv);
                newLine.innerHTML = content[1][i];
                i++;
            }
        } else {
            let line = newElement("p", "vi-1", vsDiv);
            line.innerHTML = content[1];
        }

        // Create second half of verse
        if (Array.isArray(content[2])) {
            let line0 = newElement("p", "vi-2", vsDiv);
            line0.innerHTML = content[2][0];
            let i = 1;
            while (i < content[2].length) {
                let newLine = newElement("p", "vi-3", vsDiv);
                newLine.innerHTML = content[2][i];
                i++;
            }
        } else {
            let line = newElement("p", "vi-2", vsDiv);
            line.innerHTML = content[2];
        }
    }
}

export function resetPage() {
    ui.removeTransitions()
    document.querySelector(".book-drop").classList.remove("open")
    document.querySelector(".psalm").classList.remove("top-open")
    document.querySelector(".psalm").classList.remove("bottom-open")
    document.querySelectorAll(".nav-left").forEach(element => {
        element.innerHTML = window.reset.navLeft;
    })
    document.querySelectorAll(".nav-right").forEach(element => {
        element.innerHTML = window.reset.navRight;
    })
    document.querySelector(".split-nav-top .split-nav-drop").innerHTML = window.reset.splitNavTop;
    document.querySelector(".split-nav-bottom .split-nav-drop").innerHTML = window.reset.splitNavBottom;
    document.querySelector(".psalm-box").innerHTML = window.reset.psalm;
    document.querySelector(".title-box").innerHTM = window.reset.title;
    document.querySelector(".psalm").classList.remove("split")
}

export function initial() {

    // If URL parameter, go to psalm, else landing
    let params = new URLSearchParams(document.location.search);
    if (params.get("psalm")) {
        navigatePsalm(params.get("psalm") - 1);
        document.querySelector(".landing").classList.remove("open");
    }
    
    // Set landing psalm selectors and search
    document.querySelectorAll(".exp .expanding-block-title").forEach(element => {
        element.addEventListener("click", () => {
            addTransitions();
            if (element.closest(".exp").classList.contains("open")) {
                element.closest(".exp").classList.remove("open");
            } else {
                document.querySelectorAll(".exp").forEach(element => {
                    element.closest(".exp").classList.remove("open");
                })
                element.closest(".exp").classList.add("open");
                
            }
        })
    })
    document.querySelectorAll(".psalm-buttons .ps").forEach(element => {
        let n = Number(element.innerHTML) - 1
        element.addEventListener("click", () => {
            element.closest(".exp").classList.remove("open");
            navigatePsalm(n)
            document.querySelector(".landing").classList.remove("open");
        })
    })
    document.querySelector(".psalms .search").addEventListener("submit", event => {
        event.preventDefault();
        let search = document.querySelector(".psalms .search input").value;
        if (search < 1 || search > 150) {
            document.querySelector(".landing .psalms .error").classList.add("show");
        } else {
            navigatePsalm(search - 1);
            document.querySelector(".psalms .search input").value = "";
            document.querySelector(".landing .psalms .error").classList.remove("show");
            document.querySelector(".landing").classList.remove("open");
        }
    })
    
    // Set landing menu buttons
    document.querySelector(".welcome-about").addEventListener("click", () => {
        newModal(".about");
    })
    
    // Set landing header buttons
    document.querySelector(".header-info").addEventListener("click", () => {
        newModal(".info");
    })
    document.querySelector(".header-prefs").addEventListener("click", () => {
        newModal(".preferences");
    })

    // Set nav-book appearance listener
    let pageWidth =  Number(window.innerWidth);
    if (pageWidth > 769) {
        // Change image
        document.querySelector(".nav-home").innerHTML = document.querySelector(".nav-book").innerHTML
    }
    
    // Set nav-book
    document.querySelector(".nav-book").addEventListener("click", () => {
        document.querySelector(".book-drop").classList.add("open")
        document.addEventListener("scroll", () => {
            document.querySelector(".book-drop").classList.remove("open")
        }, {once: true})
    })

    // Set nav-to-top
    document.querySelector(".nav-to-top").addEventListener("click", () => {
        ui.scrollTop("smooth");
        console.log("yep")
    })

    // Set book-drop
    document.querySelector(".nav-home").addEventListener("click", () => {
        document.querySelector(".landing").classList.add("open")
        ui.scrollTop()
        document.querySelector(".book-drop").classList.remove("open")
    })
    document.querySelector(".nav-prefs").addEventListener("click", () => {
        newModal(".preferences");
        document.querySelector(".book-drop").classList.remove("open")
    })
    document.querySelector(".nav-info").addEventListener("click", () => {
        newModal(".info");
        document.querySelector(".book-drop").classList.remove("open")
    })

    // Set modal buttons
    document.querySelector(".modal-close-top").addEventListener("click", () => {
        ui.closeModal()
    })
    document.querySelector(".modal-close-bottom").addEventListener("click", () => {
        ui.scrollTop(document.querySelector(".modal-content"))
        setTimeout(ui.closeModal, 500)
    })

}

export function navigatePsalm(n) {
    if (window.navListeners) {
        window.navListeners.abort()
    }
    document.querySelector(".title-text").innerHTML = `Psalm ${n + 1}`;
    resetPage();
    newColors();
    newPsalm(n)
    newNav(n)
    ui.scrollTop()
    if (document.querySelector(".psalter").scrollHeight <= window.innerHeight) {
        document.querySelector(".nav-to-top").classList.remove("show");
    } else {
        document.querySelector(".nav-to-top").classList.add("show")
    }
}

export function newModal(selectors) {
    document.querySelector(".modal").classList.add("open")
    document.querySelector(selectors).classList.add("open")
}


