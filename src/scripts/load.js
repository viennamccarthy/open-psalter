import {
  $,
  $$,
  addActive,
  addExpanded,
  removeActive,
  removeExpanded
} from './helpers.js'
import {openModal} from "./modal.js";
import {setMenuScroll} from "./ui.js";

export const setSearch = function setSearchElement(element) {
  const searchForm = element;
  const searchInput = element.querySelector('input');
  const searchButton = element.querySelector('button') || false;

  searchInput.addEventListener("beforeinput", event => {
    let inputNumber = Number(event.data);
    if (event.data === null) {
      // Do nothing
    } else if (!inputNumber && inputNumber !== 0) {
      event.preventDefault();
    } else if (!event.target.value && inputNumber === 0) {
      event.preventDefault();
      searchInput.value = '';
    } else if (Number(event.target.value + inputNumber) > 150) {
      event.preventDefault();
    }
  })
  searchInput.addEventListener("input", event => {
    if (searchButton) {
      if (event.target.value) {
        addActive(searchButton);
      } else {
        removeActive(searchButton);
      }
    }
  })
  searchInput.addEventListener('compositionend', event => {
    console.log(event.data);
  });
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    let psalmNumber = searchInput.value;
    if (psalmNumber < 1 || psalmNumber > 150) {
      searchInput.value = '';
    } else {
      window.location.href = `./psalter.html?n=${psalmNumber}`;
    }
  })
}

export const setIndexButtons = function setIndexButtonsOnLoad() {

  // Set landing psalm selectors
  $$(".expand-block .title").forEach(element => {
    element.addEventListener("click", () => {
      if (element.closest(".expand-block").classList.contains("expanded")) {
        removeExpanded(element.closest(".expand-block"));
      } else {
        $$(".expand-block").forEach(element => {
          removeExpanded(element.closest(".expand-block"));
        })
        addExpanded(element.closest(".expand-block"));
      }
    })
  })

  // Set search elements
  setSearch($('.psalm-nav .search'));
  setSearch($('footer .search'));

  // Set landing office buttons
  $(".office-nav .morning").addEventListener("click", () => {
    window.location.href = './lectionary.html?o=morning';
  })
  $(".office-nav .evening").addEventListener("click", () => {
    window.location.href = './lectionary.html?o=evening';
  })

  /* TODO fix these
    // Set landing menu buttons
    $(".welcome-about").addEventListener("click", () => {
      openModal('about');
    })

    // Set landing header buttons
    $("header .info").addEventListener("click", () => {
      openModal('info');
    })

    $("header .preferences").addEventListener("click", () => {
      openModal('preferencesPanel');
    })
 */
}

export const setIndexNav = function setIndexNavListenerOnLoad() {
  const indexNav = $('header');
  const intersectionPoint = $('header + * * *:first-child');
  const headerHeight = $('header').offsetHeight;

  const indexObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) { // if going offscreen
        document.documentElement.style.setProperty("--shadow-delay", '250ms');
        indexNav.classList.add('sticky');
      } else {
        document.documentElement.style.setProperty("--shadow-delay", '1ms');
        indexNav.classList.remove('sticky');
      }
    })
  }, {
    rootMargin: `-${headerHeight}px 0px 0px 0px`,
    threshold: 1,
  });

  indexObserver.observe(intersectionPoint);
}

export const setPsalterButtons = function setPsalterButtonsOnLoad() {
  $(".title-box .preferences").addEventListener("click", () => {
    openModal('preferencesPanel');
  })
}

export const getPsalmParam = function getPsalmFromURLParams() {
  const params = new URLSearchParams(document.location.search);
  const paramNumber = params.get('n');
  if (paramNumber && paramNumber > 0 && paramNumber < 151) {
    $('psalm-card').setAttribute('number', String(paramNumber));
  } else {
    $('psalm-card').setAttribute('number', '1');
  }
}

export const setListener = function activateEventListenerOnElement(option) {

  switch (option) {
    case 'menuScroll':
      let delay = false;
      window.addEventListener('resize', () => { // https://bencentra.com/code/2015/02/27/optimizing-window-resize.html
        clearTimeout(delay);
        delay = setTimeout(setMenuScroll, 500);
      })
      break;

  }
}

export const setHistory = function setPsalmReadingHistory(psalmNumber) {
  if (localStorage.historyDisabled === true) {
    return;
  }

  const timeout = setTimeout(() => {
    const newPsalmNumber = $('psalm-card').getAttribute('number');
    if (psalmNumber === newPsalmNumber && !document.hidden) {
      if (!localStorage.history) {
        localStorage.history = {};
      }
      localStorage.history[psalmNumber]++;
    }
  }, 60000);

  return timeout;
}

export const loadHistory = function loadPsalmReadingHistoryIntoIndex() {
  if (localStorage.history && localStorage.historyDisabled !== true) {
    for (const [key, value] of Object.entries(localStorage.history)) {
      // Change green (93, 34%, 40%) to brick (15, 23%, 47%)
      const h = 93 - value * 7.8;
      const s = 34 - value * 1.1;
      const l = 40 + value * 0.7;

      $(`#${key}`).style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
}