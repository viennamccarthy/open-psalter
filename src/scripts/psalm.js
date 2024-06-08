import {
  $,
  $$,
  addActive,
  addExpanded,
  addHidden,
  fetchJSON,
  removeActive,
  removeExpanded,
  removeHidden, selectLast,
} from './helpers.js'
import {loadPreferences} from "./prefs.js";
import {addTransitions, scrollTop, setColors, toggleExpandMenu} from "./ui.js";

// Do I really need both of these functions????

// Searches through a psalm, returns only the requested verses
const findVerses = function findVersesInPartialPsalm(firstVerse, lastVerse, versesArray) {
  for (let range of versesArray) {
    let lower = range.start || range.single;
    if (lower >= firstVerse && lower <= lastVerse) {
      return true;
    } else if (range.end) {
      if (range.end >= firstVerse && range.end <= lastVerse) {
        return true;
      }
    }
  }
  return false;
}

// Finds verses that are
export const setVerses = function setVersesInText(versesDict, versesArray) {

  const checkRange = function checkIfVerseInRange(number, versesArray) {
    for (let range of versesArray) {
      if (range.single && number === +range.single) {
        return true;
      } else if (number >= +range.start && number  <= +range.end) {
        return true;
      }
    }
    return false;
  }

  let verses = []
  for (let verse of versesDict) {
    let n = +verse.n;
    if (versesArray) {
      if(checkRange(n, versesArray)) {
        verses.push(Object.values(verse));
      }
    } else {
      verses.push(Object.values(verse));
    }
  }
  return verses;
}

// Loads psalm into a given psalm-box element
const setPsalmText = function setPsalmTextInBox(thisPsalm, text, versesArray) {

  // If refrain, add
  if (text.refrain) {
    addPsalmContent(thisPsalm, "refrain", text.refrain);
  }

  // If 119, add parts and verses
  if (text.parts) {
    for (let part of text.parts) {

      // If psalm is partial, continue if verses are not in this part
      if (versesArray) {
        let firstVerse = +part.verses.at(0).n;
        let lastVerse = +part.verses.at(-1).n;

        if (!findVerses(firstVerse, lastVerse, versesArray)) {
          continue;
        }
      } else {
        // If not partial, add heading
        addPsalmContent(thisPsalm, "heading", part.heading);
      }

      // Add verses
      let verses;
      if (versesArray) {
        verses = setVerses(part.verses, versesArray)
      } else {
        verses = setVerses(part.verses);
      }
      verses.forEach(verse => {
        addPsalmContent(thisPsalm, "verse", verse);
      })
    }
  } else {
    // Else add verses
    let verses;
    if (versesArray) {
      verses = setVerses(text.verses, versesArray);
    } else {
      verses = setVerses(text.verses);
    }
    verses.forEach(verse => {
      addPsalmContent(thisPsalm, "verse", verse);
    })
  }
  // After psalm loaded, replace preferences
  loadPreferences();
}

// A custom element for the psalm, that will change its contents according to the attributes given
class psalmCard extends HTMLElement {
  static observedAttributes = ['number', 'section'];

