
let data;
const CATEGORIES = ["メジャー","マイナー","チャーチ","ジャズ","ブルース","民族"];

const keySel = document.getElementById("key-select");
const catSel = document.getElementById("category-select");
const scaleSel = document.getElementById("scale-select");
const outputDiv = document.getElementById("output");
const descDiv = document.getElementById("description");

fetch("scales.json")
  .then(r => r.json())
  .then(json => { data = json; init(); });

function init() {
  keySel.innerHTML = "";
  Object.keys(data).forEach(k => keySel.insertAdjacentHTML("beforeend", `<option value="${k}">${k}</option>`));
  keySel.value = "C";
  populateCategories();
}

function populateCategories() {
  catSel.innerHTML = "";
  const keyObj = data[keySel.value];
  CATEGORIES.forEach(c => {
    const exists = keyObj.hasOwnProperty(c);
    catSel.insertAdjacentHTML("beforeend",
      `<option value="${c}" ${exists? "": "disabled"}>${c}${exists?"":" (なし)"}</option>`);
  });
  if (!keyObj.hasOwnProperty(catSel.value)) {
    catSel.value = CATEGORIES.find(c=>keyObj.hasOwnProperty(c));
  }
  populateScales();
}

function populateScales() {
  scaleSel.innerHTML = "";
  const scalesObj = data[keySel.value][catSel.value];
  Object.keys(scalesObj).forEach(s => scaleSel.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));
  updateOutput();
}

function updateOutput() {
  const notes = data[keySel.value][catSel.value][scaleSel.value];
  if(!notes){outputDiv.textContent="スケールなし";descDiv.textContent="";return;}
  const degRow = notes.map(n=>`<td>${n.degree}</td>`).join("");
  const nameRow = notes.map(n=>`<td><b>${n.name}</b></td>`).join("");
  outputDiv.innerHTML = `<table class="note-table"><tr>${degRow}</tr><tr>${nameRow}</tr></table>`;

  // description 表示（あれば）
  if (notes[0] && notes[0].description) {
    descDiv.textContent = notes[0].description;
  } else {
    descDiv.textContent = "";
  }
}

keySel.addEventListener("change", ()=>{
  const prevCat = catSel.value;
  const prevScale = scaleSel.value;
  populateCategories();
  if([...catSel.options].some(o=>o.value===prevCat&&!o.disabled)) catSel.value=prevCat;
  populateScales();
  if([...scaleSel.options].some(o=>o.value===prevScale)) scaleSel.value=prevScale;
  updateOutput();
});
catSel.addEventListener("change", ()=>{populateScales();});
scaleSel.addEventListener("change", updateOutput);
