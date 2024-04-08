export function addTransitions() {
    document.querySelector(".psalm-box").style.transition = "all 500ms ease";
    document.querySelector(".split-nav-top").style.transition = "all 500ms ease";
    document.querySelector(".split-nav-bottom").style.transition = "all 500ms ease";
    document.querySelector(".split-nav-top .expanding-block-arrow").style.transition = "all 500ms ease";
}

export function removeTransitions() {
    document.querySelector(".psalm-box").style.transition = null;
    document.querySelector(".split-nav-top").style.transition = null;
    document.querySelector(".split-nav-bottom").style.transition = null;
    document.querySelector(".split-nav-top .expanding-block-arrow").style.transition = null;
}

export function scrollTop(option) {
    if (option === "smooth") {
        window.scrollTo({top: 0, behavior: "smooth"})
    } else if (option) {
        option.scrollTo({top: 0, behavior: "smooth"})
    } else {
        window.scrollTo({top: 0, behavior: "instant"})
    }
}

export function closeModal() {
    document.querySelector(".modal").style.transitionDelay = "1000ms";
    document.querySelector(".modal").classList.remove("open")
    setTimeout(() => {
        document.querySelector(".modal").style.transitionDelay = null;
    }, 500)
}