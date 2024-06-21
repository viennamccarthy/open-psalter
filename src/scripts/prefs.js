import {
  $,
  $$,
  toCamel,
  toKebab,
  isActive,
} from './helpers.js'

import { divineName, pronouns, king, messianic } from '../data/preferences.js';

export const setPreferences = function setPreferencesInPsalm(option, choice) {
  
  if (option === 'pronounCaps') {
    if (choice === 'disabled') {
      $$(".psalm-box").forEach(element => {
        element.classList.remove("pn-caps-enabled");
      })
      if ($('.modal-content')) {
        $(".modal-content").classList.remove("pn-caps-enabled");
      }
    } else {
      $$(".psalm-box").forEach(element => {
        element.classList.add("pn-caps-enabled");
      })
      if ($('.modal-content')) {
        $(".modal-content").classList.add("pn-caps-enabled");
      }
    }
  } else {
    const choiceDict = option === 'divineName' ? divineName[choice]
      : option === 'pronouns' ? pronouns[choice]
      : option === 'king' ? king[choice]
      : option === 'messianic' ? messianic[choice]
      : null;
    if (!choiceDict) {
      console.error('Invalid preference selection:' + choiceDict);
      return;
    }
    for (let key in choiceDict) {
      if (typeof(choiceDict[key]) === "object") {
        $$(`.${toKebab(key)}`).forEach(element => {
          element.innerHTML = `${element.innerHTML.slice(0, choiceDict[key][0])}${choiceDict[key][1]}`;
        })
      } else {
        $$(`.${toKebab(key)}`).forEach(element => {
          element.innerHTML = choiceDict[key];
          if (option === 'divineName') {
            if (choice === 'tetraHebrew') {
              element.classList.add('tetra-hebrew');
            } else {
              element.classList.remove('tetra-hebrew');
            }
          }
        })
      }
    }
  }
}

export const savePreference = function setPreferenceInStorageAndPageOnClick(button) {

  let option = toCamel(button.dataset.option);
  let choice = button.dataset.choice ? button.dataset.choice :
    isActive(button) ? 'enabled' :
    'disabled';

  if (choice === button.dataset.choice) {
    choice = toCamel(choice);
  }

  switch (option) {
    case 'divineName':
      localStorage.divineName = choice;
      break;
    case 'pronouns':
      localStorage.pronouns = choice;
      break;
    case 'king':
      localStorage.king = choice;
      break;
    case 'messianic':
      localStorage.messianic = choice;
      break;
    case 'pronounCaps':
      localStorage.pronounCaps = choice;
      break;
    default:
  }

  setPreferences(option, choice);
}

export const loadPreferences = function getAllPreferencesAndSet() {
  // Divine Name
  if (localStorage.divineName && localStorage.divineName !== "god") {
    setPreferences('divineName', localStorage.divineName);
  }

  // Pronouns
  if (localStorage.pronouns && localStorage.pronouns !== "god") {
    setPreferences('pronouns', localStorage.pronouns);
  }

  // King
  if (localStorage.king && localStorage.king !== "messianic") {
    setPreferences('king', localStorage.king);
  }

  // Other options
  if (localStorage.messianic && localStorage.messianic === 'disabled') {
    setPreferences('messianic', 'disabled');
  }

  if (localStorage.pronounCaps && localStorage.pronounCaps === 'disabled') {
    setPreferences('pronounCaps', 'disabled');
  }
}