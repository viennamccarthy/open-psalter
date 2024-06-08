import {getPsalmParam, setPsalterButtons} from "./load.js";
import {setColors} from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  setColors();
  setPsalterButtons();
  getPsalmParam();
})