  connectedCallback() {
    this.innerHTML = `
    <div class="title-box">
      <h1></h1>
    </div>
    <div class="psalm-box">
      <div class="psalm-text"></div>
    </div>`;

    if ($('.psalter')) {
      const titleButtons = document.createElement('div');
      titleButtons.classList.add('buttons');
      titleButtons.innerHTML = `
          <span class="preferences">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1.75em" fill="currentColor">
                  <path class="mid"
                        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"/>
                  <path class="top"
                        d="M18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"/>
                  <path class="bottom"
                        d="M16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                        clip-rule="evenodd"/>
              </svg>
          </span>`;
      this.querySelector('.title-box').appendChild(titleButtons);
    }

    if (localStorage.pronounCaps !== 'disabled') {
      this.classList.add('pn-caps-enabled');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'number') {

      scrollTop();

      // Get psalm and index
      const psalmNumber = this.getAttribute('number');
      const psalmIndex = +psalmNumber - 1;
      setTimeout(() => {
        this.querySelector('psalm-card .title-box h1').textContent = `Psalm ${psalmNumber}`;
      })

      if (oldValue) {
        this.querySelectorAll('nav.multi').forEach(element => {
          element.remove();
        })
        this.querySelector('.psalm-box').innerHTML = '<div class="psalm-text"></div>';
      }

      // Get verses numbers from attribute
      let psalmVerses = false;
      if (this.getAttributeNames().includes('verses')) {
        psalmVerses = [];
        let versesArray = this.getAttribute('verses').split(' ');
        if (versesArray.length === 1) {
          if (versesArray[0].includes('-')) {
            versesArray = versesArray[0].split('-');
            psalmVerses.push({start: versesArray[0], end: versesArray[1]});
          } else {
            psalmVerses.push({single: versesArray[0]})
          }
        } else {
          for (let item of versesArray) {
            if (item.includes('-')) {
              let itemVerses = item.split('-');
              psalmVerses.push({start: itemVerses[0], end: itemVerses[1]});
            } else {
              psalmVerses.push({single: item});
            }
          }
        }
      }

      // Get psalter
      fetchJSON('./src/data/psalter.json').then(psalter => {

        // Get psalm text
        let text = psalter[psalmIndex];

        // If psalm has multiple sections
        if (Array.isArray(text)) {

          if ($('.psalter')) {
            // Get psalm section references
            const references = setPsalmReferences(psalter[psalmIndex])

            // Create multi nav
            const multiTop = document.createElement('nav');
            multiTop.classList.add('multi', 'expand', 'expand-menu');
            multiTop.innerHTML = `
              <div class="title">
                  <span class="text"></span>
                  <span class="arrow"></span>
              </div>
              <div class="drop"></div>`;
            this.insertBefore(multiTop, this.querySelector('.psalm-box'));

            const multiBottom = multiTop.cloneNode(true);
            this.appendChild(multiBottom);

            // Add multi nav listeners
            this.querySelector("nav.multi:not(:last-child)").addEventListener("click", event => {
              addTransitions();
              /*
              if (!this.querySelector('nav.multi:not(:last-child)').getAttributeNames().includes('expanded')) {
                addExpanded(this.querySelector('nav.multi:not(:last-child)'));
                window.addEventListener("scroll", () => {
                  removeExpanded(this.querySelector("nav.multi:not(:last-child)"));
                }, {once: true})
              }
               */
              toggleExpandMenu();
            })

            this.querySelector("nav.multi:last-child").addEventListener("click", event => {
              addTransitions();
              if (!this.querySelector('nav.multi:last-child').getAttributeNames().includes('expanded')) {
                addExpanded(this.querySelector('nav.multi:last-child'));
                window.addEventListener("scroll", () => {
                  removeExpanded(this.querySelector("nav.multi:last-child"));
                }, {once: true})
              }
            })

            // Set current section
            if (!this.getAttributeNames().includes('section')) {
              this.setAttribute('section', '0')
            }
            const psalmSection = this.getAttribute('section');

            // Set multi nav
            this.querySelectorAll("nav.multi .text").forEach(element => {
              element.innerHTML = references[psalmSection];
            })

            this.querySelectorAll('nav.multi .drop').forEach(element => {
              element.classList.add('horizontal');
              for (let i in references) {
                const referenceElement = document.createElement('span');
                referenceElement.setAttribute('name', String(i));
                element.appendChild(referenceElement);

                if (i === +psalmSection) {
                  addActive(referenceElement);
                }

                referenceElement.innerHTML = `${references[i]}`;
                referenceElement.addEventListener("click", () => {
                  this.setAttribute('section', String(i));
                })
              }
            })

            // Get current section text
            setPsalmText(this, text[psalmSection]);

          } else if ($('.lectionary')) {

            // Find section(s) with set verses
            if (!psalmVerses) {
              for (let section of text) {
                setPsalmText(this, section);
              }
            } else {
              for (let section of text) {
                let firstVerse;
                let lastVerse;
                if (section.parts) {
                  firstVerse = +section.parts.at(0).verses.at(0).n;
                  lastVerse = +section.parts.at(-1).verses.at(-1).n;
                } else {
                  firstVerse = +section.verses.at(0).n;
                  lastVerse = +section.verses.at(-1).n;
                }

                if (findVerses(firstVerse, lastVerse, psalmVerses)) {
                  setPsalmText(this, section, psalmVerses);
                }
              }
            }
          }
        } else { // if psalm doesn't have multiple sections
          if (psalmVerses) {
            setPsalmText(this, text, psalmVerses);
          } else {
            setPsalmText(this, text);
          }
        }
      })
      
      if ($('.psalter')) {
        setPsalterNav(psalmNumber);
      }
    } else if (name === 'section' && oldValue) {

      this.querySelectorAll('nav.multi').forEach(element => {
        element.removeAttribute('expanded');
      })

      this.querySelector('.psalm-box').innerHTML = '<div class="psalm-text"></div>';

      // Set current psalm
      const psalmIndex = +this.getAttribute('number') - 1;

      // Set current section
      const psalmSection = +this.getAttribute('section');

      // Set multi nav
      this.querySelectorAll('nav.multi .drop *').forEach(element => {
        removeActive(element);
        if (element.getAttribute('name') === String(psalmSection)) {
          this.querySelector('nav.multi .text').innerText = element.textContent;
          addActive(element);
        }
      })

      // Get psalter
      fetchJSON('./src/data/psalter.json').then(psalter => {
        // Get current section text
        setPsalmText(this, psalter[psalmIndex][psalmSection]);

        if(this.querySelector('.psalm-box').getBoundingClientRect().top < 0) {
          scrollTop('smooth', this.querySelector('.psalm-box'));
        }
      })
    }
  }
}
customElements.define('psalm-card', psalmCard);

