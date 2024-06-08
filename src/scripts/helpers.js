export const $ = document.querySelector.bind(document)
export const $$ = document.querySelectorAll.bind(document)

export const modal = $(".modal");

export const toCamel = function convertToCamelCase(string) {
  let words = string.split('-');
  
  if (words.length > 1) {
    let newString = [words[0]];
    let i = 1;
    while (i < words.length) {
      let chars = words[i].split('');
      chars[0] = chars[0].toUpperCase();
      newString.push(chars.join(''));
      i++;
    }
    return newString.join('');
  } else {
    return string;
  }
}

export const toKebab = function convertToKebabCase(string) {
  if (string.toLowerCase() !== string || /\d/.test(string)) {
    string.split('');
    let newString = [string[0]];
    let i = 1;
    while (i < string.length) {
      if (string[i].toLowerCase() !== string[i]) {
        newString.push(`-${string[i].toLowerCase()}`);
      } else if (/\d/.test(string[i]) && !/\d/.test(string[i - 1])) {
        newString.push(`-${string[i]}`);
      } else {
        newString.push(`${string[i]}`);
      }
      i++;
    }
    return newString.join('');
  } else
  {
    return string;
  }
}

export const replaceText = function replaceTextInElement(element, replacement) {
  element.innerHTML = replacement;
}

export const modifyText = function modifyTextInElement(element, options) {
  element.innerHTML = `${element.innerHTML.slice(0, options[0])}${options[1]}`
}

// don't know if this will work, check!
export const isActive = element => element.classList.contains("active");

export const addActive = function addActiveClass(element) {
  element.classList.add("active")
}
export const removeActive = function removeActiveClass(element) {
  element.classList.remove("active")
}

export const isOpen = element => element.classList.contains("open");

export const addOpen = function addOpenClass(element) {
  element.classList.add("open")
}
export const removeOpen = function removeOpenClass(element) {
  element.classList.remove("open")
}

export const addHidden = function addHiddenClass(element) {
  element.classList.add("hidden")
}
export const removeHidden = function removeHiddenClass(element) {
  element.classList.remove("hidden")
}

export const addExpanded = function addExpandedClass(element) {
  element.setAttribute('expanded', '');
}
export const removeExpanded = function removeExpandedClass(element) {
  element.removeAttribute('expanded');
}

export const addSplit = function addSplitClass() {
  if ($('.psalter')) {
    $(".psalm").setAttribute('split', '');
  }
  else {
    $(".office").setAttribute('split', '');
  }
}
export const removeSplit = function removeSplitClass() {
  if ($('.psalter')) {
    $(".psalm").removeAttribute('split');
  }
  else {
    $(".office").removeAttribute('split');
  }
}

export function addElement(elementType, className, parentNode, addBefore) {
  const element = document.createElement(elementType)
  if (className.includes(" ")) {
    let splitClass = className.split(" ");
    for (let i in splitClass) {
      element.classList.add(splitClass[i]);
    }
  } else {
    element.classList.add(className);
  }
  if (addBefore) {
    parentNode.insertBefore(element, addBefore);
  } else {
    parentNode.appendChild(element);
  }
  return element;
}

export async function fetchJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

export const selectLast = function selectLastNode(rootNode, selector) {
  const list = rootNode.querySelectorAll(selector);
  return list.item(list.length - 1);
}



/*
export const fetchJSON = async function fetchJSONData(path) {
  return fetch(path)
  .then(response => response.json());
}

export const getJSON = async function getJSONData(path) {
  const data =
  return await fetchJSON(path);
}
*/