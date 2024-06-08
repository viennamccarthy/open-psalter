import {$, $$, addActive, removeActive, toCamel, toKebab} from "./helpers.js";
import {loadPreferences, savePreference} from "./prefs.js";
import {scrollTop} from "./ui.js";

export const setPreferencesPanel = function setPreferencesPanelOnLoad() {

  // Set modal button states
  if (!localStorage.divineName) {
    addActive($('.divine-name.default'));
  } else {
    addActive($(`.divine-name[data-choice="${toKebab(localStorage.divineName)}"]`));
  }
  if (!localStorage.pronouns) {
    addActive($('.pronouns.default'));
  } else {
    addActive($(`.pronouns[data-choice="${toKebab(localStorage.pronouns)}"]`));
  }
  if (!localStorage.king) {
    addActive($('.king.default'));
  } else {
    addActive($(`.king[data-choice="${toKebab(localStorage.king)}"]`));
  }
  if (localStorage.messianic === 'disabled') {
    removeActive($('.messianic'));
  }
  if (localStorage.pronounCaps === 'disabled') {
    removeActive($('.pronoun-caps'));
  }

  $('.modal-content').classList.add('pn-caps-enabled');

  // Set preview panes
  loadPreferences();

  // Set modal button listeners
  $$('.choice button').forEach(button => {
    button.addEventListener('click', () => {
      removeActive($(`.${button.dataset.option}.active`));
      addActive(button);
      savePreference(button);
    })
  })
  $$('.toggle button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('active')) {
        removeActive(button);
      } else {
        addActive(button);
      }
      savePreference(button);
    })
  })
}

export const setPreferencesPrompt = function setPromptButtonsOnLoad() {
  $("[preferences-prompt] button").addEventListener("click", () => {
    openModal('preferencesPanel');
  })
}

class modalContent {
  constructor(heading, content) {
    this.heading = heading;
    this.content = content;
  }
  appendTo(element) {
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    element.appendChild(modalContent)
    
    const headingElement = document.createElement('h2');
    headingElement.innerHTML = this.heading;
    modalContent.appendChild(headingElement);
    
    const contentElement = document.createElement('section');
    contentElement.innerHTML = this.content;
    modalContent.appendChild(contentElement);
  }
}

const modals = {};

modals['preferencesPanel'] = new modalContent('Preferences', `
  <div class="verse">
      <div class="vs">
          <p class="vi-1">I will proclaim the decree of&nbsp;<span class="def-low">God</span>;&nbsp;<span class="marker">⁕</span></p>
          <p class="vi-2"><span class="pn-sub-low">God</span> said to me: ‘You are my <span class="kg-2">Son</span>; this day have I begotten&nbsp;you.’</p>
      </div>
  </div>
  <h3>The Divine Name</h3>
  <div class="select choice">
      <button class="divine-name default" data-option="divine-name" data-choice="god">God</button>
      <button class="divine-name" data-option="divine-name" data-choice="holy-one">the Holy One</button>
      <button class="divine-name" data-option="divine-name" data-choice="tetra-latin"><span class="tetra-latin">yhwh</span></button>
      <button class="divine-name" data-option="divine-name" data-choice="tetra-hebrew"><span class="tetra-hebrew">יהוה</span></button>
  </div>
  <h3>Third-Person Pronouns</h3>
  <div class="select choice">
      <button class="pronouns default" data-option="pronouns" data-choice="god">God</button>
      <button class="pronouns" data-option="pronouns" data-choice="they-them">they/them</button>
  </div>
  <h3>The King</h3>
  <div class="select choice">
      <button class="king default" data-option="king" data-choice="messianic">Messianic</button>
      <button class="king" data-option="king" data-choice="historical">Historical</button>
      <button class="king" data-option="king" data-choice="gender-neutral">Gender neutral</button>
  </div>
  <h3>Other Options</h3>
  <div class="verse">
      <div class="vs">
          <p class="vi-1">‘<span class="ms-3">He</span> trusted in <span class="def-low">God</span>; let <span class="pn-ob-low">God</span> deliver&nbsp;<span class="ms-4">him</span>;&nbsp;<span class="marker">&nbsp;⁕</span></p>
          <p class="vi-2">let <span class="pn-ob-low">God</span> deliver <span class="ms-4">him</span>, if <span class="pn-sub-low">God</span> <span class="pn-vb-s">delights</span> in&nbsp;<span class="ms-4">him</span>.’</p>
      </div>
  </div>
  <div class="select toggle">
      <button class="messianic active" data-option="messianic">Emphasise messianic passages</button>
      <button class="pronoun-caps active" data-option="pronoun-caps">Small caps for divine third-person pronouns</button>
  </div>
`)

modals['preferencesPrompt'] = new modalContent(`You haven't set any language preferences yet.`, `
  <p>You can set or change preferences at any time by pressing the <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd"/></svg> icon in the top menu.</p>
  <button class="accept">View options now</button>
`)

