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

export const isActive = element => element.classList.contains("active");

export const addActive = function addActiveClass(element) {
  element.classList.add("active")
}
export const removeActive = function removeActiveClass(element) {
  element.classList.remove("active")
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

export async function fetchJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

export const selectLast = function selectLastNode(rootNode, selector) {
  const list = rootNode.querySelectorAll(selector);
  return list.item(list.length - 1);
}