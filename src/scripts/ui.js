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

export const setMenuScroll = function checkIfExpandMenuNeedsScroll() {

  const dropMenuContent = $('nav.multi .drop').offsetWidth;
  const dropMenuWidth = $('nav.multi').offsetWidth - 160;

  if (dropMenuContent > dropMenuWidth) {
    $$('nav.multi .drop').forEach(element => {
      element.setAttribute('scroll', '');
    })
  } else {
    $$('nav.multi .drop').forEach(element => {
      element.removeAttribute('scroll');
    })
  }
}


export const setMenuScrollObservers = function addIntersectionObserverAndObserveDropMenu () {
  const root = document.documentElement;

  const menuObserver = new IntersectionObserver(entries => {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        if (entry.target === entry.target.parentNode.firstChild) {
          root.style.setProperty('--left-scroll', '');
        } else {
          root.style.setProperty('--right-scroll', '');
        }
      } else  {
        if (entry.target === entry.target.parentNode.firstChild) {
          root.style.setProperty('--left-scroll', 'var(--left-scroll-arrow)');
        } else {
          root.style.setProperty('--right-scroll', 'var(--right-scroll-arrow)');
        }
      }
    }
  }, {
    root: $('nav.multi .drop'),
    rootMargin: "0px -80px",
    threshold: 1.0,
  });

  $$('nav.multi .drop *:first-child, nav.multi .drop *:last-child').forEach(element => {
    menuObserver.observe(element);
  })

  setTimeout(() => {
    root.style.setProperty('--left-scroll', '');
  }, 500);

}

export const setMultiObserver = function addIntersectionObserverAndObserveMultiTop () {
  const multi = $('nav.multi');
  const intersectionPoint = $('.psalm-box *:first-child');

  const multiObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (window.innerWidth < 577) {
        if (!entry.isIntersecting) { // if going offscreen
          multi.style.top = `0`;
        } else {
          multi.style.top = '-3.75rem';
        }
      }
    })
  }, {
    rootMargin: '-250px 0px 0px 0px',
    threshold: 1,
  });

  multiObserver.observe(intersectionPoint);
}