modals['about'] = new modalContent('The Psalms are for <b>everyone</b>.', `
  <p>The book of Psalms in the Bible — also known as the Psalter — is the prayer book of God's people. Its songs have been prayed and sung by the Church since its earliest days. When we pray them, we become part of something bigger than ourselves.</p>
  <p>The Psalter offers us songs of joyful praise and worship, but also desperate pleas for help, and even despair and anger. The psalmist's words aren't polished and presentable — they're real.</p>
  <p>In practice, this means that some things in the Psalms can make us uncomfortable when we pray them — and rightfully so. Desire for revenge, and hopelessness, and fear of God's wrath — these prayers are messy, but they reflect very human experiences that we shouldn't try to erase.</p>
  <p>But what about when the language is excluding us from praying these prayers as members of the People of God?</p>
  <h4><span class="inline-logo"><span class="logo-1">Open</span><span class="logo-2">Psalter</span></span> is a <b>personal project</b> created for <b>private prayer</b> and <b>pastoral encouragement</b>.</h4>
  <p>It's a <b>flexible</b> adaptation of several translations to make the language about God and the psalmist more <b>expansive</b>. Instead of gendered language, options are given for common alternatives that are used in today's speech.</p>
  <p>Language preferences can be chosen and changed at any time, by accessing the <b>Preferences</b> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em"><path d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd"/></svg> pane from the navigation at the top of the screen.</p>
`)

modals['info'] = new modalContent('Information', `
  <p><span class="inline-logo flow">OpenPsalter</span> is a <i>personal project</i> created for <i>private prayer</i> and <i>pastoral encouragement</i>.</p>
  <p>The texts on this site have been heavily adapted from the Common Worship psalter, and are intended to be used by individuals in personal prayer. They should not be downloaded, printed, or used publicly without the permission of the Archbishops' Council.</p>
  <p>The Common Worship Psalter is © The Archbishops’ Council of the Church of England, 2000. Common Worship texts are available from the Church of England website:</p>
  <div class="acknowledgements">
      <a class="button" href="http://www.cofe.anglican.org/worship/liturgy/commonworship/" target="_blank">Common Worship Psalter</a>
  </div>
  <p>Additional inspiration has been drawn from the following sources:</p>
  <div class="acknowledgements">
      <a class="button" href="https://www.osh.org/prayer" target="_blank">The Saint Helena Psalter</a>
      <a class="button" href="https://wwnorton.com/books/9780393292497" target="_blank">The Hebrew Bible translation and commentary by Robert Alter</a>
      <a class="button" href="https://yptheology.org/inclusive-psalter/" target="_blank">Inclusive Language Psalter</a>
  </div>
`)

class modalCard extends HTMLElement {
  static observedAttributes = ['content', 'close'];
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'content') {
      const modalCloseTop = document.createElement('div');
      modalCloseTop.classList.add('modal-close');
      modalCloseTop.classList.add('top');
      modalCloseTop.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>`;
      this.appendChild(modalCloseTop);

      $(".modal-close.top").addEventListener("click", () => {
        closeModal('top');
      })

      const modalCloseBottom = document.createElement('div');
      modalCloseBottom.innerHTML = '<span>Close</span>';
      modalCloseBottom.classList.add('modal-close');
      modalCloseBottom.classList.add('bottom');
      this.appendChild(modalCloseBottom);

      $(".modal-close.bottom").addEventListener("click", () => {
        closeModal('bottom');
      })

      const selectedContent = toCamel(newValue);
      modals[selectedContent].appendTo(this);
      
      if (selectedContent === 'preferencesPanel') {
        setPreferencesPanel();
      } else if (selectedContent === 'preferencesPrompt') {
        setPreferencesPrompt();
      }
    } else {
      if (newValue === 'top') {
        $('.modal').removeAttribute('open');
        setTimeout(() => {
          this.remove();
        }, 500)
      } else if (newValue === 'bottom') {
        $('.modal').setAttribute('close-top', '');
        setTimeout(() => {
          $('.modal').removeAttribute('open');
          $('.modal').removeAttribute('close-top');
          scrollTop('instant', $('.modal'));
          this.remove();
        }, 500);
      }
    }
  }
  
  disconnectedCallback() {
    const newModalCard = document.createElement('modal-card');
    $('.modal').appendChild(newModalCard);
  }
}

customElements.define('modal-card', modalCard);

export const openModal = function getModalContentAndOpen(content) {
  if ($('.modal').getAttributeNames().includes('open')) {
    closeModal('bottom');
    console.log('yes')
  }
  $('modal-card').setAttribute('content', toKebab(content));
  $('.modal').setAttribute('open', '');
}

export const closeModal = function closeAndResetModal(location) {
  $('modal-card').setAttribute('close', location);
}