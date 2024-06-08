import {
  $,
  $$,
  addActive,
  addExpanded,
  removeActive,
  removeExpanded
} from './helpers.js'
import {openModal} from "./modal.js";

export const setLandingButtons = function setLandingButtonsOnLoad() {

  // Set landing psalm selectors and search
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
  $(".psalm-nav .search input").addEventListener("beforeinput", event => {
    let inputNumber = Number(event.data);
    if (event.data === null) {
      // Do nothing
    } else if (!inputNumber && inputNumber !== 0) {
      event.preventDefault();
    } else if (!event.target.value && inputNumber === 0) {
      event.preventDefault();
      $(".psalm-nav .search input").value = '';
    } else if (Number(event.target.value + inputNumber) > 150) {
      event.preventDefault();
    }
  })
  $(".psalm-nav .search input").addEventListener("input", event => {
    if (event.target.value) {
      addActive($('.psalm-nav .search button'));
    } else {
      removeActive($('.psalm-nav .search button'));
    }
  })
  $(".psalm-nav .search").addEventListener("submit", event => {
    event.preventDefault();
    let psalmNumber = $(".psalm-nav .search input").value;
    if (psalmNumber < 1 || psalmNumber > 150) {
      $(".psalm-nav .search input").value = '';
    } else {
      window.location.href = `./psalter.html?n=${psalmNumber}`;
    }
  })

  // Set landing office buttons
  $(".office-nav .morning").addEventListener("click", () => {
    window.location.href = './lectionary.html?o=morning';
  })
  $(".office-nav .evening").addEventListener("click", () => {
    window.location.href = './lectionary.html?o=evening';
  })


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
    //setPsalm(params.get("n") - 1);
  } else {
    //setPsalm(0);
    $('psalm-card').setAttribute('number', '1');
  }
}