// Returns a list of verse references for a psalm with multiple sections, to enable navigation
export const setPsalmReferences = function setPsalmSectionReferences(psalm) {
  const references = []
  for (let item of psalm) {
    if (item.verses) {
      references.push(`${item.verses.at(0).n}&hairsp;–&hairsp;${item.verses.at(-1).n}`)
    } else {
      references.push(`${item.parts[0].verses.at(0).n}&hairsp;–&hairsp;${item.parts.at(-1).verses.at(-1).n}`)
    }
  }
  return references;
}

export const addPsalmContent = function addPsalmContentElements(thisPsalm, category, content) {
  
  const psalmBox = thisPsalm.querySelector('.psalm-box');
  
  if (category === "refrain") {
    
    if (Array.isArray(content)) {
      content = content.join("<br/>")
    }
    
    // Create refrains around psalm section
    const topRefrainSection = document.createElement('section');
    topRefrainSection.classList.add('refrain', 'top');
    topRefrainSection.innerHTML = `
      <h2 class="rubric">Refrain</h2>
      <h3 class="refrain-text">${content}</h3>
      `;
    if (psalmBox.querySelector('.refrain.top')) {
      psalmBox.appendChild(topRefrainSection);
      const newTextSection = document.createElement('div');
      newTextSection.classList.add('psalm-text');
      psalmBox.appendChild(newTextSection);
    } else if (psalmBox.querySelector('.heading')) {
      psalmBox.insertBefore(topRefrainSection, selectLast(psalmBox, '.heading'));
    } else {
      psalmBox.insertBefore(topRefrainSection, psalmBox.querySelector('.psalm-text'));
    }
    
    const bottomRefrainSection = document.createElement('section');
    bottomRefrainSection.classList.add('refrain', 'bottom');
    bottomRefrainSection.innerHTML = `
      <h3 class="refrain-text">${content}</h3>
      `;
    psalmBox.appendChild(bottomRefrainSection);

  } else if (category === "heading") {

    // Create heading element and add content
    const psalmHeading = document.createElement('h2');
    psalmHeading.classList.add('part-heading');
    psalmHeading.innerHTML = content;
    selectLast(psalmBox, '.psalm-text').appendChild(psalmHeading);
    
  } else if (category === "verse") {

    let psalmText = selectLast(thisPsalm, '.psalm-text');

    const verseDiv = document.createElement('div');
    verseDiv.classList.add('verse');
    verseDiv.innerHTML = '<p class="vn">' + content[0] + '</p><p class="vs"></p>';
    psalmText.appendChild(verseDiv);
    
    let verseText = selectLast(psalmBox, '.vs');
    
    if (Array.isArray(content[1])) {
      verseText.innerHTML += '<p class="vi-1">' + content[1][0] + '</p>';
      let i = 1;
      while (i < content[1].length) {
        verseText.innerHTML += '<p class="vi-3">' + content[1][i] + '</p>';
        i++;
      }
    } else {
      verseText.innerHTML += '<p class="vi-1">' + content[1] + '</p>';
    }

    if (Array.isArray(content[2])) {
      verseText.innerHTML += '<p class="vi-2">' + content[2][0] + '</p>';
      let i = 1;
      while (i < content[2].length) {
        verseText.innerHTML += '<p class="vi-3">' + content[2][i] + '</p>';
        i++;
      }
    } else {
      verseText.innerHTML += '<p class="vi-2">' + content[2] + '</p>';
    }
  }
}

export const setPsalterNav = function setPsalterMainNav(psalmNumber) {
  
  $$("nav.main .left").forEach(element => {
    if (psalmNumber > 1) {
      element.onclick = () => {
        setColors();
        $('psalm-card').setAttribute('number', String(psalmNumber - 1));
      }
      removeHidden(element);
    } else {
      addHidden(element);
    }
  })
  $$("nav.main .right").forEach(element => {
    if (psalmNumber < 150) {
      element.onclick = () => {
        setColors();
        $('psalm-card').setAttribute('number', String(+psalmNumber + 1));
      }
      removeHidden(element);
    } else {
      addHidden(element);
    }
  })
}