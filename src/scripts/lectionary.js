import {$, $$, fetchJSON} from "./helpers.js";
import {addTransitions, setColors, toggleExpandMenu, closeExpandMenu} from "./ui.js";
import {setPsalterButtons} from "./load.js";

setPsalterButtons();
setColors();

// A custom element for the psalm, that will change its contents according to the attributes given
class officeContainer extends HTMLElement {
  static observedAttributes = ['day', 'psalm-set'];

  connectedCallback() {
    const params = new URLSearchParams(document.location.search);
    const office = params.get('o') || 'morning';
    const current = new Date();
    const officeTitle = `${office.charAt(0).toUpperCase()}${office.slice(1)} Prayer`;
    
    // Set office title
    if (office === 'morning') {
      $('.title-box h1').textContent = 'Morning Prayer';
    } else {
      $('.title-box h1').textContent = 'Evening Prayer';
    }

    // Get data from lectionary

    fetchJSON('./src/data/lectionary.json').then(lectionary => {
      const officeList = getOfficeList(lectionary);

      // If alternates, set up multi nav
      if (officeList.length > 1 || officeList[0].psalms0) {
        const multiNav = document.createElement('nav');
        multiNav.classList.add('multi', 'expand', 'expand-menu');
        multiNav.innerHTML = `
          <div class="title">
              <span class="text">Alternatives</span>
              <span class="arrow"></span>
          </div>
          <div class="drop vertical"></div>`;

        this.insertBefore(multiNav, $('.office-psalms'));
        
        // If alternate days, set up options to load
        if (officeList.length > 1) {
          
          for (let i in officeList) {
            const dayOptionElement = document.createElement('div');
            dayOptionElement.dataset.day = String(i);
            $('nav.multi .drop').appendChild(dayOptionElement);

            // Check if default
            if (officeList[i].default === true) {
              dayOptionElement.setAttribute('active', '');
              this.setAttribute('day', i);
              
            }

            // Add title
            dayOptionElement.innerHTML = officeList[i].redLetter ? `<div class="day">${officeList[i].redLetter}</div>`
            : officeList[i].feast ? `<div class="day">${officeList[i].feast}</div>`
            : `<div class="day">${officeTitle} on ${new Intl.DateTimeFormat("en-GB", {weekday: "long"}).format(current)}</div>`
            ;

            // If transfer details, add
            if (officeList[i].transferred) {
              dayOptionElement.innerHTML += officeList[i].transferred.case === "both" ? `<div class="details">if ${officeList[i].transferred.feast} celebrated on both days</div>`
              : !officeList[i].transferred.case ? `<div class="details">if ${officeList[i].transferred.feast} not transferred</div>`
              : `<div class="details">if ${officeList[i].transferred.feast} transferred</div>`
              ;
            }
            
            // If alternate psalms, add
            if (officeList[i].psalms0) {
              const psalmOptionsElement = addAlternates(officeList, i);
              dayOptionElement.appendChild(psalmOptionsElement);
            }

            // Set listeners to change day
            dayOptionElement.addEventListener("click", () => {
              this.setAttribute('day', i);
              setTimeout(closeExpandMenu);
            })
          }
        } else if (officeList[0].psalms0) {
          
          // If psalm set options but no day options
          const psalmOptionsElement = addAlternates(officeList, 0);
          $('nav.multi .drop').appendChild(psalmOptionsElement);
          
        }

        this.querySelector("nav.multi").addEventListener('click', event => {
          addTransitions();
          toggleExpandMenu();
        })
      } else {
        // If no options, just get psalms
        this.setAttribute('day', 0);

      }
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const params = new URLSearchParams(document.location.search);
    const office = params.get('o') || 'morning';
    const current = new Date();

    fetchJSON('./src/data/lectionary.json').then(lectionary => {
      if (oldValue) {
        this.querySelector('.office-psalms').innerHTML = '';
      }

      const officeList = getOfficeList(lectionary);
      
      if (name === 'day') {
        const dayOption = officeList[newValue];

        // Set active in multi nav
        $$('nav.multi .drop *').forEach(element => {
          if (element.dataset.day === newValue) {
            element.setAttribute('active', '');
          } else {
            element.removeAttribute('active');
          }
        })

        // Set sub title
        this.querySelector('.title-box h2').textContent = dayOption.redLetter || dayOption.feast || `${new Intl.DateTimeFormat("en-GB", {weekday: "long"}).format(current)}`

        if (dayOption.psalms0) {
          const psalmSetOption = this.getAttribute('psalm-set') || 'psalms0';
          createPsalmSet(dayOption[`${psalmSetOption}`]);
          $(`nav.multi div[data-day='${newValue}'] span[data-psalms='${psalmSetOption}']`).setAttribute('active', '');
        } else {
          createPsalmSet(dayOption.psalms);
        }
      } else if (name === 'psalm-set') {
        
      }
    })
  }
}
customElements.define('office-container', officeContainer);

const getOfficeList = function getOfficeListFromLectionary(lectionary) {
  const params = new URLSearchParams(document.location.search);
  const office = params.get('o') || 'morning';
  
  const current = new Date();
  const date = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
  console.log(date)
  //const date = '20241123'; // for testing
  
  return lectionary[date][office];
}

const createPsalmSet = function createElementsForPsalmSet(psalms_list) {
  if (!Array.isArray(psalms_list)) {
    console.log('not array')
  }
  for (let psalm of psalms_list) {
    const psalmCard = document.createElement('psalm-card');
    if (psalm.verses) {
      if (psalm.verses.length > 1) {
        const versesAttribute = [];
        for (let range of psalm.verses) {
          if (range.single) {
            versesAttribute.push(range.single);
          } else {
            versesAttribute.push(`${range.start}-${range.end}`)
          }
        }
        psalmCard.setAttribute('verses', versesAttribute.join(' '));
      } else {
        psalmCard.setAttribute('verses', `${psalm.verses[0].start}-${psalm.verses[0].end}`);
      }
    }
    psalmCard.setAttribute('number', psalm.number);
    $('.office-psalms').appendChild(psalmCard);
  }
}

const addAlternates = function addAlternatePsalmSets(officeList, dayIndex) {

  const office = officeList[dayIndex];
  
  const optionsElement = document.createElement('div');
  optionsElement.classList.add('options');

  for (let i = 0; i < 3; i++) {
    if (!office[`psalms${i}`]) {
      continue;
    }

    const psalmSetElement = document.createElement('span');
    psalmSetElement.dataset.psalms = `psalms${i}`;

    const psalmSet = [];
    for (let psalm of office[`psalms${j}`]) {
      let psalmReference = `${psalm.number}`;
      if (psalm.verses) {
        psalmReference += '.';
        for (let range of psalm.verses) {
          if (range.start) {
            if (range.end === 490) {
              psalmReference += `${range.start}-end, `;
            } else {
              psalmReference += `${range.start}-${range.end}, `;
            }
          } else {
            psalmReference += `${range.single}, `;
          }
        }
        psalmReference = psalmReference.slice(0, -2);
      }
      psalmSet.push(psalmReference);
    }
    psalmSetElement.textContent = psalmSet.join('; ');
    optionsElement.append(psalmSetElement);
  }
  $$(`nav.multi [data-day='${dayIndex}'] span`).forEach(element => {
    element.addEventListener('click', () => {
      element.setAttribute('active', '');
      $('office-container').setAttribute('psalm-set', element.dataset.psalms);
      $('office-container').setAttribute('day', dayIndex);
    })

  })
  return optionsElement;
}
