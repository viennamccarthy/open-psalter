import {$, $$, addExpanded, removeExpanded} from './helpers.js'

export const addTransitions = function addCSSTransitions() {
  //$(".psalm-box").style.transition = "all 500ms ease";
  $$(".expand-menu .arrow").forEach(element => {
    element.style.transition = "all 500ms ease";
  })
}

export const scrollTop = function scrollToPageTop(transition, location) {
  if (transition === "instant") {
    window.scrollTo({top: 0, behavior: "instant"})
  } else {
    window.scrollTo({top: 0, behavior: "smooth"})
  }
  if (location) {
    location.scrollTo({top: 0, behavior: transition})
  }
}

export const setColors = function setColorsOnLoad() {
  const root = document.documentElement;
  const colors = ["purple", "teal", "coral"];
  const select = Math.floor(Math.random() * 3);
  root.style.setProperty("--color-primary-main", `var(--${colors[select]})`);
  root.style.setProperty("--color-primary-soft", `var(--${colors[select]}-soft)`);
  root.style.setProperty("--color-primary-dark", `var(--${colors[select]}-dark)`);
  root.style.setProperty("--color-primary-translucent", `var(--${colors[select]}-translucent)`);

  const secondarySelect = select === 0 ? 2 : select - 1;
  root.style.setProperty("--color-secondary-main", `var(--${colors[secondarySelect]})`);
  root.style.setProperty("--color-secondary-soft", `var(--${colors[secondarySelect]}-soft)`);
  root.style.setProperty("--color-secondary-dark", `var(--${colors[secondarySelect]}-dark)`);
  root.style.setProperty("--color-secondary-translucent", `var(--${colors[secondarySelect]}-translucent)`);

  const tertiarySelect = select === 2 ? 0 : select + 1;
  root.style.setProperty("--color-tertiary-main", `var(--${colors[tertiarySelect]})`);
  root.style.setProperty("--color-tertiary-soft", `var(--${colors[tertiarySelect]}-soft)`);
  root.style.setProperty("--color-tertiary-dark", `var(--${colors[tertiarySelect]}-dark)`);
  root.style.setProperty("--color-tertiary-translucent", `var(--${colors[tertiarySelect]}-translucent)`);
}

export const toggleExpandMenu = function expandMenuToFullHeight() {
  let element = $('nav.multi:not(:last-child)');

  if (!element.getAttributeNames().includes('expanded')) {
    element.style.position = 'relative';
    element.style.top = `-${element.offsetHeight - 96}px`;
    addExpanded(element);
    window.addEventListener("scroll", () => {
      element.style.top = null;
      removeExpanded(element);
      setTimeout(() => {
        element.style.position = null;
      }, 500);
    }, {once: true})
  } else {
    element.style.top = null;
    removeExpanded(element);
    setTimeout(() => {
      element.style.position = null;
    }, 500);
  }
}

export const closeExpandMenu = function closeExpandedMenu() {
  let element = $('nav.multi:not(:last-child)');

  element.style.top = null;
  removeExpanded(element);
  setTimeout(() => {
    element.style.position = null;
  }, 500);
}