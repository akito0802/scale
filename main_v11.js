
let data;
const CATEGORIES = ["メジャー","マイナー","チャーチ","ジャズ","ブルース","民族"];

const keySel = document.getElementById("key-select");
const catSel = document.getElementById("category-select");
const scaleSel = document.getElementById("scale-select");
const outputDiv = document.getElementById("output");

fetch("scales.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    init();
  });

function init() {
  keySel.innerHTML = "";
  Object.keys(data).forEach(k => keySel.insertAdjacentHTML("beforeend", `<option value="\${k}">\${k}</option>`));
  keySel.value = "C";
  populateCategories();
}

function populateCategories() {
  catSel.innerHTML = "";
  const key = data[keySel.value];
  CATEGORIES.forEach(c => {
    const exists = key.hasOwnProperty(c);
    catSel.insertAdjacentHTML("beforeend",
      `<option value="\${c}" \${exists ? "" : "disabled"}>\${c}</option>`);
  });
  if (!key.hasOwnProperty(catSel.value)) {
    catSel.value = CATEGORIES.find(c => key.hasOwnProperty(c));
  }
  populateScales();
}

function populateScales() {
  scaleSel.innerHTML = "";
  const scalesObj = data[keySel.value][catSel.value];
  Object.keys(scalesObj).forEach(s => scaleSel.insertAdjacentHTML("beforeend", `<option value="\${s}">\${s}</option>`));
  updateOutput();
}

function updateOutput() {
  const notes = data[keySel.value][catSel.value][scaleSel.value];
  // Build table rows
  const degrees = notes.map(n => n.degree).join("</td><td>");
  const names = notes.map(n => n.name).join("</td><td>");
  outputDiv.innerHTML = \`
    <table class="note-table">
      <tr><td>\${degrees}</td></tr>
      <tr><td>\${names}</td></tr>
    </table>\`;
}

keySel.addEventListener("change", () => {
  const savedCat = catSel.value;
  const savedScale = scaleSel.value;
  populateCategories();
  if ([...catSel.options].some(o => o.value === savedCat && !o.disabled)) catSel.value = savedCat;
  populateScales();
  if ([...scaleSel.options].some(o => o.value === savedScale)) scaleSel.value = savedScale;
  updateOutput();
});
catSel.addEventListener("change", () => { populateScales(); });
scaleSel.addEventListener("change", updateOutput);
